"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./motion";

/** Fired when a card starts playing with sound, so any other card playing with sound pauses. */
const PLAY_EVENT = "project-video-play";

/**
 * A project's video ad, played in place. It loops silently as a preview; a click plays it
 * from the start with sound, and later clicks pause and resume. When it ends it goes back to the preview.
 * The expand button shows the whole, uncropped video in an overlay on the same page.
 */
export default function ProjectVideoPlayer({ src, poster, title }: { src: string; poster?: string | null; title: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const expandedRef = useRef<HTMLVideoElement>(null);
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

  // Everything here runs inside the click, so browsers that need a tap to play sound (iOS Safari) allow it.
  function expand() {
    const video = ref.current;
    const expanded = expandedRef.current;
    if (!video || !expanded || !dialogRef.current) return;
    expanded.currentTime = mode === "preview" ? 0 : video.currentTime;
    video.pause();
    window.dispatchEvent(new CustomEvent(PLAY_EVENT, { detail: expanded }));
    dialogRef.current.showModal();
    expanded.play().catch(() => {});
  }

  // Back in the card, pick up where the overlay left off, or return to the preview if it finished.
  function onOverlayClose() {
    const video = ref.current;
    const expanded = expandedRef.current;
    if (!video || !expanded) return;
    expanded.pause();
    if (expanded.ended || expanded.currentTime === 0) {
      video.currentTime = 0;
      video.muted = true;
      setMode("preview");
      if (!reduced) video.play().catch(() => {});
    } else {
      video.currentTime = expanded.currentTime;
      video.muted = false;
      setMode("paused");
    }
  }

  const playing = mode === "playing";
  return (
    <div className="relative h-full w-full">
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
      <button
        type="button"
        onClick={expand}
        aria-label={`Expand ${title} video`}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-[10px] bg-white text-ink transition-opacity duration-300 focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100"
      >
        <svg aria-hidden className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 2.5h4v4M13.5 2.5 9 7M6.5 13.5h-4v-4M2.5 13.5 7 9" />
        </svg>
      </button>
      <dialog
        ref={dialogRef}
        onClose={onOverlayClose}
        aria-label={`${title} video`}
        className="fixed inset-0 m-0 h-dvh max-h-none w-dvw max-w-none bg-transparent p-0 backdrop:bg-black/90"
      >
        <div
          className="flex h-full w-full items-center justify-center p-4 pt-16 sm:p-12"
          onClick={(event) => {
            if (event.target === event.currentTarget) dialogRef.current?.close();
          }}
        >
          <video
            ref={expandedRef}
            className="max-h-full max-w-full rounded-xl"
            src={src}
            poster={poster ?? undefined}
            controls
            playsInline
            preload="none"
          />
        </div>
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          aria-label="Close video"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-[10px] bg-white text-ink"
        >
          <svg aria-hidden className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path strokeLinecap="round" d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
          </svg>
        </button>
      </dialog>
    </div>
  );
}
