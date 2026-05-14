import Link from "next/link";

export default function Cta() {
  return (
    <section className="relative z-10 w-full overflow-hidden border-t border-white/5 bg-[#0c1016] py-24 sm:py-32">
      {/* Subtle Ambient Glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[600px] rounded-full bg-[#D7FF65]/[0.03] blur-[80px]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center sm:px-10 lg:px-14">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Ready to make it happen?
        </h2>
        <p className="mx-auto mt-6 text-lg leading-relaxed text-white/60">
          Let&apos;s collaborate to build something extraordinary. Get in touch today.
        </p>
        <div className="mt-10 flex items-center justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-[#D7FF65] px-8 py-3.5 text-sm font-bold text-[#111720] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#e8ff99]"
          >
            Start Your Project
            <span aria-hidden className="text-base leading-none">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}