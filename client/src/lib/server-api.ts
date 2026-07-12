import type { Tour, TourDetail } from '@/types/tour'

function getApiBase() {
  if (process.env.INTERNAL_API_URL) {
    return process.env.INTERNAL_API_URL.replace(/\/$/, '')
  }
  const port = process.env.API_PROXY_PORT || '3002'
  return `http://127.0.0.1:${port}/api`
}

async function serverFetch<T>(path: string, revalidate = 60): Promise<T | null> {
  try {
    const res = await fetch(`${getApiBase()}${path}`, {
      next: { revalidate },
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

export async function fetchTourBySlug(slug: string): Promise<TourDetail | null> {
  const data = await serverFetch<{ data: { tour: TourDetail } }>(`/tours/${slug}`, 120)
  return data?.data.tour ?? null
}

export async function fetchAllTourSlugs(): Promise<string[]> {
  const data = await serverFetch<{ data: { tours: Tour[] } }>('/tours?limit=500', 3600)
  return data?.data.tours.map((t) => t.slug) ?? []
}
