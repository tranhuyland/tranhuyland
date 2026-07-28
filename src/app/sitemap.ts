import { MetadataRoute } from 'next';
import { getBdsData, getBlogData } from '@/lib/googleSheets';

export const revalidate = 3600;

function parseVnDate(dateStr: string): Date | null {
  if (!dateStr || !dateStr.trim()) return null;

  const cleanStr = dateStr.trim();
  const parts = cleanStr.split(/[-/]/);

  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    let year = parseInt(parts[2], 10);

    if (year < 100) year += 2000;

    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      return new Date(year, month - 1, day);
    }
  }
  return null;
}

const LOCATION_SLUGS = [
  "an-hai", "an-khe", "ba-na", "cam-le", "hai-chau", "hai-van",
  "hoa-bac", "hoa-cuong", "hoa-khanh", "hoa-lien", "hoa-ninh",
  "hoa-phuoc", "hoa-tien", "hoa-vang", "hoa-xuan", "lien-chieu",
  "ngu-hanh-son", "son-tra", "thanh-khe",
];

const TYPE_SLUGS = ["dat", "nha-pho", "can-ho", "cho-thue"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tranhuyland.vn';

  try {
    const [bdsData, blogData] = await Promise.all([
      getBdsData(),
      getBlogData(),
    ]);

    const safeBds = Array.isArray(bdsData)
      ? bdsData.filter((item: any) => item && item.slug && item.slug.trim() !== '')
      : [];
    const safeBlogs = Array.isArray(blogData)
      ? blogData.filter((blog: any) => blog && blog.slug && blog.slug.trim() !== '')
      : [];

    const seenPropSlugs = new Set<string>();
    const bdsUrls: MetadataRoute.Sitemap = [];
    for (const itemRaw of safeBds) {
      const item = itemRaw as any;
      const slug = String(item.slug).trim();
      if (seenPropSlugs.has(slug)) continue;
      seenPropSlugs.add(slug);

      const rawDate = item.ngayDang || item.NgayDang || item.ngay || '';
      const parsedDate = parseVnDate(rawDate);
      const finalDate = parsedDate || new Date('2025-01-01');

      bdsUrls.push({
        url: `${baseUrl}/nha-dat/${encodeURIComponent(slug)}`,
        lastModified: finalDate,
        changeFrequency: 'daily',
        priority: 0.8,
      });
    }

    const seenBlogSlugs = new Set<string>();
    const blogUrls: MetadataRoute.Sitemap = [];
    for (const blog of safeBlogs) {
      const slug = String(blog.slug).trim();
      if (seenBlogSlugs.has(slug)) continue;
      seenBlogSlugs.add(slug);

      const rawDate = blog.date || blog.Date || blog.ngay || '';
      const parsedDate = parseVnDate(rawDate);
      const finalDate = parsedDate || new Date('2025-01-01');

      blogUrls.push({
        url: `${baseUrl}/blog/${encodeURIComponent(slug)}`,
        lastModified: finalDate,
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }

    const latestBdsDate = bdsUrls.length > 0
      ? new Date(Math.max(...bdsUrls.map(item => (item.lastModified as Date).getTime())))
      : new Date();
    const latestBlogDate = blogUrls.length > 0
      ? new Date(Math.max(...blogUrls.map(item => (item.lastModified as Date).getTime())))
      : new Date();

    const homeUrls: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: latestBdsDate,
        changeFrequency: 'daily',
        priority: 1.0,
      },
    ];

    const blogListingUrls: MetadataRoute.Sitemap = [
      {
        url: `${baseUrl}/blog`,
        lastModified: latestBlogDate,
        changeFrequency: 'daily',
        priority: 0.9,
      },
    ];

    const locationUrls: MetadataRoute.Sitemap = LOCATION_SLUGS.map((slug) => ({
      url: `${baseUrl}/vi-tri/${slug}`,
      lastModified: latestBdsDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    const typeUrls: MetadataRoute.Sitemap = TYPE_SLUGS.map((slug) => ({
      url: `${baseUrl}/loai-hinh/${slug}`,
      lastModified: latestBdsDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    return [
      ...homeUrls,
      ...blogListingUrls,
      ...locationUrls,
      ...typeUrls,
      ...bdsUrls,
      ...blogUrls,
    ];
  } catch (error) {
    console.error('Lỗi sitemap:', error);
    return [
      { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    ];
  }
}
