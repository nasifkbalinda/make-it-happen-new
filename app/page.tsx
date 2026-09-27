import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "next-sanity";
import Cta from "@/components/Cta";

// --- SEO METADATA ---
export const metadata: Metadata = {
  metadataBase: new URL('https://makeithappen.ug'),
  alternates: {
    canonical: '/',
  },
  title: "Make It Happen | Software, Web Design & AI Automation Uganda",
  description: "Elite tech agency in Kampala. We engineer custom software, premium web design, AI integrations, business automation, and data-driven digital marketing.",
  keywords: [
    "Software development Uganda",
    "Web design Kampala",
    "AI integration agency",
    "Business automation",
    "Digital marketing Uganda",
    "Custom software solutions Kampala",
    "Make It Happen Uganda"
  ],
  openGraph: {
    title: "Make It Happen | Software, Web Design & AI Automation",
    description: "Transforming businesses in Uganda with custom software, premium web design, AI, automation, and digital marketing.",
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
    description: "Custom software, high-performance web design, AI automation, and digital marketing.",
    images: ["https://makeithappen.ug/og-image.png"],
  },
};

// Enables Next.js ISR: Checks Sanity for new content every 60 seconds automatically
export const revalidate = 60;

// 1. Establish connection to Sanity
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

type HomeProject = {
  _id: string;
  title: string;
  category: string | null;
  slug: string | null;
  projectUrl: string | null;
  imageUrl: string | null;
};

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18m-6-6 6 6-6 6" />
    </svg>
  );
}

