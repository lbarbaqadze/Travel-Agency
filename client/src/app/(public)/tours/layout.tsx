import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  title: 'Tours',
  description:
    'Browse curated tours across Europe. Filter by destination, category, and price — book your next trip with Voyager.',
  path: '/tours',
})

export default function ToursLayout({ children }: { children: React.ReactNode }) {
  return children
}
