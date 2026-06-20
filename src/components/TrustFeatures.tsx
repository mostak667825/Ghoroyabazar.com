import React, { useState } from 'react';
import { ShieldCheck, Lock, ArrowLeftRight, Headphones, Coins, Check, X } from 'lucide-react';

interface TrustFeaturesProps {
  language: 'en' | 'bn';
  layout?: 'row' | 'grid' | 'compact';
}

export default function TrustFeatures({ language, layout = 'grid' }: TrustFeaturesProps) {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const features = [
    {
      id: 'seller',
      icon: <ShieldCheck size={28} className="text-emerald-600 shrink-0" />,
      title: language === 'en' ? 'Verified Seller' : 'ভেরিফাইড সেলার',
      subtitle: language === 'en' ? '100% Authentic Quality' : 'শতভাগ খাঁটি ও নিরাপদ',
      badgeText: language === 'en' ? 'Verified Badge' : 'ভেরিফাইড ব্যাজ',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      desc: language === 'en' 
        ? 'Every artisan and vendor under Ghoroya Bazar undergoes rigorous verification. We analyze organic farm standards, food grade certifications, and handcrafted quality to ensure you receive genuine premium products every time.'
        : 'ঘরোয়া বাজারের সকল উৎপাদক ও বিক্রেতা কঠোর মান নিয়ন্ত্রণ পরীক্ষার মধ্য দিয়ে যান। আমাদের ল্যাব স্ট্যান্ডার্ডস, খাঁটি উপাদান নিশ্চিতকরণ ও প্রত্যয়িত ঘরোয়া ব্যাজ আপনাকে দেয় ভেজালমুক্ত অরিজিনাল মালের গ্যারান্টি।',
      bullets: language === 'en'
        ? ['Direct from verified farms', 'Rigorous quality auditing team', 'Chemical-free and lab-tested organic goods']
        : ['সরাসরি অনুমোদিত ঘরোয়া খামার থেকে সংগৃহীত', 'কঠোর কোয়ালিটি কন্ট্রোল টিম দ্বারা পরীক্ষিত', 'শতভাগ কেমিক্যালমুক্ত ও স্বাস্থ্যসম্মত']
    },
    {
      id: 'payment',
      icon: <Lock size={28} className="text-blue-600 shrink-0" />,
      title: language === 'en' ? 'Secure Payment' : 'নিরাপদ পেমেন্ট',
      subtitle: language === 'en' ? 'SSL 256-bit Encrypted' : 'ব্যাংকিং লেভেল ট্রানজেকশন',
      badgeText: language === 'en' ? 'Secure SSL' : 'নিরাপদ গেটওয়ে',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      desc: language === 'en'
        ? 'Your online shopping experience is protected by premium Grade-A encryption. We provide 100% safe checkout using Bank Wire, mobile wallets (bKash, Nagad), Credit Cards, or trust-verified Cash on Delivery (COD).'
        : 'আপনার অনলাইন পেমেন্ট অত্যন্ত সুরক্ষিত। ব্যাংকিং পেমেন্ট, ব্যাংক ট্রান্সফার বা বিকাশ ও রকেটের যেকোনো ট্রানজেকশনে আধুনিক এনক্রিপশন সিস্টেম কাজ করে। এছাড়া চাইলে সরাসরি পণ্য হাতে পেয়ে মূল্য পরিশোধ (ক্যাশ অন ডেলিভারি) করতে পারবেন।',
      bullets: language === 'en'
        ? ['Encrypted SSL transfers', 'No stored credit/debit card logs', 'Secure Cash on Delivery accepted']
        : ['হাইলি এনক্রিপ্টেড অনলাইন পেমেন্ট চ্যানেল', 'অর্ডার ডেটা সম্পূর্ণ নিরাপদ ও বিশ্বস্ত থাকে', 'ক্যাশ অন ডেলিভারি ক্যাশ হ্যান্ডওভার সুবিধা']
    },
    {
      id: 'return',
      icon: <ArrowLeftRight size={28} className="text-orange-500 shrink-0" />,
      title: language === 'en' ? '7-Day Easy Return' : '৭ দিনের সহজ রিটার্ন',
      subtitle: language === 'en' ? 'Risk-Free Product Checking' : 'নিশ্চিন্তে পণ্য পরীক্ষা করুন',
      badgeText: language === 'en' ? 'Easy Return' : 'সহজ রিটার্ন পলিসি',
      badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
      desc: language === 'en'
        ? 'We stand by our product quality. If your organic product has a quality defect, is damaged during delivery, or does not match description, you can easily claim a return within 7 calendar days of receipt.'
        : 'আমরা পণ্যের মানে বিশ্বাসী। পণ্য ডেলিভারি নেওয়ার পর থেকে ৭ দিনের মধ্যে যদি কোনো ত্রুটি বা বর্ণনার সাথে অমিল খুঁজে পান, তবে কোনো প্রশ্ন ছাড়াই সহজে পণ্য ফেরত দেওয়ার আবেদন করতে পারবেন।',
      bullets: language === 'en'
        ? ['Convenient home pickup', 'No-questions-asked validation', 'Full support tracing']
        : ['সহজ হোম পিকআপ সার্ভিস', 'কোনো বাড়তি জটিলতা ছাড়াই রিটার্ন গ্রহণ', 'সম্পূর্ণ কাস্টমার-বান্ধব ট্র্যাকিং']
    },
    {
      id: 'refund',
      icon: <Coins size={28} className="text-amber-500 shrink-0" />,
      title: language === 'en' ? 'Instant Refund' : 'তাত্ক্ষণিক রিফান্ড',
      subtitle: language === 'en' ? '100% Money-Back' : 'মূল্য ফেরত নিশ্চয়তা',
      badgeText: language === 'en' ? '100% Refund' : 'সম্পূর্ণ রিফান্ড পলিসি',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      desc: language === 'en'
        ? 'Once your return request is processed and validated, we will process your refund instantly. The full transaction value is sent back directly to your mobile wallet, bank account, or original payment source within 24 to 48 hours.'
        : 'রিটার্ন আবেদনটি অনুমোদিত হওয়ার পর পরই আমরা রিফান্ড সম্পন্ন করি। মাত্র ২৪ থেকে ৪৮ ঘণ্টার মধ্যে আপনার মোবাইল ওয়ালেট (বিকাশ/নগদ) অথবা ব্যাংক অ্যাকাউন্টে সম্পূর্ণ টাকা রিফান্ড পেয়ে যাবেন।',
      bullets: language === 'en'
        ? ['24-48 hours processing', 'Full refund on damaged goods', 'Direct transfer to source account']
        : ['১-২ দিনের মধ্যে রিফান্ড সেটেলমেন্ট', 'ক্ষতিগ্রস্ত পণ্যে ১০০% ফেরত সুবিধা', 'সরাসরি মূল পেমেন্ট মাধ্যমে টাকা ফেরত']
    },
    {
      id: 'support',
      icon: <Headphones size={28} className="text-indigo-600 shrink-0" />,
      title: language === 'en' ? '24/7 Support' : '২৪/৭ কাস্টমার সাপোর্ট',
      subtitle: language === 'en' ? 'Hotline & AI Assistant' : 'ফোন কল ও এআই সুবিধা',
      badgeText: language === 'en' ? 'Priority Care' : 'হটলাইন সাপোর্ট',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      desc: language === 'en'
        ? 'Need help? Our customer care is ready. Simply dial our dedicated support hotline at +8801518489080, mail us, or activate the smart AI Shopping Assistant at any time for immediate assistance.'
        : 'যেকোনো প্রয়োজনে আমরা পাশে আছি। আমাদের হটলাইন নম্বর ০১৫১৮৪৮৯০৮০ এ সরাসরি কল করতে পারেন অথবা আমাদের ২৪/৭ কর্মরত এআই চ্যাট সহকারীর সাথে যেকোনো বিষয়ে সাহায্য নিতে পারেন।',
      bullets: language === 'en'
        ? ['Call Hotline: 01518489080', 'Smart AI companion help', 'Real-time order shipment status tracking']
        : ['কল করুন: ০১৫১৮৪৮৯০৮০ নম্বরে', 'স্মার্ট এআই শপিং অ্যাসিস্ট্যান্ট সাপোর্ট', 'রিয়েল-টাইমে পার্সেল ট্র্যাকিং আপডেট']
    }
  ];

  if (layout === 'compact') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center select-none pt-2">
        {features.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveModal(f.id)}
            className="p-2 border border-zinc-200 dark:border-zinc-800/80 hover:border-red-400 dark:hover:border-red-500 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-850/50 rounded-xl transition duration-150 text-center flex flex-col items-center justify-center gap-1 group shadow-3xs cursor-pointer text-zinc-800 dark:text-zinc-200"
          >
            <div className="transform group-hover:scale-110 transition duration-150">
              {React.cloneElement(f.icon, { size: 18 })}
            </div>
            <p className="text-[10px] font-black text-zinc-800 dark:text-zinc-200 leading-none">
              {f.title}
            </p>
          </button>
        ))}

        {/* Modal display portal */}
        {activeModal && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/70 backdrop-blur-3xs text-left animate-fade-in">
            <div className="fixed inset-0" onClick={() => setActiveModal(null)} />
            {features.map((f) => f.id === activeModal && (
              <div key={f.id} className="relative bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border-2 border-red-650 rounded-[24px] max-w-sm w-full p-6 shadow-2xl z-10 animate-scale-up">
                <button
                  onClick={() => setActiveModal(null)}
                  className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-650 bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-800 p-1 rounded-full transition cursor-pointer"
                >
                  <X size={16} />
                </button>
                <div className="flex items-center gap-3.5 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <div className="bg-zinc-100 dark:bg-zinc-850 p-2.5 rounded-2xl">
                    {f.icon}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-zinc-900 dark:text-white text-base leading-snug">{f.title}</h4>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${f.badgeColor}`}>
                      {f.badgeText}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-semibold mb-4">{f.desc}</p>
                <div className="space-y-2.5 bg-zinc-50 dark:bg-zinc-900 p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  {f.bullets.map((b, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-zinc-700 dark:text-zinc-300 font-extrabold">
                      <Check size={12} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Visual Header */}
      {layout === 'grid' && (
        <div className="text-center space-y-2 mb-8 mt-4">
          <div className="inline-flex items-center gap-1 bg-red-50 dark:bg-red-950/35 text-red-650 dark:text-red-400 border border-red-100/70 dark:border-red-900/50 px-4 py-1.5 rounded-full font-black text-[11px] tracking-wide uppercase select-none">
            🛡️ {language === 'en' ? 'Ghoroya Bazar Trust Seal' : 'ঘরোয়া সেলার ট্রাস্ট গ্যারান্টি'}
          </div>
          <h3 className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
            {language === 'en' ? 'Shop with Complete Confidence' : 'নিরাপদ শপিং এর শতভাগ নিশ্চয়তা'}
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 font-semibold text-xs max-w-lg mx-auto leading-relaxed">
            {language === 'en' 
              ? 'Our customer protection model and genuine quality certification badges protect your shopping experience.' 
              : 'সেলার ভেরিফিকেশন, রিফান্ড পলিসি ও নিরাপদ কুরিয়ারের মাধ্যমে আমরা নিশ্চিত করি প্রিমিয়াম কালেকশন।'}
          </p>
        </div>
      )}

      {/* Main Grid display box */}
      <div className={`grid grid-cols-1 md:grid-cols-${features.length === 5 ? '5' : '4'} gap-4`}>
        {features.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveModal(f.id)}
            className="text-left bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 hover:border-red-300 dark:hover:border-red-500/80 hover:shadow-lg dark:hover:shadow-zinc-950/40 rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="bg-zinc-50 dark:bg-zinc-800 p-2.5 rounded-xl w-fit mb-3.5 group-hover:bg-[#FFF0EB] dark:group-hover:bg-red-950/20 text-zinc-800 dark:text-zinc-200 transition duration-150">
                {f.icon}
              </div>
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-zinc-900 dark:text-zinc-100 text-sm flex items-center gap-1.5 leading-snug">
                  <span>{f.title}</span>
                  <span className="w-1 h-1 bg-zinc-300 dark:bg-zinc-650 rounded-full inline-block group-hover:bg-red-500" />
                </h4>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-bold leading-tight">
                  {f.subtitle}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between w-full">
              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${f.badgeColor}`}>
                {f.badgeText}
              </span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold group-hover:text-red-505 dark:group-hover:text-red-400 transition-colors uppercase tracking-tight">
                {language === 'en' ? 'More Detail →' : 'বিস্তারিত দেখুন →'}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Explanatory Policy Portal Popovers */}
      {activeModal && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/60 backdrop-blur-3xs text-left animate-fade-in select-none">
          <div className="fixed inset-0" onClick={() => setActiveModal(null)} />
          {features.map((f) => f.id === activeModal && (
            <div key={f.id} className="relative bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border-2 border-red-650 rounded-[24px] max-w-sm w-full p-6 shadow-2xl z-10 animate-scale-up">
              <button
                onClick={() => setActiveModal(null)}
                className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-650 bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-800 p-1.5 rounded-full transition cursor-pointer"
              >
                <X size={16} />
              </button>
              
              <div className="flex items-center gap-3.5 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <div className="bg-zinc-100 dark:bg-zinc-850 p-2.5 rounded-2xl">
                  {f.icon}
                </div>
                <div>
                  <h4 className="font-extrabold text-zinc-900 dark:text-white text-base leading-snug">{f.title}</h4>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${f.badgeColor}`}>
                    {f.badgeText}
                  </span>
                </div>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-semibold mb-4">{f.desc}</p>
              
              <div className="space-y-2.5 bg-zinc-50 dark:bg-zinc-900 p-3.5 rounded-xl border border-zinc-150 dark:border-zinc-800">
                {f.bullets.map((b, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px] text-zinc-700 dark:text-zinc-300 font-extrabold">
                    <Check size={12} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
