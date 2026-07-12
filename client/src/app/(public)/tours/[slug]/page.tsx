import type { Metadata } from 'next'
import { fetchTourBySlug } from '@/lib/server-api'
import { buildTourMetadata } from '@/lib/seo'
import { TourJsonLd } from '@/components/seo/TourJsonLd'
import TourDetailClient from './TourDetailClient'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tour = await fetchTourBySlug(slug)
  if (!tour) {
    return { title: 'Tour not found | Voyager' }
  }
  return buildTourMetadata(tour)
}

export default async function TourDetailPage({ params }: Props) {
  const { slug } = await params
  const tour = await fetchTourBySlug(slug)

  return (
    <>
      {tour ? <TourJsonLd tour={tour} /> : null}
      <TourDetailClient />
    </>
  )
}
