"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { FrostedMaterial } from "../primitives/GlassObject";
import { useParallax } from "../hooks/useParallax";
import { getSectionProgress, sceneStore, SECTION, BRAND } from "../sceneStore";

/**
 * About scene — one calm signature object in negative space. A slowly morphing
 * orange blob (drei MeshDistortMaterial, glossy/clearcoat to read premium under
 * LightStudio) with a single thin frosted FrostedMaterial ring orbiting it.
 *
 * Follows the reference HeroScene shape: a parallax outer group, an ambient
 * Float, and one useFrame that reads state.clock + getSectionProgress(about),
 * with every animation gated behind sceneStore.reducedMotion and smoothed via
 * THREE.MathUtils.damp.
 */
export default function AboutScene() {
  const parallax = useParallax(0.1, 0.05);
  const content = useRef<THREE.Group>(null);
  const blob = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const reduce = sceneStore.reducedMotion;
    const k = reduce ? 0 : 1;
    const p = getSectionProgress(SECTION.about);

    // The hero blob rotates very slowly on its own axis.
    if (blob.current) blob.current.rotation.y = t * 0.12 * k;

    // Thin glass ring drifts around the blob on a tilted orbit.
    if (ring.current) {
      ring.current.rotation.z = t * 0.18 * k;
      ring.current.rotation.x = THREE.MathUtils.damp(
        ring.current.rotation.x,
        1.15 + Math.sin(t * 0.25 * k) * 0.18 * k,
        4,
        delta
      );
    }

    // Gentle scroll-driven tilt + slight rise of the whole signature object.
    if (content.current) {
      content.current.rotation.x = THREE.MathUtils.damp(
        content.current.rotation.x,
        p * 0.35,
        4,
        delta
      );
      content.current.position.y = THREE.MathUtils.damp(
        content.current.position.y,
        p * 0.6,
        4,
        delta
      );
    }
  });

  return (
    <group ref={parallax}>
      <group ref={content}>
        <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.7}>
          {/* Signature morphing orange blob — a smooth high-res sphere driven
              by MeshDistortMaterial, glossy + clearcoat to stay premium. */}
          <mesh ref={blob} position={[0, 0, 0]}>
            <sphereGeometry args={[1.25, 64, 64]} />
            <MeshDistortMaterial
              color={BRAND.orange}
              distort={0.25}
              speed={1.5}
              metalness={0.1}
              roughness={0.18}
              clearcoat={1}
              clearcoatRoughness={0.12}
              envMapIntensity={1}
            />
          </mesh>

          {/* Single thin frosted glass ring slowly orbiting the blob. */}
          <group ref={ring} rotation={[1.15, 0, 0]}>
            <mesh>
              <torusGeometry args={[2.1, 0.06, 24, 32]} />
              <FrostedMaterial color={BRAND.glassTint} />
            </mesh>
          </group>
        </Float>
      </group>
    </group>
  );
}
