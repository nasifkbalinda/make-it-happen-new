import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "next-sanity";
import Cta from "@/components/Cta";
import ServicesShowcase, {
  type ShowcaseService,
} from "@/components/ServicesShowcase";
import {
  BackgroundVideo,
  Reveal,
  RollingNumber,
  ScrollRevealText,
} from "@/components/motion";
import { ArrowLink, PillLink, Tag } from "@/components/ui";

// --- SEO METADATA ---
export const metadata: Metadata = {
  metadataBase: new URL("https://makeithappen.ug"),
  alternates: {
    canonical: "/",
  },
  title: "Make It Happen | Software, Web Design & AI Automation Uganda",
  description:
    "Elite tech agency in Kampala. We engineer custom software, premium web design, AI integrations, business automation, and data-driven digital marketing.",
  keywords: [
    "Software development Uganda",
    "Web design Kampala",
    "AI integration agency",
    "Business automation",
    "Digital marketing Uganda",
    "Custom software solutions Kampala",
    "Make It Happen Uganda",
  ],
  openGraph: {
    title: "Make It Happen | Software, Web Design & AI Automation",
    description:
      "Transforming businesses in Uganda with custom software, premium web design, AI, automation, and digital marketing.",
    url: "https://makeithappen.ug",
    siteName: "Make It Happen",
    images: [
      {
        url: "https://makeithappen.ug/og-image.png", // Ensure you add an og-image.png (1200x630) to your public folder!
        width: 1200,
        height: 630,
        alt: "Make It Happen Tech Agency Kampala",
      },
    ],
    locale: "en_UG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Make It Happen | Tech & Software Agency Uganda",
    description:
      "Custom software, high-performance web design, AI automation, and digital marketing.",
    images: ["https://makeithappen.ug/og-image.png"],
  },
};

// Enables Next.js ISR: Checks Sanity for new content every 60 seconds automatically
export const revalidate = 60;

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

type HomeData = {
  heroHeading: string | null;
  heroSubheading: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  posterUrl: string | null;
  primaryCtaText: string | null;
  primaryCtaLink: string | null;
  secondaryCtaText: string | null;
  secondaryCtaLink: string | null;
  featuredProjectsKicker: string | null;
  featuredProjectsTitle: string | null;
  featuredProjectsDescription: string | null;
  stat1Label: string | null;
  stat1Value: string | null;
  stat2Label: string | null;
  stat2Value: string | null;
  stat3Label: string | null;
  stat3Value: string | null;
  stat4Label: string | null;
  stat4Value: string | null;
  introStatement: string | null;
  introImages: { url: string; alt: string | null }[] | null;
  faqs: { question: string; answer: string }[] | null;
};

type HomeProject = {
  _id: string;
  title: string;
  category: string | null;
  projectUrl: string | null;
  imageUrl: string | null;
  imageWidth: number | null;
  brandColor: string | null;
};

type HomePost = {
  _id: string;
  title: string | null;
  slug: string | null;
  excerpt: string | null;
  publishedAt: string | null;
  imageUrl: string | null;
  characters: number | null;
};

// Fixed document ID: the Studio edits this singleton (sanity/structure.ts).
const homeQuery = `{
  "home": *[_id == "homepage"][0]{
    heroHeading, heroSubheading, "imageUrl": heroImage.asset->url, "videoUrl": heroVideo.asset->url, "posterUrl": heroVideoPoster.asset->url,
    primaryCtaText, primaryCtaLink, secondaryCtaText, secondaryCtaLink,
    featuredProjectsKicker, featuredProjectsTitle, featuredProjectsDescription,
    stat1Label, stat1Value, stat2Label, stat2Value, stat3Label, stat3Value, stat4Label, stat4Value,
    introStatement,
    "introImages": introImages[]{ "url": asset->url, alt },
    faqs[]{ question, answer }
  },
  "about": *[_id == "about"][0]{ mainDescription },
  "projects": *[_type == "project"] | order(_createdAt desc)[0...6]{
    _id, title, category, projectUrl,
    "imageUrl": mainImage.asset->url,
    "imageWidth": mainImage.asset->metadata.dimensions.width,
    "brandColor": mainImage.asset->metadata.palette.dominant.background
  },
  "projectCount": count(*[_type == "project"]),
  "services": *[_type == "service"] | order(_createdAt asc){
    _id, title, description, features, "imageUrl": mainImage.asset->url
  },
  "posts": *[_type == "post"] | order(publishedAt desc)[0...3]{
    _id, title, "slug": slug.current, excerpt, publishedAt,
    "imageUrl": mainImage.asset->url,
    "characters": length(pt::text(body))
  }
}`;

