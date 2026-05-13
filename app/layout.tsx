import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

import Header from "../components/Header";
import Footer from "../components/Footer";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Make It Happen | IT Agency",
  description: "Modern IT agency website for Make It Happen",
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

        {/* 2. Snap the Header in right here! */}
        <Header />

        <div className="relative z-10 min-h-screen">
          {children}
        </div>

        <Footer />

      </body>
    </html>
  );
}