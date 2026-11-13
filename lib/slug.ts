/**
 * Blog post slugs become a single URL segment: /blog/<slug>. A slug containing
 * "/" can never be reached, because the router splits on it, so the page
 * lookup misses and the reader gets a 404. That happened to five live posts
 * whose slugs had been typed WordPress-style, e.g. "/my-post/".
 *
 * Studio now blocks such slugs (see sanity/schemaTypes/post.ts), but documents
 * written through the API bypass Studio validation, so the site also tolerates
 * a slug stored with stray slashes.
 */

/** Lowercase words joined by single hyphens: "my-post-2026". */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Turns any text into a valid slug. Used by the Studio "Generate" button. */
export function slugify(input: string, maxLength = 96): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // drop accents: é -> e
    .toLowerCase()
    .replace(/['’]/g, "") // "don't" -> "dont", not "don-t"
    .replace(/[^a-z0-9]+/g, "-") // slashes, spaces, punctuation -> hyphen
    .slice(0, maxLength)
    .replace(/^-+|-+$/g, ""); // no leading/trailing hyphens
}

/** Strips leading/trailing slashes from a stored slug, for building links. */
export function cleanSlug(slug: string): string {
  return slug.replace(/^\/+|\/+$/g, "");
}

/** Every stored form a URL segment could correspond to, for the GROQ lookup. */
export function slugCandidates(segment: string): string[] {
  const s = cleanSlug(segment);
  return [s, `/${s}`, `${s}/`, `/${s}/`];
}
