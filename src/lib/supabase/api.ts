import { createEmptyState } from "@/lib/admin/seed";
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
  AdminState,
  AdminSubscriber,
} from "@/lib/admin/types";
import { getSupabase, PRODUCT_IMAGES_BUCKET } from "@/lib/supabase/client";
import {
  mapBlogPost,
  mapBrand,
  mapCategory,
  mapCustomer,
  mapFaq,
  mapInstallation,
  mapOrder,
  mapProduct,
  mapReview,
  mapSettings,
  mapSubscriber,
  toDbProduct,
  toDbSettings,
} from "@/lib/supabase/mappers";

export async function fetchAdminState(): Promise<AdminState> {
  const supabase = getSupabase();
  const fallback = createEmptyState();

  const [
    products,
    categories,
    brands,
    orders,
    customers,
    reviews,
    installations,
    blogPosts,
    faqs,
    subscribers,
    settings,
  ] = await Promise.all([
    supabase.from("products").select("*").order("created_at", { ascending: false }),
    supabase.from("categories").select("*").order("name"),
    supabase.from("brands").select("*").order("name"),
    supabase.from("orders").select("*").order("created_at", { ascending: false }),
    supabase.from("customers").select("*").order("joined_at", { ascending: false }),
    supabase.from("reviews").select("*").order("created_at", { ascending: false }),
    supabase.from("installations").select("*").order("preferred_date", { ascending: false }),
    supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
    supabase.from("faqs").select("*").order("created_at"),
    supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("subscribed_at", { ascending: false }),
    supabase.from("store_settings").select("*").eq("id", "main").maybeSingle(),
  ]);

  const firstError =
    products.error ||
    categories.error ||
    brands.error ||
    orders.error ||
    customers.error ||
    reviews.error ||
    installations.error ||
    blogPosts.error ||
    faqs.error ||
    subscribers.error ||
    settings.error;

  if (firstError) {
    throw firstError;
  }

  return {
    products: (products.data || []).map(mapProduct),
    categories: (categories.data || []).map(mapCategory),
    brands: (brands.data || []).map(mapBrand),
    orders: (orders.data || []).map(mapOrder),
    customers: (customers.data || []).map(mapCustomer),
    reviews: (reviews.data || []).map(mapReview),
    installations: (installations.data || []).map(mapInstallation),
    blogPosts: (blogPosts.data || []).map(mapBlogPost),
    faqs: (faqs.data || []).map(mapFaq),
    subscribers: (subscribers.data || []).map(mapSubscriber),
    settings: settings.data
      ? mapSettings(settings.data)
      : fallback.settings,
  };
}

export async function saveProduct(product: AdminProduct) {
  const { error } = await getSupabase()
    .from("products")
    .upsert(toDbProduct(product));
  if (error) throw error;
}

