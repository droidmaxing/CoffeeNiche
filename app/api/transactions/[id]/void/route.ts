import { TransactionStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Silakan login." }, { status: 401 });

  const { id } = await context.params;
  try {
    const transaction = await prisma.$transaction(async (tx) => {
      const updated = await tx.transaction.updateMany({
        where: { id, status: TransactionStatus.PAID },
        data: { status: TransactionStatus.VOID },
      });
      if (!updated.count) return null;
      const record = await tx.transaction.findUnique({ where: { id }, select: { transactionCode: true, storeId: true } });
      await tx.auditLog.create({
        data: {
          userId: session.userId,
          storeId: record?.storeId,
          action: "VOID",
          entity: "Transaction",
          details: JSON.stringify({ transactionCode: record?.transactionCode }),
        },
      });
      return record;
    });
    if (!transaction) return NextResponse.json({ error: "Transaksi tidak ditemukan atau sudah dibatalkan." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Transaction void failed:", error);
    return NextResponse.json({ error: "Pembatalan transaksi gagal." }, { status: 500 });
  }
}
