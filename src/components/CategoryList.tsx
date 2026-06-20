import React, { useRef } from 'react';
import { 
  Laptop, Shirt, Home, Sparkles, Apple, ShoppingBag, Package, Leaf, Wind, 
  Smartphone, Heart, Baby, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { CATEGORIES } from '../data/products';

interface CategoryListProps {
  language: 'en' | 'bn';
  selectedCategory: string;
  setSelectedCategory: (catId: string) => void;
}

const iconMap: { [key: string]: React.ComponentType<{ className?: string; size?: number }> } = {
  ShoppingBag,
  Laptop,
  Shirt,
  Home,
  Sparkles,
  Apple,
  Package,
  Leaf,
  Wind,
  Smartphone,
  Heart,
  Baby
};

const categoryColors: { [key: string]: { border: string; text: string; lightBg: string; activeBg: string } } = {
  all: { border: 'border-red-200', text: 'text-red-600', lightBg: 'bg-red-50', activeBg: 'bg-[#f85606]' },
  electronics: { border: 'border-blue-200', text: 'text-blue-600', lightBg: 'bg-blue-50', activeBg: 'bg-blue-600' },
  fashion: { border: 'border-pink-200', text: 'text-pink-600', lightBg: 'bg-pink-50', activeBg: 'bg-pink-650 font-black' },
  home_decor: { border: 'border-green-200', text: 'text-green-600', lightBg: 'bg-green-50', activeBg: 'bg-green-650' },
  personal_care: { border: 'border-yellow-250', text: 'text-yellow-600', lightBg: 'bg-yellow-50', activeBg: 'bg-yellow-600' },
  groceries: { border: 'border-purple-200', text: 'text-purple-650', lightBg: 'bg-purple-50', activeBg: 'bg-purple-650 font-black' },
  package: { border: 'border-red-200', text: 'text-red-655', lightBg: 'bg-red-50/60', activeBg: 'bg-red-650 font-black' },
  fresh_groceries: { border: 'border-emerald-200', text: 'text-emerald-700', lightBg: 'bg-emerald-50/65', activeBg: 'bg-emerald-650 font-bold' },
  beauty: { border: 'border-fuchsia-200', text: 'text-fuchsia-600', lightBg: 'bg-fuchsia-50/60', activeBg: 'bg-fuchsia-650' },
  gadget: { border: 'border-indigo-200', text: 'text-indigo-600', lightBg: 'bg-indigo-50/60', activeBg: 'bg-indigo-650' },
  skincare: { border: 'border-rose-200', text: 'text-rose-600', lightBg: 'bg-rose-50/60', activeBg: 'bg-rose-650' },
  kids_mom: { border: 'border-teal-200', text: 'text-teal-600', lightBg: 'bg-teal-50/60', activeBg: 'bg-teal-650 font-bold' }
};

export default function CategoryList({
  language,
  selectedCategory,
  setSelectedCategory
}: CategoryListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  return (
    <div id="categories-list-section" className="bg-white dark:bg-zinc-950 py-6 border-b border-zinc-100 dark:border-zinc-850/80 px-4 sm:px-6 select-none relative group/cat">
      <div className="max-w-7xl mx-auto relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-zinc-900 dark:text-white font-extrabold text-lg sm:text-xl tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#f85606] rounded" />
            {language === 'en' ? 'Browse Categories' : 'ক্যাটাগরি সমূহ'}
          </h3>
          
          {/* Subtle scroll arrows displayed nicely on large screens */}
          <div className="hidden md:flex gap-2">
            <button
              onClick={handleScrollLeft}
              type="button"
              className="bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 p-2 rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
              title="Scroll left"
            >
              <ChevronLeft size={16} className="font-extrabold" />
            </button>
            <button
              onClick={handleScrollRight}
              type="button"
              className="bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 p-2 rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
              title="Scroll right"
            >
              <ChevronRight size={16} className="font-extrabold" />
            </button>
          </div>
        </div>

        {/* Categories horizontal drag/scroll container */}
        <div className="relative">
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scroll-smooth pr-6 select-none scrollbar-thin"
          >
            {CATEGORIES.map((cat) => {
              const IconComponent = iconMap[cat.icon] || ShoppingBag;
              const isSelected = selectedCategory === cat.id;
              const style = categoryColors[cat.id] || categoryColors.all;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex-none w-24 sm:w-28 flex flex-col items-center gap-2 px-3 py-4 rounded-2xl border transition duration-300 list-none text-center cursor-pointer select-none snap-start ${
                    isSelected
                      ? `${style.activeBg} text-white border-transparent shadow-lg scale-102 translate-y-[-2px]`
                      : `bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/80 dark:hover:bg-zinc-850 hover:border-zinc-300 dark:hover:border-zinc-700`
                  }`}
                >
                  <div
                    className={`p-3 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-white/25 text-white' : `${style.lightBg} dark:bg-zinc-800/80 ${style.text}`
                    }`}
                  >
                    <IconComponent size={22} className={isSelected ? 'animate-pulse' : ''} />
                  </div>
                  <span className="font-bold text-[11px] leading-tight line-clamp-1">
                    {language === 'en' ? cat.name : cat.nameBn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
