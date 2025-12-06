"use client";

import { motion } from "framer-motion";
import { Building2, GraduationCap, Factory, Megaphone, Presentation } from "lucide-react";

const industries = [
  { icon: GraduationCap, label: "Education" },
  { icon: Factory, label: "Industry" },
  { icon: Building2, label: "Training" },
  { icon: Megaphone, label: "Marketing" },
  { icon: Presentation, label: "Exhibitions" },
];

export default function TrustedBy() {
  return (
    <section className="relative py-16 overflow-hidden bg-gradient-to-b from-white via-gray-50/50 to-white">
      <div className="relative z-10 container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-sm uppercase tracking-widest text-[#f97316] font-medium mb-2">
            Ideal for
          </p>
          <h3 className="text-xl text-[#1e3a5f]">
            Berbagai Industri & Kebutuhan Digital Anda
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-6 md:gap-12"
        >
          {industries.map((industry, index) => (
            <motion.div
              key={industry.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -5, scale: 1.05 }}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-white shadow-lg border border-gray-100 flex items-center justify-center group-hover:border-[#f97316]/30 group-hover:shadow-orange-500/10 transition-all">
                <industry.icon className="w-7 h-7 text-[#1e3a5f]/60 group-hover:text-[#f97316] transition-colors" />
              </div>
              <span className="text-sm text-[#1e3a5f]/70 group-hover:text-[#1e3a5f] font-medium transition-colors">
                {industry.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 h-px bg-gradient-to-r from-transparent via-[#f97316]/30 to-transparent"
        />
      </div>
    </section>
  );
}
