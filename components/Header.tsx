"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

// Define the props we expect to receive from the server wrapper
type HeaderProps = {
  logoUrl?: string | null;
  siteTitle?: string | null;
};

export default function Header({ logoUrl, siteTitle }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // Fallback text if Sanity is empty
  const defaultTitle = "Make It Happen";
  const displayTitle = siteTitle || defaultTitle;

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-14" aria-label="Global">
        
        {/* Dynamic Logo Section */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={`${displayTitle} logo`} 
                // MASSIVE BUMP: h-23 on mobile, h-27 on larger screens
                className="h-23 w-auto object-contain sm:h-27" 
              />
            ) : (
              <span className="text-2xl font-extrabold text-white tracking-tight">
                {displayTitle}
              </span>
            )}
          </Link>
        </div>
        
        {/* Mobile Hamburger Button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex lg:gap-x-10">
          <Link href="/services" className="text-sm font-medium leading-6 text-white/80 transition-colors hover:text-[#D7FF65]">Services</Link>
          <Link href="/projects" className="text-sm font-medium leading-6 text-white/80 transition-colors hover:text-[#D7FF65]">Projects</Link>
          <Link href="/blog" className="text-sm font-medium leading-6 text-white/80 transition-colors hover:text-[#D7FF65]">Blog</Link>
          <Link href="/about" className="text-sm font-medium leading-6 text-white/80 transition-colors hover:text-[#D7FF65]">About</Link>
          <Link href="/contact" className="text-sm font-medium leading-6 text-white/80 transition-colors hover:text-[#D7FF65]">Contact</Link>
        </div>

        {/* Desktop Contact Button */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link 
            href="/contact" 
            className="rounded-full bg-[#D7FF65] px-7 py-2.5 text-sm font-bold text-[#0c1016] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#e8ff99]"
          >
            Contact Us
          </Link>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div className="fixed inset-0 z-50 bg-[#0c1016]/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          
          {/* Slide-out Menu */}
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-[#121821] px-6 py-6 sm:max-w-sm border-l border-white/10">
            <div className="flex items-center justify-between">
              
              {/* Dynamic Logo Section (Mobile Slide-out) */}
              <Link href="/" className="-m-1.5 p-1.5 flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                 {logoUrl ? (
                  <img 
                    src={logoUrl} 
                    alt={`${displayTitle} logo`} 
                    // Bumped mobile menu logo size up as well
                    className="h-14 w-auto object-contain sm:h-16" 
                  />
                ) : (
                  <span className="text-xl font-extrabold text-white">
                    {displayTitle}
                  </span>
                )}
              </Link>

              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-white/70 hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-white/10">
                <div className="space-y-2 py-6">
                  <Link href="/services" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-white/5" onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
                  <Link href="/projects" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-white/5" onClick={() => setIsMobileMenuOpen(false)}>Projects</Link>
                  <Link href="/blog" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-white/5" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
                  <Link href="/about" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-white/5" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
                  <Link href="/contact" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-white/5" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
                </div>
                <div className="py-6">
                  <Link
                    href="/contact"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-[#111720] bg-[#D7FF65] text-center hover:bg-[#e8ff99]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}