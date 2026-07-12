import Footer from '@/components/layout/Footer'
import type { Metadata } from 'next'
import { noIndexMetadata } from '@/lib/seo'

export const metadata: Metadata = noIndexMetadata

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  )
}
