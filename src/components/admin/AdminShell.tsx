"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Menu } from "lucide-react";
import { Sidebar } from "@/components/admin/Sidebar";
import { AdminButton } from "@/components/admin/ui";
import { useAdminAuth } from "@/lib/admin/auth";
import { useAdminStore } from "@/lib/admin/store";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, isAuthenticated, logout } = useAdminAuth();
  const {
    ready: storeReady,
    usingDatabase,
    error: storeError,
    refresh,
  } = useAdminStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (!ready || isLogin) return;
    if (!isAuthenticated) router.replace("/admin/login");
  }, [ready, isAuthenticated, isLogin, router]);

  useEffect(() => {
    if (!ready || !isLogin) return;
    if (isAuthenticated) router.replace("/admin");
  }, [ready, isAuthenticated, isLogin, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-ink-soft">
        Loading admin...
      </div>
    );
  }

  if (isLogin) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-ink-soft">
        Redirecting to login...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[linear-gradient(180deg,#eef8fc_0%,#f7fbfd_40%,#f4fafc_100%)]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-white/85 px-4 py-3 backdrop-blur-xl md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-xl border border-line text-ink lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="size-5" />
            </button>
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-brand uppercase">
                Admin Panel
              </p>
              <p className="text-sm text-ink-soft">
                Manage products, orders, and store content
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden rounded-xl border border-line px-3 py-2 text-sm font-semibold text-ink-soft hover:border-brand hover:text-brand sm:inline-flex"
            >
              Storefront
            </Link>
            <AdminButton
              variant="secondary"
              type="button"
              onClick={() => {
                logout();
                router.replace("/admin/login");
              }}
            >
              <LogOut className="size-4" />
              Logout
            </AdminButton>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-6 lg:p-8">
          {storeReady && (
            <div
              className={`mb-4 rounded-xl px-4 py-3 text-sm ${
                usingDatabase
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border border-amber-200 bg-amber-50 text-amber-800"
              }`}
            >
              {usingDatabase ? (
                <span>
                  Connected to Supabase. Showing live database content only.
                </span>
              ) : (
                <span>
                  Database not connected.{" "}
                  {storeError ? `${storeError} ` : ""}
                  Run <code className="font-semibold">supabase/schema.sql</code>{" "}
                  then{" "}
                  <button
                    type="button"
                    className="font-semibold underline"
                    onClick={() => void refresh()}
                  >
                    retry
                  </button>
                  .
                </span>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
