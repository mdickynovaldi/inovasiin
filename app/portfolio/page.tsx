"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ExternalLink,
  Filter,
  TrendingUp,
  Users,
  Clock,
  Award,
  Sparkles,
  Eye,
  Calendar,
  ArrowUpRight,
  Star,
  Heart,
  Zap,
  Target,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  getAllPortfolios,
  getFeaturedPortfolios,
} from "@/lib/portfolioService";
import { PortfolioWithRelations } from "@/types/database";

// Icon mapping
const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } =
  {
    TrendingUp,
    Users,
    Clock,
    Award,
    Eye,
    Heart,
    Star,
    Zap,
    Target,
    CheckCircle,
  };

const categories = [
  "All",
  "Virtual Reality",
  "Augmented Reality",
  "Web Development",
  "3D Modeling",
  "Motion Graphics",
];

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

export default function PortfolioPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [portfolios, setPortfolios] = useState<PortfolioWithRelations[]>([]);
  const [featuredItems, setFeaturedItems] = useState<PortfolioWithRelations[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll({
    target: loading ? undefined : heroRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms for hero
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  useEffect(() => {
    async function loadData() {
      try {
        const [allData, featuredData] = await Promise.all([
          getAllPortfolios(),
          getFeaturedPortfolios(),
        ]);
        setPortfolios(allData);
        setFeaturedItems(featuredData);
      } catch (error) {
        console.error("Error loading portfolios:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter portfolio items
  const filteredItems =
    selectedCategory === "All"
      ? portfolios
      : portfolios.filter((item) => item.category === selectedCategory);

  return (
    <main className="relative overflow-hidden bg-white" ref={containerRef}>
      <Navbar />

      {/* Hero Section with Parallax */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0 z-0">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] via-[#0f2847] to-[#1e3a5f]" />

          {/* Animated Grid */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `linear-gradient(rgba(249,115,22,0.3) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(249,115,22,0.3) 1px, transparent 1px)`,
              backgroundSize: "80px 80px",
            }}
          />

          {/* Floating Orbs */}
          <motion.div
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 right-[10%] w-[400px] h-[400px] rounded-full bg-[#f97316]/20 blur-[100px]"
          />
          <motion.div
            animate={{
              x: [0, -30, 0],
              y: [0, 50, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
            className="absolute bottom-20 left-[5%] w-[500px] h-[500px] rounded-full bg-[#0ea5e9]/10 blur-[120px]"
          />

          {/* Geometric Shapes */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute top-[20%] left-[15%] w-32 h-32 border border-[#f97316]/20 rounded-xl"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[30%] right-[20%] w-24 h-24 border border-white/10 rounded-full"
          />
        </motion.div>

        {/* Hero Content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 container-custom text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
            <Sparkles className="w-4 h-4 text-[#f97316]" />
            <span className="text-sm text-white/90 font-medium">
              Our Creative Works
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            <span className="text-white">Explore Our</span>
            <br />
            <span className="bg-gradient-to-r from-[#f97316] via-[#fb923c] to-[#f97316] bg-clip-text text-transparent">
              Portfolio
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-2xl mx-auto text-lg sm:text-xl text-white/70 mb-10">
            Koleksi karya terbaik kami dalam VR/AR, 3D Development, dan Web
            Development yang telah membantu klien mencapai tujuan mereka.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-8 sm:gap-12">
            {[
              {
                value: loading ? "..." : `${portfolios.length}+`,
                label: "Projects Completed",
              },
              {
                value: loading ? "..." : `${featuredItems.length}`,
                label: "Featured Projects",
              },
              { value: "5+", label: "Years Experience" },
              { value: "15+", label: "Awards Won" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-[#f97316]">
                  {stat.value}
                </p>
                <p className="text-sm text-white/50">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2">
            <span className="text-xs text-white/40 uppercase tracking-widest">
              Scroll to explore
            </span>
            <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-1.5 h-1.5 rounded-full bg-[#f97316]"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Projects Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e3a5f] to-white" />
        <div className="absolute inset-0 grid-pattern opacity-30" />

        <div className="relative z-10 container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#f97316]/20 text-sm text-[#f97316] font-medium mb-4">
              Featured Projects
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Proyek <span className="text-[#f97316]">Unggulan</span>
            </h2>
          </motion.div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#f97316]" />
            </div>
          ) : featuredItems.length > 0 ? (
            /* Featured Cards - Horizontal Scroll */
            <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
              {featuredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="shrink-0 w-[350px] sm:w-[400px] snap-center">
                  <Link href={`/portfolio/${item.id}`}>
                    <div className="group h-full bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-[0_20px_60px_rgba(249,115,22,0.2)] transition-all duration-500">
                      {/* Image Container */}
                      <div
                        className={`relative h-56 overflow-hidden ${
                          item.thumbnail_url
                            ? ""
                            : `bg-gradient-to-br ${getCategoryGradient(
                                item.category
                              )}`
                        }`}>
                        {item.thumbnail_url ? (
                          <img
                            src={item.thumbnail_url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <>
                            <div className="absolute inset-0 bg-black/20" />
                            <motion.div
                              className="absolute inset-0 flex items-center justify-center"
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.6 }}>
                              <div className="text-white/30 text-8xl font-bold">
                                {item.title.charAt(0)}
                              </div>
                            </motion.div>
                          </>
                        )}

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1.5 rounded-full bg-white/95 text-xs text-[#1e3a5f] font-semibold shadow-lg">
                            {item.category}
                          </span>
                        </div>

                        {/* Year Badge */}
                        <div className="absolute top-4 right-4">
                          <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm text-xs text-white font-medium">
                            <Calendar className="w-3 h-3" />
                            {item.year}
                          </span>
                        </div>

                        {/* Featured Badge */}
                        {item.is_featured && (
                          <div className="absolute bottom-4 left-4">
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-400 text-yellow-900 text-xs font-semibold">
                              <Star className="w-3 h-3" />
                              Featured
                            </span>
                          </div>
                        )}

                        {/* Hover Overlay */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center pb-6">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#1e3a5f] font-medium text-sm shadow-lg">
                            <Eye className="w-4 h-4" />
                            View Details
                          </motion.div>
                        </motion.div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <p className="text-sm text-[#f97316] font-medium mb-2">
                          {item.industry}
                        </p>
                        <h3 className="text-xl font-bold text-[#1e3a5f] mb-3 group-hover:text-[#f97316] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-[#1e3a5f]/60 text-sm leading-relaxed mb-4 line-clamp-2">
                          {item.subtitle ||
                            item.description?.replace(/<[^>]*>/g, "")}
                        </p>

                        {/* Stats */}
                        {item.stats && item.stats.length > 0 && (
                          <div className="flex gap-4 mb-4">
                            {item.stats.slice(0, 2).map((stat) => {
                              const IconComponent =
                                iconMap[stat.icon] || TrendingUp;
                              return (
                                <div
                                  key={stat.id}
                                  className="flex items-center gap-2">
                                  <IconComponent className="w-4 h-4 text-[#f97316]" />
                                  <div>
                                    <p className="text-base font-bold text-[#1e3a5f]">
                                      {stat.value}
                                    </p>
                                    <p className="text-xs text-[#1e3a5f]/50">
                                      {stat.label}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Tags */}
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {item.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag.id}
                                className="px-2.5 py-1 rounded-full bg-[#1e3a5f]/5 text-xs text-[#1e3a5f]/70 font-medium">
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-white/60">Belum ada proyek unggulan</p>
            </div>
          )}
        </div>
      </section>

      {/* All Projects Section */}
      <section className="relative section-padding overflow-hidden bg-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#f97316]/5 blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-[#1e3a5f]/5 blur-[150px]" />

        <div className="relative z-10 container-custom">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#f97316]/10 text-sm text-[#f97316] font-medium mb-4">
              All Projects
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1e3a5f] mb-4">
              Semua <span className="gradient-text">Portofolio</span>
            </h2>
            <p className="max-w-2xl mx-auto text-[#1e3a5f]/60 text-lg">
              Jelajahi koleksi lengkap karya kami di berbagai industri dan
              teknologi
            </p>
          </motion.div>

          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white shadow-lg shadow-orange-500/25"
                    : "bg-white text-[#1e3a5f]/70 border border-[#1e3a5f]/10 hover:border-[#f97316]/30 hover:text-[#f97316]"
                }`}>
                {category === "All" && (
                  <Filter className="w-4 h-4 inline-block mr-1.5" />
                )}
                {category}
              </motion.button>
            ))}
          </motion.div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#f97316]" />
            </div>
          ) : filteredItems.length > 0 ? (
            /* Portfolio Grid */
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="group">
                  <Link href={`/portfolio/${item.id}`}>
                    <motion.div
                      whileHover={{ y: -10 }}
                      className="h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#f97316]/20 transition-all duration-500">
                      {/* Image/Gradient Container */}
                      <div
                        className={`relative h-48 overflow-hidden ${
                          item.thumbnail_url
                            ? ""
                            : `bg-gradient-to-br ${getCategoryGradient(
                                item.category
                              )}`
                        }`}>
                        {item.thumbnail_url ? (
                          <img
                            src={item.thumbnail_url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <motion.div
                            animate={{
                              y: hoveredItem === item.id ? -10 : 0,
                              scale: hoveredItem === item.id ? 1.1 : 1,
                            }}
                            transition={{ duration: 0.4 }}
                            className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white/20 text-7xl font-bold">
                              {item.title.charAt(0)}
                            </span>
                          </motion.div>
                        )}

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs text-[#1e3a5f] font-medium shadow-sm">
                            {item.category}
                          </span>
                        </div>

                        {/* Featured Badge */}
                        {item.is_featured && (
                          <div className="absolute top-4 right-4">
                            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-400 text-yellow-900 text-xs font-medium">
                              <Star className="w-3 h-3" />
                            </span>
                          </div>
                        )}

                        {/* Year */}
                        <div className="absolute bottom-4 right-4">
                          <span className="text-sm text-white/80 font-medium">
                            {item.year}
                          </span>
                        </div>

                        {/* Hover Link */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{
                            opacity: hoveredItem === item.id ? 1 : 0,
                            scale: hoveredItem === item.id ? 1 : 0.8,
                          }}
                          className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-xl cursor-pointer">
                            <ArrowUpRight className="w-6 h-6 text-[#f97316]" />
                          </motion.div>
                        </motion.div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <p className="text-sm text-[#f97316] font-medium mb-1">
                          {item.industry}
                        </p>
                        <h3 className="text-lg font-bold text-[#1e3a5f] mb-2 group-hover:text-[#f97316] transition-colors line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="text-[#1e3a5f]/60 text-sm leading-relaxed mb-4 line-clamp-2">
                          {item.subtitle ||
                            item.description?.replace(/<[^>]*>/g, "")}
                        </p>

                        {/* Tags */}
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {item.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag.id}
                                className="px-2 py-0.5 rounded-md bg-[#1e3a5f]/5 text-xs text-[#1e3a5f]/60">
                                {tag.name}
                              </span>
                            ))}
                            {item.tags.length > 3 && (
                              <span className="px-2 py-0.5 rounded-md bg-[#f97316]/10 text-xs text-[#f97316]">
                                +{item.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <p className="text-[#1e3a5f]/60 text-lg mb-4">
                {selectedCategory === "All"
                  ? "Belum ada portfolio. Tambahkan melalui Admin Dashboard."
                  : `Tidak ada portfolio untuk kategori "${selectedCategory}"`}
              </p>
              {selectedCategory !== "All" && (
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="text-[#f97316] font-medium hover:underline">
                  Lihat semua portfolio
                </button>
              )}
            </div>
          )}

          {/* Load More / CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-16">
            <p className="text-[#1e3a5f]/60 mb-6">
              Punya proyek yang ingin diwujudkan? Mari diskusikan bersama kami!
            </p>
            <Link href="/#contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white font-semibold text-lg shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all">
                Mulai Proyek Anda
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Process Teaser */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] to-[#0f2847]" />
        <div className="absolute inset-0 grid-pattern opacity-10" />

        <div className="relative z-10 container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Ingin tahu bagaimana kami bekerja?
            </h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              Pelajari proses kreatif kami dalam mengubah ide menjadi solusi
              digital yang luar biasa.
            </p>
            <Link href="/#process">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#f97316] text-[#f97316] font-medium hover:bg-[#f97316] hover:text-white transition-all">
                Lihat Proses Kami
                <ExternalLink className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Custom Scrollbar Hide Style */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}
