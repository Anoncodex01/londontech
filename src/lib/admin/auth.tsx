"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ADMIN_AUTH_KEY, DEMO_ADMIN } from "@/lib/admin/seed";

type AdminAuthValue = {
  ready: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(window.sessionStorage.getItem(ADMIN_AUTH_KEY) === "1");
    setReady(true);
  }, []);

  const value = useMemo<AdminAuthValue>(
    () => ({
      ready,
      isAuthenticated,
      login: (email, password) => {
        const ok =
          email.trim().toLowerCase() === DEMO_ADMIN.email &&
          password === DEMO_ADMIN.password;
        if (ok) {
          window.sessionStorage.setItem(ADMIN_AUTH_KEY, "1");
          setIsAuthenticated(true);
        }
        return ok;
      },
      logout: () => {
        window.sessionStorage.removeItem(ADMIN_AUTH_KEY);
        setIsAuthenticated(false);
      },
    }),
    [isAuthenticated, ready],
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return ctx;
}
