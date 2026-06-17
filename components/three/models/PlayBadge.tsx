"use client";

import type { ThreeElements } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { AccentMaterial, FrostedMaterial } from "../primitives/GlassObject";
import { BRAND } from "../sceneStore";

/**
 * PlayBadge — a motion-graphics / video play badge.
 * Frosted glass disc framed by a thin orange ring on its +Z face, with a glossy
 * orange play triangle on the front so it reads instantly as a play/video button.
 */
export default function PlayBadge(props: ThreeElements["group"]) {
  // Right-pointing play triangle, built around the origin then nudged so its
  // visual centroid sits at (0,0) for a balanced look on the disc face.
  const playShape = useMemo(() => {
    const w = 0.42; // half-width (left edge to tip)
    const h = 0.46; // half-height (top to bottom)
    const shape = new THREE.Shape();
    shape.moveTo(-w, h);
    shape.lineTo(w, 0);
    shape.lineTo(-w, -h);
    shape.closePath();
    return shape;
  }, []);

  return (
    <group {...props}>
      {/* (a) Round disc — flat circular faces pointing along Z */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.14, 32]} />
        <FrostedMaterial />
      </mesh>

      {/* (b) Thin orange ring around the disc edge, on the +Z side */}
      <mesh position={[0, 0, 0.07]}>
        <torusGeometry args={[0.6, 0.04, 24, 96]} />
        <AccentMaterial />
      </mesh>

      {/* (c) Glossy orange play triangle on the front face.
          Offset -0.14 on X re-centers the triangle's centroid over the disc. */}
      <mesh position={[-0.14, 0, 0.07]}>
        <extrudeGeometry args={[playShape, { depth: 0.12, bevelEnabled: false }]} />
        <AccentMaterial color={BRAND.orange} />
      </mesh>
    </group>
  );
}
