'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  FolderKanban, 
  Database, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  Settings,
  Home
} from 'lucide-react'
import Link from 'next/link'
import { isAuthenticated, logout, getAuthState } from '@/lib/auth'

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/admin/portfolio', icon: FolderKanban, label: 'Portfolio' },
  { href: '/admin/sql-editor', icon: Database, label: 'SQL Editor' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [authState, setAuthState] = useState({ isAuthenticated: false, email: null as string | null })

  useEffect(() => {
    setMounted(true)
    const state = getAuthState()
    if (!state.isAuthenticated) {
      router.push('/login')
    } else {
      setAuthState({ isAuthenticated: true, email: state.email })
    }
  }, [router])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (!mounted || !authState.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f97316] to-[#ea580c]" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-gray-100 shadow-sm transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center shadow-lg shadow-orange-500/20">
                <span className="text-white font-bold text-lg">I</span>
              </div>
              <div>
                <h1 className="font-bold text-[#1e3a5f] text-lg">INOVASIIN</h1>
                <p className="text-xs text-[#1e3a5f]/50">Admin Panel</p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => {
              const isActive = item.exact 
                ? pathname === item.href 
                : pathname.startsWith(item.href)
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white shadow-md shadow-orange-500/20'
                      : 'text-[#1e3a5f]/70 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#1e3a5f]/50 group-hover:text-[#f97316]'}`} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-gray-100 space-y-2">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#1e3a5f]/70 hover:bg-gray-100 transition-all"
            >
              <Home className="w-5 h-5 text-[#1e3a5f]/50" />
              <span className="font-medium">View Website</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>

          {/* User Info */}
          <div className="px-4 py-4 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#0f2847] flex items-center justify-center">
                <span className="text-white font-semibold text-sm">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1e3a5f] truncate">Admin</p>
                <p className="text-xs text-[#1e3a5f]/50 truncate">{authState.email}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6 text-[#1e3a5f]" />
            </button>

            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <Link href="/admin" className="text-[#1e3a5f]/50 hover:text-[#f97316]">
                Dashboard
              </Link>
              {pathname !== '/admin' && (
                <>
                  <ChevronRight className="w-4 h-4 text-[#1e3a5f]/30" />
                  <span className="text-[#1e3a5f] font-medium capitalize">
                    {pathname.split('/').pop()?.replace('-', ' ')}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Settings className="w-5 h-5 text-[#1e3a5f]/50" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

