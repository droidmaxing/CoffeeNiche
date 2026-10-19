import assert from "node:assert/strict";
import test from "node:test";
import { DiscountType } from "@prisma/client";
import { voucherDiscount } from "../lib/voucher";

const percentage = (value: number, maxDiscount: number | null = null) => ({
  type: DiscountType.PERCENTAGE,
  value,
  maxDiscount,
});

const nominal = (value: number, maxDiscount: number | null = null) => ({
  type: DiscountType.NOMINAL,
  value,
  maxDiscount,
});

test("diskon persentase dibatasi maxDiscount", () => {
  assert.equal(voucherDiscount(percentage(10), 50_000), 5_000);
  assert.equal(voucherDiscount(percentage(50, 10_000), 50_000), 10_000);
});

test("diskon nominal dan pembulatan pecahan", () => {
  assert.equal(voucherDiscount(nominal(7_500), 50_000), 7_500);
  assert.equal(voucherDiscount(percentage(15), 33_333), 5_000);
});

test("diskon tidak pernah melebihi subtotal", () => {
  assert.equal(voucherDiscount(nominal(100_000), 40_000), 40_000);
  assert.equal(voucherDiscount(percentage(200), 10_000), 10_000);
});