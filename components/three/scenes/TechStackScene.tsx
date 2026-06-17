"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Instances, Instance } from "@react-three/drei";
import * as THREE from "three";
import { FrostedMaterial } from "../primitives/GlassObject";
import { useParallax } from "../hooks/useParallax";
import { getSectionProgress, sceneStore, SECTION, BRAND } from "../sceneStore";

/**
 * TechStack scene — a slowly rotating, deterministic cloud of ~48 small rounded
 * glass chips sitting BEHIND the 2x2 category cards as ambient depth. Mostly
 * clear/white glass with a few navy + orange tints for on-brand pops. The whole
 * cloud auto-rotates calmly, parallaxes to the pointer, and drifts subtly with
 * scroll. All motion is gated behind sceneStore.reducedMotion.
 *
 * Follows the HeroScene shape: a parallax outer group + a single useFrame that
 * reads state.clock and getSectionProgress(SECTION.tech). Positions are
 * precomputed once via a seeded sine helper — never runtime randomness.
 */

const CHIP_COUNT = 28;
const CHIP_SIZE = 0.4;

// Deterministic pseudo-random in [0,1) from an integer seed (sine hash, no RNG).
const seeded = (n: number) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};

type Chip = {
  position: [number, number, number];
  scale: number;
  color: string;
  rotSpeed: number;
  phase: number;
};

// Tints: mostly clear/white, a few navy, a couple orange — kept on-brand & calm.
const tintFor = (i: number): string => {
  if (i % 11 === 0) return BRAND.orange; // ~4 orange pops
  if (i % 5 === 0) return BRAND.navy; // ~9 navy
  return BRAND.white; // remainder clear/white
};

export default function TechStackScene() {
  const parallax = useParallax(0.1, 0.05);
  const cloud = useRef<THREE.Group>(null);
  const spinner = useRef<THREE.Group>(null);

  const chips = useMemo<Chip[]>(() => {
    const out: Chip[] = [];
    for (let i = 0; i < CHIP_COUNT; i++) {
      // Spread chips across a flattened spherical-ish volume around origin,
      // pushed back in Z so they sit behind the foreground cards.
      const a = seeded(i * 2 + 1) * Math.PI * 2;
      const b = seeded(i * 3 + 7) * Math.PI - Math.PI / 2;
      const r = 2.6 + seeded(i * 5 + 13) * 2.6;
      const x = Math.cos(a) * Math.cos(b) * r;
      const y = Math.sin(b) * r * 0.7;
      const z = Math.sin(a) * Math.cos(b) * r * 0.55 - 1.5;
      out.push({
        position: [x, y, z],
        scale: 0.55 + seeded(i * 7 + 23) * 0.7,
        color: tintFor(i),
        rotSpeed: 0.1 + seeded(i * 11 + 31) * 0.25,
        phase: seeded(i * 13 + 41) * Math.PI * 2,
      });
    }
    return out;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const reduce = sceneStore.reducedMotion;
    const k = reduce ? 0 : 1;
    const p = getSectionProgress(SECTION.tech);

    // Slow auto-rotation of the whole cloud (settles to rest when reduced).
    if (spinner.current) {
      spinner.current.rotation.y = THREE.MathUtils.damp(
        spinner.current.rotation.y,
        t * 0.05 * k,
        4,
        delta
      );
      spinner.current.rotation.x = THREE.MathUtils.damp(
        spinner.current.rotation.x,
        Math.sin(t * 0.1) * 0.08 * k,
        4,
        delta
      );
    }

    // Subtle scroll influence: the cloud drifts slightly and expands as the
    // section passes, keeping it unobtrusive behind the cards.
    if (cloud.current) {
      cloud.current.position.y = THREE.MathUtils.damp(
        cloud.current.position.y,
        p * 1.2,
        4,
        delta
      );
      const s = 1 + p * 0.12;
      cloud.current.scale.setScalar(
        THREE.MathUtils.damp(cloud.current.scale.x, s, 4, delta)
      );
    }
  });

  return (
    <group ref={parallax}>
      <group ref={cloud}>
        <group ref={spinner}>
          <Instances limit={CHIP_COUNT} range={CHIP_COUNT}>
            {/* Single rounded-ish box geometry shared by every chip. */}
            <boxGeometry args={[CHIP_SIZE, CHIP_SIZE, CHIP_SIZE]} />
            <FrostedMaterial roughness={0.16} />
            {chips.map((chip, i) => (
              <FloatingChip key={i} chip={chip} />
            ))}
          </Instances>
        </group>
      </group>
    </group>
  );
}

/**
 * One instanced chip. Per-instance color + a gentle deterministic bob/spin so
 * the cloud feels alive without any runtime randomness. Motion gated by reduced.
 */
function FloatingChip({ chip }: { chip: Chip }) {
  const ref = useRef<THREE.Object3D>(null);
  const baseY = chip.position[1];

  useFrame((state) => {
    const node = ref.current;
    if (!node) return;
    const reduce = sceneStore.reducedMotion;
    if (reduce) {
      node.position.y = baseY;
      node.rotation.set(0, 0, 0);
      return;
    }
    const t = state.clock.elapsedTime;
    node.position.y = baseY + Math.sin(t * 0.6 + chip.phase) * 0.12;
    node.rotation.x = t * chip.rotSpeed;
    node.rotation.y = t * chip.rotSpeed * 0.8 + chip.phase;
  });

  return (
    <Instance
      ref={ref}
      position={chip.position}
      scale={chip.scale}
      color={chip.color}
    />
  );
}
