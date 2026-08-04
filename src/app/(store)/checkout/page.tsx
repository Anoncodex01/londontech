"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { formatPrice } from "@/data/catalog";
import type { PaymentMethod } from "@/lib/admin/types";
import { useCart } from "@/lib/cart";
import { placeOrder } from "@/lib/orders";

const payments: { value: PaymentMethod; label: string }[] = [
  { value: "mobile-money", label: "Mobile Money" },
  { value: "bank-transfer", label: "Bank Transfer" },
  { value: "cash-on-delivery", label: "Cash on Delivery" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { ready, items, subtotal, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    city: "Dar es Salaam",
    region: "Dar es Salaam",
    address: "",
    notes: "",
    payment: "mobile-money" as PaymentMethod,
  });

  if (!ready) {
    return (
      <div className="container-shell section-pad py-20 text-ink-soft">
        Loading checkout...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-shell section-pad py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-ink">
          Nothing to checkout
        </h1>
        <p className="mt-2 text-ink-soft">Add products to your cart first.</p>
        <Link href="/shop" className="btn-primary mt-6 inline-flex">
          Browse products
        </Link>
      </div>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const order = await placeOrder({
        ...form,
        items,
      });
      clearCart();
      router.push(`/order/${order.id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not place order. Run extend-orders-checkout.sql if needed.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container-shell section-pad py-10 md:py-14">
      <div className="mb-8">
        <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">
          Checkout
        </p>
        <h1 className="section-title mt-2">Delivery & payment</h1>
        <p className="section-copy">
          Confirm your details and we&apos;ll process your order for nationwide
          delivery.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]"
      >
        <div className="space-y-6 rounded-[2rem] border border-line bg-white/90 p-5 md:p-7">
          <h2 className="font-display text-xl font-semibold text-ink">
            Customer details
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5 text-sm sm:col-span-2">
              <span className="font-medium text-ink">Full name</span>
              <input
                required
                className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                value={form.customerName}
                onChange={(e) =>
                  setForm({ ...form, customerName: e.target.value })
                }
              />
            </label>
            <label className="block space-y-1.5 text-sm">
              <span className="font-medium text-ink">Phone / WhatsApp</span>
              <input
                required
                className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </label>
            <label className="block space-y-1.5 text-sm">
              <span className="font-medium text-ink">Email (optional)</span>
              <input
                type="email"
                className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
            <label className="block space-y-1.5 text-sm">
              <span className="font-medium text-ink">City</span>
              <input
                required
                className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </label>
            <label className="block space-y-1.5 text-sm">
              <span className="font-medium text-ink">Region</span>
              <input
                required
                className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
              />
            </label>
            <label className="block space-y-1.5 text-sm sm:col-span-2">
              <span className="font-medium text-ink">Delivery address</span>
              <textarea
                required
                rows={3}
                className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Street, landmark, building..."
              />
            </label>
            <label className="block space-y-1.5 text-sm sm:col-span-2">
              <span className="font-medium text-ink">Order notes (optional)</span>
              <textarea
                rows={2}
                className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </label>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold text-ink">
              Payment method
            </h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {payments.map((method) => (
                <label
                  key={method.value}
                  className={`cursor-pointer rounded-xl border px-3 py-3 text-sm font-medium ${
                    form.payment === method.value
                      ? "border-brand bg-brand-soft text-brand-deeper"
                      : "border-line bg-white text-ink-soft"
                  }`}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    name="payment"
                    checked={form.payment === method.value}
                    onChange={() =>
                      setForm({ ...form, payment: method.value })
                    }
                  />
                  {method.label}
                </label>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm font-medium text-rose-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full disabled:opacity-60"
          >
            {submitting ? "Placing order..." : "Place order"}
          </button>
        </div>

        <aside className="h-fit rounded-[2rem] border border-line bg-white p-6">
          <h2 className="font-display text-xl font-semibold text-ink">
            Your items
          </h2>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-3">
                <div className="relative size-14 overflow-hidden rounded-lg bg-brand-soft">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">
                    {item.name}
                  </p>
                  <p className="text-xs text-ink-soft">Qty {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-ink">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-line pt-4">
            <div className="flex justify-between text-base font-semibold text-ink">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-2 text-xs text-ink-soft">
              Dar es Salaam: 1 Day · Other regions: 2–5 Business Days
            </p>
          </div>
          <Link
            href="/cart"
            className="mt-4 inline-flex text-sm font-semibold text-brand"
          >
            ← Edit cart
          </Link>
        </aside>
      </form>
    </div>
  );
}
