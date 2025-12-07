'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll } from 'framer-motion'
import { TrendingUp, Users, Clock, Award, Eye, Heart, Star, Zap, Target, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { getFeaturedPortfolios } from '@/lib/portfolioService'
import { PortfolioWithRelations } from '@/types/database'

// Icon mapping
const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
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
}

// Fallback static data when no Supabase data available
const staticProjects = [
  {
    title: 'VR Training Simulation',
    category: 'Virtual Reality',
    industry: 'Manufacturing Industry',
    description:
      'Platform VR training untuk keselamatan kerja di pabrik manufaktur. Simulasi imersif yang memungkinkan pekerja berlatih tanpa risiko.',
    gradient: 'from-[#f97316] to-[#ea580c]',
    stats: [
      { icon: TrendingUp, value: '+40%', label: 'Training Efficiency' },
      { icon: Clock, value: '-60%', label: 'Training Time' },
    ],
    tags: ['Unity', 'VR Headset', 'Real-time 3D'],
  },
  {
    title: 'Virtual Laboratory',
    category: 'VR Education',
    industry: 'Higher Education',
    description:
      'Laboratorium virtual untuk praktikum sains di universitas. Mahasiswa dapat melakukan eksperimen kimia dan fisika secara virtual.',
    gradient: 'from-[#1e3a5f] to-[#0f2847]',
    stats: [
      { icon: Users, value: '5000+', label: 'Active Students' },
      { icon: Award, value: '98%', label: 'Satisfaction Rate' },
    ],
    tags: ['WebXR', '3D Simulation', 'LMS Integration'],
  },
  {
    title: 'AR Product Viewer',
    category: 'Augmented Reality',
    industry: 'E-Commerce & Retail',
    description:
      'Aplikasi AR yang memungkinkan customer melihat produk furniture dalam skala nyata di ruangan mereka sebelum membeli.',
    gradient: 'from-[#f97316] to-[#1e3a5f]',
    stats: [
      { icon: TrendingUp, value: '+85%', label: 'Conversion Rate' },
      { icon: Clock, value: '-45%', label: 'Return Rate' },
    ],
    tags: ['ARKit', 'ARCore', '3D Commerce'],
  },
  {
    title: 'Brand Campaign Animation',
    category: 'Motion Graphics',
    industry: 'FMCG Brand',
    description:
      'Series motion graphics untuk kampanye digital brand FMCG. Animasi engaging untuk social media dan digital ads.',
    gradient: 'from-[#1e3a5f] to-[#f97316]',
    stats: [
      { icon: Users, value: '2.5M+', label: 'Views' },
      { icon: TrendingUp, value: '+120%', label: 'Engagement' },
    ],
    tags: ['After Effects', 'Cinema 4D', 'Social Media'],
  },
]

// Generate gradient based on category
function getCategoryGradient(category: string): string {
  const gradients: { [key: string]: string } = {
    'Virtual Reality': 'from-[#f97316] to-[#ea580c]',
    'Augmented Reality': 'from-[#f97316] to-[#1e3a5f]',
    'Web Development': 'from-[#0ea5e9] to-[#1e3a5f]',
    '3D Modeling': 'from-[#a855f7] to-[#1e3a5f]',
    'Motion Graphics': 'from-[#1e3a5f] to-[#f97316]',
  }
  return gradients[category] || 'from-[#1e3a5f] to-[#0f2847]'
}

