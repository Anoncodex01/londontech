import {
  BestSellers,
  Blog,
  Categories,
  FAQ,
  FeaturedProducts,
  HotDeals,
  Installation,
  Newsletter,
  NewArrivals,
  ProductShowcase,
  Recommended,
  Reviews,
  TrustBadges,
  WhatsAppShopping,
  WhyShop,
} from "@/components/sections";

export default function Home() {
  return (
    <>
      <ProductShowcase />
      <Recommended />
      <TrustBadges />
      <FeaturedProducts />
      <Categories />
      <HotDeals />
      <BestSellers />
      <NewArrivals />
      <WhyShop />
      <Reviews />
      <Blog />
      <FAQ />
      <Newsletter />
    </>
  );
}
