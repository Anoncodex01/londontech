"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { PackageSearch } from "lucide-react";
import { OrderStatusCard } from "@/components/order/OrderStatusCard";
import { fetchOrderById, type PlacedOrder } from "@/lib/orders";

function normalizeOrderId(value: string) {
  return value.trim().toUpperCase();
}

function TrackOrderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";

  const [query, setQuery] = useState(initialId);
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [loading, setLoading] = useState(Boolean(initialId));
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(Boolean(initialId));

  const lookup = useCallback(async (rawId: string, mode: "search" | "refresh") => {
    const id = normalizeOrderId(rawId);
    if (!id) {
      setError("Enter your order ID to track it.");
      setOrder(null);
      return;
    }

    if (mode === "refresh") setRefreshing(true);
    else setLoading(true);
    setError("");
    setSearched(true);

    try {
      const data = await fetchOrderById(id);
      setOrder(data);
      if (!data) {
        setError(
          `No order found for “${id}”. Check the ID from your confirmation email or WhatsApp message.`,
        );
      } else {
        router.replace(`/track?id=${encodeURIComponent(data.id)}`, {
          scroll: false,
        });
      }
    } catch (err) {
      setOrder(null);
      setError(err instanceof Error ? err.message : "Could not look up this order.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    if (initialId) {
      void lookup(initialId, "search");
    }
    // Only run for the URL id on first mount / when it changes from outside.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialId]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void lookup(query, "search");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-[2rem] border border-line bg-white p-6 md:p-8">
        <div className="flex items-start gap-3">
          <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-brand-soft text-brand">
            <PackageSearch className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">
              Track order
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold text-ink">
              Check your delivery status
            </h1>
            <p className="mt-2 text-ink-soft">
              Enter the order ID from your confirmation (for example{" "}
              <span className="font-semibold text-ink">ORD-12345678</span>).
            </p>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <label className="flex-1">
            <span className="sr-only">Order ID</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ORD-12345678"
              autoComplete="off"
              className="w-full rounded-xl border border-line bg-brand-soft/40 px-4 py-3 text-ink outline-none focus:border-brand"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-60"
          >
            {loading ? "Searching..." : "Track order"}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </p>
        )}
      </div>

      {loading && !order && (
        <p className="mt-6 text-center text-ink-soft">Looking up your order...</p>
      )}

      {order && (
        <div className="mt-8">
          <OrderStatusCard
            order={order}
            title="Order found"
            subtitle={
              <>
                Showing the latest status for{" "}
                <span className="font-semibold text-ink">{order.id}</span>.
              </>
            }
            refreshing={refreshing}
            onRefresh={() => void lookup(order.id, "refresh")}
            primaryHref="/track"
            primaryLabel="Track another order"
          />
        </div>
      )}

      {searched && !loading && !order && !error && (
        <p className="mt-6 text-center text-ink-soft">No order to display yet.</p>
      )}

      <p className="mt-8 text-center text-sm text-ink-soft">
        Need help?{" "}
        <Link href="/contact" className="font-semibold text-brand hover:text-brand-dark">
          Contact us
        </Link>
      </p>
    </div>
  );
}

export default function TrackPage() {
  return (
    <div className="container-shell section-pad py-10 md:py-14">
      <Suspense
        fallback={
          <div className="mx-auto max-w-3xl text-ink-soft">Loading tracker...</div>
        }
      >
        <TrackOrderForm />
      </Suspense>
    </div>
  );
}
