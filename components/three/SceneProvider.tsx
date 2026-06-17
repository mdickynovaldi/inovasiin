"use client";

/**
 * SceneProvider — the single entry point for the hybrid 3D layer.
 *
 * Wrap a public page's content in <SceneProvider>. It:
 *  - detects a quality tier ("high" | "low" | "off") and prefers-reduced-motion,
 *  - tracks the global pointer for parallax,
 *  - mounts ONE fixed, transparent <Canvas> behind the DOM (skipped entirely on
 *    "off", e.g. mobile / no-WebGL — sections then render CSS fallbacks),
 *  - exposes quality/reducedMotion to DOM components via React context, while
 *    live values are mirrored into the module-level sceneStore for in-canvas use.
 */

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  setPointer,
  setQuality,
  setReducedMotion,
  type Quality,
} from "./sceneStore";
import SceneCanvasClient from "./SceneCanvasClient";

type SceneContextValue = {
  quality: Quality;
  reducedMotion: boolean;
  ready: boolean;
};

const SceneContext = createContext<SceneContextValue>({
  quality: "off",
  reducedMotion: false,
  ready: false,
});

export const useScene = () => useContext(SceneContext);

function detectQuality(): Quality {
  if (typeof window === "undefined") return "off";
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    if (!gl) return "off";
  } catch {
    return "off";
  }
  const w = window.innerWidth;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  // Mobile / touch-first small screens: skip the canvas, use CSS fallbacks.
  if (w < 768 || (coarse && w < 1024)) return "off";
  const nav = navigator as Navigator & { deviceMemory?: number };
  const mem = nav.deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  if (mem <= 4 || cores <= 4) return "low";
  return "high";
}

export default function SceneProvider({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [quality, setQ] = useState<Quality>("off");
  const [reducedMotion, setRM] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const rmQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const initialRM = rmQuery.matches;
    const q = detectQuality();
    setRM(initialRM);
    setReducedMotion(initialRM);
    setQ(q);
    setQuality(q);
    setReady(true);

    const onPointer = (e: PointerEvent) => {
      setPointer(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1)
      );
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const onRM = () => {
      setRM(rmQuery.matches);
      setReducedMotion(rmQuery.matches);
    };
    rmQuery.addEventListener?.("change", onRM);

    let resizeTimer: number | undefined;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const nq = detectQuality();
        setQ(nq);
        setQuality(nq);
      }, 250);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      rmQuery.removeEventListener?.("change", onRM);
      window.clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <SceneContext.Provider value={{ quality, reducedMotion, ready }}>
      <div ref={rootRef} className="scene-root">
        {ready && quality !== "off" && (
          <SceneCanvasClient eventSource={rootRef} quality={quality} />
        )}
        {children}
      </div>
    </SceneContext.Provider>
  );
}
