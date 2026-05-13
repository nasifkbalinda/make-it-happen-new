import Link from "next/link";
import { createClient } from "next-sanity";

// 1. Establish connection to Sanity
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

export default async function Home() {
  // 2. Fetch Homepage Hero Data
  const homepageQuery = `*[_type == "homepage"][0]{
    heroHeading,
    heroSubheading,
    "imageUrl": heroImage.asset->url
  }`;
  const homepageData = await client.fetch(homepageQuery);

  // 3. Fetch up to 4 Projects for the featured section
  const projectsQuery = `*[_type == "project"][0...4]{
    _id,
    title,
    category,
    "imageUrl": mainImage.asset->url
  }`;
  const projectsData = await client.fetch(projectsQuery);

  return (
    <div className="flex w-full flex-col">
      {/* 1. Minimalist Hero — Pure dark, no ambient glow */}
      <main className="relative flex min-h-[85vh] w-full items-center overflow-hidden pt-32 pb-32">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-14">
          <section className="max-w-4xl">
            
            {/* Removed the Workflow Orchestration Kicker */}

            <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[4.5rem] xl:text-[5rem] text-balance">
              {homepageData?.heroHeading || "Ship enterprise software faster."}
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl">
              {homepageData?.heroSubheading ||
                "Integrate the tools you rely on. We build digital experiences that transform ideas into reality."}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-[#D7FF65] px-8 py-3.5 text-sm font-bold text-[#111720] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#e8ff99]"
              >
                Get Started
                <span aria-hidden className="text-base leading-none">
                  →
                </span>
              </button>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                Learn more
              </Link>
            </div>

            <p className="mt-8 text-sm text-white/40">Typical response: 1 business day.</p>
          </section>
        </div>
      </main>

      {/* 2. Glassmorphism Stats Bar */}
      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 sm:px-10 lg:px-14">
        <div className="flex w-full flex-col gap-10 rounded-3xl border border-white/10 bg-white/5 px-8 py-7 backdrop-blur-lg md:flex-row md:items-center md:justify-between md:px-10 md:py-8">
          <div className="grid flex-1 grid-cols-1 gap-8 sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/45">Projects</p>
              <p className="mt-2 text-5xl font-extrabold tracking-tight text-white">27k+</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/45">Deployments</p>
              <p className="mt-2 text-5xl font-extrabold tracking-tight text-white">25k+</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/45">User Adoption</p>
              <p className="mt-2 text-5xl font-extrabold tracking-tight text-white">12k+</p>
            </div>
          </div>

          <div className="md:pl-8">
            <p className="text-xs uppercase tracking-[0.15em] text-white/55">
              PROJECT SUCCESS <span className="font-bold text-white">98%</span>
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
                className={`group relative aspect-square overflow-hidden rounded-[2rem] border border-white/5 bg-[#121821] shadow-inner transition-shadow hover:shadow-lg ${index % 2 !== 0 ? "translate-y-8" : ""}`}
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
              className="mt-10 inline-flex items-center gap-4 text-sm font-medium text-white transition-colors hover:text-[#D7FF65]"
            >
              <span>See all</span>
              <span aria-hidden className="block h-px w-12 bg-white/30" />
              <span aria-hidden className="text-lg leading-none">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}