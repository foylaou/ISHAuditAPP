import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/',  // 禁止爬蟲訪問所有路徑
    },
    // 移除 Sitemap 引用，因為您不希望網站被索引
  }
}
