import { getBdsData, getBlogData } from "@/lib/googleSheets";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWidgets from "@/components/FloatingWidgets";
import ListingSection from "@/components/ListingSection";
import { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";

export const revalidate = 60;

const LOCATION_MAP: Record<string, string> = {
  "an-hai": "An Hải", "an-khe": "An Khê", "ba-na": "Bà Nà",
  "cam-le": "Cẩm Lệ", "hai-chau": "Hải Châu", "hai-van": "Hải Vân",
  "hoa-bac": "Hòa Bắc", "hoa-cuong": "Hòa Cường", "hoa-khanh": "Hòa Khánh",
  "hoa-lien": "Hòa Liên", "hoa-ninh": "Hòa Ninh", "hoa-phuoc": "Hòa Phước",
  "hoa-tien": "Hòa Tiến", "hoa-vang": "Hòa Vang", "hoa-xuan": "Hòa Xuân",
  "lien-chieu": "Liên Chiểu", "ngu-hanh-son": "Ngũ Hành Sơn",
  "son-tra": "Sơn Trà", "thanh-khe": "Thanh Khê"
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const exactName = LOCATION_MAP[slug] || slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  const titleText = `Mua bán nhà đất ${exactName}, Đà Nẵng giá tốt nhất`;
  const descriptionText = `Danh sách bất động sản, nhà đất chính chủ tại khu vực ${exactName}, Đà Nẵng. Cập nhật mới nhất hôm nay, giá rẻ, vị trí đẹp, thông tin minh bạch.`;
  const canonicalUrl = `/vi-tri/${slug}`;

  return {
    title: titleText,
    description: descriptionText,
    keywords: [
      `nhà đất ${exactName}`,
      `mua bán nhà ${exactName}`,
      `bán đất ${exactName} đà nẵng`,
      `bất động sản ${exactName}`,
      "nhà đất đà nẵng",
      "trần huy land",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: titleText,
      description: descriptionText,
      url: canonicalUrl,
      siteName: "Trần Huy Land",
      type: "website",
      images: [
        {
          url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&h=630&q=80",
          width: 1200,
          height: 630,
          alt: `Nhà đất ${exactName}, Đà Nẵng`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titleText,
      description: descriptionText,
      images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&h=630&q=80"],
    },
  };
}

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;
  const exactName = LOCATION_MAP[slug] || slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const allData = await getBdsData();

  const allBlogs = await getBlogData();
  const locationNameLower = exactName.toLowerCase();
  const relatedBlogs = allBlogs.filter((b: any) => {
    const bTitle = (b.title || "").toLowerCase();
    const bExcerpt = (b.excerpt || "").toLowerCase();
    return bTitle.includes(locationNameLower) || bExcerpt.includes(locationNameLower);
  }).slice(0, 4);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": "https://tranhuyland.vn" },
      { "@type": "ListItem", "position": 2, "name": "Khu vực", "item": "https://tranhuyland.vn" },
      { "@type": "ListItem", "position": 3, "name": exactName, "item": `https://tranhuyland.vn/vi-tri/${slug}` }
    ]
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header />

      <nav className="sticky top-[56px] md:top-[64px] z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-slate-500 flex-nowrap overflow-hidden">
          
          <Link
            href="/"
            className="flex items-center gap-1 text-slate-600 hover:text-orange-600 transition-colors font-semibold shrink-0"
          >
            <Home className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            Trang chủ
          </Link>

          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          
          <span className="text-slate-700 font-semibold shrink-0">Khu vực</span>
          
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          
          <span className="text-orange-600 font-extrabold min-w-0 flex-1 truncate text-[13px] sm:text-[14.5px] tracking-tight">
            {exactName}
          </span>

        </div>
      </nav>

      <div className="pt-2 pb-12 bg-slate-900 text-center px-4 !mt-0">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          Nhà đất <span className="text-orange-500">{exactName}</span>, Đà Nẵng
        </h1>
        <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Tổng hợp giỏ hàng bất động sản chính chủ, giá tốt nhất tại khu vực {exactName}.
        </p>
      </div>

      <div className="flex-grow -mt-4">
        <ListingSection allBdsItems={allData} forceDistrict={exactName} />
      </div>

      <nav aria-label="Liên kết nội bộ" className="sr-only">
        <h2>Liên kết liên quan</h2>
        <ul>
          <li><Link href="/loai-hinh/dat">Mua bán đất {exactName}</Link></li>
          <li><Link href="/loai-hinh/nha-pho">Mua bán nhà phố {exactName}</Link></li>
          <li><Link href="/loai-hinh/can-ho">Mua bán căn hộ {exactName}</Link></li>
          <li><Link href="/loai-hinh/cho-thue">Cho thuê bất động sản {exactName}</Link></li>
          <li><Link href="/blog">Góc tư vấn bất động sản Đà Nẵng</Link></li>
          {relatedBlogs.map((b: any) => (
            <li key={b.slug}>
              <Link href={`/blog/${b.slug}`}>{b.title}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <Footer />
      <FloatingWidgets />
    </main>
  );
}
