'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FolderKanban, 
  Star, 
  Eye, 
  TrendingUp,
  Plus,
  ArrowRight,
  Sparkles,
  Database,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import ActivityLog from '@/components/admin/ActivityLog'
import AnalyticsCard from '@/components/admin/AnalyticsCard'

interface DashboardStats {
  totalPortfolios: number
  featuredPortfolios: number
  totalViews: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPortfolios: 0,
    featuredPortfolios: 0,
    totalViews: 0,
  })
  const [recentPortfolios, setRecentPortfolios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    try {
      // Fetch portfolios count
      const { count: totalCount } = await supabase
        .from('portfolios')
        .select('*', { count: 'exact', head: true })

      // Fetch featured count
      const { count: featuredCount } = await supabase
        .from('portfolios')
        .select('*', { count: 'exact', head: true })
        .eq('is_featured', true)

      // Fetch recent portfolios
      const { data: recent } = await supabase
        .from('portfolios')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      setStats({
        totalPortfolios: totalCount || 0,
        featuredPortfolios: featuredCount || 0,
        totalViews: (totalCount || 0) * 150, // Simulated views
      })
      setRecentPortfolios(recent || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Portfolio',
      value: stats.totalPortfolios,
      icon: FolderKanban,
      color: 'from-[#f97316] to-[#ea580c]',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Featured Projects',
      value: stats.featuredPortfolios,
      icon: Star,
      color: 'from-[#eab308] to-[#ca8a04]',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: 'from-[#0ea5e9] to-[#0284c7]',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Growth Rate',
      value: '+24%',
      icon: TrendingUp,
      color: 'from-[#22c55e] to-[#16a34a]',
      bgColor: 'bg-green-50',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1e3a5f] to-[#0f2847] p-8"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#f97316]" />
            <span className="text-white/60 text-sm font-medium">Admin Dashboard</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Selamat Datang! 👋
          </h1>
          <p className="text-white/60 max-w-lg">
            Kelola portfolio, edit konten, dan pantau performa website INOVASIIN dari satu tempat.
          </p>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#f97316]/20 blur-[100px]" />
        <div className="absolute bottom-0 right-20 w-32 h-32 rounded-full bg-[#0ea5e9]/10 blur-[60px]" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.bgColor} rounded-2xl p-6 border border-gray-100`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-[#1e3a5f] mb-1">
              {loading ? (
                <span className="inline-block w-16 h-8 bg-gray-200 rounded animate-pulse" />
              ) : (
                stat.value
              )}
            </p>
            <p className="text-sm text-[#1e3a5f]/60">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <Link href="/admin/portfolio/new">
          <div className="group bg-white rounded-2xl border border-gray-100 p-6 hover:border-[#f97316]/30 hover:shadow-lg hover:shadow-orange-500/5 transition-all cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#f97316] to-[#ea580c] shadow-lg shadow-orange-500/20">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1e3a5f] text-lg">Tambah Portfolio Baru</h3>
                  <p className="text-sm text-[#1e3a5f]/60">Buat project showcase baru</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-[#1e3a5f]/30 group-hover:text-[#f97316] group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </Link>

        <Link href="/admin/sql-editor">
          <div className="group bg-white rounded-2xl border border-gray-100 p-6 hover:border-[#0ea5e9]/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] shadow-lg shadow-blue-500/20">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1e3a5f] text-lg">SQL Editor</h3>
                  <p className="text-sm text-[#1e3a5f]/60">Jalankan query database</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-[#1e3a5f]/30 group-hover:text-[#0ea5e9] group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Portfolios - 2 columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-bold text-[#1e3a5f]">Portfolio Terbaru</h2>
              <p className="text-sm text-[#1e3a5f]/60">5 project terakhir yang ditambahkan</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={fetchDashboardData}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 text-[#1e3a5f]/50 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <Link 
                href="/admin/portfolio"
                className="text-sm font-medium text-[#f97316] hover:text-[#ea580c] transition-colors"
              >
                Lihat Semua →
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentPortfolios.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentPortfolios.map((portfolio) => (
                <Link
                  key={portfolio.id}
                  href={`/admin/portfolio/${portfolio.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                >
                  <div 
                    className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#f97316] to-[#1e3a5f] flex items-center justify-center text-white font-bold text-xl"
                    style={{
                      backgroundImage: portfolio.thumbnail_url ? `url(${portfolio.thumbnail_url})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {!portfolio.thumbnail_url && portfolio.title?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#1e3a5f] truncate">{portfolio.title}</h3>
                    <p className="text-sm text-[#1e3a5f]/60 truncate">{portfolio.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {portfolio.is_featured && (
                      <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
                        Featured
                      </span>
                    )}
                    <span className="text-xs text-[#1e3a5f]/40">
                      {new Date(portfolio.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <FolderKanban className="w-12 h-12 mx-auto text-[#1e3a5f]/20 mb-4" />
              <h3 className="font-semibold text-[#1e3a5f] mb-2">Belum Ada Portfolio</h3>
              <p className="text-sm text-[#1e3a5f]/60 mb-4">
                Mulai tambahkan portfolio project Anda
              </p>
              <Link
                href="/admin/portfolio/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#f97316] text-white text-sm font-medium hover:bg-[#ea580c] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Tambah Portfolio
              </Link>
            </div>
          )}
        </motion.div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Analytics Card */}
          <AnalyticsCard />

          {/* Activity Log */}
          <ActivityLog />
        </div>
      </div>
    </div>
  )
}

