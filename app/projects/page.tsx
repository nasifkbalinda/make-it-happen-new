import { createClient } from "next-sanity";
import ProjectGallery from "@/components/ProjectGallery";
import Cta from "@/components/Cta";

// 1. Establish connection to Sanity
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false, 
});

export default async function ProjectsPage() {
  // 2. GROQ Query (Added slug and projectUrl just in case you need links)
  const query = `*[_type == "project"] | order(_createdAt desc){
    _id,
    title,
    category,
    description,
    "slug": slug.current,
    projectUrl,
    "imageUrl": mainImage.asset->url
  }`;
  
  const projects = await client.fetch(query);

  return (
    <div className="flex w-full flex-col items-center">
      <div className="w-full max-w-7xl px-6 sm:px-10 lg:px-14 pt-32 pb-32">
        
        {/* Page Header */}
        <div className="max-w-2xl mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Selected Works.
          </h1>
          <p className="mt-4 text-base text-white/60">
            A showcase of our recent digital transformations, stripped down to the raw results and architecture.
          </p>
        </div>

        {/* Client Component that handles the filtering and Grid rendering */}
        <ProjectGallery projects={projects} />

      </div>

      {/* Global CTA at the bottom */}
      <Cta />
    </div>
  );
}