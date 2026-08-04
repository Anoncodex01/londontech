import type { AdminState } from "@/lib/admin/types";

export const ADMIN_AUTH_KEY = "lt-admin-auth";

export const DEMO_ADMIN = {
  email: "admin@londontechnologies.co.tz",
  password: "london2026",
};

export function createEmptyState(): AdminState {
  return {
    products: [],
    categories: [],
    brands: [],
    orders: [],
    customers: [],
    reviews: [],
    installations: [],
    blogPosts: [],
    faqs: [],
    subscribers: [],
    settings: {
      storeName: "London Technologies",
      tagline: "Smart Technology. Trusted Quality.",
      phone: "",
      whatsapp: "",
      email: "",
      weekdayHours: "Monday – Saturday · 8:00 AM – 8:00 PM",
      sundayHours: "Sunday · 10:00 AM – 5:00 PM",
      deliveryDar: "Dar es Salaam: 1 Day",
      deliveryRegions: "Other Regions: 2–5 Days",
      instagram: "#",
      facebook: "#",
      tiktok: "#",
      youtube: "#",
      linkedin: "#",
    },
  };
}
