"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import {
  PresentationControls,
  RoundedBox,
  Text,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";
import { AccentMaterial } from "../primitives/GlassObject";
import { useParallax } from "../hooks/useParallax";
import {
  getSectionProgress,
  getHover,
  setHover,
  sceneStore,
  SECTION,
  BRAND,
} from "../sceneStore";

/**
 * PortfolioGallery scene — a gentle forward-facing arc of up to ~8 portfolio
 * thumbnail cards. Each card is a textured plane (basic/standard material, never
 * transmission glass, to stay fast) sitting in a slightly larger navy RoundedBox
 * frame for a framed look. The whole arc auto-rotates calmly, parallaxes to the
 * pointer, and can be dragged via PresentationControls. Cards lift + sharpen on
 * hover and call onSelect(item.id) on click. Cards without a thumbnail fall back
 * to an orange/category-tinted AccentMaterial face with the title initial.
 *
 * Follows the HeroScene shape: a parallax outer group + a single useFrame on the
 * arc reading state.clock and getSectionProgress(SECTION.portfolioGallery), with
 * all motion gated behind sceneStore.reducedMotion.
 */

export type PortfolioGalleryItem = {
  id: string;
  title: string;
  category: string;
  thumbnail: string | null;
};

type Props = {
  items: PortfolioGalleryItem[];
  onSelect?: (id: string) => void;
};

const MAX_ITEMS = 8;
const CARD_W = 1.4;
const CARD_H = 1.0;
const FRAME_PAD = 0.14; // how much larger the navy frame is than the card
const FRAME_DEPTH = 0.12;
const ARC_RADIUS = 5.2; // radius of the forward-facing arc (cards face inward)
const ARC_SPREAD = 1.5; // total angular spread (radians) across all cards

// On-brand category tints for the no-thumbnail fallback card faces.
const CATEGORY_COLOR: Record<string, string> = {
  "Virtual Reality": BRAND.orange,
  "Augmented Reality": BRAND.orangeLight,
  "Web Development": "#0ea5e9",
  "3D Modeling": "#a855f7",
  "Motion Graphics": BRAND.navyLight,
};

const colorFor = (category: string): string =>
  CATEGORY_COLOR[category] ?? BRAND.orange;

const initialOf = (title: string): string =>
  (title.trim()[0] ?? "?").toUpperCase();

type Placed = {
  item: PortfolioGalleryItem;
  position: [number, number, number];
  rotationY: number;
};

export default function PortfolioGalleryScene({ items, onSelect }: Props) {
  const parallax = useParallax(0.1, 0.05);
  const arc = useRef<THREE.Group>(null);
  const spinner = useRef<THREE.Group>(null);

  // Deterministic placement on a gentle arc — no runtime randomness.
  const placed = useMemo<Placed[]>(() => {
    const list = items.slice(0, MAX_ITEMS);
    const n = list.length;
    return list.map((item, i) => {
      // Center the spread around 0; single item sits dead center.
      const tNorm = n > 1 ? i / (n - 1) - 0.5 : 0;
      const angle = tNorm * ARC_SPREAD;
      const x = Math.sin(angle) * ARC_RADIUS;
      // Cards bow toward the viewer: nearer center = closer in Z.
      const z = (Math.cos(angle) - 1) * ARC_RADIUS + ARC_RADIUS * 0.0;
      return {
        item,
        position: [x, 0, z] as [number, number, number],
        // Face inward toward the arc center so the front of each card aims at viewer.
        rotationY: -angle,
      };
    });
  }, [items]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const reduce = sceneStore.reducedMotion;
    const k = reduce ? 0 : 1;
    const p = getSectionProgress(SECTION.portfolioGallery);

    // Calm auto-rotation of the whole arc (settles to rest when reduced).
    if (spinner.current) {
      spinner.current.rotation.y = THREE.MathUtils.damp(
        spinner.current.rotation.y,
        Math.sin(t * 0.12) * 0.22 * k,
        4,
        delta
      );
    }

    // Subtle entrance: the arc rises + scales in as the section comes into view.
    if (arc.current) {
      const enter = THREE.MathUtils.clamp(p * 2, 0, 1); // 0..1 over first half
      arc.current.position.y = THREE.MathUtils.damp(
        arc.current.position.y,
        (1 - enter) * -1.2,
        4,
        delta
      );
      const s = 0.92 + enter * 0.08;
      arc.current.scale.setScalar(
        THREE.MathUtils.damp(arc.current.scale.x, s, 4, delta)
      );
    }
  });

  if (items.length === 0) return null;

  return (
    <group ref={parallax}>
      <PresentationControls
        global
        cursor
        damping={4}
        polar={[-0.2, 0.2]}
        azimuth={[-0.6, 0.6]}>
        <group ref={arc}>
          <group ref={spinner}>
            {placed.map(({ item, position, rotationY }) => (
              <Card
                key={item.id}
                item={item}
                position={position}
                rotationY={rotationY}
                onSelect={onSelect}
              />
            ))}
          </group>
        </group>
      </PresentationControls>
    </group>
  );
}

