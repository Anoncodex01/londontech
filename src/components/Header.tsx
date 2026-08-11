"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  Menu,
  X,
  Search,
  User,
  Heart,
  ShoppingBag,
  ChevronDown,
  Phone,
  MessageCircle,
  Truck,
  BarChart2,
  Grid3x3,
} from "lucide-react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  CctvIcon,
  WifiFullSignalIcon,
  ProjectorIcon,
  HomeWifiIcon,
  SpeakerIcon,
  GamepadIcon,
  ComputerIcon,
} from "@hugeicons/core-free-icons";
import { useCart } from "@/lib/cart";
import { BRAND } from "@/lib/constants";

const megaCategories: { name: string; href: string; icon: IconSvgElement; sub: string[] }[] = [
  {
    name: "CCTV & Security",
    href: "/shop?category=cctv-security",
    icon: CctvIcon as unknown as IconSvgElement,
    sub: [
      "WiFi Cameras",
      "Solar Cameras",
      "CCTV Systems",
      "DVR/NVR",
      "Accessories",
      "Video Door Phones",
      "Alarm Systems",
    ],
  },
  {
    name: "Networking",
    href: "/shop?category=networking",
    icon: WifiFullSignalIcon as unknown as IconSvgElement,
    sub: [
      "4G/5G Routers",
      "WiFi Routers",
      "WiFi Extenders",
      "CPE Routers",
      "Access Points",
      "Network Accessories",
    ],
  },
  {
    name: "Projectors",
    href: "/shop?category=projectors",
    icon: ProjectorIcon as unknown as IconSvgElement,
    sub: [
      "Smart Projectors",
      "Portable Projectors",
      "Projector Screens",
      "Projector Accessories",
    ],
  },
  {
    name: "Smart Home",
    href: "/shop?category=smart-home",
    icon: HomeWifiIcon as unknown as IconSvgElement,
    sub: [
      "Smart Lighting",
      "Smart Sensors",
      "Smart Plugs",
      "Smart Alarm",
      "Smart Doorbells",
    ],
  },
  {
    name: "Audio",
    href: "/shop?category=audio",
    icon: SpeakerIcon as unknown as IconSvgElement,
    sub: ["Bluetooth Speakers", "Microphones", "Earphones", "Headphones"],
  },
  {
    name: "Gaming",
    href: "/shop?category=gaming",
    icon: GamepadIcon as unknown as IconSvgElement,
    sub: ["Gaming Consoles", "Controllers", "Gaming Accessories", "Games"],
  },
  {
    name: "Computer Accessories",
    href: "/shop?category=computer-accessories",
    icon: ComputerIcon as unknown as IconSvgElement,
    sub: [
      "Keyboards & Mice",
      "USB Accessories",
      "HDMI",
      "Hubs & Adapters",
      "Laptop Accessories",
    ],
  },
];

