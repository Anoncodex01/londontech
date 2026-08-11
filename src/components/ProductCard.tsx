"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, MessageCircle, ShoppingCart, Star } from "lucide-react";
import type { Product } from "@/data/catalog";
import { formatPrice } from "@/data/catalog";
import { useCart } from "@/lib/cart";
import { BRAND } from "@/lib/constants";

const stockConfig: Record<
  Product["stock"],
  { text: string; dotColor: string; textColor: string }
> = {
  "in-stock": {
    text: "In Stock",
    dotColor: "bg-emerald-500",
    textColor: "text-emerald-700",
  },
  limited: {
    text: "Limited Stock",
    dotColor: "bg-amber-500",
    textColor: "text-amber-700",
  },
  "out-of-stock": {
    text: "Out of Stock",
    dotColor: "bg-rose-500",
    textColor: "text-rose-700",
  },
};

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const stock = stockConfig[product.stock];
  const cover = product.imageUrls?.[0] || product.imageUrl;
  const disabled = product.stock === "out-of-stock";

  const discount =
    product.originalPrice
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : null;

  const whatsappUrl = `https://wa.me/255714335285?text=${encodeURIComponent(
    `Hello London Technologies, I want to order the ${product.name} for ${formatPrice(product.price)}. Is it available?`,
  )}`;

  const filledStars = Math.round(product.rating);

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

        {/* Sale discount badge — top-left, above product.badge */}
        {discount !== null && (
          <span className="absolute top-3 left-3 z-20 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-bold text-white shadow">
            {discount}% OFF
          </span>
        )}
        {product.badge && (
          <span
            className={`absolute left-3 z-10 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-brand-deeper ${discount !== null ? "top-10" : "top-3"}`}
          >
            {product.badge}
          </span>
        )}

      </div>

      <div className="flex flex-1 flex-col p-4 md:p-5">
        {/* Category + name */}
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

        {/* Stock indicator — inline colored dot */}
        <div className="mt-2 flex items-center gap-1.5">
          <span className={`inline-block size-2.5 rounded-full ${stock.dotColor}`} />
          <span className={`text-xs font-semibold ${stock.textColor}`}>
            {stock.text}
          </span>
        </div>

        {/* Star rating row */}
        <div className="mt-2 flex items-center gap-1.5 text-sm">
          <span className="flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`size-3.5 ${
                  i < filledStars
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </span>
          <span className="font-semibold text-ink">{product.rating}</span>
          <span className="text-ink-soft">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="mt-3">
          <p className="font-display text-xl font-bold text-brand-deeper">
            {formatPrice(product.price)}
          </p>
          {product.originalPrice && (
            <p className="text-sm text-ink-soft line-through">
              {formatPrice(product.originalPrice)}
            </p>
          )}
        </div>

        {/* Warranty / Delivery meta */}
        <div className="mt-1 text-xs text-ink-soft">
          <span>Warranty: {product.warranty}</span>
          <span className="mx-1.5">·</span>
          <span>Delivery: {product.delivery}</span>
        </div>

        {/* Buttons */}
        <div className="mt-auto flex flex-col gap-2 pt-4">
          {/* Primary: Add to Cart — full width */}
          <button
            type="button"
            disabled={disabled}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => {
              addItem(product);
              setAdded(true);
              window.setTimeout(() => setAdded(false), 1500);
            }}
          >
            <ShoppingCart className="size-4" />
            {added ? "Added!" : "Add to Cart"}
          </button>

          {/* WhatsApp secondary */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-emerald-500 bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-500 hover:text-white"
          >
            <MessageCircle className="size-4" />
            ORDER VIA WHATSAPP (0714335285)
          </a>

          {/* View Details link */}
          <Link
            href={`/product/${product.id}`}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-line px-3 py-2 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
          >
            View Details
          </Link>
        </div>

        <p className="sr-only">
          Contact {BRAND.name} for {product.name}
        </p>
      </div>
    </article>
  );
}
