"use client";

import { useCatalog } from "@/lib/catalog-provider";

export function Brands() {
  const { brands } = useCatalog();

  return (
    <section className="border-y border-line bg-white/60 py-14 md:py-16">
      <div className="container-shell section-pad">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">
            Shop by Brand
          </p>
          <h2 className="section-title mt-2">
            Browse products from trusted brands
          </h2>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {brands.map((brand) => (
            <a
              key={brand}
              href="#featured"
              className="rounded-full border border-line bg-white px-4 py-2.5 font-display text-sm font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-brand hover:text-brand"
            >
              {brand}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
