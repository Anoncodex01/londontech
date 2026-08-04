"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCardCompact } from "@/components/ProductCardCompact";
import { useCatalog } from "@/lib/catalog-provider";
import { slugify } from "@/lib/admin/utils";

type ShopCategory = { name: string; slug: string };

function matchesCategory(
  productCategory: string,
  selectedSlug: string,
  categories: ShopCategory[],
) {
  if (!selectedSlug || selectedSlug === "all") return true;

  const selected = categories.find((c) => c.slug === selectedSlug);
  if (selected) {
    // Products store category by name from admin — match name first
    if (productCategory === selected.name) return true;
    if (slugify(productCategory) === selected.slug) return true;
  }

  return (
    slugify(productCategory) === selectedSlug ||
    productCategory.toLowerCase() === selectedSlug.toLowerCase()
  );
}

function ShopCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products, categories, ready } = useCatalog();

  const categoryFromUrl = searchParams.get("category") || "all";
  const queryFromUrl = searchParams.get("q") || "";

  const [category, setCategory] = useState(categoryFromUrl);
  const [query, setQuery] = useState(queryFromUrl);
  const deferredQuery = useDeferredValue(query);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setCategory(categoryFromUrl);
    setQuery(queryFromUrl);
  }, [categoryFromUrl, queryFromUrl]);

  function updateUrl(nextCategory: string, nextQuery: string) {
    const params = new URLSearchParams();
    if (nextCategory && nextCategory !== "all") {
      params.set("category", nextCategory);
    }
    const trimmed = nextQuery.trim();
    if (trimmed) params.set("q", trimmed);
    const qs = params.toString();
    router.replace(qs ? `/shop?${qs}` : "/shop", { scroll: false });
  }

  function selectCategory(next: string) {
    setCategory(next);
    updateUrl(next, query);
    setFiltersOpen(false);
  }

  function onSearchChange(value: string) {
    setQuery(value);
    updateUrl(category, value);
  }

  function clearFilters() {
    setCategory("all");
    setQuery("");
    router.replace("/shop", { scroll: false });
  }

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    for (const cat of categories) {
      counts[cat.slug] = products.filter((p) =>
        matchesCategory(p.category, cat.slug, categories),
      ).length;
    }
    return counts;
  }, [categories, products]);

  const filtered = useMemo(() => {
    const needle = deferredQuery.trim().toLowerCase();
    return products
      .filter((product) =>
        matchesCategory(product.category, category, categories),
      )
      .filter((product) => {
        if (!needle) return true;
        return (
          product.name.toLowerCase().includes(needle) ||
          product.brand.toLowerCase().includes(needle) ||
          product.category.toLowerCase().includes(needle) ||
          product.specs.some((spec) => spec.toLowerCase().includes(needle))
        );
      })
      .sort((a, b) => {
        if (a.stock === "out-of-stock" && b.stock !== "out-of-stock") return 1;
        if (b.stock === "out-of-stock" && a.stock !== "out-of-stock") return -1;
        return b.rating - a.rating;
      });
  }, [products, category, deferredQuery, categories]);

  const activeCategoryName =
    category === "all"
      ? "All products"
      : categories.find((c) => c.slug === category)?.name || category;

  const hasActiveFilters = category !== "all" || query.trim().length > 0;

  if (!ready) {
    return (
      <div className="py-20 text-ink-soft">Loading shop...</div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="flex items-center justify-between gap-3 lg:block">
          <h2 className="font-display text-lg font-semibold text-ink">
            Categories
          </h2>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-2 text-sm font-semibold text-ink lg:hidden"
            onClick={() => setFiltersOpen((v) => !v)}
          >
            <SlidersHorizontal className="size-4 text-brand" />
            Filters
          </button>
        </div>

        <nav
          className={`mt-4 space-y-1 ${
            filtersOpen ? "block" : "hidden lg:block"
          }`}
        >
          <button
            type="button"
            onClick={() => selectCategory("all")}
            className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
              category === "all"
                ? "bg-brand-soft text-brand-deeper"
                : "text-ink-soft hover:bg-white hover:text-ink"
            }`}
          >
            <span>All products</span>
            <span className="text-xs opacity-70">{categoryCounts.all || 0}</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => selectCategory(cat.slug)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                category === cat.slug
                  ? "bg-brand-soft text-brand-deeper"
                  : "text-ink-soft hover:bg-white hover:text-ink"
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-xs opacity-70">
                {categoryCounts[cat.slug] || 0}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">
              Shop
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
              {activeCategoryName}
            </h1>
            <p className="mt-1 text-sm text-ink-soft">
              {filtered.length} product{filtered.length === 1 ? "" : "s"}
              {query.trim() ? ` matching “${query.trim()}”` : ""}
            </p>
          </div>

          <label className="relative w-full sm:max-w-xs">
            <span className="sr-only">Search products</span>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-soft" />
            <input
              value={query}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products, brands..."
              className="w-full rounded-full border border-line bg-white py-2.5 pr-10 pl-10 text-sm text-ink outline-none focus:border-brand"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-ink-soft hover:text-ink"
                onClick={() => onSearchChange("")}
              >
                <X className="size-4" />
              </button>
            )}
          </label>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {category !== "all" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-deeper">
                {activeCategoryName}
                <button
                  type="button"
                  aria-label="Clear category"
                  onClick={() => selectCategory("all")}
                >
                  <X className="size-3.5" />
                </button>
              </span>
            )}
            {query.trim() && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-deeper">
                Search: {query.trim()}
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => onSearchChange("")}
                >
                  <X className="size-3.5" />
                </button>
              </span>
            )}
            <button
              type="button"
              className="text-xs font-semibold text-brand hover:text-brand-dark"
              onClick={clearFilters}
            >
              Clear all
            </button>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="mt-10 rounded-[2rem] border border-dashed border-line bg-white/70 px-6 py-16 text-center">
            <p className="font-display text-xl font-semibold text-ink">
              No products found
            </p>
            <p className="mt-2 text-ink-soft">
              Try another category or a different search term.
            </p>
            <button
              type="button"
              className="btn-primary mt-6"
              onClick={clearFilters}
            >
              View all products
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-3">
            {filtered.map((product) => (
              <ProductCardCompact key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <div className="container-shell section-pad py-10 md:py-14">
      <nav className="mb-6 text-sm text-ink-soft">
        <Link href="/" className="hover:text-brand">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">Shop</span>
      </nav>

      <Suspense
        fallback={<div className="py-20 text-ink-soft">Loading shop...</div>}
      >
        <ShopCatalog />
      </Suspense>
    </div>
  );
}
