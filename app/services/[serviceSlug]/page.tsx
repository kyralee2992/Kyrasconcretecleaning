import type { Metadata } from 'next'
import ServiceDetailPage from '@/app/pages/ServiceDetailPage'

type Props = {
  params: Promise<{ serviceSlug: string }>
}

const serviceMetadata: Record<string, { title: string; description: string }> = {
  'soft-washing-siding': {
    title: 'Soft Washing & Siding Cleaning Salem OR',
    description: 'Professional soft washing for siding and exterior surfaces in Salem, Oregon. Gentle low-pressure cleaning safe for vinyl, wood, and all siding types. Free on-site quote — no commitment required.',
  },
  'deep-cleaning-concrete': {
    title: 'Driveway & Concrete Cleaning Salem OR',
    description: 'Expert concrete and driveway pressure washing in Salem, OR. Remove oil stains, moss, and years of grime. Free on-site walkthrough quote from owner Kyra. Call (971) 510-0926.',
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { serviceSlug } = await params
  const meta = serviceMetadata[serviceSlug]
  if (!meta) return {}
  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
    },
  }
}

export default function Page() {
  return <ServiceDetailPage />
}
