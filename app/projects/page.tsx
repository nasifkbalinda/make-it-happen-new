import type { Metadata } from "next";
import { createClient } from "next-sanity";
import Cta from "@/components/Cta";
import PageHero from "@/components/PageHero";
import ProjectGallery from "@/components/ProjectGallery";
import { arrangeProjects, projectCardProjection, type ProjectCardData } from "@/components/cards";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Work | Make It Happen",
  description: "Websites, platforms and products we have designed, built and launched for businesses across East Africa.",
};

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

type ProjectsPageData = {
  kicker: string | null;
  heading: string | null;
  description: string | null;
  allFilterLabel: string | null;
  playlist: (ProjectCardData | null)[] | null;
  all: ProjectCardData[] | null;
};

export default async function ProjectsPage() {
  // The playlist on the Projects Page singleton sets the order; any projects not in it follow, newest first.
  const data = await client.fetch<ProjectsPageData>(`{
    ...*[_id == "projectsPage"][0]{
      kicker, heading, description, allFilterLabel,
      "playlist": projectList[]->{ ${projectCardProjection} }
    },
    "all": *[_type == "project"] | order(_createdAt desc){ ${projectCardProjection} }
  }`);

  const projects = arrangeProjects(data?.playlist, data?.all);

  return (
    <div className="bg-paper text-ink">
      <PageHero
        kicker={data?.kicker?.trim() || "Portfolio"}
        title={data?.heading?.trim() || "Work that speaks"}
        description={data?.description}
        aside={projects.length ? `${String(projects.length).padStart(2, "0")} projects live` : null}
      />

      <section className="shell py-16 sm:py-24">
        {projects.length ? (
          <ProjectGallery projects={projects} allLabel={data?.allFilterLabel?.trim() || "All work"} />
        ) : (
          <p className="rounded-2xl border border-dashed border-ink/20 py-20 text-center text-muted">
            No projects yet. Add them in the Studio under Project.
          </p>
        )}
      </section>

      <Cta />
    </div>
  );
}
