"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Sparkles, Globe, Box, Monitor } from "lucide-react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const middleLayerY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Layer - Gradient + Grid */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 z-0"
      >
        {/* Main gradient - Light with subtle colors */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-orange-50/30 to-blue-50/50" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-60" />
        
        {/* Decorative shapes */}
        <div className="absolute top-20 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#f97316]/10 to-transparent blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#1e3a5f]/10 to-transparent blur-3xl" />
        
        {/* Animated orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-40 right-[15%] w-64 h-64 rounded-full bg-gradient-to-br from-[#f97316]/20 to-transparent blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-40 left-[10%] w-80 h-80 rounded-full bg-gradient-to-br from-[#1e3a5f]/15 to-transparent blur-3xl"
        />
      </motion.div>

      {/* Middle Layer - Floating Elements */}
      <motion.div
        style={{ y: middleLayerY }}
        className="absolute inset-0 z-10 pointer-events-none hidden md:block"
      >
        {/* Floating cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute top-[15%] right-[10%] w-48 h-32 bg-white rounded-2xl shadow-xl p-4 rotate-12 border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-[#f97316]" />
            <div className="w-3 h-3 rounded-full bg-[#1e3a5f]" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-[#f97316]/30 rounded-full w-3/4" />
            <div className="h-2 bg-[#1e3a5f]/30 rounded-full w-1/2" />
            <div className="h-2 bg-gray-200 rounded-full w-2/3" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="absolute bottom-[20%] left-[5%] w-40 h-40 bg-white rounded-2xl shadow-xl p-4 -rotate-6 flex items-center justify-center border border-gray-100"
        >
          <motion.div
            animate={{ rotateY: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-2 border-[#f97316]/50 rounded-xl relative"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="absolute inset-2 border border-[#1e3a5f]/50 rounded-lg" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="absolute top-[40%] right-[5%] w-36 h-24 bg-white rounded-xl shadow-xl p-3 rotate-6 border border-gray-100"
        >
          <div className="text-xs text-[#f97316] font-mono mb-1">&lt;VR/&gt;</div>
          <div className="flex gap-1">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-[#f97316] to-[#ea580c]" />
            <div className="w-6 h-6 rounded bg-gradient-to-br from-[#1e3a5f] to-[#0f2847]" />
            <div className="w-6 h-6 rounded bg-gradient-to-br from-[#f97316] to-[#1e3a5f]" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="absolute bottom-[30%] right-[15%] w-32 h-32 bg-white rounded-full shadow-xl p-4 flex items-center justify-center border border-gray-100"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            <Box className="w-12 h-12 text-[#f97316]" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Foreground - Main Content */}
      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="relative z-20 container-custom text-center px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f97316]/10 border border-[#f97316]/20 mb-8"
        >
          <Sparkles className="w-4 h-4 text-[#f97316]" />
          <span className="text-sm text-[#1e3a5f] font-medium">
            Digital Creative Studio
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
        >
          <span className="text-[#1e3a5f]">Turn Your Ideas into</span>
          <br />
          <span className="gradient-text">Immersive Digital Experiences</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-3xl mx-auto text-lg sm:text-xl text-[#1e3a5f]/70 mb-8 leading-relaxed"
        >
          <span className="text-[#1e3a5f] font-medium">PT INOVASIIN SMART SOLUTION</span> membantu Anda mewujudkan ide menjadi produk nyata—mulai dari 3D modelling, website & LMS, hingga VR/AR interaktif untuk edukasi, hiburan, dan simulasi industri.
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {[
            { icon: Box, label: "Custom 3D & Animation" },
            { icon: Globe, label: "VR/AR Experiences" },
            { icon: Monitor, label: "Modern Apps & Websites" },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#1e3a5f]/10 bg-white shadow-sm"
            >
              <item.icon className="w-4 h-4 text-[#f97316]" />
              <span className="text-sm text-[#1e3a5f]/80">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            onClick={scrollToContact}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white font-semibold text-lg transition-all hover:shadow-lg hover:shadow-orange-500/25"
          >
            Diskusikan Proyek Anda
          </motion.button>
          <motion.button
            onClick={scrollToServices}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 rounded-full border-2 border-[#1e3a5f] text-[#1e3a5f] font-medium text-lg hover:bg-[#1e3a5f] hover:text-white transition-all"
          >
            Lihat Layanan Kami
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={scrollToServices}
        >
          <span className="text-xs text-[#1e3a5f]/50 uppercase tracking-widest">
            Scroll
          </span>
          <ArrowDown className="w-5 h-5 text-[#f97316]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
