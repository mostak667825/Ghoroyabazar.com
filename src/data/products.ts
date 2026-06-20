/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from '../types';

export const CATEGORIES = [
  { id: 'all', name: 'All Products', nameBn: 'সব পণ্য', icon: 'ShoppingBag' },
  { id: 'electronics', name: 'Electronics', nameBn: 'ইলেক্ট্রনিক', icon: 'Laptop' },
  { id: 'fashion', name: 'Fashion', nameBn: 'ফ্যাশন', icon: 'Shirt' },
  { id: 'home_decor', name: 'Home Decor', nameBn: 'গৃহসজ্জা', icon: 'Home' },
  { id: 'personal_care', name: 'Personal Care', nameBn: 'রূপচর্চা', icon: 'Sparkles' },
  { id: 'groceries', name: 'Groceries', nameBn: 'মুদিবাজার', icon: 'Apple' },
  { id: 'package', name: 'Combo Packages', nameBn: 'প্যাকেজ', icon: 'Package' },
  { id: 'fresh_groceries', name: 'Fresh Bazaar', nameBn: 'কাঁচা বাজার', icon: 'Leaf' },
  { id: 'beauty', name: 'Beauty & Makeup', nameBn: 'বিউটি', icon: 'Sparkles' },
  { id: 'gadget', name: 'Gadgets', nameBn: 'গ্যাজেট', icon: 'Smartphone' },
  { id: 'skincare', name: 'Skin Care', nameBn: 'স্কিন কেয়ার', icon: 'Heart' },
  { id: 'kids_mom', name: 'Mimi & Wow', nameBn: 'মিমি ও ওয়াও', icon: 'Baby' }
];

