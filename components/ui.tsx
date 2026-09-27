import Link from "next/link";
import type { ReactNode } from "react";

/** Small pill label with a lime square — the section marker used across the site. */
export function Tag({ children, tone = "light", className = "" }: { children: ReactNode; tone?: "light" | "dark"; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] ${
        tone === "light" ? "bg-white text-ink" : "bg-white/10 text-white"
      } ${className}`}
    >
      <span aria-hidden className="h-2 w-2 rounded-[2px] bg-accent-primary" />
      {children}
    </span>
  );
}

export function ArrowUpRight({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg aria-hidden className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 11 11 5M6 5h5v5" />
    </svg>
  );
}

export function ArrowRight({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h14m-5-5 5 5-5 5" />
    </svg>
  );
}

const pillStyles = {
  accent: "bg-accent-primary text-ink hover:bg-accent-hover",
  light: "bg-white text-ink hover:bg-paper-raised",
  dark: "bg-ink text-white hover:bg-ink-raised",
  outline: "border border-white/25 text-white hover:border-white/60",
} as const;

/** Rounded pill link with the ↗ arrow. External URLs open in a new tab. */
export function PillLink({
  href,
  children,
  variant = "accent",
  size = "md",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof pillStyles;
  size?: "md" | "lg";
  className?: string;
}) {
  const external = /^https?:\/\//.test(href);
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`group inline-flex items-center gap-1.5 rounded-full font-medium transition-colors duration-200 ${
        size === "lg" ? "px-6 py-3.5 text-[15px]" : "px-5 py-2.5 text-sm"
      } ${pillStyles[variant]} ${className}`}
    >
      {children}
      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}

/** "→ About the studio" style text link. */
export function ArrowLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`group inline-flex items-center gap-2 text-lg font-medium ${className}`}>
      <ArrowRight className="h-5 w-5 text-accent-secondary transition-transform duration-200 group-hover:translate-x-1" />
      <span className="border-b border-transparent transition-colors group-hover:border-current">{children}</span>
    </Link>
  );
}
