"use client";

import { useMemo, useState } from "react";
import { formatPrice } from "@/data/catalog";
import {
  AdminButton,
  AdminTable,
  EmptyState,
  PageHeader,
  Panel,
  StatusBadge,
  TableWrap,
  Td,
  TextSelect,
  Th,
} from "@/components/admin/ui";
import { useAdminStore } from "@/lib/admin/store";
import type { OrderStatus } from "@/lib/admin/types";
import { formatDate } from "@/lib/admin/utils";

const statuses: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrdersPage() {
  const { data, ready, updateOrder, deleteOrder } = useAdminStore();
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");

  const orders = useMemo(() => {
    if (filter === "all") return data.orders;
    return data.orders.filter((order) => order.status === filter);
  }, [data.orders, filter]);

  if (!ready) return null;

  return (
    <div>
      <PageHeader
        title="Orders"
        description="Track WhatsApp, website, and phone orders across Tanzania."
        actions={
          <TextSelect
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | OrderStatus)}
          >
            <option value="all">All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </TextSelect>
        }
      />

      <Panel>
        <TableWrap>
          <AdminTable>
            <thead>
              <tr>
                <Th>Order</Th>
                <Th>Customer</Th>
                <Th>Product</Th>
                <Th>Amount</Th>
                <Th>Channel</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <Td>
                    <div className="font-semibold">{order.id}</div>
                    <div className="text-xs text-ink-soft">
                      {formatDate(order.createdAt)}
                    </div>
                  </Td>
                  <Td>
                    <div className="font-medium">{order.customerName}</div>
                    <div className="text-xs text-ink-soft">
                      {order.phone} · {order.city}
                    </div>
                    {order.address && (
                      <div className="mt-1 max-w-[220px] text-xs text-ink-soft">
                        {order.address}
                      </div>
                    )}
                    {order.deliveryEstimate && (
                      <div className="mt-1 text-xs font-medium text-brand">
                        {order.deliveryEstimate}
                      </div>
                    )}
                  </Td>
                  <Td>{order.productName}</Td>
                  <Td>{formatPrice(order.amount)}</Td>
                  <Td className="capitalize">{order.channel}</Td>
                  <Td>
                    <div className="space-y-2">
                      <StatusBadge status={order.status} />
                      <TextSelect
                        value={order.status}
                        onChange={(e) =>
                          updateOrder({
                            ...order,
                            status: e.target.value as OrderStatus,
                          })
                        }
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </TextSelect>
                    </div>
                  </Td>
                  <Td>
                    <AdminButton
                      variant="danger"
                      type="button"
                      onClick={() => deleteOrder(order.id)}
                    >
                      Delete
                    </AdminButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </AdminTable>
        </TableWrap>
        {orders.length === 0 && <EmptyState message="No orders found." />}
      </Panel>
    </div>
  );
}
