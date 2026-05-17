import { PortableText } from "@portabletext/react";
import type { TypedObject } from "@portabletext/types";
import imageUrlBuilder, { type SanityImageSource } from "@sanity/image-url";
import { createClient } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";
export const runtime = "edge";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

function urlForImage(source: SanityImageSource) {
  if (!projectId) return null;
  return imageUrlBuilder({ projectId, dataset: "production" }).image(source).url();
}

type BlogPostDetail = {
  title: string | null;
  "imageUrl": string | null;
  author: string | null;
  publishedAt: string | null;
  body: TypedObject[] | null;
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  const query = `*[_type == "post" && slug.current == $slug][0]{
    title,
    "imageUrl": mainImage.asset->url,
    author,
    publishedAt,
    body
  }`;

  const post = await client.fetch<BlogPostDetail | null>(query, { slug });

  if (!post) {
    notFound();
  }

  const formattedDate =
    post.publishedAt != null
      ? new Date(post.publishedAt).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null;

  return (
    // Transparent wrapper so global dark mode shows through
    <div className="flex w-full flex-col items-center">
      <article className="min-h-screen w-full max-w-3xl px-6 pb-32 pt-24 sm:px-10 lg:px-8">
        
        {/* Neon Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#D7FF65] transition hover:text-[#e8ff99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D7FF65]"
        >
          <span aria-hidden>←</span>
          Back to all posts
        </Link>

        <header className="mt-10">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/50">
            {formattedDate && <time dateTime={post.publishedAt ?? undefined}>{formattedDate}</time>}
            {formattedDate && post.author && (
              <span className="text-white/30" aria-hidden>
                ·
              </span>
            )}
            {post.author && <span>{post.author}</span>}
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            {post.title ?? "Untitled"}
          </h1>
        </header>

        {/* Premium Dark Image Container */}
        <div className="relative mt-10 aspect-video w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#121821]">
          {post.imageUrl ? (
            <img
              src={post.imageUrl}
              alt={post.title ? `${post.title} cover` : "Article cover"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-white/5 text-sm text-white/40">
              No main image
            </div>
          )}
        </div>

        {/* Prose (Rich Text) configured for dark mode (prose-invert) and neon links */}
        <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-white/80 prose-a:text-[#D7FF65] prose-strong:text-white mt-10">
          <PortableText
            value={post.body ?? []}
            components={{
              types: {
                image: ({ value }) => {
                  const src = urlForImage(value as SanityImageSource);
                  if (!src) return null;
                  const alt =
                    typeof (value as { alt?: string }).alt === "string"
                      ? (value as { alt: string }).alt
                      : "";
                  return (
                    <figure className="my-8 not-prose">
                      <img
                        src={src}
                        alt={alt}
                        className="w-full rounded-2xl border border-white/10 object-cover"
                      />
                    </figure>
                  );
                },
              },
            }}
          />
        </div>
      </article>
    </div>
  );
}