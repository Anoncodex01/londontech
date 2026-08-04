import type { Metadata } from "next";
import Link from "next/link";
import {
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Truck,
} from "lucide-react";
import { BRAND, SOCIALS } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Contact Us | ${BRAND.name}`,
  description:
    "Get in touch with London Technologies by phone, WhatsApp, or email. Nationwide delivery across Tanzania.",
};

export default function ContactPage() {
  return (
    <div className="container-shell section-pad py-10 md:py-14">
      <nav className="mb-6 text-sm text-ink-soft">
        <Link href="/" className="hover:text-brand">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">Contact Us</span>
      </nav>

      <div className="max-w-2xl">
        <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">
          Contact Us
        </p>
        <h1 className="section-title mt-2">We&apos;re here to help</h1>
        <p className="section-copy">
          Questions about a product, your order, or installation? Reach us on
          any channel below — we reply fast during business hours.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <a
          href={BRAND.phoneHref}
          className="rounded-2xl border border-line bg-white/90 p-5 transition-all hover:-translate-y-1 hover:border-brand/40"
        >
          <Phone className="size-5 text-brand" />
          <h2 className="mt-4 font-display text-lg font-semibold text-ink">
            Phone
          </h2>
          <p className="mt-1 text-sm text-ink-soft">{BRAND.phone}</p>
        </a>
        <a
          href={BRAND.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-2xl border border-line bg-white/90 p-5 transition-all hover:-translate-y-1 hover:border-brand/40"
        >
          <MessageCircle className="size-5 text-brand" />
          <h2 className="mt-4 font-display text-lg font-semibold text-ink">
            WhatsApp
          </h2>
          <p className="mt-1 text-sm text-ink-soft">{BRAND.whatsapp}</p>
        </a>
        <a
          href={BRAND.emailHref}
          className="rounded-2xl border border-line bg-white/90 p-5 transition-all hover:-translate-y-1 hover:border-brand/40"
        >
          <Mail className="size-5 text-brand" />
          <h2 className="mt-4 font-display text-lg font-semibold text-ink">
            Email
          </h2>
          <p className="mt-1 text-sm text-ink-soft">{BRAND.email}</p>
        </a>
        <div className="rounded-2xl border border-line bg-white/90 p-5">
          <Clock3 className="size-5 text-brand" />
          <h2 className="mt-4 font-display text-lg font-semibold text-ink">
            Business Hours
          </h2>
          <p className="mt-1 text-sm text-ink-soft">{BRAND.hours.weekday}</p>
          <p className="mt-1 text-sm text-ink-soft">{BRAND.hours.sunday}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white/90 p-5">
          <Truck className="size-5 text-brand" />
          <h2 className="mt-4 font-display text-lg font-semibold text-ink">
            Delivery
          </h2>
          <p className="mt-1 text-sm text-ink-soft">{BRAND.delivery.dar}</p>
          <p className="mt-1 text-sm text-ink-soft">{BRAND.delivery.regions}</p>
          <Link
            href="/track"
            className="mt-3 inline-block text-sm font-semibold text-brand hover:text-brand-dark"
          >
            Track your order →
          </Link>
        </div>
        <div className="rounded-2xl border border-line bg-white/90 p-5">
          <MapPin className="size-5 text-brand" />
          <h2 className="mt-4 font-display text-lg font-semibold text-ink">
            Location
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Dar es Salaam, Tanzania — nationwide delivery to all regions.
          </p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl font-semibold text-ink">
          Follow Us
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {SOCIALS.map((social) => (
            <a
              key={social.name}
              href={social.href}
              className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink-soft transition-colors hover:border-brand hover:text-brand"
            >
              {social.name}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-12 rounded-[2rem] border border-line bg-white/90 p-6 text-center md:p-10">
        <h2 className="font-display text-2xl font-bold text-ink">
          Fastest way to order
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-ink-soft">
          Message us on WhatsApp with the product you want and we&apos;ll
          confirm availability, price, and delivery right away.
        </p>
        <a
          href={BRAND.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-6"
        >
          <MessageCircle className="size-4" />
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}
