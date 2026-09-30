import { demoProducts } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default function ProductsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[#8a6d5d]">Catalog</p>
          <h1 className="mt-2 text-3xl font-bold text-[#2c1f1a]">Menu</h1>
        </div>
        <button className="rounded-xl bg-[#7a4a2a] px-4 py-2 text-sm font-medium text-white">Tambah Menu</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {demoProducts.map((product) => (
          <div key={product.id} className="rounded-2xl border border-[#efe1d1] bg-[#fffaf5] p-4 shadow-sm">
            <div className="mb-4 flex h-28 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f3e3d5] to-[#edd3b1] text-4xl text-[#7a4a2a]">
              ☕
            </div>
            <div className="mb-2 flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-[#2f231d]">{product.name}</p>
                <p className="text-xs text-[#7d695d]">{product.category}</p>
              </div>
              <span className="rounded-full bg-[#f2e5d9] px-2 py-1 text-[10px] text-[#7a4a2a]">
                {product.variants ? "Variasi" : "Default"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#7a4a2a]">
                {product.variants
                  ? formatCurrency(product.variants[0]?.price ?? 0)
                  : formatCurrency(product.price ?? 0)}
              </p>
              <button className="rounded-lg border border-[#ebd9c7] bg-[#f7efe8] px-2 py-1 text-xs text-[#4b3429]">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
