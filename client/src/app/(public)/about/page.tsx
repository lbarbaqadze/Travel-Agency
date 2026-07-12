'use client'

import Navbar from '@/components/layout/Navbar'
import AboutShowcase from '@/components/about/AboutShowcase'
import AboutSponsors from '@/components/about/AboutSponsors'
import AboutFeatures from '@/components/about/AboutFeatures'
import AboutSection from '@/components/about/AboutSection'

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-neutral-950">
        <AboutShowcase />
        <AboutSponsors />
        <AboutFeatures />
        <AboutSection />
      </main>
    </>
  )
}
