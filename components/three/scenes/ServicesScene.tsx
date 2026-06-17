"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { FrostedMaterial, AccentMaterial } from "../primitives/GlassObject";
import { useParallax } from "../hooks/useParallax";
import { getSectionProgress, sceneStore, SECTION, BRAND } from "../sceneStore";

/**
 * Services scene — an ambient cluster of 8 small glass "service" glyphs floating
 * in a loose arc, each subtly evoking one of the studio's services:
 *   cube (3D modelling), sphere/globe (web & app), stacked slabs (2D / print /
 *   layers), play-cone (motion graphics), torus ring (VR), phone-like slab (AR),
 *   plus an octahedron and a small accent sphere.
 *
 * Mostly frosted FrostedMaterial with one or two orange AccentMaterial pops and a
 * navy-tinted glass piece. Mirrors HeroScene's shape: a parallax outer group,
 * ambient Float, slow per-glyph rotation, and a single useFrame that reads
 * getSectionProgress(SECTION.services) to drift/spread the cluster as it scrolls.
 * Sits behind/around the 2-column services card grid as a light accent.
 */
export default function ServicesScene() {
  const parallax = useParallax(0.1, 0.05);
  const content = useRef<THREE.Group>(null);

  // Each glyph rotates on its own; refs collected so the single useFrame drives all.
  const cube = useRef<THREE.Mesh>(null);
  const globe = useRef<THREE.Mesh>(null);
  const slabs = useRef<THREE.Group>(null);
  const cone = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const phone = useRef<THREE.Mesh>(null);
  const octa = useRef<THREE.Mesh>(null);
  const dot = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const reduce = sceneStore.reducedMotion;
    const k = reduce ? 0 : 1;

    // Slow, individual rotation per glyph (gated behind reduced motion).
    if (cube.current) {
      cube.current.rotation.x = t * 0.18 * k;
      cube.current.rotation.y = t * 0.12 * k;
    }
    if (globe.current) globe.current.rotation.y = t * 0.16 * k;
    if (slabs.current) slabs.current.rotation.y = t * 0.1 * k;
    if (cone.current) cone.current.rotation.z = -t * 0.14 * k;
    if (ring.current) {
      ring.current.rotation.x = t * 0.22 * k;
      ring.current.rotation.y = t * 0.15 * k;
    }
    if (phone.current) phone.current.rotation.y = -t * 0.12 * k;
    if (octa.current) octa.current.rotation.y = -t * 0.2 * k;
    if (dot.current) dot.current.rotation.y = t * 0.25 * k;

    // Scroll-driven drift + spread: the cluster gently opens up and rises as the
    // services section moves through the viewport.
    if (content.current) {
      const p = getSectionProgress(SECTION.services);
      content.current.position.y = THREE.MathUtils.damp(
        content.current.position.y,
        p * 1.4,
        4,
        delta
      );
      const spread = 1 + p * 0.18;
      content.current.scale.setScalar(
        THREE.MathUtils.damp(content.current.scale.x, spread, 4, delta)
      );
    }
  });

  return (
    <group ref={parallax}>
      <group ref={content}>
        <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.7}>
          {/* 3D modelling — frosted glass cube */}
          <RoundedBox
            ref={cube}
            args={[0.9, 0.9, 0.9]}
            radius={0.12}
            smoothness={4}
            position={[-2.7, 1.5, -0.4]}
            scale={0.85}>
            <FrostedMaterial color={BRAND.glassTint} />
          </RoundedBox>

          {/* Web & app — clear glass globe */}
          <mesh ref={globe} position={[-1.4, -1.4, 0.3]} scale={0.7}>
            <sphereGeometry args={[0.85, 24, 24]} />
            <FrostedMaterial color="#ffffff" />
          </mesh>

          {/* 2D design / print / layers — thin stacked glass slabs */}
          <group ref={slabs} position={[0.2, 1.7, -0.6]} scale={0.85}>
            <mesh position={[0, 0.22, 0]}>
              <boxGeometry args={[1.1, 0.1, 0.8]} />
              <FrostedMaterial color={BRAND.glassTint} />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.1, 0.1, 0.8]} />
              <FrostedMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, -0.22, 0]}>
              <boxGeometry args={[1.1, 0.1, 0.8]} />
              <FrostedMaterial color={BRAND.glassTint} />
            </mesh>
          </group>

          {/* Motion graphics — glossy orange play-cone accent */}
          <mesh
            ref={cone}
            position={[2.6, 1.2, -0.3]}
            rotation={[0, 0, -Math.PI / 2]}
            scale={0.8}>
            <coneGeometry args={[0.55, 1, 3]} />
            <AccentMaterial color={BRAND.orange} />
          </mesh>

          {/* VR — frosted glass torus ring */}
          <mesh ref={ring} position={[1.6, -1.5, 0.4]} scale={0.8}>
            <torusGeometry args={[0.55, 0.18, 24, 32]} />
            <FrostedMaterial color={BRAND.glassTint} />
          </mesh>

          {/* AR — rounded phone-like navy glass slab */}
          <RoundedBox
            ref={phone}
            args={[0.55, 1, 0.12]}
            radius={0.08}
            smoothness={4}
            position={[3, -0.6, 0.2]}
            scale={0.85}>
            <FrostedMaterial color={BRAND.navy} opacity={0.72} />
          </RoundedBox>

          {/* Branding / strategy — navy-tint glass octahedron */}
          <mesh ref={octa} position={[-3.2, -0.5, 0.5]} scale={0.6}>
            <octahedronGeometry args={[0.85, 0]} />
            <FrostedMaterial color={BRAND.navyLight} opacity={0.72} />
          </mesh>

          {/* Small glossy orange accent dot to balance the cluster */}
          <mesh ref={dot} position={[0.4, -0.4, 0.7]} scale={0.4}>
            <sphereGeometry args={[0.6, 40, 40]} />
            <AccentMaterial color={BRAND.orangeLight} />
          </mesh>
        </Float>
      </group>
    </group>
  );
}
