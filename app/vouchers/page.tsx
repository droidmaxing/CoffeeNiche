"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Ticket, Check, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { demoVoucherOptions } from "@/stores/pos-store";
import type { Voucher } from "@/types";

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>(demoVoucherOptions);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    type: "percentage" as "percentage" | "nominal",
    value: 0,
    minPurchase: 0,
    maxDiscount: 0,
    usageLimit: 0,
    validFrom: "",
    validUntil: "",
  });

  useEffect(() => {
    fetch("/api/vouchers")
      .then(async (response) => {
        if (!response.ok) throw new Error("Gagal memuat data voucher dari database.");
        setVouchers(await response.json());
      })
      .catch((error: unknown) => setLoadError(error instanceof Error ? error.message : "Gagal memuat voucher."))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError("");
    const payload = {
      code: formData.code,
      name: formData.name,
      type: formData.type,
      value: formData.value,
      minPurchase: formData.minPurchase || undefined,
      maxDiscount: formData.maxDiscount || undefined,
      usageLimit: formData.usageLimit || undefined,
      validFrom: formData.validFrom ? new Date(`${formData.validFrom}T00:00:00.000Z`).toISOString() : "",
      validUntil: formData.validUntil ? new Date(`${formData.validUntil}T23:59:59.999Z`).toISOString() : "",
      isActive: editingVoucher?.isActive ?? true,
    };
    try {
      const response = await fetch(editingVoucher ? `/api/vouchers/${editingVoucher.id}` : "/api/vouchers", {
        method: editingVoucher ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        setSaveError(result.error ?? "Tidak dapat menyimpan voucher.");
        return;
      }
      setVouchers((current) =>
        editingVoucher
          ? current.map((voucher) => voucher.id === editingVoucher.id ? result as Voucher : voucher)
          : [result as Voucher, ...current],
      );
    } catch {
      setSaveError("Tidak dapat menghubungi server. Coba lagi.");
      return;
    }
    setShowForm(false);
    setEditingVoucher(null);
    setFormData({ code: "", name: "", type: "percentage", value: 0, minPurchase: 0, maxDiscount: 0, usageLimit: 0, validFrom: "", validUntil: "" });
  };

  const handleEdit = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    setFormData({
      code: voucher.code,
      name: voucher.name,
      type: voucher.type,
      value: voucher.value,
      minPurchase: voucher.minPurchase ?? 0,
      maxDiscount: voucher.maxDiscount ?? 0,
      usageLimit: voucher.usageLimit ?? 0,
      validFrom: voucher.validFrom ? new Date(voucher.validFrom).toISOString().split("T")[0] : "",
      validUntil: voucher.validUntil ? new Date(voucher.validUntil).toISOString().split("T")[0] : "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Hapus voucher ini?")) {
      const response = await fetch(`/api/vouchers/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const result = await response.json();
        setLoadError(result.error ?? "Tidak dapat menonaktifkan voucher.");
        return;
      }
      setVouchers((current) => current.filter((voucher) => voucher.id !== id));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingVoucher(null);
    setFormData({ code: "", name: "", type: "percentage", value: 0, minPurchase: 0, maxDiscount: 0, usageLimit: 0, validFrom: "", validUntil: "" });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[#8a6d5d]">Promosi</p>
          <h1 className="mt-2 text-3xl font-bold text-[#2c1f1a]">Voucher</h1>
        </div>
        <button onClick={() => { setEditingVoucher(null); setShowForm(true); }} className="inline-flex items-center gap-2 rounded-xl bg-[#7a4a2a] px-4 py-2 text-sm font-medium text-white">
          <Plus className="h-4 w-4" />
          Buat Voucher
        </button>
      </div>

      {loadError && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{loadError}</p>}
      {loading && <p className="text-sm text-[#7d695d]">Memuat voucher...</p>}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#efe1d1] bg-[#fffaf5] p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-semibold text-[#2d221d]">{editingVoucher ? "Edit Voucher" : "Buat Voucher Baru"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-[#5d4439]">Kode Voucher</label>
                <input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="mt-1 w-full rounded-xl border border-[#eadcc8] bg-[#f9f3ec] px-3 py-2 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[#5d4439]">Nama Voucher</label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#eadcc8] bg-[#f9f3ec] px-3 py-2 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[#5d4439]">Tipe</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as "percentage" | "nominal" })}
                  className="mt-1 w-full rounded-xl border border-[#eadcc8] bg-[#f9f3ec] px-3 py-2 outline-none"
                >
                  <option value="percentage">Persentase</option>
                  <option value="nominal">Nominal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#5d4439]">Nilai</label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xl border border-[#eadcc8] bg-[#f9f3ec] px-3 py-2 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[#5d4439]">Min. Pembelian (opsional)</label>
                <input
                  type="number"
                  value={formData.minPurchase}
                  onChange={(e) => setFormData({ ...formData, minPurchase: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xl border border-[#eadcc8] bg-[#f9f3ec] px-3 py-2 outline-none"
                />
              </div>
              {formData.type === "percentage" && (
                <div>
                  <label className="block text-sm text-[#5d4439]">Max Diskon (opsional)</label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-[#eadcc8] bg-[#f9f3ec] px-3 py-2 outline-none"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm text-[#5d4439]">Batas Penggunaan (opsional)</label>
                <input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xl border border-[#eadcc8] bg-[#f9f3ec] px-3 py-2 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#5d4439]">Berlaku Dari</label>
                  <input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#eadcc8] bg-[#f9f3ec] px-3 py-2 outline-none"
                  />
                </div>
                {saveError && <p role="alert" className="text-sm text-red-700">{saveError}</p>}
                <div>
                  <label className="block text-sm text-[#5d4439]">Berlaku Sampai</label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#eadcc8] bg-[#f9f3ec] px-3 py-2 outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={handleCancel} className="flex-1 rounded-xl border border-[#eadcc8] bg-[#f9f3ec] px-4 py-2 text-sm font-medium text-[#4b3429]">Batal</button>
                <button type="submit" className="flex-1 rounded-xl bg-[#7a4a2a] px-4 py-2 text-sm font-medium text-white">{editingVoucher ? "Update" : "Simpan"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!loading && !vouchers.length && <p className="rounded-xl bg-[#fffaf5] p-6 text-sm text-[#7d695d]">Belum ada voucher aktif.</p>}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {vouchers.map((voucher) => (
          <div key={voucher.id} className="rounded-2xl border border-[#efe1d1] bg-[#fffaf5] p-5 shadow-sm">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4e9dc] text-xl text-[#7a4a2a]">
                  <Ticket className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-[#2f231d]">{voucher.name}</p>
                  <p className="text-xs text-[#7d695d]">Kode: {voucher.code}</p>
                </div>
              </div>
              <span className={`rounded-full px-2 py-1 text-[10px] font-medium ${voucher.status === "ACTIVE" ? "bg-[#eaf7ef] text-[#2d7a46]" : "bg-[#fef0f0] text-[#c0392b]"}`}>
                {voucher.status}
              </span>
            </div>

            <div className="mb-3 space-y-2 text-sm text-[#5d4439]">
              <div className="flex justify-between">
                <span>Tipe</span>
                <span className="font-medium">{voucher.type === "percentage" ? `${voucher.value}%` : formatCurrency(voucher.value)}</span>
              </div>
              {voucher.minPurchase && (
                <div className="flex justify-between">
                  <span>Min. Belanja</span>
                  <span className="font-medium">{formatCurrency(voucher.minPurchase)}</span>
                </div>
              )}
              {voucher.maxDiscount && (
                <div className="flex justify-between">
                  <span>Max Diskon</span>
                  <span className="font-medium">{formatCurrency(voucher.maxDiscount)}</span>
                </div>
              )}
              {voucher.usageLimit && (
                <div className="flex justify-between">
                  <span>Terpakai</span>
                  <span className="font-medium">{voucher.usedCount} / {voucher.usageLimit}</span>
                </div>
              )}
              {voucher.validFrom && (
                <div className="flex justify-between">
                  <span>Berlaku</span>
                  <span className="font-medium">{new Date(voucher.validFrom).toLocaleDateString("id-ID")} - {voucher.validUntil ? new Date(voucher.validUntil).toLocaleDateString("id-ID") : "Tidak terbatas"}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button onClick={() => handleEdit(voucher)} className="flex-1 rounded-lg border border-[#eadcc8] bg-[#f9f3ec] px-3 py-1.5 text-xs font-medium text-[#4b3429]">
                <Edit className="mr-1 h-3 w-3" />
                Edit
              </button>
              <button onClick={() => handleDelete(voucher.id)} className="flex-1 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-3 py-1.5 text-xs font-medium text-[#c0392b]">
                <Trash2 className="mr-1 h-3 w-3" />
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}