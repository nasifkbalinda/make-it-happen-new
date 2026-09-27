import { createClient } from "next-sanity";
import { Reveal } from "./motion";
import { PillLink, Tag } from "./ui";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

type CtaSettings = {
  ctaKicker: string | null;
  ctaHeading: string | null;
  ctaDescription: string | null;
  ctaPrimaryText: string | null;
  ctaPrimaryLink: string | null;
  ctaWhatsappText: string | null;
  whatsappNumber: string | null;
} | null;

/** Closing call to action shared by every page. Its copy lives in Global Site Settings. */
export default async function Cta() {
  const settings = await client.fetch<CtaSettings>(
    `*[_id == "siteSettings"][0]{ ctaKicker, ctaHeading, ctaDescription, ctaPrimaryText, ctaPrimaryLink, ctaWhatsappText, whatsappNumber }`,
  );
  const whatsappDigits = (settings?.whatsappNumber || "+256790879117").replace(/\D/g, "");
  const whatsappText = settings?.ctaWhatsappText?.trim() ?? "Chat on WhatsApp";

  return (
    <section className="bg-paper px-2 pb-2 pt-2 sm:px-3 sm:pb-3">
      <div className="relative overflow-hidden rounded-[20px] bg-ink px-6 py-20 text-center text-white sm:py-32">
        {/* The logo's breakaway pixels, as a quiet corner mark. */}
        <div aria-hidden className="pointer-events-none absolute right-8 top-8 hidden grid-cols-4 gap-2 sm:grid">
          {[1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0].map((on, index) => (
            <span key={index} className={`h-3 w-3 ${on ? "bg-accent-primary" : "bg-transparent"}`} />
          ))}
        </div>
        <Reveal>
          <Tag tone="dark">{settings?.ctaKicker?.trim() || "Get started"}</Tag>
          <h2 className="mx-auto mt-6 max-w-4xl text-[2.6rem] font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            {settings?.ctaHeading?.trim() || "Let’s make it happen."}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
            {settings?.ctaDescription?.trim() ||
              "Tell us what you’re building. A senior member of the team replies within one working day."}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <PillLink href={settings?.ctaPrimaryLink?.trim() || "/contact"} variant="accent" size="lg">
              {settings?.ctaPrimaryText?.trim() || "Start a project"}
            </PillLink>
            {whatsappText ? (
              <PillLink href={`https://wa.me/${whatsappDigits}`} variant="outline" size="lg">
                {whatsappText}
              </PillLink>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
