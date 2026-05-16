import { createClient } from "next-sanity";
import Cta from "@/components/Cta"; // Imported the global CTA component

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

type AboutValue = {
  valueTitle: string | null;
  valueDescription: string | null;
};

type AboutContent = {
  heading: string | null;
  subheading: string | null;
  mainDescription: string | null;
  imageUrl: string | null;
  valuesList: AboutValue[] | null;
};

function BulletIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="10" cy="10" r="3" fill="currentColor" />
    </svg>
  );
}

export default async function AboutPage() {
  const query = `*[_type == "about" && _id == "about"][0]{
    heading,
    subheading,
    mainDescription,
    "imageUrl": featuredImage.asset->url,
    valuesList[]{ valueTitle, valueDescription }
  }`;

  const aboutDoc = await client.fetch<AboutContent | null>(query);

  const heading = aboutDoc?.heading ?? "About us";
  const subheading = aboutDoc?.subheading;
  const mainDescription = aboutDoc?.mainDescription;
  const imageUrl = aboutDoc?.imageUrl;
  const values = aboutDoc?.valuesList?.filter((v) => v?.valueTitle) ?? [];

  return (
    <div className="flex w-full flex-col items-center">
      {/* Adjusted padding to pt-32 pb-32 to match other pages */}
      <div className="w-full max-w-7xl px-6 sm:px-10 lg:px-14 pt-32 pb-32">
        
        {/* Hero — split layout */}
        <section className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="max-w-xl lg:max-w-none">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D7FF65]">
              About
            </p>
            {/* Synced headline typography */}
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-5xl">
              {heading}
            </h1>
            {subheading ? (
              <p className="mt-5 text-lg leading-relaxed text-white/75">
                {subheading}
              </p>
            ) : null}
            {mainDescription ? (
              <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-white/60 sm:text-lg">
                {mainDescription}
              </p>
            ) : (
              <p className="mt-6 text-base leading-relaxed text-white/50 sm:text-lg">
                Add your story in Sanity under{" "}
                <span className="text-white/70">About Us</span> to show the main
                description here.
              </p>
            )}
          </div>

          <div className="relative">
            <div
              className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0B0F19] shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
              aria-hidden={!imageUrl}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={heading}
                  className="aspect-[4/3] h-full w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center bg-[radial-gradient(ellipse_at_top_right,rgba(215,255,101,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.06),transparent_50%)] px-8 text-center text-sm text-white/45">
                  Upload a featured image in Sanity to display your team photo
                  here.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Core values */}
        <section className="mt-20 lg:mt-28">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Our core values
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/55">
            Principles we bring to every engagement—clear, measurable, and built
            to last.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {values.map((item, index) => (
              <article
                key={`${item.valueTitle}-${index}`}
                className="rounded-[1.75rem] border border-white/10 bg-[#0B0F19] p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] transition-colors hover:border-white/15"
              >
                <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#D7FF65]/15 text-[#D7FF65]">
                  <BulletIcon className="h-4 w-4" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white">
                  {item.valueTitle}
                </h3>
                {item.valueDescription ? (
                  <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-[15px]">
                    {item.valueDescription}
                  </p>
                ) : null}
              </article>
            ))}
          </div>

          {values.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-white/15 py-16 text-center text-white/50">
              No core values yet. Add entries under{" "}
              <span className="text-white/70">Core values</span> in the About Us
              document in Sanity.
            </div>
          ) : null}
        </section>
      </div>

      {/* Global CTA Section */}
      <Cta />
    </div>
  );
}