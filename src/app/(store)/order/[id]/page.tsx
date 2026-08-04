"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { OrderStatusCard } from "@/components/order/OrderStatusCard";
import { fetchOrderById, type PlacedOrder } from "@/lib/orders";

export default function OrderPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(
    async (mode: "initial" | "refresh" = "initial") => {
      if (mode === "refresh") setRefreshing(true);
      else setLoading(true);
      setError("");
      try {
        const data = await fetchOrderById(params.id);
        setOrder(data);
        if (!data) setError("Order not found.");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [params.id],
  );

  useEffect(() => {
    void load("initial");
  }, [load]);

  if (loading) {
    return (
      <div className="container-shell section-pad py-20 text-ink-soft">
        Loading order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-shell section-pad py-20">
        <h1 className="font-display text-3xl font-bold text-ink">
          {error || "Order not found"}
        </h1>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/track" className="btn-primary inline-flex">
            Track another order
          </Link>
          <Link href="/" className="btn-secondary inline-flex">
            Back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-shell section-pad py-10 md:py-14">
      <div className="mx-auto max-w-3xl">
        <OrderStatusCard
          order={order}
          title={`Thank you, ${order.customerName.split(" ")[0]}!`}
          subtitle={
            <>
              Order <span className="font-semibold text-ink">{order.id}</span>{" "}
              has been placed successfully.
            </>
          }
          refreshing={refreshing}
          onRefresh={() => void load("refresh")}
        />
      </div>
    </div>
  );
}
