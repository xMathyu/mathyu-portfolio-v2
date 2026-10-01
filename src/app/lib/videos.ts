// Stock footage from Mixkit (https://mixkit.co). Every clip was checked on its
// own page: `copyrightNotice` is "Free" and the download isn't marked
// "Personal Use only" (the JSON-LD `license` field reads "Free" even on
// Restricted clips, so it can't be trusted on its own).
// Mixkit Free License: commercial use allowed, no attribution required.
// Re-encoded for the web (H.264, no audio, faststart, BT.709); loops end on
// their first frame via a crossfade, *-scrub clips have a keyframe every 5 frames.
//
// stock/showreel        ← 3909   "Person in the dark with a colored lights background"
// stock/warp-scrub      ← 3910   "Person in the dark observing a lights image"
// stock/sinfonia-scrub  ← 42038  "Driving through a night city"
// stock/manifesto       ← 4407   "White particles moving on black background"
// stock/stack-frontend  ← 1728   "Software developer working on code screen close up"
// stock/stack-backend   ← 41648  "Programming codes close up on a screen"
// stock/stack-cloud     ← 40102  "Panorama from the window of an airplane at dusk"
// stock/stack-ai        ← 101439 "Purple light forming glowing shapes"
// stock/exp-entel       ← 317    "Businessman taking a phone call"
// stock/exp-309         ← 4087   "New York City view at night"
// stock/exp-encora      ← 18264  "Man making a transaction on his smartphone with his card"
// stock/exp-serverli    ← 2371   "DSLR camera lens shutter"
// stock/exp-mdp         ← 50115  "Student receiving instructions and help from his professor"
// stock/stat-calls      ← 39808  "Phone call at night"
// stock/stat-years      ← 1140   "Microchip close-up"
// stock/stat-remote     ← 41161  "Austin Capitol at night"
// stock/contact         ← 99832  "Abstract multicolored bokeh city lights over a black background"
// city                  ← 42343  "Movement in a city at night in an aerial shot"

export interface VideoClip {
  src: string;
  poster: string;
}

const clip = (name: string): VideoClip => ({
  src: `/videos/${name}.mp4`,
  poster: `/videos/${name}.jpg`,
});
const stock = (name: string) => clip(`stock/${name}`);

export const VIDEOS = {
  showreel: stock("showreel"),
  warp: stock("warp-scrub"),
  sinfonia: stock("sinfonia-scrub"),
  manifesto: stock("manifesto"),
  contact: stock("contact"),
  stack: {
    frontend: stock("stack-frontend"),
    backend: stock("stack-backend"),
    cloud: stock("stack-cloud"),
    ai: stock("stack-ai"),
  },
  experience: {
    entel: stock("exp-entel"),
    t309: stock("exp-309"),
    encora: stock("exp-encora"),
    serverli: stock("exp-serverli"),
    mdp: stock("exp-mdp"),
  },
  stats: {
    calls: stock("stat-calls"),
    years: stock("stat-years"),
    remote: stock("stat-remote"),
    companies: clip("city"),
  },
} as const;

// Scroll-through screen recordings of the live project sites (headless Chrome,
// deterministic 30 fps capture). Monyx is login-only, so it keeps its screenshot.
const recording = (name: string): VideoClip => ({
  src: `/videos/projects/${name}.mp4`,
  poster: `/videos/projects/${name}.jpg`,
});

export const PROJECT_VIDEOS: Partial<Record<string, VideoClip>> = {
  twenty: recording("twenty"),
  selvatici: recording("selvatici"),
  famengchuen: recording("famengchuen"),
  parco: recording("parco"),
};

/**
 * Shots for the page-wide film stage (FilmStage). Sections opt in with
 * `data-scene="<key>"`; the stage crossfades between shots as you scroll.
 * `level` is how bright the footage sits under the copy.
 */
export interface Scene {
  clip: VideoClip;
  level: number;
}

export const SCENES = {
  particles: { clip: VIDEOS.manifesto, level: 0.55 },
  city: { clip: VIDEOS.stats.companies, level: 0.45 },
  calls: { clip: VIDEOS.stats.calls, level: 0.5 },
  code: { clip: VIDEOS.stack.backend, level: 0.5 },
  "exp-entel": { clip: VIDEOS.experience.entel, level: 0.38 },
  "exp-t309": { clip: VIDEOS.experience.t309, level: 0.4 },
  "exp-encora": { clip: VIDEOS.experience.encora, level: 0.4 },
  "exp-serverli": { clip: VIDEOS.experience.serverli, level: 0.4 },
  "exp-mdp": { clip: VIDEOS.experience.mdp, level: 0.38 },
  ai: { clip: VIDEOS.stack.ai, level: 0.55 },
  cloud: { clip: VIDEOS.stack.cloud, level: 0.6 },
  austin: { clip: VIDEOS.stats.remote, level: 0.45 },
  bokeh: { clip: VIDEOS.contact, level: 0.5 },
} as const satisfies Record<string, Scene>;

/** `none` fades the stage to black (for sections that bring their own backdrop). */
export type SceneKey = keyof typeof SCENES | "none";
