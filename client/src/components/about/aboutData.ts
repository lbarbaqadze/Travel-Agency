function cld(publicId: string) {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto:good,w_2400/${publicId}`
}

function cardCld(publicId: string) {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto:good,w_800,h_1000,c_fill/${publicId}`
}

function featureCld(publicId: string) {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto:good,w_1400,h_560,c_fill,g_auto/${publicId}`
}

export const showcaseSlides = [
  {
    id: 'voyager',
    title: 'Voyager',
    subtitle: 'Your freedom to explore life',
    image: cld('img5_afx1gm'),
    card: {
      label: 'Who we are',
      headline: 'Travel, made simple',
      image: cardCld('img1_ptvmy6'),
      modal: 'story' as const,
      cta: 'Learn more',
    },
  },
  {
    id: 'curated',
    title: 'Curated',
    subtitle: 'Hand-picked tours, reviewed before they go live',
    image: cld('img2_lhq48y'),
    card: {
      label: 'How we work',
      headline: 'Quality over quantity',
      image: cardCld('img3_pdjpgl'),
      modal: 'partners' as const,
      cta: 'Our partners',
    },
  },
] as const

export type ShowcaseModalId = (typeof showcaseSlides)[number]['card']['modal']

export const sponsors = [
  {
    id: 'skypass',
    name: 'SkyPass Airways',
    tag: 'Aviation',
    description:
      'Preferred airline partner for Voyager routes across Europe — reliable schedules and flexible rebooking for our travelers.',
    highlights: ['Member flight rates', 'Priority support line', 'Flexible date changes'],
  },
  {
    id: 'atlas',
    name: 'Atlas Hotels',
    tag: 'Hospitality',
    description:
      'Curated hotel network vetted for location, comfort, and value — the stays we recommend on every Voyager itinerary.',
    highlights: ['Verified quality standards', 'Central locations', 'Transparent nightly rates'],
  },
  {
    id: 'eurorail',
    name: 'EuroRail Connect',
    tag: 'Transport',
    description:
      'Seamless rail connections between major European cities, integrated into multi-stop Voyager tour packages.',
    highlights: ['Cross-border passes', 'Reserved seating options', 'Real-time schedule sync'],
  },
  {
    id: 'securepay',
    name: 'SecurePay',
    tag: 'Payments',
    description:
      'PCI-compliant payment processing that keeps your booking secure from checkout to confirmation.',
    highlights: ['Encrypted transactions', 'Instant receipts', 'Fraud protection'],
  },
  {
    id: 'globalcover',
    name: 'GlobalCover',
    tag: 'Insurance',
    description:
      'Travel insurance options available at booking — coverage for cancellations, delays, and medical emergencies abroad.',
    highlights: ['Trip cancellation cover', 'Medical assistance', '24h claims hotline'],
  },
  {
    id: 'tripsync',
    name: 'TripSync',
    tag: 'Technology',
    description:
      'Booking infrastructure powering instant confirmations, guest management, and real-time availability on Voyager.',
    highlights: ['Live inventory sync', 'Automated confirmations', 'Mobile-friendly vouchers'],
  },
] as const

export type Sponsor = (typeof sponsors)[number]

export const aboutFeatures = {
  eyebrow: 'Why Voyager',
  title: 'Travel with clarity.',
  titleAccent: 'Book with confidence.',
  description:
    'We built Voyager around what travelers actually need — curated tours, honest pricing, and support that stays with you from search to return.',
  image: featureCld('hero-jet_v3hjgh'),
  imageAlt: 'Sunset view from an airplane window',
  imageCaption: 'Curated routes across Europe',
  highlights: [
    {
      title: 'Hand-picked tours',
      description: 'Every itinerary is reviewed for quality, clarity, and value before it goes live.',
    },
    {
      title: 'Transparent pricing',
      description: 'See the full cost upfront — no hidden fees at checkout or surprise add-ons later.',
    },
    {
      title: 'Support that stays',
      description: 'Real help before, during, and after your trip — not just a confirmation email.',
    },
  ],
} as const

export const showcaseModals = {
  story: {
    eyebrow: 'Who we are',
    title: 'Travel, made simple',
    description:
      'Voyager is a travel platform built around clarity. We curate tours across Europe, keep pricing transparent, and stay available when your plans shift — from first search to return.',
    highlights: [
      'Every tour reviewed before it goes live',
      'Clear pricing with no hidden fees',
      'Real support, not just a confirmation email',
    ],
  },
  partners: {
    eyebrow: 'Trusted partners',
    title: 'Built with partners who share our standards',
    description:
      'We work with airlines, hotels, payment providers, and technology partners to keep every Voyager booking secure, reliable, and seamless.',
    highlights: sponsors.map((s) => `${s.name} · ${s.tag}`),
  },
}
