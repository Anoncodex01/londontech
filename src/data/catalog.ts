export type StockStatus = "in-stock" | "limited" | "out-of-stock";

export type Product = {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  stock: StockStatus;
  warranty: string;
  delivery: string;
  badge?: string;
  accent: string;
  specs: string[];
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  deal?: boolean;
  /** Cover / primary image (first of imageUrls). */
  imageUrl?: string;
  /** Full gallery of product photos. */
  imageUrls?: string[];
};

export const categories = [
  { name: "Smart Projectors", slug: "smart-projectors", icon: "Projector" },
  { name: "CCTV & Security Cameras", slug: "cctv-security", icon: "Camera" },
  { name: "Wi-Fi Routers & Networking", slug: "networking", icon: "Wifi" },
  { name: "Gaming Consoles", slug: "gaming", icon: "Gamepad2" },
  { name: "Smart Home Devices", slug: "smart-home", icon: "Home" },
  { name: "LED Smart Lighting", slug: "led-lighting", icon: "Lightbulb" },
  { name: "Bluetooth Speakers", slug: "speakers", icon: "Speaker" },
  { name: "Walkie Talkies", slug: "walkie-talkies", icon: "Radio" },
  { name: "Computer Accessories", slug: "computer", icon: "Keyboard" },
  { name: "Mobile Accessories", slug: "mobile", icon: "Smartphone" },
  { name: "Smart Watches", slug: "smart-watches", icon: "Watch" },
  { name: "Health & Fitness", slug: "health-fitness", icon: "HeartPulse" },
] as const;

export const brands = [
  "London Technologies",
  "Xiaomi",
  "Hikvision",
  "TP-Link",
  "V380",
  "Lenovo",
  "JBL",
  "Sony",
  "Oraimo",
  "Baseus",
] as const;

export const products: Product[] = [
  {
    id: "a10-plus",
    name: "A10 Plus Smart Projector",
    category: "Smart Projectors",
    brand: "London Technologies",
    price: 289000,
    originalPrice: 349000,
    rating: 4.9,
    reviews: 128,
    stock: "in-stock",
    warranty: "12 months",
    delivery: "1–3 days",
    badge: "Best Seller",
    accent: "#2596be",
    specs: ["Native 1080P", "Android OS", "Wi-Fi & Bluetooth", "Auto Keystone"],
    featured: true,
    bestSeller: true,
    deal: true,
  },
  {
    id: "v380-pro",
    name: "V380 Pro Camera",
    category: "CCTV & Security Cameras",
    brand: "V380",
    price: 75000,
    originalPrice: 95000,
    rating: 4.7,
    reviews: 214,
    stock: "in-stock",
    warranty: "6 months",
    delivery: "1–2 days",
    badge: "Hot Deal",
    accent: "#1a7a9c",
    specs: ["1080P HD", "Night Vision", "Two-Way Audio", "App Control"],
    featured: true,
    bestSeller: true,
    deal: true,
  },
  {
    id: "3-eyes-cctv",
    name: "3 Eyes CCTV Camera",
    category: "CCTV & Security Cameras",
    brand: "Hikvision",
    price: 125000,
    originalPrice: 155000,
    rating: 4.8,
    reviews: 96,
    stock: "limited",
    warranty: "12 months",
    delivery: "1–3 days",
    badge: "Limited",
    accent: "#0f5f7a",
    specs: ["Triple Lens", "Color Night Vision", "Motion Alert", "IP66"],
    featured: true,
    bestSeller: true,
    deal: true,
  },
  {
    id: "mt30-router",
    name: "MT30 Wi-Fi Router",
    category: "Wi-Fi Routers & Networking",
    brand: "TP-Link",
    price: 89000,
    rating: 4.6,
    reviews: 173,
    stock: "in-stock",
    warranty: "24 months",
    delivery: "1–2 days",
    accent: "#2aa3cc",
    specs: ["Dual Band", "High Speed", "Easy Setup", "Wide Coverage"],
    featured: true,
    bestSeller: true,
  },
  {
    id: "game-projector-x2",
    name: "Game Projector X2",
    category: "Gaming Consoles",
    brand: "London Technologies",
    price: 399000,
    originalPrice: 459000,
    rating: 4.8,
    reviews: 67,
    stock: "in-stock",
    warranty: "12 months",
    delivery: "1–4 days",
    badge: "New",
    accent: "#1784a8",
    specs: ["Low Latency", "4K Support", "Game Mode", "HDMI + USB"],
    featured: true,
    bestSeller: true,
    newArrival: true,
    deal: true,
  },
  {
    id: "walkie-talkie",
    name: "Walkie Talkie Radio",
    category: "Walkie Talkies",
    brand: "London Technologies",
    price: 45000,
    rating: 4.5,
    reviews: 88,
    stock: "in-stock",
    warranty: "6 months",
    delivery: "1–3 days",
    accent: "#2596be",
    specs: ["Long Range", "Rechargeable", "Clear Audio", "Durable Build"],
    featured: true,
    bestSeller: true,
  },
  {
    id: "tv-led-sync",
    name: "TV LED Sync Light",
    category: "LED Smart Lighting",
    brand: "Xiaomi",
    price: 65000,
    originalPrice: 80000,
    rating: 4.7,
    reviews: 142,
    stock: "in-stock",
    warranty: "6 months",
    delivery: "1–2 days",
    badge: "Deal",
    accent: "#3aadcf",
    specs: ["Music Sync", "App Control", "16M Colors", "USB Powered"],
    featured: true,
    bestSeller: true,
    deal: true,
    newArrival: true,
  },
  {
    id: "jbl-go-speaker",
    name: "Portable Bluetooth Speaker",
    category: "Bluetooth Speakers",
    brand: "JBL",
    price: 98000,
    rating: 4.9,
    reviews: 201,
    stock: "in-stock",
    warranty: "12 months",
    delivery: "1–3 days",
    badge: "New",
    accent: "#1f8bb0",
    specs: ["Waterproof", "12h Battery", "Bold Bass", "Compact"],
    featured: true,
    newArrival: true,
  },
];

