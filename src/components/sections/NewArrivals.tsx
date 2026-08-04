"use client";

import Link from "next/link";
import { ProductCardCompact } from "@/components/ProductCardCompact";
import { useCatalog } from "@/lib/catalog-provider";

export function NewArrivals() {
  const { products } = useCatalog();
  const arrivals = products.filter((p) => p.newArrival).slice(0, 3);

  return (
    <section id="new-arrivals" className="container-shell section-pad py-16 md:py-20">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">
            New Arrivals
          </p>
          <h2 className="section-title mt-2">
            Be the first to own the latest technology
          </h2>
          <p className="section-copy">New products added every week.</p>
        </div>
        <Link href="/shop" className="btn-secondary">
          Explore New Arrivals
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
        {arrivals.map((product) => (
          <ProductCardCompact key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
