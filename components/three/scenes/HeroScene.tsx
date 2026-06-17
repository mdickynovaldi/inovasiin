"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useParallax } from "../hooks/useParallax";
import { getSectionProgress, sceneStore, SECTION } from "../sceneStore";
import VRHeadset from "../models/VRHeadset";
import VRController from "../models/VRController";
import Smartphone from "../models/Smartphone";
import Laptop from "../models/Laptop";
import PlayBadge from "../models/PlayBadge";

/**
 * Hero scene — a scroll-driven SCENARIO showcasing Inovasiin's service stack as
 * real device props: a VR headset (centre), with a smartphone (AR/app), a VR
 * controller, a laptop (web/app) and a play badge (motion) orbiting it.
 * Scrolling (getSectionProgress(SECTION.hero), 0..1) plays three acts:
 *
 *   Act 1 (0.00–0.30)  scattered — props drift wide, camera pulled back.
 *   Act 2 (0.30–0.62)  gather    — props converge around the headset, camera in.
 *   Act 3 (0.62–0.90)  tighten   — the cluster pulls close.
 *   Exit  (0.90–1.00)  disperse  — props lift away + shrink as the page moves on.
 */

const smoothstep = (a: number, b: number, x: number) => {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const lerp3 = (
  out: THREE.Vector3,
  a: readonly [number, number, number],
  b: readonly [number, number, number],
  t: number
) => out.set(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t);

// Each satellite prop: a wide "scattered" pose, a tight "gathered" pose, its
// composed base scale, and a gentle face-forward sway (base Y angle + amplitude
// + phase) so the devices stay recognizable instead of spinning to their edges.
const SATS = {
  phone: { scatter: [-4.6, 2.3, -1.6] as const, gather: [-3.0, 1.7, 0.1] as const, base: 0.72, rotY: -0.35, amp: 0.3, phase: 0 },
  controller: { scatter: [4.8, 1.9, -1.3] as const, gather: [3.1, 1.6, 0.25] as const, base: 0.82, rotY: 0.35, amp: 0.3, phase: 1.2 },
  laptop: { scatter: [4.1, -2.4, 0.4] as const, gather: [2.9, -1.7, 0.35] as const, base: 0.62, rotY: -0.3, amp: 0.25, phase: 2.4 },
  play: { scatter: [-4.2, -2.2, 0.8] as const, gather: [-2.8, -1.7, 0.45] as const, base: 0.7, rotY: 0, amp: 0.15, phase: 3.6 },
};

export default function HeroScene() {
  const parallax = useParallax(0.1, 0.05);
  const content = useRef<THREE.Group>(null);
  const headset = useRef<THREE.Group>(null);
  const phone = useRef<THREE.Group>(null);
  const controller = useRef<THREE.Group>(null);
  const laptop = useRef<THREE.Group>(null);
  const play = useRef<THREE.Group>(null);

  const tmp = useRef(new THREE.Vector3());

  const place = (
    obj: THREE.Object3D | null,
    cfg: {
      scatter: readonly [number, number, number];
      gather: readonly [number, number, number];
      base: number;
      rotY: number;
      amp: number;
      phase: number;
    },
    gather: number,
    tighten: number,
    exit: number,
    t: number,
    k: number,
    delta: number
  ) => {
    if (!obj) return;
    lerp3(tmp.current, cfg.scatter, cfg.gather, gather);
    tmp.current.y += exit * 9; // lift away on exit
    obj.position.x = THREE.MathUtils.damp(obj.position.x, tmp.current.x, 5, delta);
    obj.position.y = THREE.MathUtils.damp(obj.position.y, tmp.current.y, 5, delta);
    obj.position.z = THREE.MathUtils.damp(obj.position.z, tmp.current.z, 5, delta);
    obj.rotation.y = cfg.rotY + Math.sin(t * 0.5 + cfg.phase) * cfg.amp * k;
    const s = cfg.base * (1 - tighten * 0.1) * (1 - exit);
    obj.scale.setScalar(THREE.MathUtils.damp(obj.scale.x, s, 5, delta));
  };

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const reduce = sceneStore.reducedMotion;
    const k = reduce ? 0 : 1;
    const p = reduce ? 0.45 : getSectionProgress(SECTION.hero);

    const gather = smoothstep(0.1, 0.58, p);
    const tighten = smoothstep(0.58, 0.86, p);
    const exit = smoothstep(0.88, 1, p);

    // --- Cinematic camera dolly (scroll-driven) ---
    const camera = state.camera;
    const camZ = THREE.MathUtils.lerp(9.4, 5.9, gather) - tighten * 0.7;
    const camX = Math.sin(p * Math.PI) * 0.7 * (1 - exit);
    const camY = exit * 1.6;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, camX, 4, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, camY, 4, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, camZ, 4, delta);
    camera.lookAt(0, 0, 0);

    // --- VR headset: floats TOP-CENTRE as a "crown" above the headline, kept
    //     clear of the copy so it never covers text; gentle turn, flies up on exit. ---
    if (headset.current) {
      headset.current.rotation.y = Math.sin(t * 0.25 * k) * 0.5;
      headset.current.position.x = THREE.MathUtils.damp(headset.current.position.x, 0, 5, delta);
      headset.current.position.y = THREE.MathUtils.damp(headset.current.position.y, 1.85 + exit * 9, 5, delta);
      headset.current.position.z = THREE.MathUtils.damp(headset.current.position.z, -1.0, 5, delta);
      const s = (0.72 + tighten * 0.08) * (1 - exit);
      headset.current.scale.setScalar(THREE.MathUtils.damp(headset.current.scale.x, s, 5, delta));
    }

    place(phone.current, SATS.phone, gather, tighten, exit, t, k, delta);
    place(controller.current, SATS.controller, gather, tighten, exit, t, k, delta);
    place(laptop.current, SATS.laptop, gather, tighten, exit, t, k, delta);
    place(play.current, SATS.play, gather, tighten, exit, t, k, delta);
  });

  return (
    <group ref={parallax}>
      <group ref={content}>
        <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.7}>
          {/* Centre — VR headset (flagship) */}
          <group ref={headset}>
            <VRHeadset />
          </group>

          {/* Satellites — one per service */}
          <group ref={phone} rotation={[0.1, -0.3, 0]}>
            <Smartphone />
          </group>
          <group ref={controller} rotation={[0.1, 0.4, 0]}>
            <VRController />
          </group>
          <group ref={laptop} rotation={[0.05, 0.2, 0]}>
            <Laptop />
          </group>
          <group ref={play} rotation={[0, 0, 0]}>
            <PlayBadge />
          </group>
        </Float>
      </group>
    </group>
  );
}
