import Script from 'next/script'
import type { Metadata } from "next";
import { Geist_Mono, Inter_Tight } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google"; // <-- NEW: Imported Google Analytics
import "./globals.css";

// 1. Updated import to bring in the Server Wrapper instead of the Client Header
import HeaderWrapper from "../components/HeaderWrapper";
import Footer from "../components/Footer";

const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

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
      <body className={`${interTight.variable} ${geistMono.variable} ${interTight.className} bg-background text-foreground antialiased`}>
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