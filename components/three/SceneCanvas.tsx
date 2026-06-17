"use client";

import { Canvas } from "@react-three/fiber";
import {
  View,
  Preload,
  AdaptiveDpr,
  AdaptiveEvents,
  PerformanceMonitor,
} from "@react-three/drei";
import { useState, type RefObject } from "react";
import * as THREE from "three";
import type { Quality } from "./sceneStore";

/**
 * The single shared <Canvas>. Sits fixed and transparent over the page with
 * pointer-events disabled (R3F still receives pointer events through
 * `eventSource`). Every section's <SectionView> tunnels its scene into the
 * <View.Port /> rendered here, scissored to that section's on-screen rect.
 *
 * z-index 5 keeps the 3D above section background decorations (z 0) but below
 * foreground content (z 10+), so text stays readable on top of the 3D.
 */
export default function SceneCanvas({
  eventSource,
  quality,
}: {
  eventSource: RefObject<HTMLDivElement | null>;
  quality: Quality;
}) {
  // Cap device-pixel-ratio: fewer pixels = big GPU saving on retina. High tier
  // 1.5 (vs native 2+), low tier 1.0.
  const baseDpr = quality === "high" ? 1.5 : 1.0;
  const [dpr, setDpr] = useState<number>(baseDpr);

  return (
    <Canvas
      eventSource={eventSource as RefObject<HTMLElement>}
      eventPrefix="client"
      dpr={dpr}
      frameloop="always"
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 5,
      }}
      className="scene-canvas">
      <PerformanceMonitor
        onDecline={() => setDpr((d) => Math.max(0.8, d - 0.4))}
        onIncline={() => setDpr(baseDpr)}
      />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <View.Port />
      <Preload all />
    </Canvas>
  );
}
