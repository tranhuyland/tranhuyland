import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Áp dụng cho toàn bộ bot tìm kiếm chính thống (Google, Bing, Yahoo...)
        userAgent: '*',
        allow: [
          '/',
          // Cho phép bọ quét CSS/JS tĩnh để render đúng cấu trúc trang
          '/_next/static/',
          // Ưu tiên hơn /*?* (theo nguyên tắc longest-match của Google) nên ảnh tối ưu vẫn được index
          '/_next/image',
        ],
        disallow: [
          // Chặn route API nội bộ
          '/api/',
          // Chặn trang form đăng tin / đăng blog — không mang giá trị nội dung SEO
          '/dang-tin',
          '/dang-blog',
          // Chặn URL chứa query string (bộ lọc, sắp xếp) để tránh Duplicate Content
          '/*?*',
        ],
      },
      {
        // Chặn hoàn toàn các AI Bot thu thập dữ liệu trái phép
        userAgent: ['GPTBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-Web', 'CCBot'],
        disallow: '/',
      },
    ],
    sitemap: 'https://tranhuyland.vn/sitemap.xml',
  };
}
