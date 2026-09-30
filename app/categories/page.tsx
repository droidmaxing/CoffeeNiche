import { defaultCategories } from "@/lib/data";

export default function CategoriesPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[#8a6d5d]">Menu</p>
          <h1 className="mt-2 text-3xl font-bold text-[#2c1f1a]">Kategori</h1>
        </div>
        <button className="rounded-xl bg-[#7a4a2a] px-4 py-2 text-sm font-medium text-white">Tambah Kategori</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {defaultCategories.map((category) => (
          <div key={category.id} className="rounded-2xl border border-[#efe1d1] bg-[#fffaf5] p-4 shadow-sm">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f4e9dc] text-xl text-[#7a4a2a]">☕</div>
            <h3 className="text-lg font-semibold text-[#2f231d]">{category.name}</h3>
            <p className="mt-1 text-sm text-[#7d695d]">Slug: {category.slug}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
