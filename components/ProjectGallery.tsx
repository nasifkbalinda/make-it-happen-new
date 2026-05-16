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
                ? "bg-[#D7FF65] text-[#0c1016]"
                : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            {category as string}
          </button>
        ))}
      </div>

      {/* Dynamic Project Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <div 
            key={project._id} 
            className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#111720] transition-all hover:border-[#D7FF65]/50 hover:shadow-[0_0_30px_rgba(215,255,101,0.05)]"
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

            {/* Text Section (Added flex-1 so it fills the height) */}
            <div className="flex flex-1 flex-col p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#D7FF65]">
                {project.category || "Uncategorized"}
              </p>
              <h3 className="mt-3 text-xl font-bold text-white">
                {project.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65 line-clamp-3">
                {project.description}
              </p>

              {/* Visual "View Project" Call to Action */}
              {/* mt-auto pushes this to the absolute bottom of the card automatically */}
              {(project.slug || project.projectUrl) && (
                <div className="mt-auto pt-6 flex items-center gap-2 text-sm font-bold text-white/50 transition-colors group-hover:text-[#D7FF65]">
                  <span>View Project</span>
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </div>
              )}
            </div>

            {/* Invisible Clickable Overlay (Covers the whole card to make clicking easy) */}
            {(project.slug || project.projectUrl) && (
              <Link 
                href={project.projectUrl || `/projects/${project.slug}`}
                target={project.projectUrl ? "_blank" : "_self"}
                className="absolute inset-0 z-10"
                aria-label={`View ${project.title}`}
              />
            )}
          </div>
        ))}
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