/** Screenshot on top, name and category on a footer bar. Opens the live project when it has a URL. */
function ProjectCard({ project, size = "default" }: { project: HomeProject; size?: "default" | "large" }) {
  const external = Boolean(project.projectUrl);
  const href = project.projectUrl || "/projects";
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group block overflow-hidden rounded-xl border border-hairline bg-surface transition-colors hover:border-hairline-strong"
    >
      <div className={`relative w-full overflow-hidden bg-surface-raised ${size === "large" ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-white/40">{project.title}</div>
        )}
      </div>
      <div className={`flex items-center justify-between gap-6 border-t border-hairline ${size === "large" ? "px-8 py-7" : "px-6 py-5"}`}>
        <div className="min-w-0">
          <p className={`truncate font-semibold tracking-tight text-white ${size === "large" ? "text-2xl sm:text-3xl" : "text-xl"}`}>
            {project.title}
          </p>
          {project.category ? (
            <p className={`mt-1 truncate text-white/60 ${size === "large" ? "text-lg" : "text-sm"}`}>{project.category}</p>
          ) : null}
        </div>
        <ArrowIcon className={`shrink-0 text-accent-primary transition-transform duration-300 group-hover:translate-x-1 ${size === "large" ? "h-8 w-8" : "h-6 w-6"}`} />
      </div>
    </Link>
  );
}

export default async function Home() {
  // 2. Fetch Homepage Data — by the fixed ID the Studio edits (sanity/structure.ts).
  // Selecting by _type alone picked up an older, orphaned homepage document instead.
  const homepageQuery = `*[_id == "homepage"][0]{
    heroHeading, heroSubheading, "imageUrl": heroImage.asset->url,
    primaryCtaText, primaryCtaLink, secondaryCtaText, secondaryCtaLink,
    featuredProjectsKicker, featuredProjectsTitle, featuredProjectsDescription,
    stat1Label, stat1Value, stat2Label, stat2Value,
    stat3Label, stat3Value, stat4Label, stat4Value
  }`;
  const homepageData = await client.fetch(homepageQuery);

  // 3. Fetch up to 4 Projects 
  const projectsQuery = `*[_type == "project"] | order(_createdAt desc)[0...4]{
    _id, title, category, "slug": slug.current, projectUrl, "imageUrl": mainImage.asset->url
  }`;
  const projectsData = await client.fetch<HomeProject[]>(projectsQuery);

  // 4. Fetch Top 3 Latest Blogs
  const blogsQuery = `*[_type == "post"] | order(publishedAt desc)[0...3]{
    _id, title, "slug": slug.current, publishedAt, "imageUrl": mainImage.asset->url
  }`;
  const blogsData = await client.fetch(blogsQuery);

  const [featuredProject, ...otherProjects] = projectsData ?? [];

  const stats = [
    { label: homepageData?.stat1Label, value: homepageData?.stat1Value },
    { label: homepageData?.stat2Label, value: homepageData?.stat2Value },
    { label: homepageData?.stat3Label, value: homepageData?.stat3Value },
    { label: homepageData?.stat4Label, value: homepageData?.stat4Value },
  ].filter((stat): stat is { label: string; value: string } => Boolean(stat.label?.trim() && stat.value?.trim()));

  return (
    <div className="flex w-full flex-col">
      {/* 1. Hero — full-bleed photo, headline on the dark left edge, client strip at the foot */}
      <section className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-background">
        {homepageData?.imageUrl ? (
          <div aria-hidden className="absolute inset-0 -z-10 lg:left-[28%]">
            <img
              src={homepageData.imageUrl}
              alt=""
              className="h-full w-full object-cover object-center"
              fetchPriority="high"
              decoding="async"
            />
            {/* Fade the photo into the page on the left so the headline sits on near-black. */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/10 lg:from-background lg:from-5% lg:via-background/30 lg:via-40% lg:to-transparent" />
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/80 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-background to-transparent" />
          </div>
        ) : null}

        <div className="shell flex flex-1 items-center pt-32 pb-16 lg:pt-36">
          <div className="max-w-4xl">
            <p className="flex items-center gap-4 text-base font-medium text-white/80 sm:text-lg">
              <span aria-hidden className="h-0.5 w-8 bg-accent-primary" />
              <span>
                Software <span aria-hidden className="px-1.5 text-white/40">·</span> Web{" "}
                <span aria-hidden className="px-1.5 text-white/40">·</span> AI{" "}
                <span aria-hidden className="px-1.5 text-white/40">·</span> Marketing
              </span>
            </p>
            <h1 className="mt-8 max-w-3xl text-5xl font-bold leading-[0.98] tracking-[-0.035em] text-white sm:text-7xl lg:text-[6.75rem]">
              {homepageData?.heroHeading || "Let’s make it happen."}
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/75 sm:text-xl">
              {homepageData?.heroSubheading ||
                "Enterprise software, web design, AI automation and digital marketing for ambitious businesses across East Africa."}
            </p>

            <div className="mt-11 flex flex-wrap items-center gap-4">
              <Link
                href={homepageData?.primaryCtaLink || "/contact"}
                className="inline-flex items-center gap-2.5 rounded-md bg-accent-primary px-8 py-4 text-base font-semibold text-background transition-colors duration-200 hover:bg-accent-hover"
              >
                {homepageData?.primaryCtaText || "Start a project"}
                <svg aria-hidden className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 10h12m-5-5 5 5-5 5" />
                </svg>
              </Link>
              <Link
                href={homepageData?.secondaryCtaLink || "/projects"}
                className="inline-flex items-center rounded-md border border-white/40 px-8 py-4 text-base font-semibold text-white transition-colors hover:border-white hover:bg-white/5"
              >
                {homepageData?.secondaryCtaText || "View our work"}
              </Link>
            </div>
          </div>
        </div>

        {/* Client strip — the names come straight from the latest projects in Sanity. */}
        {projectsData.length > 0 ? (
          <div className="shell pb-10">
            <div className="border-t border-white/15 pt-8">
              <ul className="grid grid-cols-2 gap-y-4 sm:flex sm:items-center sm:justify-center">
                {projectsData.map((project, index) => (
                  <li
                    key={project._id}
                    className={`text-center text-lg font-medium tracking-tight text-white/60 sm:px-12 lg:px-20 sm:text-xl ${
                      index > 0 ? "sm:border-l sm:border-white/15" : ""
                    }`}
                  >
                    {project.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </section>

      {/* 2. Stats band — centred figures with short dividers. A stat left blank in Sanity is not shown. */}
      {stats.length > 0 ? (
        <section className="relative z-10 w-full border-b border-hairline bg-background py-14 sm:py-16">
          <dl
            className={`shell grid grid-cols-2 gap-y-12 ${stats.length >= 4 ? "lg:grid-cols-4" : stats.length === 3 ? "lg:grid-cols-3" : ""}`}
          >
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`flex flex-col-reverse items-center gap-3 py-2 text-center sm:py-4 ${
                  index % 2 === 1 ? "border-l border-hairline-strong" : ""
                } ${index > 0 ? "lg:border-l lg:border-hairline-strong" : ""}`}
              >
                <dt className="text-base font-light text-white/80 sm:text-xl lg:text-2xl">{stat.label}</dt>
                <dd className="text-5xl font-bold tracking-[-0.04em] text-white sm:text-7xl lg:text-[6.5rem] lg:leading-none">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {/* 3. Featured projects — intro on the left, the latest project as a large card on the right */}
      {featuredProject ? (
        <section className="relative z-10 w-full py-20 sm:py-28">
          <div className="shell grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="lg:col-span-5">
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-accent-primary">
                {homepageData?.featuredProjectsKicker?.trim() || "Featured projects"}
              </p>
              <h2 className="mt-6 text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
                {(homepageData?.featuredProjectsTitle || "Proven results across diverse industries.").replace(/\s*\n\s*/g, " ")}
              </h2>
              {homepageData?.featuredProjectsDescription ? (
                <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/65 sm:text-xl">
                  {homepageData.featuredProjectsDescription}
                </p>
              ) : null}
              <Link
                href="/projects"
                className="group mt-10 inline-flex items-center gap-3 border-b-2 border-accent-primary pb-2 text-xl font-medium text-accent-primary transition-colors hover:border-accent-hover hover:text-accent-hover"
              >
                See all projects
                <svg aria-hidden className="h-5 w-5 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h14m-5-5 5 5-5 5" />
                </svg>
              </Link>
            </div>

            <div className="lg:col-span-7">
              <ProjectCard project={featuredProject} size="large" />
            </div>
          </div>

          {/* The rest of the latest projects, in the same card style, until this part of the page is redesigned. */}
          {otherProjects.length > 0 ? (
            <div className="shell mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {otherProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {/* 4. Latest Insights (Top 3 Blogs) */}
      <section className="relative z-10 w-full bg-[#0B0F19] py-20 sm:py-24 border-t border-white/5">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-14">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-accent-primary">Journal</p>
              <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Latest Insights.</h2>
            </div>
            <Link
              href="/blog"
              className="group inline-flex flex-nowrap items-center gap-4 text-sm font-medium text-white transition-colors hover:text-accent-primary"
            >
              <span className="whitespace-nowrap">View all posts</span>
              <span aria-hidden className="block h-px w-12 shrink-0 bg-white/30 transition-all group-hover:w-16 group-hover:bg-accent-primary" />
              <span aria-hidden className="shrink-0 text-lg leading-none transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
          
          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            {blogsData.map((post: any) => (
              <Link
                key={post._id}
                href={post.slug ? `/blog/${post.slug}` : "#"}
                className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#121821] shadow-[0_0_0_1px_rgba(255,255,255,0.04)] transition-all hover:bg-[#1a242d]"
              >
                <div className="relative aspect-video w-full overflow-hidden border-b border-white/10 bg-[#0c1016]">
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-white/40">No image</div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-white/50">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent"}
                  </div>
                  <h3 className="mt-3 text-xl font-bold leading-snug tracking-tight text-white">{post.title}</h3>
                  <div className="mt-6 flex items-center gap-2 text-xs font-bold text-accent-primary">
                    <span>Read more</span>
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Global CTA Section */}
      <Cta />

    </div>
  );
}