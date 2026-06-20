/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User, Globe, Sparkles, ShoppingBag, Lock, Mic, Bell, Heart, Sun, Moon, Trash2, Check, RefreshCw, Truck } from 'lucide-react';
import { CartItem, Product } from '../types';

interface HeaderProps {
  language: 'en' | 'bn';
  setLanguage: (lang: 'en' | 'bn') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cart: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  setIsOrdersOpen: (open: boolean) => void;
  setIsAiChatOpen: (open: boolean) => void;
  onSellerOpen: () => void;
  onResellerOpen: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  products: Product[];
  onProductClick: (p: Product) => void;
  onWishlistOpen: () => void;
  wishlistLength: number;
  onSmartSearch: (query: string) => void;
  isSmartSearchLoading: boolean;
  onTrackOrderOpen: () => void;
}

export default function Header({
  language,
  setLanguage,
  searchQuery,
  setSearchQuery,
  cart,
  setIsCartOpen,
  setIsOrdersOpen,
  setIsAiChatOpen,
  onSellerOpen,
  onResellerOpen,
  isDarkMode,
  setIsDarkMode,
  products = [],
  onProductClick,
  onWishlistOpen,
  wishlistLength,
  onSmartSearch,
  isSmartSearchLoading,
  onTrackOrderOpen
}: HeaderProps) {
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Search History State
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ghoroya_search_history');
      return saved ? JSON.parse(saved) : ['Redmi Note 13', 'Saree', 'Polo Shirt', 'Anker Earbuds'];
    } catch {
      return ['Redmi Note 13', 'Saree', 'Polo Shirt', 'Anker Earbuds'];
    }
  });

  // Suggestion visibility state
  const [isFocused, setIsFocused] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Voice Search Simulation State
  const [isListening, setIsListening] = useState(false);
  const [voiceTimer, setVoiceTimer] = useState(3);

  // Notifications State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      title: '⚡ Flash Discount Alert!',
      titleBn: '⚡ ফ্ল্যাশ ডিসকাউন্ট অফার!',
      desc: 'Use voucher coupon code "EID60" for instant flat ৳60 discount on package deals.',
      descBn: 'যেকোনো কম্বো প্যাকেজে ফ্ল্যাট ৳৬০ ডিসকাউন্ট পেতে ব্যবহার করুন কুপন কোড "EID60"।',
      time: 'Just now',
      read: false,
      code: 'EID60'
    },
    {
      id: 'n2',
      title: '🚚 Free Shipping Campaign',
      titleBn: '🚚 ফ্রি শিপিং প্রচারণা',
      desc: 'Add products worth ৳1,000+ and apply coupon "FREESHIP" to waive courier costs.',
      descBn: '৳১,০০০ বা তার বেশি মূল্যের পণ্য অর্ডারে "FREESHIP" কুপন ব্যবহার করে ফ্রি ডেলিভারি নিন।',
      time: '1 hour ago',
      read: false,
      code: 'FREESHIP'
    },
    {
      id: 'n3',
      title: '🎉 Premium Fragrance Arrival',
      titleBn: '🎉 প্রিমিয়াম সুগন্ধি কালেকশন',
      desc: 'Organic premium Sandalwood-infused Attar is now available with Verified badges.',
      descBn: 'ক্যারাগরি অনুমোদিত খাঁটি চন্দন কাঠের আতর এখন স্টোরে এভেইলেবল হয়েছে।',
      time: '5 hours ago',
      read: true
    }
  ]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Clear search history item
  const removeHistoryItem = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    const updated = searchHistory.filter((h) => h !== item);
    setSearchHistory(updated);
    localStorage.setItem('ghoroya_search_history', JSON.stringify(updated));
  };

  // Add to Search History
  const addToHistory = (query: string) => {
    if (!query.trim()) return;
    const cleanQuery = query.trim();
    const updated = [cleanQuery, ...searchHistory.filter((h) => h !== cleanQuery)].slice(0, 6);
    setSearchHistory(updated);
    localStorage.setItem('ghoroya_search_history', JSON.stringify(updated));
  };

  // Select search suggestion
  const selectQuery = (query: string) => {
    setSearchQuery(query);
    addToHistory(query);
    setIsFocused(false);
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Voice Search actual & simulated logic
  const triggerVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = language === 'en' ? 'en-US' : 'bn-BD';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setIsListening(true);

        recognition.onstart = () => {
          console.log('Voice recognition active');
        };

        recognition.onresult = (event: any) => {
          const speechToText = event.results[0][0].transcript;
          if (speechToText) {
            setSearchQuery(speechToText);
            addToHistory(speechToText);
          }
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition fallback, error:', event.error);
          runSimulationFallback();
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch (err) {
        console.error('Failed to initialize speech recognition:', err);
        runSimulationFallback();
      }
    } else {
      // Browser does not support Speech recognition, run preview simulation
      runSimulationFallback();
    }
  };

  const runSimulationFallback = () => {
    setIsListening(true);
    setVoiceTimer(3);
    const phrases = language === 'en' ? [
      'Redmi Note 13 Pro 5G',
      'Anker Wireless Earbuds',
      'Cotton Polo Shirt',
      'Handloom Pure tant Saree',
      'Premium Organic Ghee',
      'Attar Ameer Al Oudh'
    ] : [
      'রেডমি নোট ১৩',
      'ইয়ারবাডস',
      'পোলো শার্ট',
      'তাঁতের শাড়ি',
      'খাঁটি ঘি',
      'আতর চন্দন'
    ];
    
    const interval = setInterval(() => {
      setVoiceTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsListening(false);
          const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
          setSearchQuery(randomPhrase);
          addToHistory(randomPhrase);
          return 3;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Live matching logic
  const filteredSuggestions = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.nameBn.includes(searchQuery) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const trendingItems = [
    { name: 'Redmi Note 13', nameBn: 'রেডমি নোট' },
    { name: 'Earbuds', nameBn: 'ইয়ারবাডস' },
    { name: 'Polo Shirt', nameBn: 'পোলো শার্ট' },
    { name: 'Saree', nameBn: 'শাড়ি' },
    { name: 'Attar', nameBn: 'আতর' },
    { name: 'Organic Ghee', nameBn: 'খাঁটি ঘি' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-zinc-950 text-white shadow-lg border-b-2 border-red-650">
      {/* Top Bar Banner Notification Option */}
      <div className="bg-zinc-900 text-xs py-2 px-4 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2 flex-wrap">
          <div className="flex gap-3 items-center flex-wrap">
            <span className="bg-red-600 hover:bg-red-750 text-white px-3 py-1 rounded-full font-black text-[11px] flex items-center gap-1.5 shadow-sm transition transform hover:scale-102">
              <span className="w-1.5 h-1.5 bg-white rounded-full inline-block animate-ping" />
              {language === 'en' ? 'Hotline:' : 'হটলাইন:'} ০১৫১৮৪৮৯০৮০
            </span>
            <span className="text-zinc-400 font-bold hidden xl:inline text-[11px]">
              {language === 'en' ? 'Call Support/Order Live!' : 'সরাসরি ফোন করে অর্ডার করতে পারেন'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Dark Mode Switcher */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              type="button"
              aria-label="Toggle dark mode"
              className="text-zinc-300 hover:text-white transition p-1 rounded-full hover:bg-zinc-800 cursor-pointer"
            >
              {isDarkMode ? <Sun size={15} className="text-yellow-400 animate-spin" style={{ animationDuration: '12s' }} /> : <Moon size={15} />}
            </button>
            
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              type="button"
              className="flex items-center gap-1 text-zinc-300 hover:text-white transition font-bold cursor-pointer"
            >
              <Globe size={13} />
              <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-zinc-950 px-4 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4">
          
          {/* Logo, Mobile Menu items */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setSearchQuery('')}>
              <div className="bg-white text-red-600 px-3.5 py-1.5 rounded-xl shadow-md font-black text-xl sm:text-2xl tracking-tighter flex items-center justify-center gap-1 border border-zinc-200">
                <span className="text-zinc-950 font-sans tracking-tight pr-0.5 font-black">ঘরোয়া</span>
                <span className="text-white font-sans tracking-tight font-black bg-red-650 px-1.5 py-0.5 rounded-lg text-sm sm:text-base leading-tight">বাজার</span>
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-full hidden sm:block">
                {language === 'en' ? '.com' : 'ডট কম'}
              </span>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-3 md:hidden">
              <button
                onClick={onWishlistOpen}
                type="button"
                className="p-2 relative bg-zinc-800 rounded-full hover:bg-zinc-700 text-pink-500 transition"
              >
                <Heart size={18} className={wishlistLength > 0 ? 'fill-pink-500' : ''} />
                {wishlistLength > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-zinc-950">
                    {wishlistLength}
                  </span>
                )}
              </button>
              
              <button
                onClick={onTrackOrderOpen}
                type="button"
                className="p-2 relative bg-zinc-800 rounded-full hover:bg-zinc-700 text-red-500 transition cursor-pointer"
                title={language === 'en' ? 'Track Order' : 'অর্ডার ট্র্যাকিং'}
              >
                <Truck size={18} className="animate-pulse" />
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                type="button"
                className="p-2 relative bg-zinc-800 rounded-full hover:bg-zinc-700 text-white transition scale-100"
              >
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-zinc-950">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Box + Autocomplete Suggestions Dropdown */}
          <div ref={suggestionRef} className="flex-1 w-full relative">
            <div className="relative">
              <input
                type="text"
                placeholder={language === 'en' ? 'Search in Ghoroya Bazar...' : 'ঘরোয়া বাজারে খুঁজুন...'}
                value={searchQuery}
                onFocus={() => setIsFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addToHistory(searchQuery);
                    setIsFocused(false);
                  }
                }}
                className="w-full bg-white text-zinc-900 pl-11 pr-12 py-3 rounded-full text-xs sm:text-sm shadow-inner outline-none focus:ring-2 focus:ring-red-600 border border-transparent transition font-semibold"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                <Search size={18} />
              </div>

              {/* Voice Microphone Icon */}
              <button
                onClick={triggerVoiceSearch}
                type="button"
                title={language === 'en' ? 'Voice Search' : 'ভয়েস সার্চ'}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-red-600 transition p-1.5 rounded-full hover:bg-zinc-100"
              >
                <Mic size={16} className={isListening ? 'text-red-600 animate-ping' : ''} />
              </button>
            </div>

            {/* Suggestions, Search History & Trending Popover Menu */}
            {isFocused && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden z-50 text-zinc-800 p-4 space-y-4 max-h-[480px] overflow-y-auto">
                
                {/* AI Smart Search Option banner */}
                {searchQuery.trim() && (
                  <button
                    onClick={() => {
                      addToHistory(searchQuery);
                      setIsFocused(false);
                      onSmartSearch(searchQuery);
                    }}
                    disabled={isSmartSearchLoading}
                    type="button"
                    className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-zinc-900 to-zinc-950 hover:from-zinc-900 hover:to-red-950/80 text-white rounded-2xl border border-zinc-800 transition text-left cursor-pointer shadow-md select-none"
                  >
                    <div className="bg-red-650 p-2 rounded-xl text-white shrink-0">
                      {isSmartSearchLoading ? (
                        <RefreshCw size={14} className="animate-spin text-white" />
                      ) : (
                        <Sparkles size={14} className="animate-pulse text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-white flex items-center gap-1">
                        {language === 'en' ? 'Ghoroya Smart AI Search' : 'ঘরোয়া এআই স্মার্ট খোঁজ'}
                        <span className="bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase leading-none">AI</span>
                      </p>
                      <p className="text-[10px] text-zinc-400 font-bold truncate">
                        {language === 'en' ? `Search with Gemini for "${searchQuery}"` : `জেমিনি এআই দিয়ে "${searchQuery}" এর সামগ্রিক সার্চ করুন`}
                      </p>
                    </div>
                    <span className="text-[10px] font-extrabold bg-zinc-800 hover:bg-zinc-750 text-zinc-200 px-3 py-1 rounded-full uppercase shrink-0 border border-zinc-700">
                      {language === 'en' ? 'Run' : 'খুঁজুন'}
                    </span>
                  </button>
                )}

                {/* 1. Live product matching suggestions */}
                {searchQuery.trim() && (
                  <div>
                    <h5 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 border-b pb-1">
                      {language === 'en' ? 'Live Suggestions' : 'সরাসরি মিল পাওয়া গেছে'}
                    </h5>
                    {filteredSuggestions.length === 0 ? (
                      <p className="text-xs text-zinc-500 italic py-1">
                        {language === 'en' ? 'No quick matches. Press Enter to search.' : 'কোনো দ্রুত ফলাফল নেই। এন্টার চেপে সামগ্রিক সার্চ করুন।'}
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {filteredSuggestions.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              onProductClick(p);
                              setIsFocused(false);
                            }}
                            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-50 border border-transparent hover:border-zinc-150 transition text-left cursor-pointer"
                          >
                            <img src={p.image} alt={p.name} className="w-9 h-9 object-cover rounded-lg bg-zinc-100" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-zinc-800 truncate">
                                {language === 'en' ? p.name : p.nameBn}
                              </p>
                              <p className="text-[10px] font-black text-orange-600">
                                ৳{p.price.toLocaleString()}
                              </p>
                            </div>
                            <span className="text-[9px] font-black bg-zinc-100 text-zinc-550 px-1.5 py-0.5 rounded">
                              {language === 'en' ? p.category : p.categoryBn}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Trending Searches Quick Clicks */}
                <div>
                  <h5 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 border-b pb-1">
                    {language === 'en' ? 'Trending on Ghoroya Bazar' : 'জনপ্রিয় অনুসন্ধান সমূহ'}
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {trendingItems.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => selectQuery(item.name)}
                        type="button"
                        className="text-[11px] font-extrabold bg-[#FFF0EB] hover:bg-red-50 border border-[#F6B4CD]/40 text-red-650 px-3 py-1.5 rounded-full transition cursor-pointer"
                      >
                        🔥 {language === 'en' ? item.name : item.nameBn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Locally Cached Search History Log */}
                {searchHistory.length > 0 && (
                  <div>
                    <h5 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 border-b pb-1">
                      {language === 'en' ? 'My Search History' : 'আমার অনুসন্ধান ইতিহাস'}
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {searchHistory.map((query) => (
                        <div
                          key={query}
                          className="flex items-center gap-1.5 bg-zinc-100 border border-zinc-200 pl-3 pr-2 py-1 rounded-full text-xs font-bold"
                        >
                          <button
                            onClick={() => selectQuery(query)}
                            type="button"
                            className="text-zinc-700 hover:text-red-600 transition cursor-pointer"
                          >
                            {query}
                          </button>
                          <button
                            onClick={(e) => removeHistoryItem(e, query)}
                            type="button"
                            className="text-zinc-400 hover:text-red-600 p-0.5 rounded-full hover:bg-zinc-200 transition cursor-pointer"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>

          {/* Desktop Shortcuts - Icons Tray */}
          <div className="hidden md:flex items-center gap-5">
            {/* Wishlist Shortcut Button */}
            <button
              onClick={onWishlistOpen}
              type="button"
              className="flex items-center gap-1.5 text-zinc-100 hover:text-pink-400 transition font-black text-sm relative p-2 rounded-xl hover:bg-zinc-900 cursor-pointer"
            >
              <Heart size={18} className={wishlistLength > 0 ? 'text-pink-500 fill-pink-500' : 'text-zinc-200'} />
              <span>{language === 'en' ? 'Wishlist' : 'পছন্দের তালিকা'}</span>
              {wishlistLength > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white font-black text-[9px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-zinc-950 animate-bounce">
                  {wishlistLength}
                </span>
              )}
            </button>

            {/* Notification Bell Menu Button */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                type="button"
                className="relative p-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full transition flex items-center justify-center shadow-md cursor-pointer border border-zinc-700"
              >
                <Bell size={18} className="text-yellow-400 animate-pulse" />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-zinc-950">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </button>

              {/* Ringing Notification Dropdown Panel */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 bg-white border border-zinc-200 rounded-2xl shadow-2xl w-80 overflow-hidden z-50 text-zinc-800 p-3 space-y-2">
                  <div className="flex items-center justify-between border-b pb-2 mb-2">
                    <span className="font-extrabold text-xs text-zinc-900 flex items-center gap-1">
                      🔔 {language === 'en' ? 'Live Notifications' : 'লাইভ নির্দেশিকা ও ঘোষণা'}
                    </span>
                    <button
                      onClick={() => {
                        setNotifications(notifications.map((n) => ({ ...n, read: true })));
                      }}
                      type="button"
                      className="text-[10px] font-black text-red-650 hover:underline"
                    >
                      {language === 'en' ? 'Mark all read' : 'সব পঠিত চিহ্নিত করুন'}
                    </button>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto divide-y divide-zinc-100">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-2.5 rounded-xl transition text-[11px] font-medium leading-relaxed pt-3 ${
                          notif.read ? 'bg-white opacity-70' : 'bg-red-50/60 border border-red-100/50'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-1 pb-1">
                          <h6 className="font-extrabold text-zinc-900">
                            {language === 'en' ? notif.title : notif.titleBn}
                          </h6>
                          <span className="text-[9px] font-semibold text-zinc-400 select-none flex-shrink-0">
                            {notif.time}
                          </span>
                        </div>
                        <p className="text-zinc-650 font-medium">
                          {language === 'en' ? notif.desc : notif.descBn}
                        </p>
                        
                        {notif.code && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className="bg-zinc-100 font-mono text-[10px] font-black text-red-650 px-2 py-0.5 rounded border border-zinc-200">
                              {notif.code}
                            </span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(notif.code!);
                                setCopiedCode(notif.code!);
                                setTimeout(() => setCopiedCode(null), 2000);
                              }}
                              type="button"
                              className="text-[9px] font-black text-red-650 hover:underline flex items-center gap-1"
                            >
                              {copiedCode === notif.code ? (
                                <span className="text-emerald-600 font-bold">✓ Copied</span>
                              ) : (
                                <span>Copy Code</span>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reseller Hub Button */}
            <button
              onClick={onResellerOpen}
              type="button"
              className="flex items-center gap-1.5 text-zinc-100 hover:text-orange-500 transition font-black text-sm"
            >
              <Sparkles size={16} className="text-orange-500 animate-pulse animate-bounce" style={{ animationDuration: '4s' }} />
              <span>
                {language === 'en' ? 'Reseller Portal' : 'রিসেলার পোর্টাল'}
              </span>
            </button>

            {/* AI Help Assistant Button */}
            <button
              onClick={() => setIsAiChatOpen(true)}
              type="button"
              className="flex items-center gap-1.5 text-zinc-100 hover:text-yellow-400 transition font-black text-sm cursor-pointer"
            >
              <Sparkles size={16} className="text-yellow-400 animate-pulse" />
              <span>
                {language === 'en' ? 'AI Help' : 'এআই হেল্প'}
              </span>
            </button>

            {/* Track Order Button */}
            <button
              onClick={onTrackOrderOpen}
              type="button"
              className="flex items-center gap-1.5 text-zinc-100 hover:text-red-500 transition font-black text-sm cursor-pointer"
            >
              <Truck size={18} className="text-red-500 animate-pulse" />
              <span>
                {language === 'en' ? 'Track Order' : 'অর্ডার ট্র্যাকিং'}
              </span>
            </button>

            {/* My Orders / Profile Button */}
            <button
              onClick={() => setIsOrdersOpen(true)}
              type="button"
              className="flex items-center gap-2 text-zinc-100 hover:text-white transition font-black text-sm"
            >
              <User size={18} className="text-red-500 animate-bounce" style={{ animationDuration: '6s' }} />
              <span>
                {language === 'en' ? 'My Profile' : 'বিলিং প্রোফাইল'}
              </span>
            </button>

            {/* Sticky Cart Icon badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              type="button"
              className="relative p-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-full transition flex items-center justify-center shadow-md cursor-pointer text-white border border-zinc-700"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-650 text-white font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-zinc-950 animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
          
        </div>
      </div>

      {/* Voice Search active recording animation overlay */}
      {isListening && (
        <div className="fixed inset-0 bg-black/85 flex flex-col items-center justify-center z-55 animate-fade-in backdrop-blur-xs text-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[36px] max-w-sm w-full space-y-6 flex flex-col items-center shadow-2xl">
            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-white relative shadow-lg shadow-red-600/30">
              <span className="absolute inset-x-0 inset-y-0 rounded-full bg-red-600 animate-ping opacity-75" />
              <Mic size={36} className="relative z-10 animate-bounce" />
            </div>
            
            <div className="space-y-2">
              <h4 className="text-lg font-black tracking-tight text-white animate-pulse">
                {language === 'en' ? 'Listening Speak Now...' : 'শুনছি, আপনার অনুরোধটি বলুন...'}
              </h4>
              <p className="text-xs text-zinc-400 font-medium">
                {language === 'en' ? 'Simulating speech to text' : 'আপনার ভয়েস বিশ্লেষণ করা হচ্ছে'}
              </p>
            </div>

            {/* Soundwaves indicator */}
            <div className="flex justify-center items-center gap-1.5 h-6">
              <span className="w-1.5 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="w-1.5 h-5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <span className="w-1.5 h-6 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="w-1.5 h-4 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
              <span className="w-1.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
            </div>

            <div className="text-[10px] text-zinc-500 font-extrabold max-w-[200px] leading-relaxed">
              {language === 'en' ? 'Recognizing query in: ' : 'সার্চ কোয়েরি নির্ধারণ করবে: '}{voiceTimer}s
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
