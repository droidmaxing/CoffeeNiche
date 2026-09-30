import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/topbar";

export const metadata: Metadata = {
  title: "CoffeeNiche POS",
  description: "Cafe and restaurant point of sale system",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-[#f5efe9] text-[#2b201d] antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <TopBar />
            <main className="min-w-0 flex-1 bg-[#f7f1eb]">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
