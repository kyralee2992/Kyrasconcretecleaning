import type { Metadata } from 'next'
import ThankYouPage from '@/app/pages/ThankYouPage'

export const metadata: Metadata = {
  title: 'Thank You',
  robots: {
    index: false,
    follow: false,
  },
}

export default function Page() {
  return <ThankYouPage />
}