type HomeQueryResult = {
  home: HomeData | null;
  about: { mainDescription: string | null } | null;
  projects: HomeProject[] | null;
  projectCount: number | null;
  services: ShowcaseService[] | null;
  posts: HomePost[] | null;
};

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function readMinutes(characters: number | null) {
  // ~5 characters a word, ~200 words a minute.
  return Math.max(1, Math.round((characters ?? 0) / 1000));
}

/** Site logos and favicons are small; screenshots and photos are not. Logos get a framed panel. */
function isLogo(width: number | null) {
  return !width || width < 900;
}

function ProjectCard({
  project,
  tall,
}: {
  project: HomeProject;
  tall?: boolean;
}) {
  const href = project.projectUrl || "/projects";
  const external = Boolean(project.projectUrl);
  const logo = isLogo(project.imageWidth);
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group block"
    >
      <div
        className={`relative w-full overflow-hidden rounded-2xl bg-paper-raised ${tall ? "aspect-[4/5]" : "aspect-[5/4]"}`}
        // A logo sits on its own dominant colour (measured by Sanity), so each project reads as a brand tile.
        style={
          logo && project.brandColor
            ? { backgroundColor: project.brandColor }
            : undefined
        }
      >
        {project.imageUrl ? (
          logo ? (
            <div className="flex h-full w-full items-center justify-center p-10">
              <img
                src={project.imageUrl}
                alt={`${project.title} logo`}
                className="max-h-[55%] max-w-[70%] object-contain transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            </div>
          ) : (
            <img
              src={project.imageUrl}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-ink/30">
            {project.title}
          </div>
        )}
        <span className="absolute right-4 top-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-white text-ink opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <svg
            aria-hidden
            className="h-4 w-4"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 11 11 5M6 5h5v5"
            />
          </svg>
        </span>
      </div>
      <p className="mt-5 text-2xl font-semibold tracking-[-0.02em] text-ink">
        {project.title}
      </p>
      {project.category ? (
        <p className="mt-1 font-mono text-xs uppercase tracking-[0.08em] text-muted">
          {project.category}
        </p>
      ) : null}
    </Link>
  );
}

