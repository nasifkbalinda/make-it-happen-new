import Script from 'next/script'
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google"; // <-- NEW: Imported Google Analytics
import "./globals.css";

// 1. Updated import to bring in the Server Wrapper instead of the Client Header
import HeaderWrapper from "../components/HeaderWrapper";
import Footer from "../components/Footer";

const manrope = Manrope({ subsets: ["latin"] });

// Site-wide defaults. Any page that declares its own `openGraph` replaces this
// block wholesale, so pages without one (services, projects, about, contact,
// privacy, terms) inherit a correct preview instead of having no og:image at
// all — which leaves crawlers to fall back to the favicon.
export const metadata: Metadata = {
  metadataBase: new URL("https://makeithappen.ug"),
  title: "Make It Happen | IT Agency",
  description: "Modern IT agency website for Make It Happen",
  openGraph: {
    title: "Make It Happen | IT Agency",
    description:
      "Custom software, premium web design, AI automation and digital marketing, built in Kampala.",
    url: "https://makeithappen.ug",
    siteName: "Make It Happen",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Make It Happen Tech Agency Kampala",
      },
    ],
    locale: "en_UG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Make It Happen | IT Agency",
    description:
      "Custom software, premium web design, AI automation and digital marketing, built in Kampala.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.className} bg-white text-black antialiased`}>
        <div
          aria-hidden
          className="pointer-events-none fixed right-[-5%] top-[-8%] -z-10 h-[min(520px,50vw)] w-[min(520px,50vw)] rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.14)_0%,rgba(79,70,229,0.04)_45%,transparent_70%)] blur-[100px]"
        />
        <div
          aria-hidden
          className="pointer-events-none fixed left-[-8%] top-[28%] -z-10 h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.1)_0%,transparent_65%)] opacity-80 blur-[90px]"
        />

        {/* 2. Render the new Server Wrapper here! */}
        <HeaderWrapper />

        <div className="relative z-10 min-h-screen">
          {children}
        </div>

        <Footer />
        
        {/* Talk 2 Me Live Chat Widget */}
        <Script id="talk-2-me-init" strategy="beforeInteractive">
          {`window.LIVECHAT_WORKSPACE_ID = "6f06fdf7-be9b-4b7d-9ad5-fd0a5bb53665";`}
        </Script>
        <Script src="https://talk-to-me.live/embed.js" strategy="lazyOnload" />
        
        {/* NEW: GOOGLE ANALYTICS SCRIPT */}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-LX9GVERQF8"} />
      </body>
    </html>
  );
}