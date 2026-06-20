/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingCart, Tag, Check, AlertCircle } from 'lucide-react';
import { CartItem, Product } from '../types';
import { VOUCHERS } from '../data/products';
import AIRecommendationsList from './AIRecommendationsList';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'bn';
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: (appliedVoucherCode: string) => void;
  appliedVoucherCode: string;
  setAppliedVoucherCode: (code: string) => void;
  products: Product[];
  onProductClick: (p: Product) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  language,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  appliedVoucherCode,
  setAppliedVoucherCode,
  products,
  onProductClick
}: CartDrawerProps) {
  const [voucherInput, setVoucherInput] = useState('');
  const [voucherError, setVoucherError] = useState('');
  const [voucherSuccess, setVoucherSuccess] = useState('');

  if (!isOpen) return null;

  // Helper to determine display price based on user role
  const getDisplayPrice = (product: Product) => {
    if (localStorage.getItem('ghoroya_reseller_role') === 'reseller' && product.resellerPrice !== undefined) {
      return product.resellerPrice;
    }
    return product.price;
  };

  // Retrieve dynamic vouchers injected by default or from control panel
  const activeVouchers = (() => {
    try {
      const cached = localStorage.getItem('ghoroya_vouchers');
      return cached ? JSON.parse(cached) : VOUCHERS;
    } catch {
      return VOUCHERS;
    }
  })();

  const subTotal = cart.reduce((acc, item) => acc + getDisplayPrice(item.product) * item.quantity, 0);

  // Apply Voucher parameters
  let discountAmount = 0;
  let isFreeShipping = false;

  const currentVoucher = activeVouchers.find((v: any) => v.code.toUpperCase() === appliedVoucherCode.toUpperCase());
  if (currentVoucher) {
    if (currentVoucher.type === 'flat') {
      discountAmount = currentVoucher.discount;
    } else if (currentVoucher.type === 'percent') {
      discountAmount = Math.min((subTotal * currentVoucher.discount) / 100, 500);
    } else if (currentVoucher.type === 'free_shipping') {
      isFreeShipping = true;
    }
  }

  const deliveryCharge = isFreeShipping ? 0 : subTotal > 0 ? 120 : 0;
  const totalPayable = Math.max(subTotal - discountAmount + deliveryCharge, 0);

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    setVoucherError('');
    setVoucherSuccess('');

    const trimmed = voucherInput.trim().toUpperCase();
    if (!trimmed) return;

    const matched = activeVouchers.find((v: any) => v.code === trimmed);
    if (matched) {
      setAppliedVoucherCode(matched.code);
      setVoucherSuccess(language === 'en' ? `Applied! ${matched.description}` : `প্রযুক্ত হয়েছে! ${matched.descriptionBn}`);
      setVoucherInput('');
    } else {
      setVoucherError(language === 'en' ? 'Invalid Coupon Code' : 'ভাউচার কোডটি সঠিক নয়');
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucherCode('');
    setVoucherSuccess('');
    setVoucherError('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      {/* Off-canvas sidebar */}
      <div className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-slide-in">
        
        {/* Drawer Header */}
        <div className="bg-zinc-950 text-white p-4.5 flex items-center justify-between shadow-lg border-b border-red-600">
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-red-500 animate-pulse" />
            <span className="font-sans font-black text-sm sm:text-base tracking-tight">
              {language === 'en' ? 'My Shopping Cart' : 'আমার শপিং কার্ট'}
            </span>
            <span className="bg-red-650 text-white font-sans font-black text-xs px-2.5 py-0.5 rounded-full select-none shadow">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-full bg-zinc-900 cursor-pointer transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cart Item Column */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {cart.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center gap-4 text-zinc-400">
              <ShoppingCart size={64} className="stroke-[1.5] text-zinc-200 animate-pulse" />
              <div>
                <p className="font-bold text-sm text-zinc-600">
                  {language === 'en' ? 'Your cart is completely empty' : 'আপনার কার্টটি সম্পূর্ণ খালি'}
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  {language === 'en' ? 'Add products or query our AI shopper!' : 'কার্টে পণ্য যোগ করুন অথবা এআই হেল্পারকে জিজ্ঞেস করুন!'}
                </p>
              </div>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                className="flex gap-3 bg-zinc-55 border border-zinc-150 p-3 rounded-xl transition hover:border-zinc-300"
              >
                {/* Thumb image */}
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-md border border-zinc-200 bg-white"
                />

                {/* Details list */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-extrabold text-zinc-800 truncate">
                    {language === 'en' ? item.product.name : item.product.nameBn}
                  </h4>
                  
                  {/* Options */}
                  <div className="flex gap-1.5 text-[10px] text-zinc-500 font-bold mt-0.5 flex-wrap">
                    {item.selectedColor && (
                      <span className="bg-zinc-200 px-1.5 py-0.5 rounded">
                        {item.selectedColor}
                      </span>
                    )}
                    {item.selectedSize && (
                      <span className="bg-zinc-200 px-1.5 py-0.5 rounded">
                        Size: {item.selectedSize}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-zinc-200 rounded overflow-hidden bg-white">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-1 text-zinc-650 hover:bg-zinc-100 transition duration-150 cursor-pointer"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="px-3 text-xs font-black text-zinc-800 select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-1 text-zinc-650 hover:bg-zinc-100 transition duration-150 cursor-pointer"
                      >
                        <Plus size={11} />
                      </button>
                    </div>

                    {/* Costing */}
                    <div className="flex flex-col items-end">
                      <span className="text-zinc-900 font-black text-xs sm:text-sm">
                        ৳{(getDisplayPrice(item.product) * item.quantity).toLocaleString()}
                      </span>
                      {localStorage.getItem('ghoroya_reseller_role') === 'reseller' && item.product.resellerPrice !== undefined && (
                        <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded mt-0.5">
                          {language === 'en' ? 'Reseller' : 'রিসেলার রেট'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => onRemoveItem(item.product.id)}
                  className="text-zinc-650 hover:text-red-500 p-2 rounded duration-200 cursor-pointer flex items-center justify-center flex-shrink-0 self-start"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          )}

          {/* AI Smart Companion Recommendations inside scroll container */}
          {cart.length > 0 && (
            <AIRecommendationsList
              cartProductIds={cart.map((item) => item.product.id)}
              language={language}
              onProductClick={(p) => {
                onProductClick(p);
                onClose();
              }}
              products={products}
              layout="compact"
            />
          )}
        </div>

        {/* Drawer footer containing checkout calculations */}
        {cart.length > 0 && (
          <div className="border-t border-zinc-200 p-4 bg-zinc-55 space-y-4">
            
            {/* Price lines */}
            <div className="space-y-1.5 border-b border-zinc-200 pb-3 text-xs">
              <div className="flex justify-between text-zinc-600 font-semibold">
                <span>{language === 'en' ? 'Subtotal' : 'সাবটোটাল'}</span>
                <span>৳{subTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-600 font-semibold">
                <span>{language === 'en' ? 'Delivery Charge' : 'ডেলিভারি চার্জ'}</span>
                <span>৳{deliveryCharge.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-800 font-extrabold text-sm pt-1.5">
                <span>{language === 'en' ? 'Total Payable' : 'সর্বমোট প্রদেয়'}</span>
                <span className="text-red-650">৳{totalPayable.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => onCheckout('')}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-extrabold text-sm shadow-md transition hover:shadow-lg hover:shadow-red-500/20 cursor-pointer tracking-wide flex items-center justify-center gap-2"
            >
              <span>{language === 'en' ? 'Proceed To Checkout' : 'চেকআউট করুন'}</span>
            </button>

          </div>
        )}
      </div>
    </div>
  );
}
