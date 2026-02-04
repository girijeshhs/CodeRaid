import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Navigation } from "./components/navigation";
import { ToastProvider } from "./components/toast";
import { getSessionUserId } from "@/lib/session";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-space-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "CodeRaid | Progress tracker",
  description: "Track LeetCode progress with snapshots, XP, streaks, and parties.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userId = await getSessionUserId();
  const isAuthenticated = !!userId;

  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceMono.variable} theme-base font-sans`}>
        <ToastProvider>
          <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-white/5 bg-zinc-950/80 px-4 backdrop-blur-md transition-colors hover:border-zinc-800 sm:px-8">
            <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 text-lg font-bold tracking-tight text-white transition-opacity hover:opacity-80">
              <div className="h-3 w-3 rounded-sm bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
              CodeRaid
            </Link>
            <Navigation isAuthenticated={isAuthenticated} />
          </header>
          <main className="flex min-h-[calc(100vh-64px)] flex-col">{children}</main>
        </ToastProvider>
      </body>
    </html>
  );
}
