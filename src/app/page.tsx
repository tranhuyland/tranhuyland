import { Suspense } from "react";
import { getBdsData } from "@/lib/googleSheets";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ListingSection from "@/components/ListingSection";
import About from "@/components/About";
import Blog from "@/components/Blog";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Trần Huy Land | Kho Nhà Đất Chính Chủ Hải Châu Cẩm Lệ Đà Nẵng",
  description:
    "Mua bán, ký gửi nhà đất chính chủ uy tín tại Hải Châu, Cẩm Lệ, Đà Nẵng. Cập nhật giỏ hàng thực tế mỗi ngày: Nhà mặt tiền Cẩm Bá Thước, nhà kiệt ô tô Cách Mạng Tháng 8. Pháp lý minh bạch, có sẵn sổ đỏ bản vẽ xem ngay.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Trần Huy Land | Kho Nhà Đất Chính Chủ Hải Châu Cẩm Lệ Đà Nẵng",
    description:
      "Mua bán, ký gửi nhà đất chính chủ uy tín tại Đà Nẵng. Cập nhật nhà đất thực tế mỗi ngày.",
    url: "/",
    type: "website",
  },
};

function ListingFallback() {
  return (
    <div className="max-w-7xl mx-auto w-full px-4 mt-8 mb-20 min-h-[80vh]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse"
          >
            <div className="aspect-[16/10] bg-slate-200" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
              <div className="h-4 bg-slate-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function Home() {
  return (
    <>
      <Header />
      <Hero />

      <Suspense fallback={<ListingFallback />}>
        <ListingSectionWrapper />
      </Suspense>

      <About />
      <Blog />
      <ContactCTA />
      <Footer />
    </>
  );
}

async function ListingSectionWrapper() {
  const initialData = await getBdsData();
  return <ListingSection allBdsItems={initialData} />;
}
