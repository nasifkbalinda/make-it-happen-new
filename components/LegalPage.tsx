import type { Metadata } from "next";
import Link from "next/link";
import { PortableText, type PortableTextBlock } from "@portabletext/react";
import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

const legalQuery = `*[_type == "legalPage" && _id == $id][0]{
  title,
  intro,
  lastUpdated,
  body
}`;

type LegalDoc = {
  title: string | null;
  intro: string | null;
  lastUpdated: string | null;
  body: PortableTextBlock[] | null;
};

export async function getLegalPage(id: "privacy" | "terms") {
  return client.fetch<LegalDoc | null>(legalQuery, { id });
}

export async function buildLegalMetadata(
  id: "privacy" | "terms",
  fallbackTitle: string,
): Promise<Metadata> {
  const doc = await getLegalPage(id);
  const title = doc?.title ?? fallbackTitle;
  return {
    title: `${title} | Make It Happen`,
    description:
      doc?.intro ?? `${title} for Make It Happen, an IT agency based in Kampala, Uganda.`,
  };
}

function formatDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Shared shell for /privacy and /terms.
 *
 * The content lives in Sanity, so an unpublished draft renders the placeholder
 * below rather than a broken or empty page.
 */
export default async function LegalPage({
  id,
  fallbackTitle,
}: {
  id: "privacy" | "terms";
  fallbackTitle: string;
}) {
  const doc = await getLegalPage(id);
  const title = doc?.title ?? fallbackTitle;
  const lastUpdated = formatDate(doc?.lastUpdated ?? null);
  const hasBody = Boolean(doc?.body?.length);

  return (
    <div className="mx-auto w-full max-w-3xl px-6 pb-32 pt-32 sm:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D7FF65]">
        Legal
      </p>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
        {title}
      </h1>
      {lastUpdated ? (
        <p className="mt-4 text-sm text-white/40">Last updated {lastUpdated}</p>
      ) : null}
      {doc?.intro ? (
        <p className="mt-6 text-lg leading-relaxed text-white/60">{doc.intro}</p>
      ) : null}

      {hasBody ? (
        <div className="prose prose-invert prose-lg mt-12 max-w-none prose-headings:text-white prose-p:text-white/80 prose-li:text-white/80 prose-a:text-[#D7FF65] prose-strong:text-white">
          <PortableText value={doc!.body as PortableTextBlock[]} />
        </div>
      ) : (
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-8">
          <p className="text-base leading-relaxed text-white/70">
            This page is being finalised. In the meantime, reach out and we will answer any
            question about how we handle your data or engage on projects.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#D7FF65] px-7 py-3 text-sm font-bold text-[#111720] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#e8ff99]"
          >
            Contact us
            <span aria-hidden className="text-lg leading-none">→</span>
          </Link>
        </div>
      )}
    </div>
  );
}
