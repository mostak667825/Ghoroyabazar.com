import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, X, AlertOctagon, KeyRound } from 'lucide-react';

interface SellerPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  language: 'en' | 'bn';
}

export default function SellerPinModal({ isOpen, onClose, onSuccess, language }: SellerPinModalProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [tempVisible, setTempVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Custom administrative password (case-insensitive checks)
    const CORRECT_PASSWORD = 'MUAZ667825';

    if (pin.toUpperCase() === CORRECT_PASSWORD) {
      setError('');
      onSuccess();
    } else {
      setError(
        language === 'en'
          ? 'Incorrect Password! Access denied.'
          : 'ভুল পাসওয়ার্ড! প্রবেশাধিকার প্রত্যাখ্যাত হয়েছে।'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md transition-opacity" 
      />

      {/* Modern Compact Secure Form Dialog Box */}
      <div className="relative bg-white border-2 border-red-650 w-full max-w-sm rounded-[24px] shadow-2xl p-6 text-zinc-900 overflow-hidden animate-slide-in">
        
        {/* Dynamic Warning Header decoration */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-655 via-red-500 to-red-655" />

        <div className="flex justify-between items-start mb-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-black tracking-widest text-red-655 uppercase bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
            <Lock size={12} className="animate-pulse" />
            {language === 'en' ? 'RESTRICTED AREA' : 'সংরক্ষিত এলাকা'}
          </span>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 bg-zinc-100 hover:bg-zinc-200 p-1.5 rounded-full transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Brand Icon Seal */}
        <div className="flex flex-col items-center text-center space-y-2 mb-6">
          <div className="w-14 h-14 bg-red-50 border-2 border-red-100 rounded-full flex items-center justify-center text-red-650 shadow">
            <KeyRound size={26} className="animate-bounce" />
          </div>
          <div>
            <h3 className="font-extrabold text-zinc-900 text-lg sm:text-xl tracking-tight">
              {language === 'en' ? 'Seller Security Key' : 'সেলার নিরাপত্তা কী'}
            </h3>
            <p className="text-zinc-405 text-[11px] font-bold mt-1 px-2">
              {language === 'en' 
                ? 'Only authorized administrators and Ghoroya Bazar hub managers are permitted.' 
                : 'এই ড্যাশবোর্ডটি শুধুমাত্র ঘরোয়া বাজার-এর ম্যানেজমেন্ট এবং সেলারের জন্য সংরক্ষিত।'}
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-zinc-500 font-extrabold text-[10px] uppercase tracking-wider mb-1.5 text-center">
              {language === 'en' ? 'Enter Seller Password' : 'সেলার নিরাপত্তা পাসওয়ার্ড প্রবেশ করুন'}
            </label>
            <div className="relative">
              <input
                type={tempVisible ? 'text' : 'password'}
                maxLength={30}
                value={pin}
                onChange={(e) => {
                  setError('');
                  setPin(e.target.value);
                }}
                placeholder="••••••••"
                className="w-full bg-zinc-50 border border-zinc-250 py-3 px-4 text-center text-lg tracking-wide rounded-xl focus:outline-none focus:ring-2 focus:ring-red-650 focus:border-red-650 font-black text-zinc-900 shadow-inner"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setTempVisible(!tempVisible)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-zinc-400 hover:text-red-655 px-1 py-1 transition select-none cursor-pointer"
              >
                {tempVisible ? 'HIDE' : 'SHOW'}
              </button>
            </div>
            {error ? (
              <div className="mt-2.5 flex items-start gap-1.5 text-[11px] text-red-600 font-bold bg-red-50/75 border border-red-150 p-2 rounded-lg leading-tight">
                <AlertOctagon size={13} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            ) : (
              <p className="text-[10px] text-zinc-400 text-center font-bold mt-2">
                {language === 'en'
                  ? 'Access limited to Ghoroya Bazar Hub administrators.'
                  : 'এই ড্যাশবোর্ডটি শুধু অনুমোদিত ঘরোয়া বাজার অ্যাডমিনদের জন্য।'}
              </p>
            )}
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-zinc-200 text-zinc-500 font-extrabold text-xs rounded-xl hover:bg-zinc-50 transition cursor-pointer"
            >
              {language === 'en' ? 'Cancel' : 'বাতিল'}
            </button>
            <button
              type="submit"
              disabled={pin.length < 1}
              className="flex-1 py-2.5 px-4 bg-zinc-900 disabled:bg-zinc-150 hover:bg-zinc-800 text-white font-extrabold text-xs rounded-xl transition shadow flex items-center justify-center gap-1.5 disabled:cursor-not-allowed cursor-pointer"
            >
              <ShieldCheck size={14} />
              {language === 'en' ? 'Verify Entry' : 'প্রবেশ নিশ্চিত করুন'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
