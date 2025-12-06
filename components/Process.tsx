"use client";

import { motion } from "framer-motion";
import { Search, Pencil, Code, FlaskConical, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Discover",
    subtitle: "Pahami Kebutuhan",
    description:
      "Kami mendengarkan ide dan kebutuhan Anda. Melalui diskusi mendalam, kami mengidentifikasi goals, target audience, dan scope project untuk memastikan solusi yang tepat sasaran.",
    icon: Search,
  },
  {
    number: "02",
    title: "Design",
    subtitle: "Rancang Solusi",
    description:
      "Tim desain kami mengembangkan wireframe, mockup, dan prototype interaktif. Anda bisa melihat dan memberikan feedback sebelum development dimulai.",
    icon: Pencil,
  },
  {
    number: "03",
    title: "Build",
    subtitle: "Kembangkan Produk",
    description:
      "Developer kami mengubah desain menjadi produk digital yang fungsional. Dengan teknologi terkini dan best practices, kami membangun solusi yang scalable.",
    icon: Code,
  },
  {
    number: "04",
    title: "Test & Iterate",
    subtitle: "Uji & Sempurnakan",
    description:
      "Quality assurance ketat untuk memastikan performa optimal. Kami melakukan iterasi berdasarkan testing dan feedback untuk hasil terbaik.",
    icon: FlaskConical,
  },
  {
    number: "05",
    title: "Launch & Support",
    subtitle: "Rilis & Dukungan",
    description:
      "Deployment profesional dan dukungan berkelanjutan. Kami tidak berhenti di launch—kami memastikan produk Anda terus berjalan dengan baik.",
    icon: Rocket,
  },
];

export default function Process() {
  return (
    <section id="process" className="relative section-padding overflow-hidden bg-gradient-to-b from-white via-[#1e3a5f]/5 to-white">
      {/* Background pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative z-10 container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 rounded-full bg-[#1e3a5f]/10 text-sm text-[#1e3a5f] font-medium mb-4"
          >
            How We Work
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1e3a5f] mb-4">
            Proses Kerja <span className="gradient-text">Kami</span>
          </h2>
          <p className="max-w-2xl mx-auto text-[#1e3a5f]/60 text-lg">
            Pendekatan sistematis untuk mengubah ide Anda menjadi produk digital yang sukses
          </p>
        </motion.div>

        {/* Process Steps - Desktop Horizontal */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f97316]/30 to-transparent" />

            <div className="grid grid-cols-5 gap-4">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="relative"
                >
                  {/* Step card */}
                  <motion.div
                    whileHover={{ y: -10 }}
                    className="group bg-white rounded-2xl p-6 h-full border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#f97316]/20 transition-all duration-300"
                  >
                    {/* Number */}
                    <div className="relative z-10 mb-6">
                      <span className="text-5xl font-bold text-[#1e3a5f]/10 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-br group-hover:from-[#f97316] group-hover:to-[#1e3a5f] transition-all duration-300">
                        /{step.number}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f97316]/10 to-[#1e3a5f]/10 flex items-center justify-center mb-4 group-hover:from-[#f97316]/20 group-hover:to-[#1e3a5f]/20 transition-all">
                      <step.icon className="w-6 h-6 text-[#f97316]" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-[#1e3a5f] mb-1 group-hover:text-[#f97316] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#f97316] mb-3">{step.subtitle}</p>

                    {/* Description */}
                    <p className="text-sm text-[#1e3a5f]/60 leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>

                  {/* Connector dot */}
                  <div className="absolute top-20 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#f97316]/50 shadow-sm" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Process Steps - Mobile/Tablet Vertical */}
        <div className="lg:hidden space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-start gap-4">
                  {/* Number & Icon */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <span className="text-4xl font-bold gradient-text">
                        /{step.number}
                      </span>
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-lg bg-gradient-to-br from-[#f97316]/20 to-[#1e3a5f]/20 flex items-center justify-center">
                        <step.icon className="w-5 h-5 text-[#f97316]" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl font-bold text-[#1e3a5f] mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#f97316] mb-2">{step.subtitle}</p>
                    <p className="text-sm text-[#1e3a5f]/60 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vertical connector */}
              {index < steps.length - 1 && (
                <div className="absolute left-8 top-full w-px h-6 bg-gradient-to-b from-[#f97316]/30 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
