import { ArrowUpRight, TrendingUp } from "lucide-react";

export function StatCard({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change: string;
}) {
  return (
    <div className="rounded-2xl border border-[#efe1d1] bg-[#fffaf5] p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-[#7d695d]">{label}</p>
        <div className="rounded-full bg-[#f4e9dc] p-2 text-[#7a4a2a]">
          <TrendingUp className="h-4 w-4" />
        </div>
      </div>
      <div className="mb-3 text-3xl font-bold text-[#2f211b]">{value}</div>
      <div className="flex items-center gap-2 text-xs text-[#5d4439]">
        <span className="inline-flex items-center rounded-full bg-[#eaf7ef] px-2 py-1 text-[#2d7a46]">
          <ArrowUpRight className="mr-1 h-3 w-3" />
          {change}
        </span>
      </div>
    </div>
  );
}
