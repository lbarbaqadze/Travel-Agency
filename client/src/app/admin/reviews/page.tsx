'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2, Star, Trash2 } from 'lucide-react'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { api, ApiError } from '@/lib/api'
import { ENDPOINTS } from '@/lib/endpoints'

interface AdminReview {
  id: number
  rating: number
  comment: string | null
  created_at: string
  name: string
  surname: string
  email: string
  tour_title: string
  destination: string
  tour_slug: string
}

interface ReviewsAdminResponse {
  status: string
  results: number
  data: { reviews: AdminReview[] }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200 dark:text-neutral-700'}`}
          strokeWidth={1.5}
        />
      ))}
    </div>
  )
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchReviews = useCallback(() => {
    setIsLoading(true)
    api<ReviewsAdminResponse>(ENDPOINTS.reviewsAdmin)
      .then((res) => setReviews(res.data.reviews))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load reviews'))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  async function confirmDelete() {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await api(ENDPOINTS.deleteReview(deleteId), { method: 'DELETE' })
      setReviews((prev) => prev.filter((r) => r.id !== deleteId))
      setDeleteId(null)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete review')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-neutral-100 bg-white px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900 sm:px-6 sm:py-5 lg:px-8">
        <h1 className="text-xl font-light tracking-tight text-neutral-900 dark:text-white sm:text-2xl">Reviews</h1>
        <p className="mt-1 text-sm text-neutral-500">{reviews.length} reviews total</p>
      </header>

      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
          </div>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-12 text-center dark:border-neutral-700 dark:bg-neutral-900">
            <p className="text-sm text-neutral-500">No reviews yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/80 dark:bg-neutral-900/80">
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Tour</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">User</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Rating</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Comment</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Date</th>
                    <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-neutral-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr
                      key={review.id}
                      className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50 dark:border-neutral-800 dark:hover:bg-neutral-800/50"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/tours/${review.tour_slug}`}
                          className="font-semibold text-neutral-900 hover:underline dark:text-white"
                        >
                          {review.tour_title}
                        </Link>
                        <p className="text-xs text-neutral-400">{review.destination}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="capitalize text-neutral-900 dark:text-white">
                          {review.name} {review.surname}
                        </p>
                        <p className="text-xs text-neutral-400">{review.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <StarRating rating={review.rating} />
                      </td>
                      <td className="max-w-xs px-4 py-3">
                        <p className="line-clamp-3 text-neutral-600 dark:text-neutral-400">
                          {review.comment || <span className="italic text-neutral-400">No comment</span>}
                        </p>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-neutral-500">{formatDate(review.created_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => setDeleteId(review.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-red-50 hover:text-red-500"
                            title="Delete review"
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
        title="Delete this review?"
        description="This will permanently remove the review from the tour page. This can't be undone."
        confirmLabel="Delete"
        cancelLabel="Keep it"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
