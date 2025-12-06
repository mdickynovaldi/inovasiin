'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Loader2,
  Database,
  Table2,
  Copy,
  Check,
  Trash2,
  Clock,
  Download,
  FileText,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Sparkles,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface QueryHistory {
  id: string
  query: string
  timestamp: Date
  duration: number
  rowCount: number
  success: boolean
}

interface TableInfo {
  name: string
  columns: string[]
}

// Predefined SQL templates
const sqlTemplates = [
  {
    name: 'Create Portfolios Table',
    query: `-- Create portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  description TEXT,
  thumbnail_url TEXT,
  category VARCHAR(100) NOT NULL,
  industry VARCHAR(100),
  year VARCHAR(10),
  client VARCHAR(255),
  duration VARCHAR(100),
  challenge TEXT,
  solution TEXT,
  result TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
  },
  {
    name: 'Create Portfolio Media Table',
    query: `-- Create portfolio_media table
CREATE TABLE IF NOT EXISTS portfolio_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('image', 'youtube')),
  url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
  },
  {
    name: 'Create Portfolio Stats Table',
    query: `-- Create portfolio_stats table
CREATE TABLE IF NOT EXISTS portfolio_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  icon VARCHAR(50),
  value VARCHAR(50),
  label VARCHAR(100),
  order_index INTEGER DEFAULT 0
);`,
  },
  {
    name: 'Create Portfolio Tags Table',
    query: `-- Create portfolio_tags table
CREATE TABLE IF NOT EXISTS portfolio_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL
);`,
  },
  {
    name: 'Create Portfolio Technologies Table',
    query: `-- Create portfolio_technologies table
CREATE TABLE IF NOT EXISTS portfolio_technologies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL
);`,
  },
  {
    name: 'Create Portfolio Testimonials Table',
    query: `-- Create portfolio_testimonials table
CREATE TABLE IF NOT EXISTS portfolio_testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  quote TEXT,
  author VARCHAR(255),
  role VARCHAR(255)
);`,
  },
  {
    name: 'Enable RLS Policies',
    query: `-- Enable Row Level Security
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_testimonials ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access" ON portfolios FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON portfolio_media FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON portfolio_stats FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON portfolio_tags FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON portfolio_technologies FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON portfolio_testimonials FOR SELECT USING (true);

-- Create policies for authenticated insert/update/delete
CREATE POLICY "Allow authenticated insert" ON portfolios FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON portfolios FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON portfolios FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert" ON portfolio_media FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON portfolio_media FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON portfolio_media FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert" ON portfolio_stats FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON portfolio_stats FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON portfolio_stats FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert" ON portfolio_tags FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON portfolio_tags FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON portfolio_tags FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert" ON portfolio_technologies FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON portfolio_technologies FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON portfolio_technologies FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert" ON portfolio_testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON portfolio_testimonials FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON portfolio_testimonials FOR DELETE USING (true);`,
  },
  {
    name: 'List All Tables',
    query: `SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;`,
  },
  {
    name: 'Get All Portfolios',
    query: `SELECT * FROM portfolios ORDER BY created_at DESC;`,
  },
  {
    name: 'Get Featured Portfolios',
    query: `SELECT * FROM portfolios WHERE is_featured = true ORDER BY created_at DESC;`,
  },
]

