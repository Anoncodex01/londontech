"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Product } from "@/data/catalog";
import { formatPrice } from "@/data/catalog";

const stockLabel: Record<Product["stock"], { text: string; className: string }> = {
  "in-stock": { text: "In Stock", className: "bg-emerald-50 text-emerald-700" },
  limited: { text: "Limited", className: "bg-amber-50 text-amber-700" },
  "out-of-stock": { text: "Out of Stock", className: "bg-rose-50 text-rose-700" },
};

type ProductCardCompactProps = {
  product: Product;
};

export function ProductCardCompact({ product }: ProductCardCompactProps) {
  const cover = product.imageUrls?.[0] || product.imageUrl;
  const stock = stockLabel[product.stock];

  return (
    <Link
      href={`/product/${product.id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white/90 shadow-[0_8px_30px_rgba(14,64,84,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(37,150,190,0.14)]"
    >
      <div
        className="product-visual relative aspect-square overflow-hidden"
        style={{ ["--product-accent" as string]: product.accent }}
      >
        {cover ? (
          <Image
            src={cover}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
            <p className="font-display text-lg font-bold tracking-tight text-white">
              {product.name.split(" ").slice(0, 2).join(" ")}
            </p>
          </div>
        )}
        {product.badge && (
          <span className="absolute top-3 left-3 z-10 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-brand-deeper">
            {product.badge}
          </span>
        )}
        <span
          className={`absolute top-3 right-3 z-10 rounded-full px-2.5 py-1 text-[11px] font-semibold ${stock.className}`}
        >
          {stock.text}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium tracking-wide text-brand uppercase">
          {product.category}
        </p>
        <h3 className="mt-1 line-clamp-2 font-display text-base font-semibold tracking-tight text-ink transition-colors group-hover:text-brand">
          {product.name}
        </h3>

        <div className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-soft">
          <Star className="size-3.5 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-ink">{product.rating}</span>
          <span className="text-xs">({product.reviews})</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div>
            <p className="font-display text-lg font-bold text-brand-deeper">
              {formatPrice(product.price)}
            </p>
            {product.originalPrice && (
              <p className="text-xs text-ink-soft line-through">
                {formatPrice(product.originalPrice)}
              </p>
            )}
          </div>
          <span className="text-xs font-semibold text-brand transition-colors group-hover:text-brand-dark">
            View details →
          </span>
        </div>
      </div>
    </Link>
  );
}
