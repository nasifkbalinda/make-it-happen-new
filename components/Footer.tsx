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
  "settings": *[_id == "siteSettings"][0]{
    "logoUrl": coalesce(siteLogo.asset->url, logo.asset->url),
    whatsappNumber,
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
    whatsappNumber: string | null;
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
  { label: "Software Development", href: "/services" },
  { label: "AI & Automation", href: "/services" },
  { label: "Digital Marketing", href: "/services" },
] as const;

export default async function Footer() {
  const data = await client.fetch<FooterData | null>(footerQuery);

  // Extract data safely from the new query structure
  const companyText =
    data?.footer?.companyText ??
    "We design and ship digital products that help ambitious teams move faster.";
  const email = data?.footer?.email ?? "hello@makeithappen.ug";
  const phone = data?.footer?.phone ?? "+256790879117";
  const location = data?.footer?.location ?? "Kampala, Uganda";
  // Global Site Settings is the source of truth; the footer's legacy field is the fallback.
  const socialLinks = data?.settings?.socialLinks?.length
    ? data.settings.socialLinks
    : data?.footer?.socialLinks ?? [];
  
  // Get the dynamic logo from Sanity, fallback to local icon if not found
  const logoUrl = data?.settings?.logoUrl ?? "/icon.png";

  const phoneDigits = phone.replace(/[^\d+]/g, "");
  const whatsappDigits = (data?.settings?.whatsappNumber || phone).replace(/\D/g, "");

  return (
    <footer className="relative z-20 w-full bg-paper px-2 pb-2 sm:px-3 sm:pb-3">
      <div className="overflow-hidden rounded-[20px] bg-ink text-white">
        <div className="shell pt-16 sm:pt-20">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Link href="/" className="inline-block" aria-label="Make It Happen home">
                <img src={logoUrl} alt="Make It Happen logo" className="h-12 w-auto object-contain" />
              </Link>
              <p className="mt-6 max-w-sm text-base leading-relaxed text-white/60">{companyText}</p>
              <a
                href={`mailto:${email}`}
                className="mt-8 inline-block text-2xl font-medium tracking-[-0.02em] text-white underline decoration-white/20 underline-offset-8 transition-colors hover:decoration-accent-primary sm:text-3xl"
              >
                {email}
              </a>
            </div>

            <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-white/45">Company</p>
                <ul className="mt-5 flex flex-col gap-3">
                  {quickLinks.map((item) => (
                    <li key={item.href + item.label}>
                      <Link href={item.href} className="text-[15px] text-white/80 transition-colors hover:text-accent-primary">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-white/45">Services</p>
                <ul className="mt-5 flex flex-col gap-3">
                  {serviceLinks.map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className="text-[15px] text-white/80 transition-colors hover:text-accent-primary">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-white/45">Contact</p>
                <ul className="mt-5 flex flex-col gap-3 text-[15px] text-white/80">
                  <li>
                    <a href={`tel:${phoneDigits}`} className="transition-colors hover:text-accent-primary">{phone}</a>
                  </li>
                  <li>
                    <a href={`https://wa.me/${whatsappDigits}`} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent-primary">
                      WhatsApp
                    </a>
                  </li>
                  <li className="text-white/50">{location}</li>
                </ul>
                <SocialLinks links={socialLinks} size="sm" className="mt-6" />
              </div>
            </nav>
          </div>
        </div>

        <div className="shell flex flex-col gap-4 mt-16 border-t border-white/10 py-6 sm:mt-20 font-mono text-[11px] uppercase tracking-[0.08em] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Make It Happen &middot; Kampala, Uganda</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-white">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-white">Terms</Link>
          </div>
        </div>
        {/* Oversized wordmark, cropped by the bottom edge of the card. */}
        <p
          aria-hidden
          className="-mb-[3.2vw] mt-6 select-none whitespace-nowrap text-center text-[15.5vw] font-semibold leading-none tracking-[-0.06em] text-white/[0.08]"
        >
          Make It Happen
        </p>

      </div>
    </footer>
  );
}
