"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./motion";

/** Fired when a card starts playing with sound, so any other card playing with sound pauses. */
const PLAY_EVENT = "project-video-play";

/**
 * A project's video ad, played in place. It loops silently as a preview; a click plays it
 * from the start with sound, and later clicks pause and resume. When it ends it goes back to the preview.
 */
export default function ProjectVideoPlayer({ src, poster, title }: { src: string; poster?: string | null; title: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();
  const [mode, setMode] = useState<"preview" | "playing" | "paused">("preview");

  useEffect(() => {
    const video = ref.current;
    if (!video || mode !== "preview") return;
    video.muted = true;
    if (reduced) video.pause();
    else video.play().catch(() => {});
  }, [mode, reduced]);

  useEffect(() => {
    const onOtherPlay = (event: Event) => {
      const video = ref.current;
      if (video && (event as CustomEvent).detail !== video && !video.muted) video.pause();
    };
    window.addEventListener(PLAY_EVENT, onOtherPlay);
    return () => window.removeEventListener(PLAY_EVENT, onOtherPlay);
  }, []);

  function toggle() {
    const video = ref.current;
    if (!video) return;
    if (mode === "playing") {
      video.pause();
      return;
    }
    if (mode === "preview") {
      video.currentTime = 0;
      video.muted = false;
    }
    window.dispatchEvent(new CustomEvent(PLAY_EVENT, { detail: video }));
    // Set directly: coming from the preview the video is already playing, so no play event fires.
    setMode("playing");
    video.play().catch(() => setMode("paused"));
  }

  const playing = mode === "playing";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? `Pause ${title} video` : `Play ${title} video with sound`}
      className="group/player relative block h-full w-full cursor-pointer"
    >
      <video
        ref={ref}
        className="h-full w-full object-cover"
        src={src}
        poster={poster ?? undefined}
        autoPlay={!reduced}
        muted
        loop={mode === "preview"}
        playsInline
        preload="metadata"
        onPause={(event) => {
          if (!event.currentTarget.muted && !event.currentTarget.ended) setMode("paused");
        }}
        onEnded={(event) => {
          event.currentTarget.currentTime = 0;
          setMode("preview");
        }}
      />
      <span
        aria-hidden
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          playing ? "opacity-0 group-hover/player:opacity-100" : "bg-ink/20 opacity-100"
        }`}
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-ink shadow-lg">
          {playing ? (
            <svg className="h-5 w-5" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 3h3v10H4zM9 3h3v10H9z" />
            </svg>
          ) : (
            <svg className="ml-0.5 h-5 w-5" viewBox="0 0 16 16" fill="currentColor">
              <path d="M5 3.5v9l7.5-4.5z" />
            </svg>
          )}
        </span>
      </span>
    </button>
  );
}
