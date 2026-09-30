import { StatCard } from "@/components/dashboard/stat-card";
import { formatCurrency } from "@/lib/utils";

const summary = [
  { label: "Pendapatan Hari Ini", value: formatCurrency(18400000), change: "+12.4%" },
  { label: "Transaksi", value: "248", change: "+8.1%" },
  { label: "Rata-rata Order", value: formatCurrency(74000), change: "+5.6%" },
  { label: "Produk Terjual", value: "1.420", change: "+11.9%" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[#8a6d5d]">Overview</p>
          <h1 className="mt-2 text-3xl font-bold text-[#2c1f1a]">Dashboard</h1>
        </div>
        <button className="rounded-xl bg-[#7a4a2a] px-4 py-2 text-sm font-medium text-white">Ekspor</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} change={item.change} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-[#efe1d1] bg-[#fffaf5] p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#2d221d]">Penjualan 7 Hari</h2>
            <span className="rounded-full bg-[#f4e9dc] px-2 py-1 text-xs text-[#7a4a2a]">Live</span>
          </div>
          <div className="flex h-52 items-end gap-3">
            {[42, 58, 55, 72, 68, 84, 96].map((height, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-2xl bg-gradient-to-t from-[#7a4a2a] to-[#c58b61]" style={{ height: `${height}%` }} />
                <span className="text-[10px] text-[#7d695d]">{["S", "S", "R", "K", "J", "S", "M"][index]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#efe1d1] bg-[#fffaf5] p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-[#2d221d]">Top Menu</h2>
          <div className="space-y-4">
            {[
              ["Hot Coffee Latte", "320 pcs", "Rp 11.200.000"],
              ["Cappuccino", "274 pcs", "Rp 9.800.000"],
              ["Chocolate Cake", "198 pcs", "Rp 4.950.000"],
            ].map(([name, sold, revenue]) => (
              <div key={name} className="flex items-center justify-between border-b border-[#f1e2d5] pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-[#372721]">{name}</p>
                  <p className="text-xs text-[#7d695d]">{sold}</p>
                </div>
                <p className="text-sm font-semibold text-[#7a4a2a]">{revenue}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
