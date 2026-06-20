/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: any;
  product?: Product;
  language: 'en' | 'bn';
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product, e: React.MouseEvent) => void;
  isLoading?: boolean;
}

export default function ProductCard({
  product,
  language,
  onProductClick,
  onAddToCart,
  isLoading = false,
}: ProductCardProps) {
  // Skeleton Loading variant
  if (isLoading || !product) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 p-3.5 space-y-3.5 shadow-sm select-none">
        {/* Shimmer Image Box */}
        <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shimmer-bg" />
        
        {/* Category bone */}
        <div className="h-2.5 w-1/3 rounded-full bg-zinc-200 dark:bg-zinc-750 shimmer-bg" />
        
        {/* Title bones */}
        <div className="space-y-1.5">
          <div className="h-3 w-full rounded-full bg-zinc-200 dark:bg-zinc-750 shimmer-bg" />
          <div className="h-3 w-4/5 rounded-full bg-zinc-200 dark:bg-zinc-750 shimmer-bg" />
        </div>

        {/* Rating bone */}
        <div className="flex gap-1.5 items-center">
          <div className="h-2.5 w-12 rounded-full bg-zinc-200 dark:bg-zinc-750 shimmer-bg" />
          <div className="h-2.5 w-8 rounded-full bg-zinc-200 dark:bg-zinc-750 shimmer-bg" />
        </div>

        {/* Price & Action Bones */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-4">
          <div className="h-4 w-16 rounded-full bg-zinc-200 dark:bg-zinc-750 shimmer-bg" />
          <div className="h-7 w-20 rounded-lg bg-zinc-200 dark:bg-zinc-750 shimmer-bg" />
        </div>
      </div>
    );
  }

  const discountPercent = product.discount || (product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0);

  return (
    <div
      onClick={() => onProductClick && onProductClick(product)}
      className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-zinc-950/50 hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-pointer flex flex-col group relative select-none"
    >
      {/* Discount Tag */}
      {discountPercent > 0 && (
        <span className="absolute top-3 left-3 z-10 bg-red-650 hover:bg-red-750 text-white text-[9px] font-black px-2 py-0.5 rounded-lg shadow-md leading-none select-none uppercase tracking-wider">
          -{discountPercent}%
        </span>
      )}

      {/* Picture */}
      <div className="relative overflow-hidden aspect-square bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-100/50 dark:border-zinc-800/50">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=60'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-106"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Default elegant product fallback image if main image loading fails
            (e.target as HTMLImageElement).onerror = null;
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=60';
          }}
        />
        {/* Subtle glass effect overlay on hover */}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Details info */}
      <div className="p-3.5 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 mb-1.5 select-none">
          <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
            {language === 'en' ? product.category : product.categoryBn}
          </span>
          {product.code && (
            <span className="text-[8.5px] font-mono font-bold bg-zinc-100 dark:bg-zinc-850 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-200/40 dark:border-zinc-800/60 leading-none">
              #{product.code}
            </span>
          )}
        </div>
        
        <h4 className="text-zinc-800 dark:text-zinc-150 font-black text-xs sm:text-sm line-clamp-2 leading-snug flex-1 mb-2.5 group-hover:text-red-650 dark:group-hover:text-red-500 transition-colors">
          {language === 'en' ? product.name : product.nameBn}
        </h4>

        {/* Rating and review statistics */}
        <div className="flex items-center gap-1.5 mb-3 select-none">
          <div className="flex text-amber-400 fill-amber-400">
            <Star size={11} className="fill-amber-450 text-amber-450" />
          </div>
          <span className="text-[10px] text-zinc-700 dark:text-zinc-300 font-extrabold">
            {product.rating}
          </span>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold">
            ({product.reviewsCount})
          </span>
        </div>

        {/* Price Tag lines */}
        <div className="mb-3.5 flex flex-col gap-1 font-sans">
          {localStorage.getItem('ghoroya_reseller_role') === 'reseller' && product.resellerPrice !== undefined ? (
            <>
              {/* Green Reseller Price ON TOP */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  {language === 'en' ? 'Reseller' : 'রিসেলার রেট'}
                </span>
                <span className="text-emerald-600 dark:text-emerald-500 font-black text-sm sm:text-base tracking-tight">
                  ৳{product.resellerPrice.toLocaleString()}
                </span>
              </div>
              {/* Customer Rate Below */}
              <div className="flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                <span>{language === 'en' ? 'Customer Price: ' : 'কাস্টমার রেট: '}</span>
                <span className="font-semibold">৳{product.price.toLocaleString()}</span>
                {product.originalPrice > product.price && (
                  <span className="text-zinc-400 dark:text-zinc-500 line-through text-[10px]">
                    ৳{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-orange-600 dark:text-orange-500 font-black text-sm sm:text-base tracking-tight">
                ৳{product.price.toLocaleString()}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-zinc-400 dark:text-zinc-500 line-through text-[10px] sm:text-xs font-semibold">
                  ৳{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={(e) => {
            if (onAddToCart) {
              onAddToCart(product, e);
            }
          }}
          className="w-full py-2.5 bg-zinc-50 hover:bg-red-650 dark:bg-zinc-800 dark:hover:bg-red-650 border border-zinc-200 dark:border-zinc-700/80 hover:border-transparent dark:hover:border-transparent text-zinc-800 hover:text-white dark:text-zinc-200 dark:hover:text-white rounded-xl text-xs font-black tracking-wide uppercase transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
        >
          {language === 'en' ? 'Add To Cart' : 'কার্টে যোগ করুন'}
        </button>
      </div>
    </div>
  );
}

