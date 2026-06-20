/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';

interface FlashSaleProps {
  language: 'en' | 'bn';
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  products: Product[];
}

export default function FlashSale({ language, onProductClick, onAddToCart, products }: FlashSaleProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 45, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 4, minutes: 59, seconds: 59 }; // wrap around
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashSaleProducts = products.filter((p) => p.flashSale);

  const getSoldCountPercentage = (item: Product) => {
    const potentialStock = item.stock + 6;
    return Math.min(Math.round((6 / potentialStock) * 100), 100);
  };

  return (
    <div className="bg-orange-50/75 py-8 border-b border-orange-100 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with Countdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="bg-red-500 text-white font-black text-xs px-3 py-1.5 rounded-md animate-pulse uppercase tracking-wide">
              {language === 'en' ? 'FLASH SALE' : 'ফ্ল্যাশ সেল'}
            </span>
            <span className="text-zinc-800 font-bold text-sm hidden sm:inline">
              {language === 'en' ? 'Ending in:' : 'সময় বাকি:'}
            </span>
            
            {/* Timer digits */}
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black">
              <span className="bg-[#f85606] text-white rounded-lg p-2 w-9 text-center block shadow-sm">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[#f85606] font-bold">:</span>
              <span className="bg-[#f85606] text-white rounded-lg p-2 w-9 text-center block shadow-sm">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[#f85606] font-bold">:</span>
              <span className="bg-[#f85606] text-white rounded-lg p-2 w-9 text-center block shadow-sm">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {flashSaleProducts.slice(0, 5).map((product) => {
            const soldCount = Math.floor(product.soldCount / 100) % 15 + 5;
            const percentage = Math.min(Math.round(((soldCount) / (soldCount + product.stock)) * 100), 92);

            return (
              <div
                key={product.id}
                onClick={() => onProductClick(product)}
                className="bg-white rounded-xl border border-orange-100 overflow-hidden shadow-sm hover:shadow-lg transition duration-300 cursor-pointer flex flex-col group relative"
              >
                {/* Discount Badge */}
                <span className="absolute top-2 left-2 z-10 bg-[#f85606] text-white text-[10px] font-black px-2 py-1 rounded">
                  -{product.discount}%
                </span>

                {/* Cover Image */}
                <div className="relative overflow-hidden aspect-square bg-zinc-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Details */}
                <div className="p-3.5 flex flex-col flex-1">
                  <h4 className="text-zinc-800 font-bold text-xs sm:text-sm line-clamp-2 leading-tight flex-1 mb-2">
                    {language === 'en' ? product.name : product.nameBn}
                  </h4>

                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-2">
                    <Star size={11} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-[10px] text-zinc-500 select-none font-bold">
                      {product.rating}
                    </span>
                  </div>

                  {/* Pricing */}
                  <div className="mb-3">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-orange-600 font-black text-sm sm:text-base">
                        ৳{product.price.toLocaleString()}
                      </span>
                      <span className="text-zinc-400 line-through text-[10px] sm:text-xs">
                        ৳{product.originalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Progress Meter with left counts */}
                  <div className="mb-3.5">
                    <div className="flex justify-between items-center text-[9px] text-zinc-500 font-bold mb-1">
                      <span>{language === 'en' ? `${soldCount} Sold` : `${soldCount} বিক্রিত`}</span>
                      <span className="text-zinc-600 font-bold">
                        {language === 'en' ? `${product.stock} Left` : `${product.stock} বাকি`}
                      </span>
                    </div>
                    <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-orange-400 to-red-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Direct Add Button */}
                  <button
                    onClick={(e) => onAddToCart(product, e)}
                    className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold text-xs shadow hover:shadow-md transition cursor-pointer"
                  >
                    {language === 'en' ? 'Add To Cart' : 'কার্টে যোগ করুন'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
