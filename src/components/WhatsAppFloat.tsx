"use client";

import { MessageCircle } from "lucide-react";
import { BRAND } from "@/lib/constants";

export function WhatsAppFloat() {
  return (
    <a
      href={BRAND.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat on WhatsApp — ${BRAND.whatsapp}`}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full border border-emerald-600/20 bg-[#25D366] py-2.5 pl-3 pr-4 text-white shadow-[0_12px_32px_rgba(37,211,102,0.35)] transition-all hover:-translate-y-0.5 hover:bg-[#20bd5a] hover:shadow-[0_16px_40px_rgba(37,211,102,0.45)] sm:bottom-6 sm:right-6 sm:py-3 sm:pl-4 sm:pr-5"
    >
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white/20">
        <MessageCircle className="size-5 fill-white" />
      </span>
      <span className="flex min-w-0 flex-col pr-0.5 text-left leading-tight">
        <span className="text-sm font-bold tracking-tight">Chat now</span>
        <span className="text-xs font-medium text-white/90">{BRAND.whatsapp}</span>
      </span>
    </a>
  );
}
