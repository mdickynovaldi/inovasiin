"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#process", label: "How We Work" },
  { href: "#showcase", label: "Showcase" },
  { href: "#tech", label: "Tech Stack" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Update active section based on scroll position
      const sections = navLinks.map((link) => link.href.replace("#", ""));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "glass-strong py-3 shadow-md" : "bg-transparent py-5"
        )}>
        <div className="container-custom flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#home");
            }}
            className="relative group"
            whileHover={{ scale: 1.02 }}>
            <Image
              src="/Inovasiin.svg"
              alt="INOVASIIN Logo"
              width={300}
              height={300}
              className="h-10 sm:h-15 w-auto"
              priority
            />
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className={cn(
                  "relative text-sm font-medium transition-colors",
                  activeSection === link.href.replace("#", "")
                    ? "text-[#f97316]"
                    : "text-[#1e3a5f]/70 hover:text-[#1e3a5f]"
                )}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}>
                {link.label}
                {activeSection === link.href.replace("#", "") && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#f97316]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.a>
            ))}
          </div>

          {/* CTA Button - Desktop */}
          <motion.button
            onClick={() => scrollToSection("#contact")}
            className="hidden lg:flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-orange-500/25"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}>
            Let&apos;s Talk
          </motion.button>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#1e3a5f]"
            whileTap={{ scale: 0.9 }}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-white/95 backdrop-blur-xl"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="relative pt-24 px-6">
              <div className="flex flex-col gap-4">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className={cn(
                      "text-2xl font-medium py-3 border-b border-[#1e3a5f]/10 transition-colors",
                      activeSection === link.href.replace("#", "")
                        ? "text-[#f97316]"
                        : "text-[#1e3a5f]"
                    )}>
                    {link.label}
                  </motion.a>
                ))}
                <motion.button
                  onClick={() => scrollToSection("#contact")}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 w-full py-4 rounded-full bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white font-semibold text-lg">
                  Let&apos;s Talk
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
