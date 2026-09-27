import type { Metadata } from "next";
import { createClient } from "next-sanity";
import Cta from "@/components/Cta";
import { PostCard, ProjectCard, postCardProjection, projectCardProjection, type PostCardData, type ProjectCardData } from "@/components/cards";
import HeroStage from "@/components/HeroStage";
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
  heroChatQuestion: string | null;
  heroChatAnswer: string | null;
  clientsLabel: string | null;
  introKicker: string | null;
  introLinkText: string | null;
  statsKicker: string | null;
  servicesKicker: string | null;
  servicesHeading: string | null;
  servicesDescription: string | null;
  workLinkText: string | null;
  faqKicker: string | null;
  faqHeading: string | null;
  faqDescription: string | null;
  faqButtonText: string | null;
  journalKicker: string | null;
  journalHeading: string | null;
  journalLinkText: string | null;
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



// Fixed document ID: the Studio edits this singleton (sanity/structure.ts).
const homeQuery = `{
  "home": *[_id == "homepage"][0]{
    heroHeading, heroSubheading, heroChatQuestion, heroChatAnswer,
    clientsLabel, introKicker, introLinkText, statsKicker, servicesKicker, servicesHeading, servicesDescription,
    workLinkText, faqKicker, faqHeading, faqDescription, faqButtonText, journalKicker, journalHeading, journalLinkText,
    "imageUrl": heroImage.asset->url, "videoUrl": heroVideo.asset->url, "posterUrl": heroVideoPoster.asset->url,
    primaryCtaText, primaryCtaLink, secondaryCtaText, secondaryCtaLink,
    featuredProjectsKicker, featuredProjectsTitle, featuredProjectsDescription,
    stat1Label, stat1Value, stat2Label, stat2Value, stat3Label, stat3Value, stat4Label, stat4Value,
    introStatement,
    "introImages": introImages[]{ "url": asset->url, alt },
    faqs[]{ question, answer }
  },
  "about": *[_id == "about"][0]{ mainDescription },
  "projects": *[_type == "project"] | order(_createdAt desc)[0...6]{ ${projectCardProjection} },
  "projectCount": count(*[_type == "project"]),
  "services": *[_type == "service"] | order(_createdAt asc){
    _id, title, description, features, "imageUrl": mainImage.asset->url
  },
  "posts": *[_type == "post"] | order(publishedAt desc)[0...3]{ ${postCardProjection} }
}`;

