"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { useCatalog } from "@/lib/catalog-provider";

function getMsUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatCountdown(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return { h: pad(h), m: pad(m), s: pad(s) };
}

export function HotDeals() {
  const { products } = useCatalog();
  const deals = products.filter((p) => p.deal).slice(0, 6);

  const [remaining, setRemaining] = useState(() => getMsUntilMidnight());

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(getMsUntilMidnight());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const { h, m, s } = formatCountdown(remaining);

  return (
    <section id="deals" className="atmosphere py-16 md:py-20">
      <div className="container-shell section-pad relative">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold tracking-[0.16em] text-brand uppercase">
              <Flame className="size-4 text-orange-500" />
              🔥 HOT DEALS
            </p>
            <h2 className="section-title mt-2">Limited-time offers</h2>
          </div>

          <div className="shrink-0 rounded-2xl border border-line bg-white/80 px-5 py-3 text-sm font-semibold text-ink shadow-sm">
            <span className="text-ink-soft font-medium">Deals end in:&nbsp;</span>
            <span className="font-display text-brand-deeper tabular-nums">
              {h} <span className="text-ink-soft">:</span> {m}{" "}
              <span className="text-ink-soft">:</span> {s}
            </span>
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((product) => {
            const discountPct =
              product.originalPrice
                ? Math.round((1 - product.price / product.originalPrice) * 100)
                : null;
            const productWithBadge =
              discountPct && !product.badge
                ? { ...product, badge: `${discountPct}% OFF` }
                : product;
            return <ProductCard key={product.id} product={productWithBadge} />;
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <Link href="/shop?deals=true" className="btn-primary">
            Shop All Deals
          </Link>
        </div>
      </div>
    </section>
  );
}
