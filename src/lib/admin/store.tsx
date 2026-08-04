"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
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
import {
  fetchAdminState,
  removeBlogPost,
  removeBrand,
  removeCategory,
  removeCustomer,
  removeFaq,
  removeInstallation,
  removeOrder,
  removeProduct,
  removeReview,
  removeSubscriber,
  saveBlogPost,
  saveBrand,
  saveCategory,
  saveCustomer,
  saveFaq,
  saveInstallation,
  saveOrder,
  saveProduct,
  saveReview,
  saveSettings,
  saveSubscriber,
} from "@/lib/supabase/api";
import { isSupabaseConfigured } from "@/lib/supabase/client";

type AdminStoreValue = {
  ready: boolean;
  loading: boolean;
  error: string | null;
  usingDatabase: boolean;
  data: AdminState;
  refresh: () => Promise<void>;
  upsertProduct: (product: AdminProduct) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  upsertCategory: (category: AdminCategory) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  upsertBrand: (brand: AdminBrand) => Promise<void>;
  deleteBrand: (id: string) => Promise<void>;
  updateOrder: (order: AdminOrder) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  upsertCustomer: (customer: AdminCustomer) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  upsertReview: (review: AdminReview) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  upsertInstallation: (item: AdminInstallation) => Promise<void>;
  deleteInstallation: (id: string) => Promise<void>;
  upsertBlogPost: (post: AdminBlogPost) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;
  upsertFaq: (faq: AdminFaq) => Promise<void>;
  deleteFaq: (id: string) => Promise<void>;
  upsertSubscriber: (subscriber: AdminSubscriber) => Promise<void>;
  deleteSubscriber: (id: string) => Promise<void>;
  updateSettings: (settings: AdminSettings) => Promise<void>;
};

const AdminStoreContext = createContext<AdminStoreValue | null>(null);

function patchList<T extends { id: string }>(list: T[], item: T) {
  const exists = list.some((row) => row.id === item.id);
  return exists
    ? list.map((row) => (row.id === item.id ? item : row))
    : [item, ...list];
}

export function AdminStoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingDatabase, setUsingDatabase] = useState(false);
  const [data, setData] = useState<AdminState>(createEmptyState);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setData(createEmptyState());
      setUsingDatabase(false);
      setError("Supabase env vars missing.");
      setLoading(false);
      setReady(true);
      return;
    }

    try {
      const remote = await fetchAdminState();
      setData(remote);
      setUsingDatabase(true);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load data from Supabase. Run supabase/schema.sql first.";
      setData(createEmptyState());
      setUsingDatabase(false);
      setError(message);
    } finally {
      setLoading(false);
      setReady(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<AdminStoreValue>(
    () => ({
      ready,
      loading,
      error,
      usingDatabase,
      data,
      refresh,
      upsertProduct: async (product) => {
        if (usingDatabase) await saveProduct(product);
        setData((prev) => ({
          ...prev,
          products: patchList(prev.products, product),
        }));
      },
      deleteProduct: async (id) => {
        if (usingDatabase) await removeProduct(id);
        setData((prev) => ({
          ...prev,
          products: prev.products.filter((item) => item.id !== id),
        }));
      },
      upsertCategory: async (category) => {
        if (usingDatabase) await saveCategory(category);
        setData((prev) => ({
          ...prev,
          categories: patchList(prev.categories, category),
        }));
      },
      deleteCategory: async (id) => {
        if (usingDatabase) await removeCategory(id);
        setData((prev) => ({
          ...prev,
          categories: prev.categories.filter((item) => item.id !== id),
        }));
      },
      upsertBrand: async (brand) => {
        if (usingDatabase) await saveBrand(brand);
        setData((prev) => ({
          ...prev,
          brands: patchList(prev.brands, brand),
        }));
      },
      deleteBrand: async (id) => {
        if (usingDatabase) await removeBrand(id);
        setData((prev) => ({
          ...prev,
          brands: prev.brands.filter((item) => item.id !== id),
        }));
      },
      updateOrder: async (order) => {
        if (usingDatabase) await saveOrder(order);
        setData((prev) => ({
          ...prev,
          orders: prev.orders.map((item) =>
            item.id === order.id ? order : item,
          ),
        }));
      },
      deleteOrder: async (id) => {
        if (usingDatabase) await removeOrder(id);
        setData((prev) => ({
          ...prev,
          orders: prev.orders.filter((item) => item.id !== id),
        }));
      },
      upsertCustomer: async (customer) => {
        if (usingDatabase) await saveCustomer(customer);
        setData((prev) => ({
          ...prev,
          customers: patchList(prev.customers, customer),
        }));
      },
      deleteCustomer: async (id) => {
        if (usingDatabase) await removeCustomer(id);
        setData((prev) => ({
          ...prev,
          customers: prev.customers.filter((item) => item.id !== id),
        }));
      },
      upsertReview: async (review) => {
        if (usingDatabase) await saveReview(review);
        setData((prev) => ({
          ...prev,
          reviews: patchList(prev.reviews, review),
        }));
      },
      deleteReview: async (id) => {
        if (usingDatabase) await removeReview(id);
        setData((prev) => ({
          ...prev,
          reviews: prev.reviews.filter((item) => item.id !== id),
        }));
      },
      upsertInstallation: async (item) => {
        if (usingDatabase) await saveInstallation(item);
        setData((prev) => ({
          ...prev,
          installations: patchList(prev.installations, item),
        }));
      },
      deleteInstallation: async (id) => {
        if (usingDatabase) await removeInstallation(id);
        setData((prev) => ({
          ...prev,
          installations: prev.installations.filter((item) => item.id !== id),
        }));
      },
      upsertBlogPost: async (post) => {
        if (usingDatabase) await saveBlogPost(post);
        setData((prev) => ({
          ...prev,
          blogPosts: patchList(prev.blogPosts, post),
        }));
      },
      deleteBlogPost: async (id) => {
        if (usingDatabase) await removeBlogPost(id);
        setData((prev) => ({
          ...prev,
          blogPosts: prev.blogPosts.filter((item) => item.id !== id),
        }));
      },
      upsertFaq: async (faq) => {
        if (usingDatabase) await saveFaq(faq);
        setData((prev) => ({
          ...prev,
          faqs: patchList(prev.faqs, faq),
        }));
      },
      deleteFaq: async (id) => {
        if (usingDatabase) await removeFaq(id);
        setData((prev) => ({
          ...prev,
          faqs: prev.faqs.filter((item) => item.id !== id),
        }));
      },
      upsertSubscriber: async (subscriber) => {
        if (usingDatabase) await saveSubscriber(subscriber);
        setData((prev) => ({
          ...prev,
          subscribers: patchList(prev.subscribers, subscriber),
        }));
      },
      deleteSubscriber: async (id) => {
        if (usingDatabase) await removeSubscriber(id);
        setData((prev) => ({
          ...prev,
          subscribers: prev.subscribers.filter((item) => item.id !== id),
        }));
      },
      updateSettings: async (settings) => {
        if (usingDatabase) await saveSettings(settings);
        setData((prev) => ({
          ...prev,
          settings,
        }));
      },
    }),
    [data, error, loading, ready, refresh, usingDatabase],
  );

  return (
    <AdminStoreContext.Provider value={value}>
      {children}
    </AdminStoreContext.Provider>
  );
}

export function useAdminStore() {
  const ctx = useContext(AdminStoreContext);
  if (!ctx) {
    throw new Error("useAdminStore must be used within AdminStoreProvider");
  }
  return ctx;
}
