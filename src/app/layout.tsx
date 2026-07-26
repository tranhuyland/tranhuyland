import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";

const DynamicScrollToTop = dynamic(() => import("@/components/ScrollToTop"));

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["vietnamese"],
  display: "swap",
  variable: "--font-plus-jakarta",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
};

const SITE_URL = "https://tranhuyland.vn";
const SITE_NAME = "Trần Huy Land";
const DEFAULT_OG_IMAGE = "/og-image.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Trần Huy Land | Kho Nhà Đất Chính Chủ Hải Châu Cẩm Lệ Đà Nẵng",
    template: "%s | Trần Huy Land",
  },

  description:
    "Mua bán, ký gửi nhà đất chính chủ uy tín tại Hải Châu, Cẩm Lệ, Đà Nẵng. Cập nhật giỏ hàng thực tế mỗi ngày: Nhà mặt tiền Cẩm Bá Thước, nhà kiệt ô tô Cách Mạng Tháng 8. Pháp lý minh bạch, có sẵn sổ đỏ bản vẽ xem ngay.",

  keywords: [
    "nhà đất đà nẵng",
    "nhà đất chính chủ hải châu",
    "ký gửi nhà đất cẩm lệ",
    "nhà đất trần huy",
    "mua nhà đà nẵng",
    "bán đất cẩm lệ",
  ],

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Trần Huy Land | Kho Nhà Đất Chính Chủ Hải Châu Cẩm Lệ Đà Nẵng",
    description:
      "Mua bán, ký gửi nhà đất chính chủ uy tín tại Đà Nẵng. Cập nhật nhà đất thực tế mỗi ngày.",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Trần Huy Land",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Trần Huy Land | Kho Nhà Đất Chính Chủ Đà Nẵng",
    description:
      "Kho nhà đất chính chủ Đà Nẵng cập nhật mỗi ngày.",
    images: [DEFAULT_OG_IMAGE],
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={plusJakartaSans.variable} suppressHydrationWarning>
      <head>
        {/* 🚀 CHỐT CHẶN TRÌNH DUYỆT: Thi hành trước khi Body render 1 mili-giây */}
        <script dangerouslySetInnerHTML={{ __html: `history.scrollRestoration = 'manual'` }} />

        <link rel="preload" href="/_next/static/media/9e7b0a821b9dfcb4-s.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/_next/static/media/636a5ac981f94f8b-s.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>

      <body className={`${plusJakartaSans.className} antialiased min-h-screen flex flex-col pb-20 md:pb-0 bg-slate-50`} suppressHydrationWarning>
        {children}
        <DynamicScrollToTop />
      </body>
    </html>
  );
}
