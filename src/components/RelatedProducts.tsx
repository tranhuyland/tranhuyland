import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ChevronRight, Compass } from 'lucide-react';
import { layUrlAnhChuan } from '@/lib/utils';
import { convertToSlug } from '@/lib/googleSheets';

interface RelatedProductsProps {
  currentItem: any;
  allItems: any[];
}

export default function RelatedProducts({ currentItem, allItems }: RelatedProductsProps) {
  const relatedItems = allItems.filter((item) => {
    if (!item || !currentItem) return false;
    if (item.slug === currentItem.slug) return false; 
    return item.khuVuc === currentItem.khuVuc && item.khuVuc !== undefined;
  }).slice(0, 6);

  if (relatedItems.length === 0) return null;

  return (
    <section className="mt-16 mb-8 border-t border-slate-100 pt-10 cv-auto">
      <div className="flex items-center justify-between mb-6 px-1">
        <div>
           <h2 className="text-xl font-extrabold text-slate-800">
             Cùng khu vực {currentItem.khuVuc}
           </h2>
           <p className="text-sm text-slate-500 mt-1">Các bất động sản có thể bạn quan tâm</p>
        </div>
        <Link href={`/vi-tri/${convertToSlug(currentItem.khuVuc || '')}`} className="text-orange-600 text-sm font-bold flex items-center gap-1 hover:text-orange-700 transition-colors bg-orange-50 px-3 py-1.5 rounded-full">
          Xem thêm <ChevronRight size={14} />
        </Link>
      </div>

      <div className="flex overflow-x-auto gap-4 pb-6 pt-2 px-1 snap-x snap-mandatory hide-scrollbar">
        {relatedItems.map((item, index) => {
          const thumbnail = layUrlAnhChuan(item.anh);
          return (
            <Link 
              href={`/nha-dat/${item.slug}`} 
              key={index}
              className="group flex-none w-[200px] sm:w-[240px] bg-white rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-orange-500/10 border border-slate-100 hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-1 block snap-start"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <Image 
                  src={thumbnail} 
                  alt={`Bất động sản cùng khu vực: ${item.tieude || "Trần Huy Land"}`} 
                  title={item.tieude || "Trần Huy Land"}
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                  sizes="(max-width: 768px) 50vw, 25vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-extrabold text-xs px-2.5 py-1 rounded-lg shadow-md z-10 transform group-hover:scale-105 transition-transform">
                  {item.gia}
                </div>
              </div>
              
              <div className="p-3">
                <div className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider mb-1.5 flex items-center justify-between group-hover:text-orange-500 transition-colors">
                  <span className="flex items-center gap-1 truncate">
                    <MapPin size={12} className="text-orange-500 shrink-0" />
                    <span className="truncate">{item.khuVuc || "Đà Nẵng"}</span>
                  </span>
                  {item.dienTich && <span className="shrink-0 text-slate-500">{item.dienTich}</span>}
                </div>
                
                <h3 className="text-slate-800 font-bold text-[13px] line-clamp-2 group-hover:text-orange-600 transition-colors leading-snug h-[2.8em]">
                  {item.tieude}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  );
}
