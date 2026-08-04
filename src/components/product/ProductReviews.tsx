"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, Star } from "lucide-react";
import type { AdminReview } from "@/lib/admin/types";
import { formatDate } from "@/lib/admin/utils";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  fetchPublishedReviews,
  submitStorefrontReview,
} from "@/lib/supabase/api";

type ProductReviewsProps = {
  productName: string;
  rating: number;
  reviewCount: number;
};

type FormState = {
  name: string;
  city: string;
  rating: number;
  text: string;
};

const emptyForm: FormState = {
  name: "",
  city: "",
  rating: 5,
  text: "",
};

const LOCAL_KEY = "lt-product-reviews";

function loadLocalReviews(productName: string): AdminReview[] {
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    const all = JSON.parse(raw) as AdminReview[];
    return all.filter((review) => review.productName === productName);
  } catch {
    return [];
  }
}

function saveLocalReview(review: AdminReview) {
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    const all = raw ? (JSON.parse(raw) as AdminReview[]) : [];
    all.unshift(review);
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(all.slice(0, 50)));
  } catch {
    // ignore quota / private mode failures
  }
}

export function ProductReviews({
  productName,
  rating,
  reviewCount,
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [pendingLocal, setPendingLocal] = useState<AdminReview[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      setSubmitted(false);
      setForm(emptyForm);
      setPendingLocal(loadLocalReviews(productName));

      if (!isSupabaseConfigured()) {
        if (!cancelled) {
          setReviews([]);
          setLoading(false);
        }
        return;
      }

      try {
        const published = await fetchPublishedReviews(productName);
        if (!cancelled) setReviews(published);
      } catch {
        if (!cancelled) setReviews([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [productName]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.city.trim() || !form.text.trim()) {
      setError("Please fill in your name, city, and review.");
      return;
    }

    setSubmitting(true);
    try {
      if (isSupabaseConfigured()) {
        await submitStorefrontReview({
          name: form.name,
          city: form.city,
          rating: form.rating,
          text: form.text,
          productName,
        });
      } else {
        const localReview: AdminReview = {
          id: `rev-local-${Date.now().toString(36)}`,
          name: form.name.trim(),
          city: form.city.trim(),
          rating: form.rating,
          text: form.text.trim(),
          productName,
          status: "pending",
          createdAt: new Date().toISOString(),
        };
        saveLocalReview(localReview);
        setPendingLocal((prev) => [localReview, ...prev]);
      }

      setForm(emptyForm);
      setSubmitted(true);
    } catch {
      setError("Could not submit your review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const visible = [
    ...reviews,
    ...pendingLocal.filter(
      (local) => !reviews.some((published) => published.id === local.id),
    ),
  ];

  return (
    <section className="mt-16 border-t border-line pt-12 md:mt-20 md:pt-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">
            Customer Reviews
          </p>
          <h2 className="section-title mt-2">Ratings & reviews</h2>
          <p className="section-copy">
            Share your experience with {productName}. New reviews are moderated
            before they appear publicly.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl border border-line bg-white/90 px-4 py-3 text-sm text-ink-soft">
          <Star className="size-5 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-ink">{rating.toFixed(1)}</span>
          <span>· {reviewCount} reviews</span>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          {loading ? (
            <p className="text-ink-soft">Loading reviews...</p>
          ) : visible.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-white/70 p-6 text-ink-soft">
              No published reviews for this product yet. Be the first to write
              one.
            </div>
          ) : (
            visible.map((review) => (
              <figure
                key={review.id}
                className="rounded-2xl border border-line bg-white/90 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex gap-1 text-amber-400">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="size-4 fill-current" />
                    ))}
                  </div>
                  {review.status === "pending" && (
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                      Awaiting moderation
                    </span>
                  )}
                </div>
                <blockquote className="mt-3 text-base leading-relaxed text-ink">
                  “{review.text}”
                </blockquote>
                <figcaption className="mt-3 text-sm text-ink-soft">
                  <span className="font-semibold text-ink">{review.name}</span>
                  {" · "}
                  {review.city}
                  {" · "}
                  {formatDate(review.createdAt)}
                </figcaption>
              </figure>
            ))
          )}
        </div>

        <div className="rounded-[1.75rem] border border-line bg-white/90 p-5 md:p-6">
          <h3 className="font-display text-xl font-bold text-ink">
            Write a review
          </h3>
          <p className="mt-1 text-sm text-ink-soft">
            Tell others what you liked about this product.
          </p>

          {submitted ? (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
              <div>
                <p className="font-semibold">Thanks for your review</p>
                <p className="mt-1">
                  It has been submitted and will appear after moderation.
                </p>
                <button
                  type="button"
                  className="mt-3 font-semibold text-brand hover:text-brand-dark"
                  onClick={() => setSubmitted(false)}
                >
                  Write another review
                </button>
              </div>
            </div>
          ) : (
            <form className="mt-5 space-y-4" onSubmit={onSubmit}>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink">
                  Your name
                </span>
                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full rounded-xl border border-line bg-brand-soft/40 px-3.5 py-2.5 text-ink outline-none focus:border-brand"
                  placeholder="e.g. Amina J."
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink">
                  City
                </span>
                <input
                  required
                  value={form.city}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, city: e.target.value }))
                  }
                  className="w-full rounded-xl border border-line bg-brand-soft/40 px-3.5 py-2.5 text-ink outline-none focus:border-brand"
                  placeholder="e.g. Dar es Salaam"
                />
              </label>

              <fieldset>
                <legend className="mb-1.5 text-sm font-semibold text-ink">
                  Rating
                </legend>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, rating: value }))
                      }
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${
                        form.rating === value
                          ? "border-brand bg-brand-soft text-brand-deeper"
                          : "border-line bg-white text-ink-soft hover:border-brand"
                      }`}
                      aria-label={`${value} star${value === 1 ? "" : "s"}`}
                      aria-pressed={form.rating === value}
                    >
                      <Star
                        className={`size-3.5 ${
                          form.rating >= value
                            ? "fill-amber-400 text-amber-400"
                            : "text-ink-soft"
                        }`}
                      />
                      {value}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink">
                  Your review
                </span>
                <textarea
                  required
                  rows={4}
                  value={form.text}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, text: e.target.value }))
                  }
                  className="w-full resize-y rounded-xl border border-line bg-brand-soft/40 px-3.5 py-2.5 text-ink outline-none focus:border-brand"
                  placeholder="What stood out about quality, delivery, or support?"
                />
              </label>

              {error && (
                <p className="text-sm font-medium text-rose-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit review"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
