"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
  minLoadTime?: number;
}

// Particle component yang aman untuk SSR
function Particles() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  // Generate random positions only after mounted
  const particles = useMemo(() => {
    if (!mounted) return [];
    return [...Array(20)].map((_, i) => ({
      id: i,
      x: Math.random() * dimensions.width,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 2,
    }));
  }, [mounted, dimensions.width]);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x: particle.x,
            y: dimensions.height + 20,
            opacity: 0,
          }}
          animate={{
            y: -20,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "linear",
          }}
          className="absolute w-1 h-1 rounded-full bg-[#f97316]/60"
        />
      ))}
    </div>
  );
}

export default function LoadingScreen({ onLoadingComplete, minLoadTime = 2500 }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const elapsed = Date.now() - startTime;
        const targetProgress = Math.min((elapsed / minLoadTime) * 100, 95);
        
        if (prev < targetProgress) {
          return Math.min(prev + Math.random() * 15, targetProgress);
        }
        return prev;
      });
    }, 100);

    // Check if all assets are loaded
    const checkLoaded = () => {
      const elapsed = Date.now() - startTime;
      
      if (document.readyState === 'complete' && elapsed >= minLoadTime) {
        clearInterval(progressInterval);
        setProgress(100);
        
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(onLoadingComplete, 800);
        }, 400);
      } else {
        requestAnimationFrame(checkLoaded);
      }
    };

    if (document.readyState === 'complete') {
      setTimeout(checkLoaded, minLoadTime);
    } else {
      window.addEventListener('load', () => setTimeout(checkLoaded, 100));
    }

    return () => {
      clearInterval(progressInterval);
    };
  }, [minLoadTime, onLoadingComplete]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0f172a] overflow-hidden"
        >
          {/* Animated background */}
          <div className="absolute inset-0">
            {/* Gradient orbs */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-radial from-[#f97316]/20 to-transparent blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-radial from-[#3b82f6]/15 to-transparent blur-3xl"
            />
            
            {/* Grid pattern */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(249,115,22,0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(249,115,22,0.3) 1px, transparent 1px)
                `,
                backgroundSize: '80px 80px',
              }}
            />
          </div>

          {/* Logo and content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* Animated Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
              className="relative mb-8"
            >
              {/* Glowing ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-8 rounded-full border border-[#f97316]/30"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-12 rounded-full border border-[#3b82f6]/20"
              />
              
              {/* Logo container */}
              <motion.div
                animate={{
                  filter: [
                    "drop-shadow(0 0 20px rgba(249,115,22,0.3))",
                    "drop-shadow(0 0 40px rgba(249,115,22,0.5))",
                    "drop-shadow(0 0 20px rgba(249,115,22,0.3))",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-28 h-28 flex items-center justify-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image
                    src="/logoicon.svg"
                    alt="Inovasiin Logo"
                    width={112}
                    height={112}
                    priority
                    className="w-28 h-28 object-contain"
                  />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Inovasi<span className="text-[#f97316]">in</span>
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="text-white/50 text-sm mt-2 tracking-widest uppercase"
              >
                Digital Creative Studio
              </motion.p>
            </motion.div>

            {/* Progress bar */}
            <div className="w-64 md:w-80">
              <div className="h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#f97316] to-[#fb923c] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex justify-between mt-3 text-xs text-white/40"
              >
                <span>Loading experience</span>
                <span>{Math.round(progress)}%</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Animated particles */}
          <Particles />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

