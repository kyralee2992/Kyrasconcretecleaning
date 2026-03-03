import type { Metadata } from 'next'
import PrivacyPolicyPage from '@/app/pages/PrivacyPolicyPage'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: "Privacy policy for Kyra Lee's Concrete Cleaning services in Salem, Oregon.",
}

export default function Page() {
  return <PrivacyPolicyPage />
}
