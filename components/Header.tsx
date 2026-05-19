"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import PromoBar from "./PromoBar";

const NAV = [
  { href: "/weight-loss", label: "Weight Loss" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact-us", label: "Contact Us" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full bg-white">
      <PromoBar />
      <div className="border-b border-slate-100 bg-white">
        <div className="container flex h-[78px] items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-9">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="text-[15px] font-semibold text-[#212322] hover:text-[#1E7FFF] transition"
              >
                {n.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="rounded-md bg-[#1E7FFF] px-7 py-2.5 text-[13px] font-bold uppercase tracking-wide text-white hover:bg-[#1666CC] transition"
            >
              Log In
            </Link>
          </nav>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-ink"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white">
          <div className="container py-3 flex flex-col gap-3">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="py-1.5 text-sm font-semibold text-ink-soft"
              >
                {n.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex justify-center rounded-md bg-[#1E7FFF] px-7 py-2.5 text-sm font-bold uppercase text-white"
            >
              Log In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
