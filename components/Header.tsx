"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import SocialLinks, { type SocialLinkItem } from "./SocialLinks";
import { ArrowUpRight } from "./ui";

// Define the props we expect to receive from the server wrapper
type HeaderProps = {
  logoUrl?: string | null;
  siteTitle?: string | null;
  socialLinks?: SocialLinkItem[] | null;
  projectCount?: number | null;
  ctaText?: string | null;
  ctaLink?: string | null;
};

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export default function Header({ logoUrl, siteTitle, socialLinks, projectCount, ctaText, ctaLink }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Sits inside the hero card at the top; becomes a floating bar once the page scrolls.
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const displayTitle = siteTitle || "Make It Happen";
  const buttonText = ctaText?.trim() || "Start a project";
  const buttonLink = ctaLink?.trim() || "/contact";
  const isActive = (href: string) => pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-2 pt-2 sm:px-3 sm:pt-3">
      <nav
        aria-label="Global"
        className={`mx-auto flex items-center justify-between transition-all duration-500 ${
          isScrolled
            ? "mt-1 max-w-6xl rounded-2xl bg-ink/85 py-2 pl-3 pr-2 backdrop-blur-md"
            : "max-w-[112rem] px-3 py-4 sm:px-5 lg:px-7"
        }`}
      >
        <Link href="/" className="flex shrink-0 items-center" aria-label={`${displayTitle} home`}>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${displayTitle} logo`}
              className={`w-auto object-contain transition-all duration-500 ${isScrolled ? "h-11" : "h-14 sm:h-16 lg:h-[4.5rem]"}`}
            />
          ) : (
            <span className="text-lg font-semibold tracking-tight text-white">{displayTitle}</span>
          )}
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`relative text-[15px] font-medium transition-colors ${
                  isActive(link.href) ? "text-accent-primary" : "text-white hover:text-white/70"
                }`}
              >
                {link.label}
                {link.href === "/projects" && projectCount ? (
                  <sup className="absolute -right-4 -top-2 rounded-full bg-accent-primary px-1.5 py-0.5 font-mono text-[9px] leading-none font-semibold text-ink">
                    {String(projectCount).padStart(2, "0")}
                  </sup>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href={buttonLink}
            className="group hidden items-center gap-1.5 rounded-[10px] bg-white px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-accent-primary sm:inline-flex"
          >
            {buttonText}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white lg:hidden"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="sr-only">{isMobileMenuOpen ? "Close menu" : "Open menu"}</span>
            {isMobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Phones: a light card drops down under the bar. */}
      {isMobileMenuOpen ? (
        <div id="mobile-menu" onClick={(event) => { if ((event.target as HTMLElement).closest("a")) setIsMobileMenuOpen(false); }} className="mx-auto mt-2 max-w-md rounded-2xl bg-white p-6 text-ink shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)] lg:hidden">
          <ul className="flex flex-col items-center gap-1">
            <li>
              <Link href="/" className={`block px-4 py-2 text-lg font-medium ${pathname === "/" ? "text-accent-secondary" : ""}`}>
                Home
              </Link>
            </li>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`relative block px-4 py-2 text-lg font-medium ${isActive(link.href) ? "text-accent-secondary" : ""}`}
                >
                  {link.label}
                  {link.href === "/projects" && projectCount ? (
                    <sup className="ml-1 rounded-full bg-accent-primary px-1.5 py-0.5 font-mono text-[9px] leading-none font-semibold text-ink">
                      {String(projectCount).padStart(2, "0")}
                    </sup>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={buttonLink}
            className="mt-5 flex items-center justify-center gap-1.5 rounded-[10px] bg-ink px-5 py-3.5 text-[15px] font-medium text-white"
          >
            {buttonText} <ArrowUpRight />
          </Link>
          <div className="mt-5 flex justify-center [&_a]:border-ink/10 [&_a]:bg-paper [&_a]:text-ink/70">
            <SocialLinks links={socialLinks} size="md" />
          </div>
        </div>
      ) : null}
    </header>
  );
}
