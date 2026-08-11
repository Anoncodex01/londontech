"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, MessageCircle, ShoppingCart, Star } from "lucide-react";
import { formatPrice } from "@/data/catalog";
import { useCart } from "@/lib/cart";
import { useCatalog } from "@/lib/catalog-provider";
import { BRAND } from "@/lib/constants";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`size-3.5 ${
            i <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function SpotlightCard({ product }: { product: ReturnType<typeof useCatalog>["products"][0] }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const cover = product.imageUrls?.[0] || product.imageUrl;
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;
  const whatsappUrl = `https://wa.me/255714335285?text=${encodeURIComponent(
    `Hello London Technologies, I want to order the ${product.name} for ${formatPrice(product.price)}. Is it available?`,
  )}`;

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-brand-deeper to-brand-dark">
      {/* Badges */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {discount && (
          <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow">
            {discount}% OFF
          </span>
        )}
        {product.badge && (
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {product.badge}
          </span>
        )}
      </div>


      {/* Image */}
      <Link href={`/product/${product.id}`} className="relative block aspect-[4/3] overflow-hidden">
        {cover ? (
          <Image
            src={cover}
            alt={product.name}
            fill
            className="object-cover opacity-90 transition-transform duration-700 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="font-display text-2xl font-bold text-white/80">{product.name}</p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-deeper/80 via-transparent to-transparent" />
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-mist">
          {product.brand} · {product.category}
        </p>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-display text-xl font-bold leading-tight text-white hover:text-brand-mist md:text-2xl">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2">
          <StarRating rating={product.rating} />
          <span className="text-xs text-white/70">({product.reviews})</span>
        </div>

        <div className="flex items-end gap-3">
          <p className="font-display text-2xl font-bold text-white">
            {formatPrice(product.price)}
          </p>
          {product.originalPrice && (
            <p className="mb-0.5 text-sm text-white/50 line-through">
              {formatPrice(product.originalPrice)}
            </p>
          )}
        </div>

        <div className="mt-auto flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => {
              addItem(product);
              setAdded(true);
              setTimeout(() => setAdded(false), 1500);
            }}
            disabled={product.stock === "out-of-stock"}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-bold text-brand-deeper transition hover:bg-brand-mist disabled:opacity-50"
          >
            <ShoppingCart className="size-4" />
            {added ? "Added!" : "Add to Cart"}
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/30 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <MessageCircle className="size-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

function MiniCard({ product }: { product: ReturnType<typeof useCatalog>["products"][0] }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const cover = product.imageUrls?.[0] || product.imageUrl;
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div className="group flex gap-3 overflow-hidden rounded-2xl border border-line bg-white p-3 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(37,150,190,0.12)]">
      {/* Thumbnail */}
      <Link
        href={`/product/${product.id}`}
        className="relative size-20 shrink-0 overflow-hidden rounded-xl"
        style={{
          background: `linear-gradient(135deg, ${product.accent ?? "#2596be"}, #0e4054)`,
        }}
      >
        {cover && (
          <Image
            src={cover}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="80px"
          />
        )}
        {discount && (
          <span className="absolute top-1 left-1 rounded-md bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white leading-none">
            -{discount}%
          </span>
        )}
      </Link>

      {/* Details */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-brand">
            {product.category}
          </p>
          <Link href={`/product/${product.id}`}>
            <p className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-ink hover:text-brand">
              {product.name}
            </p>
          </Link>
          <div className="mt-1 flex items-center gap-1">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-ink">{product.rating}</span>
            <span className="text-xs text-ink-soft">({product.reviews})</span>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <div>
            <p className="text-sm font-bold text-brand-deeper">{formatPrice(product.price)}</p>
            {product.originalPrice && (
              <p className="text-[10px] text-ink-soft line-through">
                {formatPrice(product.originalPrice)}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
              setAdded(true);
              setTimeout(() => setAdded(false), 1400);
            }}
            disabled={product.stock === "out-of-stock"}
            className="flex shrink-0 items-center gap-1 rounded-lg bg-brand px-2.5 py-1.5 text-[11px] font-bold text-white transition hover:bg-brand-dark disabled:opacity-50"
          >
            <ShoppingCart className="size-3" />
            {added ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProductShowcase() {
  const { products } = useCatalog();

  const dealProducts = products.filter((p) => p.deal || p.featured);
  const pool = dealProducts.length > 0 ? dealProducts : products;

  const [spotlightIndex] = useState(() => Math.floor(Math.random() * pool.length));
  const spotlight = pool[spotlightIndex] ?? products[0];

  const side = products
    .filter((p) => p.id !== spotlight?.id)
    .slice(0, 6);

  if (!spotlight) return null;

  return (
    <section className="container-shell section-pad py-8 md:py-12">
      {/* Bento Grid */}
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr] xl:grid-cols-[1.1fr_1fr]">
        {/* Left: Spotlight */}
        <SpotlightCard product={spotlight} />

        {/* Right: 2×3 mini cards */}
        <div className="grid grid-cols-2 gap-3">
          {side.map((product) => (
            <MiniCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-center sm:hidden">
        <Link href="/shop" className="btn-secondary text-sm">
          See all products →
        </Link>
      </div>
    </section>
  );
}
