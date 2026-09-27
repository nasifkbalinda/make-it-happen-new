import type { Metadata } from "next";
import { createClient } from "next-sanity";
import Cta from "@/components/Cta";
import PageHero from "@/components/PageHero";
import { Reveal } from "@/components/motion";
import { ArrowLink, Tag } from "@/components/ui";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Services | Make It Happen",
  description:
    "Web design and development, custom software, AI and automation, and digital marketing — one accountable team in Kampala.",
};

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

type Service = {
  _id: string;
  title: string | null;
  description: string | null;
  features: string[] | null;
  imageUrl: string | null;
};

type ServicesPageData = {
  kicker: string | null;
  heading: string | null;
  description: string | null;
  processKicker: string | null;
  processHeading: string | null;
  processSteps: { title: string; description: string | null }[] | null;
} | null;

const DEFAULT_STEPS = [
  { title: "Discover", description: "A working session to understand the business problem, the people it affects and what success looks like." },
  { title: "Design", description: "Flows, interfaces and a plan you can hold us to — reviewed with you before a line of production code." },
  { title: "Build", description: "Short cycles with a working version to test every step, built to be fast, secure and easy to maintain." },
  { title: "Launch & grow", description: "We ship, measure and keep improving — with support, hosting and marketing that keep it performing." },
];

export default async function ServicesPage() {
  // Fixed ID: the Studio edits this singleton (sanity/structure.ts).
  const [page, services] = await Promise.all([
    client.fetch<ServicesPageData>(`*[_id == "servicesPage"][0]{ kicker, heading, description, processKicker, processHeading, processSteps[]{ title, description } }`),
    client.fetch<Service[]>(`*[_type == "service"] | order(_createdAt asc){ _id, title, description, features, "imageUrl": mainImage.asset->url }`),
  ]);

  const steps = (page?.processSteps ?? []).filter((step) => step?.title).length
    ? (page?.processSteps ?? []).filter((step) => step?.title)
    : DEFAULT_STEPS;

  return (
    <div className="bg-paper text-ink">
      <PageHero
        kicker={page?.kicker?.trim() || "Services"}
        title={page?.heading?.trim() || "What we offer"}
        description={page?.description}
        aside={services.length ? `${String(services.length).padStart(2, "0")} disciplines · one team` : null}
      />

      {/* Services — alternating rows */}
      <section className="shell py-16 sm:py-24">
        {services.map((service, index) => {
          const features = (service.features ?? []).filter((feature) => feature?.trim());
          return (
            <Reveal key={service._id}>
              <article className="grid gap-8 border-t border-ink/10 py-12 sm:py-16 lg:grid-cols-12 lg:items-center lg:gap-16">
                <div className={`lg:col-span-5 ${index % 2 === 1 ? "lg:order-2 lg:col-start-8" : ""}`}>
                  <p className="font-mono text-sm text-accent-secondary">[{String(index + 1).padStart(2, "0")}]</p>
                  <h2 className="mt-3 text-4xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                    {service.title}
                  </h2>
                  {service.description ? (
                    <p className="mt-5 text-lg leading-relaxed text-muted">{service.description}</p>
                  ) : null}
                  {features.length ? (
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {features.map((feature) => (
                        <li key={feature} className="rounded-full border border-ink/15 bg-white px-3.5 py-1.5 text-sm">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <ArrowLink href="/contact" className="mt-8 text-ink">
                    {service.title ? `Talk to us about ${service.title}` : "Talk to us"}
                  </ArrowLink>
                </div>
                <div className={`lg:col-span-7 ${index % 2 === 1 ? "lg:order-1 lg:col-start-1" : ""}`}>
                  <div className="aspect-[16/11] w-full overflow-hidden rounded-2xl bg-paper-raised">
                    {service.imageUrl ? (
                      <img src={`${service.imageUrl}?w=1400&auto=format`} alt="" className="h-full w-full object-cover" loading="lazy" />
                    ) : null}
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}

        {services.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-ink/20 py-20 text-center text-muted">
            No services yet. Add documents of type &quot;Service&quot; in the Studio.
          </p>
        ) : null}
      </section>

      {/* How we work — dark */}
      <section className="px-2 pb-2 sm:px-3">
        <div className="rounded-[20px] bg-ink py-20 text-white sm:py-28">
          <div className="shell">
            <Reveal>
              <Tag tone="dark">{page?.processKicker?.trim() || "How we work"}</Tag>
              <h2 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl">
                {page?.processHeading?.trim() || "From first call to long after launch."}
              </h2>
            </Reveal>
            <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <li key={step.title} className="bg-ink">
                  <Reveal delay={index * 120} className="flex h-full flex-col py-8 sm:p-8">
                    <span className="font-mono text-5xl font-semibold tracking-[-0.04em] text-accent-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-8 text-2xl font-semibold tracking-[-0.02em]">{step.title}</h3>
                    {step.description ? <p className="mt-3 text-[15px] leading-relaxed text-white/60">{step.description}</p> : null}
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <Cta />
    </div>
  );
}
