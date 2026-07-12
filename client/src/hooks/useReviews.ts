'use client'

import { useCallback, useEffect, useState } from 'react'
import { api, ApiError } from '@/lib/api'
import { ENDPOINTS } from '@/lib/endpoints'
import type { ReviewsSummary } from '@/types/review'

interface ReviewsResponse {
  status: string
  results: number
  data: ReviewsSummary
}

interface UseReviewsResult {
  summary: ReviewsSummary | null
  isLoading: boolean
  error: string | null
  isSubmitting: boolean
  submitError: string | null
  submitReview: (rating: number, comment: string) => Promise<void>
  refetch: () => void
}

export function useReviews(tourId: number | null): UseReviewsResult {
  const [summary, setSummary] = useState<ReviewsSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const refetch = useCallback(() => setReloadKey((k) => k + 1), [])

  useEffect(() => {
    if (!tourId) return
    let isMounted = true
    setIsLoading(true)
    setError(null)

    api<ReviewsResponse>(ENDPOINTS.reviewsForTour(tourId), { skipAuth: true })
      .then((res) => {
        if (isMounted) setSummary(res.data)
      })
      .catch((err) => {
        if (isMounted) setError(err instanceof ApiError ? err.message : 'Failed to load reviews')
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [tourId, reloadKey])

  const submitReview = useCallback(
    async (rating: number, comment: string) => {
      if (!tourId) return
      setIsSubmitting(true)
      setSubmitError(null)
      try {
        await api(ENDPOINTS.createReview, {
          method: 'POST',
          body: JSON.stringify({ tourId, rating, comment: comment || undefined }),
        })
        refetch()
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Failed to submit review'
        setSubmitError(message)
        throw err
      } finally {
        setIsSubmitting(false)
      }
    },
    [tourId, refetch]
  )

  return { summary, isLoading, error, isSubmitting, submitError, submitReview, refetch }
}
