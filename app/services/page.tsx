import { createClient } from "next-sanity";
import Link from "next/link";
import Cta from "@/components/Cta";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

type ServiceCard = {
  _id: string;
  title: string | null;
  description: string | null;
  features: string[] | null;
  "imageUrl": string | null;
};

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M16.667 5L7.5 14.167 3.333 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function ServicesPage() {
  // Fetch Page Settings AND Services concurrently for better performance
  const [pageData, services] = await Promise.all([
    client.fetch(`*[_type == "servicesPage"][0]`),
    client.fetch<ServiceCard[]>(`*[_type == "service"] | order(_createdAt asc) {
      _id, title, description, features, "imageUrl": mainImage.asset->url
    }`)
  ]);

  return (
    <div className="flex w-full flex-col items-center">
      <div className="w-full max-w-7xl px-6 sm:px-10 lg:px-14 pt-32 pb-32">
        
        {/* Dynamic Header Section */}
        <div className="mb-14 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D7FF65]">
            {pageData?.kicker || "Services"}
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-5xl">
            {pageData?.heading || "Capabilities built for scale."}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-white/60">
            {pageData?.description || "End-to-end partnerships—from strategy and product design to engineering and launch—with the polish you expect from a senior studio."}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article key={service._id} className="group relative flex flex-col min-h-[450px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0B0F19] shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
              {service.imageUrl ? (
                <img src={service.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(215,255,101,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.06),transparent_50%)]" aria-hidden />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/90 to-[#0B0F19]/30" aria-hidden />
              
              <div className="relative z-10 flex flex-1 flex-col p-8 sm:p-10">
                <div className="flex-1 max-w-[min(100%,22rem)] text-left">
                  <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{service.title ?? "Untitled service"}</h2>
                  {service.description && <p className="mt-4 text-sm leading-relaxed text-white/75 sm:text-[15px]">{service.description}</p>}
                  {service.features && service.features.length > 0 && (
                    <ul className="mt-6 space-y-3">
                      {service.features.filter((f) => f && f.trim().length > 0).map((feature, index) => (
                        <li key={`${service._id}-feature-${index}`} className="flex items-start gap-3 text-left text-sm text-white/85 sm:text-[15px]">
                          <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D7FF65]/15 text-[#D7FF65]">
                            <CheckIcon className="h-3 w-3" />
                          </span>
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="mt-8 flex justify-start">
                  <Link href="/contact" className="inline-flex items-center justify-center rounded-full bg-[#D7FF65] px-7 py-3 text-sm font-semibold text-[#0B0F19] transition hover:bg-[#e8ff99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D7FF65]">
                    Get Started
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {services.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/15 py-20 text-center text-white/50">
            No services yet. Add documents of type &quot;service&quot; in Sanity Studio to populate this grid.
          </div>
        )}
      </div>
      <Cta />
    </div>
  );
}