/**
 * One portfolio card: a navy RoundedBox frame behind a thumbnail (or fallback)
 * face. Hover lifts the card toward the viewer and sharpens it; click triggers
 * onSelect. The textured face is wrapped in its own <Suspense> so a slow/failed
 * texture can't break sibling cards.
 */
function Card({
  item,
  position,
  rotationY,
  onSelect,
}: {
  item: PortfolioGalleryItem;
  position: [number, number, number];
  rotationY: number;
  onSelect?: (id: string) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const [pointerDown, setPointerDown] = useState(false);
  const hoverId = `portfolio-card-${item.id}`;

  useFrame((_state, delta) => {
    const node = group.current;
    if (!node) return;
    const reduce = sceneStore.reducedMotion;
    const hovered = !reduce && getHover(hoverId);
    // Hover lifts the card toward the viewer (along its local +Z front face).
    const targetZ = hovered ? 0.45 : 0;
    node.position.z = THREE.MathUtils.damp(node.position.z, targetZ, 6, delta);
    const targetScale = hovered ? 1.07 : 1;
    node.scale.setScalar(
      THREE.MathUtils.damp(node.scale.x, targetScale, 6, delta)
    );
  });

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHover(hoverId, true);
    document.body.style.cursor = "pointer";
  };
  const onOut = () => {
    setHover(hoverId, false);
    setPointerDown(false);
    document.body.style.cursor = "auto";
  };
  const onDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setPointerDown(true);
  };
  const onUp = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (pointerDown) onSelect?.(item.id);
    setPointerDown(false);
  };

  return (
    // Outer group: fixed arc placement. Inner ref-group handles hover lift/scale.
    <group position={position} rotation={[0, rotationY, 0]}>
      <group
        ref={group}
        onPointerOver={onOver}
        onPointerOut={onOut}
        onPointerDown={onDown}
        onPointerUp={onUp}>
        {/* Navy frame behind the card for a framed look. */}
        <RoundedBox
          args={[CARD_W + FRAME_PAD, CARD_H + FRAME_PAD, FRAME_DEPTH]}
          radius={0.07}
          smoothness={4}
          position={[0, 0, -FRAME_DEPTH / 2]}>
          <meshStandardMaterial
            color={BRAND.navy}
            metalness={0.25}
            roughness={0.45}
            envMapIntensity={0.8}
          />
        </RoundedBox>

        {/* The card face. Textured cards get their own Suspense boundary. */}
        {item.thumbnail ? (
          <Suspense fallback={null}>
            <ThumbnailFace url={item.thumbnail} />
          </Suspense>
        ) : (
          <FallbackFace item={item} />
        )}
      </group>
    </group>
  );
}

/** Textured front face. Uses MeshBasicMaterial with the map — no glass. */
function ThumbnailFace({ url }: { url: string }) {
  const texture = useTexture(url, (tex) => {
    const t = tex as THREE.Texture;
    t.colorSpace = THREE.SRGBColorSpace;
  });

  return (
    <mesh position={[0, 0, 0.001]}>
      <planeGeometry args={[CARD_W, CARD_H]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

/** No-thumbnail fallback: glossy category-tinted face + title initial. */
function FallbackFace({ item }: { item: PortfolioGalleryItem }) {
  return (
    <group>
      <RoundedBox
        args={[CARD_W, CARD_H, 0.04]}
        radius={0.05}
        smoothness={4}
        position={[0, 0, 0.02]}>
        <AccentMaterial color={colorFor(item.category)} />
      </RoundedBox>
      <Text
        position={[0, 0, 0.06]}
        fontSize={0.5}
        color={BRAND.white}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0}>
        {initialOf(item.title)}
      </Text>
    </group>
  );
}
