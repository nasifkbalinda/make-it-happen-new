import { Reveal } from "./motion";
import { PillLink, Tag } from "./ui";

/** Closing call to action shared by every page. */
export default function Cta() {
  return (
    <section className="bg-paper px-2 pb-2 pt-2 sm:px-3 sm:pb-3">
      <div className="relative overflow-hidden rounded-[20px] bg-ink px-6 py-24 text-center text-white sm:py-32">
        {/* The logo's breakaway pixels, as a quiet corner mark. */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-8 top-8 hidden grid-cols-4 gap-2 opacity-80 sm:grid"
        >
          {[1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0].map((on, index) => (
            <span
              key={index}
              className={`h-3 w-3 ${on ? "bg-accent-primary" : "bg-transparent"}`}
            />
          ))}
        </div>
        <Reveal>
          <Tag tone="dark">Get started</Tag>
          <h2 className="mx-auto mt-6 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-7xl lg:text-8xl">
            Let&rsquo;s make it happen.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
            Tell us what you&rsquo;re building. A senior member of the team
            replies within one working day.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <PillLink href="/contact" variant="accent" size="lg">
              Start a project
            </PillLink>
            <PillLink
              href="https://wa.me/256790879117"
              variant="outline"
              size="lg"
            >
              Chat on WhatsApp
            </PillLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
