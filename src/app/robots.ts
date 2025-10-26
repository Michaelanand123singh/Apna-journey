import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://apnajourney.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/user/post-news', '/user/post-job', '/user/applications', '/user/dashboard', '/user/profile'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/user/post-news', '/user/post-job', '/user/applications', '/user/dashboard', '/user/profile'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

