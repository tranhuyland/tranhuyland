import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Soạn Blog Nội Bộ",
  description: "Khu vực nội bộ dành cho quản trị viên soạn thảo bài viết blog cho hệ thống Trần Huy Land.",
  robots: { index: false, follow: false },
};

export default function DangBlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
