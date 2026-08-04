import { Clock3, Mail, MessageCircle, Phone } from "lucide-react";
import { BRAND, SOCIALS } from "@/lib/constants";

export function Contact() {
  return (
    <section id="contact" className="container-shell section-pad py-16 md:py-20">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">
          Contact Us
        </p>
        <h2 className="section-title mt-2">We&apos;re here to help</h2>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <a
          href={BRAND.phoneHref}
          className="rounded-2xl border border-line bg-white/90 p-5 transition-all hover:-translate-y-1 hover:border-brand/40"
        >
          <Phone className="size-5 text-brand" />
          <h3 className="mt-4 font-display text-lg font-semibold text-ink">Phone</h3>
          <p className="mt-1 text-sm text-ink-soft">{BRAND.phone}</p>
        </a>
        <a
          href={BRAND.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-2xl border border-line bg-white/90 p-5 transition-all hover:-translate-y-1 hover:border-brand/40"
        >
          <MessageCircle className="size-5 text-brand" />
          <h3 className="mt-4 font-display text-lg font-semibold text-ink">
            WhatsApp
          </h3>
          <p className="mt-1 text-sm text-ink-soft">{BRAND.whatsapp}</p>
        </a>
        <a
          href={BRAND.emailHref}
          className="rounded-2xl border border-line bg-white/90 p-5 transition-all hover:-translate-y-1 hover:border-brand/40"
        >
          <Mail className="size-5 text-brand" />
          <h3 className="mt-4 font-display text-lg font-semibold text-ink">Email</h3>
          <p className="mt-1 text-sm text-ink-soft">{BRAND.email}</p>
        </a>
        <div className="rounded-2xl border border-line bg-white/90 p-5">
          <Clock3 className="size-5 text-brand" />
          <h3 className="mt-4 font-display text-lg font-semibold text-ink">
            Business Hours
          </h3>
          <p className="mt-1 text-sm text-ink-soft">{BRAND.hours.weekday}</p>
          <p className="mt-1 text-sm text-ink-soft">{BRAND.hours.sunday}</p>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="font-display text-xl font-semibold text-ink">Follow Us</h3>
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
    </section>
  );
}
