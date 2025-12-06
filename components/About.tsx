"use client";

import { motion } from "framer-motion";
import { Target, Users, Lightbulb, CheckCircle } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Result-Oriented",
    description:
      "Fokus pada hasil yang berdampak nyata untuk bisnis Anda, bukan sekadar deliverables.",
  },
  {
    icon: Users,
    title: "Collaborative",
    description:
      "Bekerja erat dengan tim Anda dari brainstorming hingga deployment.",
  },
  {
    icon: Lightbulb,
    title: "Innovative",
    description:
      "Menghadirkan solusi kreatif dengan teknologi terkini untuk keunggulan kompetitif.",
  },
];

const expertise = [
  "VR Training & Simulation",
  "AR Product Experiences",
  "3D Modeling & Animation",
  "Web & Mobile Development",
  "Motion Graphics & Video",
  "UI/UX Design",
  "LMS Development",
  "Interactive Experiences",
];

export default function About() {
  return (
    <section id="about" className="relative section-padding overflow-hidden bg-white">
      {/* Background decorations */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#f97316]/5 blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-[#1e3a5f]/5 blur-[150px]" />

      <div className="relative z-10 container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-1.5 rounded-full bg-[#f97316]/10 text-sm text-[#f97316] font-medium mb-4"
            >
              About Us
            </motion.span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1e3a5f] mb-6">
              <span className="gradient-text">Turn Your Ideas</span>
              <br />
              Into Reality
            </h2>

            <div className="space-y-4 text-[#1e3a5f]/70 mb-8">
              <p className="text-lg">
                <span className="text-[#1e3a5f] font-medium">
                  PT INOVASIIN SMART SOLUTION
                </span>{" "}
                adalah studio digital dan kreatif yang berkomitmen merealisasikan setiap ide dari customer menjadi produk digital yang mengesankan.
              </p>
              <p>
                Kami memahami bahwa setiap bisnis dan industri memiliki kebutuhan unik. Dengan pendekatan kolaboratif, tim kami bekerja erat dengan Anda dari tahap brainstorming hingga produk siap deploy.
              </p>
              <p>
                Dari VR training untuk industri manufaktur, virtual lab untuk pendidikan, hingga AR experience untuk retail—kami punya expertise dan passion untuk menghadirkan solusi yang berdampak.
              </p>
            </div>

            {/* Expertise tags */}
            <div className="flex flex-wrap gap-2">
              {expertise.map((item, index) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1e3a5f]/5 border border-[#1e3a5f]/10 text-sm text-[#1e3a5f]/80"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-[#f97316]" />
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Values Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ x: 10 }}
                className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#f97316]/20 transition-all"
              >
                <div className="flex gap-5">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#f97316]/10 to-[#1e3a5f]/10 flex items-center justify-center group-hover:from-[#f97316]/20 group-hover:to-[#1e3a5f]/20 transition-all">
                    <value.icon className="w-6 h-6 text-[#f97316]" />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-xl font-semibold text-[#1e3a5f] mb-2 group-hover:text-[#f97316] transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-[#1e3a5f]/60 text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="grid grid-cols-3 gap-4 pt-4"
            >
              {[
                { value: "50+", label: "Projects" },
                { value: "30+", label: "Clients" },
                { value: "5+", label: "Years" },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center p-4 rounded-xl bg-gradient-to-br from-[#f97316]/5 to-[#1e3a5f]/5 border border-gray-100"
                >
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="text-2xl sm:text-3xl font-bold gradient-text"
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-xs text-[#1e3a5f]/50 mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
