import type { Product, StockStatus } from "@/data/catalog";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "mobile-money" | "bank-transfer" | "cash-on-delivery";

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  active: boolean;
};

export type AdminBrand = {
  id: string;
  name: string;
  active: boolean;
};

export type AdminOrder = {
  id: string;
  customerName: string;
  phone: string;
  city: string;
  productName: string;
  amount: number;
  status: OrderStatus;
  payment: PaymentMethod;
  channel: "website" | "whatsapp" | "phone";
  createdAt: string;
  email?: string;
  address?: string;
  region?: string;
  notes?: string;
  deliveryEstimate?: string;
};

export type AdminCustomer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  orders: number;
  spent: number;
  joinedAt: string;
};

export type AdminReview = {
  id: string;
  name: string;
  city: string;
  rating: number;
  text: string;
  productName: string;
  status: "published" | "pending" | "hidden";
  createdAt: string;
};

export type AdminInstallation = {
  id: string;
  customerName: string;
  phone: string;
  service: string;
  city: string;
  preferredDate: string;
  status: "requested" | "scheduled" | "completed" | "cancelled";
  notes: string;
};

export type AdminBlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  status: "published" | "draft";
  createdAt: string;
};

export type AdminFaq = {
  id: string;
  question: string;
  answer: string;
  active: boolean;
};

export type AdminSubscriber = {
  id: string;
  email: string;
  subscribedAt: string;
  active: boolean;
};

export type AdminSettings = {
  storeName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  weekdayHours: string;
  sundayHours: string;
  deliveryDar: string;
  deliveryRegions: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  youtube: string;
  linkedin: string;
};

export type AdminProduct = Product & {
  quantity: number;
  active: boolean;
};

export type AdminState = {
  products: AdminProduct[];
  categories: AdminCategory[];
  brands: AdminBrand[];
  orders: AdminOrder[];
  customers: AdminCustomer[];
  reviews: AdminReview[];
  installations: AdminInstallation[];
  blogPosts: AdminBlogPost[];
  faqs: AdminFaq[];
  subscribers: AdminSubscriber[];
  settings: AdminSettings;
};

export type { StockStatus, Product };
