"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navLinks = [
  { href: "#home", label: "Home", isExternal: false },
  { href: "#services", label: "Services", isExternal: false },
  { href: "#process", label: "How We Work", isExternal: false },
  { href: "/portfolio", label: "Portfolio", isExternal: true },
  { href: "#tech", label: "Tech Stack", isExternal: false },
  { href: "#about", label: "About", isExternal: false },
  { href: "#contact", label: "Contact", isExternal: false },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const pathname = usePathname();
  const router = useRouter();
  // Detect all portfolio pages (list and detail)
  const isPortfolioPage = pathname?.startsWith("/portfolio");
  const isPortfolioDetailPage = pathname?.startsWith("/portfolio/");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Update active section based on scroll position (only on home page)
      if (!isPortfolioPage) {
        const sections = navLinks
          .filter((link) => !link.isExternal)
          .map((link) => link.href.replace("#", ""));
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
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isPortfolioPage]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (link: (typeof navLinks)[0], e: React.MouseEvent) => {
    if (link.isExternal) {
      // Let the Link component handle navigation
      setIsMobileMenuOpen(false);
      return;
    }

    e.preventDefault();
    if (isPortfolioPage) {
      // Navigate to home page with hash
      router.push(`/${link.href}`);
    } else {
      scrollToSection(link.href);
    }
  };

  // Determine if we should use light (white) text - on portfolio pages with dark/gradient background and not scrolled
  const useLightText = isPortfolioPage && !isScrolled;

  // For portfolio detail pages, use a subtle glass background even when not scrolled for better readability
  const useSubtleBackground = isPortfolioDetailPage && !isScrolled;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "glass-strong py-3 shadow-md"
            : useSubtleBackground
            ? "bg-black/10 backdrop-blur-md py-4 border-b border-white/10"
            : isPortfolioPage
            ? "bg-transparent py-5"
            : "bg-transparent py-5"
        )}>
        <div className="container-custom flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative group">
            <motion.div whileHover={{ scale: 1.02 }}>
              <Image
                src="/Inovasiin.svg"
                alt="INOVASIIN Logo"
                width={300}
                height={300}
                className={cn(
                  "h-10 sm:h-15 w-auto transition-all duration-300",
                  useLightText && "brightness-0 invert"
                )}
                priority
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              // On portfolio page, only Portfolio link should be active
              const isActive = link.isExternal
                ? isPortfolioPage && link.href === "/portfolio"
                : !isPortfolioPage &&
                  activeSection === link.href.replace("#", "");

              if (link.isExternal) {
                return (
                  <Link key={link.href} href={link.href}>
                    <motion.span
                      className={cn(
                        "relative text-sm font-medium transition-colors cursor-pointer",
                        isActive
                          ? "text-[#f97316]"
                          : useLightText
                          ? "text-white/70 hover:text-white"
                          : "text-[#1e3a5f]/70 hover:text-[#1e3a5f]"
                      )}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}>
                      {link.label}
                      {isActive && (
                        <motion.div
                          layoutId="activeSection"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#f97316]"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                    </motion.span>
                  </Link>
                );
              }

              return (
                <motion.a
                  key={link.href}
                  href={isPortfolioPage ? `/${link.href}` : link.href}
                  onClick={(e) => handleNavClick(link, e)}
                  className={cn(
                    "relative text-sm font-medium transition-colors",
                    isActive
                      ? "text-[#f97316]"
                      : useLightText
                      ? "text-white/70 hover:text-white"
                      : "text-[#1e3a5f]/70 hover:text-[#1e3a5f]"
                  )}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}>
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#f97316]"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.a>
              );
            })}
          </div>

          {/* CTA Button - Desktop */}
          <Link
            href={isPortfolioPage ? "/#contact" : "#contact"}
            onClick={(e) => {
              if (!isPortfolioPage) {
                e.preventDefault();
                scrollToSection("#contact");
              }
            }}>
            <motion.div
              className="hidden lg:flex items-center gap-2 px-6 py-2.5 rounded-full bg-linear-to-r from-[#f97316] to-[#ea580c] text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-orange-500/25"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}>
              Let&apos;s Talk
            </motion.div>
          </Link>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "lg:hidden p-2 transition-colors",
              useLightText ? "text-white" : "text-[#1e3a5f]"
            )}
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
                {navLinks.map((link, index) => {
                  // On portfolio page, only Portfolio link should be active
                  const isActive = link.isExternal
                    ? isPortfolioPage && link.href === "/portfolio"
                    : !isPortfolioPage &&
                      activeSection === link.href.replace("#", "");

                  if (link.isExternal) {
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}>
                        <motion.span
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + index * 0.05 }}
                          className={cn(
                            "block text-2xl font-medium py-3 border-b border-[#1e3a5f]/10 transition-colors",
                            isActive ? "text-[#f97316]" : "text-[#1e3a5f]"
                          )}>
                          {link.label}
                        </motion.span>
                      </Link>
                    );
                  }

                  return (
                    <motion.a
                      key={link.href}
                      href={isPortfolioPage ? `/${link.href}` : link.href}
                      onClick={(e) => handleNavClick(link, e)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className={cn(
                        "text-2xl font-medium py-3 border-b border-[#1e3a5f]/10 transition-colors",
                        isActive ? "text-[#f97316]" : "text-[#1e3a5f]"
                      )}>
                      {link.label}
                    </motion.a>
                  );
                })}
                <Link
                  href={isPortfolioPage ? "/#contact" : "#contact"}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (!isPortfolioPage) {
                      document
                        .getElementById("contact")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6 w-full py-4 rounded-full bg-linear-to-r from-[#f97316] to-[#ea580c] text-white font-semibold text-lg text-center">
                    Let&apos;s Talk
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
