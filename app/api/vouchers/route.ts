import { DiscountType, VoucherStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const voucherSchema = z.object({
  code: z.string().trim().min(2).max(40).regex(/^[A-Z0-9_-]+$/),
  name: z.string().trim().min(1).max(100),
  type: z.enum(["percentage", "nominal"]),
  value: z.number().positive(),
  minPurchase: z.number().nonnegative().optional(),
  maxDiscount: z.number().positive().optional(),
  usageLimit: z.number().int().positive().optional(),
  validFrom: z.string().datetime().optional().or(z.literal("")),
  validUntil: z.string().datetime().optional().or(z.literal("")),
});

function voucherDto(voucher: Awaited<ReturnType<typeof prisma.voucher.findMany>>[number]) {
  return {
    id: voucher.id,
    code: voucher.code,
    name: voucher.name,
    type: voucher.type === DiscountType.PERCENTAGE ? "percentage" as const : "nominal" as const,
    value: Number(voucher.value),
    minPurchase: voucher.minPurchase === null ? undefined : Number(voucher.minPurchase),
    maxDiscount: voucher.maxDiscount === null ? undefined : Number(voucher.maxDiscount),
    usageLimit: voucher.usageLimit ?? undefined,
    usedCount: voucher.usedCount,
    isActive: voucher.isActive,
    status: voucher.status,
    validFrom: voucher.validFrom?.toISOString(),
    validUntil: voucher.validUntil?.toISOString(),
  };
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Silakan login." }, { status: 401 });

  const vouchers = await prisma.voucher.findMany({
    where: { status: VoucherStatus.ACTIVE, isActive: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(vouchers.map(voucherDto));
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Silakan login." }, { status: 401 });
  if (session.role !== "OWNER") return NextResponse.json({ error: "Akses khusus Owner." }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = voucherSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Data voucher tidak valid.", details: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  try {
    const voucher = await prisma.voucher.create({
      data: {
        code: data.code.toUpperCase(),
        name: data.name,
        type: data.type === "percentage" ? DiscountType.PERCENTAGE : DiscountType.NOMINAL,
        value: data.value,
        minPurchase: data.minPurchase,
        maxDiscount: data.maxDiscount,
        usageLimit: data.usageLimit,
        validFrom: data.validFrom ? new Date(data.validFrom) : null,
        validUntil: data.validUntil ? new Date(data.validUntil) : null,
        createdById: session.userId,
      },
    });
    return NextResponse.json(voucherDto(voucher), { status: 201 });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "Kode voucher sudah digunakan." }, { status: 409 });
    }
    throw error;
  }
}
