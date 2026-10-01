"use client";

import { useEffect, useRef } from "react";
import type { VideoClip } from "@/app/lib/videos";

interface LazyVideoProps {
  clip: VideoClip;
  className?: string;
}

/**
 * Muted looping background video that only downloads when it gets close to
 * the viewport and pauses when it leaves. With reduced motion it stays on
 * its poster frame.
 */
export default function LazyVideo({ clip, className = "" }: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    video.muted = true;
    let loaded = false;
    const load = () => {
      if (loaded) return;
      video.src = clip.src;
      video.preload = "auto";
      loaded = true;
    };

    // Fetch a screen early (also clips waiting off to the side in horizontal
    // tracks) so playback never starts cold...
    const fetcher = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && load(),
      { rootMargin: "100% 100%" },
    );
    // ...but only decode/play while actually on screen
    const player = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        load();
        if (!reduce) video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
    fetcher.observe(video);
    player.observe(video);
    return () => {
      fetcher.disconnect();
      player.disconnect();
    };
  }, [clip.src]);

  return (
    <video
      ref={ref}
      poster={clip.poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      className={className}
    />
  );
}
