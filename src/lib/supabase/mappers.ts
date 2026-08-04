import type {
  AdminBlogPost,
  AdminBrand,
  AdminCategory,
  AdminCustomer,
  AdminFaq,
  AdminInstallation,
  AdminOrder,
  AdminProduct,
  AdminReview,
  AdminSettings,
  AdminSubscriber,
  OrderStatus,
  PaymentMethod,
  StockStatus,
} from "@/lib/admin/types";

export type DbProduct = {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number | string;
  original_price: number | string | null;
  rating: number | string;
  reviews: number;
  stock: StockStatus;
  warranty: string;
  delivery: string;
  badge: string | null;
  accent: string;
  specs: string[] | null;
  featured: boolean;
  best_seller: boolean;
  new_arrival: boolean;
  deal: boolean;
  quantity: number;
  active: boolean;
  image_url: string | null;
  image_urls?: string[] | null;
};

function normalizeImageUrls(
  imageUrls?: string[] | null,
  imageUrl?: string | null,
) {
  const fromArray = (imageUrls || []).filter(Boolean);
  if (fromArray.length > 0) return fromArray;
  return imageUrl ? [imageUrl] : [];
}

export function mapProduct(row: DbProduct): AdminProduct {
  const imageUrls = normalizeImageUrls(row.image_urls, row.image_url);
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    brand: row.brand,
    price: Number(row.price),
    originalPrice:
      row.original_price === null || row.original_price === undefined
        ? undefined
        : Number(row.original_price),
    rating: Number(row.rating),
    reviews: row.reviews,
    stock: row.stock,
    warranty: row.warranty,
    delivery: row.delivery,
    badge: row.badge || undefined,
    accent: row.accent,
    specs: row.specs || [],
    featured: row.featured,
    bestSeller: row.best_seller,
    newArrival: row.new_arrival,
    deal: row.deal,
    quantity: row.quantity,
    active: row.active,
    imageUrls,
    imageUrl: imageUrls[0],
  };
}

export function toDbProduct(product: AdminProduct) {
  const imageUrls = normalizeImageUrls(product.imageUrls, product.imageUrl);
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    brand: product.brand,
    price: product.price,
    original_price: product.originalPrice ?? null,
    rating: product.rating,
    reviews: product.reviews,
    stock: product.stock,
    warranty: product.warranty,
    delivery: product.delivery,
    badge: product.badge || null,
    accent: product.accent,
    specs: product.specs,
    featured: Boolean(product.featured),
    best_seller: Boolean(product.bestSeller),
    new_arrival: Boolean(product.newArrival),
    deal: Boolean(product.deal),
    quantity: product.quantity,
    active: product.active,
    image_urls: imageUrls,
    image_url: imageUrls[0] || null,
  };
}

export function mapCategory(row: {
  id: string;
  name: string;
  slug: string;
  icon: string;
  active: boolean;
}): AdminCategory {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    icon: row.icon,
    active: row.active,
  };
}

export function mapBrand(row: {
  id: string;
  name: string;
  active: boolean;
}): AdminBrand {
  return { id: row.id, name: row.name, active: row.active };
}

export function mapOrder(row: {
  id: string;
  customer_name: string;
  phone: string;
  city: string;
  product_name: string;
  amount: number | string;
  status: OrderStatus;
  payment: PaymentMethod;
  channel: "website" | "whatsapp" | "phone";
  created_at: string;
  email?: string | null;
  address?: string | null;
  region?: string | null;
  notes?: string | null;
  delivery_estimate?: string | null;
}): AdminOrder {
  return {
    id: row.id,
    customerName: row.customer_name,
    phone: row.phone,
    city: row.city,
    productName: row.product_name,
    amount: Number(row.amount),
    status: row.status,
    payment: row.payment,
    channel: row.channel,
    createdAt: row.created_at,
    email: row.email || undefined,
    address: row.address || undefined,
    region: row.region || undefined,
    notes: row.notes || undefined,
    deliveryEstimate: row.delivery_estimate || undefined,
  };
}

export function mapCustomer(row: {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  city: string;
  orders: number;
  spent: number | string;
  joined_at: string;
}): AdminCustomer {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email || "",
    city: row.city,
    orders: row.orders,
    spent: Number(row.spent),
    joinedAt: row.joined_at,
  };
}

export function mapReview(row: {
  id: string;
  name: string;
  city: string;
  rating: number;
  text: string;
  product_name: string;
  status: AdminReview["status"];
  created_at: string;
}): AdminReview {
  return {
    id: row.id,
    name: row.name,
    city: row.city,
    rating: row.rating,
    text: row.text,
    productName: row.product_name,
    status: row.status,
    createdAt: row.created_at,
  };
}

export function mapInstallation(row: {
  id: string;
  customer_name: string;
  phone: string;
  service: string;
  city: string;
  preferred_date: string;
  status: AdminInstallation["status"];
  notes: string;
}): AdminInstallation {
  return {
    id: row.id,
    customerName: row.customer_name,
    phone: row.phone,
    service: row.service,
    city: row.city,
    preferredDate: row.preferred_date,
    status: row.status,
    notes: row.notes,
  };
}

export function mapBlogPost(row: {
  id: string;
  title: string;
  excerpt: string;
  content?: string | null;
  status: AdminBlogPost["status"];
  created_at: string;
}): AdminBlogPost {
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content || "",
    status: row.status,
    createdAt: row.created_at,
  };
}

export function mapFaq(row: {
  id: string;
  question: string;
  answer: string;
  active: boolean;
}): AdminFaq {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    active: row.active,
  };
}

export function mapSubscriber(row: {
  id: string;
  email: string;
  subscribed_at: string;
  active: boolean;
}): AdminSubscriber {
  return {
    id: row.id,
    email: row.email,
    subscribedAt: row.subscribed_at,
    active: row.active,
  };
}

export function mapSettings(row: {
  store_name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  weekday_hours: string;
  sunday_hours: string;
  delivery_dar: string;
  delivery_regions: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  youtube: string;
  linkedin: string;
}): AdminSettings {
  return {
    storeName: row.store_name,
    tagline: row.tagline,
    phone: row.phone,
    whatsapp: row.whatsapp,
    email: row.email,
    weekdayHours: row.weekday_hours,
    sundayHours: row.sunday_hours,
    deliveryDar: row.delivery_dar,
    deliveryRegions: row.delivery_regions,
    instagram: row.instagram,
    facebook: row.facebook,
    tiktok: row.tiktok,
    youtube: row.youtube,
    linkedin: row.linkedin,
  };
}

export function toDbSettings(settings: AdminSettings) {
  return {
    id: "main",
    store_name: settings.storeName,
    tagline: settings.tagline,
    phone: settings.phone,
    whatsapp: settings.whatsapp,
    email: settings.email,
    weekday_hours: settings.weekdayHours,
    sunday_hours: settings.sundayHours,
    delivery_dar: settings.deliveryDar,
    delivery_regions: settings.deliveryRegions,
    instagram: settings.instagram,
    facebook: settings.facebook,
    tiktok: settings.tiktok,
    youtube: settings.youtube,
    linkedin: settings.linkedin,
  };
}
