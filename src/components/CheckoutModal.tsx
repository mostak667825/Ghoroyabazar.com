import React, { useState, useEffect } from 'react';
import { 
  X, MapPin, Phone, User, CreditCard, Check, AlertCircle, FileText, Landmark, 
  ShieldCheck, BadgeCheck, ShoppingBag, Plus, Minus, Trash2, Ticket, Sparkles, 
  Truck, Info, ChevronRight, Gift, Lock, RefreshCw, Star, CheckCircle2 
} from 'lucide-react';
import { CartItem, Order } from '../types';
import { VOUCHERS } from '../data/products';
import TrustFeatures from './TrustFeatures';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'bn';
  cart: CartItem[];
  appliedVoucherCode: string;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onOrderSuccess: (order: Order) => void;
  siteSettings: any;
  resellerContext?: any;
}


// Bangladesh Districts and Thanas catalog data loaded dynamically from database
import { AVAILABLE_DISTRICTS, AVAILABLE_UPAZILAS } from '../data/bangladeshAreas';


export default function CheckoutModal({
  isOpen,
  onClose,
  language,
  cart,
  appliedVoucherCode: initialVoucher,
  onUpdateQuantity,
  onRemoveItem,
  onOrderSuccess,
  siteSettings,
  resellerContext
}: CheckoutModalProps) {
  // Shipping Form States initialized as empty for actual user inputs
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    phone: '',
    address: '',
    district: 'dhaka',
    upazila: 'mirpur'
  });

  const [orderNotes, setOrderNotes] = useState('');

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad' | 'rocket' | 'bank'>('cod');

  // Load administrative payment gateways numbers dynamically
  const [gateways, setGateways] = useState({
    bkash: '01996291859',
    nagad: '01996291859',
    rocket: '01996291859',
    bankName: 'BRAC Bank PLC',
    accountName: 'Ghoroya Bazar Limited',
    accountNumber: '1501202234556001',
    routingNumber: '060261358'
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ghoroya_payment_gateways');
      if (saved) {
        setGateways(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Coupon state
  const [couponInput, setCouponInput] = useState(initialVoucher || '');
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Reseller Integration States
  const [isResellerRegistered, setIsResellerRegistered] = useState(false);
  const [isResellerMode, setIsResellerMode] = useState(false);
  const [customerPriceInput, setCustomerPriceInput] = useState('');

  useEffect(() => {
    const checkRes = () => {
      const resPhone = localStorage.getItem('ghoroya_reseller_phone');
      const resRole = localStorage.getItem('ghoroya_reseller_role');
      if (resRole === 'reseller') {
        setIsResellerRegistered(true);
        setIsResellerMode(false); // Default to false so it is not active for standard catalog checkout automatically
      } else if (resPhone) {
        // Fallback profile lookup if server session or role cache can be verified
        fetch(`/api/resellers/profile/${resPhone}`)
          .then(res => res.ok ? res.json() : null)
          .then(data => {
            if (data && data.user?.role === 'reseller') {
              setIsResellerRegistered(true);
              setIsResellerMode(false); // Default to false
              localStorage.setItem('ghoroya_reseller_role', 'reseller');
            } else {
              setIsResellerRegistered(false);
              setIsResellerMode(false);
            }
          })
          .catch(err => console.error(err));
      } else {
        setIsResellerRegistered(false);
        setIsResellerMode(false);
      }
    };
    checkRes();
    window.addEventListener('ghoroya_reseller_change', checkRes);
    return () => {
      window.removeEventListener('ghoroya_reseller_change', checkRes);
    };
  }, []);

  // Mobile wallet simulated authentication portal state
  const [isPayingSimulated, setIsPayingSimulated] = useState(false);
  const [simulatedStep, setSimulatedStep] = useState(0); // 1: Enter wallet, 2: OTP, 3: PIN
  const [walletNumber, setWalletNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [formErr, setFormErr] = useState('');

  // Custom bank transaction details
  const [bankDetails, setBankDetails] = useState({
    bankName: 'BRAC Bank PLC',
    accountName: '',
    accountNumber: '',
    routingNumber: ''
  });

  // Calculate order subtotal
  const subTotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Load available vouchers from local storage or defaults
  const activeVouchers = (() => {
    try {
      const cached = localStorage.getItem('ghoroya_vouchers');
      return cached ? JSON.parse(cached) : VOUCHERS;
    } catch {
      return VOUCHERS;
    }
  })();

  // Pre-load original incoming voucher if matched
  useEffect(() => {
    if (initialVoucher) {
      const found = activeVouchers.find((v: any) => v.code.toUpperCase() === initialVoucher.toUpperCase());
      if (found) {
        setAppliedVoucher(found);
        setCouponInput(found.code);
        setCouponSuccess(language === 'en' ? `Coupon "${found.code}" active!` : `কুপন "${found.code}" সক্রিয় রয়েছে!`);
      }
    }
  }, [initialVoucher]);

  // Handle manual coupon trigger
  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    if (!code) {
      setCouponError(language === 'en' ? 'Please enter a coupon code.' : 'দয়া করে কুপন কোডটি লিখুন।');
      setCouponSuccess('');
      return;
    }

    const matched = activeVouchers.find((v: any) => v.code.toUpperCase() === code);
    if (matched) {
      setAppliedVoucher(matched);
      setCouponSuccess(language === 'en' ? `Success! Voucher "${code}" applied.` : `অভিনন্দন! ভাউচার "${code}" চালু হয়েছে।`);
      setCouponError('');
      if (!codeToApply) {
        setCouponInput(code);
      }
    } else {
      setCouponError(language === 'en' ? 'Invalid promotion code.' : 'কুপনটি সঠিক নয়। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
      setCouponSuccess('');
      setAppliedVoucher(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedVoucher(null);
    setCouponInput('');
    setCouponSuccess('');
    setCouponError('');
  };

  // Determine discounts/benefits of active voucher
  let discountAmount = 0;
  let isFreeShippingByCoupon = false;

  if (appliedVoucher) {
    if (appliedVoucher.type === 'flat') {
      discountAmount = appliedVoucher.discount;
    } else if (appliedVoucher.type === 'percent') {
      discountAmount = Math.min((subTotal * appliedVoucher.discount) / 100, 500);
    } else if (appliedVoucher.type === 'free_shipping') {
      isFreeShippingByCoupon = true;
    }
  }

  // Scan special categories: groceries, package, fresh_groceries
  const hasGroceries = cart.some(item => item.product.category === 'groceries');
  const hasPackage = cart.some(item => item.product.category === 'package');
  const hasFresh = cart.some(item => item.product.category === 'fresh_groceries');

  let specialDeliveryCharge = 0;
  let specialCategoryName = '';
  let specialCategoryNameBn = '';

  if (hasFresh) {
    specialDeliveryCharge = Math.max(specialDeliveryCharge, siteSettings?.delivery_fresh_groceries_charge || 100);
    specialCategoryName = 'Fresh Bazaar';
    specialCategoryNameBn = 'কাঁচা বাজার';
  }
  if (hasPackage) {
    specialDeliveryCharge = Math.max(specialDeliveryCharge, siteSettings?.delivery_package_charge || 90);
    specialCategoryName = 'Combo Package';
    specialCategoryNameBn = 'প্যাকেজ';
  }
  if (hasGroceries) {
    specialDeliveryCharge = Math.max(specialDeliveryCharge, siteSettings?.delivery_groceries_charge || 80);
    specialCategoryName = 'Groceries';
    specialCategoryNameBn = 'মুদি বাজার';
  }

  const isInsideDhaka = shippingInfo.district === 'dhaka';
  const baseDeliveryCharge = isInsideDhaka 
    ? (siteSettings?.delivery_inside_dhaka || 80) 
    : (siteSettings?.delivery_outside_dhaka || 150);

  // Delivery charge is the highest applicable category rate, or base location rate
  const deliveryCharge = isFreeShippingByCoupon 
    ? 0 
    : subTotal > 0 
    ? (specialDeliveryCharge > 0 ? specialDeliveryCharge : baseDeliveryCharge)
    : 0;

  const totalPayable = Math.max(subTotal - discountAmount + deliveryCharge, 0);

  // Total weight of items (sum of item.product.weight || 0.5)
  const totalWeight = cart.reduce((acc, item) => acc + (item.product.weight || 0.5) * item.quantity, 0);
  // Packaging fee (15 tk if weight >= 1.0 kg, 10 tk otherwise) - now dynamic with siteSettings
  const packagingWeightThreshold = siteSettings?.packaging_weight_threshold !== undefined ? parseFloat(siteSettings.packaging_weight_threshold) : 1.0;
  const packagingFeeHeavy = siteSettings?.packaging_fee_heavy !== undefined ? parseFloat(siteSettings.packaging_fee_heavy) : 15;
  const packagingFeeLight = siteSettings?.packaging_fee_light !== undefined ? parseFloat(siteSettings.packaging_fee_light) : 10;
  const packagingFee = totalWeight >= packagingWeightThreshold ? packagingFeeHeavy : packagingFeeLight;
  // Reseller baseline catalog wholesale cost subtotal
  const resellerWholesaleSubtotal = cart.reduce((acc, item) => {
    const baseResellerPrice = item.product.resellerPrice || Math.round(item.product.price * 0.85);
    return acc + baseResellerPrice * item.quantity;
  }, 0);

  // Total reseller base cost (wholesale subtotal + delivery charge + packaging fee)
  const resellerBaseTotal = resellerWholesaleSubtotal + deliveryCharge + packagingFee;

  // Expected Customer Price (what they charge their customer). Default is standard total payable
  const finalSellValue = parseFloat(customerPriceInput) || totalPayable;

  // Commission deduction (1% of the final customer price)
  const adminMarkupCut = Math.round(finalSellValue * 0.01);

  // Calculated Reseller Net Profit
  const resellerNetProfit = Math.max(0, (finalSellValue - resellerBaseTotal) - adminMarkupCut);

  // Field change adapters
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const updated = {
      ...shippingInfo,
      [e.target.name]: e.target.value
    };
    
    // Automatically reset subdistrict option if district switches
    if (e.target.name === 'district') {
      const firstUpazila = AVAILABLE_UPAZILAS[e.target.value]?.[0]?.id || '';
      updated.upazila = firstUpazila;
    }

    setShippingInfo(updated);
  };

  const handleBankFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBankDetails({
      ...bankDetails,
      [e.target.name]: e.target.value
    });
  };

  // Live validation validator helper
  const isNameFilled = shippingInfo.name.trim().length > 2;
  const isPhoneFilled = shippingInfo.phone.trim().length >= 11;
  const isAddressFilled = shippingInfo.address.trim().length >= 6;
  const isDistrictFilled = !!shippingInfo.district;
  const isUpazilaFilled = !!shippingInfo.upazila;

  // Calculate dynamic progress completion (based on 3 segments of information)
  const getProgressPercentage = () => {
    let completed = 0;
    if (isNameFilled && isPhoneFilled) completed += 35; // Contact details
    if (isAddressFilled && isDistrictFilled && isUpazilaFilled) completed += 35; // Address specifics
    if (cart.length > 0) completed += 30; // Product quantity verified
    return Math.min(completed, 100);
  };

  const currentPercent = getProgressPercentage();

  const validateAllFields = () => {
    if (!shippingInfo.name.trim() || !shippingInfo.phone.trim() || !shippingInfo.address.trim() || !shippingInfo.district || !shippingInfo.upazila) {
      setFormErr(language === 'en' ? 'All shipping detail fields are required.' : 'সবগুলো কুরিয়ার ডেলিভারি টাইপ ঘর পূরণ করা আবশ্যক।');
      return false;
    }
    if (shippingInfo.phone.length < 11) {
      setFormErr(language === 'en' ? 'Provide a valid 11 digit contact number.' : 'একটি সঠিক ১১ ডিজিটের সেলফোন নম্বর দিন।');
      return false;
    }
    setFormErr('');
    return true;
  };

  // Placed Order Submitter
  const handleFinishCheckout = (paymentLabel: string) => {
    if (!validateAllFields()) return;

    // Save customer identity for Ghoroya Assistant matching support
    try {
      localStorage.setItem('ghoroya_customer_name', shippingInfo.name);
      localStorage.setItem('ghoroya_customer_phone', shippingInfo.phone);
    } catch (e) {
      console.error(e);
    }

    const uniqueOrderId = `DRZ-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Dynamic calculation of profit margins for dropshipped custom catalog orders
    const cumulativeGrossProfit = cart.reduce((acc, item) => {
      const wholesalePrice = item.product.resellerPrice || Math.round(item.product.price * 0.85);
      const retailPrice = item.product.price;
      const profitPerUnit = Math.max(0, retailPrice - wholesalePrice);
      return acc + (profitPerUnit * item.quantity);
    }, 0);
    const calculatedPlatformFee = Math.round(totalPayable * 0.01);
    const calculatedPackagingFee = 10; // light scale standardized packaging fee BDT 10
    const calculatedResellerNetProfit = Math.max(0, cumulativeGrossProfit - calculatedPackagingFee - calculatedPlatformFee);

    const isResellerOrCatalog = isResellerMode || !!resellerContext;
    const finalResellerPhone = isResellerMode 
      ? (localStorage.getItem('ghoroya_reseller_phone') || undefined) 
      : (resellerContext?.phone || undefined);

    const newOrder: Order = {
      id: uniqueOrderId,
      date: new Date().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      items: cart,
      total: isResellerMode ? finalSellValue : totalPayable,
      shippingCharge: deliveryCharge,
      shippingAddress: shippingInfo,
      orderNotes: orderNotes.trim() || undefined,
      paymentMethod: paymentLabel,
      status: 'Pending',
      statusBn: 'অপেক্ষমাণ',
      isResellerOrder: isResellerOrCatalog,
      resellerPhone: finalResellerPhone,
      customerPrice: isResellerMode ? finalSellValue : totalPayable,
      packagingFee: isResellerMode ? packagingFee : calculatedPackagingFee,
      commissionDeducted: isResellerMode ? adminMarkupCut : calculatedPlatformFee,
      resellerProfit: isResellerMode ? resellerNetProfit : (resellerContext ? calculatedResellerNetProfit : undefined)
    };

    onOrderSuccess(newOrder);
  };

  const handleCODOrder = () => {
    handleFinishCheckout(language === 'en' ? 'Cash on Delivery (COD)' : 'ক্যাশ অন ডেলিভারি (কুরিয়ার)');
  };

  const handleStartMobileWallet = () => {
    if (!validateAllFields()) return;
    setWalletNumber(shippingInfo.phone);
    setIsPayingSimulated(true);
    setSimulatedStep(1);
    setFormErr('');
  };

  const handleVerifyWalletNumber = () => {
    if (walletNumber.length < 11) {
      setFormErr(language === 'en' ? 'Please enter an 11-digit wallet number' : '১১ ডিজিটের ওয়ালেট নম্বর লিখুন');
      return;
    }
    setSimulatedStep(2);
    setOtpCode('');
    setFormErr('');
  };

  const handleVerifyOTP = () => {
    if (otpCode.length < 4) {
      setFormErr(language === 'en' ? 'Invalid numeric OTP verification code' : 'সঠিক ওটিপি কোড লিখুন');
      return;
    }
    setSimulatedStep(3);
    setPinCode('');
    setFormErr('');
  };

  const handleSubmitPINAndFinish = () => {
    if (pinCode.length < 4) {
      setFormErr(language === 'en' ? 'Incorrect Security PIN' : 'ভুল সিকিউরিটি পিন');
      return;
    }

    const methodLabels: Record<string, string> = {
      bkash: 'bKash Mobile Banking',
      nagad: 'Nagad Mobile Wallet',
      rocket: 'Rocket Mobile Wallet'
    };

    setIsPayingSimulated(false);
    handleFinishCheckout(methodLabels[paymentMethod] || 'Mobile Wallet (Online)');
  };

  const handleBankTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAllFields()) return;
    handleFinishCheckout(`Bank Transfer (${bankDetails.bankName})`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 selection:bg-red-600 selection:text-white font-sans animate-fade-in">
      <div className="relative bg-white w-full h-[100dvh] sm:h-auto sm:max-h-[88vh] max-w-5xl sm:rounded-3xl rounded-none shadow-2xl overflow-hidden flex flex-col">
        
        {/* UPPER BANNER SECTION */}
        <div className="bg-zinc-950 text-white p-4 flex items-center justify-between border-b border-zinc-800 select-none">
          <div className="flex items-center gap-2.5">
            <div className="bg-red-600 p-2 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/30">
              <ShoppingBag size={18} className="text-white animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base tracking-tight leading-none">
                {language === 'en' ? 'Frictionless One-Page Checkout' : 'নিরাপদ ঘরোয়া ওয়ান-পেজ চেকআউট'}
              </h3>
              <p className="text-[10px] text-zinc-400 font-bold mt-1 inline-flex items-center gap-1">
                🛡️ {language === 'en' ? 'SSL Secure Encrypted Endpoint Session' : 'SSL ব্যাংকিং স্ট্যান্ডার্ড এনক্রিপশেন সেশন সক্রিয়'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* GUEST MODE ASSURANCE BAR */}
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              👤 {language === 'en' ? 'GUEST CHECKOUT ACTIVE' : 'গেস্ট হিসেবে নিরাপদ চেকআউট'}
            </span>
            <button
              onClick={onClose}
              type="button"
              className="text-zinc-400 hover:text-white p-2 rounded-full hover:bg-zinc-900 transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* PROGRESS METER */}
        <div className="bg-zinc-50 border-b border-zinc-150 py-3.5 px-4 sm:px-6 select-none shadow-xs">
          <div className="max-w-3xl mx-auto space-y-2">
            <div className="flex items-center justify-between text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest px-1">
              <span className="text-zinc-600 flex items-center gap-1">
                ⚙️ {language === 'en' ? 'Setup Progress' : 'পূরণকৃত তথ্য বিবরণী: '}
              </span>
              <span className="text-red-655 font-black bg-red-50 border border-red-200/50 px-2 py-0.5 rounded-md">
                {currentPercent}% {language === 'en' ? 'Completed' : 'সম্পন্ন হয়েছে'}
              </span>
            </div>
            
            {/* Real Progress Bar */}
            <div className="w-full bg-zinc-200 h-2.5 rounded-full overflow-hidden border border-zinc-300">
              <div 
                className="bg-red-600 h-full rounded-full transition-all duration-500 ease-out shadow-xs"
                style={{ width: `${currentPercent}%` }}
              />
            </div>

            {/* Stepper text indicators */}
            <div className="grid grid-cols-3 text-[10px] sm:text-[11px] font-bold text-center pt-1.5 text-zinc-400 relative">
              <div className={`transition-all duration-300 flex items-center justify-center gap-1 ${isNameFilled && isPhoneFilled ? 'text-emerald-600' : 'text-zinc-400'}`}>
                {isNameFilled && isPhoneFilled ? <CheckCircle2 size={11} className="shrink-0" /> : <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 shrink-0 inline-block" />}
                <span>{language === 'en' ? 'Contact details' : 'মোবাইল ও নাম'}</span>
              </div>
              <div className={`transition-all duration-300 flex items-center justify-center gap-1 ${isAddressFilled && isDistrictFilled && isUpazilaFilled ? 'text-emerald-600' : 'text-zinc-400'}`}>
                {isAddressFilled && isDistrictFilled && isUpazilaFilled ? <CheckCircle2 size={11} className="shrink-0" /> : <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 shrink-0 inline-block" />}
                <span>{language === 'en' ? 'Address Pinpoint' : 'পূর্ণ ঠিকানা'}</span>
              </div>
              <div className={`transition-all duration-300 flex items-center justify-center gap-1 ${cart.length > 0 ? 'text-emerald-700' : 'text-zinc-400'}`}>
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0 inline-block animate-pulse" />
                <span className="text-red-655 font-black">{language === 'en' ? 'Secure Place Order' : 'নিশ্চিত অর্ডার'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* COMPREHENSIVE ONE-PAGE SCROLLABLE CONTENT */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1 bg-zinc-50/50">
          
          {/* Main error block */}
          {formErr && (
            <div className="bg-red-50 border border-red-200 text-red-655 text-xs p-3.5 rounded-xl flex items-center gap-2.5 font-bold animate-pulse">
              <AlertCircle size={16} className="shrink-0" />
              <span>{formErr}</span>
            </div>
          )}

          {/* Double column framework */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* COLUMN 1: INFORMATION CAPTURE (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* SECTION: GUEST DETAILS & CONTACT */}
              <div className="bg-white border border-zinc-200 rounded-3xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
                  <h4 className="font-extrabold text-xs sm:text-sm text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                    <User size={15} className="text-red-500" />
                    <span>{language === 'en' ? '1. Contact Details' : '১. ক্রেতার বিবরণ ও যোগাযোগ'}</span>
                  </h4>
                  <span className="text-[10px] text-zinc-400 font-extrabold">Instant Delivery Registration</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-black text-zinc-500 uppercase tracking-wide block mb-1.5">
                      {language === 'en' ? 'Full Name' : 'পূর্ণ নাম'}
                    </label>
                    <div className="relative">
                      <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input
                        type="text"
                        name="name"
                        value={shippingInfo.name}
                        onChange={handleFieldChange}
                        placeholder={language === 'en' ? 'Type your full name...' : 'আপনার পূর্ণ নাম লিখুন...'}
                        className={`w-full bg-zinc-50/80 border ${isNameFilled ? 'border-emerald-300 focus:border-emerald-500 bg-emerald-50/10' : 'border-zinc-250 focus:border-red-500'} rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold text-zinc-950 outline-none transition-all duration-150`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-black text-zinc-500 uppercase tracking-wide block mb-1.5">
                      {language === 'en' ? 'Mobile Number' : 'মোবাইল নম্বর'}
                    </label>
                    <div className="relative">
                      <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input
                        type="text"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleFieldChange}
                        placeholder={language === 'en' ? 'Enter 11-digit mobile number...' : '১১ ডিজিটের মোবাইল নম্বর দিন...'}
                        className={`w-full bg-zinc-50/80 border ${isPhoneFilled ? 'border-emerald-300 focus:border-emerald-500 bg-emerald-50/10' : 'border-zinc-250 focus:border-red-500'} rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold text-zinc-950 outline-none transition-all duration-150`}
                      />
                    </div>
                  </div>
                </div>

                {/* District and Thana Selectors */}
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-black text-zinc-500 uppercase tracking-wide block mb-1.5 flex items-center gap-1">
                        <span>{language === 'en' ? 'District / জেলা' : 'জেলা / শহর'}</span>
                      </label>
                      <select
                        name="district"
                        value={shippingInfo.district}
                        onChange={handleFieldChange}
                        className={`w-full bg-zinc-55 border ${isDistrictFilled ? 'border-emerald-300 focus:border-emerald-500 bg-emerald-50/10' : 'border-zinc-250'} rounded-xl px-3 py-2.5 text-xs font-bold text-zinc-900 cursor-pointer outline-none focus:ring-1 focus:ring-red-500 transition`}
                      >
                        {AVAILABLE_DISTRICTS.map((d) => (
                          <option key={d.id} value={d.id}>
                            {language === 'en' ? d.name : d.nameBn}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-black text-zinc-500 uppercase tracking-wide block mb-1.5 flex items-center gap-1">
                        <span>{language === 'en' ? 'Thana / Upazila / থানা' : 'থানা / উপজেলা'}</span>
                      </label>
                      <select
                        name="upazila"
                        value={shippingInfo.upazila}
                        onChange={handleFieldChange}
                        className={`w-full bg-zinc-55 border ${isUpazilaFilled ? 'border-emerald-300 focus:border-emerald-500 bg-emerald-50/10' : 'border-zinc-250'} rounded-xl px-3 py-2.5 text-xs font-bold text-zinc-900 cursor-pointer outline-none focus:ring-1 focus:ring-red-500 transition`}
                      >
                        {(AVAILABLE_UPAZILAS[shippingInfo.district] || []).map((u) => (
                          <option key={u.id} value={u.id}>
                            {language === 'en' ? u.name : u.nameBn}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-black text-zinc-500 uppercase tracking-wide block mb-1.5">
                      {language === 'en' ? 'Doorstep Address Details' : 'বাসা ও হোল্ডিং নং ও এলাকা বিস্তারিত'}
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleFieldChange}
                      placeholder={language === 'en' ? 'Type your complete address (House, Road, Area)...' : 'আপনার পূর্ণ ঠিকানা লিখুন (বাসা নং, রোড নং, এলাকা)...'}
                      className={`w-full bg-zinc-50/80 border ${isAddressFilled ? 'border-emerald-300 focus:border-emerald-500 bg-emerald-50/10' : 'border-zinc-250 focus:border-red-500'} rounded-xl px-3 py-2.5 text-xs font-bold text-zinc-950 outline-none transition-all duration-150`}
                    />
                  </div>

                  {/* Informative Shipping Badge / Delivery Summary */}
                  <div className="text-[10px] sm:text-xs text-zinc-650 font-bold bg-zinc-100 hover:bg-zinc-200/50 p-3 rounded-xl border border-zinc-250 flex flex-col gap-1.5 transition select-none">
                    <div className="flex items-center gap-1.5 font-extrabold text-zinc-800">
                      <Truck size={13} className="text-red-500 shrink-0" />
                      <span>{language === 'en' ? 'Delivery Mode Summary / ডেলিভারি হিসাব' : 'ডেলিভারি হিসাব বিবরণী ও ফি নোটিশ'}</span>
                    </div>
                    <div className="space-y-1 pl-5 text-[10px] text-zinc-500 font-medium">
                      <p>
                        • {language === 'en' ? `Location classification: ${shippingInfo.district === 'dhaka' ? 'Inside Dhaka (ঢাকার ভিতর)' : 'Outside Dhaka (ঢাকার বাইরে)'}` : `লোকেশান শ্রেণী: ${shippingInfo.district === 'dhaka' ? 'ঢাকার ভিতর (৭-১০ টাকা ধোঁয়া-মুক্ত পরিবেশ)' : 'ঢাকার বাইরে (১২০ টাকা দেশের যেকোনো প্রান্ত)'}`}
                      </p>
                      {specialDeliveryCharge > 0 ? (
                        <p className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-250 w-fit animate-pulse">
                          • {language === 'en' ? `Special Category Detected: ${specialCategoryName} (Rate configured by Admin: ৳${specialDeliveryCharge})` : `পণ্য সনাক্তকরণ: ${specialCategoryNameBn} (এডমিন নির্ধারিত বিশেষ ডেলিভারি হার: ৳${specialDeliveryCharge})`}
                        </p>
                      ) : (
                        <p>
                          • {language === 'en' ? `Standard rate: ৳${baseDeliveryCharge}` : `ডেলিভারি চার্জের সাধারণ হার: ৳${baseDeliveryCharge}`}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ORDER NOTES CAPTURE FIELD */}
              <div className="bg-white border border-zinc-200 rounded-3xl p-5 shadow-xs space-y-3">
                <h5 className="font-extrabold text-xs sm:text-sm text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                  <FileText size={15} className="text-zinc-550" />
                  <span>{language === 'en' ? '2. Order Notes & Custom Instructions' : '২. ডেলিভারি নোট ও বিশেষ কাস্টম নির্দেশনা'}</span>
                </h5>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder={language === 'en' ? 'Enter notes e.g. "Ring bell twice", "Deliver after 4 PM", "Leave with security guard".' : 'কুরিয়ার ম্যান বা আমাদের প্যাকারদের জন্য কোন বিশেষ নোট থাকলে এখানে নির্দেশ করুন... (যেমন: ২ টায় ডেলিভারি দিলে ভালো হয়)'}
                  className="w-full h-20 bg-zinc-50 hover:bg-zinc-100/50 border border-zinc-250 rounded-xl p-3 text-xs font-semibold text-zinc-950 outline-none focus:border-red-500 transition duration-150 scrollbar"
                />
              </div>

              {/* PAYMENT METHOD SECTOR AND ACCORDIONS */}
              <div className="bg-white border border-zinc-200 rounded-3xl p-5 shadow-xs space-y-4">
                <h4 className="font-extrabold text-xs sm:text-sm text-zinc-900 uppercase tracking-widest border-b border-zinc-100 pb-2.5 flex items-center gap-2">
                  <CreditCard size={15} className="text-red-500" />
                  <span>{language === 'en' ? '3. Select Gateway Payment Method' : '৩. পেমেন্ট গেটওয়ে পদ্ধতি নির্বাচন করুন'}</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {/* Cash on Delivery Card */}
                  <button
                    onClick={() => setPaymentMethod('cod')}
                    type="button"
                    className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border text-center transition-all cursor-pointer select-none duration-150 ${
                      paymentMethod === 'cod'
                        ? 'border-red-600 bg-red-50 shadow-md ring-1 ring-red-650 scale-102 font-black text-red-700'
                        : 'border-zinc-200 hover:border-zinc-350 bg-zinc-50 text-zinc-700 font-bold'
                    }`}
                  >
                    <span className="text-xs font-black uppercase text-center block">COD</span>
                    <span className="text-[10px] text-zinc-500 font-extrabold tracking-tighter uppercase mt-1">ক্যাশ অন কুরিয়ার</span>
                  </button>

                  {/* bKash card Selector */}
                  <button
                    onClick={() => setPaymentMethod('bkash')}
                    type="button"
                    className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border text-center transition-all cursor-pointer select-none duration-150 ${
                      paymentMethod === 'bkash'
                        ? 'border-[#E2125D] bg-[#FCE8F0] shadow-md ring-1 ring-[#E2125D] scale-102 font-black text-[#E2125D]'
                        : 'border-zinc-200 hover:border-zinc-350 bg-zinc-50 text-zinc-700 font-bold'
                    }`}
                  >
                    <span className="text-xs font-black block">bKash Wallet</span>
                    <span className="text-[9px] font-black uppercase mt-1 tracking-tighter opacity-90">বিকাশ গেটওয়ে</span>
                  </button>

                  {/* Nagad card Selector */}
                  <button
                    onClick={() => setPaymentMethod('nagad')}
                    type="button"
                    className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border text-center transition-all cursor-pointer select-none duration-150 ${
                      paymentMethod === 'nagad'
                        ? 'border-[#F15A22] bg-[#FFF0EB] shadow-md ring-1 ring-[#F15A22] scale-102 font-black text-[#F15A22]'
                        : 'border-zinc-200 hover:border-zinc-350 bg-zinc-50 text-zinc-700 font-bold'
                    }`}
                  >
                    <span className="text-xs font-black block">Nagad Wallet</span>
                    <span className="text-[9px] font-black uppercase mt-1 tracking-tighter opacity-90">নগদ ওয়ালেট</span>
                  </button>

                  {/* Rocket card Selector */}
                  <button
                    onClick={() => setPaymentMethod('rocket')}
                    type="button"
                    className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border text-center transition-all cursor-pointer select-none duration-150 ${
                      paymentMethod === 'rocket'
                        ? 'border-[#8C3494] bg-[#F4EBF5] shadow-md ring-1 ring-[#8C3494] scale-102 font-black text-[#8C3494]'
                        : 'border-zinc-200 hover:border-zinc-350 bg-zinc-50 text-zinc-700 font-bold'
                    }`}
                  >
                    <span className="text-xs font-black block">DBBL Rocket</span>
                    <span className="text-[9px] font-black uppercase mt-1 tracking-tighter opacity-90">রকেট ওয়ালেট</span>
                  </button>

                  {/* Bank online transfer card Selector */}
                  <button
                    onClick={() => setPaymentMethod('bank')}
                    type="button"
                    className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border text-center transition-all cursor-pointer select-none duration-150 col-span-2 sm:col-span-1 ${
                      paymentMethod === 'bank'
                        ? 'border-emerald-600 bg-emerald-50 shadow-md ring-1 ring-emerald-600 scale-102 font-black text-emerald-700'
                        : 'border-zinc-200 hover:border-zinc-350 bg-zinc-50 text-zinc-700 font-bold'
                    }`}
                  >
                    <span className="text-xs font-black block flex items-center justify-center gap-1 select-none">
                      <Landmark size={12} /> Bank Wire
                    </span>
                    <span className="text-[9px] font-black uppercase mt-1 tracking-tighter opacity-90">ব্যাংক ট্রান্সফার</span>
                  </button>
                </div>

                {/* Bank Account Wire Form fields layout (inline display avoids navigation hassle) */}
                {paymentMethod === 'bank' && (
                  <div className="bg-zinc-50 border-2 border-emerald-200 p-4 rounded-2.5xl mt-3 space-y-3 text-xs text-zinc-800 font-bold animate-fade-in shadow-inner">
                    {/* Ghoroya official bank card */}
                    <div className="bg-emerald-950 text-white p-3.5 rounded-2xl border border-emerald-800 space-y-1.5 shadow select-all">
                      <p className="text-[9.5px] font-black uppercase tracking-wider text-emerald-400">আমাদের ব্যাংক হিসাব তথ্য (Ghoroya Official Bank Account):</p>
                      <p className="text-xs font-semibold leading-relaxed font-sans">
                        🏛️ Bank: <span className="font-extrabold text-emerald-400">{gateways.bankName}</span><br />
                        👤 Acc Name: <span className="font-extrabold text-zinc-100">{gateways.accountName}</span><br />
                        💳 Acc No: <span className="font-extrabold text-zinc-100 font-mono text-[13px]">{gateways.accountNumber}</span><br />
                        📋 Routing: <span className="font-mono text-zinc-300">{gateways.routingNumber}</span>
                      </p>
                      <p className="text-[9px] text-zinc-400 font-medium leading-tight pt-1">
                        {language === 'en' ? '⚠️ Send order total amount to this account, then enter your paying account details below.' : '⚠️ উপরে দেওয়া আমাদের ব্যাংক অ্যাকাউন্টে মূল্য পাঠিয়ে দিয়ে নিচে আপনার পরিশোধকৃত ব্যাংক হিসাবের তথ্য দিন।'}
                      </p>
                    </div>

                    <div className="flex items-start gap-1.5 text-[10.5px] text-emerald-700 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-100 leading-normal select-none">
                      <Landmark size={14} className="shrink-0 mt-0.5" />
                      <div>
                        {language === 'en' 
                          ? 'Wiring Gateway Simulation Active: Enter details to lock verified transaction.' 
                          : 'ব্যাংক খতিয়ান বিস্তারিত প্রদান করুন। আপনার অর্ডার ডেটা সেভিং সুরক্ষিত ব্যাংকিং লাইনে পাঠানো হবে।'}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-[10px] uppercase font-black tracking-wider text-zinc-500 block mb-1">Select Bank</label>
                        <select 
                          name="bankName"
                          value={bankDetails.bankName}
                          onChange={handleBankFieldChange}
                          className="bg-white border border-zinc-250 cursor-pointer rounded-lg p-2 text-xs font-bold w-full outline-none focus:border-red-500 transition"
                        >
                          <option>Dutch-Bangla Bank PLC (DBBL)</option>
                          <option>BRAC Bank PLC</option>
                          <option>The City Bank Limited</option>
                          <option>Sonali Bank PLC</option>
                          <option>Islami Bank Bangladesh PLC</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-black tracking-wider text-zinc-500 block mb-1">Account Holder Name</label>
                        <input
                          type="text"
                          name="accountName"
                          value={bankDetails.accountName}
                          onChange={handleBankFieldChange}
                          placeholder={language === 'en' ? 'e.g. Adnan Sami' : 'যেমন: আদনান সামি'}
                          className="w-full bg-white border border-zinc-250 focus:border-red-500 rounded-lg p-2 text-xs font-bold outline-none transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                      <div>
                        <label className="text-[10px] uppercase font-black tracking-wider text-zinc-500 block mb-1">
                          {language === 'en' ? 'Bank Account Number' : 'ব্যাংক হিসাব নম্বর'}
                        </label>
                        <input
                          type="text"
                          name="accountNumber"
                          value={bankDetails.accountNumber}
                          onChange={handleBankFieldChange}
                          placeholder="e.g. 150120xxxxxxx"
                          className="w-full bg-white border border-zinc-250 focus:border-red-500 rounded-lg p-2 text-xs font-bold outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-black tracking-wider text-zinc-500 block mb-1">
                          {language === 'en' ? 'Routing Number' : 'রাউটিং নম্বর (ঐচ্ছিক)'}
                        </label>
                        <input
                          type="text"
                          name="routingNumber"
                          value={bankDetails.routingNumber}
                          onChange={handleBankFieldChange}
                          placeholder="e.g. 060xxxxxx"
                          className="w-full bg-white border border-zinc-250 focus:border-red-500 rounded-lg p-2 text-xs font-bold outline-none transition"
                        />
                      </div>
                    </div>

                    {/* Submit Bank Button */}
                    <div className="pt-2">
                      <button
                        onClick={() => handleFinishCheckout(`Bank Transfer (${bankDetails.bankName})`)}
                        type="button"
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs uppercase cursor-pointer"
                      >
                        {language === 'en' ? 'Confirm Wire & Register Order' : 'ব্যাংক পেমেন্ট অর্ডার সম্পন্ন করুন'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* COLUMN 2: Basket breakdown, invoice calculations & submit */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Reseller Mode Toggle Segment (Only if Reseller is logged/registered in localStorage and not in storefront context) */}
              {isResellerRegistered && !resellerContext && (
                <div className="bg-amber-50/40 border border-amber-200/60 rounded-3xl p-5 shadow-xs space-y-3.5 transition-all duration-300 animate-fade-in text-zinc-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase text-amber-800 tracking-wider flex items-center gap-1.5">
                      💼 {language === 'en' ? 'Ghoroya Reseller Mode' : 'ঘরোয়া রিসেলার মোড'}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isResellerMode} 
                        onChange={(e) => setIsResellerMode(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-10 h-5.5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>

                  {isResellerMode ? (
                    <div className="space-y-3 animate-fade-in text-xs leading-normal">
                      <div className="bg-white border border-amber-150 rounded-2xl p-3.5 space-y-2 font-mono text-zinc-700">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-zinc-500">{language === 'en' ? 'Wholesale items cost:' : 'আইটেম মোট পাইকারি রেট:'}</span>
                          <span className="font-extrabold text-zinc-900">৳{resellerWholesaleSubtotal}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-zinc-500">{language === 'en' ? 'Package weight scale:' : 'অর্ডারের মোট ওজন:'}</span>
                          <span className="font-extrabold text-zinc-900">{totalWeight.toFixed(2)} kg</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-zinc-500">{language === 'en' ? 'Packaging rate:' : 'প্যাকেজিং ফি খরচ :'}</span>
                          <span className="font-extrabold text-zinc-900">৳{packagingFee}</span>
                        </div>
                        <div className="flex justify-between border-t border-zinc-100 pt-2 text-[11px]">
                          <span className="text-zinc-700 font-bold">{language === 'en' ? 'Base Reseller cost:' : 'রিসেলার বেস মূল্য (কুরিয়ার সহ):'}</span>
                          <span className="font-extrabold text-amber-650">৳{resellerBaseTotal}</span>
                        </div>
                      </div>

                      {/* Custom input for Customer Final Sell Price */}
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-extrabold text-zinc-650">
                          {language === 'en' ? 'Customer Final Selling Price (BDT) *' : 'কাস্টমার চূড়ান্ত বিক্রয়মূল্য (টাকা) *'}
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-zinc-400 font-bold font-mono">৳</span>
                          <input
                            type="number"
                            required
                            value={customerPriceInput}
                            onChange={(e) => {
                              setCustomerPriceInput(e.target.value.replace(/\D/g, ''));
                            }}
                            placeholder={`Recommended: ৳${totalPayable}`}
                            className="w-full bg-white border border-zinc-200 focus:border-amber-500 rounded-xl pl-6 pr-4 py-2 text-zinc-950 font-mono font-bold outline-none shadow-xs transition"
                          />
                        </div>
                        <p className="text-[10px] text-zinc-500 leading-tight">
                          {language === 'en' ? 'Input the final amount our courier will collect from your customer on delivery.' : 'কুরিয়ার মারফত ক্রেতা পণ্য পাওয়ার সময় কাস্টমারের কাছ থেকে মোট এই পরিমাণ টাকা তোলা হবে।'}
                        </p>
                      </div>

                      {/* Decisive earnings box */}
                      <div className="bg-amber-600/5 border border-amber-500/10 rounded-2xl p-3 flex justify-between items-center animate-pulse">
                        <div>
                          <span className="text-[10px] text-amber-800 block font-bold">{language === 'en' ? 'Expected Earnings:' : 'আপনার নিশ্চিত নীট লাভ:'}</span>
                          <span className="text-[9px] text-zinc-400 block">Includes 1% (৳{adminMarkupCut}) admin commission fee deduction</span>
                        </div>
                        <span className="text-amber-600 font-black font-mono text-base block">৳{resellerNetProfit}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[10px] text-amber-800/80 leading-normal font-medium">
                      {language === 'en' ? 'Switch on to submit this order as a reseller dispatch with customized markups.' : 'কাস্টমারের জন্য নিজস্ব রেটে সাবমিট করতে সুইচ অন করে কাস্টমার প্রাইজ সিলেক্ট করুন।'}
                    </p>
                  )}

                  {/* Dev/Merchant helper notice */}
                  <div className="mt-2.5 pt-2.5 border-t border-amber-100/50 space-y-2 text-[9.5px] text-amber-900/60 leading-normal">
                    <div className="flex items-start gap-1.5">
                      <span className="text-sm select-none mt-[-1px]">⚠️</span>
                      <p>
                        {language === 'en' 
                          ? 'Notice: This panel is only visible because you are logged in as a Reseller on this browser session. General public clients (ordinary customers) will NEVER see this segment.' 
                          : 'বিশেষ দ্রষ্টব্য: আপনি এই ব্রাউজারে রিসেলার পোর্টালে লগইন আছেন বলেই শুধু এই অপশনটি দেখতে পাচ্ছেন। সাধারণ ক্রেতারা (কাস্টমাররা) শপে পন্য কেনার সময় এটি কখনোই দেখতে পাবে না।'}
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.removeItem('ghoroya_reseller_phone');
                          localStorage.removeItem('ghoroya_reseller_role');
                          setIsResellerRegistered(false);
                          setIsResellerMode(false);
                          window.dispatchEvent(new Event('ghoroya_reseller_change'));
                          alert(language === 'en' ? 'Logged out of reseller mode! You can now checkout as a normal public customer.' : 'রিসেলার সেকশন সফলভাবে নিষ্ক্রিয় করা হয়েছে! এখন আপনি একজন সাধারণ ক্রেতা হিসেবে অর্ডার করতে পারবেন।');
                        }}
                        className="text-[9.5px] font-black underline hover:text-amber-600 px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/15 rounded-md cursor-pointer transition text-right"
                      >
                        {language === 'en' ? 'Click here to logout of Reseller Session and buy as general customer' : 'সাধারণ কাস্টমার মোডে ফিরে যেতে এখানে ক্লিক করুন (রিসেলার সেশন বন্ধ করুন)'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Review Selected Products */}
              <div className="bg-white border border-zinc-200 rounded-3xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2 flex-wrap gap-1">
                  <h4 className="font-extrabold text-xs sm:text-sm text-zinc-950 uppercase tracking-widest flex items-center gap-1.5">
                    <ShoppingBag size={14} className="text-red-505" />
                    <span>{language === 'en' ? 'Review Selected Products' : 'নির্বাচিত পণ্যসমূহ'}</span>
                  </h4>
                  <span className="text-[10px] text-zinc-400 font-extrabold">{cart.length} items</span>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-6 text-zinc-400 font-medium text-xs">
                    {language === 'en' ? 'Cart is empty.' : 'কার্ট সম্পূর্ণ খালি।'}
                  </div>
                ) : (
                  <div className="space-y-3.5 max-h-56 overflow-y-auto scrollbar pr-1">
                    {cart.map((item) => (
                      <div
                        key={`${item.product.id}-${item.selectedColor || ''}-${item.selectedSize || ''}`}
                        className="flex gap-2.5 items-center justify-between border-b border-zinc-100 pb-2.5 last:border-0 last:pb-0"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-10 h-10 object-cover rounded-md border"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-[11px] sm:text-xs font-bold text-zinc-805 truncate">
                            {language === 'en' ? item.product.name : item.product.nameBn}
                          </h5>
                          <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-[9px] text-zinc-400 font-bold select-none uppercase">
                            {item.selectedColor && (
                              <span className="bg-zinc-100 border px-1.5 py-0.2 rounded text-[8px]">
                                {item.selectedColor}
                              </span>
                            )}
                            {item.selectedSize && (
                              <span className="bg-zinc-100 border px-1.5 py-0.2 rounded text-[8px]">
                                {item.selectedSize}
                              </span>
                            )}
                            <span className="text-zinc-500">৳{item.product.price.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Modifiable inline handlers */}
                        <div className="flex items-center gap-1 shrink-0 select-none">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, Math.max(item.quantity - 1, 1))}
                            type="button"
                            className="bg-white hover:bg-zinc-100 border border-zinc-250 p-1 rounded-md text-zinc-650 transition cursor-pointer flex items-center justify-center w-5 h-5"
                            title="Decrease quantity"
                          >
                            <Minus size={9} className="font-extrabold" />
                          </button>
                          <span className="text-xs font-black text-zinc-900 px-1.5 min-w-[16px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, Math.min(item.quantity + 1, item.product.stock))}
                            type="button"
                            className="bg-white hover:bg-zinc-100 border border-zinc-250 p-1 rounded-md text-zinc-650 transition cursor-pointer flex items-center justify-center w-5 h-5"
                            title="Increase quantity"
                          >
                            <Plus size={9} className="font-extrabold" />
                          </button>
                          
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            type="button"
                            className="text-zinc-400 hover:text-red-655 p-1 ml-1 transition cursor-pointer"
                            title={language === 'en' ? 'Remove product' : 'পণ্যটি বাদ দিন'}
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* REAL-TIME TOTAL RECALCULATOR DETAIL BAR */}
              <div className="bg-white border border-zinc-200 rounded-3xl p-5 shadow-xs space-y-3.5 select-none">
                <h4 className="font-extrabold text-xs sm:text-sm text-zinc-900 uppercase tracking-widest border-b border-zinc-100 pb-2">
                  {language === 'en' ? 'Invoice Summary' : 'অর্ডারের বিল ভাউচার রশিদ'}
                </h4>

                <div className="space-y-2 text-xs font-semibold text-zinc-600">
                  <div className="flex justify-between">
                    <span>{language === 'en' ? 'Products Base Subtotal' : 'পণ্য সামগ্রী মূল্য'}</span>
                    <span className="text-zinc-900 font-bold">৳{subTotal.toLocaleString()}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-black bg-emerald-50/50 p-1.5 rounded-lg border border-emerald-150">
                      <span>🎟️ {language === 'en' ? `Discount Applied (${appliedVoucher?.code})` : `কুপন ছাড় মওকুফ (${appliedVoucher?.code})`}</span>
                      <span>-৳{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  {isFreeShippingByCoupon && (
                    <div className="flex justify-between text-emerald-600 font-black bg-emerald-50/50 p-1.5 rounded-lg border border-emerald-150">
                      <span>🎁 {language === 'en' ? 'Voucher Benefit: FREE Shipping' : 'ভাউচার সুবিধা: ফ্রি এক্সপ্রেস ডেলিভারি'}</span>
                      <span>{language === 'en' ? 'Activated' : 'সক্রিয়'}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center bg-zinc-50 border p-2 rounded-lg">
                    <span className="flex items-center gap-1">
                      <Truck size={12} className="text-zinc-600" />
                      {language === 'en' ? 'Live Courier Cost' : 'স্বয়ংক্রিয় ডেলিভারি খরচ'}
                    </span>
                    <span className={`text-zinc-900 font-bold ${isFreeShippingByCoupon ? 'line-through text-zinc-400' : ''}`}>
                      ৳{deliveryCharge.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-100 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-black text-zinc-455 block uppercase tracking-wide">
                      {isResellerMode 
                        ? (language === 'en' ? 'Courier Collection Amount:' : 'কাস্টমার এন্ড ডেলিভারি কালেকশন:')
                        : (language === 'en' ? 'Net Amount Payable:' : 'ভ্যাটসহ সর্বমোট পরিশোধযোগ্য বিল:')}
                    </span>
                    <span className="text-[9px] text-zinc-400 font-semibold italic block">
                      {isResellerMode 
                        ? (language === 'en' ? 'Amount to collect from customer' : 'কাস্টমারের নিকট থেকে মোট উত্তোলন ফি')
                        : (language === 'en' ? 'Inclusive of all handling charges' : 'ডেলিভারি হ্যান্ডলিং চার্জ সহ')}
                    </span>
                  </div>
                  <span className="text-red-655 font-black text-lg sm:text-2xl transition duration-300">
                    ৳{(isResellerMode ? finalSellValue : totalPayable).toLocaleString()}
                  </span>
                </div>

                {/* MAIN ORDER ACCOMPLISHER BUTTON CONTAINER */}
                <div className="pt-2">
                  {paymentMethod === 'cod' ? (
                    <button
                      onClick={handleCODOrder}
                      type="button"
                      disabled={cart.length === 0}
                      className={`w-full py-3.5 bg-red-650 hover:bg-red-750 text-white rounded-2xl font-black text-xs sm:text-sm shadow-md shadow-red-600/10 transition duration-150 cursor-pointer text-center select-none uppercase tracking-wide leading-none ${cart.length === 0 ? 'bg-zinc-300 cursor-not-allowed opacity-50' : ''}`}
                    >
                      {language === 'en' ? '🤝 Place Order (Cash on Delivery)' : '🤝 ক্যাশ অন ডেলিভারি অর্ডার সাবমিট করুন (নিশ্চিত করুন)'}
                    </button>
                  ) : paymentMethod === 'bank' ? (
                    <div className="text-[11px] text-zinc-500 font-extrabold text-center bg-zinc-50 border p-3 rounded-xl">
                      {language === 'en' ? '👉 Complete the bank account form on the left to submit wire order.' : '👉 অর্ডার শেষ করতে বাম পাশের ব্যাংক হিসাব বিবরণী পূরণ করে সাবমিট বাটনে চাপুন।'}
                    </div>
                  ) : (
                    <button
                      onClick={handleStartMobileWallet}
                      type="button"
                      disabled={cart.length === 0}
                      className={`w-full py-4 text-white rounded-2xl font-black text-xs sm:text-sm shadow-md transition duration-150 cursor-pointer text-center select-none uppercase tracking-wide leading-none flex items-center justify-center gap-1.5 ${
                        cart.length === 0 
                          ? 'bg-zinc-300 cursor-not-allowed opacity-50'
                          : paymentMethod === 'bkash'
                          ? 'bg-[#E2125D] hover:bg-[#C90E50] shadow-[#E2125D]/10'
                          : paymentMethod === 'nagad'
                          ? 'bg-[#F15A22] hover:bg-[#D84914] shadow-[#F15A22]/10'
                          : 'bg-[#8C3494] hover:bg-[#742b7b] shadow-[#8C3494]/10'
                      }`}
                    >
                      <Lock size={12} />
                      <span>
                        {paymentMethod === 'bkash'
                          ? language === 'en' ? 'Pay Securely with bKash' : 'বিকাশ সিকিউর দিয়ে পরিষদ করুন'
                          : paymentMethod === 'nagad'
                          ? language === 'en' ? 'Pay Securely with Nagad' : 'নগদ গেটওয়ে দিয়ে এগিয়ে যান'
                          : language === 'en' ? 'Pay Securely with Rocket' : 'রকেট দিয়ে সরাসরি পেমেন্ট সম্পূর্ণ করুন'}
                      </span>
                    </button>
                  )}
                </div>

                {/* Secure Trust Seal inside payment container */}
                <div className="space-y-2 border-t border-zinc-150 pt-3 flex flex-col gap-1.5Packed">
                  <div className="bg-emerald-50 text-[10px] text-emerald-750 p-2.5 rounded-xl border border-emerald-150 text-center font-extrabold select-none">
                    🛡️ {language === 'en' ? 'Protected by Ghoroya Protection: Full Refund within 7 days if defective.' : '🛡️ ঘরোয়া প্রোটেকশন দ্বারা সুরক্ষিত: ত্রুটিপূর্ণ পণ্য ৭ দিনের মধ্যে সম্পূর্ণ রিটার্নযোগ্য।'}
                  </div>
                  <TrustFeatures language={language} layout="compact" />
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* MOBILE BANKING PORTAL GATEWAY SIMULATOR (Satisfying and beautiful sandbox flow) */}
      {isPayingSimulated && (
        <div className="fixed inset-0 z-55 bg-black/85 flex items-center justify-center p-3 animate-fade-in backdrop-blur-xs select-none">
          <div className="bg-white max-w-sm w-full rounded-3xl overflow-hidden shadow-2xl border border-zinc-200">
            
            {/* Wallet Header */}
            <div
              className={`p-4 text-white text-center font-bold flex items-center justify-between shadow ${
                paymentMethod === 'bkash' 
                  ? 'bg-[#E2125D]' 
                  : paymentMethod === 'nagad' 
                  ? 'bg-[#F15A22]' 
                  : 'bg-[#8C3494]'
              }`}
            >
              <span className="font-extrabold tracking-wide uppercase text-sm">
                {paymentMethod === 'bkash' ? 'bKash Merchant Pay' : paymentMethod === 'nagad' ? 'Nagad Secure PG' : 'Rocket DBBL API'}
              </span>
              <button
                onClick={() => {
                  setIsPayingSimulated(false);
                  setSimulatedStep(0);
                }}
                type="button"
                className="hover:bg-white/20 p-2 rounded-full cursor-pointer transition text-white"
              >
                <X size={15} />
              </button>
            </div>

            {/* Simulated authentication steps */}
            <div className="p-5 space-y-4">
              
              {/* Wallet internal error reporting */}
              {formErr && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-[11px] font-bold p-2.5 rounded-lg text-center flex items-center justify-center gap-1.5">
                  <AlertCircle size={12} className="shrink-0" />
                  <span>{formErr}</span>
                </div>
              )}

              {/* Step 1: Wallet Number confirmation */}
              {simulatedStep === 1 && (
                <div className="space-y-3">
                  {/* Dynamic receiver target indicator banner */}
                  <div className="bg-zinc-50 border p-2.5 rounded-xl text-center space-y-1 select-all">
                    <span className="text-[9.5px] font-black text-zinc-400 uppercase tracking-wider block">Receiver Ghoroya Account (প্রাপক নম্বর)</span>
                    <span className="text-sm font-black font-mono tracking-wider text-zinc-900 block bg-zinc-150 py-1 px-2.5 rounded-lg">
                      {paymentMethod === 'bkash' ? gateways.bkash : paymentMethod === 'nagad' ? gateways.nagad : gateways.rocket}
                    </span>
                    <span className="text-[8.5px] text-zinc-500 font-bold block">
                      {paymentMethod === 'bkash' ? 'bKash Merchant/Personal Account' : paymentMethod === 'nagad' ? 'Nagad Secure PG Wallet' : 'Rocket DBBL API Wallet'}
                    </span>
                  </div>

                  <div className="text-center font-bold text-zinc-700 text-xs py-1 leading-normal">
                    {language === 'en' 
                      ? 'Secure Transfer API: Enter your 11-digit wallet number to clear balance' 
                      : 'নিরাপদ গেটওয়ে কানেকশন: পরিশোধের জন্য আপনার ওয়ালেট নম্বরটি দিন'}
                  </div>
                  <input
                    type="text"
                    maxLength={11}
                    value={walletNumber}
                    onChange={(e) => setWalletNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 017xxxxxxxx"
                    className="w-full bg-zinc-50 border border-zinc-300 outline-none rounded-xl p-3 text-sm font-black tracking-widest text-center text-zinc-900 focus:border-red-500 font-mono"
                  />
                  <button
                    onClick={handleVerifyWalletNumber}
                    type="button"
                    className={`w-full py-3.5 text-white rounded-xl font-bold text-xs cursor-pointer select-none transition-all duration-155 uppercase ${
                      walletNumber.length >= 11
                        ? paymentMethod === 'bkash'
                          ? 'bg-[#E2125D]'
                          : paymentMethod === 'nagad'
                          ? 'bg-[#F15A22]'
                          : 'bg-[#8C3494]'
                        : 'bg-zinc-300 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {language === 'en' ? 'Get Instant OTP Mobile Code' : 'ওটিপি সেন্ড করুন'}
                  </button>
                </div>
              )}

              {/* Step 2: SMS Verification Code Simulator */}
              {simulatedStep === 2 && (
                <div className="space-y-3">
                  <div className="text-center text-xs text-zinc-650 font-semibold">
                    🔑 {language === 'en' ? 'SMS Sent! Enter high-safety verification code' : 'আপনার মোবাইলে পাঠানো ওটিপি কোডটি লিখুন'}
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full bg-zinc-50 border border-zinc-300 outline-none rounded-xl p-3 text-sm font-black tracking-widest text-center text-zinc-900 focus:border-red-500 font-mono"
                  />
                  <p className="text-[10px] text-red-655 bg-red-50/75 p-2.5 rounded-lg border border-red-200/60 font-bold text-center leading-tight">
                    💡 {language === 'en' ? 'Sandbox Simulation: Enter any 4 to 6 numbers to verify.' : 'স্যান্ডবক্স গেটওয়ে সিমুলেশন: যেকোনো ৪-৬ সংখ্যা দিয়ে এগিয়ে যান।'}
                  </p>
                  <button
                    onClick={handleVerifyOTP}
                    type="button"
                    className={`w-full py-3.5 text-white rounded-xl font-bold text-xs cursor-pointer select-none transition-all ${
                      otpCode.length >= 4
                        ? paymentMethod === 'bkash'
                          ? 'bg-[#E2125D]'
                          : paymentMethod === 'nagad'
                          ? 'bg-[#F15A22]'
                          : 'bg-[#8C3494]'
                        : 'bg-zinc-300 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {language === 'en' ? 'Verify OTP Code' : 'ভেরিফাই ওটিপি'}
                  </button>
                </div>
              )}

              {/* Step 3: PIN validation */}
              {simulatedStep === 3 && (
                <div className="space-y-3">
                  <div className="text-center text-xs text-zinc-650 font-semibold">
                    🔒 {language === 'en' ? 'Enter secret wallet PIN' : 'আপনার গোপন পিন কোডটি লিখুন'}
                  </div>
                  <input
                    type="password"
                    maxLength={5}
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••"
                    className="w-full bg-zinc-55 border border-zinc-300 outline-none rounded-xl p-3 text-sm font-black tracking-widest text-center text-zinc-900 focus:border-red-500"
                  />
                  <p className="text-[9px] text-zinc-500 text-center">
                    * {language === 'en' ? 'Encrypted via bank-level AES standard.' : 'ব্যাংকিং স্ট্যান্ডার্ড নিয়মে পিন এনক্রিপ্ট হবে।'}
                  </p>
                  <button
                    onClick={handleSubmitPINAndFinish}
                    type="button"
                    className={`w-full py-3.5 text-white rounded-xl font-bold text-xs cursor-pointer select-none transition-all duration-155 uppercase ${
                      pinCode.length >= 4
                        ? paymentMethod === 'bkash'
                          ? 'bg-[#E2125D]'
                          : paymentMethod === 'nagad'
                          ? 'bg-[#F15A22]'
                          : 'bg-[#8C3494]'
                        : 'bg-zinc-300 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {language === 'en' ? 'Complete secure transaction' : 'পেমেন্ট সম্পন্ন করুন'}
                  </button>
                </div>
              )}

              {/* simulated portal footer */}
              <div className="text-center pt-3.5 border-t border-zinc-150 text-[10px] text-zinc-500 font-extrabold select-none">
                {language === 'en' ? 'Securing checkout payable of:' : 'ঘরোয়া বাজারের জন্য পরিশোধ হচ্ছে:'}{' '}
                <span className="text-red-655 font-black text-xs select-none">৳{totalPayable.toLocaleString()}</span>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
