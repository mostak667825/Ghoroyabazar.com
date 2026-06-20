/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_SLIDES } from '../data/products';

interface HeroBannerProps {
  language: 'en' | 'bn';
  setIsAiChatOpen: (open: boolean) => void;
}

export default function HeroBanner({ language, setIsAiChatOpen }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const slide = HERO_SLIDES[current];

  return (
    <div className="relative bg-zinc-950 overflow-hidden h-72 sm:h-96 w-full shadow-lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 flex items-center"
        >
          {/* Background overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/60 to-zinc-950/70 z-10" />
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover select-none"
          />

          {/* Floating Vibrant Sale Badge */}
          <div className="absolute right-12 bottom-12 z-20 w-24 h-24 sm:w-32 sm:h-32 bg-yellow-400 rounded-2xl rotate-12 flex flex-col items-center justify-center font-black text-red-600 text-sm sm:text-xl shadow-2xl border-4 border-white select-none animate-pulse hidden md:flex">
            <span className="text-[10px] tracking-widest text-red-600/80 uppercase font-black">MEGA</span>
            <span>১০০% খাঁটি</span>
          </div>

          {/* Banner content */}
          <div className="absolute inset-0 z-20 flex items-center px-4 sm:px-12 md:px-24">
            <div className={`p-6 sm:p-8 rounded-2xl bg-zinc-950/85 text-white max-w-lg shadow-2xl border border-white/20 backdrop-blur-md`}>
              <span className="inline-block text-[10px] font-black tracking-widest text-yellow-300 bg-yellow-300/10 px-2.5 py-1 rounded-full uppercase mb-3 border border-yellow-300/20">
                {slide.tag}
              </span>
              <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white mb-2 leading-tight">
                {language === 'en' ? slide.title : slide.titleBn}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-200 font-medium mb-4 sm:mb-6">
                {language === 'en' ? slide.subtitle : slide.subtitleBn}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAiChatOpen(true)}
                  className="bg-gradient-to-r from-red-600 to-zinc-950 hover:from-red-700 hover:to-zinc-900 border border-white/20 text-white font-black text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg transition hover:scale-103 active:scale-97 cursor-pointer flex items-center gap-1.5"
                >
                  {language === 'en' ? 'Ask Ghoroya AI' : 'ঘরোয়া এআই সহকারীকে জিজ্ঞেস করুন'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-35 flex gap-2">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === current ? 'w-6 bg-red-600' : 'w-2 bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* Nav Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-35 bg-zinc-950/90 hover:bg-red-600 text-white p-2 sm:p-3 rounded-full shadow-lg border border-zinc-800 hover:border-red-500 transition cursor-pointer"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-35 bg-zinc-950/90 hover:bg-red-600 text-white p-2 sm:p-3 rounded-full shadow-lg border border-zinc-800 hover:border-red-500 transition cursor-pointer"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
