import type { Metadata } from 'next'
import './globals.css'
import { Layout } from '@/app/components/Layout'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kyrasconcretecleaning.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kyra Lee's Concrete Cleaning — Salem, OR",
    template: "%s | Kyra Lee's Concrete Cleaning",
  },
  description: "Owner-operated pressure washing in Salem, OR. Free on-site quote — Kyra comes to you and gives you a real price before she leaves. Driveways, siding, walkways. Call (971) 510-0926.",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: "Kyra Lee's Concrete Cleaning",
    title: "Pressure Washing Salem OR | Kyra Lee's Concrete Cleaning",
    description: "Owner-operated pressure washing in Salem, OR. Free on-site quote. Driveways, siding, walkways. Call (971) 510-0926.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: "Kyra Lee's Concrete Cleaning — Salem, Oregon pressure washing",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Pressure Washing Salem OR | Kyra Lee's",
    description: "Owner-operated pressure washing in Salem, OR. Free on-site quote.",
    images: ['/og-image.png'],
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: "Kyra Lee's Concrete Cleaning",
  description: "Owner-operated pressure washing and concrete cleaning in Salem, Oregon. Soft washing for siding, deep cleaning for concrete driveways, patios, and walkways.",
  url: siteUrl,
  telephone: '+19715100926',
  email: 'kyraleecleaning@gmail.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Salem',
    addressRegion: 'OR',
    addressCountry: 'US',
  },
  areaServed: [
    { '@type': 'City', name: 'Salem' },
    { '@type': 'City', name: 'Keizer' },
    { '@type': 'City', name: 'Turner' },
    { '@type': 'City', name: 'Silverton' },
    { '@type': 'City', name: 'Stayton' },
    { '@type': 'City', name: 'Monmouth' },
    { '@type': 'City', name: 'Independence' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Cleaning Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Soft Washing (Siding)',
          description: 'Gentle low-pressure cleaning for siding and exterior surfaces',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Deep Cleaning (Concrete)',
          description: 'High-pressure cleaning for driveways, walkways, and patios',
        },
      },
    ],
  },
  priceRange: '$$',
  image: `${siteUrl}/og-image.png`,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
