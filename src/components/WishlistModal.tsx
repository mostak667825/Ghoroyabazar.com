import React from 'react';
import { X, Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'bn';
  wishlist: string[];
  products: Product[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

export default function WishlistModal({
  isOpen,
  onClose,
  language,
  wishlist,
  products,
  onToggleWishlist,
  onAddToCart,
  onProductClick
}: WishlistModalProps) {
  if (!isOpen) return null;

  // Filter products in wishlist
  const wishlistedItems = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-end">
      {/* Click outside to close wrapper */}
      <div className="absolute inset-0 cursor-default" onClick={onClose} />

      {/* Slide drawer body */}
      <div className="relative bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-fade-in">
        
        {/* Drawer header */}
        <div className="bg-zinc-900 text-white p-4.5 flex justify-between items-center border-b border-zinc-850">
          <div className="flex items-center gap-2">
            <Heart size={18} className="text-pink-500 fill-pink-500 animate-pulse" />
            <h3 className="font-black text-sm uppercase tracking-wider">
              {language === 'en' ? 'My Liked Items' : 'আমার পছন্দের তালিকা'}
            </h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-zinc-400 hover:text-white p-2 rounded-full hover:bg-zinc-800 transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* List layout body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {wishlistedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-80 text-center space-y-3.5 p-4">
              <div className="bg-pink-50 text-pink-500 p-4 rounded-full border border-pink-100">
                <Heart size={32} />
              </div>
              <h4 className="font-extrabold text-zinc-800 text-sm">
                {language === 'en' ? 'Your Wishlist is Empty!' : 'পছন্দের তালিকায় কিছু নেই!'}
              </h4>
              <p className="text-xs text-zinc-550 leading-relaxed max-w-[240px]">
                {language === 'en' 
                  ? 'Browse Ghoroya Bazar catalog and click the heart icon on your favorite products.' 
                  : 'ঘরোয়া বাজারের চমৎকার প্রোডাক্টগুলো ঘুরে দেখুন এবং লাভ চিহ্নে চাপ দিয়ে যুক্ত করুন।'}
              </p>
              <button
                onClick={onClose}
                type="button"
                className="bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-[11px] uppercase tracking-wide px-4 py-2.5 rounded-full transition cursor-pointer"
              >
                {language === 'en' ? 'Start Browsing' : 'পণ্য দেখতে যান'}
              </button>
            </div>
          ) : (
            <div className="space-y-3 divide-y divide-zinc-100">
              {wishlistedItems.map((product) => (
                <div key={product.id} className="pt-3 flex gap-3 items-center group">
                  {/* Thumbnail */}
                  <img
                    src={product.image}
                    alt={product.name}
                    onClick={() => {
                      onProductClick(product);
                      onClose();
                    }}
                    className="w-16 h-16 object-cover rounded-xl bg-zinc-100 border border-zinc-200 cursor-pointer transition transform hover:scale-102"
                  />

                  {/* Text details */}
                  <div className="flex-1 min-w-0">
                    <p
                      onClick={() => {
                        onProductClick(product);
                        onClose();
                      }}
                      className="text-xs font-black text-zinc-800 hover:text-orange-500 cursor-pointer truncate"
                    >
                      {language === 'en' ? product.name : product.nameBn}
                    </p>
                    <p className="text-[10px] text-zinc-500 font-extrabold mb-1">
                      {language === 'en' ? product.category : product.categoryBn}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-orange-600">
                        ৳{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-[10px] text-zinc-400 line-through font-semibold">
                          ৳{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions column */}
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => {
                        onAddToCart(product);
                        onClose();
                      }}
                      type="button"
                      title={language === 'en' ? 'Add item to shopping cart' : 'কার্টে যোগ করুন'}
                      className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl p-2.5 flex items-center justify-center cursor-pointer transition transform hover:scale-105 active:scale-95"
                    >
                      <ShoppingCart size={13} />
                    </button>

                    <button
                      onClick={() => onToggleWishlist(product.id)}
                      type="button"
                      title={language === 'en' ? 'Delete item' : 'তালিকা থেকে মুছুন'}
                      className="text-zinc-400 hover:text-red-650 hover:bg-red-50 p-2.5 rounded-xl transition cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fixed Footer */}
        {wishlistedItems.length > 0 && (
          <div className="bg-zinc-50 border-t p-4 flex gap-3 text-center">
            <button
              onClick={onClose}
              type="button"
              className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1"
            >
              <span>{language === 'en' ? 'Explore More Products' : 'আরো প্রোডাক্ট দেখুন'}</span>
              <ArrowRight size={13} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
