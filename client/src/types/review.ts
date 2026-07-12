export interface Review {
  id: number
  rating: number
  comment: string | null
  created_at: string
  name: string
  surname: string
}

export interface ReviewsSummary {
  averageRating: number
  totalReviews: number
  reviews: Review[]
}