const navLinks = [
  { href: "/shop?category=projectors", label: "Smart Projectors" },
  { href: "/shop?category=cctv-security", label: "CCTV & Security" },
  { href: "/shop?category=networking", label: "Networking" },
  { href: "/shop?category=gaming", label: "Gaming" },
  { href: "/shop?category=smart-home", label: "Smart Home" },
  { href: "/shop?category=lighting", label: "Lighting" },
  { href: "/shop?category=audio", label: "Audio" },
  { href: "/shop?category=computer-accessories", label: "Computer Accessories" },
  { href: "/shop?deals=true", label: "Deals", highlight: true },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const megaRef = useRef<HTMLDivElement>(null);
  const { itemCount } = useCart();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* Announcement Bar */}
      {announcementVisible && (
        <div className="relative bg-brand-deeper text-white text-xs sm:text-sm">
          <div className="container-shell section-pad flex items-center justify-center gap-4 py-2 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Truck className="size-3.5 shrink-0" />
              Free delivery on orders above TSh 500,000
            </span>
            <span className="hidden sm:block text-white/40">|</span>
            <a
              href={BRAND.phoneHref}
              className="flex items-center gap-1.5 hover:text-brand-mist transition-colors"
            >
              <Phone className="size-3.5 shrink-0" />
              Call {BRAND.phone}
            </a>
            <span className="hidden sm:block text-white/40">|</span>
            <a
              href={BRAND.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-brand-mist transition-colors"
            >
              <MessageCircle className="size-3.5 shrink-0" />
              WhatsApp Us {BRAND.whatsapp}
            </a>
          </div>
          <button
            type="button"
            onClick={() => setAnnouncementVisible(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
            aria-label="Dismiss announcement"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* Main Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-line shadow-sm">
        <div className="container-shell section-pad flex items-center gap-3 py-3">
          {/* Logo */}
          <Link href="/" className="group flex-shrink-0 flex flex-col leading-none">
            <span className="font-display text-xl font-bold tracking-tight text-ink group-hover:text-brand transition-colors">
              London
            </span>
            <span className="text-[10px] font-semibold tracking-widest uppercase text-brand">
              Technologies
            </span>
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                window.location.href = `/shop?q=${encodeURIComponent(searchQuery.trim())}`;
              }
            }}
            className="flex-1 hidden sm:flex items-center gap-0 rounded-xl border border-line bg-surface overflow-hidden focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20 transition-all"
          >
            <Search className="ml-3.5 size-4 text-ink-soft shrink-0" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="flex-1 bg-transparent px-3 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 outline-none"
            />
            <button
              type="submit"
              className="bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2.5 transition-colors shrink-0"
            >
              Search
            </button>
          </form>

          {/* Action Icons */}
          <div className="flex items-center gap-1 ml-auto sm:ml-0">
            {/* Account */}
            <Link
              href="/account"
              className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg hover:bg-brand-soft text-ink-soft hover:text-brand transition-colors group"
            >
              <User className="size-5" />
              <span className="hidden lg:block text-[10px] font-medium">Account</span>
            </Link>

            {/* Compare */}
            <Link
              href="/compare"
              className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg hover:bg-brand-soft text-ink-soft hover:text-brand transition-colors group"
            >
              <BarChart2 className="size-5" />
              <span className="hidden lg:block text-[10px] font-medium">Compare</span>
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg bg-brand text-white hover:bg-brand-dark transition-colors group"
            >
              <ShoppingBag className="size-5" />
              <span className="hidden lg:block text-[10px] font-medium">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white px-1">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="lg:hidden flex items-center justify-center size-9 rounded-lg border border-line text-ink hover:bg-brand-soft ml-1"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="sm:hidden px-4 pb-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                window.location.href = `/shop?q=${encodeURIComponent(searchQuery.trim())}`;
              }
            }}
            className="flex items-center rounded-xl border border-line bg-surface overflow-hidden focus-within:border-brand transition-all"
          >
            <Search className="ml-3 size-4 text-ink-soft shrink-0" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none"
            />
          </form>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-brand-deeper hidden lg:block">
        <div className="container-shell section-pad flex items-center gap-0">
          {/* All Categories with Mega Menu */}
          <div ref={megaRef} className="relative">
            <button
              type="button"
              onClick={() => setMegaOpen((v) => !v)}
              onMouseEnter={() => setMegaOpen(true)}
              className="flex items-center gap-2 px-4 py-3 bg-brand text-white font-semibold text-sm hover:bg-brand-dark transition-colors"
            >
              <Grid3x3 className="size-4" />
              All Categories
              <ChevronDown
                className={`size-4 transition-transform ${megaOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Mega Menu Panel */}
            {megaOpen && (
              <div
                className="absolute top-full left-0 z-50 w-[780px] bg-white shadow-2xl border border-line rounded-b-2xl overflow-hidden"
                onMouseLeave={() => setMegaOpen(false)}
              >
                <div className="grid grid-cols-3 gap-0 divide-x divide-line">
                  {megaCategories.map((cat) => (
                    <div key={cat.name} className="p-4">
                      <Link
                        href={cat.href}
                        onClick={() => setMegaOpen(false)}
                        className="flex items-center gap-2 font-semibold text-ink hover:text-brand transition-colors mb-2 group"
                      >
                        <span className="flex size-7 items-center justify-center rounded-lg bg-brand-soft text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                          <HugeiconsIcon icon={cat.icon} size={16} />
                        </span>
                        <span className="text-sm group-hover:underline underline-offset-2">
                          {cat.name}
                        </span>
                      </Link>
                      <ul className="space-y-1">
                        {cat.sub.map((item) => (
                          <li key={item}>
                            <Link
                              href={`${cat.href}&sub=${encodeURIComponent(item.toLowerCase())}`}
                              onClick={() => setMegaOpen(false)}
                              className="text-xs text-ink-soft hover:text-brand transition-colors block py-0.5 hover:translate-x-1 transition-transform"
                            >
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="border-t border-line bg-surface px-4 py-2.5 flex items-center gap-2">
                  <span className="text-xs text-ink-soft">Popular:</span>
                  {["Smart Projectors", "WiFi Cameras", "Gaming Consoles", "Bluetooth Speakers"].map(
                    (tag) => (
                      <Link
                        key={tag}
                        href={`/shop?q=${encodeURIComponent(tag)}`}
                        onClick={() => setMegaOpen(false)}
                        className="text-xs px-2.5 py-1 rounded-full bg-brand-soft text-brand font-medium hover:bg-brand hover:text-white transition-colors"
                      >
                        {tag}
                      </Link>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Nav Links */}
          <nav className="flex items-center overflow-x-auto" style={{ color: "white" }}>
            {navLinks.map((link) =>
              link.highlight ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="whitespace-nowrap px-3.5 py-3 text-sm font-semibold text-yellow-300 hover:text-yellow-100 transition-colors"
                >
                  🔥 {link.label}
                </Link>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="whitespace-nowrap px-3.5 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors"
                  style={{ color: "white" }}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-line shadow-lg max-h-[80vh] overflow-y-auto">
          <div className="container-shell section-pad py-4 flex flex-col gap-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft px-3 mb-1">
              Categories
            </p>
            {megaCategories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-brand-soft transition-colors"
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-brand-soft text-brand">
                  <HugeiconsIcon icon={cat.icon} size={18} />
                </span>
                <span className="font-medium text-ink">{cat.name}</span>
              </Link>
            ))}
            <div className="border-t border-line my-2" />
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft px-3 mb-1">
              Quick Links
            </p>
            <Link
              href="/cart"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-brand-soft"
            >
              <ShoppingBag className="size-5 text-brand" />
              <span className="font-medium">Cart {itemCount > 0 && `(${itemCount})`}</span>
            </Link>
            <Link
              href="/account"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-brand-soft"
            >
              <User className="size-5 text-brand" />
              <span className="font-medium">Account / Login</span>
            </Link>
            <Link
              href="/checkout"
              className="btn-primary mt-2 text-center"
              onClick={() => setMobileOpen(false)}
            >
              Checkout
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
