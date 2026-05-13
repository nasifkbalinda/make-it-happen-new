import { createClient } from "next-sanity";
import { Mail, MapPin, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ContactForm from "@/components/ContactForm";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

const contactQuery = `*[_type == "contact" && _id == "contact"][0]{
  heading,
  subheading,
  email,
  phone,
  address
}`;

type ContactDoc = {
  heading: string | null;
  subheading: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
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
  const data = await client.fetch<ContactDoc | null>(contactQuery);

  const heading = data?.heading ?? "Let’s talk";
  const subheading =
    data?.subheading ??
    "Share a few details and we’ll get back to you with next steps.";
  const email = data?.email ?? "hello@makeithappen.example";
  const phone = data?.phone ?? "+1 (555) 000-0000";
  const address =
    data?.address ?? "Remote-first · Worldwide";

  return (
    <div className="mx-auto w-full max-w-7xl px-6 pb-24 pt-24 sm:px-10 lg:px-14">
      <div className="grid gap-16 md:grid-cols-2 md:items-start">
        <section className="flex flex-col gap-10">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              {heading}
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/65">
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
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-[#111720] p-8">
          <h2 className="text-lg font-semibold text-white">Send a message</h2>
          <p className="mt-1 text-sm text-white/50">
            We usually reply within one business day.
          </p>
          <div className="mt-8">
            <ContactForm />
          </div>
        </section>
      </div>
    </div>
  );
}
