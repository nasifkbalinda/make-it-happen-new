"use client";

import { useState } from "react";
import Link from "next/link";

type Project = {
  _id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string | null;
  slug?: string;
  projectUrl?: string;
};

export default function ProjectGallery({ projects }: { projects: Project[] }) {
  // Extract unique categories
  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))];
  
  // State for the active filter
  const [activeCategory, setActiveCategory] = useState("All");

  // NEW: State (Memory Bank) to track which project descriptions are expanded.
  // It acts like a checklist: { "project1_id": true, "project2_id": false }
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});

  // NEW: The Switch. This turns the "Read More" light on or off for a specific card.
  const toggleDescription = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); // This is crucial! It stops the invisible overlay link from firing.
    setExpandedProjects((prev) => ({
      ...prev,
      [id]: !prev[id] // If it was true, make it false. If false, make it true.
    }));
  };

  // Filter projects based on state
  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="w-full">
      {/* Filter Pills */}
      <div className="mb-12 flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category as string}
            onClick={() => setActiveCategory(category as string)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              activeCategory === category
                ? "bg-accent-primary text-[#0c1016]"
                : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            {category as string}
          </button>
        ))}
      </div>

      {/* Dynamic Project Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => {
          // Check our memory bank: is THIS specific card expanded right now?
          const isExpanded = expandedProjects[project._id];

          return (
            <div 
              key={project._id} 
              className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#111720] transition-all hover:border-accent-primary/50 hover:shadow-[0_0_30px_color-mix(in_srgb,var(--accent-primary)_5%,transparent)]"
            >
              {/* Image Section */}
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

              {/* Text Section */}
              <div className="flex flex-1 flex-col p-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-accent-primary">
                  {project.category || "Uncategorized"}
                </p>
                <h3 className="mt-3 text-xl font-bold text-white">
                  {project.title}
                </h3>
                
                {/* THE MAGIC TRICK: We wrap the description in a new relative div */}
                <div className="relative mt-3">
                  <p className={`text-sm leading-relaxed text-white/65 transition-all duration-300 ${isExpanded ? "" : "line-clamp-3"}`}>
                    {project.description}
                  </p>
                  
                  {/* The Read More / Read Less Button */}
                  <button
                    onClick={(e) => toggleDescription(project._id, e)}
                    // z-20 puts this button ON TOP of the invisible overlay shield!
                    className="relative z-20 mt-2 text-xs font-semibold text-accent-primary hover:text-white transition-colors focus:outline-none"
                  >
                    {isExpanded ? "Read less" : "Read more"}
                  </button>
                </div>

                {/* Visual "View Project" Call to Action */}
                {(project.slug || project.projectUrl) && (
                  <div className="mt-auto pt-6 flex items-center gap-2 text-sm font-bold text-white/50 transition-colors group-hover:text-accent-primary">
                    <span>View Project</span>
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </div>
                )}
              </div>

              {/* Invisible Clickable Overlay (z-10 keeps it underneath our new z-20 button) */}
              {(project.slug || project.projectUrl) && (
                <Link 
                  href={project.projectUrl || `/projects/${project.slug}`}
                  target={project.projectUrl ? "_blank" : "_self"}
                  className="absolute inset-0 z-10"
                  aria-label={`View ${project.title}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-20 text-white/50 border border-dashed border-white/10 rounded-2xl mt-8">
          No projects found for this category.
        </div>
      )}
    </div>
  );
}