export const trustBadges = [
  "Secure Checkout",
  "Fast Delivery Across Tanzania",
  "Quality Guaranteed",
  "Customer Support 7 Days a Week",
  "Thousands of Happy Customers",
] as const;

export const whyShop = [
  {
    title: "Genuine Products",
    description:
      "We only sell authentic products sourced from trusted manufacturers.",
  },
  {
    title: "Fast Nationwide Delivery",
    description: "Quick and reliable delivery anywhere in Tanzania.",
  },
  {
    title: "Secure Payments",
    description: "Multiple secure payment options available.",
  },
  {
    title: "Warranty Protection",
    description: "Warranty available on selected products.",
  },
  {
    title: "Technical Support",
    description: "Our experts are available before and after your purchase.",
  },
  {
    title: "Easy Returns",
    description: "Simple return process for eligible products.",
  },
] as const;

export const reviews = [
  {
    name: "Amina J.",
    city: "Dar es Salaam",
    rating: 5,
    text: "Excellent service and genuine products.",
  },
  {
    name: "Brian K.",
    city: "Arusha",
    rating: 5,
    text: "Very fast delivery.",
  },
  {
    name: "Grace M.",
    city: "Mwanza",
    rating: 5,
    text: "Projector quality exceeded my expectations.",
  },
  {
    name: "Daniel O.",
    city: "Dodoma",
    rating: 5,
    text: "Customer support was amazing.",
  },
] as const;

export const blogPosts = [
  "How to Choose the Best CCTV Camera",
  "Wi-Fi Router Buying Guide",
  "Best Projector for Home Entertainment",
  "Smart Home Setup Guide",
  "Gaming Projector vs TV",
] as const;

export const faqs = [
  {
    q: "Do you deliver across Tanzania?",
    a: "Yes. We deliver nationwide.",
  },
  {
    q: "How long does delivery take?",
    a: "Dar es Salaam: 1 Day. Upcountry: 2–5 Business Days.",
  },
  {
    q: "Do your products have warranty?",
    a: "Yes. Selected products include warranty.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "Bank Transfer, Mobile Money, and Cash on Delivery (Selected Areas).",
  },
  {
    q: "Can I order through WhatsApp?",
    a: "Absolutely. Simply click the WhatsApp Buy Button on any product.",
  },
] as const;

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-TZ", {
    style: "currency",
    currency: "TZS",
    maximumFractionDigits: 0,
  }).format(amount);
}
