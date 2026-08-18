"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { GitCompareArrows, Plus, Trash2, X } from "lucide-react";
import { formatPrice, type Product } from "@/data/catalog";
import { useCatalog } from "@/lib/catalog-provider";

const STORAGE_KEY = "lt-compare";
const MAX_COMPARE = 4;

function loadCompareIds(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed.slice(0, MAX_COMPARE) : [];
  } catch {
    return [];
  }
}

function saveCompareIds(ids: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.slice(0, MAX_COMPARE)));
}

function CompareContent() {
  const searchParams = useSearchParams();
  const { products, ready } = useCatalog();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [addId, setAddId] = useState("");

  useEffect(() => {
    const fromUrl = searchParams.get("ids")?.split(",").filter(Boolean) ?? [];
    const fromStorage = loadCompareIds();
    const merged = [...new Set([...fromUrl, ...fromStorage])].slice(0, MAX_COMPARE);
    setSelectedIds(merged);
    saveCompareIds(merged);
  }, [searchParams]);

  function updateIds(ids: string[]) {
    const next = ids.slice(0, MAX_COMPARE);
    setSelectedIds(next);
    saveCompareIds(next);
  }

  function removeId(id: string) {
    updateIds(selectedIds.filter((item) => item !== id));
  }

  function addProduct(id: string) {
    if (!id || selectedIds.includes(id)) return;
    if (selectedIds.length >= MAX_COMPARE) return;
    updateIds([...selectedIds, id]);
    setAddId("");
    setPickerOpen(false);
  }

  const selected = useMemo(
    () =>
      selectedIds
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p)),
    [selectedIds, products],
  );

  const available = products.filter((p) => !selectedIds.includes(p.id));

  const specRows = useMemo(() => {
    const labels = new Set<string>();
    selected.forEach((p) => p.specs.forEach((s) => labels.add(s)));
    return Array.from(labels);
  }, [selected]);

  if (!ready) {
    return <p className="py-20 text-ink-soft">Loading products...</p>;
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">
            Compare
          </p>
          <h1 className="section-title mt-2">Product comparison</h1>
          <p className="section-copy">
            Compare up to {MAX_COMPARE} products side by side — price, specs,
            warranty, and ratings.
          </p>
        </div>
        {selected.length < MAX_COMPARE && (
          <button
            type="button"
            className="btn-secondary shrink-0"
            onClick={() => setPickerOpen((v) => !v)}
          >
            <Plus className="size-4" />
            Add product
          </button>
        )}
      </div>

      {pickerOpen && (
        <div className="mt-6 rounded-2xl border border-line bg-white/90 p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={addId}
              onChange={(e) => setAddId(e.target.value)}
              className="flex-1 rounded-xl border border-line bg-brand-soft/40 px-3 py-2.5 text-sm text-ink outline-none focus:border-brand"
            >
              <option value="">Choose a product...</option>
              {available.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {formatPrice(p.price)}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn-primary disabled:opacity-50"
              disabled={!addId}
              onClick={() => addProduct(addId)}
            >
              Add to compare
            </button>
          </div>
        </div>
      )}

      {selected.length === 0 ? (
        <div className="mt-10 rounded-[2rem] border border-dashed border-line bg-white/70 px-6 py-16 text-center">
          <GitCompareArrows className="mx-auto size-10 text-brand" />
          <p className="mt-4 font-display text-xl font-semibold text-ink">
            No products to compare yet
          </p>
          <p className="mt-2 text-ink-soft">
            Browse the shop and add products here, or pick one below.
          </p>
          <Link href="/shop" className="btn-primary mt-6 inline-flex">
            Browse shop
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-8 flex flex-wrap gap-2">
            {selected.map((p) => (
              <span
                key={p.id}
                className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand-deeper"
              >
                {p.name}
                <button
                  type="button"
                  aria-label={`Remove ${p.name}`}
                  onClick={() => removeId(p.id)}
                >
                  <X className="size-3.5" />
                </button>
              </span>
            ))}
            {selected.length > 0 && (
              <button
                type="button"
                className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                onClick={() => updateIds([])}
              >
                Clear all
              </button>
            )}
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white/90">
            <table className="min-w-[640px] w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-brand-soft/60">
                  <th className="px-4 py-4 font-semibold text-ink-soft">Feature</th>
                  {selected.map((product) => (
                    <th key={product.id} className="min-w-[180px] px-4 py-4 align-top">
                      <div className="relative">
                        <button
                          type="button"
                          aria-label={`Remove ${product.name}`}
                          className="absolute -top-1 -right-1 text-ink-soft hover:text-rose-600"
                          onClick={() => removeId(product.id)}
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                        <div
                          className="relative mx-auto mb-2 size-16 overflow-hidden rounded-xl"
                          style={{
                            background: `linear-gradient(135deg, ${product.accent}, #0e4054)`,
                          }}
                        >
                          {(product.imageUrls?.[0] || product.imageUrl) && (
                            <Image
                              src={product.imageUrls?.[0] || product.imageUrl || ""}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          )}
                        </div>
                        <Link
                          href={`/product/${product.id}`}
                          className="font-display text-sm font-semibold text-ink hover:text-brand"
                        >
                          {product.name}
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-line">
                  <td className="px-4 py-3 font-medium text-ink-soft">Price</td>
                  {selected.map((p) => (
                    <td key={p.id} className="px-4 py-3 font-semibold text-brand-deeper">
                      {formatPrice(p.price)}
                      {p.originalPrice && (
                        <span className="mt-0.5 block text-xs font-normal text-ink-soft line-through">
                          {formatPrice(p.originalPrice)}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-line">
                  <td className="px-4 py-3 font-medium text-ink-soft">Brand</td>
                  {selected.map((p) => (
                    <td key={p.id} className="px-4 py-3 text-ink">
                      {p.brand}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-line">
                  <td className="px-4 py-3 font-medium text-ink-soft">Category</td>
                  {selected.map((p) => (
                    <td key={p.id} className="px-4 py-3 text-ink">
                      {p.category}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-line">
                  <td className="px-4 py-3 font-medium text-ink-soft">Rating</td>
                  {selected.map((p) => (
                    <td key={p.id} className="px-4 py-3 text-ink">
                      {p.rating} / 5 ({p.reviews})
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-line">
                  <td className="px-4 py-3 font-medium text-ink-soft">Warranty</td>
                  {selected.map((p) => (
                    <td key={p.id} className="px-4 py-3 text-ink">
                      {p.warranty}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-line">
                  <td className="px-4 py-3 font-medium text-ink-soft">Delivery</td>
                  {selected.map((p) => (
                    <td key={p.id} className="px-4 py-3 text-ink">
                      {p.delivery}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-line">
                  <td className="px-4 py-3 font-medium text-ink-soft">Stock</td>
                  {selected.map((p) => (
                    <td key={p.id} className="px-4 py-3 capitalize text-ink">
                      {p.stock.replace("-", " ")}
                    </td>
                  ))}
                </tr>
                {specRows.map((spec) => (
                  <tr key={spec} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 font-medium text-ink-soft">{spec}</td>
                    {selected.map((p) => (
                      <td key={p.id} className="px-4 py-3 text-ink">
                        {p.specs.includes(spec) ? "✓" : "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}

export default function ComparePage() {
  return (
    <div className="container-shell section-pad py-10 md:py-14">
      <nav className="mb-6 text-sm text-ink-soft">
        <Link href="/" className="hover:text-brand">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">Compare</span>
      </nav>

      <Suspense fallback={<p className="py-20 text-ink-soft">Loading compare...</p>}>
        <CompareContent />
      </Suspense>
    </div>
  );
}
