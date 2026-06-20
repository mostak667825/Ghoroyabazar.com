import React, { useState, useEffect } from 'react';
import { Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface AIRecommendationsListProps {
  cartProductIds: string[];
  currentlyViewedId?: string;
  language: 'en' | 'bn';
  onProductClick: (p: Product) => void;
  products: Product[];
  layout?: 'compact' | 'full';
}

export default function AIRecommendationsList({
  cartProductIds = [],
  currentlyViewedId,
  language,
  onProductClick,
  products,
  layout = 'full',
}: AIRecommendationsListProps) {
  const [recommendedIds, setRecommendedIds] = useState<string[]>([]);
  const [rationale, setRationale] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/gemini/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cartProductIds,
            currentlyViewedId,
            language,
          }),
        });
        const data = await response.json();
        if (data) {
          setRecommendedIds(data.recommendedProductIds || []);
          setRationale(data.rationale || '');
        }
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [cartProductIds.length, currentlyViewedId, language]);

  // Find physical products
  const recommendedItems = recommendedIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => !!p);

  if (loading && recommendedItems.length === 0) {
    return (
      <div className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 space-y-4 text-left animate-fade-in my-6">
        <div className="flex items-center gap-2">
          <Sparkles className="animate-spin text-red-650" size={15} />
          <div className="h-3 w-48 rounded bg-zinc-250 dark:bg-zinc-750 shimmer-bg" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-750 shimmer-bg" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-850 rounded-2xl border border-zinc-150 dark:border-zinc-800/80">
                <div className="w-12 h-12 rounded-xl bg-zinc-250 dark:bg-zinc-750 shimmer-bg shrink-0" />
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="h-3 w-4/5 rounded bg-zinc-200 dark:bg-zinc-750 shimmer-bg" />
                  <div className="h-2.5 w-1/3 rounded bg-zinc-200 dark:bg-zinc-750 shimmer-bg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (recommendedItems.length === 0) {
    return null;
  }

  if (layout === 'compact') {
    return (
      <div className="bg-gradient-to-br from-[#FFF8F6] to-white dark:from-zinc-900 dark:to-zinc-950 border border-red-100 dark:border-zinc-800/80 rounded-2xl p-3.5 space-y-2.5 my-3 animate-fade-in text-left">
        <div className="flex items-center gap-1.5 border-b border-red-50/50 dark:border-zinc-800 pb-1.5">
          <Sparkles size={12} className="text-red-650 dark:text-red-400 fill-red-550/10" />
          <h5 className="font-black text-[10px] uppercase tracking-wider text-red-650 dark:text-red-400">
            {language === 'en' ? 'Smart AI Match' : 'এআই কাস্টম রেকমেন্ডেশন'}
          </h5>
        </div>

        {rationale && (
          <p className="text-[10px] text-zinc-600 dark:text-zinc-300 font-bold leading-relaxed italic bg-white/70 dark:bg-zinc-900/60 p-2 rounded-xl border border-zinc-100 dark:border-zinc-800">
            "{rationale}"
          </p>
        )}

        <div className="space-y-1.5">
          {recommendedItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onProductClick(item)}
              type="button"
              className="w-full flex items-center gap-2 p-1.5 rounded-xl hover:bg-white dark:hover:bg-zinc-850 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700/80 transition text-left cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-8 h-8 object-cover rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-150 dark:border-zinc-700"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-extrabold text-zinc-800 dark:text-zinc-200 truncate">
                  {language === 'en' ? item.name : item.nameBn}
                </p>
                <p className="text-[9px] font-black text-orange-600 dark:text-orange-500 leading-none">
                  ৳{item.price.toLocaleString()}
                </p>
              </div>
              <div className="bg-red-50 dark:bg-red-950/40 text-red-650 dark:text-red-400 p-1 rounded-lg">
                <ArrowRight size={10} />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 space-y-4.5 my-6 animate-fade-in text-left">
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5">
          <Sparkles size={14} className="text-red-655 dark:text-red-400 fill-red-400/20" />
          <h4 className="font-extrabold text-xs text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
            {language === 'en' ? 'AI Companion Recommendations' : 'এআই পার্সোনালাইজড রেকমেন্ডেশন'}
          </h4>
        </div>
        <span className="text-[9px] font-black text-red-650 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-1.5 py-0.5 rounded-full select-none">
          Beta
        </span>
      </div>

      {rationale && (
        <p className="text-[11px] text-zinc-650 dark:text-zinc-350 font-medium leading-relaxed bg-white dark:bg-zinc-900/80 px-3 py-2 rounded-xl border border-zinc-150 dark:border-zinc-800 select-none">
          💡 {rationale}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {recommendedItems.map((item) => {
          const discountPct = item.originalPrice
            ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
            : 0;

          return (
            <div
              key={item.id}
              onClick={() => onProductClick(item)}
              className="flex items-center gap-3 p-2.5 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 hover:border-red-300 dark:hover:border-red-500 rounded-xl transition cursor-pointer group hover:-translate-y-0.5 duration-200"
            >
              <div className="relative w-12 h-12 rounded-lg bg-zinc-50 dark:bg-zinc-800 overflow-hidden shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-extrabold text-zinc-800 dark:text-zinc-200 truncate group-hover:text-red-650 dark:group-hover:text-red-400 transition">
                  {language === 'en' ? item.name : item.nameBn}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[11px] font-black text-orange-655 dark:text-orange-500">
                    ৳{item.price.toLocaleString()}
                  </span>
                  {discountPct > 0 && (
                    <span className="text-[8px] font-black text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400 px-1 rounded">
                      -{discountPct}%
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-800 group-hover:bg-red-50 dark:group-hover:bg-red-950/30 text-zinc-400 dark:text-zinc-500 group-hover:text-red-650 dark:group-hover:text-red-400 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 group-hover:border-red-105 dark:group-hover:border-red-900 transition-colors">
                <ShoppingBag size={12} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
