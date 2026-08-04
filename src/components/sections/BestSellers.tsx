"use client";

import Link from "next/link";
import { ProductCardCompact } from "@/components/ProductCardCompact";
import { useCatalog } from "@/lib/catalog-provider";

export function BestSellers() {
  const { products } = useCatalog();
  const best = products.filter((p) => p.bestSeller).slice(0, 3);

  return (
    <section id="best-sellers" className="bg-white/50 py-16 md:py-20">
      <div className="container-shell section-pad">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">
              Best Sellers
            </p>
            <h2 className="section-title mt-2">
              Trusted by customers across Tanzania
            </h2>
          </div>
          <Link href="/shop" className="btn-secondary">
            View Best Sellers
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
          {best.map((product) => (
            <ProductCardCompact key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
