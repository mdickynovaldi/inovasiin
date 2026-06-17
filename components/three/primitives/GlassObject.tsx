"use client";

import { MeshTransmissionMaterial } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import { type ComponentProps, useMemo } from "react";
import * as THREE from "three";
import { BRAND } from "../sceneStore";

type GlassProps = Partial<ComponentProps<typeof MeshTransmissionMaterial>> & {
  /** Light color the glass refracts. On a transparent canvas the scene buffer
   *  behind the glass is empty (black), so a light background keeps glass bright. */
  bg?: string;
};

/**
 * Real refractive glass (premium look). PERF: each instance does an extra
 * render pass per frame, so this is the EXPENSIVE option — reserve it for a
 * single focal hero piece. Everything else should use <FrostedMaterial/>.
 * Tuned cheap: low resolution + 2 samples, no distortion passes.
 */
export function GlassMaterial({
  color = BRAND.glassTint,
  thickness = 0.9,
  roughness = 0.15,
  bg = "#eef2f8",
  ...props
}: GlassProps) {
  const background = useMemo(() => new THREE.Color(bg), [bg]);
  return (
    <MeshTransmissionMaterial
      background={background}
      color={color}
      thickness={thickness}
      roughness={roughness}
      transmission={1}
      ior={1.3}
      chromaticAberration={0.02}
      resolution={128}
      samples={2}
      {...props}
    />
  );
}

type PhysicalProps = ThreeElements["meshPhysicalMaterial"];

/**
 * CHEAP frosted-glass look — a translucent PBR material with NO transmission
 * render pass (transmission stays 0), so it costs the same as any solid mesh.
 * Use this for almost all "glass" in the scenes; visually close to real glass
 * on the light theme but a fraction of the cost.
 */
export function FrostedMaterial({
  color = BRAND.glassTint,
  opacity = 0.62,
  roughness = 0.22,
  ...props
}: PhysicalProps) {
  return (
    <meshPhysicalMaterial
      color={color}
      transparent
      opacity={opacity}
      roughness={roughness}
      metalness={0}
      clearcoat={1}
      clearcoatRoughness={0.12}
      ior={1.3}
      reflectivity={0.5}
      envMapIntensity={1.2}
      {...props}
    />
  );
}

/**
 * Glossy solid accent (e.g. the brand-orange piece). Clearcoat + low roughness
 * reads as polished plastic/ceramic under the studio lights.
 */
export function AccentMaterial({
  color = BRAND.orange,
  ...props
}: PhysicalProps) {
  return (
    <meshPhysicalMaterial
      color={color}
      metalness={0.1}
      roughness={0.15}
      clearcoat={1}
      clearcoatRoughness={0.1}
      envMapIntensity={1}
      {...props}
    />
  );
}
