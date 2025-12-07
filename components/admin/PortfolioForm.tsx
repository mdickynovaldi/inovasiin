"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Loader2,
  Image as ImageIcon,
  Youtube,
  Plus,
  X,
  GripVertical,
  Star,
  Trash2,
  Link as LinkIcon,
} from "lucide-react";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { supabase } from "@/lib/supabase";
import { PortfolioWithRelations } from "@/types/database";
import RichTextEditor from "./RichTextEditor";
import Image from "next/image";

// Helper function to validate URL
const isValidUrl = (url: string): boolean => {
  if (!url || url.trim() === "") return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

interface MediaItem {
  id: string;
  type: "image" | "youtube";
  url: string;
  order_index: number;
}

interface StatItem {
  id: string;
  icon: string;
  value: string;
  label: string;
  order_index: number;
}

interface PortfolioFormProps {
  initialData?: PortfolioWithRelations | null;
}

const categories = [
  "Virtual Reality",
  "Augmented Reality",
  "Web Development",
  "3D Modeling",
  "Motion Graphics",
];
const iconOptions = [
  "TrendingUp",
  "Users",
  "Clock",
  "Award",
  "Eye",
  "Heart",
  "Star",
  "Zap",
  "Target",
  "CheckCircle",
];

// Sortable Media Item Component
function SortableMediaItem({
  item,
  onRemove,
}: {
  item: MediaItem;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative bg-white rounded-xl border border-gray-200 overflow-hidden group ${
        isDragging ? "shadow-lg opacity-90" : ""
      }`}>
      <div className="aspect-video bg-gray-100 relative">
        {item.type === "image" && isValidUrl(item.url) ? (
          <Image
            width={100}
            height={100}
            src={item.url}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : item.type === "youtube" ? (
          <div className="w-full h-full flex items-center justify-center bg-red-50">
            <Youtube className="w-12 h-12 text-red-500" />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <ImageIcon className="w-12 h-12 text-gray-300" />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={onRemove}
            className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 p-1.5 rounded-lg bg-white/90 backdrop-blur-sm cursor-grab active:cursor-grabbing">
        <GripVertical className="w-4 h-4 text-gray-500" />
      </div>

      {/* Type Badge */}
      <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-600 capitalize">
        {item.type}
      </div>
    </div>
  );
}

export default function PortfolioForm({ initialData }: PortfolioFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  // Form State
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "basic" | "media" | "details" | "testimonial"
  >("basic");

  // Basic Info
  const [title, setTitle] = useState(initialData?.title || "");
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [thumbnailUrl, setThumbnailUrl] = useState(
    initialData?.thumbnail_url || ""
  );
  const [category, setCategory] = useState(
    initialData?.category || categories[0]
  );
  const [industry, setIndustry] = useState(initialData?.industry || "");
  const [year, setYear] = useState(
    initialData?.year || new Date().getFullYear().toString()
  );
  const [isFeatured, setIsFeatured] = useState(
    initialData?.is_featured || false
  );

  // Details
  const [client, setClient] = useState(initialData?.client || "");
  const [duration, setDuration] = useState(initialData?.duration || "");
  const [challenge, setChallenge] = useState(initialData?.challenge || "");
  const [solution, setSolution] = useState(initialData?.solution || "");
  const [result, setResult] = useState(initialData?.result || "");

  // Media
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(
    initialData?.media?.map((m) => ({
      id: m.id,
      type: m.type,
      url: m.url,
      order_index: m.order_index,
    })) || []
  );
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [newMediaType, setNewMediaType] = useState<"image" | "youtube">(
    "image"
  );
  const [showMediaModal, setShowMediaModal] = useState(false);

  // Stats
  const [stats, setStats] = useState<StatItem[]>(
    initialData?.stats?.map((s) => ({
      id: s.id,
      icon: s.icon,
      value: s.value,
      label: s.label,
      order_index: s.order_index,
    })) || []
  );

  // Tags & Technologies
  const [tags, setTags] = useState<string[]>(
    initialData?.tags?.map((t) => t.name) || []
  );
  const [technologies, setTechnologies] = useState<string[]>(
    initialData?.technologies?.map((t) => t.name) || []
  );
  const [newTag, setNewTag] = useState("");
  const [newTech, setNewTech] = useState("");

  // Testimonial
  const [testimonialQuote, setTestimonialQuote] = useState(
    initialData?.testimonial?.quote || ""
  );
  const [testimonialAuthor, setTestimonialAuthor] = useState(
    initialData?.testimonial?.author || ""
  );
  const [testimonialRole, setTestimonialRole] = useState(
    initialData?.testimonial?.role || ""
  );

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle Media Drag End
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setMediaItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex).map((item, index) => ({
          ...item,
          order_index: index,
        }));
      });
    }
  };

  // Add Media
  const addMedia = () => {
    if (!newMediaUrl) return;

    let url = newMediaUrl;
    // Extract YouTube video ID if it's a YouTube URL
    if (newMediaType === "youtube") {
      const match = newMediaUrl.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
      );
      if (match) {
        url = match[1];
      }
    }

    setMediaItems([
      ...mediaItems,
      {
        id: uuidv4(),
        type: newMediaType,
        url,
        order_index: mediaItems.length,
      },
    ]);
    setNewMediaUrl("");
    setShowMediaModal(false);
  };

  // Remove Media
  const removeMedia = (id: string) => {
    setMediaItems(mediaItems.filter((m) => m.id !== id));
  };

  // Add Stat
  const addStat = () => {
    setStats([
      ...stats,
      {
        id: uuidv4(),
        icon: "TrendingUp",
        value: "",
        label: "",
        order_index: stats.length,
      },
    ]);
  };

  // Update Stat
  const updateStat = (id: string, field: keyof StatItem, value: string) => {
    setStats(stats.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  // Remove Stat
  const removeStat = (id: string) => {
    setStats(stats.filter((s) => s.id !== id));
  };

  // Add Tag
  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  // Add Technology
  const addTechnology = () => {
    if (newTech && !technologies.includes(newTech)) {
      setTechnologies([...technologies, newTech]);
      setNewTech("");
    }
  };

  // Save Portfolio
  const handleSave = async () => {
    if (!title || !category) {
      alert("Title dan Category wajib diisi");
      return;
    }

    setSaving(true);

    try {
      const portfolioData = {
        title,
        subtitle,
        description,
        thumbnail_url: thumbnailUrl || null,
        category,
        industry,
        year,
        client,
        duration,
        challenge,
        solution,
        result,
        is_featured: isFeatured,
      };

      let portfolioId = initialData?.id;

      if (isEditing && portfolioId) {
        // Update existing
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase.from("portfolios") as any)
          .update(portfolioData)
          .eq("id", portfolioId);

        if (error) throw error;

        // Delete existing related data
        await Promise.all([
          supabase
            .from("portfolio_media")
            .delete()
            .eq("portfolio_id", portfolioId),
          supabase
            .from("portfolio_stats")
            .delete()
            .eq("portfolio_id", portfolioId),
          supabase
            .from("portfolio_tags")
            .delete()
            .eq("portfolio_id", portfolioId),
          supabase
            .from("portfolio_technologies")
            .delete()
            .eq("portfolio_id", portfolioId),
          supabase
            .from("portfolio_testimonials")
            .delete()
            .eq("portfolio_id", portfolioId),
        ]);
      } else {
        // Create new
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase.from("portfolios") as any)
          .insert(portfolioData)
          .select()
          .single();

        if (error) throw error;
        portfolioId = data.id;
      }

      // Insert related data
      if (portfolioId) {
        const promises = [];

        // Media
        if (mediaItems.length > 0) {
          promises.push(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (supabase.from("portfolio_media") as any).insert(
              mediaItems.map((m, index) => ({
                portfolio_id: portfolioId,
                type: m.type,
                url: m.url,
                order_index: index,
              }))
            )
          );
        }

        // Stats
        if (stats.length > 0) {
          promises.push(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (supabase.from("portfolio_stats") as any).insert(
              stats.map((s, index) => ({
                portfolio_id: portfolioId,
                icon: s.icon,
                value: s.value,
                label: s.label,
                order_index: index,
              }))
            )
          );
        }

        // Tags
        if (tags.length > 0) {
          promises.push(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (supabase.from("portfolio_tags") as any).insert(
              tags.map((name) => ({
                portfolio_id: portfolioId,
                name,
              }))
            )
          );
        }

        // Technologies
        if (technologies.length > 0) {
          promises.push(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (supabase.from("portfolio_technologies") as any).insert(
              technologies.map((name) => ({
                portfolio_id: portfolioId,
                name,
              }))
            )
          );
        }

        // Testimonial
        if (testimonialQuote) {
          promises.push(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (supabase.from("portfolio_testimonials") as any).insert({
              portfolio_id: portfolioId,
              quote: testimonialQuote,
              author: testimonialAuthor,
              role: testimonialRole,
            })
          );
        }

        await Promise.all(promises);
      }

      router.push("/admin/portfolio");
    } catch (error) {
      console.error("Error saving portfolio:", error);
      alert("Gagal menyimpan portfolio");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "basic", label: "Informasi Dasar" },
    { id: "media", label: "Media" },
    { id: "details", label: "Detail Project" },
    { id: "testimonial", label: "Testimonial" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/portfolio">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-xl bg-white border border-gray-200 hover:border-[#f97316]/30 transition-colors">
              <ArrowLeft className="w-5 h-5 text-[#1e3a5f]" />
            </motion.button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#1e3a5f]">
              {isEditing ? "Edit Portfolio" : "Tambah Portfolio Baru"}
            </h1>
            <p className="text-[#1e3a5f]/60">
              {isEditing
                ? "Update informasi portfolio"
                : "Buat project showcase baru"}
            </p>
          </div>
        </div>

        <motion.button
          onClick={handleSave}
          disabled={saving}
          whileHover={{ scale: saving ? 1 : 1.02 }}
          whileTap={{ scale: saving ? 1 : 0.98 }}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-r from-[#f97316] to-[#ea580c] text-white font-medium shadow-lg shadow-orange-500/20 disabled:opacity-50">
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Simpan
            </>
          )}
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white p-2 rounded-xl border border-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-linear-to-r from-[#f97316] to-[#ea580c] text-white shadow-sm"
                : "text-[#1e3a5f]/70 hover:bg-gray-50"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <AnimatePresence mode="wait">
          {/* Basic Info Tab */}
          {activeTab === "basic" && (
            <motion.div
              key="basic"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6">
              {/* Featured Toggle */}
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                <div className="flex items-center gap-3">
                  <Star
                    className={`w-6 h-6 ${
                      isFeatured
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-400"
                    }`}
                  />
                  <div>
                    <p className="font-semibold text-[#1e3a5f]">
                      Featured Project
                    </p>
                    <p className="text-sm text-[#1e3a5f]/60">
                      Tampilkan di homepage dan halaman portfolio featured
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsFeatured(!isFeatured)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    isFeatured ? "bg-yellow-400" : "bg-gray-200"
                  }`}>
                  <span
                    className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
                      isFeatured ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                  Thumbnail URL
                </label>
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-[#1e3a5f] placeholder:text-[#1e3a5f]/40 focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316]"
                  />
                  {isValidUrl(thumbnailUrl) && (
                    <div className="w-20 h-12 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        width={100}
                        height={100}
                        src={thumbnailUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nama Project"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#1e3a5f] placeholder:text-[#1e3a5f]/40 focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316]"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Deskripsi singkat project"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#1e3a5f] placeholder:text-[#1e3a5f]/40 focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                  Deskripsi
                </label>
                <RichTextEditor value={description} onChange={setDescription} />
              </div>

              {/* Category & Industry */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316]">
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g., Healthcare, Education"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#1e3a5f] placeholder:text-[#1e3a5f]/40 focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316]"
                  />
                </div>
              </div>

              {/* Year */}
              <div className="w-1/2">
                <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                  Year
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2024"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#1e3a5f] placeholder:text-[#1e3a5f]/40 focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316]"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#1e3a5f]/5 text-sm text-[#1e3a5f]">
                      {tag}
                      <button
                        onClick={() => setTags(tags.filter((t) => t !== tag))}
                        className="p-0.5 rounded-full hover:bg-[#1e3a5f]/10">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    placeholder="Tambah tag..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#1e3a5f] placeholder:text-[#1e3a5f]/40 focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316]"
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2.5 rounded-xl bg-[#1e3a5f]/5 text-[#1e3a5f] hover:bg-[#1e3a5f]/10 transition-colors">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                  Technologies
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {technologies.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#f97316]/10 text-sm text-[#f97316]">
                      {tech}
                      <button
                        onClick={() =>
                          setTechnologies(
                            technologies.filter((t) => t !== tech)
                          )
                        }
                        className="p-0.5 rounded-full hover:bg-[#f97316]/20">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTechnology())
                    }
                    placeholder="Tambah technology..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#1e3a5f] placeholder:text-[#1e3a5f]/40 focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316]"
                  />
                  <button
                    onClick={addTechnology}
                    className="px-4 py-2.5 rounded-xl bg-[#f97316]/10 text-[#f97316] hover:bg-[#f97316]/20 transition-colors">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Media Tab */}
          {activeTab === "media" && (
            <motion.div
              key="media"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[#1e3a5f]">
                    Media Gallery
                  </h3>
                  <p className="text-sm text-[#1e3a5f]/60">
                    Drag untuk mengatur urutan tampilan
                  </p>
                </div>
                <button
                  onClick={() => setShowMediaModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f97316]/10 text-[#f97316] font-medium hover:bg-[#f97316]/20 transition-colors">
                  <Plus className="w-5 h-5" />
                  Tambah Media
                </button>
              </div>

              {mediaItems.length > 0 ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}>
                  <SortableContext
                    items={mediaItems.map((i) => i.id)}
                    strategy={verticalListSortingStrategy}>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {mediaItems.map((item) => (
                        <SortableMediaItem
                          key={item.id}
                          item={item}
                          onRemove={() => removeMedia(item.id)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                  <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-[#1e3a5f]/60 mb-4">Belum ada media</p>
                  <button
                    onClick={() => setShowMediaModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#f97316] text-white text-sm font-medium hover:bg-[#ea580c] transition-colors">
                    <Plus className="w-4 h-4" />
                    Tambah Media
                  </button>
                </div>
              )}

              {/* Stats Section */}
              <div className="pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-[#1e3a5f]">Statistics</h3>
                    <p className="text-sm text-[#1e3a5f]/60">
                      Tambahkan statistik project
                    </p>
                  </div>
                  <button
                    onClick={addStat}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1e3a5f]/5 text-[#1e3a5f] font-medium hover:bg-[#1e3a5f]/10 transition-colors">
                    <Plus className="w-5 h-5" />
                    Tambah Stat
                  </button>
                </div>

                <div className="space-y-3">
                  {stats.map((stat) => (
                    <div
                      key={stat.id}
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <select
                        value={stat.icon}
                        onChange={(e) =>
                          updateStat(stat.id, "icon", e.target.value)
                        }
                        className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-[#f97316]/30">
                        {iconOptions.map((icon) => (
                          <option key={icon} value={icon}>
                            {icon}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) =>
                          updateStat(stat.id, "value", e.target.value)
                        }
                        placeholder="e.g., +40%"
                        className="w-24 px-3 py-2 rounded-lg border border-gray-200 text-sm text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-[#f97316]/30"
                      />
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) =>
                          updateStat(stat.id, "label", e.target.value)
                        }
                        placeholder="e.g., Conversion Rate"
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-[#f97316]/30"
                      />
                      <button
                        onClick={() => removeStat(stat.id)}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Details Tab */}
          {activeTab === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                    Client
                  </label>
                  <input
                    type="text"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="Nama Perusahaan"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#1e3a5f] placeholder:text-[#1e3a5f]/40 focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 3 Bulan"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#1e3a5f] placeholder:text-[#1e3a5f]/40 focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                  Challenge
                </label>
                <textarea
                  value={challenge}
                  onChange={(e) => setChallenge(e.target.value)}
                  placeholder="Tantangan yang dihadapi dalam project ini..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#1e3a5f] placeholder:text-[#1e3a5f]/40 focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                  Solution
                </label>
                <textarea
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  placeholder="Solusi yang kami berikan..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#1e3a5f] placeholder:text-[#1e3a5f]/40 focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                  Result
                </label>
                <textarea
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  placeholder="Hasil yang dicapai..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#1e3a5f] placeholder:text-[#1e3a5f]/40 focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] resize-none"
                />
              </div>
            </motion.div>
          )}

          {/* Testimonial Tab */}
          {activeTab === "testimonial" && (
            <motion.div
              key="testimonial"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                  Quote
                </label>
                <textarea
                  value={testimonialQuote}
                  onChange={(e) => setTestimonialQuote(e.target.value)}
                  placeholder="Testimoni dari client..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#1e3a5f] placeholder:text-[#1e3a5f]/40 focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={testimonialAuthor}
                    onChange={(e) => setTestimonialAuthor(e.target.value)}
                    placeholder="Nama Pemberi Testimoni"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#1e3a5f] placeholder:text-[#1e3a5f]/40 focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                    Role/Position
                  </label>
                  <input
                    type="text"
                    value={testimonialRole}
                    onChange={(e) => setTestimonialRole(e.target.value)}
                    placeholder="e.g., CEO, Company Name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#1e3a5f] placeholder:text-[#1e3a5f]/40 focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316]"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Media Modal */}
      <AnimatePresence>
        {showMediaModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowMediaModal(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#1e3a5f]">
                  Tambah Media
                </h3>
                <button
                  onClick={() => setShowMediaModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Media Type */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setNewMediaType("image")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                      newMediaType === "image"
                        ? "border-[#f97316] bg-[#f97316]/5 text-[#f97316]"
                        : "border-gray-200 text-[#1e3a5f]/60 hover:border-gray-300"
                    }`}>
                    <ImageIcon className="w-5 h-5" />
                    Image
                  </button>
                  <button
                    onClick={() => setNewMediaType("youtube")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                      newMediaType === "youtube"
                        ? "border-red-500 bg-red-50 text-red-500"
                        : "border-gray-200 text-[#1e3a5f]/60 hover:border-gray-300"
                    }`}>
                    <Youtube className="w-5 h-5" />
                    YouTube
                  </button>
                </div>

                {/* URL Input */}
                <div>
                  <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                    {newMediaType === "image" ? "Image URL" : "YouTube URL"}
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1e3a5f]/40" />
                    <input
                      type="url"
                      value={newMediaUrl}
                      onChange={(e) => setNewMediaUrl(e.target.value)}
                      placeholder={
                        newMediaType === "image"
                          ? "https://example.com/image.jpg"
                          : "https://youtube.com/watch?v=..."
                      }
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 text-[#1e3a5f] placeholder:text-[#1e3a5f]/40 focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316]"
                    />
                  </div>
                </div>

                {/* Preview */}
                {isValidUrl(newMediaUrl) && (
                  <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                    {newMediaType === "image" ? (
                      <Image
                        width={100}
                        height={100}
                        src={newMediaUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-red-50">
                        <Youtube className="w-16 h-16 text-red-500" />
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowMediaModal(false)}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-[#1e3a5f] font-medium hover:bg-gray-50 transition-colors">
                    Batal
                  </button>
                  <button
                    onClick={addMedia}
                    disabled={!newMediaUrl}
                    className="flex-1 px-4 py-3 rounded-xl bg-[#f97316] text-white font-medium hover:bg-[#ea580c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Tambah
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
