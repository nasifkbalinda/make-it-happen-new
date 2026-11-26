/**
 * Conversion tracking helpers (Meta Pixel + GA4).
 *
 * Rules enforced here, in one place, so no caller can forget them:
 *  - production builds only (nothing fires from `next dev`)
 *  - never on /admin (the Sanity Studio)
 *
 * The base Meta Pixel snippet and the existing GA4 tag are loaded elsewhere
 * (see components/Tracking.tsx and app/layout.tsx); these helpers only send events.
 */

export const META_PIXEL_ID = "1782912706245005";

export type ContactMethod = "whatsapp" | "phone" | "email";

type Fbq = (...args: unknown[]) => void;
type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: Fbq;
    gtag?: Gtag;
    dataLayer?: unknown[];
  }
}

export const isProduction = process.env.NODE_ENV === "production";

export function isAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function canTrack(): boolean {
  return isProduction && typeof window !== "undefined" && !isAdminPath(window.location.pathname);
}

function fbqTrack(event: string): void {
  if (typeof window.fbq === "function") window.fbq("track", event);
}

function gtagEvent(name: string, params?: Record<string, unknown>): void {
  if (typeof window.gtag !== "function") {
    // The GA tag loads after hydration. If an event beats it, queue it exactly the
    // way gtag.js expects (an `arguments` object) so it is sent once GA is ready.
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      (window.dataLayer = window.dataLayer || []).push(arguments);
    };
  }
  if (params) window.gtag("event", name, params);
  else window.gtag("event", name);
}

/** Contact form brief was validated and handed off to WhatsApp / the email app. */
export function trackLead(): void {
  if (!canTrack()) return;
  fbqTrack("Lead");
  gtagEvent("generate_lead");
}

/** Visitor clicked a WhatsApp, phone or email link. */
export function trackContact(method: ContactMethod): void {
  if (!canTrack()) return;
  fbqTrack("Contact");
  gtagEvent("contact_click", { method });
}

/** Meta PageView for client-side route changes (the base snippet covers the first load). */
export function trackPageView(): void {
  if (!canTrack()) return;
  fbqTrack("PageView");
}

/**
 * Classify a link as a contact link. Returns null for everything else, including
 * WhatsApp *share* links (wa.me/?text=… on blog posts), which share an article and
 * are not a visitor contacting the business.
 */
export function contactMethodOf(anchor: HTMLAnchorElement): ContactMethod | null {
  const href = anchor.getAttribute("href") ?? "";
  if (/^mailto:/i.test(href)) return "email";
  if (/^tel:/i.test(href)) return "phone";

  let url: URL;
  try {
    url = new URL(anchor.href);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, "");
  if (host === "wa.me" && /^\/\d+/.test(url.pathname)) return "whatsapp";
  if ((host === "api.whatsapp.com" || host === "web.whatsapp.com") && url.searchParams.get("phone")) return "whatsapp";
  return null;
}
