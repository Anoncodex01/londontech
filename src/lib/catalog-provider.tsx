"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  brands as fallbackBrands,
  categories as fallbackCategories,
  products as fallbackProducts,
  type Product,
} from "@/data/catalog";
import { fetchAdminState } from "@/lib/supabase/api";
import { isSupabaseConfigured } from "@/lib/supabase/client";

type CatalogCategory = { name: string; slug: string; icon: string };

type CatalogValue = {
  ready: boolean;
  products: Product[];
  categories: CatalogCategory[];
  brands: string[];
  fromDatabase: boolean;
};

const CatalogContext = createContext<CatalogValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [fromDatabase, setFromDatabase] = useState(false);
  const [products, setProducts] = useState<Product[]>([...fallbackProducts]);
  const [categories, setCategories] = useState<CatalogCategory[]>(
    fallbackCategories.map((c) => ({
      name: c.name,
      slug: c.slug,
      icon: c.icon,
    })),
  );
  const [brands, setBrands] = useState<string[]>([...fallbackBrands]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!isSupabaseConfigured()) {
        setReady(true);
        return;
      }

      try {
        const state = await fetchAdminState();
        if (cancelled) return;
        setProducts(
          state.products
            .filter((product) => product.active)
            .map(({ quantity: _quantity, active: _active, ...product }) => product),
        );
        setCategories(
          state.categories
            .filter((category) => category.active)
            .map(({ name, slug, icon }) => ({ name, slug, icon })),
        );
        setBrands(
          state.brands.filter((brand) => brand.active).map((brand) => brand.name),
        );
        setFromDatabase(true);
      } catch {
        // Keep seeded fallbacks when DB is not ready.
      } finally {
        if (!cancelled) setReady(true);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({ ready, products, categories, brands, fromDatabase }),
    [ready, products, categories, brands, fromDatabase],
  );

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) {
    throw new Error("useCatalog must be used within CatalogProvider");
  }
  return ctx;
}
