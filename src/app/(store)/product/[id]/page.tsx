"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  MessageCircle,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import { ProductReviews } from "@/components/product/ProductReviews";
import { SimilarProducts } from "@/components/product/SimilarProducts";
import { formatPrice } from "@/data/catalog";
import { useCart } from "@/lib/cart";
import { useCatalog } from "@/lib/catalog-provider";
import { BRAND } from "@/lib/constants";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { products, ready } = useCatalog();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "specs" | "shipping" | "reviews">("details");

  const product = useMemo(
    () => products.find((item) => item.id === params.id),
    [params.id, products],
  );

  useEffect(() => {
    setQty(1);
    setActiveImage(0);
    setAdded(false);
    setActiveTab("details");
  }, [params.id]);

  if (!ready) {
    return (
      <div className="container-shell section-pad py-20 text-ink-soft">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-shell section-pad py-20">
        <h1 className="font-display text-3xl font-bold text-ink">
          Product not found
        </h1>
        <Link href="/shop" className="btn-primary mt-6 inline-flex">
          Back to shop
        </Link>
      </div>
    );
  }

  const images =
    product.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls
      : product.imageUrl
        ? [product.imageUrl]
        : [];
  const cover = images[activeImage] || images[0];
  const disabled = product.stock === "out-of-stock";
  const whatsappUrl = `https://wa.me/255714335285?text=${encodeURIComponent(
    `Hello London Technologies, I want to order the ${product.name} for ${formatPrice(product.price)}. Is it available?`,
  )}`;

  const tabs = [
    { key: "details" as const, label: "Details" },
    { key: "specs" as const, label: "Specifications" },
    { key: "shipping" as const, label: "Shipping & Delivery" },
    { key: "reviews" as const, label: "Reviews" },
  ];

  return (
    <div className="container-shell section-pad py-10 md:py-14">
      <nav className="mb-6 text-sm text-ink-soft">
        <Link href="/" className="hover:text-brand">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-brand">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <div
            className="product-visual relative aspect-square overflow-hidden rounded-[2rem] border border-line"
            style={{ ["--product-accent" as string]: product.accent }}
          >
            {cover ? (
              <Image
                src={cover}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center p-8 text-center">
                <p className="font-display text-2xl font-bold text-white">
                  {product.name}
                </p>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {images.map((url, index) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`relative aspect-square overflow-hidden rounded-xl border ${
                    activeImage === index
                      ? "border-brand ring-2 ring-brand/30"
                      : "border-line"
                  }`}
                >
                  <Image
                    src={url}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">
            {product.brand} · {product.category}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
            {product.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <a
              href="#product-reviews"
              className="inline-flex items-center gap-1.5 text-ink-soft hover:text-brand"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("reviews");
                document.getElementById("product-tabs")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Star className="size-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-ink">{product.rating}</span>
              ({product.reviews} reviews)
            </a>
            <span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand-deeper capitalize">
              {product.stock.replace("-", " ")}
            </span>
            {product.badge && (
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-ink border border-line">
                {product.badge}
              </span>
            )}
          </div>

          <div className="mt-6">
            <p className="font-display text-3xl font-bold text-brand-deeper">
              {formatPrice(product.price)}
            </p>
            {product.originalPrice && (
              <p className="text-base text-ink-soft line-through">
                {formatPrice(product.originalPrice)}
              </p>
            )}
          </div>

          <ul className="mt-6 space-y-2 text-ink-soft">
            {product.specs.map((spec) => (
              <li key={spec} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-brand" />
                {spec}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-line bg-white/80 p-4 text-sm text-ink-soft">
            <Truck className="mt-0.5 size-5 text-brand" />
            <div>
              <p className="font-semibold text-ink">Delivery estimate</p>
              <p>{product.delivery}</p>
              <p className="mt-1">{BRAND.delivery.dar}</p>
              <p>{BRAND.delivery.regions}</p>
              <p className="mt-1">Warranty: {product.warranty}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-line bg-white">
              <button
                type="button"
                className="inline-flex size-11 items-center justify-center text-ink"
                onClick={() => setQty((v) => Math.max(1, v - 1))}
                aria-label="Decrease quantity"
              >
                <Minus className="size-4" />
              </button>
              <span className="min-w-10 text-center font-semibold text-ink">
                {qty}
              </span>
              <button
                type="button"
                className="inline-flex size-11 items-center justify-center text-ink"
                onClick={() => setQty((v) => v + 1)}
                aria-label="Increase quantity"
              >
                <Plus className="size-4" />
              </button>
            </div>

            <button
              type="button"
              disabled={disabled}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => {
                addItem(product, qty);
                setAdded(true);
                window.setTimeout(() => setAdded(false), 1600);
              }}
            >
              <ShoppingCart className="size-4" />
              {added ? "Added to cart" : "Add to cart"}
            </button>

            <button
              type="button"
              disabled={disabled}
              className="btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => {
                addItem(product, qty);
                router.push("/checkout");
              }}
            >
              Buy now
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-500 hover:text-white"
            >
              <MessageCircle className="size-4" />
              ORDER VIA WHATSAPP (0714335285)
            </a>
          </div>
        </div>
      </div>

      {/* Tabs section */}
      <div id="product-tabs" className="mt-12">
        {/* Tab bar */}
        <div className="overflow-x-auto">
          <div className="flex min-w-max border-b border-line">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-brand text-brand"
                    : "border-transparent text-ink-soft hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="mt-6">
          {activeTab === "details" && (
            <div>
              {(product as { description?: string }).description && (
                <p className="mb-4 text-ink-soft leading-relaxed">
                  {(product as { description?: string }).description}
                </p>
              )}
              <ul className="space-y-3">
                {product.specs.map((spec, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand" />
                    <span className="text-ink-soft">{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="divide-y divide-line">
              {product.specs.map((spec, i) => (
                <div key={i} className="grid grid-cols-[140px_1fr] gap-4 py-3 text-sm">
                  <span className="font-semibold text-ink">Spec {i + 1}</span>
                  <span className="text-ink-soft">{spec}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="rounded-2xl border border-line bg-white/80 p-6 space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">🚚</span>
                <div>
                  <p className="font-semibold text-ink">Dar es Salaam</p>
                  <p className="text-sm text-ink-soft">1 Day delivery</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">📦</span>
                <div>
                  <p className="font-semibold text-ink">Other Regions</p>
                  <p className="text-sm text-ink-soft">
                    {BRAND.delivery.regions || "2–5 Days"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🛡️</span>
                <div>
                  <p className="font-semibold text-ink">Warranty</p>
                  <p className="text-sm text-ink-soft">{product.warranty}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🔄</span>
                <div>
                  <p className="font-semibold text-ink">Returns</p>
                  <p className="text-sm text-ink-soft">7-day return policy</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div id="product-reviews">
              <ProductReviews
                productName={product.name}
                rating={product.rating}
                reviewCount={product.reviews}
              />
            </div>
          )}
        </div>
      </div>

      <SimilarProducts product={product} products={products} />
    </div>
  );
}
