"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Users,
  Award,
  TrendingUp,
  Eye,
  ExternalLink,
  Quote,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Target,
  Lightbulb,
  CheckCircle2,
  Layers,
  Loader2,
  Star,
  Heart,
  Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getPortfolioById, getAllPortfolios } from "@/lib/portfolioService";
import { PortfolioWithRelations } from "@/types/database";
import YouTube from "react-youtube";
import Image from "next/image";

// Icon mapping
const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } =
  {
    TrendingUp,
    Clock,
    Users,
    Award,
    Eye,
    Star,
    Heart,
    Zap,
    Target,
    CheckCircle: CheckCircle2,
  };

// Generate gradient based on category
function getCategoryGradient(category: string): string {
  const gradients: { [key: string]: string } = {
    "Virtual Reality": "from-[#f97316] via-[#ea580c] to-[#dc2626]",
    "Augmented Reality": "from-[#f97316] to-[#1e3a5f]",
    "Web Development": "from-[#0ea5e9] via-[#1e3a5f] to-[#22c55e]",
    "3D Modeling": "from-[#a855f7] via-[#1e3a5f] to-[#f97316]",
    "Motion Graphics": "from-[#1e3a5f] via-[#f97316] to-[#ea580c]",
  };
  return gradients[category] || "from-[#1e3a5f] to-[#0f2847]";
}

