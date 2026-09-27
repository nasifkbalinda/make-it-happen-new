"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** Calls back once the element first scrolls into view. */
function useInView<T extends Element>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

/** Fades and un-blurs its children as they enter the viewport. */
export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.15);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-[opacity,filter,transform] duration-1000 ease-out ${
        inView ? "translate-y-0 opacity-100 blur-0" : "translate-y-6 opacity-0 blur-md"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * A statement whose words fill in from grey to ink as it scrolls through the
 * viewport. Screen readers get the sentence as plain text.
 */
export function ScrollRevealText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the block's top reaches 85% of the viewport, 1 when its bottom reaches 45%.
      const start = vh * 0.85;
      const end = vh * 0.45;
      const total = rect.height + (start - end);
      const value = (start - rect.top) / total;
      setProgress(Math.min(1, Math.max(0, value)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  const words = text.split(/\s+/).filter(Boolean);
  const lit = reduced ? words.length : Math.round(progress * words.length);

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, index) => (
          <span key={`${word}-${index}`} className={`transition-colors duration-300 ${index < lit ? "text-ink" : "text-ink/20"}`}>
            {word}{" "}
          </span>
        ))}
      </span>
    </p>
  );
}

/**
 * Rolls each digit of a figure like "50+" or "98%" up into place when it
 * enters the viewport. Non-digit characters are shown as they are.
 */
export function RollingNumber({ value, className = "" }: { value: string; className?: string }) {
  const [ref, inView] = useInView<HTMLSpanElement>(0.4);
  const reduced = usePrefersReducedMotion();
  const show = inView || reduced;

  return (
    <span ref={ref} className={`inline-flex overflow-hidden leading-none ${className}`} aria-label={value}>
      {value.split("").map((char, index) => {
        const digit = Number.parseInt(char, 10);
        if (Number.isNaN(digit)) {
          return (
            <span key={index} aria-hidden>
              {char}
            </span>
          );
        }
        return (
          // The invisible final digit sizes the slot, so "15+" keeps natural spacing while it rolls.
          <span key={index} aria-hidden className="relative inline-block h-[1em] overflow-hidden">
            <span className="invisible">{char}</span>
            <span
              className="absolute inset-x-0 top-0 flex flex-col items-center transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ transform: `translateY(${show ? -digit : 0}em)`, transitionDelay: `${index * 120}ms` }}
            >
              {Array.from({ length: 10 }, (_, n) => (
                <span key={n} className="block h-[1em]">
                  {n}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}

/** Silent background video that holds still for visitors who prefer reduced motion. */
export function BackgroundVideo({ src, poster, className = "" }: { src: string; poster?: string | null; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (reduced) video.pause();
    else video.play().catch(() => {});
  }, [reduced]);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster ?? undefined}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
    />
  );
}
