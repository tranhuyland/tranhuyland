import { Suspense } from "react";
import { getBdsData } from "@/lib/googleSheets";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ListingSection from "@/components/ListingSection";
import About from "@/components/About";
import Blog from "@/components/Blog";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";

export const revalidate = 60;

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
