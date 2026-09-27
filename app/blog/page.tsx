import type { Metadata } from "next";
import { createClient } from "next-sanity";
import Cta from "@/components/Cta";
import PageHero from "@/components/PageHero";
import { FeaturedPostCard, PostCard, postCardProjection, type PostCardData } from "@/components/cards";
import { Reveal } from "@/components/motion";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Journal | Make It Happen",
  description: "Notes on product, engineering, marketing and building digital businesses in Uganda.",
};

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

type BlogPageData = {
  page: { kicker: string | null; heading: string | null; description: string | null; featuredLabel: string | null } | null;
  posts: PostCardData[] | null;
};

export default async function BlogPage() {
  // Fixed ID: the Studio edits this singleton (sanity/structure.ts).
  const data = await client.fetch<BlogPageData>(`{
    "page": *[_id == "blogPage"][0]{ kicker, heading, description, featuredLabel },
    "posts": *[_type == "post" && defined(slug.current)] | order(publishedAt desc){ ${postCardProjection} }
  }`);
  const posts = data?.posts ?? [];
  const [featured, ...rest] = posts;

  return (
    <div className="bg-paper text-ink">
      <PageHero
        kicker={data?.page?.kicker?.trim() || "Journal"}
        title={data?.page?.heading?.trim() || "Insights & ideas."}
        description={data?.page?.description}
        aside={posts.length ? `${String(posts.length).padStart(2, "0")} articles` : null}
      />

      <section className="shell py-16 sm:py-24">
        {featured ? (
          <Reveal>
            <FeaturedPostCard post={featured} label={data?.page?.featuredLabel?.trim() || "Latest"} />
          </Reveal>
        ) : (
          <p className="rounded-2xl border border-dashed border-ink/20 py-20 text-center text-muted">
            No posts yet. Publish your first story in the Studio.
          </p>
        )}

        {rest.length ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, index) => (
              <Reveal key={post._id} delay={(index % 3) * 120}>
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>
        ) : null}
      </section>

      <Cta />
    </div>
  );
}
