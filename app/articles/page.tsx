import type { Metadata } from 'next'
import ArticlesPage from '@/app/pages/ArticlesPage'

export const metadata: Metadata = {
  title: 'Pressure Washing Tips & Guides | Salem OR | Kyra Lee\'s Concrete Cleaning',
  description: 'Expert articles on pressure washing, concrete cleaning, and home maintenance for Salem, Oregon homeowners. Learn how often to clean, how to remove oil stains, and more.',
  openGraph: {
    title: 'Pressure Washing Tips & Guides | Salem OR',
    description: 'Expert advice on pressure washing, concrete maintenance, and keeping your Salem-area home in top shape year-round.',
  },
  alternates: {
    canonical: 'https://kyraleecleaning.com/articles',
  },
}

export default function Page() {
  return <ArticlesPage />
}