export default async function Home() {
  const data = await client.fetch<HomeQueryResult>(homeQuery);
  const home = data?.home;
  const projects = data?.projects ?? [];
  const services = data?.services ?? [];
  const posts = data?.posts ?? [];
  const faqs = (home?.faqs ?? []).filter((faq) => faq?.question && faq?.answer);
  const introImages = (home?.introImages ?? []).filter((image) => image?.url);

  const stats = [
    { label: home?.stat1Label, value: home?.stat1Value },
    { label: home?.stat2Label, value: home?.stat2Value },
    { label: home?.stat3Label, value: home?.stat3Value },
    { label: home?.stat4Label, value: home?.stat4Value },
  ].filter((stat): stat is { label: string; value: string } =>
    Boolean(stat.label?.trim() && stat.value?.trim()),
  );

  const introStatement =
    home?.introStatement?.trim() ||
    data?.about?.mainDescription?.split(/\n\s*\n/)[0]?.trim() ||
    "We build the software, websites and growth systems that ambitious East African businesses run on.";

  const shippedValue = home?.stat1Value?.trim();

  return (
    <div className="bg-paper text-ink">
      {/* 1. Hero — a dark card inset from the page edge, with the black-and-white Kampala film behind it */}
      <section className="p-2 sm:p-3">
        <div className="relative isolate flex min-h-[calc(100svh-1rem)] flex-col overflow-hidden rounded-[20px] bg-ink text-white sm:min-h-[calc(100svh-1.5rem)]">
          {home?.videoUrl ? (
            <BackgroundVideo
              src={home.videoUrl}
              poster={home.posterUrl ?? home.imageUrl}
              className="absolute inset-0 -z-10 h-full w-full object-cover grayscale"
            />
          ) : home?.imageUrl ? (
            <img
              src={home.imageUrl}
              alt=""
              className="absolute inset-0 -z-10 h-full w-full object-cover grayscale"
              fetchPriority="high"
            />
          ) : null}
          <div aria-hidden className="absolute inset-0 -z-10 bg-ink/45" />
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 -z-10 w-3/4 bg-gradient-to-r from-ink/70 to-transparent"
          />

          <div className="flex flex-1 flex-col justify-end px-5 pb-8 pt-32 sm:px-8 lg:px-10 lg:pb-10">
            <div className="max-w-4xl animate-[rise_1.1s_cubic-bezier(0.16,1,0.3,1)_both]">
              <Tag>Software · Web · AI · Marketing</Tag>
              <h1 className="mt-6 text-[2.75rem] font-semibold leading-[0.98] tracking-[-0.045em] sm:text-7xl lg:text-[6.25rem]">
                {home?.heroHeading || "Let’s make it happen."}
              </h1>
              {home?.heroSubheading ? (
                <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                  {home.heroSubheading}
                </p>
              ) : null}
            </div>

            <div className="mt-14 flex flex-col gap-8 lg:mt-24 lg:flex-row lg:items-end lg:justify-between animate-[rise_1.1s_cubic-bezier(0.16,1,0.3,1)_250ms_both]">
              <ul className="grid gap-2 font-mono text-xs uppercase tracking-[0.08em] text-white/70 sm:grid-cols-3 sm:gap-10">
                <li>+ Based: Kampala, UG</li>
                <li>+ Focus: Software · Web · AI</li>
                {shippedValue ? (
                  <li>+ Shipped: {shippedValue} products</li>
                ) : (
                  <li>+ Serving: East Africa</li>
                )}
              </ul>
              <div className="max-w-sm">
                <p className="text-xl font-medium leading-snug tracking-[-0.02em] sm:text-2xl">
                  Websites, software and growth systems for businesses that mean
                  it.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <PillLink
                    href={home?.secondaryCtaLink || "/projects"}
                    variant="accent"
                  >
                    {home?.secondaryCtaText || "View our work"}
                  </PillLink>
                  <PillLink
                    href={home?.primaryCtaLink || "/contact"}
                    variant="light"
                  >
                    {home?.primaryCtaText || "Start a project"}
                  </PillLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Client strip — the project names from Sanity scroll past */}
      {projects.length > 0 ? (
        <section className="shell flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:gap-10">
          <p className="flex max-w-[16rem] shrink-0 items-start gap-3 font-mono text-[11px] uppercase leading-relaxed tracking-[0.08em] text-muted">
            <span
              aria-hidden
              className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-[2px] bg-accent-primary"
            />
            {shippedValue
              ? `${shippedValue} products shipped for businesses across East Africa.`
              : "Trusted by businesses across East Africa."}
          </p>
          <div className="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <ul className="flex w-max animate-marquee items-center gap-16 pr-16">
              {[...projects, ...projects].map((project, index) => (
                <li
                  key={`${project._id}-${index}`}
                  aria-hidden={index >= projects.length}
                  className="flex items-center gap-3 whitespace-nowrap text-xl font-semibold tracking-[-0.02em] text-ink/80"
                >
                  <span aria-hidden className="grid grid-cols-2 gap-0.5">
                    <span className="h-1.5 w-1.5 bg-ink/70" />
                    <span className="h-1.5 w-1.5 bg-accent-primary" />
                    <span className="h-1.5 w-1.5 bg-accent-primary" />
                    <span className="h-1.5 w-1.5 bg-ink/70" />
                  </span>
                  {project.title}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* 3. Who we are — the statement fills in as it scrolls, then the team strip */}
      <section className="border-t border-ink/10 pt-24 sm:pt-32">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Tag>Who we are</Tag>
          </div>
          <div className="lg:col-span-9">
            <ScrollRevealText
              text={introStatement}
              className="text-3xl font-medium leading-[1.12] tracking-[-0.035em] sm:text-5xl lg:text-[3.6rem]"
            />
            <ArrowLink href="/about" className="mt-10 text-ink">
              About the studio
            </ArrowLink>
          </div>
        </div>

        {introImages.length > 0 ? (
          <div className="mt-20 overflow-hidden">
            <ul className="flex w-max animate-[marquee_60s_linear_infinite] gap-4 pr-4 hover:[animation-play-state:paused]">
              {[...introImages, ...introImages].map((image, index) => (
                <li
                  key={`${image.url}-${index}`}
                  aria-hidden={index >= introImages.length}
                  className="w-60 shrink-0 sm:w-72"
                >
                  <img
                    src={`${image.url}?w=720&auto=format`}
                    alt={index < introImages.length ? (image.alt ?? "") : ""}
                    className="aspect-[4/5] w-full rounded-2xl object-cover"
                    loading="lazy"
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      {/* 4. By the numbers */}
      {stats.length > 0 ? (
        <section className="shell py-24 sm:py-32">
          <Tag>By the numbers</Tag>
          <dl className="mt-12 grid grid-cols-2 gap-y-12 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Reveal
                key={stat.label}
                delay={index * 120}
                className={`pr-6 ${index % 2 === 1 ? "border-l border-ink/10 pl-6" : ""} ${index > 0 ? "lg:border-l lg:border-ink/10 lg:pl-10" : ""}`}
              >
                <dd className="text-6xl font-semibold tracking-[-0.05em] text-ink sm:text-7xl lg:text-8xl">
                  <RollingNumber value={stat.value} />
                </dd>
                <dt className="mt-4 text-lg font-medium tracking-[-0.01em] text-ink">
                  {stat.label}
                </dt>
              </Reveal>
            ))}
          </dl>
        </section>
      ) : null}

      {/* 5. Services — dark */}
      {services.length > 0 ? (
        <section className="px-2 sm:px-3">
          <div className="rounded-[20px] bg-ink py-20 text-white sm:py-28">
            <div className="shell">
              <Reveal className="flex flex-col gap-8 border-b border-white/10 pb-12 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <Tag>Services</Tag>
                  <h2 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl">
                    Everything{" "}
                    {services.find((service) => service.imageUrl)?.imageUrl ? (
                      <span className="inline-block h-[0.8em] w-[1.6em] translate-y-[0.08em] overflow-hidden rounded-full align-baseline">
                        <img
                          src={`${services.find((service) => service.imageUrl)?.imageUrl}?w=240&auto=format`}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </span>
                    ) : null}{" "}
                    your business needs to grow online.
                  </h2>
                </div>
                <p className="max-w-sm text-sm leading-relaxed text-white/60">
                  One accountable team for design, engineering, automation and
                  growth, from the first workshop to long after launch.
                </p>
              </Reveal>
              <div className="mt-6">
                <ServicesShowcase services={services} />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* 6. Selected work — two staggered columns */}
      {projects.length > 0 ? (
        <section className="shell py-24 sm:py-32">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Tag>{home?.featuredProjectsKicker?.trim() || "Selected work"}</Tag>
            <h2 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-6xl">
              {(home?.featuredProjectsTitle || "Featured projects").replace(
                /\s*\n\s*/g,
                " ",
              )}
            </h2>
            {home?.featuredProjectsDescription ? (
              <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
                {home.featuredProjectsDescription}
              </p>
            ) : null}
          </Reveal>

          <div className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:gap-x-16">
            <div className="flex flex-col gap-16">
              {projects
                .filter((_, index) => index % 2 === 0)
                .map((project) => (
                  <Reveal key={project._id}>
                    <ProjectCard project={project} tall />
                  </Reveal>
                ))}
            </div>
            <div className="flex flex-col gap-16 md:pt-40">
              {projects
                .filter((_, index) => index % 2 === 1)
                .map((project) => (
                  <Reveal key={project._id}>
                    <ProjectCard project={project} tall />
                  </Reveal>
                ))}
            </div>
          </div>

          <div className="mt-16 flex justify-center">
            <ArrowLink href="/projects" className="text-2xl text-ink">
              <>
                All cases
                {data?.projectCount ? (
                  <sup className="ml-1 font-mono text-xs text-accent-secondary">
                    ({String(data.projectCount).padStart(2, "0")})
                  </sup>
                ) : null}
              </>
            </ArrowLink>
          </div>
        </section>
      ) : null}

      {/* 7. FAQ */}
      {faqs.length > 0 ? (
        <section className="shell grid gap-12 border-t border-ink/10 py-24 sm:py-32 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <Tag>FAQ</Tag>
            <h2 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl">
              Questions, answered.
            </h2>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-muted">
              Anything else? Ask us directly and a senior member of the team
              will reply within one working day.
            </p>
            <div className="mt-8">
              <PillLink href="/contact" variant="dark">
                Ask a question
              </PillLink>
            </div>
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
                  <p className="mt-4 max-w-2xl whitespace-pre-line text-base leading-relaxed text-muted">
                    {faq.answer}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {/* 8. Journal */}
      {posts.length > 0 ? (
        <section className="shell border-t border-ink/10 py-24 sm:py-32">
          <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Tag>Insights</Tag>
              <h2 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl">
                From the journal.
              </h2>
            </div>
            <ArrowLink href="/blog" className="text-ink">
              View all posts
            </ArrowLink>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {posts.map((post, index) => (
              <Reveal key={post._id} delay={index * 120}>
                <Link
                  href={post.slug ? `/blog/${post.slug}` : "/blog"}
                  className="group flex h-full flex-col rounded-2xl bg-white p-4 transition-colors hover:bg-paper-raised sm:p-5"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-paper-raised">
                    {post.imageUrl ? (
                      <img
                        src={`${post.imageUrl}?w=900&auto=format`}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    ) : null}
                  </div>
                  <div className="mt-5 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
                    {post.publishedAt ? (
                      <time dateTime={post.publishedAt}>
                        {dateFormat.format(new Date(post.publishedAt))}
                      </time>
                    ) : null}
                    <span className="flex items-center gap-1.5">
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 rounded-full bg-accent-primary"
                      />
                      {readMinutes(post.characters)} min read
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold leading-snug tracking-[-0.02em]">
                    {post.title}
                  </h3>
                  {post.excerpt ? (
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">
                      {post.excerpt}
                    </p>
                  ) : null}
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      <Cta />
    </div>
  );
}
