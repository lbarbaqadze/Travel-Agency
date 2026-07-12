'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import ImageUploader, { type TourImageInput } from '@/components/admin/ImageUploader'
import { api, ApiError } from '@/lib/api'
import { slugify, toDateInputValue } from '@/lib/admin'
import { ENDPOINTS } from '@/lib/endpoints'
import { CATEGORY_LABELS } from '@/types/tour'
import type { TourDetail } from '@/types/tour'

interface TourFormProps {
  mode: 'create' | 'edit'
  tour?: TourDetail | null
}

interface FormState {
  title: string
  slug: string
  description: string
  destination: string
  price: string
  durationDays: string
  maxGuests: string
  startDate: string
  endDate: string
  category: string
  isActive: boolean
  images: TourImageInput[]
}

const emptyForm: FormState = {
  title: '',
  slug: '',
  description: '',
  destination: '',
  price: '',
  durationDays: '',
  maxGuests: '',
  startDate: '',
  endDate: '',
  category: 'cultural',
  isActive: true,
  images: [],
}

function tourToForm(tour: TourDetail): FormState {
  return {
    title: tour.title,
    slug: tour.slug,
    description: tour.description,
    destination: tour.destination,
    price: String(tour.price),
    durationDays: String(tour.duration_days),
    maxGuests: String(tour.max_guests),
    startDate: toDateInputValue(tour.start_date),
    endDate: toDateInputValue(tour.end_date),
    category: tour.category,
    isActive: Boolean(tour.is_active),
    images: tour.images.map((img) => ({
      url: img.url,
      public_id: img.public_id,
      image_type: (img.image_type === 'hotel' ? 'hotel' : 'destination') as 'destination' | 'hotel',
      is_cover: Boolean(img.is_cover),
    })),
  }
}

const inputClass =
  'w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:focus:border-neutral-500'
const labelClass = 'text-[10px] font-bold uppercase tracking-widest text-neutral-400'

export default function TourForm({ mode, tour }: TourFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(emptyForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (tour) {
      setForm(tourToForm(tour))
    }
  }, [tour])

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function generateSlugFromTitle() {
    setForm((prev) => ({ ...prev, slug: slugify(prev.title) }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (form.images.length === 0) {
      setError('Add at least one image')
      return
    }

    setIsSubmitting(true)

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
      destination: form.destination.trim(),
      price: Number(form.price),
      durationDays: Number(form.durationDays),
      maxGuests: Number(form.maxGuests),
      startDate: form.startDate,
      endDate: form.endDate,
      category: form.category,
      isActive: form.isActive,
      images: form.images,
    }

    try {
      if (mode === 'create') {
        await api(ENDPOINTS.createTour, {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        router.push('/admin/tours')
      } else if (tour) {
        await api(ENDPOINTS.updateTour(tour.id), {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
        router.push('/admin/tours')
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Title</label>
          <input
            required
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Kakheti Wine Tour"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <label className={labelClass}>Slug</label>
            {mode === 'create' && (
              <button
                type="button"
                onClick={generateSlugFromTitle}
                disabled={!form.title.trim()}
                className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 transition-colors hover:text-neutral-900 disabled:opacity-40"
              >
                Generate from title
              </button>
            )}
          </div>
          <input
            required
            value={form.slug}
            onChange={(e) => updateField('slug', e.target.value)}
            pattern="^[a-z0-9-]+$"
            placeholder="kakheti-getaway"
            className={`${inputClass} font-mono`}
          />
          <p className="text-[11px] text-neutral-400">
            URL path and Cloudinary folder — fill in manually or use generate
          </p>
        </div>

        <div className="flex flex-col gap-1.5 lg:col-span-2">
          <label className={labelClass}>Description</label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Describe the tour experience..."
            className={`${inputClass} resize-y min-h-[120px]`}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Destination</label>
          <input
            required
            value={form.destination}
            onChange={(e) => updateField('destination', e.target.value)}
            placeholder="Kakheti, Georgia"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Category</label>
          <select
            required
            value={form.category}
            onChange={(e) => updateField('category', e.target.value)}
            className={inputClass}
          >
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Price (USD)</label>
          <input
            required
            type="number"
            min="1"
            step="0.01"
            value={form.price}
            onChange={(e) => updateField('price', e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Duration (days)</label>
          <input
            required
            type="number"
            min="1"
            value={form.durationDays}
            onChange={(e) => updateField('durationDays', e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Max guests</label>
          <input
            required
            type="number"
            min="1"
            value={form.maxGuests}
            onChange={(e) => updateField('maxGuests', e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Start date</label>
          <input
            required
            type="date"
            value={form.startDate}
            onChange={(e) => updateField('startDate', e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>End date</label>
          <input
            required
            type="date"
            value={form.endDate}
            onChange={(e) => updateField('endDate', e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex items-center gap-3 lg:col-span-2">
          <button
            type="button"
            role="switch"
            aria-checked={form.isActive}
            onClick={() => updateField('isActive', !form.isActive)}
            className={`relative h-6 w-11 rounded-full transition-colors ${form.isActive ? 'bg-neutral-900' : 'bg-neutral-200'}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                form.isActive ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
          <span className="text-sm text-neutral-600">
            {form.isActive ? 'Tour is active and visible on the site' : 'Tour is hidden from public listings'}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className={labelClass}>Photos</label>
        <ImageUploader
          slug={form.slug}
          images={form.images}
          onChange={(images) => updateField('images', images)}
        />
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>
      )}

      <div className="flex items-center gap-3 border-t border-neutral-100 pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-full bg-neutral-900 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-black disabled:opacity-60"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === 'create' ? 'Create Tour' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/tours')}
          className="rounded-full px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-neutral-500 transition-colors hover:bg-neutral-100"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
