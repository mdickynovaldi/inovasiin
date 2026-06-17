"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { FrostedMaterial } from "../primitives/GlassObject";
import { useParallax } from "../hooks/useParallax";
import { getSectionProgress, sceneStore, SECTION, BRAND } from "../sceneStore";

/**
 * Showcase accent scene — a calm, purely decorative backdrop of three large,
 * soft frosted-glass shards drifting slowly behind the project cards. It adds
 * depth and a subtle brand glow without competing with the card content, so it
 * stays very low-key (large, soft, pushed back in Z, gentle parallax + scroll
 * drift). Lights + contact shadow come from SectionView's LightStudio.
 *
 * Follows the HeroScene reference shape: a parallax outer group, ambient Float,
 * a single useFrame reading getSectionProgress(), all motion gated behind
 * sceneStore.reducedMotion, deterministic (non-random) layout.
 */

// Deterministic layout for the 3 frosted panels (no runtime randomness).
const PANELS: {
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number, number];
  color: string;
  opacity?: number;
  scale: number;
}[] = [
  {
    position: [-3.4, 0.8, -2.2],
    rotation: [0.1, 0.5, -0.18],
    size: [2.6, 3.6, 0.18],
    color: BRAND.glassTint,
    scale: 1,
  },
  {
    position: [3.6, -0.6, -3.2],
    rotation: [-0.08, -0.45, 0.22],
    size: [3.0, 2.4, 0.16],
    color: "#ffffff",
    scale: 1,
  },
  {
    position: [0.4, 1.6, -4.2],
    rotation: [0.14, 0.18, 0.08],
    size: [2.2, 2.8, 0.16],
    color: BRAND.navy,
    opacity: 0.72,
    scale: 0.95,
  },
];

export default function ShowcaseAccentScene() {
  const parallax = useParallax(0.06, 0.04);
  const content = useRef<THREE.Group>(null);
  const drift = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const reduce = sceneStore.reducedMotion;
    const k = reduce ? 0 : 1;

    // Slow, sine-based ambient drift on top of Float — very gentle.
    if (drift.current) {
      drift.current.rotation.z = THREE.MathUtils.damp(
        drift.current.rotation.z,
        Math.sin(t * 0.12) * 0.04 * k,
        3,
        delta
      );
      drift.current.position.x = THREE.MathUtils.damp(
        drift.current.position.x,
        Math.sin(t * 0.08) * 0.25 * k,
        3,
        delta
      );
    }

    // Subtle scroll parallax: the backdrop sinks slightly and recedes as the
    // showcase section scrolls past, keeping cards in front and legible.
    if (content.current) {
      const p = getSectionProgress(SECTION.showcase);
      content.current.position.y = THREE.MathUtils.damp(
        content.current.position.y,
        p * 1.6,
        4,
        delta
      );
      content.current.position.z = THREE.MathUtils.damp(
        content.current.position.z,
        -p * 1.2,
        4,
        delta
      );
    }
  });

  return (
    <group ref={parallax}>
      <group ref={content}>
        <group ref={drift}>
          <Float speed={0.8} rotationIntensity={0.18} floatIntensity={0.5}>
            {PANELS.map((panel, i) => (
              <RoundedBox
                key={i}
                args={panel.size}
                radius={0.12}
                smoothness={4}
                position={panel.position}
                rotation={panel.rotation}
                scale={panel.scale}>
                <FrostedMaterial
                  color={panel.color}
                  opacity={panel.opacity}
                  roughness={0.2}
                />
              </RoundedBox>
            ))}
          </Float>
        </group>
      </group>
    </group>
  );
}
