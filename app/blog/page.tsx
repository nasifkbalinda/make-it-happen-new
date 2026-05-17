import { createClient } from "next-sanity";
import Link from "next/link";
import Cta from "@/components/Cta"; // Imported the global CTA component

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

type BlogPost = {
  _id: string;
  title: string | null;
  slug: { current?: string } | null;
  author: string | null;
  publishedAt: string | null;
  excerpt: string | null;
  "imageUrl": string | null;
};

export default async function BlogPage() {
  // Fetch Page Settings AND Blog Posts concurrently for maximum speed
  const [pageData, posts] = await Promise.all([
    client.fetch(`*[_type == "blogPage"][0]`),
    client.fetch<BlogPost[]>(`*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      author,
      publishedAt,
      excerpt,
      "imageUrl": mainImage.asset->url
    }`)
  ]);

  return (
    // The transparent wrapper lets globals.css dark background show through
    <div className="flex min-h-screen w-full flex-col items-center">
      {/* Matched the pt-32 pb-32 padding from the Services/Projects pages */}
      <div className="w-full max-w-7xl px-6 sm:px-10 lg:px-14 pt-32 pb-32">
        
        {/* Dynamic Header Section */}
        <div className="relative mb-16 max-w-3xl">
          {/* Subtle neon glow behind the text */}
          <div
            className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#D7FF65]/5 blur-3xl"
            aria-hidden
          />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D7FF65]">
            {pageData?.kicker || "Journal"}
          </p>
          {/* Matched typography scale: text-4xl sm:text-5xl lg:text-5xl */}
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-5xl">
            {pageData?.heading || "Insights & ideas."}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/60">
            {pageData?.description || "Notes on product, engineering, and how we ship ambitious work in the real world—no fluff, just signal."}
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const card = (
              // Dark mode card styling matching the Services page
              <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0B0F19] shadow-[0_0_0_1px_rgba(255,255,255,0.04)] transition-all hover:bg-[#121821]">
                <div className="relative aspect-video w-full overflow-hidden border-b border-white/10 bg-[#121821]">
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.title ?? "Blog post cover"}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-white/5 text-sm text-white/40">
                      Add a main image in Sanity
                    </div>
                  )}
                </div>

                <div className="relative flex flex-1 flex-col p-6 sm:p-7">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-widest text-white/50">
                    {post.publishedAt && (
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    )}
                    {post.author && (
                      <>
                        <span className="text-white/30" aria-hidden>
                          ·
                        </span>
                        <span>{post.author}</span>
                      </>
                    )}
                  </div>

                  <h2 className="mt-4 text-xl font-bold leading-snug tracking-tight text-white">
                    {post.title ?? "Untitled"}
                  </h2>

                  {post.excerpt && (
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/70">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="mt-6 flex items-center gap-2 text-xs font-bold text-[#D7FF65]">
                    <span>Read more</span>
                    <span
                      className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden
                    >
                      →
                    </span>
                  </div>
                </div>
              </article>
            );

            // Focus states updated to neon
            const wrapClass =
              "group block overflow-hidden rounded-[1.75rem] outline-none transition-all focus-visible:ring-2 focus-visible:ring-[#D7FF65] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c1016]";

            return post.slug?.current ? (
              <Link key={post._id} href={"/blog/" + post.slug.current} className={wrapClass}>
                {card}
              </Link>
            ) : (
              <div key={post._id} className={`${wrapClass} cursor-default`}>
                {card}
              </div>
            );
          })}
        </div>

        {/* Empty State updated to dark theme */}
        {posts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/15 py-20 text-center text-white/50">
            No posts yet. Publish your first story in the Sanity studio.
          </div>
        )}
      </div>

      {/* Global CTA Section Added at the bottom */}
      <Cta />
      
    </div>
  );
}