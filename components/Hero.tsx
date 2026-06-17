"use client";

import { useRef, useEffect } from "react";

import { motion, useTransform, useMotionValue } from "framer-motion";
import { ChevronRight, ChevronDown } from "lucide-react";
import SectionView from "./three/SectionView";
import HeroScene from "./three/scenes/HeroScene";
import SceneFallback from "./three/fallbacks/SceneFallback";
import { setSectionProgress, SECTION } from "./three/sceneStore";

/**
 * Hero — a pinned, scroll-driven SCENARIO. The section is 280vh tall with a
 * sticky stage; scrolling advances the 3D HeroScene through its acts while the
 * DOM captions crossfade in step:
 *   Act 1  brand intro      ·  Act 2  the promise  ·  Act 3  the offer + CTA
 */
export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Deterministic scroll progress (0..1) for the pinned hero. Computed directly
  // from the section's rect on every scroll — more reliable here than
  // useScroll({offset}) with a pinned/sticky child.
  const progress = useMotionValue(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const clamp = (v: number) => Math.min(1, Math.max(0, v));
    const update = () => {
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? clamp(-rect.top / total) : 0;
      progress.set(p);
      setSectionProgress(SECTION.hero, p);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [progress]);

  // Caption acts — crossfade across the scroll.
  const act1 = useTransform(progress, [0, 0.22, 0.3], [1, 1, 0]);
  const act1Y = useTransform(progress, [0, 0.3], ["0%", "-12%"]);
  const act2 = useTransform(progress, [0.3, 0.38, 0.54, 0.62], [0, 1, 1, 0]);
  const act2Y = useTransform(progress, [0.3, 0.62], ["10%", "-10%"]);
  const act3 = useTransform(progress, [0.62, 0.72, 0.95, 1], [0, 1, 1, 1]);
  const act3Y = useTransform(progress, [0.62, 0.78], ["10%", "0%"]);
  const hintOpacity = useTransform(progress, [0, 0.12], [1, 0]);

  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      ref={containerRef}
      // Transparent so the fixed 3D canvas (z-5) shows through behind the copy;
      // the page's white body provides the backdrop. (An opaque bg here would
      // hide the canvas because the sticky stage creates a stacking context.)
      className="relative min-h-[280vh] bg-transparent">
      {/* Pinned stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Subtle grid texture */}
        <div className="absolute inset-0 grid-pattern opacity-60 pointer-events-none" />

        {/* 3D scenario (desktop) / animated fallback (mobile) */}
        <SectionView
          className="scene-view"
          camera={{ position: [0, 0, 9], fov: 45 }}
          fallback={<SceneFallback variant="hero" />}>
          <HeroScene />
        </SectionView>

        {/* Readability scrim — a soft white pool behind the centered copy so the
            text always stays legible over the 3D devices (z between canvas and
            text). Tall + strong enough to cover the full headline + subheading
            column; fades to transparent before the corner devices. */}
        <div
          aria-hidden
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 46% 44% at 50% 52%, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.86) 46%, rgba(255,255,255,0) 78%)",
          }}
        />

        {/* ---- Act 1 · brand intro ---- */}
        <motion.div
          style={{ opacity: act1, y: act1Y }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-tight">
            <span className="text-[#1e3a5f]">Inovasi</span>
            <span className="text-[#f97316]">in</span>
          </h1>
          <p className="text-[#475569] text-sm md:text-base tracking-[0.3em] uppercase mb-10 font-medium">
            Digital Creative Studio
          </p>
          <motion.button
            onClick={scrollToContact}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="group pointer-events-auto flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white font-semibold shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300">
            <span>Mulai Proyek</span>
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* ---- Act 2 · the promise ---- */}
        <motion.div
          style={{ opacity: act2, y: act2Y }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
            <span className="text-[#1e3a5f]">Dari </span>
            <span className="text-[#f97316]">Ide</span>
            <br />
            <span className="text-[#1e3a5f]">Menjadi Realitas Digital</span>
          </h2>
          <p className="mt-6 max-w-xl text-[#475569] text-base md:text-lg">
            Kami merancang, membangun, dan menghidupkan pengalaman 3D, VR/AR, dan
            produk digital yang berdampak.
          </p>
        </motion.div>

        {/* ---- Act 3 · the offer ---- */}
        <motion.div
          style={{ opacity: act3, y: act3Y }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
          <p className="text-[#64748b] text-xs md:text-sm tracking-[0.3em] uppercase mb-5 font-semibold">
            Apa yang kami bangun
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 max-w-2xl mb-9">
            {["3D & Animation", "VR / AR", "Web & Apps", "Motion Graphics", "LMS"].map(
              (s) => (
                <span
                  key={s}
                  className="text-lg md:text-2xl font-semibold text-[#1e3a5f]">
                  {s}
                </span>
              )
            )}
          </div>
          <motion.button
            onClick={scrollToContact}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="group pointer-events-auto flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white font-semibold shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300">
            <span>Mulai Proyek</span>
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Scroll hint (fades after the first beat) */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-25 flex flex-col items-center gap-2 cursor-pointer group pointer-events-auto"
          onClick={scrollToServices}>
          <span className="text-[#64748b] text-[11px] tracking-[0.25em] uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
            <ChevronDown className="w-5 h-5 text-[#f97316]" />
          </motion.div>
        </motion.div>

        {/* Corner accents */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-[#1e3a5f]/15 pointer-events-none" />
        <div className="absolute top-8 right-8 w-16 h-16 border-r border-t border-[#1e3a5f]/15 pointer-events-none" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-l border-b border-[#1e3a5f]/15 pointer-events-none" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-[#1e3a5f]/15 pointer-events-none" />
      </div>
    </section>
  );
}
