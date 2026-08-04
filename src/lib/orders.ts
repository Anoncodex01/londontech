import type { CartItem } from "@/lib/cart";
import type { PaymentMethod } from "@/lib/admin/types";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { uid } from "@/lib/admin/utils";

export type CheckoutPayload = {
  customerName: string;
  phone: string;
  email?: string;
  city: string;
  region: string;
  address: string;
  notes?: string;
  payment: PaymentMethod;
  items: CartItem[];
};

export type PlacedOrder = {
  id: string;
  amount: number;
  deliveryEstimate: string;
  status: string;
  createdAt: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  payment: PaymentMethod;
  items: CartItem[];
};

function deliveryEstimateFor(city: string, region: string) {
  const text = `${city} ${region}`.toLowerCase();
  if (text.includes("dar")) return "Dar es Salaam: 1 Day";
  return "Other Regions: 2–5 Business Days";
}

function productSummary(items: CartItem[]) {
  if (items.length === 1) {
    const only = items[0];
    return only.quantity > 1
      ? `${only.name} × ${only.quantity}`
      : only.name;
  }
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
  return `${items[0].name} + ${items.length - 1} more (${totalQty} items)`;
}

export async function placeOrder(
  payload: CheckoutPayload,
): Promise<PlacedOrder> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured.");
  }
  if (payload.items.length === 0) {
    throw new Error("Your cart is empty.");
  }

  const supabase = getSupabase();
  const id = `ORD-${Date.now().toString().slice(-8)}`;
  const amount = payload.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryEstimate = deliveryEstimateFor(payload.city, payload.region);
  const createdAt = new Date().toISOString();

  const orderRow = {
    id,
    customer_name: payload.customerName.trim(),
    phone: payload.phone.trim(),
    city: payload.city.trim(),
    product_name: productSummary(payload.items),
    amount,
    status: "pending",
    payment: payload.payment,
    channel: "website",
    email: payload.email?.trim() || null,
    address: payload.address.trim(),
    region: payload.region.trim(),
    notes: payload.notes?.trim() || null,
    delivery_estimate: deliveryEstimate,
    items: payload.items,
    created_at: createdAt,
  };

  const { error } = await supabase.from("orders").insert(orderRow);
  if (error) throw error;

  const customerId = `CUS-${payload.phone.replace(/\D/g, "").slice(-8) || uid("c")}`;
  const { data: existingCustomer } = await supabase
    .from("customers")
    .select("id, orders, spent, joined_at")
    .eq("id", customerId)
    .maybeSingle();

  await supabase.from("customers").upsert({
    id: customerId,
    name: payload.customerName.trim(),
    phone: payload.phone.trim(),
    email: payload.email?.trim() || null,
    city: payload.city.trim(),
    orders: (existingCustomer?.orders || 0) + 1,
    spent: Number(existingCustomer?.spent || 0) + amount,
    joined_at: existingCustomer?.joined_at || createdAt.slice(0, 10),
  });

  return {
    id,
    amount,
    deliveryEstimate,
    status: "pending",
    createdAt,
    customerName: payload.customerName.trim(),
    phone: payload.phone.trim(),
    city: payload.city.trim(),
    address: payload.address.trim(),
    payment: payload.payment,
    items: payload.items,
  };
}

export async function fetchOrderById(id: string): Promise<PlacedOrder | null> {
  if (!isSupabaseConfigured()) return null;

  const normalized = id.trim();
  if (!normalized) return null;

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", normalized)
    .maybeSingle();

  // Fallback: try uppercase ID (e.g. ord-123 → ORD-123)
  let row = data;
  if ((!row || error) && normalized !== normalized.toUpperCase()) {
    const retry = await supabase
      .from("orders")
      .select("*")
      .eq("id", normalized.toUpperCase())
      .maybeSingle();
    if (!retry.error && retry.data) row = retry.data;
  }

  if (!row) return null;

  return {
    id: row.id,
    amount: Number(row.amount),
    deliveryEstimate: row.delivery_estimate || "2–5 Business Days",
    status: row.status,
    createdAt: row.created_at,
    customerName: row.customer_name,
    phone: row.phone,
    city: row.city,
    address: row.address || "",
    payment: row.payment,
    items: Array.isArray(row.items) ? row.items : [],
  };
}
