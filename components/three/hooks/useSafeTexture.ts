"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";

/**
 * Loads a texture WITHOUT throwing on failure — unlike drei's `useTexture`,
 * which suspends and then throws if the image errors (a 404 or a CORS-blocked
 * Supabase thumbnail). That uncaught throw crashes the whole R3F canvas (and the
 * page). This hook instead returns `null` while loading or on error, so callers
 * render a fallback. No Suspense, no throw.
 */
export function useSafeTexture(
  url: string | null | undefined
): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!url) {
      setTexture(null);
      return;
    }
    let active = true;
    let loaded: THREE.Texture | null = null;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(
      url,
      (tex) => {
        if (!active) {
          tex.dispose();
          return;
        }
        tex.colorSpace = THREE.SRGBColorSpace;
        loaded = tex;
        setTexture(tex);
      },
      undefined,
      () => {
        // Load error (404 / CORS / bad URL): fall back gracefully.
        if (active) setTexture(null);
      }
    );

    return () => {
      active = false;
      loaded?.dispose();
    };
  }, [url]);

  return texture;
}
