'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity, 
  Plus, 
  Edit2, 
  Trash2, 
  Star, 
  Clock,
  ChevronDown,
  ChevronUp,
  Database
} from 'lucide-react'

interface ActivityItem {
  id: string
  action: 'create' | 'update' | 'delete' | 'feature' | 'unfeature'
  title: string
  timestamp: Date
}

const actionIcons = {
  create: Plus,
  update: Edit2,
  delete: Trash2,
  feature: Star,
  unfeature: Star,
}

const actionColors = {
  create: 'text-green-500 bg-green-100',
  update: 'text-blue-500 bg-blue-100',
  delete: 'text-red-500 bg-red-100',
  feature: 'text-yellow-500 bg-yellow-100',
  unfeature: 'text-gray-500 bg-gray-100',
}

const actionLabels = {
  create: 'Created',
  update: 'Updated',
  delete: 'Deleted',
  feature: 'Featured',
  unfeature: 'Unfeatured',
}

const STORAGE_KEY = 'inovasiin_activity_log'

export function logActivity(action: ActivityItem['action'], title: string) {
  if (typeof window === 'undefined') return

  const stored = localStorage.getItem(STORAGE_KEY)
  const activities: ActivityItem[] = stored ? JSON.parse(stored) : []
  
  const newActivity: ActivityItem = {
    id: Date.now().toString(),
    action,
    title,
    timestamp: new Date(),
  }
  
  const updated = [newActivity, ...activities.slice(0, 49)] // Keep last 50
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export default function ActivityLog() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [expanded, setExpanded] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setActivities(parsed.map((a: any) => ({ ...a, timestamp: new Date(a.timestamp) })))
      } catch {}
    }
  }, [])

  const clearLog = () => {
    localStorage.removeItem(STORAGE_KEY)
    setActivities([])
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#f97316]" />
          <span className="font-medium text-[#1e3a5f]">Activity Log</span>
          {activities.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#f97316]/10 text-xs text-[#f97316] font-medium">
              {activities.length}
            </span>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-[#1e3a5f]/50" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[#1e3a5f]/50" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            {activities.length > 0 ? (
              <>
                <div className="max-h-64 overflow-y-auto">
                  {activities.map((activity, index) => {
                    const Icon = actionIcons[activity.action]
                    const colorClass = actionColors[activity.action]
                    
                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start gap-3 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                      >
                        <div className={`p-1.5 rounded-lg ${colorClass}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#1e3a5f]">
                            <span className="font-medium">{actionLabels[activity.action]}</span>
                            {' '}
                            <span className="text-[#1e3a5f]/70 truncate">{activity.title}</span>
                          </p>
                          <p className="text-xs text-[#1e3a5f]/50 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {formatTime(activity.timestamp)}
                          </p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
                <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                  <button
                    onClick={clearLog}
                    className="text-xs text-red-500 hover:text-red-600 transition-colors"
                  >
                    Clear all activity
                  </button>
                </div>
              </>
            ) : (
              <div className="p-6 text-center">
                <Database className="w-8 h-8 text-[#1e3a5f]/20 mx-auto mb-2" />
                <p className="text-sm text-[#1e3a5f]/50">No recent activity</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

