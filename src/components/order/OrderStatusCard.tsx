"use client";

import type { ReactNode } from "react";
import {
  CheckCircle2,
  Clock3,
  Package,
  RefreshCw,
  Truck,
} from "lucide-react";
import { formatPrice } from "@/data/catalog";
import type { PlacedOrder } from "@/lib/orders";

export const ORDER_STEPS = [
  { key: "pending", label: "Order placed", icon: Clock3 },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { key: "processing", label: "Preparing", icon: Package },
  { key: "shipped", label: "Out for delivery", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
] as const;

export function orderStepIndex(status: string) {
  if (status === "cancelled") return -1;
  const idx = ORDER_STEPS.findIndex((step) => step.key === status);
  return idx >= 0 ? idx : 0;
}

type OrderStatusCardProps = {
  order: PlacedOrder;
  title?: string;
  subtitle?: ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
  primaryHref?: string;
  primaryLabel?: string;
};

export function OrderStatusCard({
  order,
  title,
  subtitle,
  refreshing = false,
  onRefresh,
  primaryHref = "/shop",
  primaryLabel = "Continue shopping",
}: OrderStatusCardProps) {
  const active = orderStepIndex(order.status);
  const firstName = order.customerName.split(" ")[0] || "there";

  return (
    <div className="rounded-[2rem] border border-line bg-white p-6 md:p-8">
      <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">
        Order tracking
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold text-ink">
        {title || `Thank you, ${firstName}!`}
      </h1>
      <p className="mt-2 text-ink-soft">
        {subtitle || (
          <>
            Order <span className="font-semibold text-ink">{order.id}</span>{" "}
            status and delivery details.
          </>
        )}
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-brand-soft px-4 py-3">
          <p className="text-xs font-semibold tracking-wide text-brand uppercase">
            Delivery estimate
          </p>
          <p className="mt-1 font-semibold text-brand-deeper">
            {order.deliveryEstimate}
          </p>
        </div>
        <div className="rounded-2xl bg-surface px-4 py-3">
          <p className="text-xs font-semibold tracking-wide text-ink-soft uppercase">
            Payment
          </p>
          <p className="mt-1 font-semibold capitalize text-ink">
            {order.payment.replace("-", " ")}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-lg font-semibold text-ink">
          Delivery progress
        </h2>
        {order.status === "cancelled" ? (
          <p className="mt-3 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            This order was cancelled.
          </p>
        ) : (
          <ol className="mt-4 space-y-3">
            {ORDER_STEPS.map((step, index) => {
              const Icon = step.icon;
              const done = index <= active;
              return (
                <li
                  key={step.key}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 ${
                    done ? "bg-brand-soft text-brand-deeper" : "text-ink-soft"
                  }`}
                >
                  <Icon className={`size-4 ${done ? "text-brand" : ""}`} />
                  <span className="text-sm font-medium">{step.label}</span>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      <div className="mt-8 border-t border-line pt-6">
        <h2 className="font-display text-lg font-semibold text-ink">
          Shipping to
        </h2>
        <p className="mt-2 text-sm text-ink-soft">
          {order.customerName}
          <br />
          {order.phone}
          <br />
          {order.address}
          <br />
          {order.city}
        </p>
      </div>

      <div className="mt-8 border-t border-line pt-6">
        <h2 className="font-display text-lg font-semibold text-ink">Items</h2>
        <ul className="mt-3 space-y-2">
          {order.items.map((item) => (
            <li
              key={item.productId}
              className="flex justify-between gap-3 text-sm"
            >
              <span className="text-ink">
                {item.name} × {item.quantity}
              </span>
              <span className="font-semibold text-ink">
                {formatPrice(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-line pt-3 font-semibold text-ink">
          <span>Total</span>
          <span>{formatPrice(order.amount)}</span>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <a href={primaryHref} className="btn-primary">
          {primaryLabel}
        </a>
        {onRefresh && (
          <button
            type="button"
            className="btn-secondary disabled:opacity-60"
            disabled={refreshing}
            onClick={onRefresh}
          >
            <RefreshCw
              className={`size-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh status"}
          </button>
        )}
      </div>
    </div>
  );
}
