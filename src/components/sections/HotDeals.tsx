"use client";

import { Flame, Timer } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { useCatalog } from "@/lib/catalog-provider";

export function HotDeals() {
  const { products } = useCatalog();
  const deals = products.filter((p) => p.deal).slice(0, 3);

  return (
    <section id="deals" className="atmosphere py-16 md:py-20">
      <div className="container-shell section-pad relative">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">
            Today&apos;s Hot Deals
          </p>
          <h2 className="section-title mt-2">
            Don&apos;t miss today&apos;s biggest discounts
          </h2>
          <div className="mt-4 flex flex-wrap gap-3 text-sm font-medium text-ink-soft">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5">
              <Flame className="size-4 text-orange-500" />
              Limited-Time Offers
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5">
              <Timer className="size-4 text-brand" />
              While Stocks Last
            </span>
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <a href="#featured" className="btn-primary">
            Shop Deals
          </a>
        </div>
      </div>
    </section>
  );
}
