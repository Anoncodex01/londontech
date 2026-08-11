"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { BRAND } from "@/lib/constants";

type Slide = {
  id: number;
  heading: string;
  subtext: string;
  buttons: { label: string; href: string; variant: "primary" | "secondary" }[];
  background: string;
};

const slides: Slide[] = [
  {
    id: 1,
    heading: "SMART TECHNOLOGY. BETTER PRICES.",
    subtext:
      "Discover projectors, CCTV cameras, routers, smart gadgets and accessories — delivered across Tanzania.",
    buttons: [
      { label: "SHOP NOW", href: "/shop", variant: "primary" },
      { label: "VIEW HOT DEALS", href: "/#deals", variant: "secondary" },
    ],
    background: "",
  },
  {
    id: 2,
    heading: "SMART PROJECTORS",
    subtext: "Cinema experience at home.",
    buttons: [
      {
        label: "Shop Projectors →",
        href: "/shop?category=smart-projectors",
        variant: "primary",
      },
    ],
    background:
      "linear-gradient(135deg, rgba(14,64,84,0.95) 0%, rgba(26,111,143,0.90) 50%, rgba(37,150,190,0.80) 100%)",
  },
  {
    id: 3,
    heading: "SMART SECURITY",
    subtext: "Protect what matters, wherever you are.",
    buttons: [
      {
        label: "Shop Security →",
        href: "/shop?category=cctv-security",
        variant: "primary",
      },
    ],
    background:
      "linear-gradient(135deg, rgba(8,40,60,0.98) 0%, rgba(14,64,84,0.95) 50%, rgba(20,90,115,0.90) 100%)",
  },
  {
    id: 4,
    heading: "NETWORKING SOLUTIONS",
    subtext: "Stronger Wi-Fi. Better connection.",
    buttons: [
      {
        label: "Shop Networking →",
        href: "/shop?category=networking",
        variant: "primary",
      },
    ],
    background:
      "linear-gradient(135deg, rgba(10,50,75,0.98) 0%, rgba(18,80,110,0.94) 50%, rgba(30,120,160,0.88) 100%)",
  },
];

const SLIDE_DURATION = 5000;
const FADE_DURATION = 600;

export function Hero() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = (index: number) => {
    if (fading || index === current) return;
    setFading(true);
    setTimeout(() => {
      setCurrent(index);
      setVisible(index);
      setFading(false);
    }, FADE_DURATION);
  };

  const prev = () => goTo((current - 1 + slides.length) % slides.length);
  const next = () => goTo((current + 1) % slides.length);

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent((c) => {
          const next = (c + 1) % slides.length;
          setVisible(next);
          return next;
        });
        setFading(false);
      }, FADE_DURATION);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[visible];

  return (
    <section className="relative min-h-[520px] md:min-h-[620px] overflow-hidden">
      {/* Slide 1 background: dark blue overlay + unsplash tech photo */}
      <div
        className="absolute inset-0 transition-opacity"
        style={{
          opacity: visible === 0 ? 1 : 0,
          transitionDuration: `${FADE_DURATION}ms`,
          backgroundImage:
            "linear-gradient(120deg, rgba(14,64,84,0.88) 0%, rgba(26,111,143,0.72) 42%, rgba(37,150,190,0.55) 70%, rgba(37,150,190,0.35) 100%), url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=2000&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Slides 2-4 gradient backgrounds */}
      {slides.slice(1).map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity"
          style={{
            opacity: visible === i + 1 ? 1 : 0,
            transitionDuration: `${FADE_DURATION}ms`,
            backgroundImage: s.background,
          }}
        />
      ))}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.18),transparent_35%)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--surface)] to-transparent" />

      <div
        className="container-shell section-pad relative flex min-h-[520px] md:min-h-[620px] flex-col justify-center py-16 md:py-20"
        style={{
          opacity: fading ? 0 : 1,
          transition: `opacity ${FADE_DURATION}ms ease-in-out`,
        }}
      >
        <div className="max-w-3xl">
          <p className="animate-rise font-display text-sm font-semibold tracking-[0.22em] text-brand-mist uppercase md:text-base">
            {BRAND.name}
          </p>
          <h1 className="animate-rise-delay-1 mt-4 font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.98] font-bold tracking-[-0.04em] text-white">
            {slide.heading}
          </h1>
          <p className="animate-rise-delay-2 mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
            {slide.subtext}
          </p>
          <div className="animate-rise-delay-3 mt-8 flex flex-wrap gap-3">
            {slide.buttons.map((btn) =>
              btn.variant === "primary" ? (
                <Link key={btn.label} href={btn.href} className="btn-primary">
                  {slide.id === 1 && <ShoppingBag className="size-4" />}
                  {btn.label}
                </Link>
              ) : (
                <Link key={btn.label} href={btn.href} className="btn-secondary">
                  {btn.label}
                </Link>
              )
            )}
          </div>
        </div>
      </div>

      {/* Prev / Next arrows */}
      <button
        type="button"
        aria-label="Previous slide"
        onClick={prev}
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 inline-flex size-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/35"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={next}
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 inline-flex size-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/35"
      >
        <ChevronRight className="size-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              current === i
                ? "w-6 bg-white"
                : "w-2 bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
