"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, MessageCircle, ShoppingCart, Star } from "lucide-react";
import type { Product } from "@/data/catalog";
import { formatPrice } from "@/data/catalog";
import { useCart } from "@/lib/cart";
import { BRAND } from "@/lib/constants";

const stockLabel: Record<Product["stock"], { text: string; className: string }> = {
  "in-stock": {
    text: "In Stock",
    className: "bg-emerald-50 text-emerald-700",
  },
  limited: {
    text: "Limited Stock",
    className: "bg-amber-50 text-amber-700",
  },
  "out-of-stock": {
    text: "Out of Stock",
    className: "bg-rose-50 text-rose-700",
  },
};

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const stock = stockLabel[product.stock];
  const cover = product.imageUrls?.[0] || product.imageUrl;
  const disabled = product.stock === "out-of-stock";

  const whatsappUrl = `https://wa.me/255700000000?text=${encodeURIComponent(
    `Hi London Technologies, I'd like to buy: ${product.name}`,
  )}`;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white/90 shadow-[0_8px_30px_rgba(14,64,84,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(37,150,190,0.14)]">
      <div
        className="product-visual relative aspect-[4/3] overflow-hidden"
        style={{ ["--product-accent" as string]: product.accent }}
      >
        <Link href={`/product/${product.id}`} className="absolute inset-0">
          {cover ? (
            <Image
              src={cover}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          ) : (
            <>
              <div className="absolute inset-0 opacity-30 mix-blend-overlay">
                <div className="absolute -top-8 -right-8 size-40 rounded-full bg-white/30 blur-2xl" />
                <div className="absolute bottom-0 left-0 size-28 rounded-full bg-black/20 blur-xl" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="animate-float rounded-2xl border border-white/25 bg-white/10 px-5 py-6 text-center backdrop-blur-sm">
                  <p className="font-display text-lg font-bold tracking-tight text-white md:text-xl">
                    {product.name.split(" ").slice(0, 2).join(" ")}
                  </p>
                  <p className="mt-1 text-xs font-medium tracking-[0.14em] text-white/75 uppercase">
                    {product.brand}
                  </p>
                </div>
              </div>
            </>
          )}
        </Link>
        {product.badge && (
          <span className="absolute top-3 left-3 z-10 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-brand-deeper">
            {product.badge}
          </span>
        )}
        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={() => setWishlisted((v) => !v)}
          className="absolute top-3 right-3 z-10 inline-flex size-9 items-center justify-center rounded-full bg-white/95 text-ink-soft transition-colors hover:text-rose-500"
        >
          <Heart
            className={`size-4 ${wishlisted ? "fill-rose-500 text-rose-500" : ""}`}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium tracking-wide text-brand uppercase">
              {product.category}
            </p>
            <Link href={`/product/${product.id}`}>
              <h3 className="mt-1 font-display text-lg font-semibold tracking-tight text-ink hover:text-brand">
                {product.name}
              </h3>
            </Link>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${stock.className}`}
          >
            {stock.text}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-sm text-ink-soft">
          <Star className="size-4 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-ink">{product.rating}</span>
          <span>({product.reviews})</span>
        </div>

        <ul className="mt-3 space-y-1 text-sm text-ink-soft">
          {product.specs.slice(0, 3).map((spec) => (
            <li key={spec} className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-brand" />
              {spec}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="font-display text-xl font-bold text-brand-deeper">
              {formatPrice(product.price)}
            </p>
            {product.originalPrice && (
              <p className="text-sm text-ink-soft line-through">
                {formatPrice(product.originalPrice)}
              </p>
            )}
          </div>
          <div className="text-right text-xs text-ink-soft">
            <p>Warranty: {product.warranty}</p>
            <p>Delivery: {product.delivery}</p>
          </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
          <button
            type="button"
            disabled={disabled}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => {
              addItem(product);
              setAdded(true);
              window.setTimeout(() => setAdded(false), 1500);
            }}
          >
            <ShoppingCart className="size-4" />
            {added ? "Added" : "Add to Cart"}
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-line bg-brand-soft px-3 py-2.5 text-sm font-semibold text-brand-deeper transition-colors hover:border-brand"
          >
            <MessageCircle className="size-4" />
            WhatsApp
          </a>
          <Link
            href={`/product/${product.id}`}
            className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-xl border border-line px-3 py-2 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
          >
            View details
          </Link>
        </div>
        <p className="sr-only">
          Contact {BRAND.name} for {product.name}
        </p>
      </div>
    </article>
  );
}
