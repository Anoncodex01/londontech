"use client";

import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { useCatalog } from "@/lib/catalog-provider";

export function NewArrivals() {
  const { products } = useCatalog();
  const arrivals = products.filter((p) => p.newArrival).slice(0, 8);

  return (
    <section id="new-arrivals" className="container-shell section-pad py-16 md:py-20">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">
            NEW ARRIVALS
          </p>
          <h2 className="section-title mt-2">Fresh technology just landed.</h2>
          <p className="section-copy">New products added every week.</p>
        </div>
        <Link href="/shop" className="btn-secondary">
          Explore New Arrivals
        </Link>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {arrivals.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
