"use client";

import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { useCatalog } from "@/lib/catalog-provider";

export function FeaturedProducts() {
  const { products } = useCatalog();
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const fallback = products.slice(0, 8);
  const display = featured.length > 0 ? featured : fallback;

  return (
    <section id="featured" className="container-shell section-pad py-10 md:py-14">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">
            Featured Products
          </p>
          <h2 className="section-title mt-2">
            Our customers&apos; favourite technology
          </h2>
          <p className="section-copy">
            Click any product to see full details, specs, and ordering options.
          </p>
        </div>
        <Link href="/shop" className="btn-secondary shrink-0">
          View all products
        </Link>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {display.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
