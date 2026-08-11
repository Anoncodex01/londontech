"use client";

import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { useCatalog } from "@/lib/catalog-provider";

export function BestSellers() {
  const { products } = useCatalog();
  const best = products.filter((p) => p.bestSeller).slice(0, 8);

  return (
    <section
      id="best-sellers"
      className="bg-gradient-to-br from-brand-deeper/5 to-brand/5 py-16 md:py-20"
    >
      <div className="container-shell section-pad">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">
              BEST SELLERS
            </p>
            <h2 className="section-title mt-2">
              What Tanzania is buying right now.
            </h2>
            {/* Trust badge row */}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <span className="text-emerald-500">✓</span>
                Trusted by 10,000+ customers
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-deeper">
                <span className="text-brand">✓</span>
                Fast Tanzania delivery
              </span>
            </div>
          </div>
          <Link href="/shop" className="btn-primary">
            View Best Sellers →
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {best.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
