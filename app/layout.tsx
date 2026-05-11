import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

// 1. Import our new custom Header component
import Header from "../components/Header"; 

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
      <body className={`${manrope.className} bg-[#0a0a0a] text-white antialiased`}>
        
        <div
          aria-hidden
          className="pointer-events-none fixed left-[-10%] top-[34%] -z-10 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(176,102,68,0.75)_0%,rgba(176,102,68,0.28)_42%,transparent_78%)] opacity-35 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none fixed right-[-8%] top-[38%] -z-10 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(89,172,148,0.62)_0%,rgba(89,172,148,0.24)_45%,transparent_80%)] opacity-30 blur-[130px]"
        />

        {/* 2. Snap the Header in right here! */}
        <Header />

        <div className="relative z-10 min-h-screen">
          {children}
        </div>

        <footer className="relative z-50 mx-auto flex w-full max-w-7xl items-center justify-between px-6 pb-12 pt-20 sm:px-10 lg:px-14">
          <p className="text-sm font-medium text-white/50">
            Make It Happen © {new Date().getFullYear()}
          </p>

          <div className="absolute left-1/2 flex -translate-x-1/2 items-center">
            <div className="z-20 h-10 w-10 overflow-hidden rounded-full border-2 border-[#0a0a0a] bg-blue-400"></div>
            <div className="z-10 -ml-3 h-10 w-10 overflow-hidden rounded-full border-2 border-[#0a0a0a] bg-pink-400"></div>
          </div>

          <div className="hidden w-[150px] md:block"></div>
        </footer>

      </body>
    </html>
  );
}