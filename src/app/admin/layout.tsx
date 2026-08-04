import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminAuthProvider } from "@/lib/admin/auth";
import { AdminStoreProvider } from "@/lib/admin/store";

export const metadata: Metadata = {
  title: "Admin | London Technologies",
  description: "London Technologies store admin panel",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminAuthProvider>
      <AdminStoreProvider>
        <AdminShell>{children}</AdminShell>
      </AdminStoreProvider>
    </AdminAuthProvider>
  );
}
