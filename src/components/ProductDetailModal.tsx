import React, { useState, useEffect } from 'react';
import { 
  Star, X, Plus, Minus, Truck, ShieldCheck, Heart, ShoppingBag, Eye, DollarSign, Gift, 
  Minimize, Maximize2, Sparkles, ThumbsUp, Clock, Lock, CheckCircle2, AlertTriangle, AlertCircle,
  Copy, Check, Download
} from 'lucide-react';
import { Product } from '../types';
import TrustFeatures from './TrustFeatures';
import AIRecommendationsList from './AIRecommendationsList';

interface ProductDetailModalProps {
  product: Product;
  language: 'en' | 'bn';
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, color?: string, size?: string) => void;
  onBuyNow: (product: Product, quantity: number, color?: string, size?: string) => void;
  allProducts: Product[];
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
}

export default function ProductDetailModal({
  product,
  language,
  onClose,
  onAddToCart,
  onBuyNow,
  allProducts = [],
  wishlist = [],
  onToggleWishlist
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  
  // Carousel active image state
  const [activeImage, setActiveImage] = useState(product.image);
  const [copiedField, setCopiedField] = useState('');

  // AI Post Generator States
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState<{ facebook: string; whatsapp: string; story: string } | null>(null);
  const [activePostTab, setActivePostTab] = useState<'facebook' | 'whatsapp' | 'story'>('facebook');
  const [copiedPostType, setCopiedPostType] = useState<string>('');

  const generateAIPost = async () => {
    setIsGeneratingPost(true);
    try {
      const response = await fetch('/api/gemini/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, language })
      });
      if (!response.ok) throw new Error('API failed');
      const data = await response.json();
      setGeneratedPosts(data);
    } catch (err) {
      console.error(err);
      const pName = language === 'en' ? product.name : product.nameBn;
      setGeneratedPosts({
        facebook: `🛒 আজকের অফার!\n\n🔥 ${pName}\n📌 কোড: #${product.code || product.id}\n\n💰 মূল্য: ৳${product.price}\n🚚 হোম ডেলিভারি / সারাদেশে ক্যাশ অন ডেলিভারি সুবিধা!\n\nঅর্ডার করতে এখনই ইনবক্স করুন।`,
        whatsapp: `🛒 আজকের অফার!\n\n🔥 *${pName}*\n💰 মূল্য: ৳${product.price}\n🚚 হোম ডেলিভারি\n\nঅর্ডার করতে ইনবক্স করুন।`,
        story: `✨ আজকের স্পেশাল মেগা ডিল! ✨\n\n📌 ${pName}\n💰 মূল্য: মাত্র ৳${product.price}\n🚚 হোম ডেলিভারি\n\nঅর্ডার করতে এখনই ইনবক্স করুন! 💥`
      });
    } finally {
      setIsGeneratingPost(false);
    }
  };

  const handleImageDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl, { mode: 'cors' });
      if (!response.ok) throw new Error('Network issue');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `ghoroya-${product.code || product.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      // Direct anchor tag click if fetch fails due to cross-origin issues
      const link = document.createElement('a');
      link.href = imageUrl;
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.download = `ghoroya-${product.code || product.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Zoom offset states
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center center', transform: 'scale(1)' });

  // High-fidelity local states
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | 'all'>('all');
  const [isComboChecked, setIsComboChecked] = useState(true);
  const [helpfulCount, setHelpfulCount] = useState<Record<string, number>>({ r1: 14, r2: 8, r3: 4 });
  const [helpfulClicked, setHelpfulClicked] = useState<Record<string, boolean>>({});

  // Helpfulness toggle vote
  const handleVoteHelpful = (reviewId: string) => {
    if (helpfulClicked[reviewId]) return;
    setHelpfulClicked(prev => ({ ...prev, [reviewId]: true }));
    setHelpfulCount(prev => ({ ...prev, [reviewId]: (prev[reviewId] || 0) + 1 }));
  };

  // Reviews State - local array initialized with default mocks
  const [localReviews, setLocalReviews] = useState([
    {
      id: 'r1',
      name: 'Rahat Islam',
      rating: 5,
      date: '2026-05-12',
      comment: 'দারুণ প্রোডাক্ট! অরিজিনাল জিনিস দেওয়ার জন্য ধন্যবাদ ঘরোয়া বাজার। কোয়ালিটি অত্যন্ত প্রিমিয়াম।',
      commentEn: 'Amazing product! Extremely premium build quality. Thank you Ghoroya Bazar!'
    },
    {
      id: 'r2',
      name: 'Nusrat Jahan',
      rating: 4,
      date: '2026-05-24',
      comment: 'খুবই দ্রুত ডেলিভারি পেয়েছি। মাত্র ২ দিন লেগেছে। কাপড়ের ফিনিশিং অনেক ভালো।',
      commentEn: 'Got it very fast! Finished beautifully and fits perfectly.'
    },
    {
      id: 'r3',
      name: 'Mehedi Hasan',
      rating: 5,
      date: '2026-06-02',
      comment: 'Perfect specifications as described. Sound crisp and battery last long. Value for money!',
      commentEn: 'Perfect specifications as described. Sound crisp and battery last long. Value for money!'
    }
  ]);

  // Review Input Form states
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Sync active image with product changes
  useEffect(() => {
    setActiveImage(product.image);
    setQuantity(1);
    setReviewSuccess(false);
  }, [product]);

  // Multiple product images list fallback
  const imageList = product.images && product.images.length > 0
    ? product.images
    : [product.image, product.image, product.image].map((img, idx) => {
        // Just mock variations if only 1 image exists, for visual variety
        if (idx === 0) return img;
        if (idx === 1) return img.replace('?', '?v=2') || img;
        return img.replace('?', '?v=3') || img;
      });

  // Calculate colors and sizes
  const colors = product.specifications.Colors
    ? product.specifications.Colors.split(',').map((c) => c.trim())
    : ['Standard', 'Matte Black', 'Classic Silver'];

  const sizes = product.specifications.Sizes
    ? ['S', 'M', 'L', 'XL']
    : product.id.startsWith('fa')
    ? ['S', 'M', 'L', 'XL']
    : ['Standard Fit'];

  useEffect(() => {
    if (colors.length > 0) {
      setSelectedColor(colors[0]);
    }
    if (sizes.length > 0) {
      setSelectedSize(sizes[0]);
    }
  }, [product]);

  // Related products selection
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  // Frequently bought together bundle
  const comboProduct = allProducts.find((p) => p.category === product.category && p.id !== product.id)
    || allProducts.find((p) => p.id !== product.id);

  // Interactive zoom handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.75)'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: 'center center',
      transform: 'scale(1)'
    });
  };

  const incrementQty = () => {
    if (quantity < product.stock) {
      setQuantity((q) => q + 1);
    }
  };

  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;

    const newReview = {
      id: `rev-${Date.now()}`,
      name: reviewName,
      rating: reviewRating,
      date: new Date().toISOString().split('T')[0],
      comment: reviewComment,
      commentEn: reviewComment
    };

    setLocalReviews([newReview, ...localReviews]);
    setReviewName('');
    setReviewComment('');
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 5000);
  };

  // Bundle Add to Cart execution
  const handleAddComboToCart = () => {
    if (isComboChecked && comboProduct) {
      onAddToCart(product, 1, selectedColor, selectedSize);
      onAddToCart(comboProduct, 1);
    } else {
      onAddToCart(product, 1, selectedColor, selectedSize);
    }
  };

  const isLiked = wishlist.includes(product.id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 flex items-center justify-center p-2 sm:p-4 backdrop-blur-xs">
      <div className="relative bg-white dark:bg-zinc-900 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[92vh] border dark:border-zinc-800 animate-fade-in">
        
        {/* Head tab layout */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 bg-zinc-100 dark:bg-zinc-800 hover:bg-orange-500 hover:text-white text-zinc-650 dark:text-zinc-450 p-2.5 rounded-full transition cursor-pointer shadow-sm"
        >
          <X size={18} />
        </button>

        {/* Modal Scroll Container */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-1 space-y-8 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            
            {/* Gallery Column */}
            <div className="md:col-span-5 flex flex-col gap-4">
              {/* Zoom container frame */}
              <div 
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-850 flex items-center justify-center overflow-hidden aspect-square cursor-zoom-in group"
              >
                <img 
                  src={activeImage || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=60'} 
                  alt={language === 'en' ? product.name : product.nameBn} 
                  style={zoomStyle}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-75 ease-out"
                  onError={(e) => {
                    (e.target as HTMLImageElement).onerror = null;
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=60';
                  }}
                />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="bg-zinc-900/75 dark:bg-zinc-950/85 text-white text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full pointer-events-none shadow">
                    🔍 {language === 'en' ? 'Hover to Zoom' : 'মাউস ধরলে জুম'}
                  </span>
                  <button
                    onClick={() => setIsLightboxOpen(true)}
                    type="button"
                    className="bg-white/95 dark:bg-zinc-800 text-zinc-805 dark:text-zinc-100 hover:bg-orange-500 hover:text-white p-1.5 rounded-full shadow transition-all duration-150 flex items-center justify-center cursor-pointer border dark:border-zinc-700"
                    title={language === 'en' ? 'Open High-Res Fullscreen' : 'ফুলস্ক্রিন ভিউ'}
                  >
                    <Maximize2 size={12} className="font-extrabold" />
                  </button>
                </div>

                {/* Wishlist toggle anchor */}
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  type="button"
                  title={language === 'en' ? 'Save to wishlist' : 'পছন্দের তালিকায় রাখুন'}
                  className={`absolute bottom-4 right-4 p-3 rounded-full shadow-lg border backdrop-blur-md cursor-pointer transition transform hover:scale-110 active:scale-95 ${
                    isLiked
                      ? 'bg-pink-500 text-white border-pink-500'
                      : 'bg-white/80 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-350 border-zinc-200 dark:border-zinc-700 hover:text-pink-500'
                  }`}
                >
                  <Heart size={20} className={isLiked ? 'fill-white' : ''} />
                </button>
              </div>

              {/* Multi-image thumbnail list switcher */}
              <div className="grid grid-cols-4 gap-2">
                {imageList.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    onClick={() => setActiveImage(img)}
                    type="button"
                    className={`aspect-square rounded-xl overflow-hidden border bg-zinc-50 dark:bg-zinc-800 transition ${
                      activeImage === img
                        ? 'border-orange-500 ring-2 ring-orange-500/20 scale-102 shadow-sm'
                        : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                    }`}
                  >
                    <img 
                      src={img || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=60'} 
                      alt="" 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).onerror = null;
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=60';
                      }}
                    />
                  </button>
                ))}
              </div>

              {/* Security Delivery Assurance perks */}
              <div className="bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800/90 p-4 rounded-2xl space-y-3.5 animate-fade-in">
                <div className="flex items-start gap-3">
                  <Truck size={18} className="text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-extrabold text-xs text-zinc-805 dark:text-zinc-205">
                      {language === 'en' ? 'Standard Delivery' : 'স্ট্যান্ডার্ড হোম ডেলিভারি'}
                    </h5>
                    <p className="text-[11px] text-zinc-550 dark:text-zinc-405 leading-tight mt-0.5 font-medium">
                      {language === 'en' ? 'Fast courier within 2-4 days. Free shipping eligibility on combined checkout.' : 'সারাদেশে ২-৪ দিনের মধ্যে ফাস্ট কুরিয়ার ডেলিভারি। ফ্রি শিপিং কুপন প্রযোজ্য।'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-extrabold text-xs text-zinc-805 dark:text-zinc-205">
                      {language === 'en' ? 'Genuine Ghoroya Warranty' : '১০০% ক্যাশব্যাক আসল গ্যারান্টি'}
                    </h5>
                    <p className="text-[11px] text-zinc-550 dark:text-zinc-405 leading-tight mt-0.5 font-medium">
                      {language === 'en' ? 'Return any item within 7 days. Verified premium seal authorized.' : 'পণ্য পাওয়ার ৭ দিনের মধ্যে যেকোনো সমস্যায় সম্পূর্ণ ফেরতযোগ্য গ্যারান্টি।'}
                    </p>
                  </div>
                </div>

                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3.5 space-y-1.5">
                  <p className="text-[10px] font-black uppercase tracking-wider text-zinc-405 dark:text-zinc-500 select-none">
                    🛡️ {language === 'en' ? 'Trust Certifications' : 'ট্রাস্ট ভেরিফিকেশন (ক্লিক করুন)'}
                  </p>
                  <TrustFeatures language={language} layout="compact" />
                </div>
              </div>
            </div>

            {/* Selection info details Column */}
            <div className="md:col-span-7 flex flex-col gap-5">
              <div>
                <span className="text-[10px] font-black text-orange-655 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 border border-orange-200/50 dark:border-orange-850/60 px-3 py-1 rounded-full uppercase mb-2 inline-block">
                  🔥 {language === 'en' ? product.category : product.categoryBn}
                </span>
                {product.code && (
                  <span className="text-[10px] font-mono font-black text-indigo-650 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-850/60 px-3 py-1 rounded-full uppercase mb-2 inline-block ml-2 select-none">
                    📦 {language === 'en' ? `Code: ${product.code}` : `কোড: ${product.code}`}
                  </span>
                )}

                <h3 className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight leading-snug">
                  {language === 'en' ? product.name : product.nameBn}
                </h3>

                {/* Ratings stars counts */}
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <div className="flex items-center gap-1 bg-yellow-400/10 text-orange-600 dark:text-orange-450 px-2.5 py-0.5 rounded-lg text-xs font-black">
                    <Star size={12} className="fill-yellow-400 text-yellow-400 hover:scale-110 transition" style={{ transitionDuration: '100ms' }} />
                    <span>{product.rating}</span>
                  </div>
                  <span className="text-zinc-350 dark:text-zinc-700">|</span>
                  <span className="text-xs text-zinc-550 dark:text-zinc-400 font-extrabold select-none">
                    {language === 'en' ? `${localReviews.length} Verified Reviews` : `${localReviews.length} ভেরিফাইড মতামত`}
                  </span>
                  <span className="text-zinc-350 dark:text-zinc-700">|</span>
                  <span className="text-xs text-zinc-550 dark:text-zinc-405 font-extrabold text-indigo-650 dark:text-indigo-400">
                    {language === 'en' ? `${product.soldCount}+ Orders Completed` : `${product.soldCount}+ ডেলিভারি সম্পন্ন`}
                  </span>
                </div>

                {/* Specifications Key Highlights pills */}
                <div className="flex flex-wrap gap-2 mt-3.5 text-[11px] font-bold">
                  {Object.entries(language === 'en' ? product.specifications : product.specificationsBn).slice(0, 3).map(([key, val]) => (
                    <span 
                      key={key} 
                      className="bg-zinc-50 dark:bg-zinc-850/50 border border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-350 px-2.5 py-1 rounded-lg flex items-center gap-1.5 uppercase text-[10px] shadow-2xs font-extrabold select-none hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                    >
                      <span className="text-orange-500 dark:text-orange-400 font-black">{key}:</span>
                      <span className="text-zinc-800 dark:text-zinc-250 normal-case">{val}</span>
                    </span>
                  ))}
                  <span className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200/50 dark:border-orange-850/40 text-orange-655 dark:text-orange-400 px-2.5 py-1 rounded-lg flex items-center gap-1.5 uppercase text-[10px] font-black cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-950/40 transition select-none">
                    ✨ {language === 'en' ? 'Quality Verified' : 'যাচাইকৃত পণ্য'}
                  </span>
                </div>
              </div>

               {/* Pricing banner details */}
              <div className="bg-[#FFF0EB] dark:bg-zinc-850/65 border border-[#F6B4CD]/35 dark:border-zinc-800 p-4.5 rounded-2xl flex items-baseline justify-between flex-wrap gap-4">
                <div>
                  {localStorage.getItem('ghoroya_reseller_role') === 'reseller' && product.resellerPrice !== undefined ? (
                    <div>
                      {/* Green Reseller Price ON TOP */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-[11px] font-black uppercase text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                          {language === 'en' ? 'Reseller Price' : 'রিসেলার রেট'}
                        </span>
                        <span className="text-2xl sm:text-3.5xl font-black text-emerald-650 dark:text-emerald-400">
                          ৳{product.resellerPrice.toLocaleString()}
                        </span>
                      </div>
                      
                      {/* Customer Price Below */}
                      <div className="flex items-baseline gap-2 text-zinc-500 dark:text-zinc-400">
                        <span className="text-xs font-bold">{language === 'en' ? 'Customer Price: ' : 'কাস্টমার রেট: '}</span>
                        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">৳{product.price.toLocaleString()}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-zinc-405 dark:text-zinc-500 line-through text-xs">
                            ৳{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Estimated profit margin highlight */}
                      <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 mt-2 block bg-emerald-500/5 dark:bg-emerald-500/10 px-2.5 py-1 rounded inline-block">
                        {language === 'en' 
                          ? `Estimated Margin: ৳${(product.price - product.resellerPrice).toLocaleString()} (Gain 100% markup)` 
                          : `রিসেলার প্রফিট মার্জিন: ৳${(product.price - product.resellerPrice).toLocaleString()} (১০০% প্রফিট মার্জিন)`}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-2xl sm:text-3.5xl font-black text-red-650 dark:text-red-400">
                          ৳{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-zinc-405 dark:text-zinc-500 line-through text-xs sm:text-sm font-semibold">
                            ৳{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {product.discount > 0 && (
                        <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
                          {language === 'en' ? `Save ৳${(product.originalPrice - product.price).toLocaleString()} (${product.discount}% Discount)` : `৳${(product.originalPrice - product.price).toLocaleString()} সাশ্রয় (${product.discount}% অফ)`}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="text-right flex flex-col items-end gap-1.5">
                  <span className={`font-black text-[11px] px-3.5 py-1.5 rounded-full uppercase flex items-center gap-1.5 ${
                    product.stock > 10 
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-250 dark:border-emerald-800' 
                      : product.stock > 0 
                      ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-250 dark:border-amber-800 animate-pulse' 
                      : 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-250 dark:border-red-800'
                  }`}>
                    {product.stock > 0 ? (
                      <>
                        <CheckCircle2 size={12} className="text-emerald-550 dark:text-emerald-400" />
                        <span>
                          {language === 'en'
                            ? `In Stock (${product.stock} items)`
                            : `স্টক এভেইলেবল (${product.stock} টি)`}
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={12} className="text-red-500 dark:text-red-400" />
                        <span>{language === 'en' ? 'Sold Out' : 'স্টকে নেই'}</span>
                      </>
                    )}
                  </span>
                  {product.stock > 0 && (
                    <div className="w-28 sm:w-36 bg-zinc-200/55 dark:bg-zinc-800 h-1 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          product.stock > 25 ? 'bg-emerald-500' : product.stock > 10 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* HIGHLY GLOWING SPARKLING FAST ORDER BUTTON - STREAMLINED COURIER CONVERSION */}
              {product.stock > 0 && (
                <div className="my-3 select-none">
                  <button
                    onClick={() => onBuyNow(product, quantity, selectedColor, selectedSize)}
                    type="button"
                    className="w-full py-4.5 bg-gradient-to-r from-red-650 via-amber-600 to-red-650 text-white rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(220,38,38,0.7)] hover:shadow-[0_0_30px_rgba(220,38,38,0.95)] border-2 border-white/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2.5 animate-pulse"
                  >
                    <ShoppingBag size={18} className="animate-bounce" style={{ animationDuration: '1.2s' }} />
                    <span className="font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.65)]">
                      {language === 'en' ? '👉 ORDER NOW (DELIVERY ALL OVER BD)' : '👉 এখনই অর্ডার করুন (সারাদেশে হোম ডেলিভারি)'}
                    </span>
                  </button>
                </div>
              )}

              {/* Live dispatch countdown timer widget */}
              {product.stock > 0 && (
                <div className="bg-orange-50/70 dark:bg-zinc-850/40 border border-orange-200/60 dark:border-zinc-800 p-3 rounded-xl flex items-center justify-between text-[11px] text-zinc-700 dark:text-zinc-350 gap-3">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-orange-500 animate-spin-slow" />
                    <span>
                      {language === 'en' 
                        ? 'Fast Dispatch Priority Schedule:' 
                        : 'দ্রুত শিপিং শিডিউল ও ডেলিভারি:'}
                    </span>
                  </div>
                  <div className="bg-white dark:bg-zinc-900 px-2.5 py-1 rounded-lg border border-orange-200/40 dark:border-zinc-800 text-[10px] text-right">
                    <span className="text-red-650 dark:text-red-400 font-extrabold animate-pulse">
                      ⏳ {language === 'en' ? 'Order within 3 hrs 15 mins' : '৩ ঘণ্টা ১৫ মিনিটের মধ্যে অর্ডার করুন'}
                    </span>
                    <span className="text-zinc-500 dark:text-zinc-450">
                      {' '}— {language === 'en' ? 'Ships Today!' : 'আজই পাঠানো হবে!'}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-extrabold text-xs text-zinc-800 dark:text-zinc-200 uppercase tracking-wider mb-1.5">
                  {language === 'en' ? 'Product Description' : 'পণ্যের অফিশিয়াল বিবরণ'}
                </h4>
                <p className="text-xs sm:text-sm text-zinc-650 dark:text-zinc-400 leading-relaxed font-medium">
                  {language === 'en' ? product.description : product.descriptionBn}
                </p>
              </div>

              {/* Reseller Toolkit - Dynamic Downloader and Copier */}
              {localStorage.getItem('ghoroya_reseller_role') === 'reseller' && (
                <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border-2 border-dashed border-emerald-500/30 rounded-2xl p-4.5 mt-2 space-y-3.5">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-extrabold text-xs sm:text-sm">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>{language === 'en' ? '👨‍💻 Specially for Resellers: Copy / Download Hub' : '👨‍💻 বিশেষ রিসেলার টুলকিট - ওয়ান ক্লিক কপি ও ডাউনলোড'}</span>
                  </div>

                  {/* Copy buttons row */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        const nameToCopy = language === 'en' ? product.name : product.nameBn;
                        navigator.clipboard.writeText(nameToCopy);
                        setCopiedField('name');
                        setTimeout(() => setCopiedField(''), 1500);
                      }}
                      className="px-2.5 py-2 bg-white dark:bg-zinc-800 border border-zinc-250 dark:border-zinc-700 hover:border-emerald-500 text-zinc-700 dark:text-zinc-200 hover:text-emerald-600 rounded-xl text-[10px] sm:text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs"
                    >
                      {copiedField === 'name' ? (
                        <>
                          <Check size={13} className="text-emerald-600" />
                          <span>{language === 'en' ? 'Name Copied!' : 'নাম কপি হয়েছে!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>{language === 'en' ? 'Copy Item Name' : 'নাম কপি করুন'}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const descriptionToCopy = language === 'en' ? product.description : product.descriptionBn;
                        navigator.clipboard.writeText(descriptionToCopy);
                        setCopiedField('desc');
                        setTimeout(() => setCopiedField(''), 1500);
                      }}
                      className="px-2.5 py-2 bg-white dark:bg-zinc-800 border border-zinc-250 dark:border-zinc-700 hover:border-emerald-500 text-zinc-700 dark:text-zinc-200 hover:text-emerald-600 rounded-xl text-[10px] sm:text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs"
                    >
                      {copiedField === 'desc' ? (
                        <>
                          <Check size={13} className="text-emerald-600" />
                          <span>{language === 'en' ? 'Details Copied!' : 'বিবরণ কপি হয়েছে!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>{language === 'en' ? 'Copy Details' : 'বিবরণ কপি করুন'}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const comboText = `📦 ${language === 'en' ? 'Product Name:' : 'পণ্যের নাম:'} ${language === 'en' ? product.name : product.nameBn}
${language === 'en' ? 'Code:' : 'প্রোডাক্ট কোড:'} #${product.code || product.id}
${language === 'en' ? 'Customer Price:' : 'গ্রাহক বিক্রয়মূল্য:'} ৳${product.price}
${language === 'en' ? 'Reseller Cost:' : 'রিসেলার রেট (পাইকারি):'} ৳${product.resellerPrice || product.price}

📋 ${language === 'en' ? 'Product Description:' : 'পণ্যের সম্পূর্ণ বিবরণ:'}
${language === 'en' ? product.description : product.descriptionBn}`;
                        navigator.clipboard.writeText(comboText);
                        setCopiedField('all');
                        setTimeout(() => setCopiedField(''), 1500);
                      }}
                      className="col-span-2 sm:col-span-1 px-2.5 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl text-[10px] sm:text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      {copiedField === 'all' ? (
                        <>
                          <Check size={13} className="text-white animate-pulse" />
                          <span>{language === 'en' ? 'Combo Copied!' : 'সব এক ক্লিকে কপিড!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>{language === 'en' ? 'Copy All Info' : 'সব তথ্য কপি করুন'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Image downloading options */}
                  <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col xs:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-zinc-200">
                        <img src={activeImage} alt="" className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 inset-x-0 bg-zinc-950/75 text-white text-[7px] font-mono leading-none py-0.5 text-center truncate uppercase">HQ</span>
                      </div>
                      <div>
                        <span className="font-extrabold text-zinc-800 dark:text-zinc-200 block text-xs leading-tight">{language === 'en' ? 'High-Quality Reseller Asset' : 'হাই-কোয়ালিটি প্রো প্রোডাক্ট ইমেজ'}</span>
                        <span className="text-[10px] text-zinc-400 block truncate max-w-[160px] sm:max-w-[200px] mt-0.5">{activeImage}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleImageDownload(activeImage)}
                      className="w-full xs:w-auto px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer hover:shadow-md hover:brightness-105 active:scale-98 transition flex items-center justify-center gap-1.5"
                    >
                      <Download size={13} />
                      <span>{language === 'en' ? 'Download Best Pic' : 'বেস্ট পিক ডাউনলোড'}</span>
                    </button>
                  </div>

                  {/* AI Auto Facebook Post Generator section */}
                  <div className="bg-gradient-to-br from-orange-500/5 to-amber-500/5 dark:from-orange-500/10 dark:to-amber-500/10 rounded-2xl p-4 border border-orange-500/25 dark:border-orange-500/35 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4.5 w-4.5 text-orange-500 animate-pulse" />
                        <span className="font-extrabold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                          {language === 'en' ? 'AI Auto Social Post Generator' : 'এআই অটো ফেসবুক ও সোশ্যাল পোস্ট জেনারেটর'}
                        </span>
                      </div>
                      {!generatedPosts && (
                        <button
                          type="button"
                          onClick={generateAIPost}
                          disabled={isGeneratingPost}
                          className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-850 text-white font-extrabold text-[10px] sm:text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1"
                        >
                          {isGeneratingPost ? (
                            <>
                              <span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full mr-1"></span>
                              <span>{language === 'en' ? 'Generating...' : 'তৈরি হচ্ছে...'}</span>
                            </>
                          ) : (
                            <>
                              <Sparkles size={11} />
                              <span>{language === 'en' ? 'Generate Post' : 'Generate Post (পোস্ট লিখুন)'}</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {!generatedPosts && !isGeneratingPost && (
                      <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400">
                        {language === 'en' 
                          ? 'Resellers just click "Generate Post". Ghoroya AI will automatically write tailored high-converting promotional posts for Facebook, WhatsApp, and Stories!'
                          : 'রিসেলার শুধু "Generate Post" চাপবেন। সাথে সাথে ফেসবুক, হোয়াটসঅ্যাপ ও স্টোরির জন্য আলাদা প্রমোশনাল পোস্ট লিখে দিবে আমাদের স্মার্ট এআই সহকারী!'}
                      </p>
                    )}

                    {isGeneratingPost && (
                      <div className="flex flex-col items-center justify-center py-4 space-y-2 text-center">
                        <div className="animate-bounce p-2 bg-orange-500/10 rounded-full">
                          <Sparkles className="h-6 w-6 text-orange-500" />
                        </div>
                        <p className="text-xs font-bold text-zinc-700 dark:text-zinc-350 animate-pulse">
                          {language === 'en' ? 'Ghoroya AI is writing high-converting social copy...' : 'ঘরোয়া এআই আপনার জন্য অসাধারণ পোস্টের বিবরণ লিখছে...'}
                        </p>
                      </div>
                    )}

                    {generatedPosts && (
                      <div className="space-y-3">
                        {/* Tabs select */}
                        <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-[10px] sm:text-xs font-black">
                          {(['facebook', 'whatsapp', 'story'] as const).map((tab) => (
                            <button
                              key={tab}
                              type="button"
                              onClick={() => {
                                setActivePostTab(tab);
                                setCopiedPostType('');
                              }}
                              className={`py-1.5 rounded-lg text-center cursor-pointer transition ${
                                activePostTab === tab
                                  ? 'bg-white dark:bg-zinc-750 text-orange-600 dark:text-orange-400 shadow-3xs font-extrabold'
                                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                              }`}
                            >
                              <span>{tab === 'facebook' ? (language === 'en' ? 'Facebook' : 'ফেসবুক') : tab === 'whatsapp' ? (language === 'en' ? 'WhatsApp' : 'হোয়াটসঅ্যাপ') : (language === 'en' ? 'Story' : 'স্টোরি')}</span>
                            </button>
                          ))}
                        </div>

                        {/* Generated Box */}
                        <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-805 rounded-xl p-3 text-xs">
                          <pre className="font-sans whitespace-pre-wrap text-[11px] sm:text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed overflow-y-auto max-h-[160px] pr-2">
                            {generatedPosts[activePostTab]}
                          </pre>
                          
                          <div className="absolute top-2 right-2">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(generatedPosts[activePostTab]);
                                setCopiedPostType(activePostTab);
                                setTimeout(() => setCopiedPostType(''), 1500);
                              }}
                              className="p-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-lg cursor-pointer transition flex items-center gap-1 text-[10px] font-black"
                            >
                              {copiedPostType === activePostTab ? (
                                <>
                                  <Check size={11} className="text-emerald-500" />
                                  <span className="text-emerald-500">{language === 'en' ? 'Copied!' : 'কপি হয়েছে!'}</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={11} />
                                  <span>{language === 'en' ? 'Copy Text' : 'কপি করুন'}</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Actions line */}
                        <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold">
                          <span>
                            {language === 'en' ? '✨ Generation completed' : '✨ পোস্টটি এআই দ্বারা সফলভাবে রচিত হয়েছে'}
                          </span>
                          <button
                            type="button"
                            onClick={generateAIPost}
                            disabled={isGeneratingPost}
                            className="text-orange-500 hover:text-orange-600 underline cursor-pointer"
                          >
                            {language === 'en' ? 'Re-generate' : 'পুনরায় লিখুন'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight">
                    💡 <span className="font-extrabold">{language === 'en' ? 'Facebook Reselling Secret:' : 'সহজে বিক্রির উপায় (টিপস):'}</span> {language === 'en' ? 'Get the high quality cover picture, then click "Copy All Info". Paste on your Facebook Page, Story or WhatsApp to collect customer orders right away!' : 'প্রথমে "বেস্ট পিক ডাউনলোড" করুন, তারপর "সব তথ্য কপি" বাটনে ক্লিক করে বিবরণটি আপনার ফেসবুক পেজ, গ্রুপ, স্টোরি অথবা হোয়াটসএপ এ পোস্ট করে সরাসরি কাস্টমার অর্ডার সংগ্রহ করুন!'}
                  </p>
                </div>
              )}

              {/* Selection Options (Colors & Sizes) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Choose Color */}
                <div>
                  <h4 className="font-extrabold text-xs text-zinc-700 dark:text-zinc-350 mb-2">
                    {language === 'en' ? 'Select Color' : 'পছন্দের কালার'}
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`text-xs px-3 py-2 rounded-xl border text-center transition cursor-pointer font-bold ${
                          selectedColor === c
                            ? 'border-orange-500 bg-orange-50 text-orange-600 font-extrabold shadow-sm'
                            : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-655 dark:text-zinc-300'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Choose Size */}
                <div>
                  <h4 className="font-extrabold text-xs text-zinc-700 dark:text-zinc-350 mb-2">
                    {language === 'en' ? 'Select Size' : 'সাইজ নির্বাচন'}
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`text-xs px-3.5 py-2 rounded-xl border text-center transition cursor-pointer font-bold ${
                          selectedSize === s
                            ? 'border-orange-500 bg-orange-50 text-orange-600 font-extrabold shadow-sm'
                            : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-655 dark:text-zinc-300'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quantity Changer */}
              <div>
                <h4 className="font-extrabold text-xs text-zinc-700 mb-2">
                  {language === 'en' ? 'Select Quantity' : 'প্রয়োজনীয় সংখ্যা'}
                </h4>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex border border-zinc-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    <button
                      onClick={decrementQty}
                      className="p-3 hover:bg-zinc-100 text-zinc-605 font-bold transition flex items-center justify-center cursor-pointer"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-5 py-2 text-sm font-black text-zinc-850 bg-zinc-50 select-none text-center min-w-10 block">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQty}
                      className="p-3 hover:bg-zinc-100 text-zinc-605 font-bold transition flex items-center justify-center cursor-pointer"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  
                  {product.stock <= 5 && (
                    <span className="text-[10px] bg-red-100 font-black text-red-650 px-2.5 py-1 rounded animate-pulse">
                      ⚠️ {language === 'en' ? 'Limited Stock left!' : 'স্টক প্রায় শেষ! দ্রুত অর্ডার করুন'}
                    </span>
                  )}
                </div>
                
              </div>

              {/* Add To Cart/Buy buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 border-t border-zinc-100 pt-5">
                <button
                  onClick={() => onAddToCart(product, quantity, selectedColor, selectedSize)}
                  type="button"
                  className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black text-xs sm:text-sm tracking-wide shadow-md transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-center"
                >
                  {language === 'en' ? 'Add To Cart' : 'কার্টে যোগ করুন'}
                </button>
                <button
                  onClick={() => onBuyNow(product, quantity, selectedColor, selectedSize)}
                  type="button"
                  className="w-full py-4 bg-red-650 hover:bg-red-750 text-white rounded-xl font-black text-xs sm:text-sm tracking-wide shadow-md transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={15} />
                  <span>{language === 'en' ? 'Buy Now Securely' : 'সরাসরি দ্রুত কিনুন'}</span>
                </button>
              </div>

            </div>
          </div>

          {/* FREQUENTLY BOUGHT TOGETHER - COMBO BAR */}
          {comboProduct && (
            <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-5 mt-6">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-extrabold text-xs sm:text-sm text-zinc-800 flex items-center gap-1.5 uppercase tracking-wide">
                  <Gift size={16} className="text-red-500 animate-pulse" />
                  <span>{language === 'en' ? 'Frequently Bought Together' : 'গ্রাহকরা সাধারণত একসাথে কেনেন (কম্বো অফার)'}</span>
                </h4>
                <span className="text-[10px] font-black uppercase bg-red-100 text-red-655 px-2.5 py-0.5 rounded-full">
                  🎁 {language === 'en' ? 'bundle discount' : 'বান্ডেল ছাড়'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-white border border-zinc-150 p-4 rounded-2xl">
                <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap justify-center sm:justify-start">
                  
                  {/* Item 1 Checkbox / Capsule */}
                  <label className="flex items-center gap-3 bg-zinc-50/50 border border-zinc-200/60 hover:bg-zinc-50 p-2.5 rounded-xl cursor-default select-none">
                    <input 
                      type="checkbox" 
                      checked 
                      disabled 
                      className="accent-orange-500 w-4 h-4 cursor-not-allowed rounded" 
                    />
                    <div className="flex items-center gap-2">
                      <img src={product.image} alt="" className="w-10 h-10 object-cover rounded-lg border border-zinc-250" />
                      <div>
                        <p className="text-xs font-black text-zinc-800 truncate max-w-[110px]">
                          {language === 'en' ? product.name : product.nameBn}
                        </p>
                        <p className="text-[10px] font-bold text-zinc-500">৳{product.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </label>

                  <span className="font-black text-zinc-400 text-lg sm:text-xl">+</span>

                  {/* Item 2 Checkbox / Capsule */}
                  <label className="flex items-center gap-3 bg-zinc-50/50 hover:bg-zinc-100 border border-zinc-200/60 p-2.5 rounded-xl cursor-pointer select-none transition">
                    <input 
                      type="checkbox" 
                      checked={isComboChecked} 
                      onChange={() => setIsComboChecked(!isComboChecked)}
                      className="accent-orange-500 w-4 h-4 cursor-pointer rounded" 
                    />
                    <div className="flex items-center gap-2">
                      <img src={comboProduct.image} alt="" className="w-10 h-10 object-cover rounded-lg border border-zinc-250" />
                      <div>
                        <p className="text-xs font-black text-zinc-800 truncate max-w-[110px]">
                          {language === 'en' ? comboProduct.name : comboProduct.nameBn}
                        </p>
                        <p className="text-[10px] font-bold text-emerald-600">৳{comboProduct.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </label>

                </div>

                <div className="text-center sm:text-right border-t sm:border-t-0 sm:border-l border-zinc-200 pt-3 sm:pt-0 sm:pl-4 flex-shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 block">
                      {language === 'en' ? 'Package Subtotal:' : 'প্যাকেজ মূল্য:'}
                    </span>
                    <span className="text-sm sm:text-base font-black text-red-655 block">
                      ৳{isComboChecked 
                        ? (product.price + comboProduct.price - 100).toLocaleString() 
                        : product.price.toLocaleString()
                      }
                    </span>
                    {isComboChecked ? (
                      <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mt-1 inline-block">
                        🎁 {language === 'en' ? 'Save ৳100 Combo Flat' : '৳১০০ ফ্ল্যাট কম্বো ডিসকাউন্ট'}
                      </span>
                    ) : (
                      <span className="text-[9px] font-semibold text-zinc-400 mt-1 inline-block">
                        {language === 'en' ? 'Bundle Discount Inactive' : 'বান্ডেল ডিসকাউন্ট প্রযোজ্য নয়'}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleAddComboToCart}
                    type="button"
                    className="bg-zinc-950 hover:bg-orange-600 text-white text-[10px] sm:text-[11px] font-black uppercase px-4.5 py-3 rounded-xl transition-all shadow-sm cursor-pointer leading-none flex items-center gap-1.5"
                  >
                    <ShoppingBag size={12} />
                    <span>
                      {isComboChecked 
                        ? (language === 'en' ? 'Add Combo Packet' : 'সম্পূর্ণ কম্বো যোগ করুন')
                        : (language === 'en' ? 'Add Main Item Only' : 'মূল পণ্যটি যোগ করুন')
                      }
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* AI Personalized Complementary Recommendations */}
          <AIRecommendationsList
            cartProductIds={[]}
            currentlyViewedId={product.id}
            language={language}
            onProductClick={(p) => {
              window.dispatchEvent(
                new CustomEvent('ghoroya_select_product', { detail: p })
              );
            }}
            products={allProducts}
            layout="full"
          />

          {/* Specifications Table */}
          <div className="mt-8">
            <h4 className="font-extrabold text-sm sm:text-base text-zinc-900 border-b pb-2.5 mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-orange-500 rounded inline-block" />
              <span>{language === 'en' ? 'Specifications' : 'বিস্তারিত বিবরণ ও মূল কারিগরি তথ্য'}</span>
            </h4>
            <div className="border border-zinc-200 rounded-2xl overflow-hidden bg-zinc-50">
              <table className="w-full text-left border-collapse text-xs">
                <tbody>
                  {Object.entries(
                    language === 'en' ? product.specifications : product.specificationsBn
                  ).map(([key, value], idx) => (
                    <tr
                      key={key}
                      className={idx % 2 === 0 ? 'bg-white border-b border-zinc-150' : 'bg-zinc-50 border-b border-zinc-150'}
                    >
                      <td className="p-3 font-extrabold text-zinc-500 w-1/3 border-r border-zinc-150 uppercase tracking-wider text-[10px]">
                        {key}
                      </td>
                      <td className="p-3 text-zinc-800 font-bold leading-relaxed">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive User Review Submissions section with high-fidelity analytics and filters */}
          <div className="mt-8 space-y-6">
            <h4 className="font-extrabold text-sm sm:text-base text-zinc-900 border-b pb-2.5 flex items-center gap-2">
              <span className="w-1 h-5 bg-orange-500 rounded inline-block" />
              <span>{language === 'en' ? `Customer Reviews (${localReviews.length})` : `গ্রাহক প্রতিক্রিয়া ও রেটিং (${localReviews.length} টি)`}</span>
            </h4>

            {/* HIGH-FIDELITY RATINGS OVERVIEW CARD */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 bg-zinc-50 border border-zinc-200 rounded-3xl p-5 items-center">
              <div className="md:col-span-4 text-center md:border-r border-zinc-200 py-2">
                <p className="text-4xl sm:text-5xl font-black text-orange-600">{product.rating}</p>
                <div className="flex justify-center gap-0.5 mt-1.5">
                  {Array.from({ length: 5 }).map((_, st) => (
                    <Star key={st} size={15} className="fill-yellow-405 text-yellow-500" />
                  ))}
                </div>
                <p className="text-xs text-zinc-500 mt-2 font-bold uppercase tracking-wider">
                  {language === 'en' ? 'Overall Rating' : 'সর্বমোট গড় রেটিং'}
                </p>
              </div>

              {/* Progress bars histogram */}
              <div className="md:col-span-8 space-y-2 text-xs font-bold text-zinc-650">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const matchingCount = localReviews.filter(r => r.rating === stars).length;
                  const pct = localReviews.length > 0 ? (matchingCount / localReviews.length) * 100 : 0;
                  return (
                    <div key={stars} className="flex items-center gap-3">
                      <span className="w-8 text-right font-semibold select-none flex items-center justify-end gap-1">
                        {stars} <Star size={10} className="fill-yellow-400 text-yellow-400" />
                      </span>
                      <div className="flex-1 bg-zinc-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-yellow-450 h-full rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-8 text-zinc-500 text-left">
                        {matchingCount} {language === 'en' ? 'rev' : 'টি'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RATING FILTER SELECTOR BAR */}
            <div className="flex items-center gap-2 flex-wrap text-xs font-black">
              <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px] mr-1 select-none">
                {language === 'en' ? 'Filter Feed:' : 'রিভিউ ফিল্টার:'}
              </span>
              <button
                onClick={() => setSelectedRatingFilter('all')}
                type="button"
                className={`px-3 py-1.5 rounded-xl cursor-pointer transition select-none tracking-tight ${
                  selectedRatingFilter === 'all'
                    ? 'bg-zinc-950 text-white shadow-xs'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                }`}
              >
                {language === 'en' ? `All (${localReviews.length})` : `সব রিভিউ (${localReviews.length})`}
              </button>
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = localReviews.filter(r => r.rating === stars).length;
                return (
                  <button
                    key={stars}
                    onClick={() => setSelectedRatingFilter(stars)}
                    type="button"
                    className={`px-2.5 py-1.5 rounded-xl cursor-pointer transition select-none flex items-center gap-1 ${
                      selectedRatingFilter === stars
                        ? 'bg-orange-500 text-white shadow-xs'
                        : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    <span>{stars}★</span>
                    <span className="text-[10px] opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Form writing */}
            <form onSubmit={handleAddReview} className="bg-zinc-50 border border-zinc-200 rounded-3xl p-5 space-y-3.5">
              <h5 className="font-extrabold text-xs text-zinc-800 flex items-center gap-1.5 uppercase tracking-wide">
                <Sparkles size={13} className="text-orange-500" />
                <span>{language === 'en' ? 'Write an honest opinion' : 'আপনার অভিজ্ঞতার রিভিউটি লিখুন'}</span>
              </h5>

              {reviewSuccess && (
                <div className="p-2.5 text-[11px] bg-emerald-55 text-emerald-805 font-black rounded-lg border border-emerald-250 animate-pulse">
                  ✓ {language === 'en' ? 'Review successfully registered!' : 'আপনার মূল্যবান রিভিউটি সফলভাবে অন্তর্ভুক্ত হয়েছে!'}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-zinc-500 block mb-1 uppercase tracking-wide">Name</label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="e.g. Adnan Sami"
                    className="w-full bg-white border border-zinc-250 rounded-xl p-2.5 text-xs font-semibold text-zinc-950 outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-zinc-500 block mb-1 uppercase tracking-wide">Rating Score</label>
                  <div className="flex items-center gap-1.5 p-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="text-yellow-405 hover:scale-120 transition cursor-pointer"
                      >
                        <Star size={20} className={star <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-300'} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-zinc-500 block mb-1 uppercase tracking-wide">Review Comment</label>
                <textarea
                  required
                  rows={2}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder={language === 'en' ? 'What do you love or dislike about this product?' : 'পণ্যটির গুণগত মান সক্রান্ত আপনার মূল্যবান মন্তব্যটি শেয়ার করুন...'}
                  className="w-full bg-white border border-zinc-250 rounded-xl p-2.5 text-xs font-semibold text-zinc-950 outline-none focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-[10px] uppercase tracking-wider px-5 py-3 rounded-xl transition cursor-pointer leading-none flex items-center gap-1.5"
              >
                <span>{language === 'en' ? 'Submit Secure Review' : 'রিভিউ সাবমিট করুন'}</span>
              </button>
            </form>

            {/* List rating comments */}
            <div className="space-y-3.5 max-h-96 overflow-y-auto pr-1">
              {localReviews
                .filter(r => selectedRatingFilter === 'all' || r.rating === selectedRatingFilter)
                .map((r, i) => (
                  <div key={`${r.id}-${i}`} className="bg-zinc-50 border border-zinc-150 p-4 rounded-2.5xl space-y-2.5 text-xs text-zinc-800 transition hover:bg-white hover:shadow-xs">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-zinc-900">{r.name}</span>
                        <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 border border-emerald-250/20 px-2 py-0.5 rounded flex items-center gap-0.5 select-none scale-90">
                          <CheckCircle2 size={9} />
                          {language === 'en' ? 'Verified Buyer' : 'অনুমোদিত ক্রেতা'}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-bold">{r.date}</span>
                    </div>

                    <div className="flex gap-0.5">
                      {Array.from({ length: r.rating }).map((_, st) => (
                        <Star key={st} size={11} className="fill-yellow-405 text-yellow-500" />
                      ))}
                      {Array.from({ length: 5 - r.rating }).map((_, st) => (
                        <Star key={st} size={11} className="text-zinc-200" />
                      ))}
                    </div>

                    <p className="text-zinc-700 font-medium italic leading-relaxed text-[11px] sm:text-xs">
                      "{language === 'en' ? r.commentEn : r.comment}"
                    </p>

                    <div className="flex justify-between items-center pt-1 border-t border-zinc-150/50 text-[10px] text-zinc-500 font-extrabold flex-wrap gap-2">
                      <span>🛡️ Ghoroya Buyer Protection Seal</span>
                      <button
                        onClick={() => handleVoteHelpful(r.id)}
                        type="button"
                        className={`px-3 py-1 rounded-lg border transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                          helpfulClicked[r.id]
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-black'
                            : 'bg-white border-zinc-250 hover:bg-zinc-100 text-zinc-650'
                        }`}
                      >
                        <ThumbsUp size={10} className={helpfulClicked[r.id] ? 'fill-emerald-600' : ''} />
                        <span>
                          {language === 'en' ? 'Helpful' : 'সহায়ক'} ({helpfulCount[r.id] || 0})
                        </span>
                      </button>
                    </div>
                  </div>
                ))}

              {localReviews.filter(r => selectedRatingFilter === 'all' || r.rating === selectedRatingFilter).length === 0 && (
                <div className="text-center py-6 text-zinc-450 text-xs font-bold">
                  {language === 'en' ? 'No reviews matching this rating star yet.' : 'এই স্টার সংখ্যার কোনো রিভিউ পাওয়া যায়নি।'}
                </div>
              )}
            </div>
          </div>

          {/* RELATED PRODUCTS */}
          {relatedProducts.length > 0 && (
            <div className="mt-8 border-t border-zinc-100 pt-6">
              <h4 className="font-extrabold text-sm sm:text-base text-zinc-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-orange-500 rounded inline-block" />
                <span>{language === 'en' ? 'Related Products' : 'সম্পর্কিত অন্যান্য পণ্য ও অফার'}</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {relatedProducts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      // Trigger click in parent
                      onClose();
                      // We'll trust parent will set this product as selected
                      setTimeout(() => {
                        const evt = new CustomEvent('ghoroya_select_product', { detail: p });
                        window.dispatchEvent(evt);
                      }, 100);
                    }}
                    type="button"
                    className="bg-zinc-55 hover:bg-zinc-100 border border-zinc-150 rounded-2xl p-3 flex flex-col items-center text-center text-xs group cursor-pointer transition"
                  >
                    <img src={p.image} alt={p.name} className="w-20 h-20 object-cover rounded-xl bg-zinc-100 mb-2.5 transition transform group-hover:scale-105" />
                    <p className="font-bold text-zinc-800 line-clamp-1 group-hover:text-orange-500">
                      {language === 'en' ? p.name : p.nameBn}
                    </p>
                    <p className="font-black text-orange-600 mt-1">৳{p.price.toLocaleString()}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* LIGHTBOX FULLSCREEN ZOOM OVERLAY */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-55 bg-black/95 flex flex-col items-center justify-center p-4 sm:p-8 animate-fade-in backdrop-blur-md">
          <button
            onClick={() => setIsLightboxOpen(false)}
            type="button"
            className="absolute top-6 right-6 bg-white/10 text-white hover:bg-white/20 p-3 rounded-full transition cursor-pointer shadow focus:outline-none"
            title={language === 'en' ? 'Close Lightbox' : 'জুম বন্ধ করুন'}
          >
            <Minimize size={22} />
          </button>
          
          <div className="relative max-w-4xl max-h-[80vh] flex flex-col items-center justify-center">
            <img
              src={activeImage}
              alt={product.name}
              className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl border border-white/5"
            />
            <div className="mt-4 text-zinc-300 text-xs font-bold text-center tracking-wide bg-zinc-900/60 px-4 py-1.5 rounded-full select-none">
              📸 {language === 'en' ? product.name : product.nameBn} — High-Res Master View
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
