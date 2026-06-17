/**
 * Module-level scene store.
 *
 * R3F's <Canvas> runs its own React reconciler, so React Context from the DOM
 * tree is NOT available to components rendered inside the Canvas. To share
 * live, high-frequency values (pointer position, per-section scroll progress,
 * quality tier) between the DOM and the 3D scenes we use a plain mutable
 * module singleton that in-canvas `useFrame` loops read directly (no React
 * re-render) and DOM code writes to.
 */

export type Quality = "high" | "low" | "off";

export const SECTION = {
  hero: "hero",
  services: "services",
  process: "process",
  showcase: "showcase",
  tech: "tech",
  about: "about",
  contact: "contact",
  portfolioGallery: "portfolio-gallery",
  portfolioHero: "portfolio-hero",
} as const;

export type SectionId = (typeof SECTION)[keyof typeof SECTION];

type SceneStore = {
  /** Normalized pointer, range roughly [-1, 1] on each axis, origin = center. */
  pointer: { x: number; y: number };
  /** Per-section scroll progress in [0, 1] (0 = entering, 1 = leaving). */
  sections: Record<string, number>;
  /** Per-card / per-element hover flags, keyed by an arbitrary id. */
  hover: Record<string, boolean>;
  quality: Quality;
  reducedMotion: boolean;
};

const store: SceneStore = {
  pointer: { x: 0, y: 0 },
  sections: {},
  hover: {},
  quality: "high",
  reducedMotion: false,
};

export const sceneStore = store;

export const setPointer = (x: number, y: number) => {
  store.pointer.x = x;
  store.pointer.y = y;
};
export const getPointer = () => store.pointer;

export const setSectionProgress = (id: string, v: number) => {
  store.sections[id] = v;
};
export const getSectionProgress = (id: string) => store.sections[id] ?? 0;

export const setHover = (id: string, v: boolean) => {
  store.hover[id] = v;
};
export const getHover = (id: string) => store.hover[id] ?? false;

export const setQuality = (q: Quality) => {
  store.quality = q;
};
export const setReducedMotion = (v: boolean) => {
  store.reducedMotion = v;
};

/** Brand palette shared by every scene so colors stay consistent. */
export const BRAND = {
  orange: "#f97316",
  orangeLight: "#fb923c",
  orangeDark: "#ea580c",
  navy: "#1e3a5f",
  navyLight: "#2d4a6f",
  navyDark: "#0f2847",
  white: "#ffffff",
  glassTint: "#fff7ed",
} as const;
