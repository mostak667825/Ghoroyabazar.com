import React, { useState, useEffect } from 'react';
import { Gift, Sparkles, Check, Copy, RefreshCw, Clock } from 'lucide-react';

interface PersonalizedOffersProps {
  language: 'en' | 'bn';
  recentlyViewedIds: string[];
  cartProductIds: string[];
  onApplyVoucher: (code: string) => void;
  appliedVoucherCode: string;
}

interface OfferData {
  code: string;
  discountAmount: number;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
}

export default function PersonalizedOffers({
  language,
  recentlyViewedIds,
  cartProductIds,
  onApplyVoucher,
  appliedVoucherCode,
}: PersonalizedOffersProps) {
  const [offer, setOffer] = useState<OfferData | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  // Fetch offer from server-side Gemini
  const fetchPersonalizedOffer = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/gemini/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recentlyViewedIds,
          cartProductIds,
          language,
        }),
      });
      const data = await response.json();
      if (data && data.code) {
        setOffer(data);
      }
    } catch (err) {
      console.error('Failed to load personalized offer:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on load, or when viewed history shifts from empty to something
  useEffect(() => {
    fetchPersonalizedOffer();
  }, [recentlyViewedIds.length, cartProductIds.length]);

  useEffect(() => {
    if (offer && appliedVoucherCode === offer.code) {
      setHasApplied(true);
    } else {
      setHasApplied(false);
    }
  }, [appliedVoucherCode, offer]);

  if (loading && !offer) {
    return (
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-2 border-[#FFE8E0]/40 rounded-3xl p-6 text-white text-center flex flex-col items-center justify-center space-y-3 min-h-[140px] animate-pulse">
        <RefreshCw className="animate-spin text-red-500" size={24} />
        <p className="text-xs font-bold text-zinc-400">
          {language === 'en' ? 'AI is crafting your personal gift voucher...' : 'এআই আপনার জন্য বিশেষ কুপন তৈরি করছে...'}
        </p>
      </div>
    );
  }

  if (!offer) return null;

  const titleText = language === 'en' ? offer.title : offer.titleBn;
  const descText = language === 'en' ? offer.description : offer.descriptionBn;

  const handleApply = () => {
    onApplyVoucher(offer.code);
    setHasApplied(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(offer.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-tr from-zinc-900 via-zinc-950 to-red-950/80 text-white border-2 border-red-650 rounded-3xl p-5 sm:p-6 shadow-xl animate-fade-in my-6">
      {/* Absolute ambient lights */}
      <span className="absolute -right-12 -top-12 w-32 h-32 bg-red-600/20 blur-2xl rounded-full" />
      <span className="absolute -left-12 -bottom-12 w-32 h-32 bg-orange-500/15 blur-2xl rounded-full" />

      {/* Header element */}
      <div className="flex items-center gap-2 mb-3.5 select-none">
        <span className="bg-red-600 text-white px-2.5 py-1 rounded-full font-black text-[9px] uppercase tracking-wider flex items-center gap-1">
          <Sparkles size={10} className="animate-spin" style={{ animationDuration: '4s' }} />
          {language === 'en' ? 'AI Personalized Deal' : 'পার্সোনালাইজড এআই উপহার'}
        </span>
        <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-bold">
          <Clock size={11} />
          <span>{language === 'en' ? 'Valid: 30m' : 'মেয়াদ: ৩০ মিনিট'}</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-5 items-center justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="bg-gradient-to-br from-red-500 to-orange-600 p-3.5 rounded-2xl shrink-0 shadow-lg shadow-red-500/20">
            <Gift size={24} className="text-white animate-bounce" style={{ animationDuration: '5s' }} />
          </div>
          <div className="space-y-1 text-left">
            <h4 className="font-black text-white text-sm sm:text-base tracking-tight">
              {titleText}
            </h4>
            <p className="text-zinc-300 text-xs leading-relaxed font-semibold">
              {descText}
            </p>
          </div>
        </div>

        {/* Voucher dynamic ticket card */}
        <div className="w-full md:w-auto flex shrink-0 items-center justify-between sm:justify-start gap-3 bg-zinc-900/60 border border-zinc-800 p-3 rounded-2xl">
          <div className="text-left pr-4 border-r border-zinc-800">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">
              {language === 'en' ? 'CASHBACK' : 'ক্যাশব্যাক ছাড়'}
            </span>
            <span className="text-xl sm:text-2xl font-black text-red-550 leading-none">
              ৳{offer.discountAmount}
            </span>
          </div>

          <div className="flex flex-col gap-1.5 min-w-[130px]">
            <div className="flex items-center justify-between bg-zinc-950 px-2.5 py-1.5 rounded-xl border border-zinc-800">
              <span className="font-mono text-xs font-black tracking-widest text-[#FFF0EB]">
                {offer.code}
              </span>
              <button
                onClick={handleCopy}
                type="button"
                className="text-zinc-400 hover:text-white p-0.5"
                title="Copy code"
              >
                {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
              </button>
            </div>

            <button
              onClick={handleApply}
              disabled={hasApplied}
              type="button"
              className={`w-full py-1.5 rounded-xl text-[11px] font-black tracking-wide uppercase transition cursor-pointer text-center ${
                hasApplied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white hover:bg-[#FFF0EB] text-zinc-950 font-black'
              }`}
            >
              {hasApplied ? (
                <span className="flex items-center justify-center gap-1">
                  <Check size={11} /> {language === 'en' ? 'Applied' : 'অ্যাপ্লাইড'}
                </span>
              ) : (
                language === 'en' ? 'Apply Now' : 'কুপন সচল করুন'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
