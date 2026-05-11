"use client"; // This tells Next.js this component has interactivity (clicking)

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  // Our "light switch" state for the mobile menu. Default is closed (false).
  const [isOpen, setIsOpen] = useState(false);
  const navItems = ["Services", "Projects", "Blog", "About", "Contact"];

  return (
    <header className="relative z-50 w-full pt-8">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-14">
        <Link href="/" className="text-xl font-bold tracking-tight text-white transition-colors hover:text-[#C6F04F]">
          Make It Happen
        </Link>

        {/* Desktop Navigation (Hidden on Mobile) */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-sm font-medium text-white/65 transition-colors duration-200 hover:text-white"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Desktop Button (Hidden on Mobile) - Fixed and Matte */}
        <div className="hidden md:block">
          <button className="rounded-full border border-[#D7FF65]/75 bg-transparent px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:border-[#C6F04F]">
            Get a Quote
          </button>
        </div>

        {/* Mobile Hamburger Button (Visible ONLY on Mobile) */}
        <button 
          className="p-2 text-white md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* An SVG icon that changes from a hamburger to an 'X' based on the isOpen state */}
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown (Shows only when isOpen is true) */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-4 w-full border-b border-white/10 bg-[#0a0a0a]/95 p-6 backdrop-blur-lg md:hidden">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                onClick={() => setIsOpen(false)} // Closes menu when a link is clicked
                className="text-lg font-medium text-white/80 transition-colors hover:text-[#C6F04F]"
              >
                {item}
              </Link>
            ))}
            <button className="mt-4 w-full rounded-full bg-[#C6F04F] px-6 py-3 text-sm font-bold text-[#111720]">
              Get a Quote
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}