export const HERO_SLIDES = [
  {
    id: '1',
    title: 'Grand Shopping Festival!',
    titleBn: 'গ্র্যান্ড শপিং উৎসব!',
    subtitle: 'Up to 60% off on premium smartphones, electronics & home items.',
    subtitleBn: 'স্মার্টফোন, ইলেকট্রনিক্স এবং গৃহস্থালী পণ্যে ৬০% পর্যন্ত ছাড়।',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
    color: 'from-orange-500 to-red-600',
    tag: 'EID SPECIAL'
  },
  {
    id: '2',
    title: 'Eid Fashion Collection 2026',
    titleBn: 'ঈদ ফ্যাশন কালেকশন ২০২৬',
    subtitle: 'Discover designer sarees, premium cotton t-shirts, watches & more.',
    subtitleBn: 'ডিজাইনার শাড়ি, প্রিমিয়াম কটন টি-শার্ট, ঘড়ি এবং আরো অনেক কিছু আবিষ্কার করুন।',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&auto=format&fit=crop&q=80',
    color: 'from-pink-500 to-purple-600',
    tag: 'FASHION WEEK'
  },
  {
    id: '3',
    title: 'Fresh Groceries Delivered Daily',
    titleBn: 'প্রতিদিন তাজা মুদি বাজার ডেলিভারি',
    subtitle: 'Get cashbacks on ghee, soyabean oil, organic nuts & spices.',
    subtitleBn: 'ঘি, সয়াবিন তেল, অর্গানিক বাদাম এবং মশলায় ক্যাশব্যাক পান।',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80',
    color: 'from-emerald-500 to-teal-600',
    tag: 'DAILY GROCERIES'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'el-phone',
    name: 'Redmi Note 13 Pro 5G - (8GB/256GB)',
    nameBn: 'রেডমি নোট ১৩ প্রো ৫জি - (৮জিবি/২৫৬জিবি)',
    price: 32500,
    originalPrice: 35000,
    discount: 7,
    rating: 4.8,
    reviewsCount: 382,
    category: 'electronics',
    categoryBn: 'ইলেকট্রনিক্স',
    code: 'EL-PHN-2026',
    subcategory: 'smartphone',
    subcategoryBn: 'স্মার্টফোন ও ট্যাবলেট',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1565849692283-c19af1e515d9?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=60'
    ],
    description: 'The Redmi Note 13 Pro 5G features a flagship-level 200MP camera, 1.5K 120Hz AMOLED display, high-speed Snapdragon 7s Gen 2 chip, and 67W turbo charging.',
    descriptionBn: 'রেডমি নোট ১৩ প্রো ৫জি-তে রয়েছে ফ্ল্যাগশিপ-লেভেলের ২০০ মেগাপিক্সেল ক্যামেরা, ১.৫কে ১২০ হার্টজ অ্যামোলেড ডিসপ্লে, উচ্চ গতির স্ন্যাপড্রাগন ৭এস জেন ২ চিপ এবং ৬৭ ওয়াট টার্বো চার্জিং সুবিধা।',
    stock: 15,
    flashSale: true,
    soldCount: 1450,
    specifications: {
      Display: '6.67" 1.5K AMOLED, 120Hz',
      Processor: 'Snapdragon 7s Gen 2',
      RAM: '8GB LPDDR4X',
      Storage: '256GB UFS 2.2',
      Camera: '200MP + 8MP + 2MP Rear, 16MP Front',
      Battery: '5100 mAh with 67W Charger'
    },
    specificationsBn: {
      ডিসপ্লে: '৬.৬৭ ইঞ্চি ১.৫কে অ্যামোলেড, ১২০ হার্টজ',
      প্রসেসর: 'স্ন্যাপড্রাগন ৭এস জেন ২',
      র‌্যাম: '৮ জিবি',
      স্টোরেজ: '২৫৬ জিবি',
      ক্যামেরা: '২০০ মেগাপিক্সেল ট্রিপল রিয়ার ক্যামেরা',
      ব্যাটারি: '৫১০০ এমএএইচ ও ৬৭ ওয়াট চার্জার'
    }
  },
  {
    id: 'el-earbuds',
    name: 'Anker Soundcore P20i Wireless Earbuds',
    nameBn: 'অ্যাঙ্কর সাউন্ডকোর পি২০আই ওয়্যারলেস ইয়ারবাডস',
    price: 1850,
    originalPrice: 2200,
    discount: 16,
    rating: 4.6,
    reviewsCount: 412,
    category: 'electronics',
    categoryBn: 'ইলেকট্রনিক্স',
    code: 'EL-EAR-3031',
    subcategory: 'audio',
    subcategoryBn: 'ইয়ারবাডস ও অডিও',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60'
    ],
    description: 'Anker Soundcore P20i features powerful 10mm drivers, customized EQ with Soundcore app, ultra-long 30-hour playtime, and IPX5 water resistance.',
    descriptionBn: 'অ্যাঙ্কর সাউন্ডকোর পি২০আই-তে আছে শক্তিশালী ১০ মিমি ড্রাইভার, সাউন্ডকোর অ্যাপের মাধ্যমে কাস্টমাইজড ইকিউ, বিরামহীন ৩০ ঘণ্টার প্লেটাইম এবং আইপিএক্স৫ ওয়াটার রেজিস্ট্যান্স রেটিং।',
    stock: 35,
    flashSale: true,
    soldCount: 2240,
    specifications: {
      Driver: '10mm Dynamic',
      Bluetooth: 'Version 5.3',
      BatteryLife: '10 hours single charge (30 hours with case)',
      Waterproof: 'IPX5 rated',
      AppSupport: 'Soundcore App Customization'
    },
    specificationsBn: {
      ড্রাইভার: '১০ মিমি ডাইনামিক',
      ব্লুটুথ: 'ভার্সন ৫.৩',
      ব্যাটারি: '১০ ঘণ্টা সিঙ্গেল চার্জে (৩‌০ ঘণ্টা কেস সহ)',
      ওয়াটারপ্রুফ: 'আইপিএক্স৫ রেটিং',
      অ্যাপ: 'সাউন্ডকোর অ্যাপ সাপোর্ট'
    }
  },
  {
    id: 'fa-shirt',
    name: 'Premium Slim Fit Cotton Polo Shirt for Men',
    nameBn: 'পুরুষদের প্রিমিয়াম স্লিম ফিট কটন পোলো শার্ট',
    price: 650,
    originalPrice: 990,
    discount: 34,
    rating: 4.5,
    reviewsCount: 152,
    category: 'fashion',
    categoryBn: 'ফ্যাশন',
    code: 'FA-PST-4045',
    subcategory: 'polo_shirt',
    subcategoryBn: 'পুরুষদের পোলো শার্ট',
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=60'
    ],
    description: 'Made from 100% premium pique cotton, this breathable, slim-fit Polo T-shirt is perfect for both casual and semi-formal wear, offering long-lasting color and soft stitching.',
    descriptionBn: '১০০% প্রিমিয়াম পিক কটন কাপড়ে তৈরি এই আরামদায়ক এবং স্লিম-ফিট পোলো শার্টটি সাধারণ আড্ডা বা অফিসে পরার জন্য অত্যন্ত চমৎকার। এর নিখুঁত সেলাই ও কালার স্থায়ীত্ব অসাধারণ।',
    stock: 80,
    flashSale: true,
    soldCount: 840,
    specifications: {
      Material: '100% Cotton Pique',
      Fit: 'Slim Fit',
      Country: 'Made in Bangladesh',
      Colors: 'Navy Blue, Maroon, Olive Green, Black, White'
    },
    specificationsBn: {
      উপাদান: '১০০% পিক কটন',
      ফিটিং: 'স্লিম ফিট',
      অরিজিন: 'মেড ইন বাংলাদেশ',
      রঙ: 'নেভি ব্লু, মেরুন, জলপাই গ্রিন, কালো, সাদা'
    }
  },
  {
    id: 'fa-saree',
    name: 'Handloom Pure Cotton Tant Saree',
    nameBn: 'তাঁতের খাঁটি সুতি শাড়ি - লাল ও সাদা কম্বো',
    price: 1650,
    originalPrice: 2200,
    discount: 25,
    rating: 4.7,
    reviewsCount: 89,
    category: 'fashion',
    categoryBn: 'ফ্যাশন',
    code: 'FA-SAR-5052',
    subcategory: 'saree',
    subcategoryBn: 'শাড়ি',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=60',
    description: 'Traditional Bengali handloom cotton saree woven with fine threads. Elegant design perfect for festivals, puja, weddings, and cultural celebrations.',
    descriptionBn: 'বাঙালি ঐতিহ্যের তাঁতের তৈরি খাঁটি সুতি শাড়ি। যেকোনো উৎসব, পূজা, বৈশাখ অথবা বিশেষ অনুষ্ঠানে পরার জন্য অত্যন্ত রুচিশীল এই শাড়িটি দীর্ঘস্থায়ী ও মসৃণ টেক্সচারের।',
    stock: 12,
    flashSale: false,
    soldCount: 310,
    specifications: {
      Fabric: '100% Pure Tangail Cotton',
      Length: '5.5 Meters (without blouse piece)',
      Pattern: 'Traditional Floral Border Design',
      Wash: 'Hand wash recommended'
    },
    specificationsBn: {
      ফেব্রিক: '১০০% খাঁটি টাঙ্গাইল সুতি',
      দৈর্ঘ্য: '৫.৫ মিটার (ব্লাউজ পিস ছাড়া)',
      নকশা: 'ঐতিহ্যবাহী নকশিকাঁথা আঁচল ও পাড়',
      ধোয়া: 'হালকা ঠান্ডা পানিতে শ্যাম্পু ওয়াস বা ড্রাই ক্লিন'
    }
  },
  {
    id: 'fa-watch',
    name: 'Haylou Solar Lite Waterproof Smart Watch',
    nameBn: 'হায়লু সোলার লাইট ওয়াটারপ্রুফ স্মার্ট ওয়াচ',
    price: 2450,
    originalPrice: 3200,
    discount: 23,
    rating: 4.4,
    reviewsCount: 223,
    category: 'electronics',
    categoryBn: 'ইলেকট্রনিক্স',
    code: 'EL-WCH-6068',
    subcategory: 'smart_watch',
    subcategoryBn: 'স্মার্ট ওয়াচ',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=60',
    description: 'A stylish circular smartwatch featuring a 1.38" display, 100+ sport modes, dynamic heart rate and blood oxygen monitoring, and up to 20 days battery backup.',
    descriptionBn: '১.৩৮ ইঞ্চি রঙিন ডিসপ্লের একটি আকর্ষণীয় বৃত্তাকার স্মার্টওয়াচ। এতে রয়েছে ১০০টিরও বেশি স্পোর্টস মোড, হার্ট রেট ও রক্তের অক্সিজেন ট্র্যাকিং ফিচার, এবং টানা ২০ দিনের ব্যাটারি ব্যাকআপ।',
    stock: 22,
    flashSale: true,
    soldCount: 780,
    specifications: {
      Display: '1.38" HD Display',
      Sensors: 'Heart Rate, SpO2, Sleep Tracker',
      Watercore: 'IP68 Waterproof',
      Battery: 'Up to 20 days (Standby)',
      Support: 'Android and iOS compatible via Haylou Fun App'
    },
    specificationsBn: {
      ডিসপ্লে: '১.৩৮ ইঞ্চি এইচডি স্ক্রিন',
      সেন্সর: 'হার্ট রেট, রক্তের অক্সিজেন, স্লিপ ট্র্যাকিং',
      ওয়াটারপ্রুফ: 'IP68 রেটিং',
      ব্যাটারি: '২০ দিন পর্যন্ত (স্ট্যান্ডবাই)',
      অ্যাপ: 'হায়লু ফান মোবাইল অ্যাপ'
    }
  },
  {
    id: 'hk-blender',
    name: 'Miyako YT-4612 Premium Blender & Mixer',
    nameBn: 'মিয়াকো ওয়াইটি-৪৬১২ প্রিমিয়াম ব্লেন্ডার ও মিক্সার',
    price: 3400,
    originalPrice: 4200,
    discount: 19,
    rating: 4.6,
    reviewsCount: 167,
    category: 'home_decor',
    categoryBn: 'গৃহসজ্জা',
    code: 'HD-BLN-7071',
    subcategory: 'blender_juicer',
    subcategoryBn: 'ব্লেন্ডার ও জুসার',
    image: 'https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop&q=60',
    description: 'High performance 3-in-1 Miyako Blender. Powerful 750W copper motor with 3 heavy-duty stainless steel jars for blending, wet-grinding, and dry-grinding food easily.',
    descriptionBn: 'উচ্চ ক্ষমতাসম্পন্ন ৩-ইন-১ মিয়াকো ব্লেন্ডার। রান্নার সুবিধার্থে মসলা পিষতে, শরবত বা ডাল ব্লেন্ড করার জন্য ৩টি হেভি ডিউটি স্টেইনলেস স্টিল জার ও ৭৫০ ওয়াটের কপার মোটরযুক্ত।',
    stock: 18,
    flashSale: false,
    soldCount: 420,
    specifications: {
      Motor: '750W 100% Copper Motor',
      Jars: '3 Stainless Steel Jars (Wet, Dry, Chutney)',
      Speed: '3-speed control with pulse function',
      Safety: 'Overload Protection'
    },
    specificationsBn: {
      মোটর: '৭৫০ ওয়াট কপার মোটর',
      জার: '৩টি স্টেইনলেস স্টিল জার',
      গতি: '৩ ধাপ স্পিড কন্ট্রোল ও পালস ফাংশন',
      নিরাপত্তা: 'ওভারলোড প্রোটেকশন সিস্টেম'
    }
  },
  {
    id: 'bh-facewash',
    name: 'Himalaya Purifying Neem Face Wash - 150ml',
    nameBn: 'হিমালয়া পিউরিফাইং নিম ফেস ওয়াশ - ১৫০ মিলি',
    price: 340,
    originalPrice: 400,
    discount: 15,
    rating: 4.7,
    reviewsCount: 512,
    category: 'personal_care',
    categoryBn: 'রূপচর্চা',
    code: 'PC-FWS-8082',
    subcategory: 'facewash',
    subcategoryBn: 'ফেসওয়াশ',
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&auto=format&fit=crop&q=60',
    description: 'Himalayas Purifying Neem Face Wash is a soap-free, herbal formulation that cleans impurities and helps clear pimples. A natural blend of Neem and Turmeric.',
    descriptionBn: 'হিমালয়া পিউরিফাইং নিম ফেস ওয়াশ একটি সাবানমুক্ত সম্পূর্ণ হার্বাল ফর্মুলা, যা ত্বকের ভেতরের ময়লা পরিষ্কার করে ব্রণ সারাতে অত্যন্ত কার্যকর ভূমিকা পালন করে। নিম ও হলুদের সমন্বয়ে গঠিত।',
    stock: 120,
    flashSale: true,
    soldCount: 5200,
    specifications: {
      Volume: '150 ml',
      KeyIngredients: 'Neem & Turmeric',
      SkinType: 'All Skin Types (Pimple-prone skin)',
      Formulation: 'Soap-free Gel'
    },
    specificationsBn: {
      'পরিমাণ': '১৫০ মিলি',
      'উপাদান': 'নিম পাতা ও খাঁটি হলুদ',
      'ত্বকের ধরন': 'ব্রণ প্রবণ ও সব ধরনের ত্বক',
      'ফর্মুলা': 'সাবানমুক্ত মৃদু ফোমিং জেল'
    }
  },
  {
    id: 'bh-shaver',
    name: 'Gillette Mach 3 Shaving Razor with 2 Cartridges',
    nameBn: 'জিলেট ম্যাক ৩ শেভিং রেজার এবং ২টি কার্তুজ',
    price: 680,
    originalPrice: 850,
    discount: 20,
    rating: 4.5,
    reviewsCount: 145,
    category: 'personal_care',
    categoryBn: 'রূপচর্চা',
    code: 'PC-SHV-9095',
    subcategory: 'soap',
    subcategoryBn: 'সাবান',
    image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=600&auto=format&fit=crop&q=60',
    description: 'Designed for a closer shave without irritation, Gillette Mach 3 features 3 DuraComfort nano blades, lubricated strip fade indicators, and responsive blade suspension.',
    descriptionBn: 'ত্বকে কোনো খসখসে অনুভূতি ছাড়াই নিখুঁত শেভ করতে জিলেট ম্যাক ৩ অতুলনীয়। এতে রয়েছে ৩টি ডুরাকমফোর্ট ন্যানো ব্লেড, লুব্রিকেটেড স্মুদিং স্ট্রিপ ও ফ্লেক্সিবল গ্রিপ হ্যান্ডেল।',
    stock: 50,
    flashSale: false,
    soldCount: 1100,
    specifications: {
      Blades: '3 High Definition Nano Blades',
      Ergonomics: 'Premium heavy metal grip handle',
      Refills: 'Comes with 2 additional cartridges',
      Lubrication: 'Gel Strip with vitamin E and Aloe'
    },
    specificationsBn: {
      ব্লেড: '৩টি অত্যন্ত সূক্ষ্ম ডুরাকমফোর্ট ব্লেড',
      হ্যান্ডেল: 'ভারি আরামদায়ক প্রিমিয়াম মেটাল গ্রিপ',
      প্যাকেজ: '১টি রেজার সাথে ২টি রিফিল কার্তুজ',
      লুব্রিকেন্ট: 'অ্যালোভেরা সমৃদ্ধ লুব্রিকেটিং জেল স্ট্রিপ'
    }
  },
  {
    id: 'gr-nuts',
    name: 'Premium Mixed Dry Fruits & Nuts Honey Blend - 500g',
    nameBn: 'প্রিমিয়াম মিক্সড ড্রাই ফ্রুটস ও বাদাম হানিনাটস - ৫০০ গ্রাম',
    price: 690,
    originalPrice: 950,
    discount: 27,
    rating: 4.8,
    reviewsCount: 198,
    category: 'groceries',
    categoryBn: 'মুদিবাজার',
    code: 'GR-NUT-1011',
    subcategory: 'spices',
    subcategoryBn: 'মসলা',
    image: 'https://images.unsplash.com/photo-1511194247592-ffbe59302ca7?w=600&auto=format&fit=crop&q=60',
    description: 'A highly nutritious energy blend containing Cashew, Almonds, Pistachios, Walnuts, Raisins, Dried Apricots, Fig, and organic honey. Pure honey soaked superfood and delicious snack.',
    descriptionBn: 'শারীরিক শক্তি ও পুষ্টিগুণে সমৃদ্ধ প্রিমিয়াম হানিনাটস। এতে আছে কাঠবাদাম, কাজুবাদাম, পেস্তাবাদাম, আখরোট, কিশমিশ, খোবানি, ডুমুর এবং খাঁটি প্রাকৃতিক সুন্দরবনের মধু। শতভাগ কেমিক্যালমুক্ত।',
    stock: 45,
    flashSale: true,
    soldCount: 1350,
    specifications: {
      Weight: '500 grams',
      Ingredients: '10+ varieties of Premium Nuts & Honey',
      Preservatives: '100% Organic, No Artificial Preservatives',
      ShelfLife: '6 Months'
    },
    specificationsBn: {
      'ওজন': '৫০০ গ্রাম',
      'প্রধান উপাদান': '১০+ জাতের প্রিমিয়াম বাদাম ও ১‌০০% খাঁটি সুন্দরবনের মধু',
      'ভেজাল': 'শতভাগ কেমিক্যাল ও প্রিজারভেটিভ মুক্ত',
      'স্থায়ীত্ব': 'প্যাকেট খোলার পর ৬ মাস ভালো থাকে'
    }
  },
  {
    id: 'fa-backpack',
    name: 'YKK Zipper Travel & College Waterproof Backpack',
    nameBn: 'ওয়াইকেকে জিপার ট্রাভেল ও কলেজ ওয়াটারপ্রুফ ব্যাকপ্যাক',
    price: 1150,
    originalPrice: 1800,
    discount: 36,
    rating: 4.6,
    reviewsCount: 304,
    category: 'fashion',
    categoryBn: 'ফ্যাশন',
    code: 'FA-BPK-1215',
    subcategory: 'backpack',
    subcategoryBn: 'ব্যাগ ও ব্যাকপ্যাক',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=60',
    description: 'Water-resistant travel and laptop backpack featuring 3 spacious chambers, dedicated padded fit for up to 15.6" laptop, standard USB port charging interface, and durable YKK zippers.',
    descriptionBn: 'পানি নিরোধক চমৎকার ডিজাইনের ট্রাভেল ও ল্যাপটপ ব্যাকপ্যাক। এতে আছে ৩টি বিশাল চেম্বার, ১৫.৬ ইঞ্চি ল্যাপটপের জন্য প্যাডেড পকেট, চার্জ করার সুবিধা সহ ইউএসবি পোর্ট এবং বিশ্বস্ত YKK চেইন জিপার।',
    stock: 40,
    flashSale: false,
    soldCount: 1980,
    specifications: {
      Capacity: '35 Liters',
      Material: 'High-density Oxford Polyester (Water-repellent)',
      Zipper: 'Original heavy-duty YKK Zippers',
      LaptopChamber: 'Fits up to 15.6 Inch with custom sponge harness'
    },
    specificationsBn: {
      'ধারনক্ষমতা': '৩৫ লিটার',
      'মেটেরিয়াল': 'উচ্চ ঘনত্বের ওয়াটার-রেপেলেন্ট অক্সফোর্ড পলিয়েস্টার',
      'চেইন': 'আসল ওয়াটারপ্রুফ YKK মেтал জিপার',
      'ল্যাপটপ চেম্বার': '১৫.৬ ইঞ্চি ল্যাপটপ এবং প্যাডেড কুশন প্রটেকশন'
    }
  },
  {
    id: 'pkg-family',
    name: 'Super Premium Family Combo Pack',
    nameBn: 'সুপার প্রিমিয়াম ফ্যামিলি কম্বো প্যাক',
    price: 1950,
    originalPrice: 2500,
    discount: 22,
    rating: 4.9,
    reviewsCount: 124,
    category: 'package',
    categoryBn: 'প্যাকেজ',
    code: 'PK-FAM-1317',
    subcategory: 'fam_pkg',
    subcategoryBn: 'পারিবারিক প্যাকেজ',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=60',
    description: 'An ultimate nutrition bundle for the whole family! Includes Beautiful Sundarban Honey (500g), Premium Wood-pressed Mustard Oil (1L), Organic Chia Seeds (250g), and Premium Khejur (500g).',
    descriptionBn: 'পুরো পরিবারের জন্য চমৎকার স্বাস্থ্যকর পুষ্টির সমাহার! এই কম্বোতে রয়েছে সুন্দরবনের খাঁটি মধু (৫০০ গ্রাম), কাঠের ঘানিতে ভাঙা খাঁটি সরিষার তেল (১ লিটার), প্রিমিয়াম চিয়া সিড (২৫০ গ্রাম) এবং প্রিমিয়াম সুস্বাদু খেজুর (৫০০ গ্রাম)।',
    stock: 25,
    flashSale: true,
    soldCount: 520,
    specifications: {
      'Honey': '500g Sundarban',
      'Mustard Oil': '1 Liter Glass Bottle',
      'Chia Seeds': '250g Premium Grade',
      'Khejur': '500g Premium Mariam'
    },
    specificationsBn: {
      'মধু': '৫০০ গ্রাম খাঁটি সুন্দরবনের',
      'সরিষার তেল': '১ লিটার কাঠের ঘানিতে ভাঙা',
      'চিয়া সিড': '২৫০ গ্রাম প্রিমিয়াম গ্রেড',
      'খেজুর': '৫০০ গ্রাম প্রিমিয়াম মরিয়ম'
    }
  },
  {
    id: 'pkg-honey-ghee',
    name: 'Sundarban Pure Honey & Cow Ghee Combo',
    nameBn: 'খাঁটি সুন্দরবনের মধু ও গাওয়া ঘি কম্বো',
    price: 1350,
    originalPrice: 1600,
    discount: 15,
    rating: 4.8,
    reviewsCount: 88,
    category: 'package',
    categoryBn: 'প্যাকেজ',
    code: 'PK-HNG-1419',
    subcategory: 'savings_pkg',
    subcategoryBn: 'সাশ্রয়ী প্যাকেজ',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&auto=format&fit=crop&q=60',
    description: 'Double the health benefits with our high-demand combo of delicious Sundarban wild honey paired with premium home-crafted pure dairy cow Ghee.',
    descriptionBn: 'একসাথে ডাবল পুষ্টির চমৎকার উপহার! এই প্যাকেজে রয়েছে সুন্দরবনের প্রাকৃতিক চাকের খাঁটি মধু এবং সুগন্ধি প্রিমিয়াম গাওয়া ঘি। শতভাগ ভেজালমুক্ত এবং ঘরে তৈরি স্বাস্থ্যকর খাবার।',
    stock: 30,
    flashSale: false,
    soldCount: 312,
    specifications: {
      'Honey': '500g Wild Honey',
      'Ghee': '400g Pure Cow Ghee',
      'Certificate': 'BSCIC Laboratory Tested',
      'Packaging': 'Food-Grade Air-tight Jar'
    },
    specificationsBn: {
      'মধু': '৫০০ গ্রাম সুন্দরবনের চাকের মধু',
      'ঘি': ' ৪০০ গ্রাম প্রিমিয়াম গাওয়া ঘি',
      'পরীক্ষিত': 'ল্যাব টেস্টে স্বীকৃত বিশুদ্ধতা',
      'প্যাকেজিং': 'ফুড-গ্রেড চমৎকার এয়ার-টাইট জার'
    }
  },
  {
    id: 'fresh-veg-box',
    name: 'Direct Organic Fresh Vegetable Harvest Box',
    nameBn: 'সরাসরি মাঠের ফ্রেশ দেশী সবজি বক্স',
    price: 340,
    originalPrice: 420,
    discount: 19,
    rating: 4.7,
    reviewsCount: 95,
    category: 'fresh_groceries',
    categoryBn: 'কাঁচা বাজার',
    code: 'FR-VEG-1521',
    subcategory: 'veg',
    subcategoryBn: 'শাকসবজি',
    image: 'https://images.unsplash.com/photo-1566385278621-c5e7e94e460b?w=600&auto=format&fit=crop&q=60',
    description: 'Fresh organic vegetables picked straight from the farmers fields in Bogura and Jessore. Includes fresh tomatoes, eggplants, green-chillies, cauliflowers, and premium local potatoes.',
    descriptionBn: 'বগুড়া ও যশোরের কৃষকদের মাঠ থেকে সরাসরি সংগৃহীত সম্পূর্ণ রাসায়নিকহীন ফ্রেশ সবজির ঝুড়ি। এতে রয়েছে তাজা টমেটো, বেগুন, কাঁচামরিচ, ফুলকপি ও দেশী লাল আলু। প্রতিদিন সকালে ডেলিভারি করা হয়।',
    stock: 40,
    flashSale: true,
    soldCount: 820,
    specifications: {
      'Origin': 'Bogura & Jessore Farms',
      'Weight': 'approx. 4-5 kg Assorted',
      'Chemicals': '100% Pesticide & Formalin Free',
      'Delivery': 'Same Day Morning Express'
    },
    specificationsBn: {
      'উৎস': 'বগুড়া ও যশোরের মাঠ থেকে তাজা',
      'ওজন': 'প্রায় ৪-৫ কেজি মিশ্র সবজি',
      'ফরমালিন': 'সম্পূর্ণ ফরমালিন ও বিষমুক্ত গ্যারান্টি',
      'ডেলিভারি': 'অর্ডারের পরদিন সকালের এক্সপ্রেস হোম ডেলিভারি'
    }
  },
  {
    id: 'fresh-potatoes',
    name: 'Fresh Bogura Red Round Potatoes - 3kg',
    nameBn: 'বগুড়ার বিখ্যাত ফ্রেশ গোল লাল আলু - ৩ কেজি',
    price: 175,
    originalPrice: 200,
    discount: 12,
    rating: 4.6,
    reviewsCount: 204,
    category: 'fresh_groceries',
    categoryBn: 'কাঁচা বাজার',
    code: 'FR-POT-1623',
    subcategory: 'potato',
    subcategoryBn: 'আলু',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=60',
    description: 'The famous round red potatoes of Bogura. Rich in fiber, directly sourced, properly washed, and sorted with no rotten pieces.',
    descriptionBn: 'বগুড়ার মাটির সুস্বাদু গোল লাল আলু। বালুমুক্ত অত্যন্ত পরিষ্কার করে বাছাইকৃত চমৎকার আকারের লাল আলু, যাতে কোনো নষ্ট বা পচা আলুর অংশ নেই।',
    stock: 90,
    flashSale: false,
    soldCount: 1420,
    specifications: {
      'Weight': '3 KG Pack',
      'Variety': 'Bogura Local Red Round',
      'Moisture': 'Completely dry and sand-free',
      'Type': '100% Non-GMO'
    },
    specificationsBn: {
      'ওজন': '৩ কেজি নেট প্যাকেট',
      'জাত': 'বগুড়ার প্রিমিয়াম গোল লাল আলু',
      'পরিষ্কার': 'শতভাগ ধুয়ে শুকানো বালুমুক্ত আলু',
      'রাসায়নিক': 'শতভাগ অরগানিক'
    }
  },
  {
    id: 'frag-royal-attar',
    name: 'Premium Royal Oud Aromatic Attar - 12ml',
    nameBn: 'প্রিমিয়াম রয়েল উদ সুগন্ধি সুতি আতর - ১২ মিলি',
    price: 450,
    originalPrice: 650,
    discount: 30,
    rating: 4.8,
    reviewsCount: 110,
    category: 'beauty',
    categoryBn: 'বিউটি',
    code: 'BT-OUD-1725',
    subcategory: 'perfume',
    subcategoryBn: 'পারফিউম',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&auto=format&fit=crop&q=60',
    description: 'Experience luxury with this beautiful, organic, alcohol-free Oud Attar. High longevity of up to 48 hours with a refreshing, rich oriental aroma.',
    descriptionBn: 'সম্পূর্ণ অ্যালকোহলমুক্ত এবং ১০০% হালাল প্রিমিয়াম রয়েল উদ আতর। এর মিষ্টি এবং জমকালো সুগন্ধ আপনাকে রাখবে সারাদিন সতেজ। কাপড়ে একবার ব্যবহারে প্রায় ৪৮ ঘণ্টা পর্যন্ত স্থায়ী সুবাস দেয়।',
    stock: 18,
    flashSale: true,
    soldCount: 460,
    specifications: {
      'Volume': '12 ml Premium Glass Bottle',
      'Alcohol': '0% Alcohol (100% Halal Pure Concentrated)',
      'Longevity': 'Up to 24-48 Hours guaranteed',
      'Fragrance Note': 'Oud, Sweet Amber, Sandalwood and Rose'
    },
    specificationsBn: {
      'পরিমাণ': '১২ মিলি চমৎকার রাজকীয় কাঁচের শিশি',
      'অ্যালকোহল': '০% অ্যালকোহল (১০০% হালাল খাঁটি আতর)',
      'স্থায়ীত্ব': '২৪ থেকে ৪৮ ঘণ্টা পর্যন্ত চমৎকার সুবাস',
      'সেন্ট নোট': 'আসল উদ, মিষ্টি আম্বর, চন্দন ও গোলাপের মিশ্রণ'
    }
  },
  {
    id: 'frag-kusturi-oil',
    name: 'Aromatic Musk Kasturi Pure Perfume Oil - 8ml',
    nameBn: 'আসল কস্তুরী সুগন্ধি পারফিউম অয়েল - ৮ মিলি',
    price: 520,
    originalPrice: 700,
    discount: 25,
    rating: 4.7,
    reviewsCount: 74,
    category: 'beauty',
    categoryBn: 'বিউটি',
    code: 'BT-MUS-1827',
    subcategory: 'perfume',
    subcategoryBn: 'পারফিউম',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop&q=60',
    description: 'A deeply enchanting traditional fragrance oil crafted with premium Kasturi Musk & amber notes. Thick concentrate that leaves a grand aroma trailing behind you.',
    descriptionBn: 'ঐতিহ্যবাহী অত্যন্ত রাজকীয় মিষ্টি সুবাসের কস্তুরী হরিণের সুগন্ধি পারফিউম অয়েল। ঘন টেক্সচারের কারণে অল্প একটু ব্যবহারেই আপনাকে ঘিরে রাখবে এক মোহনীয় সুমিষ্ট সুবাস।',
    stock: 15,
    flashSale: false,
    soldCount: 220,
    specifications: {
      'Volume': '8 ml Roll-on Bottle',
      'Longevity': 'Intense scent trail for up to 36 hours',
      'Formulation': 'Concentrated Botanical Oil Blend',
      'Origin': 'Imported Premium Ingredients'
    },
    specificationsBn: {
      'পরিমাণ': '৮ মিলি রোল-অন সুবিধাসহ গ্লাস বোতল',
      'স্থায়ীত্ব': '৩৬ ঘণ্টা পর্যন্ত দীর্ঘস্থায়ী সুরভী',
      'উপাদান': 'প্রাকৃতিক ভেষজ এবং কস্তুরী কম্বিনেশন',
      'উৎস': 'আমদানিকৃত প্রিমিয়াম সুগন্ধি নির্যাস'
    }
  }
];

export const VOUCHERS = [
  { code: 'DARAZ50', discount: 50, type: 'flat', description: 'Flat ৳50 Off on Any Purchase', descriptionBn: 'যেকোনো ক্রয়ে ফ্ল্যাট ৫০ টাকা ছাড়' },
  { code: 'EID2026', discount: 15, type: 'percent', description: '15% Off Up to ৳500 on Fashion & Electronics', descriptionBn: 'ফ্যাশন ও ইলেকট্রনিক্সে ১৫% ছাড় (৫০০ টাকা পর্যন্ত)' },
  { code: 'FREESHIP', discount: 120, type: 'free_shipping', description: 'Free Express Shipping in Bangladesh', descriptionBn: 'সারা বাংলাদেশে ফ্রি এক্সপ্রেস ডেলিভারি' }
];
