import type { Metadata } from 'next'
import './globals.css'
import { Layout } from '@/app/components/Layout'

export const metadata: Metadata = {
  title: "Kyra Lee's Concrete Cleaning",
  description: 'Professional pressure washing and concrete cleaning services in Salem, Oregon. Soft washing for siding and deep cleaning for concrete.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
