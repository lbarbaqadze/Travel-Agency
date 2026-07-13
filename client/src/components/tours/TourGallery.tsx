'use client'

import { useState } from 'react'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ImageOff } from 'lucide-react'
import { optimizeImageUrl } from '@/lib/cloudinary'
import type { TourImage } from '@/types/tour'

interface TourGalleryProps {
  images: TourImage[]
  alt: string
}

export default function TourGallery({ images, alt }: TourGalleryProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const sorted = [...images].sort((a, b) => Number(b.is_cover) - Number(a.is_cover))
  const [failed, setFailed] = useState<Record<number, boolean>>({})

  const photoParam = Number(searchParams.get('photo') ?? '1') || 1
  const activeIndex = Math.min(sorted.length - 1, Math.max(0, photoParam - 1))

  function selectPhoto(index: number) {
    const params = new URLSearchParams(searchParams.toString())
    if (index > 0) params.set('photo', String(index + 1))
    else params.delete('photo')
    router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false })
  }

  const active = sorted[activeIndex]
  const showFallback = !active || failed[activeIndex]

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-4/3 sm:aspect-video w-full overflow-hidden rounded-3xl bg-neutral-100 dark:bg-neutral-900">
        <AnimatePresence mode="wait">
          {showFallback ? (
            <motion.div
              key="fallback"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full w-full flex-col items-center justify-center gap-2 bg-linear-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800"
            >
              <ImageOff className="h-8 w-8 text-neutral-400" strokeWidth={1.5} />
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                {alt}
              </span>
            </motion.div>
          ) : (
            <motion.div
              key={active.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0"
            >
              <Image
                src={optimizeImageUrl(active.url, { width: 1600, crop: 'limit' })}
                alt={alt}
                fill
                priority={activeIndex === 0}
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
                onError={() => setFailed((f) => ({ ...f, [activeIndex]: true }))}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {sorted.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => selectPhoto(i)}
              className={`relative aspect-square overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900 ring-2 transition-all ${
                i === activeIndex
                  ? 'ring-neutral-900 dark:ring-white'
                  : 'ring-transparent hover:ring-neutral-300 dark:hover:ring-neutral-600'
              }`}
            >
              {failed[i] ? (
                <div className="flex h-full w-full items-center justify-center bg-neutral-100 dark:bg-neutral-900">
                  <ImageOff className="h-4 w-4 text-neutral-400" strokeWidth={1.5} />
                </div>
              ) : (
                <Image
                  src={optimizeImageUrl(img.url, { width: 192, height: 192, crop: 'fill' })}
                  alt=""
                  fill
                  loading="lazy"
                  sizes="96px"
                  className="cursor-pointer object-cover"
                  onError={() => setFailed((f) => ({ ...f, [i]: true }))}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
