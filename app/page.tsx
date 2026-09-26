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

export default async function Home() {
  // 2. Fetch Homepage Data
  const homepageQuery = `*[_type == "homepage"][0]{
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
  const projectsData = await client.fetch(projectsQuery);

  // 4. Fetch Top 3 Latest Blogs
  const blogsQuery = `*[_type == "post"] | order(publishedAt desc)[0...3]{
    _id, title, "slug": slug.current, publishedAt, "imageUrl": mainImage.asset->url
  }`;
  const blogsData = await client.fetch(blogsQuery);

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
                {projectsData.map((project: { _id: string; title: string }, index: number) => (
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

      {/* 2. Glassmorphism Dynamic Stats Bar */}
      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 sm:px-10 lg:px-14">
        <div className="flex w-full flex-col gap-10 rounded-3xl border border-white/10 bg-white/5 px-8 py-7 backdrop-blur-lg md:flex-row md:items-center md:justify-between md:px-10 md:py-8">
          <div className="grid flex-1 grid-cols-1 gap-8 sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/45">
                {homepageData?.stat1Label || "Projects Delivered"}
              </p>
              <p className="mt-2 text-5xl font-extrabold tracking-tight text-white">
                {homepageData?.stat1Value || "150+"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/45">
                {homepageData?.stat2Label || "Global Partners"}
              </p>
              <p className="mt-2 text-5xl font-extrabold tracking-tight text-white">
                {homepageData?.stat2Value || "40+"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/45">
                {homepageData?.stat3Label || "Team Experts"}
              </p>
              <p className="mt-2 text-5xl font-extrabold tracking-tight text-white">
                {homepageData?.stat3Value || "25+"}
              </p>
            </div>
          </div>
          <div className="md:pl-8">
            <p className="text-xs uppercase tracking-[0.15em] text-white/55">
              {homepageData?.stat4Label || "CLIENT RETENTION"}{" "}
              <span className="font-bold text-white">{homepageData?.stat4Value || "98%"}</span>
            </p>
            <div className="mt-4 flex items-center">
              <div className="-mr-3 h-10 w-10 rounded-full border-2 border-[#121821] bg-slate-300" />
              <div className="-mr-3 h-10 w-10 rounded-full border-2 border-[#121821] bg-slate-400" />
              <div className="-mr-3 h-10 w-10 rounded-full border-2 border-[#121821] bg-accent-secondary" />
              <div className="-mr-3 h-10 w-10 rounded-full border-2 border-[#121821] bg-accent-hover" />
              <div className="h-10 w-10 rounded-full border-2 border-[#121821] bg-accent-primary" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Case Studies */}
      <section className="relative z-10 w-full py-20 sm:py-24">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 sm:px-10 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-14">
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {projectsData.map((project: any, index: number) => (
              <div
                key={project._id}
                className={`group relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/5 bg-[#121821] shadow-inner transition-shadow hover:shadow-lg ${index % 2 !== 0 ? "translate-y-8" : ""}`}
              >
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/5 text-sm text-white/40">No image</div>
                )}
                <div className="absolute right-4 top-4 z-20 -translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {project.projectUrl ? (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-primary text-[#0c1016] shadow-lg transition-colors hover:bg-white"
                      title="Visit Project"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : project.slug ? (
                    <Link
                      href={`/projects/${project.slug}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-primary text-[#0c1016] shadow-lg transition-colors hover:bg-white"
                      title="Read Case Study"
                    >
                      <span aria-hidden className="text-xl leading-none">→</span>
                    </Link>
                  ) : null}
                </div>
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#0c1016]/95 via-[#0c1016]/50 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-accent-primary">{project.category || "Project"}</p>
                  <p className="mt-1 text-lg font-bold text-white">{project.title}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-lg lg:pl-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent-primary">
              {homepageData?.featuredProjectsKicker || "Featured Case Studies"}
            </p>
            <h2 className="mt-4 whitespace-pre-line text-4xl font-bold leading-tight text-white sm:text-5xl">
              {homepageData?.featuredProjectsTitle || "Proven Results\nAcross Diverse\nVerticals."}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-white/60">
              {homepageData?.featuredProjectsDescription || "Explore our impactful solutions across diverse client verticals, from fintech to e-commerce, delivering real value and innovation."}
            </p>
            
            <Link
              href="/projects"
              className="group mt-10 inline-flex flex-nowrap items-center gap-4 text-sm font-medium text-white transition-colors hover:text-accent-primary"
            >
              <span className="whitespace-nowrap">See all</span>
              <span aria-hidden className="block h-px w-12 shrink-0 bg-white/30 transition-all group-hover:w-16 group-hover:bg-accent-primary" />
              <span aria-hidden className="shrink-0 text-lg leading-none transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>

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