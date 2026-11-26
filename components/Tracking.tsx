"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { META_PIXEL_ID, contactMethodOf, isAdminPath, isProduction, trackContact, trackPageView } from "../lib/analytics";

// Official Meta Pixel base code, unchanged. It runs `fbq('init')` + the first PageView.
const PIXEL_BASE_CODE = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src='https://connect.facebook.net/en_US/fbevents.js';s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script');
fbq('init','${META_PIXEL_ID}');
fbq('track','PageView');`;

/**
 * Site-wide Meta Pixel. Mounted once in the root layout.
 *  - Base code loads once, production only, never on /admin.
 *  - PageView is re-sent on client-side route changes (App Router doesn't reload the page).
 *  - One delegated listener sends Contact / contact_click for any WhatsApp, phone or email link.
 */
export default function Tracking() {
  const pathname = usePathname();
  const admin = isAdminPath(pathname);
  const baseFired = useRef(false);

  // Route changes: the base snippet already sent PageView for the first public page it
  // loaded on, so skip that one and send PageView for every public page after it.
  useEffect(() => {
    if (!isProduction || admin) return;
    if (!baseFired.current) {
      baseFired.current = true;
      return;
    }
    trackPageView();
  }, [pathname, admin]);

  // Contact links. Delegated so it covers links in Sanity-driven content too.
  useEffect(() => {
    if (!isProduction) return;
    function onClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;
      const method = contactMethodOf(anchor);
      if (method) trackContact(method);
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  if (!isProduction || admin) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: PIXEL_BASE_CODE }} />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
