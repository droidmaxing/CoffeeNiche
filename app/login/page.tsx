export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5efe9] p-6">
      <div className="w-full max-w-md rounded-3xl border border-[#efe1d1] bg-[#fffaf5] p-6 shadow-lg shadow-[#efe0d1]">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#7a4a2a] text-3xl text-[#f9f1ea]">☕</div>
          <h1 className="text-3xl font-bold text-[#2e221d]">CoffeeNiche</h1>
          <p className="mt-2 text-sm text-[#7d695d]">Masuk ke sistem kasir cafe</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-[#5d4439]">Email</label>
            <input className="w-full rounded-xl border border-[#eadcc8] bg-[#f9f3ec] px-3 py-2.5 outline-none" defaultValue="owner@coffeeniche.id" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-[#5d4439]">Password</label>
            <input type="password" className="w-full rounded-xl border border-[#eadcc8] bg-[#f9f3ec] px-3 py-2.5 outline-none" defaultValue="password" />
          </div>
          <button className="w-full rounded-xl bg-[#7a4a2a] px-4 py-3 font-semibold text-white">Masuk</button>
        </form>
      </div>
    </div>
  );
}
