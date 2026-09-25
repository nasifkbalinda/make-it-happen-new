import { PortableText } from "@portabletext/react";
import type { TypedObject } from "@portabletext/types";
import imageUrlBuilder, { type SanityImageSource } from "@sanity/image-url";
import { createClient } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next"; // 1. Added this import for Next.js SEO

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

const SITE_URL = "https://makeithappen.ug";
const FALLBACK_OG_IMAGE = `${SITE_URL}/og-image.png`;

/**
 * Social crawlers reject oversized preview images — WhatsApp in particular
 * silently falls back to the site icon rather than showing anything. Our
 * uploads are full-resolution PNGs (several megabytes each), so never hand the
 * raw asset URL to og:image. Ask the Sanity CDN for a 1200x630 JPEG instead,
 * which is the standard OG size and lands in the low hundreds of kilobytes.
 *
 * JPEG is requested explicitly rather than via auto=format: crawlers do not
 * reliably send an Accept header advertising WebP, and a WebP preview is not
 * universally supported by them either.
 */
function ogImageUrl(source: SanityImageSource | null | undefined) {
  if (!projectId || !source) return null;
  return imageUrlBuilder({ projectId, dataset: "production" })
    .image(source)
    .width(1200)
    .height(630)
    .fit("crop")
    .format("jpg")
    .quality(80)
    .url();
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

// 2. THE NEW INVISIBLE LAYER: This generates the custom WhatsApp/Twitter preview
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  // NEW: We updated the query to explicitly ask Sanity for the 'excerpt' field!
  const query = `*[_type == "post" && slug.current == $slug][0]{
    title,
    excerpt,
    mainImage
  }`;

  // NEW: We updated the TypeScript definition so it knows to expect an optional excerpt
  const post = await client.fetch<{
    title: string;
    excerpt?: string;
    mainImage?: SanityImageSource;
  } | null>(query, { slug });

  if (!post) {
    return { title: "Post Not Found" };
  }

  // NEW: THE LOGIC SWITCH
  // If the post has a custom excerpt in Sanity, use it. 
  // If the excerpt is blank, fall back to our generic sentence.
  const customDescription = post.excerpt || `Read the latest insights on ${post.title} from the Make It Happen tech team in Kampala.`;

  // An empty images array leaves crawlers to guess, and they pick the favicon.
  // Always give them something correctly sized.
  const previewImage = ogImageUrl(post.mainImage) ?? FALLBACK_OG_IMAGE;

  return {
    metadataBase: new URL(SITE_URL),
    title: `${post.title} | Make It Happen Journal`,
    description: customDescription,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: customDescription,
      url: `${SITE_URL}/blog/${slug}`,
      siteName: "Make It Happen",
      images: [
        {
          url: previewImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: "en_UG",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: customDescription,
      images: [previewImage],
    },
  };
}

// 3. YOUR FLAWLESS VISUAL LAYER: Unchanged!
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
    <div className="flex w-full flex-col items-center">
      <article className="min-h-screen w-full max-w-3xl px-6 pb-32 pt-24 sm:px-10 lg:px-8">
        
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-accent-primary transition hover:text-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
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

        <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-white/80 prose-a:text-accent-primary prose-strong:text-white mt-10">
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