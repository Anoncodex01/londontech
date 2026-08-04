"use client";

import { GitCompareArrows } from "lucide-react";
import { formatPrice } from "@/data/catalog";
import { useCatalog } from "@/lib/catalog-provider";

export function Compare() {
  const { products } = useCatalog();
  const sample = products.slice(0, 3);

  return (
    <section id="compare" className="container-shell section-pad py-16 md:py-20">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">
          Product Comparison
        </p>
        <h2 className="section-title mt-2">
          Not sure which product is right for you?
        </h2>
        <p className="section-copy">
          Compare specifications, features, prices, warranty, and customer
          ratings side by side before making your decision.
        </p>
      </div>

      <div className="mt-10 overflow-x-auto rounded-2xl border border-line bg-white/90">
        <table className="min-w-[720px] w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-brand-soft/60">
              <th className="px-4 py-4 font-semibold text-ink-soft">Feature</th>
              {sample.map((product) => (
                <th key={product.id} className="px-4 py-4 font-display font-semibold text-ink">
                  {product.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-line">
              <td className="px-4 py-3 font-medium text-ink-soft">Price</td>
              {sample.map((p) => (
                <td key={p.id} className="px-4 py-3 font-semibold text-brand-deeper">
                  {formatPrice(p.price)}
                </td>
              ))}
            </tr>
            <tr className="border-b border-line">
              <td className="px-4 py-3 font-medium text-ink-soft">Rating</td>
              {sample.map((p) => (
                <td key={p.id} className="px-4 py-3 text-ink">
                  {p.rating} / 5
                </td>
              ))}
            </tr>
            <tr className="border-b border-line">
              <td className="px-4 py-3 font-medium text-ink-soft">Warranty</td>
              {sample.map((p) => (
                <td key={p.id} className="px-4 py-3 text-ink">
                  {p.warranty}
                </td>
              ))}
            </tr>
            <tr className="border-b border-line">
              <td className="px-4 py-3 font-medium text-ink-soft">Stock</td>
              {sample.map((p) => (
                <td key={p.id} className="px-4 py-3 capitalize text-ink">
                  {p.stock.replace("-", " ")}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-ink-soft">Key Specs</td>
              {sample.map((p) => (
                <td key={p.id} className="px-4 py-3 text-ink-soft">
                  {p.specs.slice(0, 2).join(" · ")}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <a href="#featured" className="btn-primary">
          <GitCompareArrows className="size-4" />
          Compare Products
        </a>
      </div>
    </section>
  );
}
