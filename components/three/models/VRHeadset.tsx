"use client";

import { RoundedBox } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import { AccentMaterial, FrostedMaterial } from "../primitives/GlassObject";
import { BRAND } from "../sceneStore";

/**
 * VRHeadset — a sleek VR headset / goggles prop (Meta-Quest / Apple-Vision vibe)
 * representing the studio's VR/AR work. Built from primitives only and centered
 * at the origin with the dark visor lens facing +Z.
 *
 * Layout (front = +Z):
 *   - visor body   : frosted white glass shell (RoundedBox)
 *   - lens panel   : dark glossy screen on the +Z face, ringed by a thin orange rim
 *   - face foam    : white cushion on the -Z (wearer) side
 *   - head strap   : navy torus arcing over the top + around
 *   - logo strip   : a tiny orange accent bar on top
 *
 * No required props: spreads ThreeElements["group"] onto the root group so callers
 * position / rotate / scale it. Largest dimension ~1.25 units to match sibling props.
 */
export default function VRHeadset(props: ThreeElements["group"]) {
  return (
    <group {...props}>
      {/* (a) main visor body — frosted white glass shell */}
      <RoundedBox args={[1.25, 0.62, 0.42]} radius={0.16} smoothness={4}>
        <FrostedMaterial color="#ffffff" />
      </RoundedBox>

      {/* (b) front visor lens — dark glossy panel on the +Z face */}
      <RoundedBox
        args={[1.1, 0.5, 0.06]}
        radius={0.12}
        smoothness={4}
        position={[0, 0, 0.22]}
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

      {/* (b) thin orange rim framing the lens */}
      <mesh position={[0, 0, 0.235]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.018, 16, 32]} />
        <AccentMaterial />
      </mesh>

      {/* (c) face-foam cushion — white, on the wearer (-Z) side */}
      <RoundedBox
        args={[1.08, 0.52, 0.14]}
        radius={0.1}
        smoothness={4}
        position={[0, 0, -0.24]}
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

      {/* (d) head strap — navy torus arcing over the top / around */}
      <mesh position={[0, 0.02, -0.16]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.62, 0.055, 20, 32, Math.PI * 1.45]} />
        <meshPhysicalMaterial
          color={BRAND.navy}
          metalness={0.1}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.15}
          envMapIntensity={1}
        />
      </mesh>

      {/* (e) small orange accent — logo strip on top */}
      <RoundedBox
        args={[0.34, 0.05, 0.08]}
        radius={0.024}
        smoothness={4}
        position={[0, 0.32, 0.04]}
      >
        <AccentMaterial color={BRAND.orangeLight} />
      </RoundedBox>
    </group>
  );
}
