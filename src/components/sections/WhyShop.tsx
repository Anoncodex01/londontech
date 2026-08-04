import {
  BadgeCheck,
  Headphones,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { whyShop } from "@/data/catalog";

const icons = [BadgeCheck, Truck, ShieldCheck, PackageCheck, Headphones, RefreshCw];

export function WhyShop() {
  return (
    <section id="why" className="container-shell section-pad py-16 md:py-20">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">
          Why Shop With Us
        </p>
        <h2 className="section-title mt-2">
          Why shop with London Technologies
        </h2>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {whyShop.map((item, index) => {
          const Icon = icons[index] ?? BadgeCheck;
          return (
            <div key={item.title} className="rounded-2xl border border-transparent p-1">
              <div className="h-full rounded-2xl bg-white/80 p-5 transition-all hover:border-line hover:shadow-[0_10px_30px_rgba(37,150,190,0.1)]">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
