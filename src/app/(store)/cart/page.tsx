"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice } from "@/data/catalog";
import { useCart } from "@/lib/cart";

export default function CartPage() {
  const { ready, items, subtotal, setQuantity, removeItem, itemCount } =
    useCart();

  if (!ready) {
    return (
      <div className="container-shell section-pad py-20 text-ink-soft">
        Loading cart...
      </div>
    );
  }

  return (
    <div className="container-shell section-pad py-10 md:py-14">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">
            Your cart
          </p>
          <h1 className="section-title mt-2">
            {itemCount} item{itemCount === 1 ? "" : "s"}
          </h1>
        </div>
        <Link href="/shop" className="btn-secondary">
          Continue shopping
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-[2rem] border border-line bg-white/80 px-6 py-16 text-center">
          <p className="font-display text-2xl font-semibold text-ink">
            Your cart is empty
          </p>
          <p className="mt-2 text-ink-soft">
            Add products from the shop to start your order.
          </p>
          <Link href="/shop" className="btn-primary mt-6 inline-flex">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex flex-col gap-4 rounded-2xl border border-line bg-white/90 p-4 sm:flex-row sm:items-center"
              >
                <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-brand-soft">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/product/${item.productId}`}
                    className="font-display text-lg font-semibold text-ink hover:text-brand"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-ink-soft">
                    {formatPrice(item.price)} each
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center rounded-full border border-line">
                      <button
                        type="button"
                        className="inline-flex size-9 items-center justify-center"
                        onClick={() =>
                          setQuantity(item.productId, item.quantity - 1)
                        }
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="min-w-8 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="inline-flex size-9 items-center justify-center"
                        onClick={() =>
                          setQuantity(item.productId, item.quantity + 1)
                        }
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-600"
                      onClick={() => removeItem(item.productId)}
                    >
                      <Trash2 className="size-4" />
                      Remove
                    </button>
                  </div>
                </div>
                <p className="font-display text-lg font-bold text-brand-deeper sm:text-right">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-[2rem] border border-line bg-white p-6">
            <h2 className="font-display text-xl font-semibold text-ink">
              Order summary
            </h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-ink-soft">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>Delivery</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-base font-semibold text-ink">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>
            <Link href="/checkout" className="btn-primary mt-6 w-full">
              Proceed to checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
