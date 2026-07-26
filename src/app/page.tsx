import ReactDOM from 'react-dom'; // 🌟 Vũ khí kích hoạt nạp trước LCP
import { getBdsData } from "@/lib/googleSheets";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ListingSection from "@/components/ListingSection";
import About from "@/components/About";
import Blog from "@/components/Blog";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";
import FloatingWidgets from "@/components/FloatingWidgets";


export const revalidate = 60;

export default async function Home() {
  // 🚀 BÙA CHÚ CHÍ MẠNG TRIỆU TIÊU 360ms ĐỢI TẢI:
  // Ra lệnh trình duyệt lập tức kéo tấm ảnh Hero ngay ở mili-giây thứ 10
  ReactDOM.preload('/hero-bg.jpg', { as: 'image', fetchPriority: 'high' });

  const initialData = await getBdsData();

  return (
    <>
      <Header />
      <Hero />
      <ListingSection allBdsItems={initialData} />
      <About />
      <Blog />
      <ContactCTA />
      <Footer />
      <FloatingWidgets />
    </>
  );
}
