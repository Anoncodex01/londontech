"use client";

import Link from "next/link";

const chips = [
  { label: "Projectors", href: "/shop?category=smart-projectors", emoji: "📽️" },
  { label: "CCTV", href: "/shop?category=cctv-security", emoji: "📹" },
  { label: "WiFi", href: "/shop?category=networking", emoji: "🌐" },
  { label: "Speakers", href: "/shop?category=speakers", emoji: "🔊" },
  { label: "Smart Home", href: "/shop?category=smart-home", emoji: "🏠" },
  { label: "Gaming", href: "/shop?category=gaming", emoji: "🎮" },
  { label: "Computer", href: "/shop?category=computer", emoji: "💻" },
  { label: "Lighting", href: "/shop?category=led-lighting", emoji: "💡" },
];

export function Recommended() {
  return (
    <section className="container-shell section-pad py-8">
      <p className="text-sm font-semibold text-ink-soft uppercase tracking-widest mb-4">
        Recommended for you
      </p>
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <Link
            key={chip.href}
            href={chip.href}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-line bg-white hover:bg-brand hover:text-white hover:border-brand transition-all text-sm font-semibold text-ink shadow-sm"
          >
            <span>{chip.emoji}</span>
            {chip.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
