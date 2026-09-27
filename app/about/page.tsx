import type { Metadata } from "next";
import { createClient } from "next-sanity";
import Cta from "@/components/Cta";
import PageHero from "@/components/PageHero";
import { Reveal, RollingNumber, ScrollRevealText } from "@/components/motion";
import { Tag } from "@/components/ui";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About | Make It Happen",
  description: "A Kampala team designing and engineering software, websites, AI automation and marketing for East African businesses.",
};

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

type AboutData = {
  about: {
    kicker: string | null;
    heading: string | null;
    subheading: string | null;
    mainDescription: string | null;
    imageUrl: string | null;
    gallery: { url: string; alt: string | null }[] | null;
    valuesKicker: string | null;
    valuesHeading: string | null;
    statsKicker: string | null;
    valuesList: { valueTitle: string | null; valueDescription: string | null }[] | null;
  } | null;
  home: {
    introImages: { url: string; alt: string | null }[] | null;
    stat1Label: string | null;
    stat1Value: string | null;
    stat2Label: string | null;
    stat2Value: string | null;
    stat3Label: string | null;
    stat3Value: string | null;
    stat4Label: string | null;
    stat4Value: string | null;
  } | null;
};

export default async function AboutPage() {
  const data = await client.fetch<AboutData>(`{
    "about": *[_id == "about"][0]{
      kicker, heading, subheading, mainDescription,
      "imageUrl": featuredImage.asset->url,
      "gallery": gallery[]{ "url": asset->url, alt },
      valuesKicker, valuesHeading, statsKicker,
      valuesList[]{ valueTitle, valueDescription }
    },
    "home": *[_id == "homepage"][0]{
      "introImages": introImages[]{ "url": asset->url, alt },
      stat1Label, stat1Value, stat2Label, stat2Value, stat3Label, stat3Value, stat4Label, stat4Value
    }
  }`);
  const about = data?.about;
  const home = data?.home;

  const paragraphs = (about?.mainDescription ?? "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const [lead, ...body] = paragraphs;
  const gallery = (about?.gallery?.length ? about.gallery : home?.introImages ?? []).filter((image) => image?.url);
  const values = (about?.valuesList ?? []).filter((value) => value?.valueTitle);
  const stats = [
    { label: home?.stat1Label, value: home?.stat1Value },
    { label: home?.stat2Label, value: home?.stat2Value },
    { label: home?.stat3Label, value: home?.stat3Value },
    { label: home?.stat4Label, value: home?.stat4Value },
  ].filter((stat): stat is { label: string; value: string } => Boolean(stat.label?.trim() && stat.value?.trim()));

  return (
    <div className="bg-paper text-ink">
      <PageHero
        kicker={about?.kicker?.trim() || "About us"}
        title={about?.heading?.trim() || "Our story"}
        description={about?.subheading}
      />

      {/* Story */}
      <section className="shell grid gap-12 py-20 sm:py-28 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          {about?.imageUrl ? (
            <Reveal className="lg:sticky lg:top-28">
              <img
                src={`${about.imageUrl}?w=1200&auto=format`}
                alt="The Make It Happen team"
                className="aspect-[4/5] w-full rounded-2xl object-cover"
              />
            </Reveal>
          ) : null}
        </div>
        <div className="lg:col-span-7">
          {lead ? (
            <ScrollRevealText text={lead} className="text-3xl font-medium leading-[1.15] tracking-[-0.035em] sm:text-4xl lg:text-[2.6rem]" />
          ) : null}
          {body.map((paragraph) => (
            <Reveal key={paragraph.slice(0, 40)}>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">{paragraph}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Photo strip */}
      {gallery.length ? (
        <div className="overflow-hidden pb-20 sm:pb-28">
          <ul className="flex w-max animate-[marquee_60s_linear_infinite] gap-4 pr-4 hover:[animation-play-state:paused]">
            {[...gallery, ...gallery].map((image, index) => (
              <li key={`${image.url}-${index}`} aria-hidden={index >= gallery.length} className="w-56 shrink-0 sm:w-72">
                <img
                  src={`${image.url}?w=720&auto=format`}
                  alt={index < gallery.length ? image.alt ?? "" : ""}
                  className="aspect-[4/5] w-full rounded-2xl object-cover"
                  loading="lazy"
                />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Values — dark */}
      {values.length ? (
        <section className="px-2 sm:px-3">
          <div className="rounded-[20px] bg-ink py-20 text-white sm:py-28">
            <div className="shell">
              <Reveal>
                <Tag tone="dark">{about?.valuesKicker?.trim() || "What we stand for"}</Tag>
                <h2 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-5xl">
                  {about?.valuesHeading?.trim() || "The principles behind every project."}
                </h2>
              </Reveal>
              <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-3">
                {values.map((value, index) => (
                  <li key={value.valueTitle} className="bg-ink">
                    <Reveal delay={index * 120} className="flex h-full flex-col py-8 sm:p-9">
                      <span className="font-mono text-sm text-accent-primary">[{String(index + 1).padStart(2, "0")}]</span>
                      <h3 className="mt-10 text-3xl font-semibold tracking-[-0.03em]">{value.valueTitle}</h3>
                      {value.valueDescription ? (
                        <p className="mt-4 text-[15px] leading-relaxed text-white/60">{value.valueDescription}</p>
                      ) : null}
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      {/* Numbers */}
      {stats.length ? (
        <section className="shell py-20 sm:py-28">
          <Tag>{about?.statsKicker?.trim() || "By the numbers"}</Tag>
          <dl className="mt-12 grid grid-cols-2 gap-y-12 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Reveal
                key={stat.label}
                delay={index * 120}
                className={`flex flex-col-reverse justify-end pr-6 ${index % 2 === 1 ? "border-l border-ink/10 pl-6" : ""} ${index > 0 ? "lg:border-l lg:border-ink/10 lg:pl-10" : ""}`}
              >
                <dt className="mt-4 text-lg font-medium">{stat.label}</dt>
                <dd className="text-6xl font-semibold tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                  <RollingNumber value={stat.value} />
                </dd>
              </Reveal>
            ))}
          </dl>
        </section>
      ) : null}

      <Cta />
    </div>
  );
}
