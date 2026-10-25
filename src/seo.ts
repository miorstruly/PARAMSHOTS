// Per-page SEO: title, description, canonical URL, robots and social-sharing tags.
//
// index.html already carries the default tags (for crawlers and link-preview bots that do not run JavaScript).
// This hook updates those same tags when the visitor moves between pages of the single-page app.
import { useEffect } from "react";

export const SITE_NAME = "ParamShots";

/** Optional public site address, e.g. https://www.example.com (no trailing slash). Falls back to the current origin. */
export const SITE_URL = (import.meta.env.VITE_SITE_URL ?? "").trim().replace(/\/+$/, "");

/** Share image, 1200x630. Lives in /public so it keeps a stable address. */
export const OG_IMAGE_PATH = "/og-image.jpg";

/** Describes the share image for screen readers and link previews. */
export const OG_IMAGE_ALT =
  "ParamShots logo over an aerial view of a packed concert stadium. Rent a flagship iPhone for concerts, travel and events in Pampanga.";

/**
 * Home page defaults. Use these in App.tsx (useSeo) and keep index.html in sync,
 * so the static HTML and the JavaScript version always say the same thing.
 * Title: 37 characters (limit about 60). Description: about 135 characters (limit about 160).
 */
export const DEFAULT_TITLE = "Phone Rental in Pampanga | ParamShots";
export const DEFAULT_DESCRIPTION =
  "Rent an iPhone 17 Pro Max in Pampanga for concerts, travel, weddings and content creation. Clear daily rates and easy online booking.";

export type SeoOptions = {
  /** Page title. Keep it under about 60 characters. */
  title: string;
  /** Page summary shown in search results. Keep it under about 160 characters. */
  description: string;
  /** Path of this page, e.g. "/privacy-policy". */
  path: string;
  /** Ask search engines to leave this page out of results (used for the 404 page). */
  noindex?: boolean;
};

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function useSeo({ title, description, path, noindex = false }: SeoOptions) {
  useEffect(() => {
    const base = SITE_URL || window.location.origin;
    const url = `${base}${path}`;
    const image = `${base}${OG_IMAGE_PATH}`;

    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");
    upsertLink("canonical", url);

    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", image);
    upsertMeta("property", "og:image:alt", OG_IMAGE_ALT);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", image);
    upsertMeta("name", "twitter:image:alt", OG_IMAGE_ALT);
  }, [title, description, path, noindex]);
}
