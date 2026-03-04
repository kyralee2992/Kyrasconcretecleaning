import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { articles, getArticleBySlug } from '@/app/data/articles'
import ArticleDetailPage from '@/app/pages/ArticleDetailPage'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return {}

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.dateModified,
      authors: ['Kyra Lee'],
    },
    alternates: {
      canonical: `https://kyraleecleaning.com/articles/${article.slug}`,
    },
  }
}

function buildArticleSchema(article: ReturnType<typeof getArticleBySlug>) {
  if (!article) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.publishedAt,
    dateModified: article.dateModified,
    author: {
      '@type': 'Person',
      name: 'Kyra Lee',
      jobTitle: 'Owner',
      worksFor: {
        '@type': 'LocalBusiness',
        name: "Kyra Lee's Concrete Cleaning",
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Salem',
          addressRegion: 'OR',
          addressCountry: 'US',
        },
      },
    },
    publisher: {
      '@type': 'LocalBusiness',
      name: "Kyra Lee's Concrete Cleaning",
      url: 'https://kyraleecleaning.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://kyraleecleaning.com/articles/${article.slug}`,
    },
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()

  const schema = buildArticleSchema(article)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ArticleDetailPage article={article} />
    </>
  )
}
