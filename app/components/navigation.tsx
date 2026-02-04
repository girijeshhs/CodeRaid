"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type NavLinkProps = {
  href: string;
  label: string;
  isActive: boolean;
};

function NavLink({ href, label, isActive }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`transition-colors ${
        isActive ? "text-amber-500 font-semibold" : "text-zinc-400 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}

type NavigationProps = {
  isAuthenticated: boolean;
};

export function Navigation({ isAuthenticated }: NavigationProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const authenticatedLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/weekly", label: "Weekly" },
    { href: "/party", label: "Parties" },
    { href: "/settings", label: "Settings" },
  ];

  const unauthenticatedLinks = [{ href: "/", label: "Sign in" }];

  const links = isAuthenticated ? authenticatedLinks : unauthenticatedLinks;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden gap-6 text-sm font-medium md:flex">
        {links.map((link) => (
          <NavLink key={link.href} {...link} isActive={pathname === link.href} />
        ))}
      </nav>

      {/* Mobile Menu Button */}
      <button
        type="button"
        className="flex flex-col gap-1 md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
        aria-expanded={isMobileMenuOpen}
      >
        <span className={`h-0.5 w-5 bg-white transition-transform ${isMobileMenuOpen ? "translate-y-1.5 rotate-45" : ""}`} />
        <span className={`h-0.5 w-5 bg-white transition-opacity ${isMobileMenuOpen ? "opacity-0" : ""}`} />
        <span className={`h-0.5 w-5 bg-white transition-transform ${isMobileMenuOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 z-40 border-b border-zinc-800 bg-zinc-950 p-6 md:hidden">
          <nav className="flex flex-col gap-4 text-base font-medium">
            {links.map((link) => (
              <NavLink key={link.href} {...link} isActive={pathname === link.href} />
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
