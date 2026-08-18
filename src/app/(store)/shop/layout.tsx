import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Shop",
  description:
    "Browse all technology products at London Technologies — projectors, CCTV, networking, gaming, and smart home devices.",
  path: "/shop",
});

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
