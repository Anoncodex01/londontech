import Link from "next/link";
import {
  MessageCircle,
  PackageSearch,
  Phone,
  ShoppingBag,
  Store,
  User,
} from "lucide-react";
import { BRAND } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "My Account",
  description: "Track orders, view your cart, and get help from London Technologies.",
  path: "/account",
});

const links = [
  {
    href: "/track",
    label: "Track order",
    description: "Check delivery status with your order ID",
    icon: PackageSearch,
  },
  {
    href: "/cart",
    label: "Shopping cart",
    description: "View items and continue to checkout",
    icon: ShoppingBag,
  },
  {
    href: "/shop",
    label: "Browse shop",
    description: "Explore all products and categories",
    icon: Store,
  },
  {
    href: "/contact",
    label: "Contact us",
    description: "Phone, WhatsApp, email, and business hours",
    icon: MessageCircle,
  },
];

export default function AccountPage() {
  return (
    <div className="container-shell section-pad py-10 md:py-14">
      <nav className="mb-6 text-sm text-ink-soft">
        <Link href="/" className="hover:text-brand">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">Account</span>
      </nav>

      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
          <User className="size-7" />
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold text-ink">My account</h1>
        <p className="mt-2 text-ink-soft">
          Track orders, manage your cart, and get support — no login required.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-line bg-white/90 p-5 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[0_12px_30px_rgba(37,150,190,0.12)]"
            >
              <Icon className="size-5 text-brand" />
              <h2 className="mt-3 font-display text-lg font-semibold text-ink">
                {item.label}
              </h2>
              <p className="mt-1 text-sm text-ink-soft">{item.description}</p>
            </Link>
          );
        })}
      </div>

      <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-line bg-brand-soft/40 p-5 text-center">
        <p className="font-semibold text-ink">Need help now?</p>
        <p className="mt-1 text-sm text-ink-soft">
          Call {BRAND.phone} or message us on WhatsApp.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <a href={BRAND.phoneHref} className="btn-secondary">
            <Phone className="size-4" />
            Call
          </a>
          <a
            href={BRAND.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <MessageCircle className="size-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
