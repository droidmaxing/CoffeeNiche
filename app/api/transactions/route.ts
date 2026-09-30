import { DiscountType, TransactionStatus, VoucherStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const checkoutSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1),
    variantId: z.string().optional(),
    quantity: z.number().int().min(1).max(100),
    modifierIds: z.array(z.string()).default([]),
  })).min(1),
  paymentMethod: z.enum(["Cash", "QRIS", "Debit", "E-Wallet"]),
  voucherCode: z.string().trim().max(40).optional(),
  customerName: z.string().trim().max(120).optional(),
});

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return jsonError("Silakan login.", 401);

  const body = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) return jsonError("Data checkout tidak valid.", 400);

  try {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findFirst({
        where: { id: session.userId, status: "ACTIVE" },
        select: { id: true, storeId: true },
      });
      if (!user) throw new Error("SESSION_USER_INACTIVE");

      const productIds = [...new Set(parsed.data.items.map((item) => item.productId))];
      const products = await tx.product.findMany({
        where: { id: { in: productIds }, status: "ACTIVE" },
        include: { category: true, variants: { where: { status: "ACTIVE" } }, modifiers: { where: { status: "ACTIVE" } } },
      });
      const productMap = new Map(products.map((product) => [product.id, product]));
      const snapshots = parsed.data.items.map((item) => {
        const product = productMap.get(item.productId);
        if (!product) throw new Error("PRODUCT_UNAVAILABLE");
        const variant = item.variantId
          ? product.variants.find((candidate) => candidate.id === item.variantId)
          : product.variants.find((candidate) => candidate.isDefault);
        if (!variant) throw new Error("VARIANT_UNAVAILABLE");
        const modifiers = item.modifierIds.map((id) => {
          const modifier = product.modifiers.find((candidate) => candidate.id === id);
          if (!modifier) throw new Error("MODIFIER_UNAVAILABLE");
          return { id: modifier.id, name: modifier.name, price: Number(modifier.price) };
        });
        const unitPrice = Number(variant.price);
        const unitModifiers = modifiers.reduce((total, modifier) => total + modifier.price, 0);
        return {
          productId: product.id,
          variantId: variant.id,
          productName: product.name,
          variantName: variant.name,
          categoryName: product.category?.name ?? null,
          unitPrice,
          modifiers,
          quantity: item.quantity,
          subtotal: (unitPrice + unitModifiers) * item.quantity,
        };
      });

      const subtotal = snapshots.reduce((sum, item) => sum + item.subtotal, 0);
      let voucher = null;
      let discount = 0;
      if (parsed.data.voucherCode) {
        voucher = await tx.voucher.findFirst({
          where: {
            code: parsed.data.voucherCode.toUpperCase(),
            isActive: true,
            status: VoucherStatus.ACTIVE,
            AND: [
              { OR: [{ validFrom: null }, { validFrom: { lte: new Date() } }] },
              { OR: [{ validUntil: null }, { validUntil: { gte: new Date() } }] },
            ],
          },
        });
        if (!voucher) throw new Error("VOUCHER_UNAVAILABLE");
        if (voucher.usageLimit !== null && voucher.usedCount >= voucher.usageLimit) throw new Error("VOUCHER_EXHAUSTED");
        if (voucher.minPurchase && subtotal < Number(voucher.minPurchase)) throw new Error("VOUCHER_MINIMUM");
        discount = voucher.type === DiscountType.PERCENTAGE
          ? subtotal * (Number(voucher.value) / 100)
          : Number(voucher.value);
        if (voucher.maxDiscount !== null) discount = Math.min(discount, Number(voucher.maxDiscount));
        discount = Math.min(Math.round(discount), subtotal);

        if (voucher.usageLimit !== null) {
          const usage = await tx.voucher.updateMany({
            where: { id: voucher.id, usedCount: { lt: voucher.usageLimit } },
            data: { usedCount: { increment: 1 } },
          });
          if (usage.count !== 1) throw new Error("VOUCHER_EXHAUSTED");
        } else {
          await tx.voucher.update({ where: { id: voucher.id }, data: { usedCount: { increment: 1 } } });
        }
      }

      const code = `CN-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
      const transaction = await tx.transaction.create({
        data: {
          storeId: user.storeId,
          transactionCode: code,
          userId: user.id,
          customerName: parsed.data.customerName || null,
          status: TransactionStatus.PAID,
          subtotal,
          discount,
          serviceCharge: 0,
          tax: 0,
          total: subtotal - discount,
          paymentMethod: parsed.data.paymentMethod,
          voucherId: voucher?.id,
          voucherCodeSnapshot: voucher?.code,
          voucherNameSnapshot: voucher?.name,
          items: {
            create: snapshots.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              productName: item.productName,
              variantName: item.variantName,
              categoryName: item.categoryName,
              unitPrice: item.unitPrice,
              modifier: item.modifiers,
              discount: 0,
              quantity: item.quantity,
              subtotal: item.subtotal,
            })),
          },
        },
        include: { items: true },
      });

      await tx.auditLog.create({
        data: {
          storeId: user.storeId,
          userId: user.id,
          action: "CHECKOUT",
          entity: "Transaction",
          details: JSON.stringify({ transactionCode: code, total: subtotal - discount }),
        },
      });

      return transaction;
    });

    return NextResponse.json({
      id: result.id,
      transactionCode: result.transactionCode,
      total: Number(result.total),
      status: result.status,
    }, { status: 201 });
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    if (code === "SESSION_USER_INACTIVE") return jsonError("Akun tidak aktif. Silakan login kembali.", 401);
    if (code === "PRODUCT_UNAVAILABLE" || code === "VARIANT_UNAVAILABLE" || code === "MODIFIER_UNAVAILABLE") return jsonError("Produk, varian, atau modifier sudah tidak tersedia.", 400);
    if (code === "VOUCHER_UNAVAILABLE" || code === "VOUCHER_EXHAUSTED") return jsonError("Voucher tidak aktif, kedaluwarsa, atau kuotanya habis.", 400);
    if (code === "VOUCHER_MINIMUM") return jsonError("Subtotal belum memenuhi minimal pembelian voucher.", 400);
    console.error("Checkout failed:", error);
    return jsonError("Checkout gagal karena kesalahan server.", 500);
  }
}
