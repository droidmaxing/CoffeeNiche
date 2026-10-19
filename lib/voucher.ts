import { DiscountType } from "@prisma/client";

type VoucherRule = {
  type: DiscountType;
  value: unknown;
  maxDiscount: unknown;
};

/**
 * Diskon voucher dalam rupiah: persentase dihitung dari subtotal, dibatasi
 * `maxDiscount` (bila ada), dibulatkan, dan tidak pernah melebihi subtotal.
 * Dipakai bersama oleh POST /api/vouchers/validate dan POST /api/transactions
 * agar nominal di pratinjau sama dengan nominal yang dicatat.
 */
export function voucherDiscount(voucher: VoucherRule, subtotal: number): number {
  const raw =
    voucher.type === DiscountType.PERCENTAGE
      ? subtotal * (Number(voucher.value) / 100)
      : Number(voucher.value);
  const capped =
    voucher.maxDiscount === null ? raw : Math.min(raw, Number(voucher.maxDiscount));
  return Math.min(Math.round(capped), subtotal);
}