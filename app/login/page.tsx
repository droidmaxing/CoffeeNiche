"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error ?? "Login gagal.");
        return;
      }
      const next = searchParams.get("next");
      router.replace(next?.startsWith("/") ? next : "/dashboard");
      router.refresh();
    } catch {
      setError("Tidak dapat menghubungi server. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5efe9] p-6">
      <div className="w-full max-w-md rounded-3xl border border-[#efe1d1] bg-[#fffaf5] p-6 shadow-lg shadow-[#efe0d1]">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#7a4a2a] text-3xl text-[#f9f1ea]">☕</div>
          <h1 className="text-3xl font-bold text-[#2e221d]">CoffeeNiche</h1>
          <p className="mt-2 text-sm text-[#7d695d]">Masuk ke sistem kasir cafe</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-[#5d4439]">Email</label>
            <input id="email" name="email" type="email" autoComplete="username" required className="w-full rounded-xl border border-[#eadcc8] bg-[#f9f3ec] px-3 py-2.5 outline-none" />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm text-[#5d4439]">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required className="w-full rounded-xl border border-[#eadcc8] bg-[#f9f3ec] px-3 py-2.5 outline-none" />
          </div>
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <button disabled={submitting} className="w-full rounded-xl bg-[#7a4a2a] px-4 py-3 font-semibold text-white disabled:opacity-60">
            {submitting ? "Memeriksa..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}
