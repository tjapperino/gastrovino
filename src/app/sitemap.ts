import type { MetadataRoute } from 'next'

const BASE = 'https://gastrovinorotterdam.nl'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE,                    lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/assortiment`,   lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/borrelplanken`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/proeverijen`,   lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/catering`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/over-ons`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]
}
