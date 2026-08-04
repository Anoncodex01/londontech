"use client";

import Link from "next/link";
import { formatPrice } from "@/data/catalog";
import {
  AdminTable,
  PageHeader,
  Panel,
  StatCard,
  StatusBadge,
  Td,
  Th,
  TableWrap,
} from "@/components/admin/ui";
import { useAdminStore } from "@/lib/admin/store";
import { formatDate } from "@/lib/admin/utils";

export default function AdminDashboardPage() {
  const { data, ready } = useAdminStore();

  if (!ready) return null;

  const revenue = data.orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + order.amount, 0);
  const pendingOrders = data.orders.filter((order) =>
    ["pending", "confirmed", "processing"].includes(order.status),
  ).length;
  const lowStock = data.products.filter(
    (product) => product.stock !== "in-stock" || product.quantity < 8,
  ).length;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of store performance, inventory, and customer activity."
        actions={
          <Link
            href="/admin/products"
            className="inline-flex rounded-xl bg-brand px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Manage products
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Revenue"
          value={formatPrice(revenue)}
          hint="Non-cancelled orders"
        />
        <StatCard
          label="Orders"
          value={data.orders.length}
          hint={`${pendingOrders} need attention`}
        />
        <StatCard
          label="Products"
          value={data.products.length}
          hint={`${lowStock} low / limited stock`}
        />
        <StatCard
          label="Customers"
          value={data.customers.length}
          hint={`${data.subscribers.filter((s) => s.active).length} newsletter subscribers`}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel>
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-display text-lg font-semibold text-ink">
              Recent orders
            </h2>
            <Link href="/admin/orders" className="text-sm font-semibold text-brand">
              View all
            </Link>
          </div>
          <TableWrap>
            <AdminTable>
              <thead>
                <tr>
                  <Th>Order</Th>
                  <Th>Customer</Th>
                  <Th>Amount</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {data.orders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <Td>
                      <div className="font-semibold">{order.id}</div>
                      <div className="text-xs text-ink-soft">
                        {formatDate(order.createdAt)}
                      </div>
                    </Td>
                    <Td>{order.customerName}</Td>
                    <Td>{formatPrice(order.amount)}</Td>
                    <Td>
                      <StatusBadge status={order.status} />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </AdminTable>
          </TableWrap>
        </Panel>

        <Panel>
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-display text-lg font-semibold text-ink">
              Quick modules
            </h2>
          </div>
          <div className="grid gap-3 p-5 sm:grid-cols-2">
            {[
              ["/admin/deals", "Hot deals", `${data.products.filter((p) => p.deal).length} active`],
              ["/admin/reviews", "Reviews", `${data.reviews.filter((r) => r.status === "pending").length} pending`],
              ["/admin/installations", "Installations", `${data.installations.filter((i) => i.status === "requested").length} requests`],
              ["/admin/blog", "Blog", `${data.blogPosts.length} articles`],
              ["/admin/faqs", "FAQs", `${data.faqs.length} items`],
              ["/admin/settings", "Settings", "Store contacts & hours"],
            ].map(([href, title, meta]) => (
              <Link
                key={href}
                href={href}
                className="rounded-xl border border-line px-4 py-3 transition hover:border-brand hover:bg-brand-soft/50"
              >
                <p className="font-semibold text-ink">{title}</p>
                <p className="text-sm text-ink-soft">{meta}</p>
              </Link>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
