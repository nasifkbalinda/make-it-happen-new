import { createClient } from "next-sanity";

// 1. Establish connection to Sanity
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false, 
});

export default async function ProjectsPage() {
  // 2. GROQ Query to fetch ALL projects
  const query = `*[_type == "project"]{
    _id,
    title,
    category,
    description,
    "imageUrl": mainImage.asset->url
  }`;
  
  const projects = await client.fetch(query);

  return (
    <div className="flex w-full flex-col items-center pt-24 pb-32">
      <div className="w-full max-w-7xl px-6 sm:px-10 lg:px-14">
        
        {/* Page Header */}
        <div className="max-w-2xl mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Selected Works.
          </h1>
          <p className="mt-4 text-base text-white/60">
            A showcase of our recent digital transformations, stripped down to the raw results and architecture.
          </p>
        </div>

        {/* Dynamic Project Grid - UPDATED TO 3 COLUMNS */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project: any) => (
            <div 
              key={project._id} 
              className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#111720] transition-all hover:border-[#D7FF65]/50"
            >
              {/* Image Section - UPDATED TO 16:9 AND STANDARD IMG TAG */}
              <div className="relative aspect-video w-full overflow-hidden bg-white/5">
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-white/20">
                    No image uploaded
                  </div>
                )}
              </div>

              {/* Text Section - REDUCED PADDING */}
              <div className="flex flex-col p-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#D7FF65]">
                  {project.category || "Uncategorized"}
                </p>
                <h3 className="mt-3 text-xl font-bold text-white">
                  {project.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65 line-clamp-3">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="text-center py-20 text-white/50">
            No projects found. Head to the admin dashboard to add some!
          </div>
        )}

      </div>
    </div>
  );
}