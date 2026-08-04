"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AdminButton, Field, TextInput } from "@/components/admin/ui";
import { useAdminAuth } from "@/lib/admin/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const ok = login(email, password);
    if (!ok) {
      setError("Invalid email or password.");
      return;
    }
    router.replace("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(900px_500px_at_20%_0%,rgba(37,150,190,0.2),transparent),linear-gradient(180deg,#eef8fc,#f4fafc)] px-4">
      <div className="w-full max-w-md rounded-3xl border border-line bg-white p-6 shadow-[0_20px_50px_rgba(14,64,84,0.1)] md:p-8">
        <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">
          London Technologies
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink">
          Admin Login
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Sign in to manage products, orders, content, and store settings.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <Field label="Email">
            <TextInput
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </Field>
          <Field label="Password">
            <TextInput
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </Field>
          {error && <p className="text-sm font-medium text-rose-600">{error}</p>}
          <AdminButton type="submit" className="w-full">
            Sign in
          </AdminButton>
        </form>

        <Link
          href="/"
          className="mt-6 inline-flex text-sm font-semibold text-brand hover:text-brand-dark"
        >
          ← Back to storefront
        </Link>
      </div>
    </div>
  );
}
