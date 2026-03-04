import { MetadataRoute } from 'next'

const siteUrl = 'https://kyraleecleaning.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/thank-you',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
