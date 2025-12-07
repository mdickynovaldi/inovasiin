"use client";

import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowDown, Sparkles, Globe, Box, Monitor, Zap, Code2, Layers } from "lucide-react";

// Dynamic import untuk TechScene3D (SSR disabled karena Three.js membutuhkan window)
const TechScene3D = dynamic(() => import("./TechScene3D"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-16 h-16 border-4 border-[#f97316] border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

// Interactive floating orb component
function FloatingOrb({ delay, size, color, position }: { delay: number; size: string; color: string; position: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, delay, type: "spring" }}
      className={`absolute ${position} ${size} rounded-full blur-xl pointer-events-none`}
      style={{ background: color }}
    >
      <motion.div
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ 
          duration: 4 + delay,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-full h-full rounded-full"
        style={{ background: color }}
      />
    </motion.div>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-[#0f172a] to-slate-900"
    >
      {/* 3D Background Scene */}
      <TechScene3D />
      
      {/* Interactive gradient overlay that follows mouse */}
      <motion.div
        style={{ 
          x: smoothMouseX,
          y: smoothMouseY,
        }}
        className="absolute inset-0 z-[1] pointer-events-none"
      >
        {/* Animated gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f97316]/5 via-transparent to-[#1e3a5f]/10" />
        
        {/* Floating orbs that create depth */}
        <FloatingOrb delay={0} size="w-[500px] h-[500px]" color="radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)" position="top-[-10%] right-[-10%]" />
        <FloatingOrb delay={0.5} size="w-[400px] h-[400px]" color="radial-gradient(circle, rgba(30,58,95,0.2) 0%, transparent 70%)" position="bottom-[-5%] left-[-5%]" />
        <FloatingOrb delay={1} size="w-[300px] h-[300px]" color="radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)" position="top-[40%] left-[10%]" />
      </motion.div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 z-[2] pointer-events-none opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(249,115,22,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(249,115,22,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)'
          }}
        />
      </div>

      {/* Interactive cursor glow effect */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none z-[3] hidden md:block"
        style={{
          background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)',
          left: mousePosition.x - 200,
          top: mousePosition.y - 200,
        }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Foreground - Main Content */}
      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="relative z-[20] container-custom text-center px-4"
      >
        {/* Animated badge */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#f97316]/20 to-[#f97316]/5 border border-[#f97316]/30 mb-8 backdrop-blur-sm cursor-pointer group"
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="w-4 h-4 text-[#f97316]" />
          </motion.div>
          <span className="text-sm text-white/90 font-medium group-hover:text-[#f97316] transition-colors">
            Digital Creative Studio
          </span>
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Zap className="w-3 h-3 text-[#f97316]" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
        >
          <span className="text-white/95">Turn Your Ideas into</span>
          <br />
          <motion.span 
            className="bg-gradient-to-r from-[#f97316] via-[#fb923c] to-[#f59e0b] bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: '200% 200%' }}
          >
            Immersive Digital Experiences
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-3xl mx-auto text-lg sm:text-xl text-white/60 mb-10 leading-relaxed"
        >
          <span className="text-[#f97316] font-semibold">PT INOVASIIN SMART SOLUTION</span> membantu Anda mewujudkan ide menjadi produk nyata—mulai dari 3D modelling, website & LMS, hingga VR/AR interaktif untuk edukasi, hiburan, dan simulasi industri.
        </motion.p>

        {/* Interactive Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {[
            { icon: Box, label: "Custom 3D & Animation", color: "#f97316" },
            { icon: Globe, label: "VR/AR Experiences", color: "#3b82f6" },
            { icon: Monitor, label: "Modern Apps & Websites", color: "#10b981" },
            { icon: Code2, label: "LMS & E-Learning", color: "#8b5cf6" },
            { icon: Layers, label: "Industri Simulation", color: "#ec4899" },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
              whileHover={{ 
                scale: 1.1, 
                y: -5,
                boxShadow: `0 20px 40px -15px ${item.color}40`
              }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md cursor-pointer group transition-all duration-300 hover:border-white/20 hover:bg-white/10"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <item.icon className="w-5 h-5 transition-colors duration-300" style={{ color: item.color }} />
              </motion.div>
              <span className="text-sm text-white/80 font-medium group-hover:text-white transition-colors">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Interactive CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            onClick={scrollToContact}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 25px 50px -12px rgba(249,115,22,0.4)"
            }}
            whileTap={{ scale: 0.98 }}
            className="relative px-8 py-4 rounded-2xl bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white font-semibold text-lg overflow-hidden group"
          >
            <span className="relative z-10">Diskusikan Proyek Anda</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#fb923c] to-[#f97316]"
              initial={{ x: "100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
          <motion.button
            onClick={scrollToServices}
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "rgba(255,255,255,0.1)"
            }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 rounded-2xl border-2 border-white/30 text-white font-medium text-lg backdrop-blur-sm transition-all hover:border-[#f97316]/50"
          >
            Lihat Layanan Kami
          </motion.button>
        </motion.div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16"
        >
          {[
            { value: "50+", label: "Projects Completed" },
            { value: "30+", label: "Happy Clients" },
            { value: "5+", label: "Years Experience" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 + index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              className="text-center cursor-default"
            >
              <motion.div 
                className="text-3xl md:text-4xl font-bold text-[#f97316]"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-sm text-white/50 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[25]"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 cursor-pointer group"
          onClick={scrollToServices}
          whileHover={{ scale: 1.1 }}
        >
          <span className="text-xs text-white/40 uppercase tracking-widest group-hover:text-[#f97316] transition-colors">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <ArrowDown className="w-5 h-5 text-[#f97316]" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-[#f97316]/20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-[#f97316]/20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-[#f97316]/20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-[#f97316]/20 pointer-events-none" />
    </section>
  );
}
