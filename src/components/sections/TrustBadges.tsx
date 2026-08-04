import { Check } from "lucide-react";
import { trustBadges } from "@/data/catalog";

export function TrustBadges() {
  return (
    <section className="relative -mt-6 pb-4 md:-mt-8">
      <div className="container-shell section-pad">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 rounded-2xl border border-line bg-white/90 px-5 py-4 shadow-[0_12px_40px_rgba(14,64,84,0.08)] backdrop-blur-md md:gap-x-8 md:px-8">
          {trustBadges.map((badge) => (
            <div
              key={badge}
              className="flex items-center gap-2 text-sm font-medium text-ink-soft"
            >
              <span className="inline-flex size-5 items-center justify-center rounded-full bg-brand-soft text-brand">
                <Check className="size-3.5 stroke-[2.5]" />
              </span>
              {badge}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
