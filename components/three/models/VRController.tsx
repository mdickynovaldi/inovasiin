"use client";

import { Capsule, RoundedBox } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import { AccentMaterial, FrostedMaterial } from "../primitives/GlassObject";
import { BRAND } from "../sceneStore";

/**
 * Quest-Touch style VR motion controller. A frosted/white capsule grip tilted
 * back ~17deg carries a navy tracking ring at its top, with a white thumb cap
 * holding a navy thumbstick and two orange face buttons, plus a small front
 * trigger wedge — premium, clean, and clearly a controller facing +Z.
 */
export default function VRController(props: ThreeElements["group"]) {
  return (
    <group {...props}>
      {/* Whole controller tilted back so the grip leans away from the camera */}
      <group rotation={[0.3, 0, 0]}>
        {/* (a) Grip handle — frosted white capsule */}
        <Capsule args={[0.13, 0.6, 8, 24]} position={[0, -0.18, 0]}>
          <FrostedMaterial />
        </Capsule>

        {/* (d) Trigger wedge on the front of the grip */}
        <mesh
          position={[0, -0.02, 0.13]}
          rotation={[0.45, 0, 0]}
          castShadow
        >
          <boxGeometry args={[0.12, 0.18, 0.06]} />
          <meshPhysicalMaterial
            color={BRAND.navy}
            metalness={0.1}
            roughness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.15}
            envMapIntensity={1}
          />
        </mesh>

        {/* Top assembly — cap, ring and thumb controls sit above the grip */}
        <group position={[0, 0.2, 0]}>
          {/* (b) Tracking ring — navy torus angled forward over the cap */}
          <mesh position={[0, 0.12, 0.06]} rotation={[-0.5, 0, 0]} castShadow>
            <torusGeometry args={[0.32, 0.05, 20, 32]} />
            <meshPhysicalMaterial
              color={BRAND.navy}
              metalness={0.1}
              roughness={0.2}
              clearcoat={1}
              clearcoatRoughness={0.15}
              envMapIntensity={1}
            />
          </mesh>

          {/* (c) Top control cap where the thumb rests — white rounded slab */}
          <RoundedBox
            args={[0.3, 0.12, 0.3]}
            radius={0.05}
            smoothness={4}
            position={[0, 0, 0]}
            castShadow
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

          {/* Thumbstick base + stick — navy */}
          <mesh position={[-0.05, 0.07, 0.02]} castShadow>
            <cylinderGeometry args={[0.05, 0.055, 0.04, 24]} />
            <meshPhysicalMaterial
              color={BRAND.navyDark}
              metalness={0.2}
              roughness={0.25}
              clearcoat={1}
              clearcoatRoughness={0.15}
              envMapIntensity={1}
            />
          </mesh>
          <mesh position={[-0.05, 0.11, 0.02]} castShadow>
            <cylinderGeometry args={[0.035, 0.04, 0.05, 24]} />
            <meshPhysicalMaterial
              color={BRAND.navy}
              metalness={0.2}
              roughness={0.25}
              clearcoat={1}
              clearcoatRoughness={0.15}
              envMapIntensity={1}
            />
          </mesh>

          {/* Round face buttons — orange accents */}
          <mesh position={[0.09, 0.07, 0.08]} castShadow>
            <sphereGeometry args={[0.035, 24, 24]} />
            <AccentMaterial />
          </mesh>
          <mesh position={[0.09, 0.07, -0.04]} castShadow>
            <sphereGeometry args={[0.035, 24, 24]} />
            <AccentMaterial color={BRAND.orangeLight} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
