"use client";

import Link from "next/link";
import {
  Camera,
  Gamepad2,
  HeartPulse,
  Home,
  Keyboard,
  Lightbulb,
  Package,
  Projector,
  Radio,
  Smartphone,
  Speaker,
  Watch,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { useCatalog } from "@/lib/catalog-provider";

const iconMap: Record<string, LucideIcon> = {
  Projector,
  Camera,
  Wifi,
  Gamepad2,
  Home,
  Lightbulb,
  Speaker,
  Radio,
  Keyboard,
  Smartphone,
  Watch,
  HeartPulse,
  Package,
};

export function Categories() {
  const { categories } = useCatalog();

  return (
    <section id="categories" className="container-shell section-pad py-16 md:py-20">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">
            Shop by Category
          </p>
          <h2 className="section-title mt-2">Find the tech you need</h2>
          <p className="section-copy">
            Browse our complete range of smart devices, security systems, and
            accessories.
          </p>
        </div>
        <Link href="/shop" className="btn-secondary">
          Browse All Products
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {categories.map((category) => {
          const Icon = iconMap[category.icon] ?? Package;
          return (
            <Link
              key={category.slug}
              href={`/shop?category=${encodeURIComponent(category.slug)}`}
              className="group flex flex-col items-start gap-3 rounded-2xl border border-transparent bg-white/70 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-line hover:bg-white hover:shadow-[0_12px_30px_rgba(37,150,190,0.12)]"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                <Icon className="size-5" />
              </span>
              <span className="font-display text-sm leading-snug font-semibold text-ink md:text-[15px]">
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
