'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Loader2, Image as ImageIcon, Check, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

interface ImageUploadProps {
  onUpload: (url: string) => void
  currentUrl?: string
  bucketName?: string
  folder?: string
  accept?: string
  maxSize?: number // in MB
}

export default function ImageUpload({
  onUpload,
  currentUrl,
  bucketName = 'portfolio-images',
  folder = 'thumbnails',
  accept = 'image/*',
  maxSize = 5, // 5MB default
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(currentUrl || null)
  const [dragActive, setDragActive] = useState(false)

  const handleUpload = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar')
      return
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Ukuran file maksimal ${maxSize}MB`)
      return
    }

    setUploading(true)
    setError(null)

    try {
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target?.result as string)
      reader.readAsDataURL(file)

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${uuidv4()}.${fileExt}`

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path)

      onUpload(publicUrl)
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Gagal mengupload gambar')
      setPreview(currentUrl || null)
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0])
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0])
    }
  }

  const clearImage = () => {
    setPreview(null)
    onUpload('')
  }

  return (
    <div className="space-y-3">
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl transition-all ${
          dragActive
            ? 'border-[#f97316] bg-[#f97316]/5'
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-200 hover:border-[#f97316]/50 bg-gray-50'
        }`}
      >
        {preview ? (
          <div className="relative aspect-video">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover rounded-xl"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
              <label className="cursor-pointer p-3 rounded-full bg-white text-[#1e3a5f] hover:bg-gray-100 transition-colors">
                <Upload className="w-5 h-5" />
                <input
                  type="file"
                  accept={accept}
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
              <button
                onClick={clearImage}
                className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Upload Progress */}
            {uploading && (
              <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[#f97316] mx-auto mb-2" />
                  <p className="text-sm text-[#1e3a5f]">Uploading...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center py-12 cursor-pointer">
            <input
              type="file"
              accept={accept}
              onChange={handleChange}
              disabled={uploading}
              className="hidden"
            />
            {uploading ? (
              <>
                <Loader2 className="w-12 h-12 text-[#f97316] animate-spin mb-3" />
                <p className="text-sm text-[#1e3a5f]">Uploading...</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-[#f97316]/10 flex items-center justify-center mb-4">
                  <ImageIcon className="w-8 h-8 text-[#f97316]" />
                </div>
                <p className="text-[#1e3a5f] font-medium mb-1">
                  Drag & drop gambar atau klik untuk upload
                </p>
                <p className="text-sm text-[#1e3a5f]/50">
                  PNG, JPG, GIF hingga {maxSize}MB
                </p>
              </>
            )}
          </label>
        )}
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className="text-sm text-red-600">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* URL Input Alternative */}
      <div className="flex items-center gap-2 text-sm text-[#1e3a5f]/50">
        <div className="flex-1 h-px bg-gray-200" />
        <span>atau masukkan URL gambar</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <input
        type="url"
        value={preview || ''}
        onChange={(e) => {
          setPreview(e.target.value)
          onUpload(e.target.value)
        }}
        placeholder="https://example.com/image.jpg"
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#1e3a5f] placeholder:text-[#1e3a5f]/40 focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316]"
      />
    </div>
  )
}