type HomeQueryResult = {
  home: HomeData | null;
  about: { mainDescription: string | null } | null;
  projects: ProjectCardData[] | null;
  projectCount: number | null;
  services: ShowcaseService[] | null;
  posts: PostCardData[] | null;
};

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
      {/* 1. Hero — dark card: the pitch on the left, the looping hero animation on the right */}
      <section className="p-2 sm:p-3">
        <div className="relative isolate overflow-hidden rounded-[20px] bg-ink text-white">
          {home?.videoUrl ? (
            <BackgroundVideo
              src={home.videoUrl}
              poster={home.posterUrl}
              className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25"
            />
          ) : null}
          {/* A faint dot grid, like graph paper under the work. */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-[0.08] [background-image:radial-gradient(circle,white_1px,transparent_1.6px)] [background-size:28px_28px]"
          />

          <div className="grid min-h-[calc(100svh-1rem)] content-center gap-12 px-5 pb-10 pt-28 sm:min-h-[calc(100svh-1.5rem)] sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-10 lg:pb-12 lg:pt-32">
            <div className="animate-[rise_1.1s_cubic-bezier(0.16,1,0.3,1)_both] lg:col-span-6">
              <h1 className="text-[2.9rem] font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl xl:text-[4.75rem]">
                {home?.heroHeading || "Let\u2019s make it happen."}
              </h1>
              {home?.heroSubheading ? (
                <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">{home.heroSubheading}</p>
              ) : null}
              <div className="mt-9 flex flex-wrap gap-3">
                <PillLink href={home?.primaryCtaLink || "/contact"} variant="accent" size="lg">
                  {home?.primaryCtaText || "Start a project"}
                </PillLink>
                <PillLink href={home?.secondaryCtaLink || "/projects"} variant="light" size="lg">
                  {home?.secondaryCtaText || "View our work"}
                </PillLink>
              </div>
            </div>

            <div className="animate-[rise_1.1s_cubic-bezier(0.16,1,0.3,1)_200ms_both] lg:col-span-6">
              <HeroStage
                chatQuestion={home?.heroChatQuestion}
                chatAnswer={home?.heroChatAnswer}
                photoUrl={introImages[0]?.url}
              />
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
            {home?.clientsLabel?.trim() ||
              (shippedValue
                ? `${shippedValue} products shipped for businesses across East Africa.`
                : "Trusted by businesses across East Africa.")}
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
            <Tag>{home?.introKicker?.trim() || "Who we are"}</Tag>
          </div>
          <div className="lg:col-span-9">
            <ScrollRevealText
              text={introStatement}
              className="text-3xl font-medium leading-[1.12] tracking-[-0.035em] sm:text-4xl lg:text-[2.75rem]"
            />
            <ArrowLink href="/about" className="mt-10 text-ink">
              {home?.introLinkText?.trim() || "About us"}
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
          <Tag>{home?.statsKicker?.trim() || "By the numbers"}</Tag>
          <dl className="mt-12 grid grid-cols-2 gap-y-12 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Reveal
                key={stat.label}
                delay={index * 120}
                className={`flex flex-col-reverse justify-end pr-6 ${index % 2 === 1 ? "border-l border-ink/10 pl-6" : ""} ${index > 0 ? "lg:border-l lg:border-ink/10 lg:pl-10" : ""}`}
              >
                <dt className="mt-4 text-lg font-medium tracking-[-0.01em] text-ink">
                  {stat.label}
                </dt>
                <dd className="text-6xl font-semibold tracking-[-0.05em] text-ink sm:text-6xl lg:text-7xl">
                  <RollingNumber value={stat.value} />
                </dd>
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
                  <Tag>{home?.servicesKicker?.trim() || "Services"}</Tag>
                  <h2 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-5xl">
                    {home?.servicesHeading?.trim() || "Everything your business needs to grow online."}
                  </h2>
                </div>
                <p className="max-w-sm text-sm leading-relaxed text-white/60">
                  {home?.servicesDescription?.trim() ||
                    "One accountable team for design, engineering, automation and growth, from the first workshop to long after launch."}
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
            <h2 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl">
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

          <div className="mt-12 grid gap-x-8 gap-y-10 sm:mt-16 md:grid-cols-2 md:gap-y-16 lg:gap-x-16">
            <div className="flex flex-col gap-10 md:gap-16">
              {projects
                .filter((_, index) => index % 2 === 0)
                .map((project) => (
                  <Reveal key={project._id}>
                    <ProjectCard project={project} />
                  </Reveal>
                ))}
            </div>
            <div className="flex flex-col gap-10 md:gap-16 md:pt-40">
              {projects
                .filter((_, index) => index % 2 === 1)
                .map((project) => (
                  <Reveal key={project._id}>
                    <ProjectCard project={project} />
                  </Reveal>
                ))}
            </div>
          </div>

          <div className="mt-16 flex justify-center">
            <ArrowLink href="/projects" className="text-2xl text-ink">
              <>
                {home?.workLinkText?.trim() || "All cases"}
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
            <Tag>{home?.faqKicker?.trim() || "FAQ"}</Tag>
            <h2 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl">
              {home?.faqHeading?.trim() || "Questions, answered."}
            </h2>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-muted">
              {home?.faqDescription?.trim() ||
                "Anything else? Ask us directly and a senior member of the team will reply within one working day."}
            </p>
            <div className="mt-8">
              <PillLink href="/contact" variant="dark">
                {home?.faqButtonText?.trim() || "Ask a question"}
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
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-paper text-xl leading-none transition-transform duration-300 group-open:rotate-45"
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
              <Tag>{home?.journalKicker?.trim() || "Insights"}</Tag>
              <h2 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl">
                {home?.journalHeading?.trim() || "From the journal."}
              </h2>
            </div>
            <ArrowLink href="/blog" className="text-ink">
              {home?.journalLinkText?.trim() || "View all posts"}
            </ArrowLink>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {posts.map((post, index) => (
              <Reveal key={post._id} delay={index * 120}>
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      <Cta />
    </div>
  );
}
