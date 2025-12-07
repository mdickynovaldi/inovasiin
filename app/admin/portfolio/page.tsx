"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Star,
  StarOff,
  Edit2,
  Trash2,
  Eye,
  MoreVertical,
  Loader2,
  FolderKanban,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Portfolio } from "@/types/database";
import Image from "next/image";

const categories = [
  "All",
  "Virtual Reality",
  "Augmented Reality",
  "Web Development",
  "3D Modeling",
  "Motion Graphics",
];

export default function PortfolioListPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  async function fetchPortfolios() {
    try {
      const { data, error } = await supabase
        .from("portfolios")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPortfolios(data || []);
    } catch (error) {
      console.error("Error fetching portfolios:", error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleFeatured(id: string, currentValue: boolean) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("portfolios") as any)
        .update({ is_featured: !currentValue })
        .eq("id", id);

      if (error) throw error;

      setPortfolios((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, is_featured: !currentValue } : p
        )
      );
    } catch (error) {
      console.error("Error toggling featured:", error);
    }
  }

  async function deletePortfolio(id: string) {
    setDeleting(true);
    try {
      // Delete related data first
      await supabase.from("portfolio_media").delete().eq("portfolio_id", id);
      await supabase.from("portfolio_stats").delete().eq("portfolio_id", id);
      await supabase.from("portfolio_tags").delete().eq("portfolio_id", id);
      await supabase
        .from("portfolio_technologies")
        .delete()
        .eq("portfolio_id", id);
      await supabase
        .from("portfolio_testimonials")
        .delete()
        .eq("portfolio_id", id);

      // Delete portfolio
      const { error } = await supabase.from("portfolios").delete().eq("id", id);

      if (error) throw error;

      setPortfolios((prev) => prev.filter((p) => p.id !== id));
      setShowDeleteModal(null);
    } catch (error) {
      console.error("Error deleting portfolio:", error);
    } finally {
      setDeleting(false);
    }
  }

  const filteredPortfolios = portfolios.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1e3a5f]">Portfolio</h1>
          <p className="text-[#1e3a5f]/60">
            Kelola semua project portfolio Anda
          </p>
        </div>
        <Link href="/admin/portfolio/new">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#f97316] to-[#ea580c] text-white font-medium shadow-lg shadow-orange-500/20">
            <Plus className="w-5 h-5" />
            Tambah Baru
          </motion.button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1e3a5f]/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari portfolio..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-[#1e3a5f] placeholder:text-[#1e3a5f]/40 focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316]"
          />
        </div>
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="appearance-none pl-4 pr-10 py-3 rounded-xl border border-gray-200 bg-white text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] cursor-pointer">
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1e3a5f]/40 pointer-events-none" />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 text-sm">
        <span className="text-[#1e3a5f]/60">
          Total:{" "}
          <span className="font-semibold text-[#1e3a5f]">
            {portfolios.length}
          </span>
        </span>
        <span className="text-[#1e3a5f]/60">
          Featured:{" "}
          <span className="font-semibold text-[#f97316]">
            {portfolios.filter((p) => p.is_featured).length}
          </span>
        </span>
        <span className="text-[#1e3a5f]/60">
          Showing:{" "}
          <span className="font-semibold text-[#1e3a5f]">
            {filteredPortfolios.length}
          </span>
        </span>
      </div>

      {/* Portfolio Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredPortfolios.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPortfolios.map((portfolio, index) => (
            <motion.div
              key={portfolio.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-[#f97316]/20 transition-all">
              {/* Thumbnail */}
              <div className="relative h-48 bg-linear-to-br from-[#1e3a5f] to-[#0f2847]">
                {portfolio.thumbnail_url ? (
                  <Image
                    src={portfolio.thumbnail_url}
                    alt={portfolio.title}
                    className="w-full h-full object-cover"
                    width={100}
                    height={100}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl font-bold text-white/10">
                      {portfolio.title.charAt(0)}
                    </span>
                  </div>
                )}

                {/* Featured Badge */}
                {portfolio.is_featured && (
                  <div className="absolute top-3 left-3">
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-400 text-yellow-900 text-xs font-semibold shadow-lg">
                      <Star className="w-3 h-3" />
                      Featured
                    </span>
                  </div>
                )}

                {/* Category */}
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs text-[#1e3a5f] font-medium">
                    {portfolio.category}
                  </span>
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <Link href={`/portfolio/${portfolio.id}`} target="_blank">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 rounded-full bg-white text-[#1e3a5f] shadow-lg">
                      <Eye className="w-5 h-5" />
                    </motion.button>
                  </Link>
                  <Link href={`/admin/portfolio/${portfolio.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 rounded-full bg-[#f97316] text-white shadow-lg">
                      <Edit2 className="w-5 h-5" />
                    </motion.button>
                  </Link>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="text-sm text-[#f97316] font-medium mb-1">
                  {portfolio.industry}
                </p>
                <h3 className="font-bold text-[#1e3a5f] text-lg mb-2 line-clamp-1">
                  {portfolio.title}
                </h3>
                <p className="text-sm text-[#1e3a5f]/60 line-clamp-2 mb-4">
                  {portfolio.subtitle}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        toggleFeatured(portfolio.id, portfolio.is_featured)
                      }
                      className={`p-2 rounded-lg transition-colors ${
                        portfolio.is_featured
                          ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                          : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                      }`}
                      title={
                        portfolio.is_featured
                          ? "Remove from featured"
                          : "Add to featured"
                      }>
                      {portfolio.is_featured ? (
                        <Star className="w-4 h-4" />
                      ) : (
                        <StarOff className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveMenu(
                          activeMenu === portfolio.id ? null : portfolio.id
                        )
                      }
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <MoreVertical className="w-4 h-4 text-[#1e3a5f]/50" />
                    </button>

                    <AnimatePresence>
                      {activeMenu === portfolio.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="absolute right-0 bottom-full mb-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-10">
                          <Link
                            href={`/admin/portfolio/${portfolio.id}`}
                            className="flex items-center gap-2 px-4 py-3 text-sm text-[#1e3a5f] hover:bg-gray-50 transition-colors">
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </Link>
                          <button
                            onClick={() => {
                              setShowDeleteModal(portfolio.id);
                              setActiveMenu(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors">
                            <Trash2 className="w-4 h-4" />
                            Hapus
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <FolderKanban className="w-16 h-16 mx-auto text-[#1e3a5f]/20 mb-4" />
          <h3 className="text-xl font-semibold text-[#1e3a5f] mb-2">
            {searchQuery || selectedCategory !== "All"
              ? "Tidak Ditemukan"
              : "Belum Ada Portfolio"}
          </h3>
          <p className="text-[#1e3a5f]/60 mb-6">
            {searchQuery || selectedCategory !== "All"
              ? "Coba ubah filter atau kata kunci pencarian"
              : "Mulai tambahkan portfolio project Anda"}
          </p>
          {!searchQuery && selectedCategory === "All" && (
            <Link href="/admin/portfolio/new">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-[#f97316] to-[#ea580c] text-white font-medium shadow-lg shadow-orange-500/20">
                <Plus className="w-5 h-5" />
                Tambah Portfolio
              </motion.button>
            </Link>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => !deleting && setShowDeleteModal(null)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">
                  Hapus Portfolio?
                </h3>
                <p className="text-[#1e3a5f]/60 mb-6">
                  Tindakan ini tidak dapat dibatalkan. Portfolio dan semua data
                  terkait akan dihapus permanen.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(null)}
                    disabled={deleting}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-[#1e3a5f] font-medium hover:bg-gray-50 transition-colors disabled:opacity-50">
                    Batal
                  </button>
                  <button
                    onClick={() => deletePortfolio(showDeleteModal)}
                    disabled={deleting}
                    className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                    {deleting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Menghapus...
                      </>
                    ) : (
                      "Hapus"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close menu */}
      {activeMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setActiveMenu(null)}
        />
      )}
    </div>
  );
}
