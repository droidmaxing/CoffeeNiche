"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Coffee,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Package,
  Percent,
  Settings,
  ShoppingCart,
  Tags,
  UserCog,
  Users,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transaksi", icon: ShoppingCart },
  { href: "/transactions/history", label: "Riwayat Transaksi", icon: FileText },
  { href: "/products", label: "Menu", icon: Package },
  { href: "/categories", label: "Kategori", icon: Tags },
  { href: "/modifiers", label: "Modifier", icon: CreditCard },
  { href: "/discounts", label: "Diskon", icon: Percent },
  { href: "/reports", label: "Laporan", icon: BarChart3 },
  { href: "/users", label: "User", icon: Users },
  { href: "/settings", label: "Pengaturan", icon: Settings },
  { href: "/login", label: "Logout", icon: LogOut, isLogout: true },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-[#e9dcc9] bg-[#f9f3ec] p-5">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#7a4a2a] text-lg font-bold text-[#f8efe8] shadow-md">
          <Coffee className="h-5 w-5" />
        </div>
        <div>
          <p className="text-lg font-bold text-[#3e2a20]">CoffeeNiche</p>
          <p className="text-xs text-[#7d695d]">Cafe POS Dashboard</p>
        </div>
      </div>

      <nav className="space-y-1.5">
        {navItems.map(({ href, label, icon: Icon, isLogout }) => {
          const isActive = pathname === href || (href !== "/login" && pathname.startsWith(href));

          return (
            <Link
              key={label}
              href={href}
              className={[
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-[#7a4a2a] text-[#fffaf5] shadow-sm"
                  : isLogout
                    ? "text-[#7d695d] hover:bg-[#f0e3d4] hover:text-[#3f2a21]"
                    : "text-[#4a362d] hover:bg-[#f0e3d4] hover:text-[#3f2a21]",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-[#eadcc8] bg-[#fffaf5] p-3 shadow-sm">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#efe2d2] text-[#704d34]">
            <UserCog className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#3d2c25]">Owner</p>
            <p className="text-xs text-[#7d695d]">admin@coffeeniche.id</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
