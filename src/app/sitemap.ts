import { MetadataRoute } from 'next';
import { getBdsData, getBlogData } from '@/lib/googleSheets';

// Tự động làm mới Sitemap mỗi 1 tiếng (3600s) giúp giảm tải tuyệt đối cho Google Sheet API.
export const revalidate = 3600;

// Chuyển đổi chuỗi ngày DD/MM/YYYY chuẩn Việt Nam sang Date an toàn
function parseVnDate(dateStr: string): Date {
  if (!dateStr) return new Date();

  const cleanStr = dateStr.trim();
  const parts = cleanStr.split(/[-/]/);

  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    let year = parseInt(parts[2], 10);

    // Xử lý thông minh nếu người dùng chỉ nhập năm 2 số (vd: 24 -> 2024)
    if (year < 100) year += 2000;

    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      return new Date(year, month - 1, day);
    }
  }
  return new Date();
}

// Toàn bộ slug Vị trí được ứng dụng hỗ trợ (đồng bộ với vi-tri/[slug]/page.tsx)
const LOCATION_SLUGS = [
  "an-hai", "an-khe", "ba-na", "cam-le", "hai-chau", "hai-van",
  "hoa-bac", "hoa-cuong", "hoa-khanh", "hoa-lien", "hoa-ninh",
  "hoa-phuoc", "hoa-tien", "hoa-vang", "hoa-xuan", "lien-chieu",
  "ngu-hanh-son", "son-tra", "thanh-khe",
];

// Toàn bộ slug Loại hình được ứng dụng hỗ trợ (đồng bộ với loai-hinh/[slug]/page.tsx)
const TYPE_SLUGS = ["dat", "nha-pho", "can-ho", "cho-thue"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tranhuyland.vn';

  try {
    const [bdsData, blogData] = await Promise.all([
      getBdsData(),
      getBlogData(),
    ]);

    // Lọc sạch dữ liệu, loại bỏ sản phẩm không có slug
    const safeBds = Array.isArray(bdsData)
      ? bdsData.filter((item: any) => item && item.slug && item.slug.trim() !== '')
      : [];
    const safeBlogs = Array.isArray(blogData)
      ? blogData.filter((blog: any) => blog && blog.slug && blog.slug.trim() !== '')
      : [];

    // 1. URL Sản phẩm Nhà Đất (Property Detail) - khử trùng lặp theo slug
    const seenPropSlugs = new Set<string>();
    const bdsUrls: MetadataRoute.Sitemap = [];
    for (const itemRaw of safeBds) {
      const item = itemRaw as any;
      const slug = String(item.slug).trim();
      if (seenPropSlugs.has(slug)) continue;
      seenPropSlugs.add(slug);

      const rawDate = item.ngayDang || item.NgayDang || item.ngay || '';
      const parsedDate = parseVnDate(rawDate);
      const finalDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

      bdsUrls.push({
        url: `${baseUrl}/nha-dat/${encodeURIComponent(slug)}`,
        lastModified: finalDate,
        changeFrequency: 'daily',
        priority: 0.8,
      });
    }

    // 2. URL Bài viết Blog (Blog Detail) - khử trùng lặp theo slug
    const seenBlogSlugs = new Set<string>();
    const blogUrls: MetadataRoute.Sitemap = [];
    for (const blog of safeBlogs) {
      const slug = String(blog.slug).trim();
      if (seenBlogSlugs.has(slug)) continue;
      seenBlogSlugs.add(slug);

      const rawDate = blog.date || blog.Date || blog.ngay || '';
      const parsedDate = parseVnDate(rawDate);
      const finalDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

      blogUrls.push({
        url: `${baseUrl}/blog/${encodeURIComponent(slug)}`,
        lastModified: finalDate,
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }

    // Ngày đăng mới nhất làm mốc cho các trang tập hợp
    const latestBdsDate = bdsUrls.length > 0
      ? new Date(Math.max(...bdsUrls.map(item => (item.lastModified as Date).getTime())))
      : new Date();
    const latestBlogDate = blogUrls.length > 0
      ? new Date(Math.max(...blogUrls.map(item => (item.lastModified as Date).getTime())))
      : new Date();

    // 3. Trang chủ (= Trang danh sách Nhà đất, vì home hiển thị toàn bộ giỏ hàng)
    const homeUrls: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: latestBdsDate,
        changeFrequency: 'daily',
        priority: 1.0,
      },
    ];

    // 4. Trang danh sách Blog
    const blogListingUrls: MetadataRoute.Sitemap = [
      {
        url: `${baseUrl}/blog`,
        lastModified: latestBlogDate,
        changeFrequency: 'daily',
        priority: 0.9,
      },
    ];

    // 5. URL Danh mục Vị trí (Location)
    const locationUrls: MetadataRoute.Sitemap = LOCATION_SLUGS.map((slug) => ({
      url: `${baseUrl}/vi-tri/${slug}`,
      lastModified: latestBdsDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    // 6. URL Danh mục Loại hình (Property Type)
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
