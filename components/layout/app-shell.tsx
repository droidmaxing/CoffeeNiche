"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { SessionUser } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/topbar";

export function AppShell({
  session,
  children,
}: {
  session: SessionUser | null;
  children: ReactNode;
}) {
  const pathname = usePathname();
  if (pathname === "/login") return <>{children}</>;

  return (
    <div className="flex min-h-screen">
      <Sidebar session={session} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="min-w-0 flex-1 bg-[#f7f1eb]">{children}</main>
      </div>
    </div>
  );
}
