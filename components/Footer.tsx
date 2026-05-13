import Link from "next/link";
import { createClient } from "next-sanity";
import type { IconType } from "react-icons";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaLink,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

const footerQuery = `*[_type == "footer" && _id == "footer"][0]{
  companyText,
  email,
  phone,
  location,
  socialLinks[]{ platform, url }
}`;

type FooterDoc = {
  companyText: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  socialLinks: { platform: string; url: string }[] | null;
};

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
] as const;

const serviceLinks = [
  { label: "Web Design", href: "/services" },
  { label: "Software Dev", href: "/services" },
  { label: "Marketing", href: "/services" },
  { label: "AI Automation", href: "/services" },
] as const;

function iconForPlatform(platform: string): IconType {
  const p = platform.trim().toLowerCase();
  if (p.includes("facebook")) return FaFacebook;
  if (p.includes("instagram")) return FaInstagram;
  if (p.includes("linkedin")) return FaLinkedin;
  if (p.includes("youtube")) return FaYoutube;
  if (p.includes("github")) return FaGithub;
  if (p === "x" || p.includes("twitter")) return FaXTwitter;
  return FaLink;
}

export default async function Footer() {
  const data = await client.fetch<FooterDoc | null>(footerQuery);

  const companyText =
    data?.companyText ??
    "We design and ship digital products that help ambitious teams move faster.";
  const email = data?.email ?? "hello@makeithappen.example";
  const phone = data?.phone ?? "+1 (555) 000-0000";
  const location = data?.location ?? "Remote-first";
  const socialLinks = data?.socialLinks?.filter((l) => l?.url && l?.platform) ?? [];

  return (
    // Removed the light background, using a subtle white/10 top border
    <footer className="relative z-20 w-full border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:px-10 lg:px-14">
        <div className="grid gap-10 md:grid-cols-4 md:gap-8">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-white transition-colors hover:text-[#D7FF65]"
            >
              Make It Happen
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-white/60">{companyText}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Quick Links</p>
            <ul className="mt-4 flex flex-col gap-3">
              {quickLinks.map((item) => (
                <li key={item.href + item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 transition-colors hover:text-[#D7FF65]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Services</p>
            <ul className="mt-4 flex flex-col gap-3">
              {serviceLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 transition-colors hover:text-[#D7FF65]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Contact</p>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-white/70">
              <li>
                <a href={`mailto:${email}`} className="transition-colors hover:text-[#D7FF65]">
                  {email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-[#D7FF65]"
                >
                  {phone}
                </a>
              </li>
              <li className="text-white/50">{location}</li>
            </ul>
            {socialLinks.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {socialLinks.map((link, index) => {
                  const Icon = iconForPlatform(link.platform);
                  return (
                    <a
                      key={`${link.url}-${index}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      // Glassmorphic dark social icons
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:border-[#D7FF65] hover:text-[#D7FF65]"
                      aria-label={link.platform}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </a>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright 2026 Make It Happen. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/privacy" className="transition-colors hover:text-[#D7FF65]">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-[#D7FF65]">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}