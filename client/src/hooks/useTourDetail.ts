'use client'

import { useCallback, useEffect, useState } from 'react'
import { api, ApiError } from '@/lib/api'
import { ENDPOINTS } from '@/lib/endpoints'
import type { TourDetail } from '@/types/tour'

interface TourDetailResponse {
  status: string
  data: { tour: TourDetail }
}

interface UseTourDetailResult {
  tour: TourDetail | null
  isLoading: boolean
  error: string | null
  notFound: boolean
  refetch: () => void
}

export function useTourDetail(slug: string): UseTourDetailResult {
  const [tour, setTour] = useState<TourDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  const refetch = useCallback(() => setReloadKey((k) => k + 1), [])

  useEffect(() => {
    if (!slug) return
    let isMounted = true
    setIsLoading(true)
    setError(null)
    setNotFound(false)

    api<TourDetailResponse>(ENDPOINTS.tourBySlug(slug), { skipAuth: true })
      .then((res) => {
        if (isMounted) setTour(res.data.tour)
      })
      .catch((err) => {
        if (!isMounted) return
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true)
        } else {
          setError(err instanceof ApiError ? err.message : 'Failed to load tour')
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [slug, reloadKey])

  return { tour, isLoading, error, notFound, refetch }
}
