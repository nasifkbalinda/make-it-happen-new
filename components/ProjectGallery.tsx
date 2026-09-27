"use client";

import { useState } from "react";
import { ProjectCard, type ProjectCardData } from "./cards";
import { Reveal } from "./motion";

/** Category filter over the project grid. Categories come from the projects themselves. */
export default function ProjectGallery({ projects, allLabel }: { projects: ProjectCardData[]; allLabel: string }) {
  const categories = Array.from(new Set(projects.map((project) => project.category?.trim()).filter(Boolean))) as string[];
  const [active, setActive] = useState<string | null>(null);
  const visible = active ? projects.filter((project) => project.category?.trim() === active) : projects;

  const filters: { label: string; value: string | null; count: number }[] = [
    { label: allLabel, value: null, count: projects.length },
    ...categories.map((category) => ({
      label: category,
      value: category,
      count: projects.filter((project) => project.category?.trim() === category).length,
    })),
  ];

  return (
    <div>
      <div className="-mx-6 overflow-x-auto px-6 sm:mx-0 sm:px-0" role="group" aria-label="Filter projects by category">
        <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
          {filters.map((filter) => {
            const isActive = filter.value === active;
            return (
              <button
                key={filter.label}
                type="button"
                onClick={() => setActive(filter.value)}
                aria-pressed={isActive}
                className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-ink text-white" : "bg-white text-ink hover:bg-paper-raised"
                }`}
              >
                {filter.label}
                <sup className={`font-mono text-[10px] ${isActive ? "text-accent-primary" : "text-muted"}`}>
                  {String(filter.count).padStart(2, "0")}
                </sup>
              </button>
            );
          })}
        </div>
      </div>

      <div key={active ?? "all"} className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-16 lg:gap-x-16">
        <div className="flex flex-col gap-12 md:gap-16">
          {visible.filter((_, index) => index % 2 === 0).map((project) => (
            <Reveal key={project._id}>
              <ProjectCard project={project} showDescription />
            </Reveal>
          ))}
        </div>
        <div className="flex flex-col gap-12 md:gap-16 md:pt-40">
          {visible.filter((_, index) => index % 2 === 1).map((project) => (
            <Reveal key={project._id}>
              <ProjectCard project={project} showDescription />
            </Reveal>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="mt-12 rounded-2xl border border-dashed border-ink/20 py-20 text-center text-muted">No projects in this category yet.</p>
      ) : null}
    </div>
  );
}
