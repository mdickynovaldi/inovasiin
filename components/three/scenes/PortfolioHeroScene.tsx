"use client";

import { Suspense, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, PresentationControls, RoundedBox, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { FrostedMaterial, AccentMaterial } from "../primitives/GlassObject";
import { useParallax } from "../hooks/useParallax";
import { getSectionProgress, sceneStore, SECTION, BRAND } from "../sceneStore";

const PANEL_W = 3.4;
const PANEL_H = 2.1;

/**
 * Textured thumbnail plane. Wrapped in its own component so drei's `useTexture`
 * (which suspends) can sit under a <Suspense fallback={null}> boundary without
 * stalling the rest of the scene.
 */
function Thumbnail({ src }: { src: string }) {
  const texture = useTexture(src, (tex) => {
    const t = tex as THREE.Texture;
    t.colorSpace = THREE.SRGBColorSpace;
  });
  return (
    <mesh position={[0, 0, 0.02]}>
      <planeGeometry args={[PANEL_W, PANEL_H]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

/**
 * Portfolio hero scene — a single glass-framed floating product shot. A
 * thumbnail (or an orange accent fallback) sits behind a slightly larger
 * frosted glass "cover" panel that gives the premium product-shot sheen, with a
 * thin navy rounded frame behind it all. Pointer parallax + drag rotation, and
 * a calm scroll parallax driven by getSectionProgress(SECTION.portfolioHero).
 */
export default function PortfolioHeroScene({
  thumbnail,
  accent = BRAND.orange,
}: {
  thumbnail: string | null;
  accent?: string;
}) {
  const parallax = useParallax(0.1, 0.05);
  const content = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const group = content.current;
    if (!group) return;

    const reduce = sceneStore.reducedMotion;
    const p = getSectionProgress(SECTION.portfolioHero);

    // Subtle scroll parallax: drift down + recede slightly as it scrolls away.
    const targetY = reduce ? 0 : -p * 1.6;
    const targetZ = reduce ? 0 : -p * 1.2;
    group.position.y = THREE.MathUtils.damp(group.position.y, targetY, 4, delta);
    group.position.z = THREE.MathUtils.damp(group.position.z, targetZ, 4, delta);
  });

  return (
    <group ref={parallax}>
      <PresentationControls
        global
        snap
        cursor
        damping={4}
        polar={[-0.25, 0.25]}
        azimuth={[-0.5, 0.5]}>
        <group ref={content}>
          <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.6}>
            {/* Thin navy rounded frame behind everything */}
            <RoundedBox
              args={[PANEL_W + 0.34, PANEL_H + 0.34, 0.12]}
              radius={0.12}
              smoothness={4}
              position={[0, 0, -0.16]}>
              <AccentMaterial color={BRAND.navy} roughness={0.35} clearcoat={0.6} />
            </RoundedBox>

            {/* Thumbnail image (or accent fallback when none is provided) */}
            {thumbnail ? (
              <Suspense fallback={null}>
                <Thumbnail src={thumbnail} />
              </Suspense>
            ) : (
              <mesh position={[0, 0, 0.02]}>
                <planeGeometry args={[PANEL_W, PANEL_H]} />
                <AccentMaterial color={accent} />
              </mesh>
            )}

            {/* Frosted glass cover panel just in front for product-shot sheen */}
            <RoundedBox
              args={[PANEL_W + 0.12, PANEL_H + 0.12, 0.14]}
              radius={0.08}
              smoothness={4}
              position={[0, 0, 0.16]}>
              <FrostedMaterial color={BRAND.white} roughness={0.08} />
            </RoundedBox>
          </Float>
        </group>
      </PresentationControls>
    </group>
  );
}
