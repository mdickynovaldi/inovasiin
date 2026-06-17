"use client";

import dynamic from "next/dynamic";
import type { RefObject } from "react";
import type { Quality } from "./sceneStore";

// Three.js touches `window` at import time, so the Canvas must be client-only.
const SceneCanvas = dynamic(() => import("./SceneCanvas"), { ssr: false });

export default function SceneCanvasClient(props: {
  eventSource: RefObject<HTMLDivElement | null>;
  quality: Quality;
}) {
  return <SceneCanvas {...props} />;
}
