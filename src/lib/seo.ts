import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://londontechnologies.co.tz";

export const SITE_NAME = BRAND.name;
export const SITE_TAGLINE = BRAND.tagline;
export const DEFAULT_DESCRIPTION =
  "Shop smart projectors, CCTV cameras, Wi-Fi routers, gaming gadgets, and smart home devices from London Technologies. Genuine products with nationwide delivery across Tanzania.";

export const DEFAULT_KEYWORDS = [
  "London Technologies",
  "Tanzania electronics",
  "CCTV cameras Dar es Salaam",
  "smart projectors Tanzania",
  "WiFi routers",
  "gaming gadgets",
  "smart home devices",
  "online shop Tanzania",
  "technology store Tanzania",
];

export function pageTitle(title?: string) {
  return title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | ${SITE_TAGLINE}`;
}

export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
} = {}): Metadata {
  const url = `${SITE_URL}${path.startsWith("/") ? path : path ? `/${path}` : ""}`;
  const resolvedTitle = pageTitle(title);

  return {
    title: title ? resolvedTitle : { default: resolvedTitle, template: `%s | ${SITE_NAME}` },
    description,
    keywords: DEFAULT_KEYWORDS,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      type: "website",
      locale: "en_TZ",
      url,
      siteName: SITE_NAME,
      title: resolvedTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
    },
  };
}

export const rootMetadata: Metadata = {
  ...buildMetadata(),
  title: {
    default: pageTitle(),
    template: `%s | ${SITE_NAME}`,
  },
  icons: {
    icon: [{ url: "/icon", type: "image/png", sizes: "32x32" }],
    apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
  },
};
