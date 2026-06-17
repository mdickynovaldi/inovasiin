"use client";

import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { BRAND } from "../sceneStore";

/**
 * Per-view light rig tuned for a bright, white "studio" look (premium glass on
 * light backgrounds). Each drei <View> renders into its own scene, so lighting
 * + environment must live inside the view rather than at the Canvas root.
 *
 * The Environment is built from <Lightformer>s (no HDR download) for soft white
 * reflections with a warm orange kicker — fully self-contained and fast.
 */
export default function LightStudio({
  contactShadow = true,
  shadowY = -1.6,
  intensity = 1,
}: {
  contactShadow?: boolean;
  shadowY?: number;
  intensity?: number;
}) {
  return (
    <>
      <ambientLight intensity={0.65 * intensity} />
      <directionalLight position={[4, 6, 5]} intensity={1.4 * intensity} color="#ffffff" />
      <directionalLight position={[-5, 2, -3]} intensity={0.45 * intensity} color={BRAND.navy} />

      {/* Low-res env cubemap (reflections don't need detail); renders once. */}
      <Environment resolution={64} frames={1}>
        <Lightformer
          form="rect"
          intensity={2.2}
          position={[0, 4, 4]}
          scale={[10, 5, 1]}
          color="#ffffff"
        />
        <Lightformer
          form="rect"
          intensity={1.1}
          position={[-6, 1, 1]}
          scale={[4, 4, 1]}
          color={BRAND.glassTint}
        />
        <Lightformer
          form="ring"
          intensity={1.3}
          position={[5, 2, -2]}
          scale={[3, 3, 1]}
          color={BRAND.orangeLight}
        />
      </Environment>

      {contactShadow && (
        // frames={1} bakes the shadow once instead of re-rendering a shadow
        // map every frame (×7 views) — the soft shadow reads fine static.
        <ContactShadows
          frames={1}
          position={[0, shadowY, 0]}
          opacity={0.32}
          scale={16}
          blur={2.8}
          far={6}
          color={BRAND.navy}
          resolution={256}
        />
      )}
    </>
  );
}
