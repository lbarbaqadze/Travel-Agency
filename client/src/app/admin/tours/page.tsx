'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { api, ApiError } from '@/lib/api'
import { ENDPOINTS } from '@/lib/endpoints'
import { categoryLabel } from '@/types/tour'
import type { Pagination, Tour } from '@/types/tour'

interface AdminTour extends Tour {
  image_count?: number
}

interface ToursAdminResponse {
  status: string
  results: number
  pagination: Pagination
  data: { tours: AdminTour[] }
}

export default function AdminToursPage() {
  const router = useRouter()
  const [tours, setTours] = useState<AdminTour[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchTours = useCallback(() => {
    setIsLoading(true)
    api<ToursAdminResponse>(ENDPOINTS.toursAdmin('limit=100'))
      .then((res) => setTours(res.data.tours))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load tours'))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    fetchTours()
  }, [fetchTours])

  async function confirmDelete() {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await api(ENDPOINTS.deleteTour(deleteId), { method: 'DELETE' })
      setTours((prev) => prev.filter((t) => t.id !== deleteId))
      setDeleteId(null)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete tour')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex flex-col gap-4 border-b border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-900 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5 lg:px-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-light tracking-tight text-neutral-900 dark:text-white">Tours</h1>
          <p className="mt-1 text-sm text-neutral-500">{tours.length} tours total</p>
        </div>
        <Link
          href="/admin/tours/new"
          className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-black dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          New tour
        </Link>
      </header>

      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
          </div>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : tours.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900 p-12 text-center">
            <p className="text-sm text-neutral-500">No tours yet.</p>
            <Link
              href="/admin/tours/new"
              className="mt-4 inline-flex rounded-full bg-neutral-900 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white"
            >
              Create first tour
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-900 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/80 dark:bg-neutral-900/80">
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Tour</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Destination</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Category</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Price</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Status</th>
                    <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-neutral-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tours.map((tour) => (
                    <tr key={tour.id} className="border-b border-neutral-50 last:border-0 dark:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                            {tour.cover_image ? (
                              <Image src={tour.cover_image} alt="" fill sizes="44px" className="object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] text-neutral-300">—</div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-neutral-900 dark:text-white truncate">{tour.title}</p>
                            <p className="text-xs text-neutral-400 font-mono truncate">{tour.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-neutral-600">{tour.destination}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-neutral-600">
                          {categoryLabel(tour.category)}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-white">${Number(tour.price).toFixed(0)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${
                            tour.is_active
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-neutral-100 text-neutral-400'
                          }`}
                        >
                          {tour.is_active ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => router.push(`/admin/tours/${tour.id}`)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteId(tour.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-red-50 hover:text-red-500"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteId !== null}
        title="Delete this tour?"
        description="This will permanently remove the tour and all its images from the database. This can't be undone."
        confirmLabel="Delete"
        cancelLabel="Keep it"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