export default function PortfolioDetailPage() {
  const params = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [portfolio, setPortfolio] = useState<PortfolioWithRelations | null>(
    null
  );
  const [allPortfolios, setAllPortfolios] = useState<PortfolioWithRelations[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const portfolioId = params.id as string;

  // useScroll - only use when not loading to prevent hydration issues
  const { scrollYProgress } = useScroll({
    target: loading ? undefined : heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    async function loadData() {
      try {
        const [portfolioData, allData] = await Promise.all([
          getPortfolioById(portfolioId),
          getAllPortfolios(),
        ]);

        if (!portfolioData) {
          setError("Portfolio tidak ditemukan");
        } else {
          setPortfolio(portfolioData);
          setAllPortfolios(allData);
        }
      } catch (err) {
        console.error("Error loading portfolio:", err);
        setError("Gagal memuat portfolio");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [portfolioId]);

  // Get next and previous portfolio items
  const currentIndex = allPortfolios.findIndex(
    (item) => item.id === portfolioId
  );
  const prevPortfolio =
    currentIndex > 0
      ? allPortfolios[currentIndex - 1]
      : allPortfolios[allPortfolios.length - 1];
  const nextPortfolio =
    currentIndex < allPortfolios.length - 1
      ? allPortfolios[currentIndex + 1]
      : allPortfolios[0];

  // Loading State
  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#c2410c] mx-auto mb-4" />
          <p className="text-[#475569]">Memuat portfolio...</p>
        </div>
      </main>
    );
  }

  // Error or Not Found State
  if (error || !portfolio) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#1e3a5f] mb-4">
            Portfolio Tidak Ditemukan
          </h1>
          <p className="text-[#475569] mb-6">
            {error || "Portfolio yang Anda cari tidak ada."}
          </p>
          <Link href="/portfolio">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#f97316] text-white font-medium">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Portfolio
            </motion.button>
          </Link>
        </div>
      </main>
    );
  }

  const gradient = getCategoryGradient(portfolio.category);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  const paginate = (newDirection: number) => {
    const mediaLength = portfolio.media?.length || 1;
    const newPage = activeImage + newDirection;
    if (newPage >= 0 && newPage < mediaLength) {
      setActiveImage(newPage);
    } else if (newPage < 0) {
      setActiveImage(mediaLength - 1);
    } else {
      setActiveImage(0);
    }
  };

  return (
    <main className="relative overflow-hidden bg-white" ref={containerRef}>
      <Navbar />

      {/* Hero Section — light brand theme with 3D glass product shot */}
      <section
        ref={heroRef}
        className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-b from-white via-[#f8fafc] to-white">
        {/* Soft brand background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 grid-pattern opacity-40" />
          <div className="absolute top-1/4 right-0 w-[28rem] h-[28rem] rounded-full bg-[#f97316]/10 blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-[#1e3a5f]/10 blur-[120px]" />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 container-custom">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-[#475569] hover:text-[#c2410c] transition-colors group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Kembali ke Portfolio</span>
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* LEFT — project info */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible">
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-1.5 rounded-full bg-[#f97316]/10 text-sm text-[#c2410c] font-semibold">
                  {portfolio.category}
                </span>
                {portfolio.year && (
                  <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1e3a5f]/5 border border-[#1e3a5f]/10 text-sm text-[#475569]">
                    <Calendar className="w-4 h-4" />
                    {portfolio.year}
                  </span>
                )}
                {portfolio.duration && (
                  <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1e3a5f]/5 border border-[#1e3a5f]/10 text-sm text-[#475569]">
                    <Clock className="w-4 h-4" />
                    {portfolio.duration}
                  </span>
                )}
                {portfolio.is_featured && (
                  <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white text-sm font-semibold shadow-lg shadow-orange-500/25">
                    <Star className="w-4 h-4" />
                    Featured
                  </span>
                )}
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#1e3a5f] mb-5 leading-[1.1]">
                {portfolio.title}
              </motion.h1>

              {portfolio.industry && (
                <motion.p
                  variants={itemVariants}
                  className="text-lg sm:text-xl text-[#475569] mb-8 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#c2410c]" />
                  {portfolio.industry}
                </motion.p>
              )}

              {portfolio.client && (
                <motion.div
                  variants={itemVariants}
                  className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#2d4a6f] flex items-center justify-center shadow-md">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-[#64748b] text-sm">Client</p>
                    <p className="text-[#1e3a5f] font-semibold">
                      {portfolio.client}
                    </p>
                  </div>
                </motion.div>
              )}

              {portfolio.project_url && (
                <motion.div variants={itemVariants} className="mt-8">
                  <a
                    href={portfolio.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white font-semibold shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all">
                    {portfolio.project_url_label || "Kunjungi Project"}
                    <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </motion.div>
              )}
            </motion.div>

            {/* RIGHT — hero screenshot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="relative">
              <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-white shadow-2xl shadow-[#1e3a5f]/20 ring-1 ring-[#1e3a5f]/10">
                {portfolio.thumbnail_url ? (
                  <Image
                    src={portfolio.thumbnail_url}
                    alt={portfolio.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    quality={90}
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div
                    className={`w-full h-full bg-gradient-to-br ${getCategoryGradient(
                      portfolio.category
                    )} flex items-center justify-center`}>
                    <span className="text-white text-7xl font-bold">
                      {portfolio.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              {/* soft floating accent behind the frame */}
              <div className="absolute -bottom-5 -right-5 w-28 h-28 rounded-2xl bg-gradient-to-br from-[#f97316] to-[#ea580c] opacity-80 blur-2xl -z-10" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      {portfolio.stats && portfolio.stats.length > 0 && (
        <section className="relative py-12 -mt-16 z-20">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {portfolio.stats.map((stat, index) => {
                const IconComponent = iconMap[stat.icon] || TrendingUp;
                return (
                  <motion.div
                    key={stat.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-linear-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center shadow-lg shadow-orange-500/25">
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-[#1e3a5f]">
                          {stat.value}
                        </p>
                        <p className="text-[#475569] text-sm">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      )}

      {/* Overview Section */}
      <section className="relative section-padding overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-40" />

        <div className="relative z-10 container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}>
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#f97316]/10 text-sm text-[#c2410c] font-medium mb-6">
                Project Overview
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1e3a5f] mb-6">
                Tentang <span className="gradient-text">Proyek Ini</span>
              </h2>
              {portfolio.description ? (
                <div
                  className="text-lg text-[#475569] leading-relaxed mb-8 prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: portfolio.description }}
                />
              ) : portfolio.subtitle ? (
                <p className="text-lg text-[#475569] leading-relaxed mb-8">
                  {portfolio.subtitle}
                </p>
              ) : null}

              {/* Tags */}
              {portfolio.tags && portfolio.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {portfolio.tags.map((tag) => (
                    <motion.span
                      key={tag.id}
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 rounded-full bg-[#1e3a5f]/5 text-sm text-[#1e3a5f] font-medium border border-[#1e3a5f]/10 hover:border-[#f97316]/30 hover:bg-[#f97316]/5 transition-all">
                      {tag.name}
                    </motion.span>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Gallery Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative">
              <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-2xl">
                {/* Media Display */}
                {portfolio.media && portfolio.media.length > 0 ? (
                  <>
                    {portfolio.media[activeImage].type === "image" ? (
                      <Image
                        key={portfolio.media[activeImage].url}
                        src={portfolio.media[activeImage].url}
                        alt={portfolio.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 55vw"
                        quality={90}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full">
                        <YouTube
                          videoId={portfolio.media[activeImage].url}
                          opts={{
                            width: "100%",
                            height: "100%",
                            playerVars: { autoplay: 0 },
                          }}
                          className="w-full h-full"
                        />
                      </div>
                    )}

                    {/* Image Navigation */}
                    {portfolio.media.length > 1 && (
                      <>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-3 py-2 rounded-full bg-[#1e3a5f]/55 backdrop-blur-md ring-1 ring-white/15">
                          {portfolio.media.map((_, idx) => (
                            <motion.button
                              key={idx}
                              onClick={() => setActiveImage(idx)}
                              whileHover={{ scale: 1.2 }}
                              aria-label={`Lihat gambar ${idx + 1}`}
                              className={`h-2.5 rounded-full transition-all ${
                                activeImage === idx
                                  ? "w-6 bg-[#f97316]"
                                  : "w-2.5 bg-white/60 hover:bg-white"
                              }`}
                            />
                          ))}
                        </div>

                        {/* Navigation Arrows — dark backdrop so they stay
                            visible over white-dominant screenshots. */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => paginate(-1)}
                          aria-label="Gambar sebelumnya"
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#1e3a5f]/70 backdrop-blur-md ring-1 ring-white/20 shadow-lg flex items-center justify-center text-white hover:bg-[#1e3a5f] transition-all">
                          <ChevronLeft className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => paginate(1)}
                          aria-label="Gambar berikutnya"
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#1e3a5f]/70 backdrop-blur-md ring-1 ring-white/20 shadow-lg flex items-center justify-center text-white hover:bg-[#1e3a5f] transition-all">
                          <ChevronRight className="w-5 h-5" />
                        </motion.button>
                      </>
                    )}
                  </>
                ) : (
                  /* Gradient placeholder */
                  <div className={`absolute inset-0 bg-linear-to-br ${gradient}`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="text-white/70 text-9xl font-bold">
                        {portfolio.title.charAt(0)}
                      </motion.div>
                    </div>
                  </div>
                )}
              </div>

              {/* Decorative Elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute -top-6 -right-6 w-24 h-24 border border-[#f97316]/30 rounded-xl -z-10"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Challenge, Solution, Result Section */}
      {(portfolio.challenge || portfolio.solution || portfolio.result) && (
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-[#1e3a5f] to-[#0f2847]" />
          <div className="absolute inset-0 grid-pattern opacity-10" />

          <motion.div
            animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-[10%] w-80 h-80 rounded-full bg-[#f97316]/10 blur-[100px]"
          />

          <div className="relative z-10 container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#f97316]/20 text-sm text-[#f97316] font-medium mb-4">
                Project Journey
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                Dari <span className="text-[#f97316]">Tantangan</span> Ke Solusi
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Challenge */}
              {portfolio.challenge && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0 }}
                  whileHover={{ y: -10 }}
                  className="group">
                  <div className="relative h-full bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-[#f97316]/30 transition-all overflow-hidden">
                    <motion.div
                      whileHover={{ rotate: 10 }}
                      className="w-16 h-16 rounded-2xl bg-linear-to-br from-red-500 to-orange-500 flex items-center justify-center mb-6 shadow-lg">
                      <Target className="w-8 h-8 text-white" />
                    </motion.div>

                    <h3 className="text-xl font-bold text-white mb-4">
                      Tantangan
                    </h3>
                    <p className="text-white/70 leading-relaxed">
                      {portfolio.challenge}
                    </p>

                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-red-500 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </div>
                </motion.div>
              )}

              {/* Solution */}
              {portfolio.solution && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group">
                  <div className="relative h-full bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-[#f97316]/30 transition-all overflow-hidden">
                    <motion.div
                      whileHover={{ rotate: 10 }}
                      className="w-16 h-16 rounded-2xl bg-linear-to-brrom-[#f97316] to-[#ea580c] flex items-center justify-center mb-6 shadow-lg shadow-orange-500/25">
                      <Lightbulb className="w-8 h-8 text-white" />
                    </motion.div>

                    <h3 className="text-xl font-bold text-white mb-4">
                      Solusi
                    </h3>
                    <p className="text-white/70 leading-relaxed">
                      {portfolio.solution}
                    </p>

                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-rrom-[#f97316] to-[#ea580c] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </div>
                </motion.div>
              )}

              {/* Result */}
              {portfolio.result && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  whileHover={{ y: -10 }}
                  className="group">
                  <div className="relative h-full bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-[#f97316]/30 transition-all overflow-hidden">
                    <motion.div
                      whileHover={{ rotate: 10 }}
                      className="w-16 h-16 rounded-2xl bg-linear-to-brrom-green-500 to-emerald-500 flex items-center justify-center mb-6 shadow-lg">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </motion.div>

                    <h3 className="text-xl font-bold text-white mb-4">Hasil</h3>
                    <p className="text-white/70 leading-relaxed">
                      {portfolio.result}
                    </p>

                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-rrom-green-500 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Technologies Section */}
      {portfolio.technologies && portfolio.technologies.length > 0 && (
        <section className="relative section-padding overflow-hidden bg-white">
          <div className="absolute inset-0 grid-pattern opacity-40" />
          <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-[#f97316]/5 blur-[150px]" />

          <div className="relative z-10 container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#f97316]/10 text-sm text-[#c2410c] font-medium mb-4">
                Tech Stack
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1e3a5f]">
                Teknologi yang <span className="gradient-text">Digunakan</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap justify-center gap-4">
              {portfolio.technologies.map((tech, index) => (
                <motion.div
                  key={tech.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="group relative">
                  <div className="px-6 py-3 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-lg hover:border-[#f97316]/30 transition-all flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#c2410c]" />
                    <span className="font-medium text-[#1e3a5f] group-hover:text-[#c2410c] transition-colors">
                      {tech.name}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Testimonial Section */}
      {portfolio.testimonial && portfolio.testimonial.quote && (
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-[#f97316]/5 to-[#1e3a5f]/5" />

          <div className="relative z-10 container-custom">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto">
              <div className="relative bg-white rounded-3xl p-8 sm:p-12 shadow-2xl shadow-gray-200/50 border border-gray-100">
                {/* Quote Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="absolute -top-6 left-8 w-12 h-12 rounded-xl bg-linear-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center shadow-lg shadow-orange-500/25">
                  <Quote className="w-6 h-6 text-white" />
                </motion.div>

                <motion.blockquote
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-xl sm:text-2xl text-[#1e3a5f] font-medium leading-relaxed mb-8 pt-4">
                  &ldquo;{portfolio.testimonial.quote}&rdquo;
                </motion.blockquote>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-linear-to-br from-[#1e3a5f] to-[#2d4a6f] flex items-center justify-center">
                    <span className="text-xl font-bold text-white">
                      {portfolio.testimonial.author?.charAt(0) || "A"}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-[#1e3a5f]">
                      {portfolio.testimonial.author}
                    </p>
                    <p className="text-[#475569] text-sm">
                      {portfolio.testimonial.role}
                    </p>
                  </div>
                </motion.div>

                <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-[#f97316]/20 rounded-xl -z-10" />
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Navigation to Other Projects */}
      {allPortfolios.length > 1 && prevPortfolio && nextPortfolio && (
        <section className="relative py-20 overflow-hidden bg-[#1e3a5f]">
          <div className="absolute inset-0 grid-pattern opacity-10" />

          <div className="relative z-10 container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Lihat Proyek <span className="text-[#f97316]">Lainnya</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Previous Project */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{ x: -10 }}>
                <Link href={`/portfolio/${prevPortfolio.id}`}>
                  <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#f97316]/30 transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-[#f97316]/20 transition-colors">
                        <ChevronLeft className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-white/70 text-sm">
                        Proyek Sebelumnya
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#f97316] transition-colors">
                      {prevPortfolio.title}
                    </h3>
                    <p className="text-white/60 text-sm mt-2">
                      {prevPortfolio.category}
                    </p>
                  </div>
                </Link>
              </motion.div>

              {/* Next Project */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{ x: 10 }}>
                <Link href={`/portfolio/${nextPortfolio.id}`}>
                  <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#f97316]/30 transition-all text-right">
                    <div className="flex items-center justify-end gap-4 mb-4">
                      <span className="text-white/70 text-sm">
                        Proyek Selanjutnya
                      </span>
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-[#f97316]/20 transition-colors">
                        <ChevronRight className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#f97316] transition-colors">
                      {nextPortfolio.title}
                    </h3>
                    <p className="text-white/60 text-sm mt-2">
                      {nextPortfolio.category}
                    </p>
                  </div>
                </Link>
              </motion.div>
            </div>

            {/* Back to All Portfolio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mt-12">
              <Link href="/portfolio">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#f97316] text-[#f97316] font-medium hover:bg-[#f97316] hover:text-white transition-all">
                  Lihat Semua Portfolio
                  <ExternalLink className="w-4 h-4" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden bg-white">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#f97316]/5 blur-[150px]" />

        <div className="relative z-10 container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1e3a5f] mb-6">
              Punya Proyek <span className="gradient-text">Serupa?</span>
            </h2>
            <p className="text-[#475569] text-lg mb-8 max-w-2xl mx-auto">
              Kami siap membantu mewujudkan ide Anda menjadi realitas digital
              yang menakjubkan.
            </p>
            <Link href="/#contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-linear-to-r from-[#f97316] to-[#ea580c] text-white font-semibold text-lg shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all">
                Mulai Diskusi
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
