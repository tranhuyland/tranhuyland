import { getBdsData, getBlogData } from "@/lib/googleSheets";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWidgets from "@/components/FloatingWidgets";
import { notFound } from "next/navigation";
import BackButton from "@/components/BackButton";
import PropertyClient from "./PropertyClient";
import { layUrlAnhChuan } from "@/lib/utils";
import RelatedProducts from "@/components/RelatedProducts";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { cache } from "react";
import type { Metadata } from "next";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

function convertToSlug(text: string): string {
  if (!text) return "";
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const getCachedAllItems = cache(async () => {
  const data = await getBdsData();
  return Array.isArray(data) ? data : [];
});

const getPropertyBySlug = async (slug: string) => {
  const safeData = await getCachedAllItems();
  const foundItem = safeData.find((p: any) => p?.slug === slug);
  return {
    item: foundItem ? (foundItem as any) : null,
    allItems: safeData,
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { item } = await getPropertyBySlug(slug);

  if (!item) {
    return {
      title: "Không tìm thấy sản phẩm",
      description: "Bất động sản này không tồn tại hoặc đã được bán.",
      robots: { index: false, follow: false },
    };
  }

  const titleText = item.tieude || item.Tieude || item.title || "Chi tiết bất động sản";
  const priceText = item.gia || item.Gia || item.price || "Liên hệ";
  const areaText = item.dienTich || item.DienTich || item.dientich || "Chưa rõ";
  const locationText = item.khuVucFull || item.khuvucFull || item.diachi || "Đà Nẵng";
  const imageSeo = layUrlAnhChuan(item.anh || item.Anh) || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&h=630&q=80";
  const canonicalUrl = `/nha-dat/${slug}`;
  const title = `${titleText} - Giá: ${priceText}`;
  const description = `Bán nhà đất chính chủ tại ${locationText}. Diện tích: ${areaText}, giá công khai: ${priceText}. Sổ hồng chính chủ, hỗ trợ thương lượng giá trực tiếp.`;

  return {
    title,
    description,
    keywords: [
      titleText,
      `bán nhà ${locationText}`,
      `nhà đất ${item.khuVuc || ""}`,
      item.loaiHinh || "nhà đất",
      priceText,
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
      title,
      description,
      url: canonicalUrl,
      siteName: "Trần Huy Land",
      images: [{ url: imageSeo, width: 1200, height: 630, alt: titleText }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageSeo],
    },
  };
}

export default async function NhaDatDetail({ params }: Props) {
  const { slug } = await params;
  const { item, allItems } = await getPropertyBySlug(slug);

  if (!item) notFound();

  const titleText = item.tieude || item.Tieude || item.title || "";
  const locationText = item.khuVucFull || item.khuvucFull || "Đà Nẵng";
  const locationName = item.khuVuc || item.KhuVuc || "";
  const locationSlug = convertToSlug(locationName);
  const imageSeo = layUrlAnhChuan(item.anh || item.Anh) || "";

  const loaiHinhText = (item.loaiHinh || item.phân_loại || item.loaihinh || "").toLowerCase();
  let typeSlug = "";
  let typeLabel = "";
  if (loaiHinhText.includes("dat") || loaiHinhText.includes("đất")) { typeSlug = "dat"; typeLabel = "Đất"; }
  else if (loaiHinhText.includes("nha pho") || loaiHinhText.includes("nhà phố") || loaiHinhText.includes("nha")) { typeSlug = "nha-pho"; typeLabel = "Nhà phố"; }
  else if (loaiHinhText.includes("can ho") || loaiHinhText.includes("căn hộ")) { typeSlug = "can-ho"; typeLabel = "Căn hộ"; }
  else if (loaiHinhText.includes("cho thue") || loaiHinhText.includes("cho thuê")) { typeSlug = "cho-thue"; typeLabel = "Cho thuê"; }

  const allBlogs = await getBlogData();
  const blogText = `${titleText} ${locationName}`.toLowerCase();
  const relatedBlogs = allBlogs.filter((b: any) => {
    const bTitle = (b.title || "").toLowerCase();
    const bExcerpt = (b.excerpt || "").toLowerCase();
    return locationName && (bTitle.includes(locationName.toLowerCase()) || bExcerpt.includes(locationName.toLowerCase()));
  }).slice(0, 4);

  const rawPrice = item.gia || item.Gia || "0";
  let numericPrice = parseFloat(rawPrice.replace(/[^0-9.]/g, "")) || 0;
  if (rawPrice.toLowerCase().includes("tỷ") || rawPrice.toLowerCase().includes("ty")) {
    numericPrice = numericPrice * 1000000000;
  } else if (rawPrice.toLowerCase().includes("triệu") || rawPrice.toLowerCase().includes("trieu")) {
    numericPrice = numericPrice * 1000000;
  }

  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": titleText,
    "description": `${titleText} tại khu vực ${locationText}. Diện tích thực tế ${item.dienTich || "Chưa rõ"}.`,
    "url": `https://tranhuyland.vn/nha-dat/${slug}`,
    "datePosted": item.ngayDang || new Date().toISOString().split("T")[0],
    "image": imageSeo,
    "offers": {
      "@type": "Offer",
      "price": numericPrice > 0 ? numericPrice : rawPrice,
      "priceCurrency": "VND",
      "availability": "https://schema.org/InStock",
      "url": `https://tranhuyland.vn/nha-dat/${slug}`
    },
    "about": {
      "@type": "SingleFamilyResidence",
      "name": titleText,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": locationText,
        "addressLocality": "Đà Nẵng",
        "addressRegion": "Đà Nẵng",
        "addressCountry": "VN"
      }
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": "https://tranhuyland.vn/" },
      ...(locationName ? [{ "@type": "ListItem", "position": 2, "name": `Nhà đất ${locationName}`, "item": `https://tranhuyland.vn/vi-tri/${locationSlug}` }] : []),
      ...(typeSlug && typeLabel ? [{ "@type": "ListItem", "position": locationName ? 3 : 2, "name": typeLabel, "item": `https://tranhuyland.vn/loai-hinh/${typeSlug}` }] : []),
      { "@type": "ListItem", "position": (locationName ? 3 : 2) + (typeSlug ? 1 : 0), "name": titleText, "item": `https://tranhuyland.vn/nha-dat/${slug}` },
    ],
  };

  const enrichedItem = {
    ...item,
    linkMap: item.linkMap || item.toado || item.toaDo || "",
    maNhungMap: item.maNhungMap || item.manhungmap || ""
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-[#222222] selection:bg-orange-500 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Header />

      <nav className="sticky top-[56px] md:top-[64px] z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-1.5 text-xs md:text-sm text-slate-500 overflow-hidden font-medium">
          <Link href="/" className="flex items-center gap-1 hover:text-orange-600 font-semibold shrink-0">
            <Home className="w-3.5 h-3.5" /> Trang chủ
          </Link>
          {locationName && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <Link href={`/vi-tri/${locationSlug}`} className="hover:text-orange-600 font-semibold shrink-0">
                {locationName}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {typeSlug && typeLabel && (
            <Link href={`/loai-hinh/${typeSlug}`} className="hover:text-orange-600 font-semibold shrink-0">
              {typeLabel}
            </Link>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-orange-600 font-bold truncate tracking-tight">
            {titleText}
          </span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">
        <PropertyClient item={enrichedItem} initialCoverImage={imageSeo} />

        <div className="mt-16">
          <RelatedProducts currentItem={enrichedItem} allItems={allItems} />
        </div>
      </main>

      <nav aria-label="Liên kết nội bộ" className="sr-only">
        <h2>Liên kết liên quan</h2>
        <ul>
          {typeSlug && <li><Link href={`/loai-hinh/${typeSlug}`}>{typeLabel} Đà Nẵng</Link></li>}
          <li><Link href={`/vi-tri/${locationSlug}`}>Nhà đất {locationName}</Link></li>
          <li><Link href="/loai-hinh/dat">Mua bán đất Đà Nẵng</Link></li>
          <li><Link href="/loai-hinh/nha-pho">Mua bán nhà phố Đà Nẵng</Link></li>
          <li><Link href="/loai-hinh/can-ho">Mua bán căn hộ Đà Nẵng</Link></li>
          <li><Link href="/blog">Góc tư vấn bất động sản Đà Nẵng</Link></li>
          {relatedBlogs.map((b: any) => (
            <li key={b.slug}>
              <Link href={`/blog/${b.slug}`}>{b.title}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <BackButton />
      <Footer />
      <FloatingWidgets />
    </div>
  );
}
