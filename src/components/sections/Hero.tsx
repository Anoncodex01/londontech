import { MessageCircle, Phone, ShoppingBag } from "lucide-react";
import { BRAND } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative min-h-[calc(100svh-4.5rem)] overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(120deg, rgba(14,64,84,0.88) 0%, rgba(26,111,143,0.72) 42%, rgba(37,150,190,0.55) 70%, rgba(37,150,190,0.35) 100%), url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=2000&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.18),transparent_35%)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--surface)] to-transparent" />

      <div className="container-shell section-pad relative flex min-h-[calc(100svh-4.5rem)] flex-col justify-center py-16 md:py-20">
        <div className="max-w-3xl">
          <p className="animate-rise font-display text-sm font-semibold tracking-[0.22em] text-brand-mist uppercase md:text-base">
            {BRAND.name}
          </p>
          <h1 className="animate-rise-delay-1 mt-4 font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.98] font-bold tracking-[-0.04em] text-white">
            Experience Technology That Works for You
          </h1>
          <p className="animate-rise-delay-2 mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
            From smart projectors and CCTV security systems to networking
            devices and gaming gadgets—innovative technology designed to make
            life smarter, safer, and more enjoyable.
          </p>
          <div className="animate-rise-delay-3 mt-8 flex flex-wrap gap-3">
            <a href="/shop" className="btn-primary">
              <ShoppingBag className="size-4" />
              Shop Now
            </a>
            <a
              href={BRAND.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary !bg-white/95"
            >
              <MessageCircle className="size-4" />
              Order on WhatsApp
            </a>
            <a href={BRAND.phoneHref} className="btn-ghost !text-white hover:!bg-white/10">
              <Phone className="size-4" />
              Call Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
