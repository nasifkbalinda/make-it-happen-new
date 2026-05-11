import Image from "next/image";
import Link from "next/link";
import { createClient } from "next-sanity";

// 1. Establish the connection to your Sanity Cloud
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false, // 'false' ensures you see updates instantly
});

export default async function Home() {
  // 2. Fetch the data! (GROQ Query language)
  const query = `*[_type == "homepage"][0]{
    heroHeading,
    heroSubheading,
    "imageUrl": heroImage.asset->url
  }`;
  
  const data = await client.fetch(query);

  return (
    <div className="flex w-full flex-col">
      
      {/* 1. Hero Section */}
      <main className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 px-6 pb-16 pt-16 sm:px-10 md:pt-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-14 lg:pt-24">
        
        {/* Hero Left (Text) */}
        <section className="max-w-2xl">
          {/* INJECTING DYNAMIC HEADING */}
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl lg:text-6xl">
            {data?.heroHeading || "Lets Make It Happen"}
          </h1>

          {/* INJECTING DYNAMIC SUBHEADING */}
          <p className="mt-7 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
            {data?.heroSubheading || "We build digital experiences that transform ideas into reality."}
          </p>

          <div className="mt-10 flex items-center gap-8">
            <button
              type="button"
              className="rounded-full bg-gradient-to-r from-[#D7FF65] to-[#C6F04F] px-8 py-3 text-sm font-bold text-[#111720] transition-transform duration-200 hover:-translate-y-0.5"
            >
              Get Started
            </button>

            <Link
              href="/about"
              className="inline-flex items-center gap-3 text-sm font-medium text-white/90 transition-colors hover:text-white"
            >
              <span>Learn More</span>
              <span aria-hidden className="block h-px w-16 bg-white/70" />
              <span aria-hidden className="text-lg leading-none">→</span>
            </Link>
          </div>
        </section>

        {/* Hero Right (Image) */}
        <section className="relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[560px]">
            {/* INJECTING DYNAMIC IMAGE */}
            <Image
              src={data?.imageUrl || "/hero-image.png"}
              alt="Hero visual for Make It Happen"
              width={900}
              height={1050}
              priority
              className="h-auto w-full object-cover"
            />

            <div className="absolute right-6 top-6 h-24 w-24 animate-[spin_16s_linear_infinite] rounded-full border border-white/35 bg-black/20 backdrop-blur-sm">
              <svg viewBox="0 0 120 120" className="h-full w-full fill-white/85 text-[10px] font-semibold tracking-[0.18em]" aria-hidden>
                <defs><path id="badge-circle" d="M60,60 m-43,0 a43,43 0 1,1 86,0 a43,43 0 1,1 -86,0" /></defs>
                <text><textPath href="#badge-circle">MAKE IT HAPPEN • MAKE IT HAPPEN •</textPath></text>
              </svg>
              <span className="absolute inset-0 m-auto h-2.5 w-2.5 rounded-full bg-[#D7FF65]" />
            </div>
          </div>
        </section>
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
              <div className="-mr-3 h-10 w-10 rounded-full border-2 border-black/50 bg-pink-500" />
              <div className="-mr-3 h-10 w-10 rounded-full border-2 border-black/50 bg-yellow-400" />
              <div className="-mr-3 h-10 w-10 rounded-full border-2 border-black/50 bg-sky-400" />
              <div className="-mr-3 h-10 w-10 rounded-full border-2 border-black/50 bg-lime-400" />
              <div className="h-10 w-10 rounded-full border-2 border-black/50 bg-violet-500" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Case Studies */}
      <section className="relative z-10 mx-auto grid w-full max-w-7xl gap-16 px-6 pb-32 sm:px-10 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-14">
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          <div className="aspect-square rounded-[2rem] border border-white/5 bg-[#2A3419]/80 shadow-inner"></div>
          <div className="aspect-square translate-y-8 rounded-[2rem] border border-white/5 bg-[#1B2C2D]/80 shadow-inner"></div>
          <div className="aspect-square rounded-[2rem] border border-white/5 bg-[#3B221B]/80 shadow-inner"></div>
          <div className="aspect-square translate-y-8 rounded-[2rem] border border-white/5 bg-[#2E1A1E]/80 shadow-inner"></div>
        </div>

        <div className="max-w-lg lg:pl-6">
          <p className="text-sm font-semibold tracking-widest text-[#C6F04F] uppercase">Featured Case Studies</p>
          <h2 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl">Proven Results<br />Across Diverse<br />Verticals.</h2>
          <p className="mt-6 text-base leading-relaxed text-white/60">
            Explore our impactful solutions across diverse client verticals, from fintech to e-commerce, delivering real value and innovation.
          </p>
          <Link
            href="/projects"
            className="mt-10 inline-flex items-center gap-4 text-sm font-medium text-white transition-colors hover:text-[#C6F04F]"
          >
            <span>See all</span>
            <span aria-hidden className="block h-px w-12 bg-white/70" />
            <span aria-hidden className="text-lg leading-none">→</span>
          </Link>
        </div>
      </section>

    </div>
  );
}