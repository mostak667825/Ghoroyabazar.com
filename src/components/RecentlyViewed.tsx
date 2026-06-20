import React from 'react';
import { Eye, Trash2, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface RecentlyViewedProps {
  recentlyViewedIds: string[];
  products: Product[];
  onProductClick: (p: Product) => void;
  language: 'en' | 'bn';
  onClear: () => void;
}

export default function RecentlyViewed({
  recentlyViewedIds,
  products,
  onProductClick,
  language,
  onClear,
}: RecentlyViewedProps) {
  // Map IDs to actual product objects in order of viewing
  const viewedProducts = recentlyViewedIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => !!p);

  if (viewedProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-6 shadow-sm select-none animate-fade-in my-8">
      {/* Title block with small trash helper */}
      <div className="flex items-center justify-between gap-4 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="bg-[#FFF0EB] dark:bg-red-950/30 p-2 rounded-xl text-red-650 dark:text-red-400">
            <Eye size={18} className="animate-pulse" />
          </div>
          <div>
            <h3 className="font-black text-zinc-900 dark:text-white text-sm sm:text-base tracking-tight">
              {language === 'en' ? 'Recently Viewed Products' : 'আপনার সম্প্রতি দেখা পণ্যসমূহ'}
            </h3>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold leading-none">
              {language === 'en' ? 'Pick up right where you left off' : 'যে পণ্যগুলো আপনি সম্প্রতি ব্রাউজ করেছেন'}
            </p>
          </div>
        </div>

        <button
          onClick={onClear}
          type="button"
          title={language === 'en' ? 'Clear History' : 'ইতিহাস মুছে ফেলুন'}
          className="flex items-center gap-1 text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-400 hover:text-red-650 dark:hover:text-red-450 bg-zinc-50 dark:bg-zinc-800 hover:bg-[#FFF0EB] dark:hover:bg-red-950/20 border border-zinc-150 dark:border-zinc-700 px-3 py-1.5 rounded-xl transition cursor-pointer"
        >
          <Trash2 size={12} />
          <span className="hidden sm:inline">
            {language === 'en' ? 'Clear' : 'মুছে ফেলুন'}
          </span>
        </button>
      </div>

      {/* Horizontal Scroll Layout */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
        {viewedProducts.map((p) => {
          const discountPercent = p.originalPrice
            ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
            : 0;

          return (
            <div
              key={p.id}
              onClick={() => onProductClick(p)}
              className="min-w-[140px] sm:min-w-[180px] bg-zinc-50/50 dark:bg-zinc-850/30 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-150 dark:border-zinc-800/80 hover:border-red-300 dark:hover:border-red-500 rounded-2xl p-2.5 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Product Image Panel */}
                <div className="relative aspect-square overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-700 mb-2">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {discountPercent > 0 && (
                    <span className="absolute left-1.5 top-1.5 bg-red-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-md leading-none">
                      -{discountPercent}%
                    </span>
                  )}
                </div>

                {/* Product Meta */}
                <h4 className="text-[11px] sm:text-xs font-extrabold text-zinc-800 dark:text-zinc-200 line-clamp-2 leading-tight min-h-[32px] group-hover:text-red-650 dark:group-hover:text-red-400 transition-colors">
                  {language === 'en' ? p.name : p.nameBn}
                </h4>
              </div>

              {/* Price Details */}
              <div className="mt-2.5 pt-2 border-t border-zinc-100/75 dark:border-zinc-805/80 flex items-center justify-between">
                <div>
                  <p className="text-[11px] sm:text-xs font-black text-orange-650 dark:text-orange-500 leading-none">
                    ৳{p.price.toLocaleString()}
                  </p>
                  {p.originalPrice && p.originalPrice > p.price && (
                    <p className="text-[9px] text-zinc-400 dark:text-zinc-500 line-through leading-none mt-0.5 font-bold">
                      ৳{p.originalPrice.toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="bg-white dark:bg-zinc-800 group-hover:bg-red-650 text-zinc-400 dark:text-zinc-500 group-hover:text-white p-1 rounded-lg border border-zinc-200 dark:border-zinc-700 group-hover:border-transparent dark:group-hover:border-transparent transition-colors">
                  <ArrowRight size={10} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
