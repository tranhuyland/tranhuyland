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

const TYPE_MAP: Record<string, string> = {
  "dat": "Đất",
  "nha-pho": "Nhà phố",
  "can-ho": "Căn hộ",
  "cho-thue": "Cho thuê"
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const exactName = TYPE_MAP[slug] || "Bất động sản";
  const action = slug === "cho-thue" ? "Cho thuê" : "Mua bán";

  const titleText = `${action} ${exactName} Đà Nẵng chính chủ, giá tốt nhất`;
  const descriptionText = `Khám phá giỏ hàng ${exactName.toLowerCase()} tại Đà Nẵng. Cập nhật liên tục, vị trí đẹp, pháp lý rõ ràng, thông tin minh bạch từ Trần Huy Land.`;
  const canonicalUrl = `/loai-hinh/${slug}`;

  return {
    title: titleText,
    description: descriptionText,
    keywords: [
      `${action} ${exactName.toLowerCase()} đà nẵng`,
      `${exactName.toLowerCase()} chính chủ`,
      `${exactName.toLowerCase()} giá tốt`,
      `mua ${exactName.toLowerCase()} đà nẵng`,
      "bất động sản đà nẵng",
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
          alt: `${action} ${exactName} Đà Nẵng`,
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

export default async function PropertyTypePage({ params }: Props) {
  const { slug } = await params;
  const exactName = TYPE_MAP[slug] || "Bất động sản";
  const action = slug === "cho-thue" ? "Cho thuê" : "Mua bán";
  
  const allData = await getBdsData();
  const allBlogs = await getBlogData();
  const typeLower = exactName.toLowerCase();
  const relatedBlogs = allBlogs.filter((b: any) => {
    const bTitle = (b.title || "").toLowerCase();
    const bExcerpt = (b.excerpt || "").toLowerCase();
    return bTitle.includes(typeLower) || bExcerpt.includes(typeLower);
  }).slice(0, 4);

  const removeAccents = (str: string) => {
    return str.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").trim();
  };

  const filteredData = allData.filter((item: any) => {
    const textToSearch = removeAccents(`${item.tieude || ""} ${item.tag || ""} ${item.loaiHinh || item.phân_loại || ""}`);
    if (slug === "dat") return textToSearch.includes("dat");
    if (slug === "nha-pho") return textToSearch.includes("nha pho");
    if (slug === "can-ho") return textToSearch.includes("can ho");
    if (slug === "cho-thue") return textToSearch.includes("cho thue");
    return true;
  });

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <nav className="sticky top-[56px] z-40 bg-white border-b border-slate-200 shadow-sm w-full">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center text-sm text-slate-600">
          <Link href="/" className="hover:text-orange-600 flex items-center shrink-0">
            <Home className="w-4 h-4 mr-1" />
            Trang chủ
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-400" />
          <span className="font-medium text-slate-900 shrink-0">Loại hình</span>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-400" />
          <span className="font-bold text-orange-600 truncate">{exactName}</span>
        </div>
      </nav>

      <div className="pt-2 pb-12 bg-slate-900 text-center px-4 !mt-0">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          {action} <span className="text-orange-500">{exactName}</span> Đà Nẵng
        </h1>
        <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Tổng hợp giỏ hàng {exactName.toLowerCase()} chính chủ, giá tốt nhất tại Đà Nẵng. Pháp lý chuẩn, cập nhật mới nhất hôm nay.
        </p>
      </div>

      <div className="flex-grow -mt-4">
        <ListingSection allBdsItems={filteredData} />
      </div>

      <nav aria-label="Liên kết nội bộ" className="sr-only">
        <h2>Liên kết liên quan</h2>
        <ul>
          <li><Link href="/vi-tri/hai-chau">{exactName} Hải Châu</Link></li>
          <li><Link href="/vi-tri/thanh-khe">{exactName} Thanh Khê</Link></li>
          <li><Link href="/vi-tri/hoa-cuong">{exactName} Hòa Cường</Link></li>
          <li><Link href="/vi-tri/cam-le">{exactName} Cẩm Lệ</Link></li>
          <li><Link href="/vi-tri/son-tra">{exactName} Sơn Trà</Link></li>
          <li><Link href="/vi-tri/hoa-xuan">{exactName} Hòa Xuân</Link></li>
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
