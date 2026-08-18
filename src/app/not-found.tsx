import Link from "next/link";
import { Home, MessageCircle, Search, ShoppingBag } from "lucide-react";
import { BRAND } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-[linear-gradient(180deg,#eef8fc_0%,#f7fbfd_50%,#f4fafc_100%)]">
      <header className="border-b border-line bg-white/80 backdrop-blur-xl">
        <div className="container-shell section-pad flex h-16 items-center">
          <Link href="/" className="font-display text-xl font-bold text-ink hover:text-brand">
            {BRAND.name}
          </Link>
        </div>
      </header>

      <main className="container-shell section-pad flex flex-1 flex-col items-center justify-center py-16 text-center">
        <p className="text-sm font-semibold tracking-[0.2em] text-brand uppercase">
          404 — Page not found
        </p>
        <h1 className="mt-4 font-display text-5xl font-bold tracking-tight text-ink md:text-6xl">
          This page doesn&apos;t exist
        </h1>
        <p className="mt-4 max-w-md text-ink-soft">
          The link may be broken or the page was removed. Try one of the options
          below to get back on track.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">
            <Home className="size-4" />
            Back to home
          </Link>
          <Link href="/shop" className="btn-secondary">
            <ShoppingBag className="size-4" />
            Browse shop
          </Link>
          <Link href="/track" className="btn-secondary">
            <Search className="size-4" />
            Track order
          </Link>
          <Link href="/contact" className="btn-ghost">
            <MessageCircle className="size-4" />
            Contact us
          </Link>
        </div>

        <p className="mt-12 text-sm text-ink-soft">
          Need help?{" "}
          <a href={BRAND.whatsappHref} className="font-semibold text-brand hover:text-brand-dark">
            Chat on WhatsApp
          </a>
        </p>
      </main>

      <footer className="border-t border-line py-6 text-center text-sm text-ink-soft">
        © {new Date().getFullYear()} {BRAND.name}. {BRAND.tagline}
      </footer>
    </div>
  );
}
