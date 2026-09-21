import { createClient } from "next-sanity";
import { Mail, MapPin, Phone } from "lucide-react"; 
import type { LucideIcon } from "lucide-react";
// 1. We import the official WhatsApp icon from the library we used in the footer
import { FaWhatsapp } from "react-icons/fa6"; 
import SocialLinks, {
  type SocialLinkItem,
  socialLinksProjection,
} from "@/components/SocialLinks";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

const contactQuery = `{
  "contact": *[_type == "contact" && _id == "contact"][0]{
    heading,
    subheading,
    email,
    phone,
    address
  },
  "settings": *[_type == "siteSettings"][0]{ ${socialLinksProjection} }
}`;

type ContactData = {
  contact: {
    heading: string | null;
    subheading: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
  } | null;
  settings: {
    socialLinks: SocialLinkItem[] | null;
  } | null;
};

function GlassOrb({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span
      className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-white/10 to-white/5 text-[#D7FF65] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] backdrop-blur-md"
      aria-hidden
    >
      <Icon className="h-5 w-5" strokeWidth={1.75} />
    </span>
  );
}

export default async function ContactPage() {
  const data = await client.fetch<ContactData | null>(contactQuery);

  const heading = data?.contact?.heading ?? "Let's Build Something Great";
  const subheading =
    data?.contact?.subheading ??
    "Have a project in mind? We'd love to hear about it. Drop us a message and we'll get back to you within 24 hours.";
  const email = data?.contact?.email ?? "hello@makeithappen.ug";
  const phone = data?.contact?.phone ?? "+256 790 879 117";
  const address = data?.contact?.address ?? "Kampala, Uganda";
  const socialLinks = data?.settings?.socialLinks ?? [];

  return (
    <div className="mx-auto w-full max-w-7xl px-6 pb-32 pt-32 sm:px-10 lg:px-14">
      <div className="grid gap-16 md:grid-cols-2 md:items-start">
        
        {/* Left Side: Traditional Contact Info */}
        <section className="flex flex-col gap-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D7FF65]">
              Contact Us
            </p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-5xl">
              {heading}
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-white/60">
              {subheading}
            </p>
          </div>

          <ul className="flex flex-col gap-8">
            <li className="flex gap-4">
              <GlassOrb icon={Mail} />
              <div className="min-w-0 pt-0.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                  Email
                </p>
                <a
                  href={`mailto:${email}`}
                  className="mt-1 block text-sm font-medium text-white/90 underline-offset-4 transition-colors hover:text-[#D7FF65] hover:underline"
                >
                  {email}
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <GlassOrb icon={Phone} />
              <div className="min-w-0 pt-0.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                  Phone
                </p>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="mt-1 block text-sm font-medium text-white/90 underline-offset-4 transition-colors hover:text-[#D7FF65] hover:underline"
                >
                  {phone}
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <GlassOrb icon={MapPin} />
              <div className="min-w-0 pt-0.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                  Address
                </p>
                <p className="mt-1 whitespace-pre-line text-sm font-medium text-white/90">
                  {address}
                </p>
              </div>
            </li>
          </ul>

          {socialLinks.length > 0 ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Follow us
              </p>
              <SocialLinks links={socialLinks} size="lg" className="mt-4" />
            </div>
          ) : null}
        </section>

 {/* Right Side: The VIP WhatsApp Card */}
 <section className="flex flex-col items-center justify-center rounded-[2rem] border border-white/10 bg-[#111720] p-10 text-center shadow-2xl md:p-14 mt-8">
          
          {/* UPDATED: Official WhatsApp Green (#25D366) with a 10% opacity background */}
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366]">
            <FaWhatsapp className="h-10 w-10" />
          </div>
          
          <h2 className="text-2xl font-bold text-white">Need an instant reply?</h2>
          <p className="mt-4 text-base leading-relaxed text-white/60">
            Chat directly with our tech team on WhatsApp to get your project moving today.
          </p>
          
          {/* UPDATED: Removed the hover:shadow tags to kill the glow, keeping it clean and solid */}
          <a 
            href="https://wa.me/256790879117" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#D7FF65] px-8 py-4 text-sm font-bold text-[#111720] transition-all duration-200 hover:-translate-y-1 hover:bg-white"
          >
            Chat on WhatsApp
            <span aria-hidden className="text-lg leading-none">→</span>
          </a>
        </section>

      </div>
    </div>
  );
}