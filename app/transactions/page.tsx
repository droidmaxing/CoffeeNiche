"use client";

import { usePosStore } from "@/stores/pos-store";
import { Search, SlidersHorizontal, Plus, Minus, Trash2, CreditCard, Percent, Wallet, Ticket, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function TransactionsPage() {
  const { categories, products, selectedCategory, setSelectedCategory, setSearch, search, cart, addToCart, updateQuantity, removeItem, appliedVoucher, applyVoucher, removeVoucher, paymentMethod, setPaymentMethod } = usePosStore();

  const filteredProducts = products.filter((product) => {
    const byCategory = selectedCategory === "all" || product.categoryId === selectedCategory;
    const bySearch = !search || product.name.toLowerCase().includes(search.toLowerCase());
    return byCategory && bySearch;
  });

  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  let discountValue = 0;
  if (appliedVoucher) {
    if (appliedVoucher.type === "percentage") {
      discountValue = subtotal * (appliedVoucher.value / 100);
      if (appliedVoucher.maxDiscount && discountValue > appliedVoucher.maxDiscount) {
        discountValue = appliedVoucher.maxDiscount;
      }
    } else {
      discountValue = appliedVoucher.value;
    }
  }
  const total = Math.max(subtotal - discountValue, 0);

  const handleVoucherApply = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const code = formData.get("voucherCode") as string;
    if (code && applyVoucher(code)) {
      (e.currentTarget as HTMLFormElement).reset();
    } else {
      alert("Voucher tidak valid atau tidak memenuhi syarat");
    }
  };

  return (
    <div className="flex h-full gap-6 p-6">
      <div className="flex-1 space-y-5">
        <div className="rounded-2xl border border-[#efe1d1] bg-[#fffaf5] p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3 rounded-xl border border-[#eadcc8] bg-[#f9f1ea] px-3 py-2 text-[#635349]">
              <Search className="h-4 w-4" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari produk"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#8d7366] lg:w-64"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-[#5f4438]">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filter</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`rounded-full px-3 py-1.5 text-sm ${selectedCategory === "all" ? "bg-[#7a4a2a] text-white" : "bg-[#f5eae0] text-[#4b3429]"}`}
            >
              Semua
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-full px-3 py-1.5 text-sm ${selectedCategory === category.id ? "bg-[#7a4a2a] text-white" : "bg-[#f5eae0] text-[#4b3429]"}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => addToCart(product, product.variants?.[0]?.id)}
              className="rounded-2xl border border-[#efe1d1] bg-[#fffaf5] p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-4 flex h-32 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f3e3d5] to-[#edd3b1] text-4xl text-[#7a4a2a]">
                ☕
              </div>
              <div className="mb-2 flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-[#2f231d]">{product.name}</p>
                  <p className="text-xs text-[#7d695d]">{product.category}</p>
                </div>
                <span className="rounded-full bg-[#f2e5d9] px-2 py-1 text-xs text-[#7a4a2a]">
                  {product.variants ? `${product.variants.length} varian` : "Default"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#7a4a2a]">
                  {product.variants
                    ? formatCurrency(product.variants[0]?.price ?? 0)
                    : formatCurrency(product.price ?? 0)}
                </p>
                <span className="inline-flex items-center gap-1 rounded-lg bg-[#7a4a2a] px-2 py-1 text-xs text-white">
                  <Plus className="h-3 w-3" />
                  Tambah
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <aside className="w-[370px] rounded-3xl border border-[#efe1d1] bg-[#fffaf5] p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#2d221d]">Cart</h2>
          <span className="rounded-full bg-[#f3e7db] px-2 py-1 text-xs text-[#7a4a2a]">{cart.length} item</span>
        </div>

        <div className="space-y-3">
          {cart.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#ddc6ad] bg-[#f9f3ec] p-6 text-center text-sm text-[#7d695d]">
              Keranjang masih kosong.
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="rounded-2xl border border-[#f1e1d3] bg-[#fdf7f2] p-3">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-[#2f231d]">{item.productName}</p>
                    <p className="text-xs text-[#7d695d]">
                      {item.variantName ? `Variant: ${item.variantName}` : "Default"}
                    </p>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-[#8d5d4a]">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-full border border-[#e7d4bd] bg-white px-2 py-1">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-[#7a4a2a]">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="min-w-6 text-center text-sm font-medium text-[#2f231d]">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-[#7a4a2a]">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-[#2b201d]">{formatCurrency(item.subtotal)}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-5 space-y-3 rounded-2xl border border-[#efe1d1] bg-[#f7efe8] p-3">
          <div className="flex items-center justify-between text-sm text-[#584238]">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-[#584238]">
            <span>Diskon</span>
            <span>-{formatCurrency(discountValue)}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-[#584238]">
            <span>Pajak</span>
            <span>{formatCurrency(0)}</span>
          </div>

          <div className="rounded-xl bg-white p-3">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#3b2c26]">
              <Ticket className="h-4 w-4" />
              Voucher
            </div>
            {appliedVoucher ? (
              <div className="flex items-center justify-between rounded-lg bg-[#eaf7ef] px-3 py-2 text-sm text-[#2d7a46]">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{appliedVoucher.name}</span>
                  <span className="rounded-full bg-[#2d7a46] px-2 py-0.5 text-xs text-white">
                    {appliedVoucher.type === "percentage" ? `${appliedVoucher.value}%` : formatCurrency(appliedVoucher.value)}
                  </span>
                </div>
                <button onClick={removeVoucher} className="text-[#2d7a46]">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleVoucherApply} className="flex gap-2">
                <input
                  name="voucherCode"
                  placeholder="Masukkan kode voucher"
                  className="flex-1 rounded-xl border border-[#eadcc8] bg-[#f9f3ec] px-3 py-2 text-sm outline-none"
                />
                <button type="submit" className="rounded-xl bg-[#7a4a2a] px-3 py-2 text-sm font-medium text-white">
                  Terapkan
                </button>
              </form>
            )}
          </div>

          <div className="rounded-xl bg-white p-3">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#3b2c26]">
              <Wallet className="h-4 w-4" />
              Pembayaran
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['Cash', 'QRIS', 'Debit', 'E-Wallet'].map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`rounded-lg px-2 py-2 ${paymentMethod === method ? "bg-[#7a4a2a] text-white" : "bg-[#f5eae0] text-[#4b3429]"}`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 border-t border-[#eeddc7] pt-4">
          <div className="mb-3 flex items-center justify-between text-lg font-bold text-[#2d221d]">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#7a4a2a] px-4 py-3 text-sm font-semibold text-white shadow-sm">
            <CreditCard className="h-4 w-4" />
            Checkout
          </button>
        </div>
      </aside>
    </div>
  );
}
