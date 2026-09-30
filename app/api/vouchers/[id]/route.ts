import { DiscountType, VoucherStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  code: z.string().trim().min(2).max(40).regex(/^[A-Z0-9_-]+$/),
  name: z.string().trim().min(1).max(100),
  type: z.enum(["percentage", "nominal"]),
  value: z.number().positive(),
  minPurchase: z.number().nonnegative().optional(),
  maxDiscount: z.number().positive().optional(),
  usageLimit: z.number().int().positive().optional(),
  validFrom: z.string().datetime().optional().or(z.literal("")),
  validUntil: z.string().datetime().optional().or(z.literal("")),
  isActive: z.boolean(),
});

function voucherDto(voucher: Awaited<ReturnType<typeof prisma.voucher.findUniqueOrThrow>>) {
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

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Silakan login." }, { status: 401 });
  if (session.role !== "OWNER") return NextResponse.json({ error: "Akses khusus Owner." }, { status: 403 });

  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Data voucher tidak valid." }, { status: 400 });

  const data = parsed.data;
  try {
    const voucher = await prisma.voucher.update({
      where: { id },
      data: {
        code: data.code.toUpperCase(),
        name: data.name,
        type: data.type === "percentage" ? DiscountType.PERCENTAGE : DiscountType.NOMINAL,
        value: data.value,
        minPurchase: data.minPurchase ?? null,
        maxDiscount: data.maxDiscount ?? null,
        usageLimit: data.usageLimit ?? null,
        validFrom: data.validFrom ? new Date(data.validFrom) : null,
        validUntil: data.validUntil ? new Date(data.validUntil) : null,
        isActive: data.isActive,
        status: data.isActive ? VoucherStatus.ACTIVE : VoucherStatus.INACTIVE,
      },
    });
    return NextResponse.json(voucherDto(voucher));
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "Kode voucher sudah digunakan." }, { status: 409 });
    }
    if (error instanceof Error && "code" in error && error.code === "P2025") {
      return NextResponse.json({ error: "Voucher tidak ditemukan." }, { status: 404 });
    }
    throw error;
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Silakan login." }, { status: 401 });
  if (session.role !== "OWNER") return NextResponse.json({ error: "Akses khusus Owner." }, { status: 403 });

  const { id } = await context.params;
  const result = await prisma.voucher.updateMany({
    where: { id },
    data: { isActive: false, status: VoucherStatus.INACTIVE },
  });
  if (!result.count) return NextResponse.json({ error: "Voucher tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
