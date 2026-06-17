"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useScroll } from "framer-motion";
import { setSectionProgress } from "../sceneStore";

/**
 * DOM-side hook. Attach the returned ref to a section element; it publishes that
 * section's scroll progress (0 entering → 1 leaving) into the sceneStore so the
 * in-canvas scene can read it each frame via getSectionProgress(id).
 */
export function useSectionScroll<T extends HTMLElement = HTMLDivElement>(
  id: string
): RefObject<T | null> {
  const ref = useRef<T>(null);
  const { scrollYProgress } = useScroll({
    target: ref as RefObject<HTMLElement>,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    setSectionProgress(id, scrollYProgress.get());
    const unsub = scrollYProgress.on("change", (v) => setSectionProgress(id, v));
    return () => unsub();
  }, [id, scrollYProgress]);

  return ref;
}
