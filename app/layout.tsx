import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cavite State University Bacoor - Library",
  description: "Library management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50`}
      >
        {/* NAVBAR */}
        <nav className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 sticky top-0 z-40 border-b border-white/10">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            {/* Left: Logo / Brand */}
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/40">
                <Avatar>
                  <AvatarImage src="/icon.ico" />
                </Avatar>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-tight">
                  Cavite State University Bacoor
                </span>
                <span className="text-[11px]">Library</span>
              </div>
            </Link>

            {/* Right: CTA */}
            <div className="flex items-center gap-3">
              <Link href="/add-book">
                <Button
                  size="sm"
                  className="flex items-center gap-1 rounded-full border border-emerald-500/60 bg-emerald-500/10 px-3 text-[11px] font-medium text-emerald-300 shadow-sm shadow-emerald-900/40 transition hover:bg-emerald-500/30 hover:text-emerald-50 hover:shadow-emerald-700/60"
                >
                  <Plus className="h-3.5 w-3.5" />
                  New book
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className="min-h-[calc(100vh-6rem)]">{children}</main>

        {/* FOOTER */}
        <footer>
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-[11px] text-slate-400 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-300">
                Cavite State University Bacoor Campus
              </span>
              <span className="hidden text-slate-600 md:inline">•</span>
              <span>Library Management System</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-slate-500">
                © {new Date().getFullYear()} CvSU Bacoor. All rights reserved.
              </span>
            </div>
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
