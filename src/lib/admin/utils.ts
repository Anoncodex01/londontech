export function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function statusTone(status: string) {
  const key = status.toLowerCase();
  if (
    ["delivered", "completed", "published", "active", "in-stock", "confirmed"].includes(
      key,
    )
  ) {
    return "bg-emerald-50 text-emerald-700";
  }
  if (
    ["pending", "requested", "draft", "limited", "processing", "scheduled"].includes(
      key,
    )
  ) {
    return "bg-amber-50 text-amber-700";
  }
  if (["cancelled", "hidden", "out-of-stock"].includes(key)) {
    return "bg-rose-50 text-rose-700";
  }
  return "bg-sky-50 text-sky-700";
}
