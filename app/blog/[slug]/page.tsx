import { PortableText } from "@portabletext/react";
import type { TypedObject } from "@portabletext/types";
import imageUrlBuilder, { type SanityImageSource } from "@sanity/image-url";
import { createClient } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Cta from "@/components/Cta";
import { PostCard, PostMeta, postCardProjection, type PostCardData } from "@/components/cards";
import { Reveal } from "@/components/motion";

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
  excerpt: string | null;
  characters: number | null;
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

type MorePosts = PostCardData[];

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  const query = `{
    "post": *[_type == "post" && slug.current == $slug][0]{
      title,
      excerpt,
      "imageUrl": mainImage.asset->url,
      author,
      publishedAt,
      body,
      "characters": length(pt::text(body))
    },
    "more": *[_type == "post" && defined(slug.current) && slug.current != $slug] | order(publishedAt desc)[0...3]{ ${postCardProjection} },
    "moreHeading": *[_id == "blogPage"][0].moreHeading
  }`;

  const data = await client.fetch<{ post: BlogPostDetail | null; more: MorePosts | null; moreHeading: string | null }>(query, { slug });
  const post = data?.post;

  if (!post) {
    notFound();
  }

  const shareUrl = encodeURIComponent(`${SITE_URL}/blog/${slug}`);
  const shareText = encodeURIComponent(post.title ?? "");
  const more = data?.more ?? [];

  return (
    <div className="bg-paper text-ink">
      {/* Article header — dark card, like every page opening */}
      <section className="p-2 sm:p-3">
        <div className="relative isolate overflow-hidden rounded-[20px] bg-ink text-white">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-[0.08] [background-image:radial-gradient(circle,white_1px,transparent_1.6px)] [background-size:28px_28px]"
          />
          <div className="mx-auto max-w-4xl px-5 pb-12 pt-32 sm:px-8 lg:pb-16 lg:pt-40">
            <div className="animate-[rise_1.1s_cubic-bezier(0.16,1,0.3,1)_both]">
              <Link href="/blog" className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-white/60 hover:text-white">
                <span aria-hidden className="transition-transform group-hover:-translate-x-1">&larr;</span> Journal
              </Link>
              <h1 className="mt-6 text-[2.3rem] font-semibold leading-[1.04] tracking-[-0.04em] sm:text-5xl lg:text-[3.25rem]">
                {post.title ?? "Untitled"}
              </h1>
              {post.excerpt ? <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">{post.excerpt}</p> : null}
              <PostMeta
                post={{ _id: slug, title: post.title, slug, excerpt: null, author: post.author, publishedAt: post.publishedAt, imageUrl: null, characters: post.characters }}
                className="mt-8 text-white/60"
              />
            </div>
          </div>
        </div>
      </section>

      {post.imageUrl ? (
        <div className="mx-auto mt-6 max-w-5xl px-4 sm:mt-10 sm:px-8">
          <img
            src={`${post.imageUrl}?w=1800&auto=format`}
            alt={post.title ? `${post.title} cover` : "Article cover"}
            className="aspect-[16/9] w-full rounded-2xl object-cover"
            fetchPriority="high"
          />
        </div>
      ) : null}

      <article className="mx-auto max-w-2xl px-5 pb-20 pt-12 sm:px-8 sm:pt-16">
        <div className="prose prose-lg max-w-none prose-neutral prose-headings:font-semibold prose-headings:tracking-[-0.03em] prose-headings:text-ink prose-p:leading-relaxed prose-p:text-ink/80 prose-a:text-ink prose-a:decoration-accent-primary prose-a:decoration-2 prose-a:underline-offset-4 prose-strong:text-ink prose-blockquote:border-l-accent-primary prose-blockquote:font-medium prose-blockquote:not-italic prose-blockquote:text-ink prose-li:text-ink/80">
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
                    <figure className="not-prose my-10">
                      <img src={src} alt={alt} className="w-full rounded-2xl object-cover" loading="lazy" />
                    </figure>
                  );
                },
              },
            }}
          />
        </div>

        {/* Share */}
        <div className="mt-14 flex flex-wrap items-center gap-3 border-t border-ink/10 pt-8">
          <span className="mr-2 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">Share</span>
          {[
            { label: "WhatsApp", href: `https://wa.me/?text=${shareText}%20${shareUrl}` },
            { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}` },
            { label: "X", href: `https://x.com/intent/post?url=${shareUrl}&text=${shareText}` },
            { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}` },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[10px] bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-accent-primary"
            >
              {item.label}
            </a>
          ))}
        </div>
      </article>

      {more.length ? (
        <section className="shell border-t border-ink/10 py-20 sm:py-24">
          <h2 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">{data?.moreHeading?.trim() || "Keep reading."}</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {more.map((item, index) => (
              <Reveal key={item._id} delay={index * 120}>
                <PostCard post={item} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      <Cta />
    </div>
  );
}
