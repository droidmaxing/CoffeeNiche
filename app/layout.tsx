import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "CoffeeNiche POS",
  description: "Cafe and restaurant point of sale system",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();

  return (
    <html lang="id">
      <body className="min-h-screen bg-[#f5efe9] text-[#2b201d] antialiased">
        <AppShell session={session}>{children}</AppShell>
      </body>
    </html>
  );
}
