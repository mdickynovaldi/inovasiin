"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const projectTypes = [
  "VR/AR Development",
  "Web & App Development",
  "3D Modelling & Animation",
  "Motion Graphics",
  "UI/UX Design",
  "Full Digital Solution",
  "Lainnya",
];

export default function Contact() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormState({
        name: "",
        email: "",
        company: "",
        projectType: "",
        message: "",
      });
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section
      id="contact"
      className="relative section-padding overflow-hidden bg-linear-to-b from-white via-[#1e3a5f]/5 to-[#1e3a5f]">
      {/* Background pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full bg-[#f97316]/10 blur-[150px]" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] rounded-full bg-[#1e3a5f]/20 blur-[150px]" />

      <div className="relative z-10 container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 rounded-full bg-[#f97316]/10 text-sm text-[#f97316] font-medium mb-4">
            Get In Touch
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1e3a5f] mb-4">
            Ready to <span className="gradient-text">Turn Your Ideas</span>
            <br />
            Into Reality?
          </h2>
          <p className="max-w-2xl mx-auto text-[#1e3a5f]/60 text-lg">
            Ceritakan project Anda dan mari diskusikan bagaimana kami bisa
            membantu mewujudkannya
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-[#1e3a5f] mb-4">
                Mari Berkolaborasi
              </h3>
              <p className="text-[#1e3a5f]/60">
                Kami selalu excited untuk mendiskusikan project baru. Kirim
                brief Anda atau jadwalkan meeting untuk membahas kebutuhan Anda.
              </p>
            </div>

            {/* Contact methods */}
            <div className="space-y-4">
              <motion.a
                href="mailto:inovasiin.id@gmail.com"
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#f97316]/30 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#f97316]/10 to-[#1e3a5f]/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#f97316]" />
                </div>
                <div>
                  <p className="text-sm text-[#1e3a5f]/50">Email</p>
                  <p className="text-[#1e3a5f] font-medium group-hover:text-[#f97316] transition-colors">
                    inovasiin.id@gmail.com
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#1e3a5f]/30 ml-auto group-hover:text-[#f97316] transition-colors" />
              </motion.a>

              <motion.a
                href="https://wa.me/6285156262400"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#f97316]/30 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#f97316]/10 to-[#1e3a5f]/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-[#f97316]" />
                </div>
                <div>
                  <p className="text-sm text-[#1e3a5f]/50">WhatsApp</p>
                  <p className="text-[#1e3a5f] font-medium group-hover:text-[#f97316] transition-colors">
                    +62 851-5626-2400
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#1e3a5f]/30 ml-auto group-hover:text-[#f97316] transition-colors" />
              </motion.a>

              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#f97316]/10 to-[#1e3a5f]/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#f97316]" />
                </div>
                <div>
                  <p className="text-sm text-[#1e3a5f]/50">Location</p>
                  <p className="text-[#1e3a5f] font-medium">Indonesia</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl p-6 sm:p-8 space-y-6 border border-gray-100 shadow-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm text-[#1e3a5f]/70 mb-2 font-medium">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#1e3a5f]/5 border border-[#1e3a5f]/10 text-[#1e3a5f] placeholder-[#1e3a5f]/40 focus:border-[#f97316] focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 transition-all"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm text-[#1e3a5f]/70 mb-2 font-medium">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#1e3a5f]/5 border border-[#1e3a5f]/10 text-[#1e3a5f] placeholder-[#1e3a5f]/40 focus:border-[#f97316] focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 transition-all"
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Company */}
                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm text-[#1e3a5f]/70 mb-2 font-medium">
                    Perusahaan/Organisasi
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formState.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#1e3a5f]/5 border border-[#1e3a5f]/10 text-[#1e3a5f] placeholder-[#1e3a5f]/40 focus:border-[#f97316] focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 transition-all"
                    placeholder="PT Example"
                  />
                </div>

                {/* Project Type */}
                <div>
                  <label
                    htmlFor="projectType"
                    className="block text-sm text-[#1e3a5f]/70 mb-2 font-medium">
                    Jenis Project *
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={formState.projectType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#1e3a5f]/5 border border-[#1e3a5f]/10 text-[#1e3a5f] focus:border-[#f97316] focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 transition-all appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231e3a5f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                    }}>
                    <option value="" className="bg-white">
                      Pilih jenis project
                    </option>
                    {projectTypes.map((type) => (
                      <option key={type} value={type} className="bg-white">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm text-[#1e3a5f]/70 mb-2 font-medium">
                  Detail Project *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-[#1e3a5f]/5 border border-[#1e3a5f]/10 text-[#1e3a5f] placeholder-[#1e3a5f]/40 focus:border-[#f97316] focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 transition-all resize-none"
                  placeholder="Ceritakan tentang project Anda: tujuan, timeline, budget range, dan hal lain yang perlu kami ketahui..."
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitted}
                className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all ${
                  isSubmitted
                    ? "bg-green-500 text-white"
                    : "bg-linear-to-r from-[#f97316] to-[#ea580c] text-white hover:shadow-lg hover:shadow-orange-500/25"
                }`}>
                {isSubmitted ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Terima kasih! Kami akan segera menghubungi Anda.
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Kirim Pesan
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
