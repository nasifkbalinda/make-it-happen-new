import Link from "next/link";
import { createClient } from "next-sanity";
import SocialLinks, {
  type SocialLinkItem,
  socialLinksProjection,
} from "./SocialLinks";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

// UPGRADED QUERY: Fetches both the footer data AND the global site logo in one go!
const footerQuery = `{
  "footer": *[_type == "footer" && _id == "footer"][0]{
    companyText,
    email,
    phone,
    location,
    ${socialLinksProjection}
  },
  "settings": *[_type == "siteSettings" || _id == "siteSettings"][0]{
    "logoUrl": coalesce(siteLogo.asset->url, logo.asset->url),
    ${socialLinksProjection}
  }
}`;

type FooterData = {
  footer: {
    companyText: string | null;
    email: string | null;
    phone: string | null;
    location: string | null;
    socialLinks: SocialLinkItem[] | null;
  } | null;
  settings: {
    logoUrl: string | null;
    socialLinks: SocialLinkItem[] | null;
  } | null;
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

export default async function Footer() {
  const data = await client.fetch<FooterData | null>(footerQuery);

  // Extract data safely from the new query structure
  const companyText =
    data?.footer?.companyText ??
    "We design and ship digital products that help ambitious teams move faster.";
  const email = data?.footer?.email ?? "hello@makeithappen.example";
  const phone = data?.footer?.phone ?? "+1 (555) 000-0000";
  const location = data?.footer?.location ?? "Remote-first";
  // Global Site Settings is the source of truth; the footer's legacy field is the fallback.
  const socialLinks = data?.settings?.socialLinks?.length
    ? data.settings.socialLinks
    : data?.footer?.socialLinks ?? [];
  
  // Get the dynamic logo from Sanity, fallback to local icon if not found
  const logoUrl = data?.settings?.logoUrl ?? "/icon.png";

  return (
    <footer className="relative z-20 w-full border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:px-10 lg:px-14">
        <div className="grid gap-10 md:grid-cols-4 md:gap-8">
          <div className="flex flex-col gap-4">
            <Link href="/" className="inline-block">
              {/* DYNAMIC LOGO INJECTED HERE */}
              <img 
                src={logoUrl} 
                alt="Make It Happen Logo" 
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-white/60">{companyText}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-accent-primary">Quick Links</p>
            <ul className="mt-4 flex flex-col gap-3">
              {quickLinks.map((item) => (
                <li key={item.href + item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 transition-colors hover:text-accent-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-accent-primary">Services</p>
            <ul className="mt-4 flex flex-col gap-3">
              {serviceLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 transition-colors hover:text-accent-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-accent-primary">Contact</p>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-white/70">
              <li>
                <a href={`mailto:${email}`} className="transition-colors hover:text-accent-primary">
                  {email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-accent-primary"
                >
                  {phone}
                </a>
              </li>
              <li className="text-white/50">{location}</li>
            </ul>
            <SocialLinks links={socialLinks} size="md" className="mt-6" />
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright {new Date().getFullYear()} Make It Happen. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/privacy" className="transition-colors hover:text-accent-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-accent-primary">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}