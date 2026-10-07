"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "./ui";

export type ShowcaseService = {
  _id: string;
  title: string | null;
  description: string | null;
  features: string[] | null;
  imageUrl: string | null;
};

/**
 * Large service names on the left. As the visitor scrolls, the service crossing
 * the middle of the screen lights up (hover, focus and tap do too) and its
 * picture, summary and deliverables show on the right. Phones show every
 * service's details under its name, with the current one brought forward.
 */
export default function ServicesShowcase({ services }: { services: ShowcaseService[] }) {
  const [active, setActive] = useState(0);
  const current = services[active];
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const items = itemRefs.current.filter((item): item is HTMLLIElement => Boolean(item));
    if (!items.length) return;
    // A thin band just above the middle of the viewport; whichever service is in it is current.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [services.length]);

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <ul className="lg:col-span-7">
        {services.map((service, index) => {
          const isActive = index === active;
          return (
            <li
              key={service._id}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              data-index={index}
              className="border-t border-white/10 last:border-b"
            >
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
                  className={`text-4xl font-semibold leading-[1.05] tracking-[-0.04em] transition-colors duration-300 sm:text-5xl lg:text-6xl ${
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

              {/* Phones: details sit under each service; the current one is brought forward. */}
              <div className={`pb-8 transition-opacity duration-500 lg:hidden ${isActive ? "opacity-100" : "opacity-40"}`}>
                <ServiceDetail service={service} />
              </div>
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
            <li key={feature} className="rounded-md border border-white/15 px-3 py-1.5 text-sm text-white/80">
              {feature}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
