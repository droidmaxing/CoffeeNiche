"use client";

import { Bell, Search, Plus, CalendarDays } from "lucide-react";

export function TopBar() {
  return (
    <header className="flex items-center justify-between border-b border-[#eee0d0] bg-[#fffaf5] px-6 py-4">
      <div className="flex items-center gap-3 rounded-xl border border-[#eddcc8] bg-[#f8f0ea] px-3 py-2 text-sm text-[#6b5247]">
        <Search className="h-4 w-4" />
        <input
          aria-label="Search"
          placeholder="Cari produk, customer, transaksi..."
          className="w-72 bg-transparent text-sm text-[#3f2a21] outline-none placeholder:text-[#8d7366]"
        />
      </div>

      <div className="flex items-center gap-3">
        <button className="rounded-xl border border-[#eadbc5] bg-[#f7efe8] p-2 text-[#5f4438]">
          <Bell className="h-4 w-4" />
        </button>
        <button className="inline-flex items-center gap-2 rounded-xl bg-[#7a4a2a] px-4 py-2 text-sm font-medium text-white shadow-sm">
          <Plus className="h-4 w-4" />
          Transaksi Baru
        </button>
        <div className="flex items-center gap-2 rounded-xl border border-[#eadbc5] bg-[#f7efe8] px-3 py-2 text-sm text-[#5f4438]">
          <CalendarDays className="h-4 w-4" />
          <span>30 Sep 2026</span>
        </div>
      </div>
    </header>
  );
}
