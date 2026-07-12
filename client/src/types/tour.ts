export interface Tour {
  id: number
  title: string
  slug: string
  description: string
  destination: string
  price: number | string
  duration_days: number
  max_guests: number
  start_date: string
  end_date: string
  category: string
  is_active: boolean | number
  created_at: string
  cover_image: string | null
}

export interface TourImage {
  id: number
  url: string
  public_id: string
  image_type: 'destination' | 'hotel' | string
  is_cover: boolean | number
}

export interface TourDetail extends Omit<Tour, 'cover_image'> {
  images: TourImage[]
}

export interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export const CATEGORY_LABELS: Record<string, string> = {
  'city-break': 'City Break',
  adventure: 'Adventure',
  cultural: 'Cultural',
  beach: 'Beach Escape',
  mountain: 'Mountain',
}

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category
}
