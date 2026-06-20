/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Folder,
  FolderOpen,
  Tv,
  Layers,
  Wind,
  Soup,
  Zap,
  Sparkles,
  Shirt,
  ShoppingBag,
  Apple,
  Package,
  Leaf,
  Heart,
  Baby,
  Home,
  Scissors,
  Gift,
  Flame,
  Utensils,
  Smile,
  Eye,
  Smartphone,
  Watch,
  Headphones
} from 'lucide-react';

interface SubcategoryFoldersProps {
  language: 'en' | 'bn';
  selectedCategory: string;
  selectedSubcategory: string;
  setSelectedSubcategory: (subcat: string) => void;
}

export default function SubcategoryFolders({
  language,
  selectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
}: SubcategoryFoldersProps) {
  // Only render for defined categories that are not 'all'
  if (!selectedCategory || selectedCategory === 'all') {
    return null;
  }

  // Subcategory Definitions matching EXACT user requirements
  const subcategoryMap: { [key: string]: Array<{ id: string; en: string; bn: string; icon: any }> } = {
    electronics: [
      { id: 'all', en: 'All Electronics', bn: 'সব ইলেক্ট্রনিক', icon: Folder },
      { id: 'television', en: 'Television', bn: 'টেলিভিশন', icon: Tv },
      { id: 'refrigerator', en: 'Refrigerator', bn: 'রেফ্রিজারেটর', icon: Layers },
      { id: 'fan', en: 'Fan', bn: 'ফ্যান', icon: Wind },
      { id: 'rice_cooker', en: 'Rice Cooker', bn: 'রাইস কুকার', icon: Soup },
      { id: 'blender_juicer', en: 'Blender & Juicer', bn: 'ব্লেন্ডার ও জুসার', icon: Zap },
      { id: 'iron', en: 'Iron', bn: 'ইস্ত্রি', icon: Sparkles },
      { id: 'microwave', en: 'Microwave', bn: 'মাইক্রোওয়েভ', icon: Layers },
      { id: 'electric_kettle', en: 'Electric Kettle', bn: 'ইলেকট্রিক কেটলি', icon: Zap },
      { id: 'water_purifier', en: 'Water Purifier', bn: 'ওয়াটার পিউরিফায়ার', icon: Sparkles },
      { id: 'led_light', en: 'LED Light', bn: 'এলইডি লাইট', icon: Sparkles },
      { id: 'extension_board', en: 'Extension Board', bn: 'এক্সটেনশন বোর্ড', icon: Zap }
    ],
    fashion: [
      { id: 'all', en: 'All Fashion', bn: 'সব ফ্যাশন', icon: Folder },
      { id: 'men_clothing', en: 'Men\'s Clothing', bn: 'পুরুষদের পোশাক', icon: Shirt },
      { id: 'women_clothing', en: 'Women\'s Clothing', bn: 'নারীদের পোশাক', icon: Shirt },
      { id: 'kids_clothing', en: 'Kids\' Clothing', bn: 'শিশুদের পোশাক', icon: Baby },
      { id: 'panjabi', en: 'Panjabi', bn: 'পাঞ্জাবি', icon: Shirt },
      { id: 'saree', en: 'Saree', bn: 'শাড়ি', icon: Sparkles },
      { id: 'three_piece', en: 'Three-Piece', bn: 'থ্রি-পিস', icon: Sparkles },
      { id: 'tshirt', en: 'T-Shirt', bn: 'টি-শার্ট', icon: Shirt },
      { id: 'jeans', en: 'Jeans', bn: 'জিন্স', icon: Shirt },
      { id: 'shoes', en: 'Shoes', bn: 'জুতা', icon: ShoppingBag },
      { id: 'bag', en: 'Bag', bn: 'ব্যাগ', icon: ShoppingBag },
      { id: 'belt', en: 'Belt', bn: 'বেল্ট', icon: Layers },
      { id: 'watch', en: 'Watch', bn: 'ঘড়ি', icon: Watch },
      { id: 'hijab_orna', en: 'Hijab & Orna', bn: 'হিজাব ও ওড়না', icon: Sparkles }
    ],
    home_decor: [
      { id: 'all', en: 'All Home Decor', bn: 'সব গৃহসজ্জা', icon: Folder },
      { id: 'curtain', en: 'Curtain', bn: 'পর্দা', icon: Home },
      { id: 'bedsheet', en: 'Bedsheet', bn: 'বেডশিট', icon: Layers },
      { id: 'cushion_cover', en: 'Cushion Cover', bn: 'কুশন কভার', icon: Home },
      { id: 'wall_decor', en: 'Wall Decor', bn: 'ওয়াল ডেকোর', icon: Sparkles },
      { id: 'vase', en: 'Vase', bn: 'ফুলদানি', icon: Sparkles },
      { id: 'carpet', en: 'Carpet', bn: 'কার্পেট', icon: Home },
      { id: 'showpiece', en: 'Showpiece', bn: 'শোপিস', icon: Gift },
      { id: 'mirror', en: 'Mirror', bn: 'আয়না', icon: Smile },
      { id: 'light_decor', en: 'Lighting Decoration', bn: 'লাইটিং ডেকোরেশন', icon: Sparkles },
      { id: 'dining_decor', en: 'Dining Decor', bn: 'ডাইনিং সাজসজ্জা', icon: Utensils }
    ],
    personal_care: [
      { id: 'all', en: 'All Personal Care', bn: 'সব রূপচর্চা', icon: Folder },
      { id: 'facewash', en: 'Face Wash', bn: 'ফেসওয়াশ', icon: Smile },
      { id: 'cream', en: 'Cream', bn: 'ক্রিম', icon: Sparkles },
      { id: 'facepack', en: 'Face Pack', bn: 'ফেস প্যাক', icon: Smile },
      { id: 'toner', en: 'Toner', bn: 'টোনার', icon: Sparkles },
      { id: 'serum', en: 'Serum', bn: 'সিরাম', icon: Sparkles },
      { id: 'sunscreen', en: 'Sunscreen', bn: 'সানস্ক্রিন', icon: Smile },
      { id: 'hair_oil', en: 'Hair Oil', bn: 'হেয়ার অয়েল', icon: Sparkles },
      { id: 'shampoo', en: 'Shampoo', bn: 'শ্যাম্পু', icon: Scissors },
      { id: 'conditioner', en: 'Conditioner', bn: 'कন্ডিশনার', icon: Sparkles },
      { id: 'soap', en: 'Soap', bn: 'সাবান', icon: Sparkles },
      { id: 'body_lotion', en: 'Body Lotion', bn: 'বডি লোশন', icon: Sparkles }
    ],
    groceries: [
      { id: 'all', en: 'All Groceries', bn: 'সব মুদিবাজার', icon: Folder },
      { id: 'rice', en: 'Rice', bn: 'চাল', icon: Soup },
      { id: 'dal', en: 'Dal', bn: 'ডাল', icon: Soup },
      { id: 'oil', en: 'Oil', bn: 'তেল', icon: Soup },
      { id: 'sugar', en: 'Sugar', bn: 'চিনি', icon: Apple },
      { id: 'salt', en: 'Salt', bn: 'লবণ', icon: Apple },
      { id: 'atta', en: 'Atta', bn: 'আটা', icon: Soup },
      { id: 'maida', en: 'Maida', bn: 'ময়দা', icon: Soup },
      { id: 'suji', en: 'Suji', bn: 'সুজি', icon: Soup },
      { id: 'spices', en: 'Spices', bn: 'মসলা', icon: Wind },
      { id: 'biscuits', en: 'Biscuits', bn: 'বিস্কুট', icon: Gift },
      { id: 'noodles', en: 'Noodles', bn: 'নুডলস', icon: Soup },
      { id: 'tea', en: 'Tea', bn: 'চা', icon: Wind },
      { id: 'coffee', en: 'Coffee', bn: 'কফি', icon: Zap },
      { id: 'detergent', en: 'Detergent', bn: 'ডিটারজেন্ট', icon: Sparkles },
      { id: 'tissue', en: 'Tissue', bn: 'টিস্যু', icon: Layers }
    ],
    package: [
      { id: 'all', en: 'All Packages', bn: 'সব প্যাকেজ', icon: Folder },
      { id: 'fam_pkg', en: 'Family Package', bn: 'পারিবারিক প্যাকেজ', icon: Gift },
      { id: 'monthly_pkg', en: 'Monthly Bazaar Package', bn: 'মাসিক বাজার প্যাকেজ', icon: Package },
      { id: 'savings_pkg', en: 'Savings Package', bn: 'সাশ্রয়ী প্যাকেজ', icon: Gift },
      { id: 'ramadan_pkg', en: 'Ramadan Package', bn: 'রমজান প্যাকেজ', icon: Gift },
      { id: 'festival_pkg', en: 'Festival Package', bn: 'উৎসব প্যাকেজ', icon: Gift },
      { id: 'new_customer_pkg', en: 'New Customer Package', bn: 'নতুন গ্রাহক প্যাকেজ', icon: Smile },
      { id: 'reseller_pkg', en: 'Reseller Package', bn: 'রিসেলার প্যাকেজ', icon: Sparkles }
    ],
    fresh_groceries: [
      { id: 'all', en: 'All Fresh items', bn: 'সব কাঁচা বাজার', icon: Folder },
      { id: 'veg', en: 'Vegetables', bn: 'শাকসবজি', icon: Leaf },
      { id: 'fish', en: 'Fish', bn: 'মাছ', icon: Leaf },
      { id: 'meat', en: 'Meat', bn: 'মাংস', icon: Soup },
      { id: 'egg', en: 'Egg', bn: 'ডিম', icon: Sparkles },
      { id: 'onion', en: 'Onion', bn: 'পেঁয়াজ', icon: Leaf },
      { id: 'garlic', en: 'Garlic', bn: 'রসুন', icon: Leaf },
      { id: 'ginger', en: 'Ginger', bn: 'আদা', icon: Leaf },
      { id: 'chili', en: 'Green Chilli', bn: 'কাঁচামরিচ', icon: Leaf },
      { id: 'potato', en: 'Potato', bn: 'আলু', icon: Leaf },
      { id: 'tomato', en: 'Tomato', bn: 'টমেটো', icon: Leaf },
      { id: 'fruit', en: 'Fruits', bn: 'ফলমূল', icon: Apple },
      { id: 'local_chicken', en: 'Local Chicken', bn: 'দেশি মুরগি', icon: Leaf }
    ],
    beauty: [
      { id: 'all', en: 'All Beauty', bn: 'সব বিউটি', icon: Folder },
      { id: 'lipstick', en: 'Lipstick', bn: 'লিপস্টিক', icon: Sparkles },
      { id: 'foundation', en: 'Foundation', bn: 'ফাউন্ডেশন', icon: Smile },
      { id: 'face_powder', en: 'Face Powder', bn: 'ফেস পাউডার', icon: Smile },
      { id: 'kajal', en: 'Kajal', bn: 'কাজল', icon: Eye },
      { id: 'eyeliner', en: 'Eye Liner', bn: 'আইলাইনার', icon: Eye },
      { id: 'nail_polish', en: 'Nail Polish', bn: 'নেইল পলিশ', icon: Sparkles },
      { id: 'makeup_brush', en: 'Makeup Brush', bn: 'মেকআপ ব্রাশ', icon: Scissors },
      { id: 'makeup_remover', en: 'Makeup Remover', bn: 'মেকআপ রিমুভার', icon: Smile },
      { id: 'perfume', en: 'Perfume', bn: 'পারফিউম', icon: Flame },
      { id: 'deodorant', en: 'Deodorant', bn: 'ডিওডোরেন্ট', icon: Flame }
    ],
    gadget: [
      { id: 'all', en: 'All Gadgets', bn: 'সব গ্যাজেট', icon: Folder },
      { id: 'mobile_phone', en: 'Mobile Phone', bn: 'মোবাইল ফোন', icon: Smartphone },
      { id: 'smart_watch', en: 'Smart Watch', bn: 'স্মার্ট ওয়াচ', icon: Watch },
      { id: 'earphone', en: 'Earphone', bn: 'ইয়ারফোন', icon: Headphones },
      { id: 'headphone', en: 'Headphone', bn: 'হেডফোন', icon: Headphones },
      { id: 'charger', en: 'Charger', bn: 'চার্জার', icon: Zap },
      { id: 'power_bank', en: 'Power Bank', bn: 'পাওয়ার ব্যাংক', icon: Zap },
      { id: 'bluetooth_speaker', en: 'Bluetooth Speaker', bn: 'ব্লুটুথ স্পিকার', icon: Tv },
      { id: 'memory_card', en: 'Memory Card', bn: 'মেমোরি কার্ড', icon: Layers },
      { id: 'usb_cable', en: 'USB Cable', bn: 'ইউএসবি কেবল', icon: Zap },
      { id: 'trimer', en: 'Trimmer', bn: 'ট্রিমার', icon: Scissors },
      { id: 'selfie_stick', en: 'Selfie Stick', bn: 'সেলফি স্টিক', icon: Smartphone }
    ],
    skincare: [
      { id: 'all', en: 'All Skin Care', bn: 'সব স্কিন কেয়ার', icon: Folder },
      { id: 'cleanser', en: 'Cleanser', bn: 'ক্লিনজার', icon: Smile },
      { id: 'facewash_skin', en: 'Face Wash', bn: 'ফেসওয়াশ', icon: Smile },
      { id: 'moisturizer', en: 'Moisturizer', bn: 'ময়েশ্চারাইজার', icon: Sparkles },
      { id: 'sunscreen_skin', en: 'Sunscreen', bn: 'সানস্ক্রিন', icon: Smile },
      { id: 'serum_skin', en: 'Serum', bn: 'সিরাম', icon: Sparkles },
      { id: 'toner_skin', en: 'Toner', bn: 'টোনার', icon: Sparkles },
      { id: 'night_cream', en: 'Night Cream', bn: 'নাইট ক্রিম', icon: Smile },
      { id: 'scrub', en: 'Scrub', bn: 'স্ক্রাব', icon: Sparkles },
      { id: 'facemask', en: 'Face Mask', bn: 'ফেস মাস্ক', icon: Smile },
      { id: 'eye_cream', en: 'Eye Cream', bn: 'আই ক্রিম', icon: Eye },
      { id: 'acne_care', en: 'Acne Care', bn: 'একনে কেয়ার', icon: Heart }
    ],
    kids_mom: [
      { id: 'all', en: 'All Mimi & Wow', bn: 'সব মিমি ও ওয়াও', icon: Folder },
      { id: 'diaper', en: 'Baby Diaper', bn: 'বেবি ডায়াপার', icon: Layers },
      { id: 'baby_food', en: 'Baby Food', bn: 'বেবি ফুড', icon: Soup },
      { id: 'baby_soap', en: 'Baby Soap', bn: 'বেবি সাবান', icon: Sparkles },
      { id: 'baby_shampoo', en: 'Baby Shampoo', bn: 'বেবি শ্যাম্পু', icon: Scissors },
      { id: 'baby_lotion', en: 'Baby Lotion', bn: 'বেবি লোশন', icon: Sparkles },
      { id: 'feeding_bottle', en: 'Feeding Bottle', bn: 'ফিডিং বোতল', icon: Gift },
      { id: 'baby_clothing', en: 'Baby Clothing', bn: 'বেবি পোশাক', icon: Shirt },
      { id: 'toys', en: 'Toys', bn: 'খেলনা', icon: Gift },
      { id: 'baby_wipes', en: 'Baby Wipes', bn: 'বেবি ওয়াইপস', icon: Layers },
      { id: 'mos_net', en: 'Mosquito Net', bn: 'মশারি', icon: Wind },
      { id: 'mom_care', en: 'Mom Care', bn: 'মায়ের যত্নের পণ্য', icon: Heart }
    ]
  };

  const subcats = subcategoryMap[selectedCategory];

  // If we don't have defined subcategories for this category, render nothing
  if (!subcats) {
    return null;
  }

  // Accent styling for each category to match brand visual rhythm perfectly
  const categoryAccents: { [key: string]: { border: string; text: string; lightBg: string; activeBg: string; dot: string } } = {
    electronics: { border: 'border-blue-200 dark:border-blue-900', text: 'text-blue-600 dark:text-blue-400', lightBg: 'bg-blue-600/10 dark:bg-blue-500/20', activeBg: 'bg-blue-600 dark:bg-blue-600 border-blue-600', dot: 'bg-blue-500' },
    fashion: { border: 'border-pink-200 dark:border-pink-900', text: 'text-pink-600 dark:text-pink-400', lightBg: 'bg-pink-600/10 dark:bg-pink-500/20', activeBg: 'bg-pink-600 dark:bg-pink-600 border-pink-600', dot: 'bg-pink-500' },
    home_decor: { border: 'border-green-200 dark:border-green-900', text: 'text-green-600 dark:text-green-400', lightBg: 'bg-green-600/10 dark:bg-green-500/20', activeBg: 'bg-green-600 dark:bg-green-600 border-green-600', dot: 'bg-green-500' },
    personal_care: { border: 'border-yellow-250 dark:border-yellow-905', text: 'text-yellow-600 dark:text-yellow-450', lightBg: 'bg-yellow-500/10 dark:bg-yellow-500/20', activeBg: 'bg-yellow-500 dark:bg-yellow-500 border-yellow-500', dot: 'bg-yellow-500' },
    groceries: { border: 'border-purple-200 dark:border-purple-900', text: 'text-purple-600 dark:text-purple-400', lightBg: 'bg-purple-600/10 dark:bg-purple-500/20', activeBg: 'bg-purple-600 dark:bg-purple-600 border-purple-600', dot: 'bg-purple-500' },
    package: { border: 'border-red-200 dark:border-red-900', text: 'text-red-655 dark:text-red-400', lightBg: 'bg-red-600/10 dark:bg-red-500/20', activeBg: 'bg-red-600 dark:bg-red-600 border-red-600', dot: 'bg-red-500' },
    fresh_groceries: { border: 'border-emerald-200 dark:border-emerald-900', text: 'text-emerald-705 dark:text-emerald-400', lightBg: 'bg-emerald-600/10 dark:bg-emerald-500/20', activeBg: 'bg-emerald-600 dark:bg-emerald-600 border-emerald-600', dot: 'bg-emerald-500' },
    beauty: { border: 'border-fuchsia-200 dark:border-fuchsia-900', text: 'text-fuchsia-600 dark:text-fuchsia-400', lightBg: 'bg-fuchsia-600/10 dark:bg-fuchsia-500/20', activeBg: 'bg-fuchsia-600 dark:bg-fuchsia-600 border-fuchsia-600', dot: 'bg-fuchsia-500' },
    gadget: { border: 'border-indigo-200 dark:border-indigo-900', text: 'text-indigo-600 dark:text-indigo-400', lightBg: 'bg-indigo-600/10 dark:bg-indigo-500/20', activeBg: 'bg-indigo-600 dark:bg-indigo-600 border-indigo-600', dot: 'bg-indigo-500' },
    skincare: { border: 'border-rose-200 dark:border-rose-900', text: 'text-rose-600 dark:text-rose-400', lightBg: 'bg-rose-600/10 dark:bg-rose-500/20', activeBg: 'bg-rose-600 dark:bg-rose-600 border-rose-600', dot: 'bg-rose-500' },
    kids_mom: { border: 'border-teal-200 dark:border-teal-900', text: 'text-teal-650 dark:text-teal-400', lightBg: 'bg-teal-600/10 dark:bg-teal-500/20', activeBg: 'bg-teal-650 dark:bg-teal-650 border-teal-650', dot: 'bg-teal-500' }
  };

  const accent = categoryAccents[selectedCategory] || categoryAccents.electronics;

  return (
    <div className="max-w-7xl mx-auto px-4 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <span className={`w-1.5 h-6 rounded ${accent.dot}`} />
        <h4 className="text-zinc-900 dark:text-white font-extrabold text-sm sm:text-base tracking-tight select-none">
          {language === 'en' ? 'Select Subcategory / Folder' : 'আইটেম ভিত্তিক ফোল্ডার সমূহ'}
        </h4>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pt-4">
        {subcats.map((sub) => {
          const isSelected = selectedSubcategory === sub.id;
          const IconComp = sub.icon || Folder;

          return (
            <button
              id={`subcat-folder-${sub.id}`}
              key={sub.id}
              onClick={() => setSelectedSubcategory(sub.id)}
              className="group relative flex flex-col items-start gap-3 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-2xl rounded-tl-none shadow-xs hover:shadow-md transition-all duration-350 text-left overflow-visible cursor-pointer"
            >
              {/* Decorative Physical Folder Tab */}
              <div
                className={`absolute -top-[10px] left-0 h-[10px] w-14 rounded-t-lg border-t border-x transition-all duration-300 ${
                  isSelected
                    ? accent.activeBg
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-850'
                }`}
              />

              {/* Folder Icon / Custom Item Icon */}
              <div className="flex items-center justify-between w-full">
                <div
                  className={`p-2.5 rounded-xl transition-all duration-300 ${
                    isSelected
                      ? accent.lightBg + ' ' + accent.text
                      : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-500 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-750'
                  }`}
                >
                  {isSelected && sub.id === 'all' ? (
                    <FolderOpen size={18} className="animate-pulse" />
                  ) : (
                    <IconComp size={18} />
                  )}
                </div>

                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? accent.dot : 'bg-zinc-300 dark:bg-zinc-700'}`} />
              </div>

              {/* Folder Name */}
              <div className="space-y-0.5 mt-1 select-none w-full">
                <p className={`text-xs font-black transition-colors truncate ${
                  isSelected
                    ? accent.text
                    : 'text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white'
                }`}>
                  {language === 'en' ? sub.en : sub.bn}
                </p>
                <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-extrabold uppercase tracking-wider">
                  {sub.id === 'all' ? (language === 'en' ? 'Main Folder' : 'মূল ফোল্ডার') : (language === 'en' ? 'Sub-Folder' : 'সাব-ফোল্ডার')}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
