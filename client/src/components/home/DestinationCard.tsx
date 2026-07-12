'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ImageOff, Plane, Star } from 'lucide-react'
import { optimizeImageUrl } from '@/lib/cloudinary'
import type { Tour } from '@/types/tour'
import { categoryLabel } from '@/types/tour'

function decorativeRating(id: number): string {
  return (4.5 + ((id * 7) % 5) / 10).toFixed(1)
}

function decorativeReviews(id: number): number {
  return 20 + ((id * 13) % 180)
}

export default function DestinationCard({ tour }: { tour: Tour }) {
  const price = Number(tour.price)
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="group flex flex-col rounded-3xl overflow-hidden bg-white border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 dark:bg-neutral-900 dark:border-neutral-800 dark:hover:shadow-black/30"
    >
      <div className="relative aspect-4/5 w-full overflow-hidden bg-neutral-100">
        {tour.cover_image && !imageFailed ? (
          <Image
            src={optimizeImageUrl(tour.cover_image, { width: 640, height: 800, crop: 'fill' })}
            alt={tour.destination}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-linear-to-br from-neutral-100 to-neutral-200">
            <ImageOff className="h-6 w-6 text-neutral-400" strokeWidth={1.5} />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
              {tour.destination}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0" />

        <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-900">
          <Plane className="h-3 w-3" strokeWidth={2.5} />
          {categoryLabel(tour.category)}
        </span>

        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1">
          <Star className="h-3 w-3 fill-neutral-900 text-neutral-900" />
          <span className="text-[11px] font-bold text-neutral-900">{decorativeRating(tour.id)}</span>
          <span className="text-[10px] text-neutral-500">({decorativeReviews(tour.id)})</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-bold text-neutral-900 leading-tight dark:text-white">{tour.destination}</h3>
        </div>
        <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed dark:text-neutral-400">{tour.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <span className="text-sm font-bold text-neutral-900 dark:text-white">
            ${price.toFixed(0)}
            <span className="text-[10px] font-medium text-neutral-400"> / person</span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 group-hover:text-neutral-900 transition-colors dark:group-hover:text-white">
            {tour.duration_days} days
          </span>
        </div>
      </div>
    </Link>
  )
}
