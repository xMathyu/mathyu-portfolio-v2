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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!loaded) {
            video.src = clip.src;
            loaded = true;
          }
          if (!reduce) video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
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
