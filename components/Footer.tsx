"use client";

import { motion } from "framer-motion";
import {
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  ArrowUpRight,
} from "lucide-react";
import Image from "next/image";

const footerLinks = {
  services: [
    { label: "3D Modelling", href: "#services" },
    { label: "VR Development", href: "#services" },
    { label: "AR Development", href: "#services" },
    { label: "Web & App Dev", href: "#services" },
    { label: "Motion Graphics", href: "#services" },
  ],
  company: [
    { label: "About Us", href: "#about" },
    { label: "How We Work", href: "#process" },
    { label: "Tech Stack", href: "#tech" },
    { label: "Showcase", href: "#showcase" },
  ],
  contact: [
    { label: "inovasiin.id@gmail.com", href: "mailto:inovasiin.id@gmail.com" },
    { label: "+6285156262400", href: "https://wa.me/6285156262400" },
  ],
};

const socialLinks = [
  {
    icon: Instagram,
    href: "https://www.instagram.com/inovasiin/",
    label: "Instagram",
  },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/company/inovasiin/",
    label: "LinkedIn",
  },
  { icon: Twitter, href: "https://twitter.com/inovasiin", label: "Twitter" },
  {
    icon: Youtube,
    href: "https://www.youtube.com/@inovasiin",
    label: "YouTube",
  },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative pt-20 pb-8 overflow-hidden bg-[#1e3a5f]">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f97316]/50 to-transparent" />

      <div className="relative z-10 container-custom">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <motion.a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToTop();
              }}
              className="inline-block mb-4"
              whileHover={{ scale: 1.02 }}>
              <Image
                src="/Inovasiin.svg"
                alt="INOVASIIN Logo"
                width={140}
                height={40}
                className="h-10 w-auto brightness-0 invert"
              />
            </motion.a>
            <p className="text-white/60 text-sm mb-6 leading-relaxed">
              Turn your ideas into reality. Digital creative studio yang
              berkomitmen menghadirkan solusi VR, AR, 3D, dan pengembangan
              digital berkualitas tinggi.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.1 }}
                  className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#f97316] hover:border-[#f97316]/30 hover:bg-[#f97316]/10 transition-all"
                  aria-label={social.label}>
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/60 hover:text-[#f97316] transition-colors inline-flex items-center gap-1 group">
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/60 hover:text-[#f97316] transition-colors inline-flex items-center gap-1 group">
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-white font-semibold mb-4">Get in Touch</h4>
            <ul className="space-y-3">
              {footerLinks.contact.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      link.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="text-sm text-white/60 hover:text-[#f97316] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.02 }}
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full bg-[#f97316] text-white text-sm font-medium hover:bg-[#ea580c] transition-all">
              Start a Project
              <ArrowUpRight className="w-4 h-4" />
            </motion.a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/40">
              © {new Date().getFullYear()} PT INOVASIIN SMART SOLUTION. All
              rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-sm text-white/40 hover:text-white/70 transition-colors">
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-white/40 hover:text-white/70 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5 }}
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white flex items-center justify-center shadow-lg shadow-orange-500/25 z-50"
          aria-label="Back to top">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </motion.button>
      </div>
    </footer>
  );
}
