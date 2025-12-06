'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  MousePointer2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

interface AnalyticsData {
  pageViews: number
  uniqueVisitors: number
  avgTimeOnSite: string
  bounceRate: number
  topPages: { path: string; views: number }[]
  trend: 'up' | 'down' | 'neutral'
  trendPercentage: number
}

// Simulated analytics data (in production, connect to real analytics service)
function generateAnalyticsData(): AnalyticsData {
  return {
    pageViews: Math.floor(Math.random() * 5000) + 2000,
    uniqueVisitors: Math.floor(Math.random() * 2000) + 500,
    avgTimeOnSite: `${Math.floor(Math.random() * 3) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    bounceRate: Math.floor(Math.random() * 30) + 20,
    topPages: [
      { path: '/', views: Math.floor(Math.random() * 1000) + 500 },
      { path: '/portfolio', views: Math.floor(Math.random() * 800) + 300 },
      { path: '/services', views: Math.floor(Math.random() * 600) + 200 },
    ],
    trend: Math.random() > 0.3 ? 'up' : 'down',
    trendPercentage: Math.floor(Math.random() * 20) + 5,
  }
}

export default function AnalyticsCard() {
  const [data, setData] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    // Simulate fetching analytics data
    setData(generateAnalyticsData())
    
    // Refresh every 30 seconds
    const interval = setInterval(() => {
      setData(generateAnalyticsData())
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  if (!data) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-20 bg-gray-200 rounded-xl" />
          <div className="h-20 bg-gray-200 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#f97316]" />
          <h3 className="font-semibold text-[#1e3a5f]">Analytics Overview</h3>
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${
          data.trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {data.trend === 'up' ? (
            <ArrowUpRight className="w-4 h-4" />
          ) : (
            <ArrowDownRight className="w-4 h-4" />
          )}
          {data.trendPercentage}%
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-[#f97316]/10 to-[#f97316]/5 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-[#f97316]" />
              <span className="text-sm text-[#1e3a5f]/60">Page Views</span>
            </div>
            <p className="text-2xl font-bold text-[#1e3a5f]">
              {data.pageViews.toLocaleString()}
            </p>
          </div>

          <div className="p-4 bg-gradient-to-br from-[#0ea5e9]/10 to-[#0ea5e9]/5 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <MousePointer2 className="w-4 h-4 text-[#0ea5e9]" />
              <span className="text-sm text-[#1e3a5f]/60">Visitors</span>
            </div>
            <p className="text-2xl font-bold text-[#1e3a5f]">
              {data.uniqueVisitors.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#1e3a5f]/60">Avg. Time on Site</span>
            <span className="font-medium text-[#1e3a5f]">{data.avgTimeOnSite}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#1e3a5f]/60">Bounce Rate</span>
            <span className="font-medium text-[#1e3a5f]">{data.bounceRate}%</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-[#1e3a5f] mb-3">Top Pages</h4>
          <div className="space-y-2">
            {data.topPages.map((page, index) => (
              <div key={page.path} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#f97316]/10 text-[#f97316] text-xs flex items-center justify-center font-medium">
                    {index + 1}
                  </span>
                  <span className="text-sm text-[#1e3a5f]/80 font-mono">{page.path}</span>
                </div>
                <span className="text-sm text-[#1e3a5f]/60">{page.views}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

