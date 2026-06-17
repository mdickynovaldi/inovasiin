"use client";

import { RoundedBox } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import { AccentMaterial } from "../primitives/GlassObject";
import { BRAND } from "../sceneStore";

/**
 * Smartphone — a clean modern phone running an AR app, suggesting the studio's
 * AR / app work. Navy frame in portrait, a dark glossy screen, and a few flat
 * UI accents (white nav bar + a floating orange AR cube) hovering above it.
 */
export default function Smartphone(props: ThreeElements["group"]) {
  return (
    <group {...props}>
      {/* (a) Body / frame — portrait, navy physical shell */}
      <RoundedBox args={[0.64, 1.28, 0.07]} radius={0.1} smoothness={4}>
        <meshPhysicalMaterial
          color={BRAND.navy}
          metalness={0.1}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.15}
          envMapIntensity={1}
        />
      </RoundedBox>

      {/* (b) Screen — thin dark glossy panel on the +Z face */}
      <RoundedBox
        args={[0.54, 1.16, 0.01]}
        radius={0.045}
        smoothness={4}
        position={[0, 0, 0.04]}
      >
        <meshPhysicalMaterial
          color="#0f1e36"
          metalness={0.4}
          roughness={0.12}
          clearcoat={1}
          emissive={new THREE.Color(BRAND.orange)}
          emissiveIntensity={0.15}
        />
      </RoundedBox>

      {/* (c) AR / app UI floating just above the screen */}
      {/* thin white status / nav bar near the top */}
      <RoundedBox
        args={[0.4, 0.07, 0.012]}
        radius={0.03}
        smoothness={3}
        position={[0, 0.46, 0.07]}
      >
        <meshPhysicalMaterial
          color={BRAND.white}
          metalness={0.1}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.15}
          envMapIntensity={1}
        />
      </RoundedBox>

      {/* small white pill (control / dock) lower on the screen */}
      <RoundedBox
        args={[0.18, 0.045, 0.012]}
        radius={0.022}
        smoothness={3}
        position={[0, -0.48, 0.07]}
      >
        <meshPhysicalMaterial
          color={BRAND.white}
          metalness={0.1}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.15}
          envMapIntensity={1}
        />
      </RoundedBox>

      {/* floating orange AR cube in the center — the "object" being placed */}
      <mesh position={[0, 0.02, 0.12]} rotation={[0.5, 0.7, 0]}>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <AccentMaterial />
      </mesh>

      {/* (d) Camera bump cluster on the back (-Z) top corner */}
      <group position={[-0.18, 0.46, -0.05]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.02, 24]} />
          <meshPhysicalMaterial
            color="#0f1e36"
            metalness={0.4}
            roughness={0.12}
            clearcoat={1}
          />
        </mesh>
        <mesh position={[0, 0.05, -0.012]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.02, 20]} />
          <meshPhysicalMaterial
            color="#0f1e36"
            metalness={0.4}
            roughness={0.12}
            clearcoat={1}
          />
        </mesh>
        <mesh position={[0, -0.05, -0.012]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.02, 20]} />
          <meshPhysicalMaterial
            color="#0f1e36"
            metalness={0.4}
            roughness={0.12}
            clearcoat={1}
          />
        </mesh>
      </group>
    </group>
  );
}
