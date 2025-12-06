"use client";

import { motion } from "framer-motion";

const techCategories = [
  {
    title: "3D & VR Development",
    techs: [
      { name: "Unity", icon: "🎮" },
      { name: "Unreal Engine", icon: "🎯" },
      { name: "Blender", icon: "🎨" },
      { name: "Maya", icon: "💎" },
      { name: "Cinema 4D", icon: "🎬" },
    ],
  },
  {
    title: "Web & Mobile Development",
    techs: [
      { name: "React", icon: "⚛️" },
      { name: "Next.js", icon: "▲" },
      { name: "TypeScript", icon: "📘" },
      { name: "Tailwind CSS", icon: "🎨" },
      { name: "Flutter", icon: "📱" },
      { name: "React Native", icon: "📲" },
    ],
  },
  {
    title: "Design & Animation",
    techs: [
      { name: "Figma", icon: "🎨" },
      { name: "After Effects", icon: "✨" },
      { name: "Premiere Pro", icon: "🎬" },
      { name: "Illustrator", icon: "🖌️" },
      { name: "Photoshop", icon: "📸" },
    ],
  },
  {
    title: "AR & Immersive Tech",
    techs: [
      { name: "ARKit", icon: "📱" },
      { name: "ARCore", icon: "🤖" },
      { name: "WebXR", icon: "🌐" },
      { name: "Spark AR", icon: "✨" },
      { name: "8th Wall", icon: "🔮" },
    ],
  },
];

export default function TechStack() {
  return (
    <section id="tech" className="relative section-padding overflow-hidden bg-gradient-to-b from-white via-[#1e3a5f]/5 to-white">
      {/* Background pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Decorative elements */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-[#f97316]/5 blur-[120px] -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-[#1e3a5f]/5 blur-[120px] -translate-y-1/2" />

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
            Tech Stack
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1e3a5f] mb-4">
            Teknologi <span className="gradient-text">Yang Kami Gunakan</span>
          </h2>
          <p className="max-w-2xl mx-auto text-[#1e3a5f]/60 text-lg">
            Tools dan framework terbaik untuk menghadirkan solusi digital berkualitas tinggi
          </p>
        </motion.div>

        {/* Tech Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {techCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            >
              {/* Category Title */}
              <h3 className="text-lg font-semibold text-[#1e3a5f] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#f97316]" />
                {category.title}
              </h3>

              {/* Tech Items */}
              <div className="flex flex-wrap gap-3">
                {category.techs.map((tech, techIndex) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.3,
                      delay: categoryIndex * 0.1 + techIndex * 0.05,
                    }}
                    whileHover={{
                      scale: 1.1,
                      y: -5,
                      transition: { duration: 0.2 },
                    }}
                    className="group px-4 py-2 rounded-xl bg-[#1e3a5f]/5 border border-[#1e3a5f]/10 hover:border-[#f97316]/50 hover:bg-[#f97316]/5 transition-all cursor-default"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{tech.icon}</span>
                      <span className="text-sm text-[#1e3a5f]/80 group-hover:text-[#1e3a5f] font-medium transition-colors">
                        {tech.name}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional tools mention */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-[#1e3a5f]/50 text-sm">
            Dan masih banyak lagi tools lainnya yang kami sesuaikan dengan kebutuhan project Anda
          </p>
        </motion.div>
      </div>
    </section>
  );
}
