import ReactDOM from 'react-dom';
import { Suspense } from 'react';
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

async function ListingDataLoader() {
  const initialData = await getBdsData();
  return <ListingSection allBdsItems={initialData} />;
}

function ListingFallback() {
  return (
    <section className="w-full relative z-10 -mt-6 sm:-mt-10">
      <div className="bg-white w-full shadow-lg border-b border-slate-200 rounded-t-[2rem] sm:rounded-none pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex w-full items-stretch mb-6 border-b-2 border-slate-100 bg-slate-50 rounded-t-[2rem] sm:rounded-none overflow-hidden">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-1 min-w-[80px] flex flex-col justify-center items-center py-4 px-2 border-b-[3px] border-transparent">
                <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
                <div className="h-3 w-8 bg-slate-100 rounded animate-pulse mt-1" />
              </div>
            ))}
          </div>
          <div className="px-4 sm:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden border border-slate-200">
                  <div className="aspect-[16/10] w-full bg-slate-100 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse" />
                    <div className="h-3 w-1/2 bg-slate-100 rounded animate-pulse" />
                    <div className="h-3 w-2/3 bg-slate-100 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function Home() {
  ReactDOM.preload('/hero-bg.jpg', { as: 'image', fetchPriority: 'high' });

  return (
    <>
      <Header />
      <Hero />
      <Suspense fallback={<ListingFallback />}>
        <ListingDataLoader />
      </Suspense>
      <div className="cv-auto">
        <About />
      </div>
      <div className="cv-auto">
        <Blog />
      </div>
      <div className="cv-auto">
        <ContactCTA />
      </div>
      <Footer />
      <FloatingWidgets />
    </>
  );
}
