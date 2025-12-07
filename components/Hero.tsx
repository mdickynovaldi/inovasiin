"use client";

import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ChevronRight } from "lucide-react";

// Dynamic import untuk TechScene3D (SSR disabled karena Three.js membutuhkan window)
const TechScene3D = dynamic(() => import("./TechScene3D"), {
  ssr: false,
  loading: () => null, // Loading sudah ditangani oleh LoadingScreen
});

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // Deteksi perangkat mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX - innerWidth / 2) / 50);
      mouseY.set((clientY - innerHeight / 2) / 50);
      setMousePosition({ x: clientX, y: clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Parallax transforms
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], ["0%", "20%"]);

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
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0f172a]">
      {/* 3D Background Scene - Hanya untuk Desktop */}
      {!isMobile && <TechScene3D />}

      {/* Simple Background untuk Mobile - Lebih Ringan */}
      {isMobile && (
        <div className="absolute inset-0 z-0">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-linear-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]" />

          {/* Animated Gradient Orbs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 -left-1/4 w-[300px] h-[300px] rounded-full bg-linear-to-r from-[#f97316]/20 to-transparent blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-1/4 -right-1/4 w-[250px] h-[250px] rounded-full bg-linear-to-l from-[#f97316]/15 to-transparent blur-3xl"
          />

          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(249,115,22,0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(249,115,22,0.3) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />

          {/* Floating Dots */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-[#f97316]/40"
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${20 + (i % 3) * 25}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Interactive gradient overlay that follows mouse */}
      <motion.div
        style={{
          x: smoothMouseX,
          y: smoothMouseY,
        }}
        className="absolute inset-0 z-1 pointer-events-none">
        {/* Subtle gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#0f172a]/50" />
      </motion.div>

      {/* Interactive cursor glow effect */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none z-3 hidden md:block"
        style={{
          background:
            "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)",
          left: mousePosition.x - 250,
          top: mousePosition.y - 250,
        }}
      />

      {/* Foreground - Minimalist Content */}
      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="relative z-20 container-custom text-center px-4">
        {/* Brand Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, type: "spring" }}
          className="mb-8">
          <motion.div
            animate={{
              filter: [
                "drop-shadow(0 0 30px rgba(249,115,22,0.2))",
                "drop-shadow(0 0 60px rgba(249,115,22,0.4))",
                "drop-shadow(0 0 30px rgba(249,115,22,0.2))",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center justify-center"></motion.div>
        </motion.div>

        {/* Brand Name - Minimalist */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-tight">
          <span className="text-white">Inovasi</span>
          <span className="text-[#f97316]">in</span>
        </motion.h1>

        {/* Tagline - Simple */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-white/40 text-sm md:text-base tracking-[0.3em] uppercase mb-16">
          Digital Creative Studio
        </motion.p>

        {/* Single CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            onClick={scrollToContact}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="group flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium backdrop-blur-sm hover:bg-white/10 hover:border-[#f97316]/30 transition-all duration-300">
            <span>Mulai Proyek</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}>
              <ChevronRight className="w-5 h-5 text-[#f97316] group-hover:text-white transition-colors" />
            </motion.div>
          </motion.button>
        </motion.div>

        {/* Subtle service indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-20 flex flex-wrap justify-center gap-8 text-white/30 text-xs tracking-wider uppercase">
          {["3D & Animation", "VR/AR", "Web Apps", "LMS"].map(
            (service, index) => (
              <motion.span
                key={service}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + index * 0.1 }}
                className="hover:text-[#f97316] transition-colors cursor-default">
                {service}
              </motion.span>
            )
          )}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-25">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-3 cursor-pointer group"
          onClick={scrollToServices}>
          <motion.div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5 group-hover:border-[#f97316]/50 transition-colors">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-1.5 h-1.5 rounded-full bg-[#f97316]"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Corner accents */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-white/10 pointer-events-none" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r border-t border-white/10 pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l border-b border-white/10 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-white/10 pointer-events-none" />
    </section>
  );
}
