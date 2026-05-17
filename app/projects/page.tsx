import { createClient } from "next-sanity";
import ProjectGallery from "@/components/ProjectGallery";
import Cta from "@/components/Cta";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false, 
});

export default async function ProjectsPage() {
  // Fetch Page Settings AND Projects concurrently
  const [pageData, projects] = await Promise.all([
    client.fetch(`*[_type == "projectsPage"][0]`),
    client.fetch(`*[_type == "project"] | order(_createdAt desc){
      _id, title, category, description, "slug": slug.current, projectUrl, "imageUrl": mainImage.asset->url
    }`)
  ]);

  return (
    <div className="flex w-full flex-col items-center">
      <div className="w-full max-w-7xl px-6 sm:px-10 lg:px-14 pt-32 pb-32">
        
        {/* Dynamic Page Header */}
        <div className="mb-14 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D7FF65]">
            {pageData?.kicker || "Portfolio"}
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-5xl">
            {pageData?.heading || "Selected Works."}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-white/60">
            {pageData?.description || "A showcase of our recent digital transformations, stripped down to the raw results and architecture."}
          </p>
        </div>

        <ProjectGallery projects={projects} />
      </div>
      <Cta />
    </div>
  );
}