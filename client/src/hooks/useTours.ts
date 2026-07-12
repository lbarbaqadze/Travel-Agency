'use client'

import { useEffect, useState } from 'react'
import { api, ApiError } from '@/lib/api'
import { ENDPOINTS } from '@/lib/endpoints'
import type { Pagination, Tour } from '@/types/tour'

interface ToursResponse {
  status: string
  results: number
  pagination: Pagination
  data: { tours: Tour[] }
}

interface UseToursOptions {
  limit?: number
  category?: string
  destination?: string
  minPrice?: number
  maxPrice?: number
  page?: number
}

interface UseToursResult {
  tours: Tour[]
  isLoading: boolean
  error: string | null
  pagination: Pagination | null
}

export function useTours(options: UseToursOptions = {}): UseToursResult {
  const { limit, category, destination, minPrice, maxPrice, page } = options
  const [tours, setTours] = useState<Tour[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams()
    if (limit) params.set('limit', String(limit))
    if (category) params.set('category', category)
    if (destination) params.set('destination', destination)
    if (minPrice) params.set('minPrice', String(minPrice))
    if (maxPrice) params.set('maxPrice', String(maxPrice))
    if (page) params.set('page', String(page))

    let isMounted = true
    setIsLoading(true)
    setError(null)

    api<ToursResponse>(ENDPOINTS.tours(params.toString()), { skipAuth: true })
      .then((res) => {
        if (isMounted) {
          setTours(res.data.tours)
          setPagination(res.pagination)
        }
      })
      .catch((err) => {
        if (isMounted) setError(err instanceof ApiError ? err.message : 'Failed to load tours')
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [limit, category, destination, minPrice, maxPrice, page])

  return { tours, isLoading, error, pagination }
}
