"use client";

import Link from "next/link";
import { ProductCardCompact } from "@/components/ProductCardCompact";
import { useCatalog } from "@/lib/catalog-provider";

export function FeaturedProducts() {
  const { products } = useCatalog();
  const featured = products.filter((p) => p.featured).slice(0, 3);

  return (
    <section id="featured" className="container-shell section-pad py-16 md:py-20">
      <div id="shop" className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">
            Featured Products
          </p>
          <h2 className="section-title mt-2">
            Our customers&apos; favorite technology products
          </h2>
          <p className="section-copy">
            Click any product to see full details, specs, and ordering options.
          </p>
        </div>
        <Link href="/shop" className="btn-secondary">
          View all products
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
        {featured.map((product) => (
          <ProductCardCompact key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
