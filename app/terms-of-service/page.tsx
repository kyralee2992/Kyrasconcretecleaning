import type { Metadata } from 'next'
import TermsOfServicePage from '@/app/pages/TermsOfServicePage'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: "Terms of service for Kyra Lee's Concrete Cleaning services in Salem, Oregon.",
}

export default function Page() {
  return <TermsOfServicePage />
}
