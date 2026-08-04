"use client";

import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/data/catalog";

type SimilarProductsProps = {
  product: Product;
  products: Product[];
};

export function SimilarProducts({ product, products }: SimilarProductsProps) {
  const others = products.filter((item) => item.id !== product.id);
  const sameCategory = others
    .filter((item) => item.category === product.category)
    .sort((a, b) => b.rating - a.rating);
  const sameBrand = others
    .filter(
      (item) =>
        item.brand === product.brand &&
        item.category !== product.category,
    )
    .sort((a, b) => b.rating - a.rating);
  const similar = [...sameCategory, ...sameBrand].slice(0, 3);

  if (similar.length === 0) return null;

  return (
    <section className="mt-16 border-t border-line pt-12 md:mt-20 md:pt-16">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">
          Similar Products
        </p>
        <h2 className="section-title mt-2">You may also like</h2>
        <p className="section-copy">
          More options in {product.category}
          {product.brand ? ` and from ${product.brand}` : ""}.
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {similar.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
}
