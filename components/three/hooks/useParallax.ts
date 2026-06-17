"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { getPointer, sceneStore } from "../sceneStore";

/**
 * In-canvas hook. Returns a ref to attach to a <group>; each frame it gently
 * lerps the group's rotation toward the global pointer for a parallax tilt.
 * Honors prefers-reduced-motion (settles to neutral).
 */
export function useParallax(intensity = 0.18, lerp = 0.05) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    if (sceneStore.reducedMotion) {
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, 0, lerp);
      g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, 0, lerp);
      return;
    }
    const p = getPointer();
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, p.x * intensity, lerp);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -p.y * intensity, lerp);
  });

  return ref;
}
