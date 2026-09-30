import { transactionsHistory } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default function TransactionHistoryPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-[#8a6d5d]">Transactions</p>
        <h1 className="mt-2 text-3xl font-bold text-[#2c1f1a]">Riwayat Transaksi</h1>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#efe1d1] bg-[#fffaf5] shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#f8efe8] text-[#614d43]">
            <tr>
              <th className="px-4 py-3">No. Transaksi</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Waktu</th>
              <th className="px-4 py-3">Pembayaran</th>
            </tr>
          </thead>
          <tbody>
            {transactionsHistory.map((transaction) => (
              <tr key={transaction.id} className="border-t border-[#f0e5dc]">
                <td className="px-4 py-3 font-medium text-[#2d221d]">{transaction.id}</td>
                <td className="px-4 py-3 text-[#5a4036]">{transaction.customer}</td>
                <td className="px-4 py-3 font-semibold text-[#7a4a2a]">{formatCurrency(transaction.total)}</td>
                <td className="px-4 py-3 text-[#5a4036]">{transaction.time}</td>
                <td className="px-4 py-3 text-[#5a4036]">{transaction.payment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
