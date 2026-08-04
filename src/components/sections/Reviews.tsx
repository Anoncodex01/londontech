"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { reviews as fallbackReviews } from "@/data/catalog";
import type { AdminReview } from "@/lib/admin/types";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { fetchPublishedReviews } from "@/lib/supabase/api";

type DisplayReview = {
  id: string;
  name: string;
  city: string;
  rating: number;
  text: string;
  productName?: string;
};

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function toDisplay(reviews: AdminReview[]): DisplayReview[] {
  return reviews.map((review) => ({
    id: review.id,
    name: review.name,
    city: review.city,
    rating: review.rating,
    text: review.text,
    productName: review.productName,
  }));
}

const seedReviews: DisplayReview[] = fallbackReviews.map((review, index) => ({
  id: `seed-${index}`,
  name: review.name,
  city: review.city,
  rating: review.rating,
  text: review.text,
}));

export function Reviews() {
  const [items, setItems] = useState<DisplayReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        if (!isSupabaseConfigured()) {
          if (!cancelled) setItems(shuffle(seedReviews).slice(0, 4));
          return;
        }

        const published = await fetchPublishedReviews();
        if (cancelled) return;

        if (published.length > 0) {
          // Newest first, then shuffle within a larger pool so the homepage
          // rotates which reviews show each visit while staying fresh.
          const pool = published.slice(0, 12);
          setItems(shuffle(toDisplay(pool)).slice(0, 4));
        } else {
          setItems(shuffle(seedReviews).slice(0, 4));
        }
      } catch {
        if (!cancelled) setItems(shuffle(seedReviews).slice(0, 4));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-white/50 py-16 md:py-20">
      <div className="container-shell section-pad">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">
              Customer Reviews
            </p>
            <h2 className="section-title mt-2">Loved across Tanzania</h2>
          </div>
          <Link href="/shop" className="btn-secondary">
            Shop products
          </Link>
        </div>

        {loading ? (
          <p className="mt-10 text-ink-soft">Loading reviews...</p>
        ) : items.length === 0 ? (
          <p className="mt-10 text-ink-soft">
            No published reviews yet. Publish reviews in admin to show them here.
          </p>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {items.map((review) => (
              <figure
                key={review.id}
                className="rounded-2xl border border-line bg-white/90 p-5"
              >
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 text-base leading-relaxed text-ink">
                  “{review.text}”
                </blockquote>
                <figcaption className="mt-4 text-sm text-ink-soft">
                  <span className="font-semibold text-ink">{review.name}</span>
                  {" · "}
                  {review.city}
                  {review.productName ? (
                    <>
                      <br />
                      <span className="text-xs">{review.productName}</span>
                    </>
                  ) : null}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
