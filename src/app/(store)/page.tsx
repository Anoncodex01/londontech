import {
  BestSellers,
  Blog,
  Categories,
  FAQ,
  FeaturedProducts,
  Hero,
  HeroBenefits,
  HotDeals,
  Installation,
  Newsletter,
  NewArrivals,
  Reviews,
  TrustBadges,
  WhatsAppShopping,
  WhyShop,
} from "@/components/sections";

export default function Home() {
  return (
    <>
      <Hero />
      <HeroBenefits />
      <TrustBadges />
      <Categories />
      <HotDeals />
      <FeaturedProducts />
      <BestSellers />
      <NewArrivals />
      <WhatsAppShopping />
      <WhyShop />
      <Reviews />
      <Installation />
      <Blog />
      <FAQ />
      <Newsletter />
    </>
  );
}
