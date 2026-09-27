import type { Metadata } from "next";
import { createClient } from "next-sanity";
import ContactForm from "@/components/ContactForm";
import SocialLinks, { type SocialLinkItem, socialLinksProjection } from "@/components/SocialLinks";
import { Reveal } from "@/components/motion";
import { Tag } from "@/components/ui";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contact | Make It Happen",
  description: "Tell us what you are building. A senior member of the Make It Happen team replies within one working day.",
};

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

type ContactData = {
  contact: {
    kicker: string | null;
    heading: string | null;
    subheading: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    officeHours: string | null;
    formHeading: string | null;
    formNote: string | null;
    serviceOptions: string[] | null;
    budgetOptions: string[] | null;
  } | null;
  settings: { whatsappNumber: string | null; socialLinks: SocialLinkItem[] | null } | null;
  faqs: { question: string; answer: string }[] | null;
};

const DEFAULT_SERVICES = ["Website", "Software", "AI & Automation", "Digital Marketing"];

export default async function ContactPage() {
  const data = await client.fetch<ContactData>(`{
    "contact": *[_id == "contact"][0]{
      kicker, heading, subheading, email, phone, address, officeHours, formHeading, formNote, serviceOptions, budgetOptions
    },
    "settings": *[_id == "siteSettings"][0]{ whatsappNumber, ${socialLinksProjection} },
    "faqs": *[_id == "homepage"][0].faqs[]{ question, answer }
  }`);

  const contact = data?.contact;
  const email = contact?.email?.trim() || "hello@makeithappen.ug";
  const phone = contact?.phone?.trim() || "+256790879117";
  const whatsapp = data?.settings?.whatsappNumber?.trim() || phone;
  const address = contact?.address?.trim() || "Kampala, Uganda";
  const serviceOptions = (contact?.serviceOptions ?? []).map((option) => option?.trim()).filter(Boolean) as string[];
  const budgetOptions = (contact?.budgetOptions ?? []).map((option) => option?.trim()).filter(Boolean) as string[];
  const faqs = (data?.faqs ?? []).filter((faq) => faq?.question && faq?.answer);

  const rows = [
    { label: "Email", value: email, href: `mailto:${email}` },
    { label: "Phone & WhatsApp", value: phone, href: `https://wa.me/${whatsapp.replace(/\D/g, "")}` },
    { label: "Office", value: address, href: null },
    contact?.officeHours?.trim() ? { label: "Hours", value: contact.officeHours.trim(), href: null } : null,
  ].filter(Boolean) as { label: string; value: string; href: string | null }[];

  return (
    <div className="bg-paper text-ink">
      <section className="p-2 sm:p-3">
        <div className="relative isolate overflow-hidden rounded-[20px] bg-ink text-white">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-[0.08] [background-image:radial-gradient(circle,white_1px,transparent_1.6px)] [background-size:28px_28px]"
          />
          <div className="grid gap-12 px-5 pb-8 pt-32 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-10 lg:pb-10 lg:pt-40">
            <div className="animate-[rise_1.1s_cubic-bezier(0.16,1,0.3,1)_both] lg:col-span-5">
              <Tag>{contact?.kicker?.trim() || "Contact"}</Tag>
              <h1 className="mt-6 text-[2.6rem] font-semibold leading-[1] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                {contact?.heading?.trim() || "Let’s build something great"}
              </h1>
              {contact?.subheading ? (
                <p className="mt-6 max-w-md text-base leading-relaxed text-white/70 sm:text-lg">{contact.subheading}</p>
              ) : null}

              <dl className="mt-10 divide-y divide-white/10 border-y border-white/10">
                {rows.map((row) => (
                  <div key={row.label} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-white/50">{row.label}</dt>
                    <dd className="text-lg font-medium">
                      {row.href ? (
                        <a
                          href={row.href}
                          target={row.href.startsWith("http") ? "_blank" : undefined}
                          rel={row.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="underline decoration-white/20 underline-offset-4 transition-colors hover:decoration-accent-primary"
                        >
                          {row.value}
                        </a>
                      ) : (
                        <span className="whitespace-pre-line">{row.value}</span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              <SocialLinks links={data?.settings?.socialLinks} size="md" className="mt-8" />
            </div>

            <div className="animate-[rise_1.1s_cubic-bezier(0.16,1,0.3,1)_150ms_both] lg:col-span-7">
              <ContactForm
                email={email}
                whatsappNumber={whatsapp}
                serviceOptions={serviceOptions.length ? serviceOptions : DEFAULT_SERVICES}
                budgetOptions={budgetOptions}
                heading={contact?.formHeading?.trim() || "Tell us about your project"}
                note={
                  contact?.formNote?.trim() ||
                  "Your brief opens in WhatsApp or your email app, ready to send. A senior member of the team replies within one working day."
                }
              />
            </div>
          </div>
        </div>
      </section>

      {faqs.length ? (
        <section className="shell grid gap-12 py-20 sm:py-28 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <Tag>FAQ</Tag>
            <h2 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl">Before you ask.</h2>
          </Reveal>
          <div className="flex flex-col gap-3 lg:col-span-7">
            {faqs.map((faq, index) => (
              <Reveal key={faq.question} delay={index * 90}>
                <details className="group rounded-2xl bg-white px-6 py-5 open:pb-6 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium tracking-[-0.01em]">
                    {faq.question}
                    <span
                      aria-hidden
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-paper text-xl leading-none transition-transform duration-300 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-4 max-w-2xl whitespace-pre-line text-base leading-relaxed text-muted">{faq.answer}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
