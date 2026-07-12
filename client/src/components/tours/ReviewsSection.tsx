'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MessageSquareText, Star } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useReviews } from '@/hooks/useReviews'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion'

const sectionStagger = staggerContainer(0.12)
const item = fadeUp(0, 16)

function StarRow({ rating, size = 'h-3.5 w-3.5' }: { rating: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${size} ${i < Math.round(rating) ? 'fill-neutral-900 text-neutral-900 dark:fill-white dark:text-white' : 'text-neutral-200 dark:text-neutral-700'}`}
        />
      ))}
    </div>
  )
}

function initials(name: string, surname: string) {
  return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase()
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

interface ReviewFormProps {
  onSubmit: (rating: number, comment: string) => Promise<void>
  isSubmitting: boolean
  submitError: string | null
}

function ReviewForm({ onSubmit, isSubmitting, submitError }: ReviewFormProps) {
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await onSubmit(rating, comment)
      setSubmitted(true)
      setComment('')
    } catch {
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-neutral-100 bg-neutral-50 p-6 flex flex-col gap-4 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Your rating</span>
        <div className="mt-2 flex items-center gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => {
            const value = i + 1
            return (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                onMouseEnter={() => setHoverRating(value)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`Rate ${value} stars`}
              >
                <Star
                  className={`h-6 w-6 transition-colors ${
                    value <= (hoverRating || rating)
                      ? 'fill-neutral-900 text-neutral-900 dark:fill-white dark:text-white'
                      : 'text-neutral-200 dark:text-neutral-700'
                  }`}
                />
              </button>
            )
          })}
        </div>
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience..."
        rows={3}
        maxLength={1000}
        className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-300 outline-none focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:placeholder:text-neutral-600 dark:focus:border-neutral-500"
      />

      {submitError && <p className="text-xs font-medium text-red-600 dark:text-red-400">{submitError}</p>}
      {submitted && !submitError && (
        <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Thanks for your review!</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="self-start rounded-full bg-neutral-900 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-black disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}

export default function ReviewsSection({ tourId }: { tourId: number }) {
  const user = useAuthStore((s) => s.user)
  const { summary, isLoading, submitReview, isSubmitting, submitError } = useReviews(tourId)

  return (
    <motion.section
      variants={sectionStagger}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 border-t border-neutral-100 dark:border-neutral-800"
    >
      <motion.div variants={item} className="flex items-center gap-4 mb-8">
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-neutral-400">
          <MessageSquareText className="h-3.5 w-3.5" />
          Guest Reviews
        </span>
        {!isLoading && summary && summary.totalReviews > 0 && (
          <div className="flex items-center gap-2">
            <StarRow rating={summary.averageRating} />
            <span className="text-sm font-bold text-neutral-900 dark:text-white">{summary.averageRating}</span>
            <span className="text-xs text-neutral-400">({summary.totalReviews})</span>
          </div>
        )}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-10">
        <motion.div variants={item} className="lg:col-span-2 flex flex-col gap-4">
          {isLoading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-24 rounded-2xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
              ))}
            </div>
          ) : summary && summary.reviews.length > 0 ? (
            summary.reviews.map((review) => (
              <div key={review.id} className="rounded-2xl border border-neutral-100 p-5 dark:border-neutral-800 dark:bg-neutral-900/50">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white dark:bg-white dark:text-neutral-900">
                    {initials(review.name, review.surname)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-neutral-900 capitalize truncate dark:text-white">
                      {review.name} {review.surname}
                    </p>
                    <p className="text-[11px] text-neutral-400">{formatDate(review.created_at)}</p>
                  </div>
                  <div className="ml-auto">
                    <StarRow rating={review.rating} />
                  </div>
                </div>
                {review.comment && (
                  <p className="mt-3 text-sm text-neutral-600 leading-relaxed dark:text-neutral-400">{review.comment}</p>
                )}
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-neutral-200 bg-neutral-50 p-10 text-center dark:border-neutral-700 dark:bg-neutral-900/50">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">No reviews yet. Be the first to share your experience.</p>
            </div>
          )}
        </motion.div>

        <motion.div variants={item}>
          {user ? (
            <ReviewForm onSubmit={submitReview} isSubmitting={isSubmitting} submitError={submitError} />
          ) : (
            <div className="rounded-3xl border border-dashed border-neutral-200 bg-neutral-50 p-6 text-center dark:border-neutral-700 dark:bg-neutral-900/50">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                <Link href="/login" className="font-semibold text-neutral-900 underline dark:text-white">
                  Sign in
                </Link>{' '}
                to leave a review.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.section>
  )
}
