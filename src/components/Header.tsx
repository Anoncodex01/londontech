"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, MessageCircle, Phone, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { BRAND } from "@/lib/constants";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/#new-arrivals", label: "New Arrivals" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact Us" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/80 backdrop-blur-xl">
      <div className="container-shell section-pad flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
        <Link href="/" className="group flex min-w-0 flex-col">
          <span className="font-display text-lg font-bold tracking-tight text-ink transition-colors group-hover:text-brand md:text-xl">
            {BRAND.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-brand-soft hover:text-brand-deeper"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={BRAND.phoneHref}
            className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-2 text-sm font-semibold text-brand-deeper transition-colors hover:border-brand hover:bg-brand-soft"
          >
            <Phone className="size-4 text-brand" />
            <span className="hidden sm:inline">Call</span>
          </a>
          <a
            href={BRAND.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-2 text-sm font-semibold text-brand-deeper transition-colors hover:border-brand hover:bg-brand-soft"
          >
            <MessageCircle className="size-4 text-brand" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
          <Link
            href="/cart"
            className="relative inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-2 text-sm font-semibold text-brand-deeper transition-colors hover:border-brand hover:bg-brand-soft"
          >
            <ShoppingBag className="size-4 text-brand" />
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-line text-ink lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-white lg:hidden">
          <nav className="container-shell section-pad flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-3 text-base font-medium text-ink transition-colors hover:bg-brand-soft"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/cart"
              className="rounded-xl px-3 py-3 text-base font-medium text-ink transition-colors hover:bg-brand-soft"
              onClick={() => setOpen(false)}
            >
              Cart ({itemCount})
            </Link>
            <Link
              href="/checkout"
              className="btn-primary mt-2"
              onClick={() => setOpen(false)}
            >
              Checkout
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
