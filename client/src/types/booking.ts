export type BookingStatus = 'pending' | 'confirmed' | 'cancelled'

export interface Booking {
  id: number
  user_id: number
  tour_id: number
  guests: number
  total_price: number | string
  status: BookingStatus
  created_at: string
  tour_title: string
  destination: string
}
