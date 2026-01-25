import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-space-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CodeRaid | Gamified LeetCode tracker",
  description: "Track LeetCode progress with snapshots, XP, streaks, and parties.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceMono.variable} theme-base`}>
        <header className="site-nav">
          <div className="site-brand">CodeRaid</div>
          <nav>
            <Link href="/">Home</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/party">Party</Link>
            <Link href="/settings">Settings</Link>
          </nav>
        </header>
        <main className="site-main">{children}</main>
      </body>
    </html>
  );
}
