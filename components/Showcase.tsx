"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { TrendingUp, Users, Clock, Award } from "lucide-react";
import Link from "next/link";

const projects = [
  {
    title: "VR Training Simulation",
    category: "Virtual Reality",
    industry: "Manufacturing Industry",
    description:
      "Platform VR training untuk keselamatan kerja di pabrik manufaktur. Simulasi imersif yang memungkinkan pekerja berlatih tanpa risiko.",
    image: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
    stats: [
      { icon: TrendingUp, value: "+40%", label: "Training Efficiency" },
      { icon: Clock, value: "-60%", label: "Training Time" },
    ],
    tags: ["Unity", "VR Headset", "Real-time 3D"],
  },
  {
    title: "Virtual Laboratory",
    category: "VR Education",
    industry: "Higher Education",
    description:
      "Laboratorium virtual untuk praktikum sains di universitas. Mahasiswa dapat melakukan eksperimen kimia dan fisika secara virtual.",
    image: "linear-gradient(135deg, #1e3a5f 0%, #0f2847 100%)",
    stats: [
      { icon: Users, value: "5000+", label: "Active Students" },
      { icon: Award, value: "98%", label: "Satisfaction Rate" },
    ],
    tags: ["WebXR", "3D Simulation", "LMS Integration"],
  },
  {
    title: "AR Product Viewer",
    category: "Augmented Reality",
    industry: "E-Commerce & Retail",
    description:
      "Aplikasi AR yang memungkinkan customer melihat produk furniture dalam skala nyata di ruangan mereka sebelum membeli.",
    image: "linear-gradient(135deg, #f97316 0%, #1e3a5f 100%)",
    stats: [
      { icon: TrendingUp, value: "+85%", label: "Conversion Rate" },
      { icon: Clock, value: "-45%", label: "Return Rate" },
    ],
    tags: ["ARKit", "ARCore", "3D Commerce"],
  },
  {
    title: "Brand Campaign Animation",
    category: "Motion Graphics",
    industry: "FMCG Brand",
    description:
      "Series motion graphics untuk kampanye digital brand FMCG. Animasi engaging untuk social media dan digital ads.",
    image: "linear-gradient(135deg, #1e3a5f 0%, #f97316 100%)",
    stats: [
      { icon: Users, value: "2.5M+", label: "Views" },
      { icon: TrendingUp, value: "+120%", label: "Engagement" },
    ],
    tags: ["After Effects", "Cinema 4D", "Social Media"],
  },
];

export default function Showcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <section
      id="showcase"
      ref={containerRef}
      className="relative section-padding overflow-hidden bg-white"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#f97316]/5 blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[#1e3a5f]/5 blur-[150px]" />

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
            Selected Projects
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1e3a5f] mb-4">
            Project <span className="gradient-text">Showcase</span>
          </h2>
          <p className="max-w-2xl mx-auto text-[#1e3a5f]/60 text-lg">
            Beberapa project yang menunjukkan kemampuan kami dalam menghadirkan solusi digital yang berdampak
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={index}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/portfolio">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 rounded-full border-2 border-[#f97316] text-[#f97316] font-medium hover:bg-[#f97316] hover:text-white transition-all"
            >
              Lihat Semua Project
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

interface ProjectCardProps {
  project: (typeof projects)[0];
  index: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}

function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      whileHover={{ y: -10 }}
      className="group"
    >
      <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#f97316]/20 transition-all duration-300">
        {/* Image/Gradient Preview */}
        <div
          className="relative h-48 sm:h-56"
          style={{ background: project.image }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />

          {/* Category badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs text-[#1e3a5f] font-medium shadow-sm">
              {project.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Industry */}
          <p className="text-sm text-[#f97316] font-medium mb-2">{project.industry}</p>

          {/* Title */}
          <h3 className="text-xl font-bold text-[#1e3a5f] mb-3 group-hover:text-[#f97316] transition-colors">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-[#1e3a5f]/60 text-sm leading-relaxed mb-4">
            {project.description}
          </p>

          {/* Stats */}
          <div className="flex gap-6 mb-4">
            {project.stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2">
                <stat.icon className="w-4 h-4 text-[#f97316]" />
                <div>
                  <p className="text-lg font-bold text-[#1e3a5f]">{stat.value}</p>
                  <p className="text-xs text-[#1e3a5f]/50">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 rounded-md bg-[#1e3a5f]/5 text-xs text-[#1e3a5f]/70"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
