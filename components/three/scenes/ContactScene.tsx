"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { FrostedMaterial, AccentMaterial } from "../primitives/GlassObject";
import { useParallax } from "../hooks/useParallax";
import { getSectionProgress, sceneStore, SECTION, BRAND } from "../sceneStore";

/**
 * Contact scene — a friendly orange "beacon": a softly pulsing orange accent
 * sphere wrapped in a thin frosted-glass ring, with one small floating glass
 * shard alongside. Light and inviting, sized to sit calmly in the section
 * background near the form (this lives below the fold, so it's kept minimal).
 *
 * Follows the HeroScene shape: a parallax outer group, ambient Float, and a
 * single useFrame reading state.clock + getSectionProgress(), with every bit
 * of motion gated behind sceneStore.reducedMotion (settles to rest when on).
 */
export default function ContactScene() {
  const parallax = useParallax(0.1, 0.05);
  const content = useRef<THREE.Group>(null);
  const beacon = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const shard = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const reduce = sceneStore.reducedMotion;
    const k = reduce ? 0 : 1;

    // Soft welcoming pulse on the orange beacon.
    if (beacon.current) {
      const pulse = 1 + Math.sin(t * 1.6) * 0.06 * k;
      beacon.current.scale.setScalar(
        THREE.MathUtils.damp(beacon.current.scale.x, pulse, 6, delta)
      );
    }

    // Glass ring slowly turns so the frosted edge catches the light.
    if (ring.current) ring.current.rotation.z = t * 0.18 * k;

    // Tiny shard tumbles gently.
    if (shard.current) {
      shard.current.rotation.x = t * 0.25 * k;
      shard.current.rotation.y = t * 0.2 * k;
    }

    // Drift up + settle as the contact section comes into view.
    if (content.current) {
      const p = getSectionProgress(SECTION.contact);
      content.current.position.y = THREE.MathUtils.damp(
        content.current.position.y,
        (1 - p) * 0.8,
        4,
        delta
      );
    }
  });

  return (
    <group ref={parallax}>
      <group ref={content}>
        <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.7}>
          {/* Pulsing orange beacon at the heart */}
          <mesh ref={beacon} position={[0, 0, 0]}>
            <sphereGeometry args={[0.7, 24, 24]} />
            <AccentMaterial color={BRAND.orange} />
          </mesh>

          {/* Thin frosted glass ring wrapping the beacon */}
          <mesh ref={ring} position={[0, 0, 0]} rotation={[Math.PI / 2.6, 0, 0]}>
            <torusGeometry args={[1.15, 0.07, 24, 32]} />
            <FrostedMaterial color={BRAND.glassTint} />
          </mesh>

          {/* Small floating glass shard */}
          <mesh ref={shard} position={[1.9, 1.1, -0.4]} scale={0.5}>
            <octahedronGeometry args={[0.7, 0]} />
            <FrostedMaterial color="#ffffff" />
          </mesh>
        </Float>
      </group>
    </group>
  );
}
