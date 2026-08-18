import { AdminShell } from "@/components/admin/AdminShell";
import { AdminAuthProvider } from "@/lib/admin/auth";
import { AdminStoreProvider } from "@/lib/admin/store";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Admin",
  description: "London Technologies store admin panel",
  path: "/admin",
  noIndex: true,
});

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
