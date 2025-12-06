"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Box,
  Globe,
  Palette,
  FileImage,
  Layers,
  Video,
  Glasses,
  Smartphone,
} from "lucide-react";

const services = [
  {
    icon: Box,
    title: "3D Modelling & Asset Creation",
    description:
      "Pembuatan model 3D high-quality untuk game, animasi, visualisasi produk, dan aplikasi AR/VR. Dari concept art hingga render final.",
    gradient: "from-[#f97316] to-[#ea580c]",
  },
  {
    icon: Globe,
    title: "Web & App Development",
    description:
      "Pengembangan website modern, aplikasi mobile, dan LMS yang responsif, cepat, dan user-friendly. Dibangun dengan teknologi terkini.",
    gradient: "from-[#1e3a5f] to-[#0f2847]",
  },
  {
    icon: Palette,
    title: "2D Design & Illustration",
    description:
      "Desain grafis dan ilustrasi custom untuk branding, social media content, dan materi pemasaran yang memukau audience Anda.",
    gradient: "from-[#f97316] to-[#fb923c]",
  },
  {
    icon: FileImage,
    title: "Poster & Print Design",
    description:
      "Desain poster profesional untuk event, kampanye, dan promosi. Eye-catching dan efektif menyampaikan pesan Anda.",
    gradient: "from-[#22c55e] to-[#16a34a]",
  },
  {
    icon: Layers,
    title: "Prototype Development",
    description:
      "Pengembangan prototype interaktif untuk presentasi, pitching investor, dan user testing. Validasi ide sebelum development penuh.",
    gradient: "from-[#1e3a5f] to-[#2d4a6f]",
  },
  {
    icon: Video,
    title: "Motion Graphics & Animation",
    description:
      "Video animasi profesional untuk iklan, tutorial, explainer video, dan presentasi yang engaging dan memorable.",
    gradient: "from-[#f97316] to-[#1e3a5f]",
  },
  {
    icon: Glasses,
    title: "Virtual Reality (VR)",
    description:
      "Pengembangan konten VR immersive untuk training, simulasi industri, virtual tour, dan pengalaman edukasi interaktif.",
    gradient: "from-[#1e3a5f] to-[#f97316]",
  },
  {
    icon: Smartphone,
    title: "Augmented Reality (AR)",
    description:
      "Aplikasi AR inovatif yang memadukan digital dengan dunia nyata. Product visualization, interactive marketing, dan edukasi.",
    gradient: "from-[#ea580c] to-[#f97316]",
  },
];

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const leftColumnY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const rightColumnY = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <section
      id="services"
      ref={containerRef}
      className="relative section-padding overflow-hidden bg-white"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-[#f97316]/5 blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#1e3a5f]/5 blur-[100px]" />

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
            className="inline-block px-4 py-1.5 rounded-full bg-[#f97316]/10 text-sm text-[#f97316] font-medium mb-4"
          >
            What We Build
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1e3a5f] mb-4">
            Layanan <span className="gradient-text">Digital & Kreatif</span>
          </h2>
          <p className="max-w-2xl mx-auto text-[#1e3a5f]/60 text-lg">
            Mulai dari satu layanan atau paket end-to-end. Kami siap membantu dari konsep hingga produk jadi.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <motion.div style={{ y: leftColumnY }} className="space-y-6">
            {services.slice(0, 4).map((service, index) => (
              <ServiceCard
                key={service.title}
                service={service}
                index={index}
              />
            ))}
          </motion.div>

          {/* Right Column */}
          <motion.div style={{ y: rightColumnY }} className="space-y-6">
            {services.slice(4).map((service, index) => (
              <ServiceCard
                key={service.title}
                service={service}
                index={index + 4}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#f97316]/20 transition-all duration-300"
    >
      <div className="flex gap-5">
        {/* Icon */}
        <div
          className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${service.gradient} p-0.5`}
        >
          <div className="w-full h-full rounded-xl bg-white flex items-center justify-center group-hover:bg-transparent transition-colors duration-300">
            <service.icon className="w-6 h-6 text-[#1e3a5f] group-hover:text-white transition-colors" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-[#1e3a5f] mb-2 group-hover:text-[#f97316] transition-colors">
            {service.title}
          </h3>
          <p className="text-[#1e3a5f]/60 text-sm leading-relaxed">
            {service.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