export default function SQLEditorPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[] | null>(null)
  const [columns, setColumns] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [executionTime, setExecutionTime] = useState<number | null>(null)
  const [history, setHistory] = useState<QueryHistory[]>([])
  const [copied, setCopied] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sql_history')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setHistory(parsed.map((h: any) => ({ ...h, timestamp: new Date(h.timestamp) })))
      } catch {}
    }
  }, [])

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('sql_history', JSON.stringify(history))
  }, [history])

  const executeQuery = async () => {
    if (!query.trim()) return

    setLoading(true)
    setError(null)
    setResults(null)
    setColumns([])

    const startTime = performance.now()

    try {
      // Use Supabase's rpc for raw SQL (needs a function in Supabase)
      // For SELECT queries, we'll use the supabase client directly
      const trimmedQuery = query.trim().toLowerCase()
      
      if (trimmedQuery.startsWith('select')) {
        // Extract table name from SELECT query (simplified)
        const tableMatch = query.match(/from\s+([a-zA-Z_][a-zA-Z0-9_]*)/i)
        if (tableMatch) {
          const tableName = tableMatch[1]
          const { data, error: queryError } = await supabase.from(tableName).select('*')
          
          if (queryError) throw queryError
          
          const endTime = performance.now()
          setExecutionTime(endTime - startTime)
          
          if (data && data.length > 0) {
            setColumns(Object.keys(data[0]))
            setResults(data)
          } else {
            setResults([])
            setColumns([])
          }

          // Add to history
          addToHistory(query, endTime - startTime, data?.length || 0, true)
        }
      } else {
        // For non-SELECT queries, we need to use Supabase SQL API or RPC
        // Since we can't execute raw SQL directly, show a message
        setError(
          'Untuk menjalankan DDL (CREATE, ALTER, DROP) atau DML (INSERT, UPDATE, DELETE), ' +
          'silakan gunakan Supabase Dashboard SQL Editor di https://app.supabase.com\n\n' +
          'Copy query di bawah dan paste di Supabase SQL Editor.'
        )
        const endTime = performance.now()
        addToHistory(query, endTime - startTime, 0, false)
      }
    } catch (err: any) {
      const endTime = performance.now()
      setExecutionTime(endTime - startTime)
      setError(err.message || 'Error executing query')
      addToHistory(query, endTime - startTime, 0, false)
    } finally {
      setLoading(false)
    }
  }

  const addToHistory = (sql: string, duration: number, rowCount: number, success: boolean) => {
    const newEntry: QueryHistory = {
      id: Date.now().toString(),
      query: sql,
      timestamp: new Date(),
      duration,
      rowCount,
      success,
    }
    setHistory((prev) => [newEntry, ...prev.slice(0, 19)])
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadCSV = () => {
    if (!results || results.length === 0) return

    const csv = [
      columns.join(','),
      ...results.map((row) => columns.map((col) => JSON.stringify(row[col] ?? '')).join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `query_results_${new Date().toISOString()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('sql_history')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e3a5f]">SQL Editor</h1>
          <p className="text-[#1e3a5f]/60">Jalankan query SQL untuk database Supabase</p>
        </div>
        <a
          href="https://supabase.com/dashboard/project/fusngexduovgzoliwifl/sql"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3ECF8E] text-white font-medium hover:bg-[#3ECF8E]/90 transition-colors"
        >
          <Database className="w-5 h-5" />
          Open Supabase
        </a>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* SQL Editor */}
        <div className="lg:col-span-3 space-y-4">
          {/* Query Input */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#1e3a5f]/50" />
                <span className="font-medium text-[#1e3a5f]">Query Editor</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(query)}
                  className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Copy Query"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-[#1e3a5f]/50" />
                  )}
                </button>
                <button
                  onClick={() => setQuery('')}
                  className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Clear"
                >
                  <Trash2 className="w-4 h-4 text-[#1e3a5f]/50" />
                </button>
              </div>
            </div>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="-- Write your SQL query here
SELECT * FROM portfolios;"
              className="w-full h-64 p-4 font-mono text-sm text-[#1e3a5f] placeholder:text-[#1e3a5f]/30 focus:outline-none resize-none"
              spellCheck={false}
            />
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
              <div className="text-sm text-[#1e3a5f]/50">
                {executionTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {executionTime.toFixed(2)}ms
                  </span>
                )}
              </div>
              <motion.button
                onClick={executeQuery}
                disabled={loading || !query.trim()}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white font-medium shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Run Query
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 border border-red-200 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-red-700 mb-1">Error</p>
                  <pre className="text-sm text-red-600 whitespace-pre-wrap font-mono">{error}</pre>
                </div>
              </div>
            </motion.div>
          )}

          {/* Results */}
          {results !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2">
                  <Table2 className="w-5 h-5 text-[#1e3a5f]/50" />
                  <span className="font-medium text-[#1e3a5f]">
                    Results ({results.length} rows)
                  </span>
                </div>
                {results.length > 0 && (
                  <button
                    onClick={downloadCSV}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-[#1e3a5f]/70 hover:bg-gray-200 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                )}
              </div>

              {results.length > 0 ? (
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        {columns.map((col) => (
                          <th
                            key={col}
                            className="px-4 py-3 text-left font-semibold text-[#1e3a5f] border-b border-gray-200"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          {columns.map((col) => (
                            <td
                              key={col}
                              className="px-4 py-3 text-[#1e3a5f]/80 border-b border-gray-100 max-w-xs truncate"
                            >
                              {typeof row[col] === 'object'
                                ? JSON.stringify(row[col])
                                : String(row[col] ?? '')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-[#1e3a5f]/50">
                  No results returned
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Templates */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#f97316]" />
                <span className="font-medium text-[#1e3a5f]">SQL Templates</span>
              </div>
              {showTemplates ? (
                <ChevronDown className="w-5 h-5 text-[#1e3a5f]/50" />
              ) : (
                <ChevronRight className="w-5 h-5 text-[#1e3a5f]/50" />
              )}
            </button>
            
            <AnimatePresence>
              {showTemplates && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-2 space-y-1 max-h-80 overflow-y-auto">
                    {sqlTemplates.map((template, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(template.query)}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#1e3a5f]/80 hover:bg-[#f97316]/10 hover:text-[#f97316] transition-colors"
                      >
                        {template.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* History */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2"
              >
                <Clock className="w-5 h-5 text-[#1e3a5f]/50" />
                <span className="font-medium text-[#1e3a5f]">History</span>
                {showHistory ? (
                  <ChevronDown className="w-4 h-4 text-[#1e3a5f]/50" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#1e3a5f]/50" />
                )}
              </button>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Clear
                </button>
              )}
            </div>

            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="max-h-64 overflow-y-auto">
                    {history.length > 0 ? (
                      <div className="p-2 space-y-1">
                        {history.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setQuery(item.query)}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  item.success ? 'bg-green-500' : 'bg-red-500'
                                }`}
                              />
                              <span className="text-xs text-[#1e3a5f]/50">
                                {item.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm text-[#1e3a5f]/80 font-mono truncate">
                              {item.query.slice(0, 50)}...
                            </p>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-[#1e3a5f]/40 text-sm">
                        No query history
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Info */}
          <div className="bg-gradient-to-br from-[#1e3a5f] to-[#0f2847] rounded-2xl p-4 text-white">
            <h3 className="font-semibold mb-2">💡 Tips</h3>
            <ul className="text-sm text-white/70 space-y-1">
              <li>• SELECT queries bekerja langsung</li>
              <li>• DDL/DML queries perlu dijalankan di Supabase Dashboard</li>
              <li>• Gunakan templates untuk setup database</li>
              <li>• Export hasil ke CSV</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