export default function ShowcaseDynamic() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [portfolios, setPortfolios] = useState<PortfolioWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const { scrollYProgress } = useScroll({
    target: loading ? undefined : containerRef,
    offset: ['start end', 'end start'],
  })

  useEffect(() => {
    async function loadPortfolios() {
      const data = await getFeaturedPortfolios()
      setPortfolios(data)
      setLoading(false)
    }
    loadPortfolios()
  }, [])

  // Use static data if no portfolios from Supabase
  const hasSupabaseData = portfolios.length > 0

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
          viewport={{ once: true, margin: '-100px' }}
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
            {hasSupabaseData ? 'Featured Projects' : 'Selected Projects'}
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1e3a5f] mb-4">
            Project <span className="gradient-text">Showcase</span>
          </h2>
          <p className="max-w-2xl mx-auto text-[#1e3a5f]/60 text-lg">
            {hasSupabaseData 
              ? 'Proyek unggulan yang menunjukkan kemampuan kami dalam menghadirkan solusi digital yang berdampak'
              : 'Beberapa project yang menunjukkan kemampuan kami dalam menghadirkan solusi digital yang berdampak'}
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden border border-gray-100 animate-pulse">
                <div className="h-48 sm:h-56 bg-gray-200" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-200 rounded w-20" />
                    <div className="h-8 bg-gray-200 rounded w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Projects Grid - Dynamic from Supabase */}
        {!loading && hasSupabaseData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {portfolios.slice(0, 4).map((portfolio, index) => (
              <ProjectCardDynamic
                key={portfolio.id}
                portfolio={portfolio}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Projects Grid - Static Fallback */}
        {!loading && !hasSupabaseData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {staticProjects.map((project, index) => (
              <ProjectCardStatic key={project.title} project={project} index={index} />
            ))}
          </div>
        )}

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
  )
}

// Dynamic Project Card (from Supabase)
function ProjectCardDynamic({ 
  portfolio, 
  index 
}: { 
  portfolio: PortfolioWithRelations
  index: number 
}) {
  const gradient = getCategoryGradient(portfolio.category)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      whileHover={{ y: -10 }}
      className="group"
    >
      <Link href={`/portfolio/${portfolio.id}`}>
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#f97316]/20 transition-all duration-300">
          {/* Image/Gradient Preview */}
          <div
            className="relative h-48 sm:h-56"
            style={{ 
              background: portfolio.thumbnail_url 
                ? `url(${portfolio.thumbnail_url}) center/cover`
                : `linear-gradient(135deg, var(--tw-gradient-stops))`,
            }}
          >
            {!portfolio.thumbnail_url && (
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl font-bold text-white/20">{portfolio.title.charAt(0)}</span>
                </div>
              </div>
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />

            {/* Category badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs text-[#1e3a5f] font-medium shadow-sm">
                {portfolio.category}
              </span>
            </div>

            {/* Featured badge */}
            {portfolio.is_featured && (
              <div className="absolute top-4 right-4">
                <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-400 text-yellow-900 text-xs font-semibold">
                  <Star className="w-3 h-3" />
                  Featured
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Industry */}
            <p className="text-sm text-[#f97316] font-medium mb-2">{portfolio.industry}</p>

            {/* Title */}
            <h3 className="text-xl font-bold text-[#1e3a5f] mb-3 group-hover:text-[#f97316] transition-colors">
              {portfolio.title}
            </h3>

            {/* Description */}
            <p className="text-[#1e3a5f]/60 text-sm leading-relaxed mb-4 line-clamp-2">
              {portfolio.subtitle || portfolio.description?.replace(/<[^>]*>/g, '').slice(0, 150)}
            </p>

            {/* Stats */}
            {portfolio.stats.length > 0 && (
              <div className="flex gap-6 mb-4">
                {portfolio.stats.slice(0, 2).map((stat) => {
                  const IconComponent = iconMap[stat.icon] || TrendingUp
                  return (
                    <div key={stat.id} className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-[#f97316]" />
                      <div>
                        <p className="text-lg font-bold text-[#1e3a5f]">{stat.value}</p>
                        <p className="text-xs text-[#1e3a5f]/50">{stat.label}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Tags */}
            {portfolio.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {portfolio.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    className="px-2 py-1 rounded-md bg-[#1e3a5f]/5 text-xs text-[#1e3a5f]/70"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// Static Project Card (Fallback)
function ProjectCardStatic({ 
  project, 
  index 
}: { 
  project: typeof staticProjects[0]
  index: number 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      whileHover={{ y: -10 }}
      className="group"
    >
      <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#f97316]/20 transition-all duration-300">
        {/* Gradient Preview */}
        <div className={`relative h-48 sm:h-56 bg-gradient-to-br ${project.gradient}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs text-[#1e3a5f] font-medium shadow-sm">
              {project.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-[#f97316] font-medium mb-2">{project.industry}</p>
          <h3 className="text-xl font-bold text-[#1e3a5f] mb-3 group-hover:text-[#f97316] transition-colors">
            {project.title}
          </h3>
          <p className="text-[#1e3a5f]/60 text-sm leading-relaxed mb-4">
            {project.description}
          </p>

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
  )
}

