'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { ImagePlus, Loader2, Star, Trash2, Upload } from 'lucide-react'
import { uploadTourImage } from '@/lib/admin'

export interface TourImageInput {
  url: string
  public_id: string
  image_type: 'destination' | 'hotel'
  is_cover: boolean
}

interface ImageUploaderProps {
  slug: string
  images: TourImageInput[]
  onChange: (images: TourImageInput[]) => void
  error?: string
}

export default function ImageUploader({ slug, images, onChange, error }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  async function handleFiles(fileList: FileList | null) {
    if (!fileList?.length) return
    if (!slug.trim()) {
      setUploadError('Enter a slug before uploading images')
      return
    }

    setUploadError(null)
    setUploading(true)

    const next = [...images]

    try {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i]
        const publicId = `${slug}-${next.length + 1}`
        const uploaded = await uploadTourImage(file, slug, publicId)
        next.push({
          url: uploaded.url,
          public_id: uploaded.public_id,
          image_type: 'destination',
          is_cover: next.length === 0,
        })
      }
      onChange(next)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  function removeImage(index: number) {
    const next = images.filter((_, i) => i !== index)
    if (next.length > 0 && !next.some((img) => img.is_cover)) {
      next[0] = { ...next[0], is_cover: true }
    }
    onChange(next)
  }

  function setCover(index: number) {
    onChange(images.map((img, i) => ({ ...img, is_cover: i === index })))
  }

  function setType(index: number, image_type: 'destination' | 'hotel') {
    onChange(images.map((img, i) => (i === index ? { ...img, image_type } : img)))
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          handleFiles(e.dataTransfer.files)
        }}
        className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 transition-colors ${
          dragOver ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200 bg-neutral-50/50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
            <p className="text-sm text-neutral-500">Uploading to Cloudinary...</p>
          </>
        ) : (
          <>
            <ImagePlus className="h-8 w-8 text-neutral-300" />
            <div className="text-center">
              <p className="text-sm font-medium text-neutral-700">Drop images here or browse</p>
              <p className="mt-1 text-xs text-neutral-400">
                Uploaded to folder: <span className="font-mono">travel-agency/tours/{slug || '...'}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={!slug.trim()}
              className="flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-black disabled:opacity-40"
            >
              <Upload className="h-3.5 w-3.5" />
              Choose files
            </button>
          </>
        )}
      </div>

      {(uploadError || error) && (
        <p className="text-xs font-medium text-red-600">{uploadError || error}</p>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((img, i) => (
            <div
              key={`${img.public_id}-${i}`}
              className={`group relative overflow-hidden rounded-2xl border bg-neutral-100 ${
                img.is_cover ? 'border-neutral-900 ring-2 ring-neutral-900' : 'border-neutral-200'
              }`}
            >
              <div className="relative aspect-square">
                <Image src={img.url} alt="" fill sizes="160px" className="object-cover" />
              </div>

              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-linear-to-t from-black/70 to-transparent p-2 pt-6">
                <select
                  value={img.image_type}
                  onChange={(e) => setType(i, e.target.value as 'destination' | 'hotel')}
                  className="rounded-md bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-700 outline-none"
                >
                  <option value="destination">Destination</option>
                  <option value="hotel">Hotel</option>
                </select>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCover(i)}
                    title="Set as cover"
                    className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                      img.is_cover ? 'bg-amber-400 text-white' : 'bg-white/90 text-neutral-500 hover:text-amber-500'
                    }`}
                  >
                    <Star className={`h-3.5 w-3.5 ${img.is_cover ? 'fill-white' : ''}`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    title="Remove"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-neutral-500 transition-colors hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {img.is_cover && (
                <span className="absolute left-2 top-2 rounded-full bg-neutral-900 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
