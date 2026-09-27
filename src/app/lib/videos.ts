// Stock footage from Mixkit (https://mixkit.co), all under the Mixkit Stock
// Video *Free* License: commercial use allowed, no attribution required.
// Re-encoded for the web (H.264, no audio, faststart); posters are frame 0.
//
// showreel          ← 31590 "Digital network representation"
// datacenter-scrub  ← 23282 "Bluish data center hallway" (keyframe every 5 frames for scrubbing)
// soundwave         ← 19270 "Vibrant sound waves virtual"
// code              ← 10325 "Computer code running on a screen"
// earth             ← 29351 "Video of the earth slowly spinning on its axis"
// city              ← 42343 "Movement in a city at night in an aerial shot"
// particles         ← 18142 "Luminous particles on black background"

const clip = (name: string) => ({
  src: `/videos/${name}.mp4`,
  poster: `/videos/${name}.jpg`,
});

export const VIDEOS = {
  showreel: clip("showreel"),
  datacenter: clip("datacenter-scrub"),
  soundwave: clip("soundwave"),
  code: clip("code"),
  earth: clip("earth"),
  city: clip("city"),
  particles: clip("particles"),
} as const;

export type VideoClip = (typeof VIDEOS)[keyof typeof VIDEOS];
