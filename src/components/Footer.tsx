import Link from "next/link";
import { BRAND, SOCIALS } from "@/lib/constants";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/cart", label: "Cart" },
  { href: "/checkout", label: "Checkout" },
  { href: "/track", label: "Track Order" },
  { href: "/#deals", label: "Deals" },
  { href: "/#best-sellers", label: "Best Sellers" },
  { href: "/#new-arrivals", label: "New Arrivals" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact Us" },
  { href: "/#faq", label: "FAQs" },
];

const policies = [
  "Warranty Policy",
  "Shipping Policy",
  "Return Policy",
  "Privacy Policy",
  "Terms & Conditions",
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-brand-deeper text-white">
      <div className="container-shell section-pad py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <p className="font-display text-2xl font-bold tracking-tight">
              {BRAND.name}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              {BRAND.promise}
            </p>
            <p className="mt-5 font-display text-sm font-semibold tracking-wide text-brand-mist">
              {BRAND.closing}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-[0.12em] text-brand-mist uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/75 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-[0.12em] text-brand-mist uppercase">
              Policies
            </h3>
            <ul className="mt-4 space-y-2">
              {policies.map((policy) => (
                <li key={policy}>
                  <span className="text-sm text-white/75">{policy}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-[0.12em] text-brand-mist uppercase">
              Follow Us
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {SOCIALS.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    className="inline-flex rounded-full border border-white/15 px-3 py-1.5 text-sm text-white/80 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white"
                  >
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-1 text-sm text-white/75">
              <p>{BRAND.phone}</p>
              <p>{BRAND.email}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/55 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <p>Smart Technology. Trusted Quality.</p>
        </div>
      </div>
    </footer>
  );
}
