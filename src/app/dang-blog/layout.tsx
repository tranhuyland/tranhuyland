import type { Metadata } from "next";

const DEFAULT_OG_IMAGE = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&h=630&q=80";

export const metadata: Metadata = {
  title: "Soạn Blog Nội Bộ",
  description: "Khu vực nội bộ dành cho quản trị viên soạn thảo bài viết blog cho hệ thống Trần Huy Land.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Soạn Blog Nội Bộ | Trần Huy Land",
    description: "Khu vực nội bộ dành cho quản trị viên soạn thảo bài viết blog cho hệ thống Trần Huy Land.",
    url: "/dang-blog",
    siteName: "Trần Huy Land",
    type: "website",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Soạn blog nội bộ Trần Huy Land",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Soạn Blog Nội Bộ | Trần Huy Land",
    description: "Khu vực nội bộ dành cho quản trị viên soạn thảo bài viết blog cho hệ thống Trần Huy Land.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function DangBlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
