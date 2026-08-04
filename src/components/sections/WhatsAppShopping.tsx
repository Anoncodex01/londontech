import { MessageCircle } from "lucide-react";
import { BRAND } from "@/lib/constants";

const helpItems = [
  "Choose the right product",
  "Explain product features",
  "Confirm availability",
  "Give delivery estimates",
  "Place your order instantly",
];

export function WhatsAppShopping() {
  return (
    <section className="container-shell section-pad py-8 md:py-12">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-deeper via-brand-dark to-brand px-6 py-12 text-white md:px-12 md:py-16">
        <div className="absolute -top-20 -right-16 size-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-24 -left-10 size-72 rounded-full bg-black/10 blur-2xl" />

        <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm font-semibold tracking-[0.16em] text-brand-mist uppercase">
              WhatsApp Shopping
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
              Need help choosing?
            </h2>
            <p className="mt-3 max-w-xl text-white/80">
              Chat with one of our product specialists instantly. We&apos;ll
              guide you from selection to delivery.
            </p>
            <ul className="mt-6 space-y-2.5">
              {helpItems.map((item) => (
                <li key={item} className="flex items-center gap-3 text-white/90">
                  <span className="size-1.5 rounded-full bg-white" />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href={BRAND.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary mt-8 !border-white/30 !bg-white !text-brand-deeper"
            >
              <MessageCircle className="size-4" />
              Buy via WhatsApp
            </a>
          </div>

          <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
            <p className="font-display text-xl font-semibold">Live assistance</p>
            <p className="mt-2 text-sm text-white/75">
              Typical reply time under 5 minutes during business hours.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <div className="rounded-2xl bg-white/10 px-4 py-3">
                Hi! Looking for a CCTV camera for my shop.
              </div>
              <div className="ml-6 rounded-2xl bg-white px-4 py-3 text-brand-deeper">
                Perfect — we recommend the V380 Pro or 3 Eyes CCTV. Want specs?
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
