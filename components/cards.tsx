import Link from "next/link";

/* ------------------------------------------------------------------ */
/* Projects                                                             */
/* ------------------------------------------------------------------ */

export type ProjectCardData = {
  _id: string;
  title: string;
  category: string | null;
  description?: string | null;
  projectUrl: string | null;
  imageUrl: string | null;
  imageWidth: number | null;
  brandColor: string | null;
};

/** GROQ projection for ProjectCardData — keep every project query in step with it. */
export const projectCardProjection = `_id, title, category, description, projectUrl,
  "imageUrl": mainImage.asset->url,
  "imageWidth": mainImage.asset->metadata.dimensions.width,
  "brandColor": mainImage.asset->metadata.palette.dominant.background`;

/** Site logos and favicons are small; screenshots and photos are not. Logos get a brand-colour panel. */
function isLogo(width: number | null) {
  return !width || width < 900;
}

export function ProjectCard({
  project,
  shape = "tall",
  showDescription = false,
}: {
  project: ProjectCardData;
  shape?: "tall" | "wide";
  showDescription?: boolean;
}) {
  const href = project.projectUrl || "/projects";
  const external = Boolean(project.projectUrl);
  const logo = isLogo(project.imageWidth);
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group block"
    >
      <div
        className={`relative w-full overflow-hidden rounded-2xl bg-paper-raised ${
          shape === "tall" ? "aspect-[4/3] md:aspect-[4/5]" : "aspect-[4/3]"
        }`}
        // A logo sits on its own dominant colour (measured by Sanity), so each project reads as a brand tile.
        style={logo && project.brandColor ? { backgroundColor: project.brandColor } : undefined}
      >
        {project.imageUrl ? (
          logo ? (
            <div className="flex h-full w-full items-center justify-center p-10">
              <img
                src={project.imageUrl}
                alt={`${project.title} logo`}
                className="max-h-[55%] max-w-[70%] object-contain transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                loading="lazy"
              />
            </div>
          ) : (
            <img
              src={`${project.imageUrl}?w=1400&auto=format`}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              loading="lazy"
            />
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-ink/30">{project.title}</div>
        )}
        <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink opacity-100 transition-all duration-300 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
          <svg aria-hidden className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 11 11 5M6 5h5v5" />
          </svg>
        </span>
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <p className="text-2xl font-semibold tracking-[-0.02em] text-ink">{project.title}</p>
        {project.category ? (
          <p className="shrink-0 font-mono text-xs uppercase tracking-[0.08em] text-muted">{project.category}</p>
        ) : null}
      </div>
      {showDescription && project.description ? (
        <p className="mt-2 line-clamp-3 max-w-xl text-[15px] leading-relaxed text-muted">{project.description}</p>
      ) : null}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Blog posts                                                           */
/* ------------------------------------------------------------------ */

export type PostCardData = {
  _id: string;
  title: string | null;
  slug: string | null;
  excerpt: string | null;
  author?: string | null;
  publishedAt: string | null;
  imageUrl: string | null;
  characters: number | null;
};

/** GROQ projection for PostCardData. */
export const postCardProjection = `_id, title, "slug": slug.current, excerpt, author, publishedAt,
  "imageUrl": mainImage.asset->url,
  "characters": length(pt::text(body))`;

export const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

export function readMinutes(characters: number | null) {
  // ~5 characters a word, ~200 words a minute.
  return Math.max(1, Math.round((characters ?? 0) / 1000));
}

export function PostMeta({ post, className = "" }: { post: PostCardData; className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.08em] ${className}`}>
      {post.publishedAt ? <time dateTime={post.publishedAt}>{dateFormat.format(new Date(post.publishedAt))}</time> : null}
      <span className="flex items-center gap-1.5">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent-primary" />
        {readMinutes(post.characters)} min read
      </span>
      {post.author ? <span>{post.author}</span> : null}
    </div>
  );
}

export function PostCard({ post }: { post: PostCardData }) {
  return (
    <Link
      href={post.slug ? `/blog/${post.slug}` : "/blog"}
      className="group flex h-full flex-col rounded-2xl bg-white p-4 transition-colors hover:bg-paper-raised sm:p-5"
    >
      <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-paper-raised">
        {post.imageUrl ? (
          <img
            src={`${post.imageUrl}?w=900&auto=format`}
            alt=""
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : null}
      </div>
      <PostMeta post={{ ...post, author: null }} className="mt-5 text-muted" />
      <h3 className="mt-3 text-xl font-semibold leading-snug tracking-[-0.02em] text-ink">{post.title}</h3>
      {post.excerpt ? <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">{post.excerpt}</p> : null}
    </Link>
  );
}

/** The newest post, shown wide at the top of the blog. */
export function FeaturedPostCard({ post, label }: { post: PostCardData; label: string }) {
  return (
    <Link
      href={post.slug ? `/blog/${post.slug}` : "/blog"}
      className="group grid overflow-hidden rounded-2xl bg-white p-4 transition-colors hover:bg-paper-raised sm:p-5 lg:grid-cols-2 lg:gap-10"
    >
      <div className="aspect-[16/10] w-full overflow-hidden rounded-xl bg-paper-raised">
        {post.imageUrl ? (
          <img
            src={`${post.imageUrl}?w=1400&auto=format`}
            alt=""
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : null}
      </div>
      <div className="flex flex-col justify-center py-6 lg:py-8 lg:pr-6">
        <span className="w-fit rounded-full bg-accent-primary px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink">
          {label}
        </span>
        <h2 className="mt-5 text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-ink sm:text-4xl">{post.title}</h2>
        {post.excerpt ? <p className="mt-4 line-clamp-3 text-base leading-relaxed text-muted">{post.excerpt}</p> : null}
        <PostMeta post={post} className="mt-6 text-muted" />
      </div>
    </Link>
  );
}
