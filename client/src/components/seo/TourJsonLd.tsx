import { getSiteUrl, siteConfig } from '@/lib/site'
import type { TourDetail } from '@/types/tour'

export default function OrganizationJsonLd() {
  const siteUrl = getSiteUrl()
  const json = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: siteConfig.name,
    url: siteUrl,
    description: siteConfig.description,
    email: siteConfig.email,
    sameAs: [],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}

export function TourJsonLd({ tour }: { tour: TourDetail }) {
  const siteUrl = getSiteUrl()
  const price = Number(tour.price)

  const json = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.title,
    description: tour.description,
    url: `${siteUrl}/tours/${tour.slug}`,
    touristType: 'Leisure',
    itinerary: {
      '@type': 'Place',
      name: tour.destination,
    },
    offers: {
      '@type': 'Offer',
      price: price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${siteUrl}/tours/${tour.slug}`,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}
