"use client";

import { RoundedBox } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import { AccentMaterial } from "../primitives/GlassObject";
import { BRAND } from "../sceneStore";

/**
 * Laptop — an open laptop representing web & app development.
 *
 * Built from primitives only: a silver/white base deck with a recessed dark
 * keyboard area and a subtle trackpad, plus a screen hinged at the back edge of
 * the deck and tilted open to ~105deg. The screen face shows a minimal
 * browser/app abstraction (white top bar with an orange dot + an orange
 * rounded content block). Front faces +Z toward the viewer.
 */
export default function Laptop(props: ThreeElements["group"]) {
  // Geometry constants shared by the deck + hinge so the screen sits flush.
  const deckW = 1.3;
  const deckH = 0.06;
  const deckD = 0.9;
  const deckTop = deckH / 2; // y of the deck's upper surface
  const hingeZ = -deckD / 2; // back edge of the deck

  // Screen panel (matches the brief: 1.3 x 0.82 x 0.04).
  const screenW = 1.3;
  const screenH = 0.82;
  const screenT = 0.04;

  // Open ~105deg from the deck plane → rotate back by 15deg past vertical.
  const screenTilt = THREE.MathUtils.degToRad(105 - 90); // 15deg lean-back

  const whiteShell = (
    <meshPhysicalMaterial
      color={BRAND.white}
      metalness={0.1}
      roughness={0.2}
      clearcoat={1}
      clearcoatRoughness={0.15}
      envMapIntensity={1}
    />
  );

  return (
    <group {...props}>
      {/* (a) Base deck — silver/white shell */}
      <RoundedBox args={[deckW, deckH, deckD]} radius={0.04} smoothness={4}>
        {whiteShell}
      </RoundedBox>

      {/* Recessed dark keyboard area, inset into the upper rear of the deck */}
      <RoundedBox
        args={[1.06, 0.012, 0.42]}
        radius={0.015}
        smoothness={4}
        position={[0, deckTop - 0.004, -0.12]}
      >
        <meshPhysicalMaterial
          color="#0f1e36"
          metalness={0.4}
          roughness={0.12}
          clearcoat={1}
        />
      </RoundedBox>

      {/* Subtle darker trackpad toward the front edge */}
      <RoundedBox
        args={[0.4, 0.01, 0.26]}
        radius={0.02}
        smoothness={4}
        position={[0, deckTop + 0.002, 0.24]}
      >
        <meshPhysicalMaterial
          color="#dfe4ec"
          metalness={0.1}
          roughness={0.3}
          clearcoat={1}
          clearcoatRoughness={0.2}
        />
      </RoundedBox>

      {/* (b) Screen — hinged at the BACK edge of the deck, tilted open ~105deg.
          The pivot group sits at the hinge line so the panel swings up cleanly. */}
      <group position={[0, deckTop, hingeZ]} rotation={[-screenTilt, 0, 0]}>
        {/* Lift the panel so its bottom edge meets the hinge pivot */}
        <group position={[0, screenH / 2, 0]}>
          {/* White screen frame */}
          <RoundedBox
            args={[screenW, screenH, screenT]}
            radius={0.04}
            smoothness={4}
          >
            {whiteShell}
          </RoundedBox>

          {/* Dark display surface on the FRONT (+Z) of the frame */}
          <RoundedBox
            args={[screenW - 0.1, screenH - 0.1, 0.012]}
            radius={0.02}
            smoothness={4}
            position={[0, 0, screenT / 2 + 0.002]}
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

          {/* (c) Browser/app abstraction, sitting just above the display.
              White top bar across the upper edge of the screen content. */}
          <RoundedBox
            args={[screenW - 0.16, 0.07, 0.01]}
            radius={0.01}
            smoothness={4}
            position={[0, screenH / 2 - 0.13, screenT / 2 + 0.012]}
          >
            {whiteShell}
          </RoundedBox>

          {/* Tiny orange dot on the top bar (window control), facing +Z */}
          <mesh
            position={[
              -(screenW - 0.16) / 2 + 0.06,
              screenH / 2 - 0.13,
              screenT / 2 + 0.02,
            ]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.018, 0.018, 0.012, 24]} />
            <AccentMaterial />
          </mesh>

          {/* Orange rounded content block (the "app" content) */}
          <RoundedBox
            args={[screenW - 0.34, screenH - 0.42, 0.012]}
            radius={0.03}
            smoothness={4}
            position={[0, -0.04, screenT / 2 + 0.014]}
          >
            <AccentMaterial color={BRAND.orangeLight} />
          </RoundedBox>
        </group>
      </group>
    </group>
  );
}
