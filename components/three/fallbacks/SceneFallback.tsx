"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BRAND } from "../sceneStore";

/**
 * Lightweight CSS/SVG stand-in shown wherever the 3D canvas isn't mounted
 * (mobile / no-WebGL / "off" tier). Soft brand-colored orbs on the light theme
 * so sections still feel alive without a WebGL context.
 */
export default function SceneFallback({
  variant = "default",
  className = "",
}: {
  variant?: "default" | "hero" | "subtle";
  className?: string;
}) {
  const reduce = useReducedMotion();
  const big = variant === "hero";

  const orbA = big ? "w-[22rem] h-[22rem]" : "w-72 h-72";
  const orbB = big ? "w-[18rem] h-[18rem]" : "w-64 h-64";
  const baseOpacity = variant === "subtle" ? 0.18 : 0.32;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <motion.div
        animate={
          reduce ? undefined : { scale: [1, 1.15, 1], opacity: [baseOpacity * 0.8, baseOpacity, baseOpacity * 0.8] }
        }
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-1/4 left-1/4 ${orbA} rounded-full blur-3xl`}
        style={{
          background: `radial-gradient(circle, ${BRAND.orangeLight}55 0%, transparent 70%)`,
          opacity: baseOpacity,
        }}
      />
      <motion.div
        animate={
          reduce ? undefined : { scale: [1.1, 1, 1.1], opacity: [baseOpacity * 0.6, baseOpacity * 0.9, baseOpacity * 0.6] }
        }
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className={`absolute bottom-1/4 right-1/4 ${orbB} rounded-full blur-3xl`}
        style={{
          background: `radial-gradient(circle, ${BRAND.navy}40 0%, transparent 70%)`,
          opacity: baseOpacity * 0.8,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(${BRAND.navy} 1px, transparent 1px), linear-gradient(90deg, ${BRAND.navy} 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
        }}
      />
    </div>
  );
}