export async function removeProduct(id: string) {
  const { error } = await getSupabase().from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function saveCategory(category: AdminCategory) {
  const { error } = await getSupabase().from("categories").upsert({
    id: category.id,
    name: category.name,
    slug: category.slug,
    icon: category.icon,
    active: category.active,
  });
  if (error) throw error;
}

export async function removeCategory(id: string) {
  const { error } = await getSupabase().from("categories").delete().eq("id", id);
  if (error) throw error;
}

export async function saveBrand(brand: AdminBrand) {
  const { error } = await getSupabase().from("brands").upsert({
    id: brand.id,
    name: brand.name,
    active: brand.active,
  });
  if (error) throw error;
}

export async function removeBrand(id: string) {
  const { error } = await getSupabase().from("brands").delete().eq("id", id);
  if (error) throw error;
}

export async function saveOrder(order: AdminOrder) {
  const { error } = await getSupabase().from("orders").upsert({
    id: order.id,
    customer_name: order.customerName,
    phone: order.phone,
    city: order.city,
    product_name: order.productName,
    amount: order.amount,
    status: order.status,
    payment: order.payment,
    channel: order.channel,
    created_at: order.createdAt,
    email: order.email || null,
    address: order.address || null,
    region: order.region || null,
    notes: order.notes || null,
    delivery_estimate: order.deliveryEstimate || null,
  });
  if (error) throw error;
}

export async function removeOrder(id: string) {
  const { error } = await getSupabase().from("orders").delete().eq("id", id);
  if (error) throw error;
}

export async function saveCustomer(customer: AdminCustomer) {
  const { error } = await getSupabase().from("customers").upsert({
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
    city: customer.city,
    orders: customer.orders,
    spent: customer.spent,
    joined_at: customer.joinedAt,
  });
  if (error) throw error;
}

export async function removeCustomer(id: string) {
  const { error } = await getSupabase().from("customers").delete().eq("id", id);
  if (error) throw error;
}

export async function saveReview(review: AdminReview) {
  const { error } = await getSupabase().from("reviews").upsert({
    id: review.id,
    name: review.name,
    city: review.city,
    rating: review.rating,
    text: review.text,
    product_name: review.productName,
    status: review.status,
    created_at: review.createdAt,
  });
  if (error) throw error;
}

export async function fetchPublishedReviews(productName?: string) {
  let query = getSupabase()
    .from("reviews")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (productName) {
    query = query.eq("product_name", productName);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(mapReview);
}

export async function submitStorefrontReview(input: {
  name: string;
  city: string;
  rating: number;
  text: string;
  productName: string;
}) {
  const review: AdminReview = {
    id: `rev-${crypto.randomUUID().slice(0, 8)}`,
    name: input.name.trim(),
    city: input.city.trim(),
    rating: input.rating,
    text: input.text.trim(),
    productName: input.productName,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  await saveReview(review);
  return review;
}

export async function removeReview(id: string) {
  const { error } = await getSupabase().from("reviews").delete().eq("id", id);
  if (error) throw error;
}

export async function saveInstallation(item: AdminInstallation) {
  const { error } = await getSupabase().from("installations").upsert({
    id: item.id,
    customer_name: item.customerName,
    phone: item.phone,
    service: item.service,
    city: item.city,
    preferred_date: item.preferredDate,
    status: item.status,
    notes: item.notes,
  });
  if (error) throw error;
}

export async function removeInstallation(id: string) {
  const { error } = await getSupabase()
    .from("installations")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function saveBlogPost(post: AdminBlogPost) {
  const { error } = await getSupabase().from("blog_posts").upsert({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content || "",
    status: post.status,
    created_at: post.createdAt,
  });
  if (error) throw error;
}

export async function fetchPublishedBlogPosts() {
  const { data, error } = await getSupabase()
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapBlogPost);
}

export async function fetchPublishedBlogPostById(id: string) {
  const { data, error } = await getSupabase()
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  return data ? mapBlogPost(data) : null;
}

export async function removeBlogPost(id: string) {
  const { error } = await getSupabase().from("blog_posts").delete().eq("id", id);
  if (error) throw error;
}

export async function saveFaq(faq: AdminFaq) {
  const { error } = await getSupabase().from("faqs").upsert({
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
    active: faq.active,
  });
  if (error) throw error;
}

export async function removeFaq(id: string) {
  const { error } = await getSupabase().from("faqs").delete().eq("id", id);
  if (error) throw error;
}

export async function saveSubscriber(subscriber: AdminSubscriber) {
  const { error } = await getSupabase().from("newsletter_subscribers").upsert({
    id: subscriber.id,
    email: subscriber.email,
    subscribed_at: subscriber.subscribedAt,
    active: subscriber.active,
  });
  if (error) throw error;
}

export async function removeSubscriber(id: string) {
  const { error } = await getSupabase()
    .from("newsletter_subscribers")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function saveSettings(settings: AdminSettings) {
  const { error } = await getSupabase()
    .from("store_settings")
    .upsert(toDbSettings(settings));
  if (error) throw error;
}

export async function uploadProductImage(file: File, productId: string) {
  const supabase = getSupabase();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${productId}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

  const { error } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}

export async function uploadProductImages(files: File[], productId: string) {
  const urls: string[] = [];
  for (const file of files) {
    urls.push(await uploadProductImage(file, productId));
  }
  return urls;
}
