import { create } from 'zustand'
import { api, ApiError } from '@/lib/api'
import { ENDPOINTS } from '@/lib/endpoints'
import type { Booking } from '@/types/booking'

interface CreateBookingResponse {
  status: string
  message: string
  data: {
    bookingId: number
    tourTitle: string
    guests: number
    totalPrice: number
    status: string
  }
}

interface BookingsResponse {
  status: string
  results: number
  data: { bookings: Booking[] }
}

interface CheckoutSessionResponse {
  status: string
  session_url: string
}

interface BookingState {
  bookings: Booking[]
  isLoadingBookings: boolean
  isCreating: boolean
  payingId: number | null
  cancellingId: number | null
  deletingId: number | null
  error: string | null

  clearError: () => void
  createBooking: (tourId: number, guests: number) => Promise<number>
  fetchBookings: () => Promise<void>
  payForBooking: (bookingId: number) => Promise<void>
  cancelBooking: (bookingId: number) => Promise<void>
  deleteBooking: (bookingId: number) => Promise<void>
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  isLoadingBookings: false,
  isCreating: false,
  payingId: null,
  cancellingId: null,
  deletingId: null,
  error: null,

  clearError: () => set({ error: null }),

  createBooking: async (tourId, guests) => {
    set({ isCreating: true, error: null })
    try {
      const res = await api<CreateBookingResponse>(ENDPOINTS.bookings, {
        method: 'POST',
        body: JSON.stringify({ tourId, guests }),
      })
      set({ isCreating: false })
      return res.data.bookingId
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Something went wrong. Please try again.'
      set({ error: message, isCreating: false })
      throw err
    }
  },

  fetchBookings: async () => {
    set({ isLoadingBookings: true, error: null })
    try {
      const res = await api<BookingsResponse>(ENDPOINTS.bookings)
      set({ bookings: res.data.bookings, isLoadingBookings: false })
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to load your bookings'
      set({ error: message, isLoadingBookings: false })
    }
  },

  payForBooking: async (bookingId) => {
    set({ payingId: bookingId, error: null })
    try {
      const checkout = await api<CheckoutSessionResponse>(ENDPOINTS.checkoutSession(bookingId), {
        method: 'POST',
      })
      window.location.href = checkout.session_url
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Something went wrong. Please try again.'
      set({ error: message, payingId: null })
      throw err
    }
  },

  cancelBooking: async (bookingId) => {
    set({ cancellingId: bookingId, error: null })
    try {
      await api(ENDPOINTS.cancelBooking(bookingId), { method: 'PATCH' })
      set({
        bookings: get().bookings.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b)),
        cancellingId: null,
      })
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Something went wrong. Please try again.'
      set({ error: message, cancellingId: null })
      throw err
    }
  },

  deleteBooking: async (bookingId) => {
    set({ deletingId: bookingId, error: null })
    try {
      await api(ENDPOINTS.deleteBooking(bookingId), { method: 'DELETE' })
      set({
        bookings: get().bookings.filter((b) => b.id !== bookingId),
        deletingId: null,
      })
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Something went wrong. Please try again.'
      set({ error: message, deletingId: null })
      throw err
    }
  },
}))

export { ApiError }
