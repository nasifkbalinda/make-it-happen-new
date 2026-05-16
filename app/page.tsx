import Link from "next/link";
import { createClient } from "next-sanity";
import Cta from "@/components/Cta";

// 1. Establish connection to Sanity
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

export default async function Home() {
  // 2. Fetch Homepage Hero & Stats Data
  const homepageQuery = `*[_type == "homepage"][0]{
    heroHeading,
    heroSubheading,
    "imageUrl": heroImage.asset->url,
    stat1Label, stat1Value,
    stat2Label, stat2Value,
    stat3Label, stat3Value,
    stat4Label, stat4Value
  }`;
  const homepageData = await client.fetch(homepageQuery);

  // 3. Fetch up to 4 Projects (Added slug and projectUrl for the links)
  const projectsQuery = `*[_type == "project"] | order(_createdAt desc)[0...4]{
    _id,
    title,
    category,
    "slug": slug.current,
    projectUrl,
    "imageUrl": mainImage.asset->url
  }`;
  const projectsData = await client.fetch(projectsQuery);

  // 4. Fetch Top 3 Latest Blogs
  const blogsQuery = `*[_type == "post"] | order(publishedAt desc)[0...3]{
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    "imageUrl": mainImage.asset->url
  }`;
  const blogsData = await client.fetch(blogsQuery);

  return (
    <div className="flex w-full flex-col">
      {/* 1. Balanced Hero */}
      <main className="relative z-20 flex min-h-[85vh] w-full items-center overflow-hidden pt-32 pb-32 bg-[#0c1016]">
        {homepageData?.imageUrl ? (
          <div className="absolute inset-y-0 right-0 w-full lg:w-[65%] z-0">
            <img
              src={homepageData.imageUrl}
              alt="Hero visual for Make It Happen"
              className="h-full w-full object-cover object-left"
              fetchPriority="high"
              decoding="async"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-r from-[#0c1016] from-30% via-[#0c1016]/80 via-70% to-[#0c1016]/40 lg:from-0% lg:via-[#0c1016]/60 lg:via-40% lg:to-transparent"
            />
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0c1016] to-transparent"
            />
          </div>
        ) : null}

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-14">
          <section className="max-w-4xl">
            {/* Reduced heading size for a more premium, balanced look */}
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-5xl xl:text-[3.25rem] text-balance">
              {homepageData?.heroHeading || "Ship enterprise software faster."}
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl">
              {homepageData?.heroSubheading ||
                "Integrate the tools you rely on. We build digital experiences that transform ideas into reality."}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              {/* Tightened padding (px-7 py-3) to match the new typography scale */}
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-[#D7FF65] px-7 py-3 text-sm font-bold text-[#111720] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#e8ff99]"
              >
                Get Started
                <span aria-hidden className="text-base leading-none">
                  →
                </span>
              </button>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                Learn more
              </Link>
            </div>
            <p className="mt-8 text-sm text-white/40">Typical response: just a moment.</p>
          </section>
        </div>
      </main>

      {/* 2. Glassmorphism Dynamic Stats Bar */}
      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 sm:px-10 lg:px-14">
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
              <div className="-mr-3 h-10 w-10 rounded-full border-2 border-[#121821] bg-[#c6f04f]" />
              <div className="-mr-3 h-10 w-10 rounded-full border-2 border-[#121821] bg-[#a9d96d]" />
              <div className="h-10 w-10 rounded-full border-2 border-[#121821] bg-[#D7FF65]" />
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
                  <div className="flex h-full w-full items-center justify-center bg-white/5 text-sm text-white/40">
                    No image
                  </div>
                )}

                {/* Visit Project Button Overlay */}
                <div className="absolute right-4 top-4 z-20 -translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {project.projectUrl ? (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D7FF65] text-[#0c1016] shadow-lg transition-colors hover:bg-white"
                      title="Visit Project"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : project.slug ? (
                    <Link
                      href={`/projects/${project.slug}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D7FF65] text-[#0c1016] shadow-lg transition-colors hover:bg-white"
                      title="Read Case Study"
                    >
                      <span aria-hidden className="text-xl leading-none">→</span>
                    </Link>
                  ) : null}
                </div>

                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#0c1016]/95 via-[#0c1016]/50 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#D7FF65]">
                    {project.category || "Project"}
                  </p>
                  <p className="mt-1 text-lg font-bold text-white">{project.title}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-lg lg:pl-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#D7FF65]">
              Featured Case Studies
            </p>
            <h2 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl">
              Proven Results
              <br />
              Across Diverse
              <br />
              Verticals.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-white/60">
              Explore our impactful solutions across diverse client verticals, from fintech to
              e-commerce, delivering real value and innovation.
            </p>
            
            <Link
              href="/projects"
              className="group mt-10 inline-flex items-center gap-4 whitespace-nowrap text-sm font-medium text-white transition-colors hover:text-[#D7FF65]"
            >
              <span>See all</span>
              <span aria-hidden className="block h-px w-12 bg-white/30 transition-all group-hover:w-16 group-hover:bg-[#D7FF65]" />
              <span aria-hidden className="text-lg leading-none transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Latest Insights (Top 3 Blogs) */}
      <section className="relative z-10 w-full bg-[#0B0F19] py-20 sm:py-24 border-t border-white/5">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-14">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#D7FF65]">Journal</p>
              <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Latest Insights.</h2>
            </div>
            <Link
              href="/blog"
              className="group inline-flex items-center gap-4 whitespace-nowrap text-sm font-medium text-white transition-colors hover:text-[#D7FF65]"
            >
              <span>View all posts</span>
              <span aria-hidden className="block h-px w-12 bg-white/30 transition-all group-hover:w-16 group-hover:bg-[#D7FF65]" />
              <span aria-hidden className="text-lg leading-none transition-transform group-hover:translate-x-1">
                →
              </span>
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
                    <div className="flex h-full w-full items-center justify-center text-sm text-white/40">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-white/50">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent"}
                  </div>
                  <h3 className="mt-3 text-xl font-bold leading-snug tracking-tight text-white">
                    {post.title}
                  </h3>
                  <div className="mt-6 flex items-center gap-2 text-xs font-bold text-[#D7FF65]">
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