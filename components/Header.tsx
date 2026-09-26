"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import SocialLinks, { type SocialLinkItem } from "./SocialLinks";

// Define the props we expect to receive from the server wrapper
type HeaderProps = {
  logoUrl?: string | null;
  siteTitle?: string | null;
  socialLinks?: SocialLinkItem[] | null;
};

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export default function Header({ logoUrl, siteTitle, socialLinks }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Transparent over the hero, solid once the page scrolls under it.
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // Fallback text if Sanity is empty
  const defaultTitle = "Make It Happen";
  const displayTitle = siteTitle || defaultTitle;

  const isActive = (href: string) => pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        isScrolled
          ? "border-b border-hairline bg-background/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav
        className={`shell flex items-center justify-between transition-[height] duration-300 ${
          isScrolled ? "h-20" : "h-24 lg:h-28"
        }`}
        aria-label="Global"
      >
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 flex items-center p-1.5">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${displayTitle} logo`}
                className={`w-auto object-contain transition-[height] duration-300 ${
                  isScrolled ? "h-12" : "h-14 lg:h-16"
                }`}
              />
            ) : (
              <span className="text-xl font-bold tracking-tight text-white">{displayTitle}</span>
            )}
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex h-11 w-11 items-center justify-center rounded-md text-white"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex lg:gap-x-12">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`relative text-base font-medium leading-6 transition-colors hover:text-white ${
                isActive(link.href) ? "text-white" : "text-white/75"
              }`}
            >
              {link.label}
              {isActive(link.href) ? (
                <span aria-hidden className="absolute inset-x-0 -bottom-2 mx-auto h-0.5 w-4 rounded-full bg-accent-primary" />
              ) : null}
            </Link>
          ))}
        </div>

        {/* Desktop Contact Button */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link
            href="/contact"
            className="rounded-md bg-accent-primary px-8 py-3.5 text-base font-semibold text-background transition-colors duration-200 hover:bg-accent-hover"
          >
            Contact Us
          </Link>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>

          {/* Slide-out Menu */}
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto border-l border-hairline bg-surface px-6 py-6 sm:max-w-sm">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 flex items-center p-1.5" onClick={() => setIsMobileMenuOpen(false)}>
                {logoUrl ? (
                  <img src={logoUrl} alt={`${displayTitle} logo`} className="h-12 w-auto object-contain" />
                ) : (
                  <span className="text-xl font-bold text-white">{displayTitle}</span>
                )}
              </Link>

              <button
                type="button"
                className="-m-2.5 inline-flex h-11 w-11 items-center justify-center rounded-md text-white/70 hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-8 flow-root">
              <div className="-my-6 divide-y divide-hairline">
                <div className="space-y-1 py-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={isActive(link.href) ? "page" : undefined}
                      className={`-mx-3 block rounded-md px-3 py-2.5 text-base font-medium leading-7 hover:bg-white/5 ${
                        isActive(link.href) ? "text-accent-primary" : "text-white"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <Link
                    href="/contact"
                    className="block rounded-md bg-accent-primary px-3 py-3 text-center text-base font-semibold leading-7 text-background hover:bg-accent-hover"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact Us
                  </Link>
                  <SocialLinks links={socialLinks} size="md" className="mt-6 justify-center" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
