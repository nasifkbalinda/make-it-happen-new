"use client";

import { useState } from "react";
import { ArrowRight } from "./ui";

export type ShowcaseService = {
  _id: string;
  title: string | null;
  description: string | null;
  features: string[] | null;
  imageUrl: string | null;
};

/**
 * Large service names on the left; the one hovered, focused or tapped lights up
 * and its picture, summary and deliverables show on the right (below it on phones).
 */
export default function ServicesShowcase({ services }: { services: ShowcaseService[] }) {
  const [active, setActive] = useState(0);
  const current = services[active];

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <ul className="lg:col-span-7">
        {services.map((service, index) => {
          const isActive = index === active;
          return (
            <li key={service._id} className="border-t border-white/10 last:border-b">
              <button
                type="button"
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                aria-expanded={isActive}
                className="group flex w-full items-start gap-4 py-6 text-left sm:py-8"
              >
                <ArrowRight
                  className={`mt-3 h-8 w-8 shrink-0 text-accent-primary transition-all duration-300 sm:mt-4 sm:h-10 sm:w-10 ${
                    isActive ? "opacity-100" : "-ml-12 opacity-0"
                  }`}
                />
                <span
                  className={`text-4xl font-semibold leading-[1.05] tracking-[-0.04em] transition-colors duration-300 sm:text-6xl lg:text-7xl ${
                    isActive ? "text-white" : "text-white/35 group-hover:text-white/60"
                  }`}
                >
                  {service.title}
                </span>
                <span
                  className={`mt-1 font-mono text-sm transition-colors ${isActive ? "text-accent-primary" : "text-white/40"}`}
                >
                  [{String(index + 1).padStart(2, "0")}]
                </span>
              </button>

              {/* Phones: details open under the tapped service. */}
              {isActive ? (
                <div className="pb-8 lg:hidden">
                  <ServiceDetail service={service} />
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>

      <div className="hidden lg:col-span-4 lg:col-start-9 lg:block">
        {current ? (
          <div key={current._id} className="sticky top-32 animate-[fadeIn_500ms_ease-out]">
            <ServiceDetail service={current} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ServiceDetail({ service }: { service: ShowcaseService }) {
  const features = (service.features ?? []).filter((feature) => feature?.trim());
  return (
    <div>
      {service.imageUrl ? (
        <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-ink-raised">
          <img src={service.imageUrl} alt="" className="h-full w-full object-cover" />
        </div>
      ) : null}
      <p className="mt-6 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-white/60">
        <span aria-hidden className="text-accent-primary">+</span>
        {service.title}
      </p>
      {service.description ? <p className="mt-3 text-lg leading-snug text-white">{service.description}</p> : null}
      {features.length > 0 ? (
        <ul className="mt-6 flex flex-wrap gap-2">
          {features.map((feature) => (
            <li key={feature} className="rounded-full border border-white/15 px-3 py-1.5 text-sm text-white/80">
              {feature}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
