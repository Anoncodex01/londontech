"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgePercent,
  BookOpen,
  Boxes,
  CircleHelp,
  ClipboardList,
  LayoutDashboard,
  Mail,
  MessageSquareQuote,
  Package,
  Settings,
  ShoppingBag,
  Tags,
  Users,
  Wrench,
  X,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Boxes },
  { href: "/admin/brands", label: "Brands", icon: Tags },
  { href: "/admin/deals", label: "Deals", icon: BadgePercent },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquareQuote },
  { href: "/admin/installations", label: "Installations", icon: Wrench },
  { href: "/admin/blog", label: "Blog", icon: BookOpen },
  { href: "/admin/faqs", label: "FAQs", icon: CircleHelp },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
          aria-label="Close sidebar"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-line bg-white transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <p className="font-display text-lg font-bold text-ink">
              London Admin
            </p>
            <p className="text-xs text-ink-soft">Store control center</p>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-ink-soft hover:bg-brand-soft lg:hidden"
            onClick={onClose}
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/admin" && pathname.startsWith(link.href));
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-brand text-white"
                    : "text-ink-soft hover:bg-brand-soft hover:text-brand-deeper"
                }`}
              >
                <Icon className="size-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-line p-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-dark"
          >
            <ClipboardList className="size-4" />
            View storefront
          </Link>
        </div>
      </aside>
    </>
  );
}
