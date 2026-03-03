import type { Metadata } from 'next'
import HomePage from '@/app/pages/HomePage'

export const metadata: Metadata = {
  title: 'Pressure Washing Salem OR | Concrete Cleaning',
  description: "Owner-operated pressure washing in Salem, OR. Free on-site quote — Kyra comes to you and gives you a real price before she leaves. Driveways, siding, walkways. Call (971) 510-0926.",
  openGraph: {
    title: "Pressure Washing Salem OR | Kyra Lee's Concrete Cleaning",
    description: "Owner-operated pressure washing in Salem, OR. Free on-site quote. Driveways, siding, walkways.",
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What areas do you serve?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We proudly serve Salem, Oregon and surrounding communities including Keizer, Turner, Silverton, Stayton, Monmouth, and Independence. Not sure if we cover your neighborhood? Give us a call or text at (971) 510-0926.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does a typical job take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Most residential driveways take 2–4 hours depending on size and condition. Patios and walkways typically take 1–3 hours. We'll give you an accurate time estimate when we provide your quote.",
      },
    },
    {
      '@type': 'Question',
      name: 'Are your cleaning products safe for pets and plants?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — we use eco-friendly, biodegradable cleaning solutions that are completely safe for your family, pets, and landscaping.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to be home during the service?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "No, you don't need to be home. As long as we have access to water and the areas to be cleaned, we can complete the work while you're away.",
      },
    },
    {
      '@type': 'Question',
      name: 'What payment methods do you accept?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We accept cash, check, Venmo, PayPal, and all major credit cards. Payment is due upon completion of the service.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is your satisfaction guarantee?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "We offer a 100% satisfaction guarantee. If you're not completely happy with our work, we'll come back and make it right at no additional charge.",
      },
    },
    {
      '@type': 'Question',
      name: 'How often should I have my concrete cleaned?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We recommend professional cleaning every 12–18 months for most residential properties. High-traffic areas or surfaces prone to moss and algae may benefit from cleaning every 6–12 months.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can you remove oil stains?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — oil stain removal is one of our specialties. We use professional-grade degreasers and hot water pressure washing to break down and remove stubborn oil stains.',
      },
    },
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HomePage />
    </>
  )
}
