import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { CartProvider } from "@/lib/cart";
import { CatalogProvider } from "@/lib/catalog-provider";

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CatalogProvider>
      <CartProvider>
        <div className="flex min-h-full flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFloat />
        </div>
      </CartProvider>
    </CatalogProvider>
  );
}
