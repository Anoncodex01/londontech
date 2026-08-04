import { Check } from "lucide-react";

const benefits = [
  "Genuine Products",
  "Competitive Prices",
  "Nationwide Delivery",
  "Warranty Support",
];

export function HeroBenefits() {
  return (
    <section className="container-shell section-pad pt-8 pb-2 md:pt-10">
      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:justify-start md:gap-x-8">
        {benefits.map((benefit) => (
          <li
            key={benefit}
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft"
          >
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-brand text-white">
              <Check className="size-3.5 stroke-[2.5]" />
            </span>
            {benefit}
          </li>
        ))}
      </ul>
    </section>
  );
}
