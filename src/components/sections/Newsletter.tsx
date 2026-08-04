"use client";

import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  }

  return (
    <section className="container-shell section-pad py-10 md:py-14">
      <div className="rounded-[2rem] border border-line bg-white/90 px-6 py-10 md:px-12 md:py-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">
            Newsletter
          </p>
          <h2 className="section-title mt-2">Stay Updated</h2>
          <p className="section-copy mx-auto">
            Receive exclusive offers, product launches, and special discounts.
          </p>

          <form
            onSubmit={onSubmit}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <label className="sr-only" htmlFor="newsletter-email">
              Email Address
            </label>
            <div className="relative flex-1">
              <Mail className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-soft" />
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full rounded-full border border-line bg-surface px-11 py-3.5 text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <button type="submit" className="btn-primary whitespace-nowrap">
              Subscribe
            </button>
          </form>
          {subscribed && (
            <p className="mt-4 text-sm font-medium text-brand-deeper">
              You&apos;re on the list — thanks for subscribing.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
