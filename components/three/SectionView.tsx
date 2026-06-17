"use client";

import { Suspense, type ReactNode } from "react";
import { View, PerspectiveCamera } from "@react-three/drei";
import { useScene } from "./SceneProvider";
import LightStudio from "./primitives/LightStudio";

type CameraConfig = { position?: [number, number, number]; fov?: number };

/**
 * Drop this inside any section to attach a 3D scene to that DOM region.
 *
 *   <SectionView className="absolute inset-0" fallback={<SceneFallback />}>
 *     <MyScene />
 *   </SectionView>
 *
 * On the "off" quality tier (mobile / no-WebGL) it renders `fallback` instead.
 * It provides a default camera + LightStudio so scenes only add their meshes;
 * pass `lights={false}` / a `camera` override when a scene needs its own rig.
 */
export default function SectionView({
  children,
  fallback = null,
  className = "",
  camera,
  lights = true,
  contactShadow = true,
}: {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  camera?: CameraConfig;
  lights?: boolean;
  contactShadow?: boolean;
}) {
  const { quality, ready } = useScene();

  if (!ready || quality === "off") {
    return <>{fallback}</>;
  }

  return (
    <View className={className}>
      <Suspense fallback={null}>
        <PerspectiveCamera
          makeDefault
          position={camera?.position ?? [0, 0, 6]}
          fov={camera?.fov ?? 45}
        />
        {lights && <LightStudio contactShadow={contactShadow} />}
        {children}
      </Suspense>
    </View>
  );
}
