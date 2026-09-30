import { DiscountType, VoucherStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const validationSchema = z.object({
  code: z.string().trim().min(2).max(40),
  subtotal: z.number().nonnegative(),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Silakan login." }, { status: 401 });
  const body = await request.json().catch(() => null);
  const parsed = validationSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Kode voucher tidak valid." }, { status: 400 });

  const now = new Date();
  const voucher = await prisma.voucher.findFirst({
    where: {
      code: parsed.data.code.toUpperCase(),
      isActive: true,
      status: VoucherStatus.ACTIVE,
      AND: [
        { OR: [{ validFrom: null }, { validFrom: { lte: now } }] },
        { OR: [{ validUntil: null }, { validUntil: { gte: now } }] },
      ],
    },
  });
  if (!voucher) return NextResponse.json({ error: "Voucher tidak aktif atau sudah kedaluwarsa." }, { status: 404 });
  if (voucher.usageLimit !== null && voucher.usedCount >= voucher.usageLimit) {
    return NextResponse.json({ error: "Kuota voucher sudah habis." }, { status: 400 });
  }
  if (voucher.minPurchase !== null && parsed.data.subtotal < Number(voucher.minPurchase)) {
    return NextResponse.json({ error: "Subtotal belum memenuhi minimal pembelian voucher." }, { status: 400 });
  }

  const type = voucher.type === DiscountType.PERCENTAGE ? "percentage" : "nominal";
  let discount = type === "percentage"
    ? parsed.data.subtotal * (Number(voucher.value) / 100)
    : Number(voucher.value);
  if (voucher.maxDiscount !== null) discount = Math.min(discount, Number(voucher.maxDiscount));
  discount = Math.min(Math.round(discount), parsed.data.subtotal);

  return NextResponse.json({
    id: voucher.id,
    code: voucher.code,
    name: voucher.name,
    type,
    value: Number(voucher.value),
    minPurchase: voucher.minPurchase === null ? undefined : Number(voucher.minPurchase),
    maxDiscount: voucher.maxDiscount === null ? undefined : Number(voucher.maxDiscount),
    usageLimit: voucher.usageLimit ?? undefined,
    usedCount: voucher.usedCount,
    isActive: voucher.isActive,
    status: voucher.status,
    validFrom: voucher.validFrom?.toISOString(),
    validUntil: voucher.validUntil?.toISOString(),
    discount,
  });
}
