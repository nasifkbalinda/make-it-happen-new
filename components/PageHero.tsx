import type { ReactNode } from "react";
import { Tag } from "./ui";

/**
 * The dark, rounded opening card every inner page starts with — the same
 * treatment as the homepage hero, so the transparent header always sits on ink.
 */
export default function PageHero({
  kicker,
  title,
  description,
  aside,
  children,
}: {
  kicker: string;
  title: string;
  description?: string | null;
  /** Small text at the bottom right, e.g. a count. */
  aside?: ReactNode;
  /** Extra content under the description (buttons, meta). */
  children?: ReactNode;
}) {
  return (
    <section className="p-2 sm:p-3">
      <div className="relative isolate overflow-hidden rounded-[20px] bg-ink text-white">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.08] [background-image:radial-gradient(circle,white_1px,transparent_1.6px)] [background-size:28px_28px]"
        />
        {/* The logo's breakaway pixels as a corner mark. */}
        <div aria-hidden className="pointer-events-none absolute right-6 top-24 hidden grid-cols-4 gap-2 sm:right-10 sm:grid lg:top-28">
          {[0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1].map((on, index) => (
            <span key={index} className={`h-3 w-3 ${on ? "bg-accent-primary" : ""}`} />
          ))}
        </div>

        <div className="flex min-h-[26rem] flex-col justify-end px-5 pb-10 pt-32 sm:min-h-[30rem] sm:px-8 lg:min-h-[34rem] lg:px-10 lg:pb-12">
          <div className="max-w-5xl animate-[rise_1.1s_cubic-bezier(0.16,1,0.3,1)_both]">
            <Tag>{kicker}</Tag>
            <h1 className="mt-6 text-[2.6rem] font-semibold leading-[1] tracking-[-0.045em] sm:text-6xl lg:text-[5.5rem]">
              {title}
            </h1>
          </div>
          {description || aside || children ? (
            <div className="mt-8 flex flex-col gap-6 animate-[rise_1.1s_cubic-bezier(0.16,1,0.3,1)_150ms_both] lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                {description ? <p className="text-base leading-relaxed text-white/70 sm:text-lg">{description}</p> : null}
                {children}
              </div>
              {aside ? <div className="font-mono text-xs uppercase tracking-[0.08em] text-white/55">{aside}</div> : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
