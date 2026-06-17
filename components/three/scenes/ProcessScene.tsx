"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Line } from "@react-three/drei";
import * as THREE from "three";
import { FrostedMaterial, AccentMaterial } from "../primitives/GlassObject";
import { useParallax } from "../hooks/useParallax";
import { getSectionProgress, sceneStore, SECTION, BRAND } from "../sceneStore";

/**
 * Process scene — five glass nodes laid out left-to-right along a gentle
 * horizontal arc, threaded by a thin connecting line, echoing the 5-step DOM
 * row. A travelling highlight (driven by getSectionProgress(SECTION.process))
 * sweeps node -> node 1..5; the active node scales up and switches from frosted
 * glass to a glossy orange accent. Nodes idle-Float + parallax-tilt.
 *
 * Follows the HeroScene reference shape: parallax outer group, a single
 * useFrame reading state.clock + section progress, all motion gated behind
 * sceneStore.reducedMotion and damped for smooth scroll response.
 */

const NODE_COUNT = 5;

// Deterministic left-to-right layout along a gentle horizontal arc.
// No runtime randomness — positions are computed from a fixed formula.
const NODES = Array.from({ length: NODE_COUNT }, (_, i) => {
  const t = i / (NODE_COUNT - 1); // 0..1
  const x = (t - 0.5) * 7.2; // span ~[-3.6, 3.6]
  const y = Math.sin(t * Math.PI) * 0.55 - 0.1; // gentle hump
  const z = Math.cos(t * Math.PI) * 0.35; // subtle depth weave
  return new THREE.Vector3(x, y, z);
});

// Smooth connecting path sampled between the nodes for the drei <Line>.
const PATH_POINTS = (() => {
  const curve = new THREE.CatmullRomCurve3(NODES, false, "catmullrom", 0.4);
  return curve.getPoints(80);
})();

export default function ProcessScene() {
  const parallax = useParallax(0.1, 0.05);
  const content = useRef<THREE.Group>(null);
  const nodeRefs = useRef<(THREE.Group | null)[]>([]);
  const accentRefs = useRef<(THREE.Mesh | null)[]>([]);

  // Per-node animated "active" amount (0..1), smoothed each frame. Held in a
  // ref (mutable container) so the useFrame loop can write to it in place.
  const activeRef = useRef<Float32Array>(new Float32Array(NODE_COUNT));

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const reduce = sceneStore.reducedMotion;

    // Travelling highlight position across nodes 1..5.
    // Reduced motion: pin to the middle node (static).
    const p = reduce ? 0.5 : getSectionProgress(SECTION.process);
    const head = p * (NODE_COUNT - 1); // 0..(NODE_COUNT-1)
    const active = activeRef.current;

    for (let i = 0; i < NODE_COUNT; i++) {
      // Triangular falloff: 1 at the head, fading within ~0.85 of a step.
      const dist = Math.abs(i - head);
      const target = Math.max(0, 1 - dist / 0.85);
      active[i] = THREE.MathUtils.damp(active[i], target, reduce ? 12 : 8, delta);

      const node = nodeRefs.current[i];
      if (node) {
        const s = 1 + active[i] * 0.45;
        node.scale.setScalar(THREE.MathUtils.damp(node.scale.x, s, 10, delta));
        // Gentle idle spin, gated behind reduced motion.
        node.rotation.y = reduce ? 0 : t * 0.2 + i;
      }

      // Crossfade the orange accent overlay in/out as the node activates.
      const accent = accentRefs.current[i];
      if (accent) {
        const mat = accent.material as THREE.MeshPhysicalMaterial;
        mat.opacity = active[i];
        accent.visible = active[i] > 0.01;
        const ag = 1 + active[i] * 0.1;
        accent.scale.setScalar(ag);
      }
    }

    // Sink + fade the whole row slightly as the section scrolls past.
    if (content.current) {
      const sp = getSectionProgress(SECTION.process);
      content.current.position.y = THREE.MathUtils.damp(
        content.current.position.y,
        -sp * 1.2,
        4,
        delta
      );
    }
  });

  return (
    <group ref={parallax}>
      <group ref={content}>
        {/* Thin connecting line threading the nodes (navy, soft). */}
        <Line
          points={PATH_POINTS}
          color={BRAND.navy}
          lineWidth={1.5}
          transparent
          opacity={0.35}
          dashed={false}
        />

        {NODES.map((pos, i) => {
          // Alternate the idle tint subtly for a calm, on-brand rhythm.
          const tint = i % 2 === 0 ? BRAND.glassTint : BRAND.white;
          return (
            <group key={i} position={[pos.x, pos.y, pos.z]}>
              <Float
                speed={1.1}
                rotationIntensity={0.25}
                floatIntensity={0.5}
                floatingRange={[-0.08, 0.08]}>
                <group ref={(el) => { nodeRefs.current[i] = el; }}>
                  {/* Frosted glass node (idle state). */}
                  <mesh>
                    <icosahedronGeometry args={[0.5, 0]} />
                    <FrostedMaterial color={tint} />
                  </mesh>

                  {/* Glossy orange accent — fades in when this node is active. */}
                  <mesh
                    ref={(el) => { accentRefs.current[i] = el; }}
                    visible={false}>
                    <icosahedronGeometry args={[0.5, 0]} />
                    <AccentMaterial
                      color={BRAND.orange}
                      transparent
                      opacity={0}
                      emissive={new THREE.Color(BRAND.orangeDark)}
                      emissiveIntensity={0.35}
                    />
                  </mesh>
                </group>
              </Float>
            </group>
          );
        })}
      </group>
    </group>
  );
}
