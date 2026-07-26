import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng Tin Bất Động Sản",
  description: "Khu vực nội bộ dành cho quản trị viên đăng tin bất động sản mới lên hệ thống Trần Huy Land.",
  robots: { index: false, follow: false },
};

export default function DangTinLayout({ children }: { children: React.ReactNode }) {
  return children;
}
