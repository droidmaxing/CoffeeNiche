"use client";

import { useThemeStore } from "@/stores/theme-store";

export default function SettingsPage() {
  const { settings, setSettings } = useThemeStore();

  return (
    <div className="space-y-6 p-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-[#8a6d5d]">System</p>
        <h1 className="mt-2 text-3xl font-bold text-[#2c1f1a]">Pengaturan</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#efe1d1] bg-[#fffaf5] p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-[#2d221d]">Informasi Toko</h2>
          <div className="space-y-4">
            <label className="block text-sm text-[#5d4439]">
              Nama Cafe
              <input
                value={settings.name}
                onChange={(e) => setSettings({ name: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#eadcc8] bg-[#f9f3ec] px-3 py-2 outline-none ring-0"
              />
            </label>
            <label className="block text-sm text-[#5d4439]">
              Tagline
              <input
                value={settings.tagline}
                onChange={(e) => setSettings({ tagline: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#eadcc8] bg-[#f9f3ec] px-3 py-2 outline-none ring-0"
              />
            </label>
            <label className="block text-sm text-[#5d4439]">
              Logo
              <input
                value={settings.logo}
                onChange={(e) => setSettings({ logo: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#eadcc8] bg-[#f9f3ec] px-3 py-2 outline-none ring-0"
              />
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-[#efe1d1] bg-[#fffaf5] p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-[#2d221d]">Tema</h2>
          <div className="space-y-4">
            <label className="block text-sm text-[#5d4439]">
              Warna Utama
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => setSettings({ primaryColor: e.target.value })}
                className="mt-1 h-12 w-full rounded-xl border border-[#eadcc8] bg-[#f9f3ec] p-1"
              />
            </label>
            <label className="block text-sm text-[#5d4439]">
              Warna Aksen
              <input
                type="color"
                value={settings.accentColor}
                onChange={(e) => setSettings({ accentColor: e.target.value })}
                className="mt-1 h-12 w-full rounded-xl border border-[#eadcc8] bg-[#f9f3ec] p-1"
              />
            </label>
            <div className="rounded-2xl p-4" style={{ background: settings.accentColor }}>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold text-white"
                  style={{ background: settings.primaryColor }}
                >
                  {settings.logo}
                </div>
                <div>
                  <p className="text-lg font-bold text-[#2d221d]">{settings.name}</p>
                  <p className="text-xs text-[#5d4439]">{settings.tagline}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
