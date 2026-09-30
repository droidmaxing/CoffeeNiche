import { formatCurrency } from "@/lib/utils";

const reportRows = [
  { label: "Penjualan Hari Ini", value: formatCurrency(18400000) },
  { label: "Diskon", value: formatCurrency(1200000) },
  { label: "Keuntungan Bersih", value: formatCurrency(7200000) },
  { label: "Jumlah Order", value: "248" },
  { label: "Refund/Void", value: "4" },
];

export default function ReportsPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[#2c1f1a]">Laporan</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reportRows.map((row) => (
          <div key={row.label} className="rounded-2xl border border-[#efe1d1] bg-[#fffaf5] p-5 shadow-sm">
            <p className="text-sm text-[#7d695d]">{row.label}</p>
            <p className="mt-3 text-2xl font-bold text-[#2f231d]">{row.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
