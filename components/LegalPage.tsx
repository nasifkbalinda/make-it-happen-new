import type { Metadata } from "next";
import PageHero from "./PageHero";
import { PillLink } from "./ui";
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
    <div className="bg-paper text-ink">
      <PageHero
        kicker="Legal"
        title={title}
        description={doc?.intro}
        aside={lastUpdated ? `Last updated ${lastUpdated}` : null}
      />

      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
        {hasBody ? (
          <div className="prose prose-lg max-w-none prose-neutral prose-headings:font-semibold prose-headings:tracking-[-0.03em] prose-headings:text-ink prose-p:text-ink/80 prose-li:text-ink/80 prose-a:text-ink prose-a:decoration-accent-primary prose-a:decoration-2 prose-a:underline-offset-4 prose-strong:text-ink">
            <PortableText value={doc!.body as PortableTextBlock[]} />
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-8">
            <p className="text-base leading-relaxed text-muted">
              This page is being finalised. In the meantime, reach out and we will answer any question about how we
              handle your data or engage on projects.
            </p>
            <div className="mt-6">
              <PillLink href="/contact" variant="dark">Contact us</PillLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
