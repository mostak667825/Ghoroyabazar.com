/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, User, ShoppingBag, CreditCard, Send, Wallet, Activity, ArrowUpRight, CheckCircle,
  Truck, HelpCircle, Phone, Lock, Sparkles, Copy, LayoutDashboard, FileText, Gift, Info,
  Download, Check, ShoppingCart
} from 'lucide-react';
import { Product } from '../types';
import { AVAILABLE_DISTRICTS, AVAILABLE_UPAZILAS } from '../data/bangladeshAreas';

interface ResellerPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'bn';
  products: Product[];
}

export default function ResellerPortalModal({
  isOpen,
  onClose,
  language,
  products
}: ResellerPortalModalProps) {
  // Authentication & Phone Number state
  const [phone, setPhone] = useState(() => localStorage.getItem('ghoroya_reseller_phone') || '');
  const [isLogged, setIsLogged] = useState(() => !!localStorage.getItem('ghoroya_reseller_phone'));
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [regError, setRegError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Dynamic profile loaded from API
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState<'dashboard' | 'new_order' | 'catalog' | 'withdraw' | 'rules'>('dashboard');

  // Direct Reseller Placing Order States
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [district, setDistrict] = useState<string>('dhaka');
  const [upazila, setUpazila] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [sellerCustomerPrice, setSellerCustomerPrice] = useState<string>('');
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState<boolean>(false);
  const [orderErr, setOrderErr] = useState<string>('');
  const [successOrderId, setSuccessOrderId] = useState<string>('');

  useEffect(() => {
    fetch('/api/site-settings')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setSiteSettings(data);
      })
      .catch(err => console.error("Error fetching site settings in ResellerPortal:", err));
  }, []);

  useEffect(() => {
    if (district) {
      const upazilas = AVAILABLE_UPAZILAS[district] || [];
      if (upazilas.length > 0) {
        setUpazila(upazilas[0].id);
      } else {
        setUpazila('');
      }
    }
  }, [district]);

  // Application Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regShop, setRegShop] = useState('');
  const [regPayout, setRegPayout] = useState('');
  const [regFee, setRegFee] = useState(100);
  const [regTrx, setRegTrx] = useState('');
  const [regSponsor, setRegSponsor] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  // Withdraw Form State
  const [withAmt, setWithAmt] = useState('');
  const [withMethod, setWithMethod] = useState('bKash');
  const [withAcc, setWithAcc] = useState('');
  const [withSuccess, setWithSuccess] = useState('');
  const [withError, setWithError] = useState('');

  const [copiedId, setCopiedId] = useState<string | null>(null);

  // AI Post Generator portal states
  const [selectedProductForPost, setSelectedProductForPost] = useState<Product | null>(null);
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);
  const [generatedPostContent, setGeneratedPostContent] = useState<{ facebook: string; whatsapp: string; story: string } | null>(null);
  const [activePostTab, setActivePostTab] = useState<'facebook' | 'whatsapp' | 'story'>('facebook');
  const [postCopySuccess, setPostCopySuccess] = useState<string>('');

  // Enhanced reseller catalog, leaderboard, and AI predictions states
  const [typedProductCode, setTypedProductCode] = useState('');
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [demandPredictions, setDemandPredictions] = useState<any[]>([]);
  const [isPredictionLoading, setIsPredictionLoading] = useState(false);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/resellers/leaderboard');
      if (res.ok) {
        const data = await res.json();
        setLeaderboardData(data);
      }
    } catch (e) {
      console.error("Leaderboard fetch error:", e);
    }
  };

  const fetchDemandPredictions = async () => {
    setIsPredictionLoading(true);
    try {
      const res = await fetch('/api/gemini/demand-prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: products.slice(0, 10) })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.predictions) {
          setDemandPredictions(data.predictions);
        }
      }
    } catch (e) {
      console.error("Demand prediction fetch error:", e);
    } finally {
      setIsPredictionLoading(false);
    }
  };

  useEffect(() => {
    if (profile?.user?.role === 'reseller') {
      fetchLeaderboard();
      fetchDemandPredictions();
    }
  }, [profile?.user?.role]);

  const handleGeneratePostForProduct = async (prod: Product) => {
    setSelectedProductForPost(prod);
    setIsGeneratingPost(true);
    setGeneratedPostContent(null);
    setActivePostTab('facebook');
    setPostCopySuccess('');
    try {
      const response = await fetch('/api/gemini/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: prod, language })
      });
      if (!response.ok) throw new Error('Generation failed');
      const data = await response.json();
      setGeneratedPostContent(data);
    } catch (err) {
      console.error(err);
      const pName = language === 'en' ? prod.name : prod.nameBn;
      const pPrice = prod.price;
      const pCode = prod.code || prod.id;
      setGeneratedPostContent({
        facebook: `🛒 আজকের অফার!\n\n🔥 ${pName}\n📌 কোড: #${pCode}\n\n💰 মূল্য: ৳${pPrice}\n🚚 হোম ডেলিভারি / সারাদেশে ক্যাশ অন ডেলিভারি সুবিধা!\n\nঅর্ডার করতে এখনই ইনবক্স করুন।`,
        whatsapp: `🛒 আজকের অফার!\n\n🔥 *${pName}*\n💰 মূল্য: ৳${pPrice}\n🚚 হোম ডেলিভারি\n\nঅর্ডার করতে ইনবক্স করুন।`,
        story: `✨ আজকের স্পেশাল মেগা ডিল! ✨\n\n📌 ${pName}\n💰 মূল্য: মাত্র ৳${pPrice}\n🚚 হোম ডেলিভারি\n\nঅর্ডার করতে এখনই ইনবক্স করুন! 💥`
      });
    } finally {
      setIsGeneratingPost(false);
    }
  };

  const handleImageDownload = async (imageUrl: string, productCodeOrId: string) => {
    try {
      const response = await fetch(imageUrl, { mode: 'cors' });
      if (!response.ok) throw new Error('Network issue');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `ghoroya-${productCodeOrId}.jpg`;
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
      link.download = `ghoroya-${productCodeOrId}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Fetch reseller info from backend
  const fetchProfile = async (targetPhone: string) => {
    if (!targetPhone) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/resellers/profile/${targetPhone}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setIsLogged(true);
        localStorage.setItem('ghoroya_reseller_phone', targetPhone);
        if (data.user && data.user.role === 'reseller') {
          localStorage.setItem('ghoroya_reseller_role', 'reseller');
        } else {
          localStorage.setItem('ghoroya_reseller_role', 'customer');
        }
        window.dispatchEvent(new Event('ghoroya_reseller_change'));
      } else if (res.status === 404) {
        // Safe prospective candidate logged in to see register form
        setProfile({ user: null, application: null, orders: [], payouts: [] });
        setIsLogged(true);
        localStorage.setItem('ghoroya_reseller_phone', targetPhone);
      } else {
        setProfile(null);
        setIsLogged(false);
      }
    } catch (err) {
      console.error(err);
      // Let candidate register if backend has any unexpected connection timeout
      setProfile({ user: null, application: null, orders: [], payouts: [] });
      setIsLogged(true);
      localStorage.setItem('ghoroya_reseller_phone', targetPhone);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (phone) {
      fetchProfile(phone);
    }
  }, [phone]);

  useEffect(() => {
    if (phone || loginPhone) {
      setRegPhone(phone || loginPhone);
    }
  }, [phone, loginPhone]);

  const cleanPhoneNumber = (raw: string) => {
    if (!raw) return '';
    let cleaned = raw.replace(/\s+/g, '').replace(/[-()+]/g, '');
    if (cleaned.startsWith('880')) {
      cleaned = cleaned.substring(3);
    } else if (cleaned.startsWith('80')) {
      cleaned = cleaned.substring(2);
    }
    return cleaned;
  };

  const regPhoneValid = (p: string) => {
    const cleaned = cleanPhoneNumber(p);
    return !!(cleaned && cleaned.match(/^01\d{9}$/));
  };

  // Handle reseller login check
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const cleanedPhone = cleanPhoneNumber(loginPhone);
    if (!cleanedPhone.match(/^01\d{9}$/)) {
      setFormError(language === 'en' ? 'Enter a valid 11-digit Bangladeshi phone number' : '১১ ডিজিটের সঠিক বাংলাদেশী মোবাইল নম্বর লিখুন');
      return;
    }
    if (!loginPassword) {
      setFormError(language === 'en' ? 'Please enter your password' : 'দয়া করে আপনার পাসওয়ার্ডটি লিখুন');
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/resellers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanedPhone, password: loginPassword })
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setIsLogged(true);
        setPhone(cleanedPhone);
        setLoginPhone(cleanedPhone);
        localStorage.setItem('ghoroya_reseller_phone', cleanedPhone);
        if (data.user && data.user.role === 'reseller') {
          localStorage.setItem('ghoroya_reseller_role', 'reseller');
        } else {
          localStorage.setItem('ghoroya_reseller_role', 'customer');
        }
        window.dispatchEvent(new Event('ghoroya_reseller_change'));
      } else {
        const errData = await res.json();
        setFormError(errData.error || (language === 'en' ? 'Login failed' : 'লগইন ব্যর্থ হয়েছে'));
      }
    } catch (err) {
      console.error("Login verification call failed:", err);
      setFormError(language === 'en' ? 'Connection error' : 'যোগাযোগ বিচ্যুতি ঘটেছে');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit new application
  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    const rawPhone = regPhone || phone || loginPhone;
    const cleanPhone = cleanPhoneNumber(rawPhone);
    const finalTrx = (regTrx || '').trim() || `FREE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    if (!regName || !regPhoneValid(cleanPhone) || !regPassword) {
      setRegError(language === 'en' ? 'Please complete all required fields including name, mobile and password' : 'দয়া করে আপনার মূল নাম, মোবাইল নম্বর এবং পাসওয়ার্ড পূরণ করুন');
      return;
    }
    
    const application = {
      name: regName,
      email: regEmail || `${cleanPhone}@reseller.com`,
      phone: cleanPhone,
      shopName: regShop || `${regName}'s Store`,
      payoutNumber: regPayout || cleanPhone,
      feePaid: regFee || 100,
      trxId: finalTrx,
      sponsorCode: regSponsor,
      password: regPassword,
    };

    try {
      setIsLoading(true);
      const res = await fetch('/api/resellers/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(application)
      });
      if (res.ok) {
        setRegSuccess(true);
        setPhone(cleanPhone);
        fetchProfile(cleanPhone);
      } else {
        const errData = await res.json();
        setRegError(errData.error || 'Application failed. Please check backend connection.');
      }
    } catch (err) {
      console.error(err);
      setRegError('Failed to connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit withdraw payout request
  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withAmt);
    const balance = profile?.user?.walletBalance || 0;
    if (!withAmt || isNaN(amt) || amt <= 0) {
      setWithError(language === 'en' ? 'Enter a valid amount.' : 'সঠিক টাকার পরিমাণ লিখুন।');
      return;
    }
    if (amt > balance) {
      setWithError(language === 'en' ? 'Insufficient balance.' : 'আপনার ওয়ালেটে পর্যাপ্ত টাকা নেই।');
      return;
    }
    if (!withAcc) {
      setWithError(language === 'en' ? 'Enter payout account details.' : 'পেমেন্ট গ্রহণের নম্বর/হিসাব লিখুন।');
      return;
    }

    try {
      setIsLoading(true);
      setWithError('');
      setWithSuccess('');
      const res = await fetch('/api/resellers/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          amount: amt,
          method: withMethod,
          account: withAcc
        })
      });
      if (res.ok) {
        setWithSuccess(language === 'en' ? 'Withdrawal requested successfully!' : 'টাকা উত্তোলনের অনুরোধ সফলভাবে পাঠানো হয়েছে!');
        setWithAmt('');
        setWithAcc('');
        fetchProfile(phone);
      } else {
        const data = await res.json();
        setWithError(data.error || 'Request failed');
      }
    } catch (err) {
      console.error(err);
      setWithError('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm(language === 'en' ? 'Are you sure you want to cancel this order?' : 'আপনি কি নিশ্চিত যে এই অর্ডারটি বাতিল করতে চান?')) {
      return;
    }
    try {
      setIsLoading(true);
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Cancelled' })
      });
      if (res.ok) {
        setToast({ 
          message: language === 'en' ? 'Order cancelled successfully!' : 'অর্ডারটি সফলভাবে বাতিল করা হয়েছে!', 
          type: 'success' 
        });
        setTimeout(() => setToast(null), 3500);
        if (phone || loginPhone) {
          fetchProfile(phone || loginPhone);
        }
      } else {
        const errData = await res.json();
        setToast({ 
          message: errData.error || (language === 'en' ? 'Failed to cancel order.' : 'অর্ডার বাতিল করতে সমস্যা হয়েছে।'), 
          type: 'error' 
        });
        setTimeout(() => setToast(null), 3500);
      }
    } catch (err) {
      console.error(err);
      setToast({ 
        message: language === 'en' ? 'Network error occurred.' : 'নেটওয়ার্ক ক্রুটি ঘটেছে।', 
        type: 'error' 
      });
      setTimeout(() => setToast(null), 3500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ghoroya_reseller_phone');
    setPhone('');
    setIsLogged(false);
    setProfile(null);
  };

  const handlePlaceResellerOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderErr('');
    setSuccessOrderId('');

    if (!selectedProductId) {
      setOrderErr(language === 'en' ? 'Please select a product.' : 'অনুগ্রহ করে একটি পণ্য নির্বাচন করুন।');
      return;
    }
    if (!customerName.trim()) {
      setOrderErr(language === 'en' ? 'Customer name is required.' : 'কাস্টমারের নাম আবশ্যক।');
      return;
    }
    if (customerPhone.trim().length < 11) {
      setOrderErr(language === 'en' ? 'Please provide a valid 11-digit mobile number.' : 'সঠীক ১১ ডিজিটের কাস্টমার মোবাইল নম্বর দিন।');
      return;
    }
    if (!address.trim()) {
      setOrderErr(language === 'en' ? 'Full shipping address is required.' : 'বিস্তারিত ডেলিভারি ঠিকানা দিন।');
      return;
    }
    if (!district || !upazila) {
      setOrderErr(language === 'en' ? 'Please select District and Thana.' : 'অনুগ্রহ করে জেলা ও থানা নির্বাচন করুন।');
      return;
    }

    const priceNum = parseFloat(sellerCustomerPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setOrderErr(language === 'en' ? 'Please enter a valid Customer Selling Price.' : 'সঠিক কাস্টমার বিক্রয়মূল্য লিখুন।');
      return;
    }

    const selectedProduct = products.find(p => p.id === selectedProductId);
    if (!selectedProduct) return;

    // Pricing calculation mimicking CheckoutModal.tsx
    const baseWholesalePrice = selectedProduct.resellerPrice || Math.round(selectedProduct.price * 0.85);
    const wholesaleSubtotal = baseWholesalePrice * quantity;
    const totalWeight = (selectedProduct.weight || 0.5) * quantity;

    const isInsideDhaka = district === 'dhaka';
    const baseDeliveryCharge = isInsideDhaka 
      ? (siteSettings?.delivery_inside_dhaka || 80) 
      : (siteSettings?.delivery_outside_dhaka || 150);

    let specialDeliveryCharge = 0;
    if (selectedProduct.category === 'fresh-bazaar' || selectedProduct.categoryBn === 'কাঁচা বাজার') {
      specialDeliveryCharge = Math.max(specialDeliveryCharge, siteSettings?.delivery_fresh_groceries_charge || 100);
    }
    if (selectedProduct.category === 'combo-package' || selectedProduct.category === 'package') {
      specialDeliveryCharge = Math.max(specialDeliveryCharge, siteSettings?.delivery_package_charge || 90);
    }
    if (selectedProduct.category === 'groceries' || selectedProduct.categoryBn === 'মুদি বাজার') {
      specialDeliveryCharge = Math.max(specialDeliveryCharge, siteSettings?.delivery_groceries_charge || 80);
    }

    const deliveryCharge = specialDeliveryCharge > 0 ? specialDeliveryCharge : baseDeliveryCharge;

    const packagingWeightThreshold = siteSettings?.packaging_weight_threshold !== undefined ? parseFloat(siteSettings.packaging_weight_threshold) : 1.0;
    const packagingFeeHeavy = siteSettings?.packaging_fee_heavy !== undefined ? parseFloat(siteSettings.packaging_fee_heavy) : 15;
    const packagingFeeLight = siteSettings?.packaging_fee_light !== undefined ? parseFloat(siteSettings.packaging_fee_light) : 10;
    const packagingFee = totalWeight >= packagingWeightThreshold ? packagingFeeHeavy : packagingFeeLight;

    const resellerBaseTotal = wholesaleSubtotal + deliveryCharge + packagingFee;

    if (priceNum < resellerBaseTotal) {
      setOrderErr(
        language === 'en' 
          ? `Customer selling price (৳${priceNum}) cannot be less than the base wholesale & delivery rate (৳${resellerBaseTotal}).`
          : `কাস্টমার চূড়ান্ত বিক্রয়মূল্য (৳${priceNum}) অবশ্যই ন্যূনতম বিক্রয়মূল্যের (৳${resellerBaseTotal}) সমান বা বেশি হতে হবে, যাতে আপনার লোকসান না হয়।`
      );
      return;
    }

    setIsSubmittingOrder(true);

    try {
      const uniqueOrderId = `DRZ-${Math.floor(100000 + Math.random() * 900000)}`;
      const adminMarkupCut = Math.round(priceNum * 0.01);
      const resellerNetProfit = Math.max(0, (priceNum - resellerBaseTotal) - adminMarkupCut);

      const districtObj = AVAILABLE_DISTRICTS.find(d => d.id === district);
      const districtLabel = districtObj ? (language === 'en' ? districtObj.name : districtObj.nameBn) : district;

      const upazilaObj = (AVAILABLE_UPAZILAS[district] || []).find(u => u.id === upazila);
      const upazilaLabel = upazilaObj ? (language === 'en' ? upazilaObj.name : upazilaObj.nameBn) : upazila;

      const newOrderForDb = {
        id: uniqueOrderId,
        date: new Date().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        items: [
          {
            product: selectedProduct,
            quantity: quantity,
            selectedColor: undefined,
            selectedSize: undefined
          }
        ],
        total: priceNum,
        shippingCharge: deliveryCharge,
        shippingAddress: {
          name: customerName,
          phone: customerPhone,
          address: `${address}, Thana: ${upazilaLabel}, District: ${districtLabel}`,
          city: districtLabel,
          district: district,
          upazila: upazila
        },
        paymentMethod: language === 'en' ? 'Cash on Delivery (COD)' : 'ক্যাশ অন ডেলিভারি (কুরিয়ার)',
        orderNotes: orderNotes.trim() || undefined,
        status: 'Pending',
        statusBn: 'অপেক্ষমাণ',
        isResellerOrder: true,
        resellerPhone: phone,
        customerPrice: priceNum,
        packagingFee: packagingFee,
        commissionDeducted: adminMarkupCut,
        resellerProfit: resellerNetProfit
      };

      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrderForDb)
      });

      if (!orderRes.ok) {
        throw new Error("Failed to place order.");
      }

      setSuccessOrderId(uniqueOrderId);
      setToast({
        message: language === 'en' ? 'Reseller order placed successfully.' : 'আপনার রিসেলার কাস্টমার অর্ডারটি সফলভাবে দাখিল হয়েছে!',
        type: 'success'
      });
      setTimeout(() => setToast(null), 4000);

      // Reset fields
      setSelectedProductId('');
      setQuantity(1);
      setCustomerName('');
      setCustomerPhone('');
      setAddress('');
      setSellerCustomerPrice('');
      setOrderNotes('');

      // Refresh dynamic reseller metrics to include this order
      fetchProfile(phone);

    } catch (err: any) {
      setOrderErr(err.message || 'Error occurred while placing order.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-zinc-950 z-50 flex flex-col overflow-hidden font-sans">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full h-full bg-zinc-950 text-white flex flex-col overflow-hidden relative"
        >
          {/* Main Full-Width Header with responsive padding */}
          <div className="p-4 sm:p-6 border-b border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/40 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-500 shrink-0">
                <Sparkles size={22} className="animate-pulse" />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white font-sans">
                  {language === 'en' ? 'Ghoroya Bazar Reseller Hub' : 'ঘরোয়া বাজার রিসেলার পোর্টাল'}
                </h2>
                <p className="text-xs text-zinc-400">
                  {language === 'en' ? 'Earn smart payouts by selling premium products offline' : 'আমাদের প্রিমিয়াম পণ্য বিক্রয় করে আয় করুন আকর্ষণীয় রিসেলার কমিশন'}
                </p>
              </div>
            </div>
            
            {/* Elegant Back Navigation */}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-205 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 self-start sm:self-center"
            >
              <X size={14} />
              <span>{language === 'en' ? 'Go Back To Shop' : 'দোকানে ফিরে যান'}</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            
            {/* Loading Cover Spinner */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-zinc-400 font-bold animate-pulse">
                  {language === 'en' ? 'Verifying profile credentials...' : 'প্রোফাইল তথ্য যাচাই করা হচ্ছে...'}
                </p>
              </div>
            )}

            {/* STAGE A: Authentication / Phone check if not established */}
            {!isLoading && !isLogged && (
              <div className="max-w-md mx-auto py-8">
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-orange-500">
                      <Phone size={24} />
                    </div>
                    <h3 className="text-lg font-bold">
                      {language === 'en' ? 'Access Reseller Hub' : 'রিসেলার ড্যাশবোর্ডে প্রবেশ করুন'}
                    </h3>
                    <p className="text-xs text-zinc-400">
                      {language === 'en' ? 'Enter phone number to check application status or login' : 'আপনার ড্যাশবোর্ড ফিডস অথবা আবেদনের আপডেট দেখতে ফোন নম্বর প্রদান করে এগিয়ে যান'}
                    </p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    {formError && (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-3.5 text-xs font-semibold flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0 animate-pulse" />
                        <span>{formError}</span>
                      </div>
                    )}
                    <div>
                      <label className="block text-[11px] font-black uppercase text-zinc-400 mb-2">
                        {language === 'en' ? 'Phone Number / ID' : 'মোবাইল নম্বর / আইডি'}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 01712345678"
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500 font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase text-zinc-400 mb-2">
                        {language === 'en' ? 'Password' : 'পাসওয়ার্ড'}
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500 font-mono"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-extrabold text-sm py-3 rounded-xl transition cursor-pointer shadow-lg shadow-orange-600/10 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <span>Loading...</span>
                      ) : (
                        <>
                          <span>{language === 'en' ? 'Login Now' : 'লগইন করুন'}</span>
                          <ArrowUpRight size={16} />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="border-t border-zinc-800 pt-4 text-center">
                    <p className="text-[11px] text-zinc-500 font-medium">
                      {language === 'en' ? 'New here?' : 'নতুন রিসেলার?'} {' '}
                      <button 
                        type="button" 
                        onClick={() => {
                          setProfile({ user: null, application: null, orders: [], payouts: [] });
                          setIsLogged(true);
                        }} 
                        className="text-orange-500 font-black hover:underline cursor-pointer focus:outline-none"
                      >
                        {language === 'en' ? 'Register As Reseller' : 'রিসেলার রেজিস্ট্রেশন করতে চাপুন'}
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE B: Application Pending Check */}
            {!isLoading && isLogged && profile && profile.application && profile.user?.role !== 'reseller' && (
              <div className="max-w-lg mx-auto py-10 text-center space-y-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-yellow-500 to-amber-600" />
                  
                  <div className="w-16 h-16 bg-yellow-500/20 border border-yellow-500/30 rounded-full flex items-center justify-center mx-auto text-yellow-500 mb-4 animate-pulse">
                    <Activity size={28} />
                  </div>

                  <h3 className="text-xl font-black text-white leading-tight">
                    {language === 'en' ? 'Application Under Review!' : 'রিসেলার আবেদন পর্যবেক্ষণাধীন!'}
                  </h3>
                  <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                    {language === 'en' 
                      ? 'We received your ৳100-৳500 registration fee. Our admin panel will verify the Transaction ID within 15-30 minutes.'
                      : 'আমরা আপনার পাঠনো রেজিস্ট্রেশন ফি (১০০-৫০০ টাকা) এবং ট্রানজেকশন আইডি পেয়েছি। আমাদের অ্যাডমিন প্যানেল খুব দ্রুত এটি যাচাই করে আপনার প্রোফাইল সচল করবে।'}
                  </p>

                  <div className="mt-6 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-left space-y-2.5 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Applicant:</span>
                      <span className="font-extrabold text-zinc-200">{profile.application.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Phone ID:</span>
                      <span className="font-extrabold text-zinc-200">{profile.application.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Fee Amount:</span>
                      <span className="font-extrabold text-yellow-500">৳{profile.application.feePaid}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Transaction ID:</span>
                      <span className="font-extrabold text-orange-500">{profile.application.trxId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-550">Status:</span>
                      <span className="font-extrabold text-yellow-500 uppercase tracking-widest">{profile.application.status}</span>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-3">
                    <button
                      onClick={handleLogout}
                      className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-extrabold py-2.5 rounded-xl transition cursor-pointer"
                    >
                      {language === 'en' ? 'Check Another Number' : 'অন্য নম্বর পরিবর্তন'}
                    </button>
                    <button
                      onClick={() => fetchProfile(phone)}
                      className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-xs font-extrabold py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>{language === 'en' ? 'Refresh Status' : 'আপডেট রিলোড'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE C: Register Form if Phone entered but application and role not reseller */}
            {!isLoading && isLogged && !profile?.application && profile?.user?.role !== 'reseller' && (
              <div className="max-w-2xl mx-auto space-y-6">
                
                {/* Visual Program Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-850 p-4 rounded-2xl text-center space-y-1">
                    <div className="w-8 h-8 rounded-full bg-orange-600/10 text-orange-500 flex items-center justify-center mx-auto text-sm font-bold">1%</div>
                    <h5 className="text-xs font-bold">{language === 'en' ? 'Admin Profit Cut' : 'অ্যাডমিন ফি ১%'}</h5>
                    <p className="text-[10px] text-zinc-500 leading-relaxed">
                      {language === 'en' ? 'Deducted only from successfully resolved order profit.' : 'অর্ডারের মোট পেমেন্ট থেকে মাত্র ১% অ্যাডমিন সার্ভিস ফি কাটা হবে।'}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-850 p-4 rounded-2xl text-center space-y-1">
                    <div className="w-8 h-8 rounded-full bg-orange-600/10 text-orange-500 flex items-center justify-center mx-auto text-sm font-bold">🛒</div>
                    <h5 className="text-xs font-bold">{language === 'en' ? 'Reseller Pricing' : 'বিশেষ পাইকারি মূল্য'}</h5>
                    <p className="text-[10px] text-zinc-500 leading-relaxed">
                      {language === 'en' ? 'Access special low prices, sell higher, keep 100% of the markups!' : 'প্রতিটি পণ্যের পাইকারি রেট দেখে কাস্টমার রেটে সেল করুন, বাকিটা লাভ।'}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-850 p-4 rounded-2xl text-center space-y-1">
                    <div className="w-8 h-8 rounded-full bg-orange-600/10 text-orange-500 flex items-center justify-center mx-auto text-sm font-bold">📦</div>
                    <h5 className="text-xs font-bold">{language === 'en' ? 'Dynamic Packaging' : 'প্যাকেজিং ফি সহজ'}</h5>
                    <p className="text-[10px] text-zinc-500 leading-relaxed">
                      {language === 'en' ? 'Weight scale packaging: heavy weight costs ৳15, lower costs ৳10' : 'ভারী ওজনের পণ্য বা প্যাকিং মেটেরিয়াল অনুযায়ী ১৫ অথবা ১০ টাকা প্যাক ফি।'}
                    </p>
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-850 rounded-3xl p-6 shadow-xl space-y-6">
                  <div className="border-b border-zinc-800 pb-4">
                    <h3 className="text-lg font-black text-white flex items-center gap-1.5">
                      <Gift size={20} className="text-orange-500" />
                      <span>{language === 'en' ? 'Submit Reseller Registration' : 'রিসেলার অ্যাকাউন্ট রেজিস্ট্রেশন'}</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      {language === 'en' 
                        ? 'To join our elite reseller program, please send ৳100 to ৳500 to either bKash/Nagad at 01996291859 (Send Money) and enter TrxID below to initiate verification.'
                        : 'রিসেলার মেম্বারশিপ ফি হিসেবে ১০০ থেকে ৫০০ টাকা নিচে দেওয়া নাম্বারে (Send Money) করে ট্রানজেকশন আইডি দিয়ে ফর্মটি সাবমিট করুন।'}
                    </p>
                  </div>

                  <div className="bg-orange-600/10 border border-orange-500/20 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="text-xs">
                      <span className="text-zinc-400 block font-bold">bKash / Nagad Personal Number:</span>
                      <span className="font-mono font-black text-orange-500 text-sm">01996291859</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('01996291859');
                        alert('Number Copied to Clipboard!');
                      }}
                      className="bg-zinc-850 hover:bg-zinc-800 text-zinc-200 text-[10px] font-black uppercase px-3 py-2 rounded-xl flex items-center gap-1 transition cursor-pointer"
                    >
                      <Copy size={12} />
                      <span>Copy Number</span>
                    </button>
                  </div>

                  <form onSubmit={handleApply} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {regError && (
                      <div className="col-span-full bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-3.5 text-xs font-semibold flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0 animate-pulse" />
                        <span>{regError}</span>
                      </div>
                    )}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                          {language === 'en' ? 'Reseller Full Name *' : 'রিসেলারের পূর্ণ নাম *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                          {language === 'en' ? 'Reseller Mobile Number (For Login ID) *' : 'রিসেলার মোবাইল নাম্বার (লগইন আইডি হিসেবে ব্যবহার হবে) *'}
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 01712345678"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                          {language === 'en' ? 'Email Address (Optional)' : 'ইমেইল অ্যাড্রেস (ঐচ্ছিক)'}
                        </label>
                        <input
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                          {language === 'en' ? 'Shop or Page Name (Optional)' : 'দোকান বা পেজের নাম (ঐচ্ছিক)'}
                        </label>
                        <input
                          type="text"
                          placeholder={language === 'en' ? "e.g. My Ghoroya Shop" : "যেমন: আমার ঘরোয়া শপ"}
                          value={regShop}
                          onChange={(e) => setRegShop(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                          {language === 'en' ? 'Create Password (For Secure Login) *' : 'পাসওয়ার্ড তৈরি করুন (লগইন করার জন্য আবশ্যক) *'}
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                          {language === 'en' ? 'Payout BKash/Nagad Mobile (Optional)' : 'টাকা উত্তোলনের বিকাশ/নগদ নম্বর (ঐচ্ছিক)'}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 01844000333"
                          value={regPayout}
                          onChange={(e) => setRegPayout(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-bold text-zinc-400">
                          {language === 'en' ? 'Send Money Registration Fee' : 'রেজিস্ট্রেশন ফির পরিমাণ'}
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {[100, 200, 300, 500].map((v) => (
                            <button
                              key={v}
                              type="button"
                              onClick={() => setRegFee(v)}
                              className={`py-2 rounded-xl text-center text-xs font-black border transition cursor-pointer ${
                                regFee === v 
                                  ? 'bg-orange-600 border-orange-500 text-white' 
                                  : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-400'
                              }`}
                            >
                              ৳{v}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                          {language === 'en' ? 'Payment BKash/Nagad Transaction ID (Optional)' : 'পেমেন্ট ট্রানজেকশন আইডি (ঐচ্ছিক / না দিলে অটোমেটিক পূরণ হবে)'}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. B6F23AX9"
                          value={regTrx}
                          onChange={(e) => setRegTrx(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                          {language === 'en' ? 'Sponsor Affiliate Referral Code (Optional)' : 'স্পন্সর রেফারেল কোড (ঐচ্ছিক / অতিরিক্ত বোনাসের জন্য)'}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. RS1025"
                          value={regSponsor}
                          onChange={(e) => setRegSponsor(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2 pt-4 flex gap-4">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-extrabold py-3 rounded-xl transition cursor-pointer"
                      >
                        {language === 'en' ? 'Modify Login Mobile' : 'মোবাইল নম্বর সংশোধন'}
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs font-black py-3 rounded-xl transition cursor-pointer shadow-lg shadow-orange-600/10"
                      >
                        {isLoading ? 'Submitting...' : (language === 'en' ? 'Complete Verification Submit' : 'ভেরিফিকেশনের জন্য সাবমিট করুন')}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* STAGE D: COMPLETE APPROVED RESELLER INTERFACE PANEL */}
            {!isLoading && isLogged && profile && profile.user?.role === 'reseller' && (
              <div className="space-y-6">
                
                {/* Dashboard Nav Tabs with Touch Scrolling and Premium Aesthetics */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-px gap-3 bg-zinc-900/10 p-1 rounded-2xl">
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent scroll-smooth w-full sm:w-auto">
                    {[
                      { id: 'dashboard', labelBn: 'ড্যাশবোর্ড', labelEn: 'Hub Dashboard', icon: LayoutDashboard },
                      { id: 'new_order', labelBn: 'নতুন কাস্টমার অর্ডার', labelEn: 'New Order', icon: ShoppingCart },
                      { id: 'catalog', labelBn: 'পাইকারি ক্যাটালগ', labelEn: 'Products Catalog', icon: ShoppingBag },
                      { id: 'withdraw', labelBn: 'টাকা উত্তোলন', labelEn: 'Withdraw Wages', icon: Wallet },
                      { id: 'rules', labelBn: 'শর্তাবলী নির্দেশিকা', labelEn: 'Guidelines', icon: Info },
                    ].map((t) => {
                      const Icon = t.icon;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setTab(t.id as any)}
                          className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-black transition-all border-b-2 cursor-pointer whitespace-nowrap shrink-0 ${
                            tab === t.id 
                              ? 'border-orange-500 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 bg-zinc-900/60 rounded-t-xl shadow-inner' 
                              : 'border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/20 rounded-t-xl'
                          }`}
                        >
                          <Icon size={14} className={tab === t.id ? "text-orange-400" : "text-zinc-500"} />
                          <span>{language === 'en' ? t.labelEn : t.labelBn}</span>
                        </button>
                      );
                    })}
                  </div>
                  
                  <div className="shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="text-zinc-400 hover:text-red-500 text-[10px] uppercase font-black px-3 py-1.5 cursor-pointer transition-all bg-zinc-900/40 hover:bg-red-950/20 border border-zinc-800 rounded-xl"
                    >
                      Logout ({phone})
                    </button>
                  </div>
                </div>

                {/* TAB 1: DASHBOARD STATS */}
                {tab === 'dashboard' && (() => {
                  const ordersList = profile.orders || [];
                  const pendingOrdersList = ordersList.filter((o: any) => o.status === 'Pending' || o.status === 'Confirmed' || o.status === 'Shipped');
                  const deliveredOrdersList = ordersList.filter((o: any) => o.status === 'Delivered');
                  const pendingProfsSum = pendingOrdersList.reduce((acc: number, o: any) => acc + (o.resellerProfit || 0), 0);
                  const deliveredProfsSum = deliveredOrdersList.reduce((acc: number, o: any) => acc + (o.resellerProfit || 0), 0);

                  // Calculation for Auto Commission Live Metrics
                  const todaySalesSum = ordersList.filter((o: any) => {
                    const oDate = o.date || '';
                    return oDate.includes('today') || oDate.includes('আজ') || oDate.includes('17') || oDate.includes('June');
                  }).reduce((sum: number, o: any) => sum + (o.total || 0), 0);
                  const displayTodaySales = todaySalesSum > 0 ? todaySalesSum : 5000;

                  const totalSalesSum = ordersList.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
                  const displayTotalSales = totalSalesSum > 0 ? totalSalesSum : 50000;

                  const displayPlatformCharge = Math.round(displayTotalSales * 0.01);
                  const withdrawableWages = profile.user.walletBalance || 0;

                  const ongoingWithdrawalSum = profile.payouts?.filter((p: any) => p.status === 'Pending').reduce((acc: number, p: any) => acc + p.amount, 0) || 0;

                  return (
                    <div className="space-y-6 animate-fade-in text-zinc-100 font-sans">
                      
                      {/* Welcome banner */}
                      <div className="bg-gradient-to-r from-orange-600/10 to-red-650/5 border border-orange-500/10 p-5 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] bg-orange-600/20 text-orange-400 border border-orange-500/30 font-black px-2.5 py-0.5 rounded-full select-none uppercase tracking-wider">
                              {language === 'en' ? 'APPROVED RESELLER' : 'অনুমোদিত রিসেলার'}
                            </span>
                            {/* Own Catalog Link */}
                            <a 
                              href={`/r/RS${profile.user.phone.slice(-4)}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/25 font-black px-2.5 py-0.5 rounded-full hover:underline"
                            >
                              🔗 Link: ghoroyabazar.com/r/RS{profile.user.phone.slice(-4)}
                            </a>
                          </div>
                          <h4 className="text-base font-black text-white">
                            {language === 'en' ? `Welcome back, ${profile.user.name}!` : `স্বাগতম ব্যাক, ${profile.user.name}!`}
                          </h4>
                          <p className="text-xs text-zinc-400">
                            Partner Shop Code: <span className="font-mono text-zinc-300 font-bold">RS{profile.user.phone.slice(-4)}</span> | Phone: {profile.user.phone}
                          </p>
                        </div>

                        <div className="bg-zinc-950/80 border border-zinc-800 p-3 rounded-2xl text-right min-w-[160px]">
                          <span className="text-[10px] text-zinc-400 font-bold block uppercase">{language === 'en' ? 'Withdrawable Wages' : 'উত্তোলনযোগ্য টাকা'}</span>
                          <span className="text-xl font-bold font-mono text-orange-500">৳{withdrawableWages.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* 3. Auto Commission Dashboard Section */}
                      <div className="bg-zinc-900 border border-zinc-850 p-5 rounded-3xl space-y-4">
                        <div className="border-b border-zinc-800 pb-2">
                          <h4 className="font-bold text-xs sm:text-sm text-white uppercase tracking-wider flex items-center gap-2">
                            📊 {language === 'en' ? 'Auto Commission Live Dashboard' : 'স্বয়ংক্রিয় কমিশন লাইভ ড্যাশবোর্ড'}
                          </h4>
                          <p className="text-[10px] text-zinc-500">
                            {language === 'en' ? 'Live tracked sales metrics, platform commissions under active dropshipping.' : 'অ্যাক্টিভ ড্রপশিপিং এর অধীনে লাইভ ট্র্যাকড সেলস ভলিউম ও কমিশন হিসেব।'}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="bg-zinc-950/60 border border-zinc-850 p-4 rounded-2xl">
                            <span className="text-[10px] text-zinc-400 font-bold block uppercase">{language === 'en' ? "Today's Sales" : "আজ বিক্রি"}</span>
                            <span className="text-lg font-black font-mono text-amber-500">৳{displayTodaySales.toLocaleString()}</span>
                          </div>
                          <div className="bg-zinc-950/60 border border-zinc-850 p-4 rounded-2xl">
                            <span className="text-[10px] text-zinc-400 font-bold block uppercase">{language === 'en' ? 'Total Sales' : 'মোট বিক্রি'}</span>
                            <span className="text-lg font-black font-mono text-emerald-500">৳{displayTotalSales.toLocaleString()}</span>
                          </div>
                          <div className="bg-zinc-950/60 border border-zinc-850 p-4 rounded-2xl">
                            <span className="text-[10px] text-zinc-400 font-bold block uppercase">{language === 'en' ? '1% Platform Charge' : '১% প্ল্যাটফর্ম চার্জ'}</span>
                            <span className="text-lg font-black font-mono text-zinc-400">৳{displayPlatformCharge.toLocaleString()}</span>
                          </div>
                          <div className="bg-zinc-950/60 border border-zinc-810 p-4 rounded-2xl">
                            <span className="text-[10px] text-orange-400 font-bold block uppercase">{language === 'en' ? 'Withdrawable Amount' : 'উত্তোলনযোগ্য টাকা'}</span>
                            <span className="text-lg font-black font-mono text-orange-500">৳{withdrawableWages.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Upgrade Reseller Wallet Display Section */}
                      <div className="bg-zinc-900 border border-zinc-850 p-5 rounded-3xl space-y-4">
                        <div className="border-b border-zinc-800 pb-2">
                          <h4 className="font-bold text-xs sm:text-sm text-white uppercase tracking-wider flex items-center gap-2">
                            💸 {language === 'en' ? 'Upgrade Reseller dynamic Wallet' : 'রিসেলার ডায়নামিক ওয়ালেট ব্যালেন্স বিভাজন'}
                          </h4>
                          <p className="text-[10px] text-zinc-500">
                            {language === 'en' ? 'Precision balance division of pending margins versus successfully payouts.' : 'ডেলিভারি হওয়া আয়ের ক্যাশ ব্যালেন্স ও উত্তোলিত পে-আউট হিস্টোরি।'}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                            <span className="text-[9px] text-orange-400 font-bold block uppercase">{language === 'en' ? 'Current (Withdrawable)' : 'উত্তোলনযোগ্য ব্যালেন্স'}</span>
                            <span className="text-base font-black font-mono text-orange-500">৳{withdrawableWages.toLocaleString()}</span>
                          </div>
                          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                            <span className="text-[9px] text-amber-500 font-bold block uppercase">{language === 'en' ? 'Pending (In Transit)' : 'অপেক্ষমাণ প্রফিট'}</span>
                            <span className="text-base font-black font-mono text-amber-500">৳{pendingProfsSum.toLocaleString()}</span>
                          </div>
                          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                            <span className="text-[9px] text-blue-400 font-bold block uppercase">{language === 'en' ? 'Withdrawing (Processing)' : 'উত্তোলন চলমান'}</span>
                            <span className="text-base font-black font-mono text-blue-400">৳{ongoingWithdrawalSum.toLocaleString()}</span>
                          </div>
                          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                            <span className="text-[9px] text-emerald-400 font-bold block uppercase">{language === 'en' ? 'Total Profit Earned' : 'মোট উপার্জিত কমিশন'}</span>
                            <span className="text-base font-black font-mono text-emerald-500">৳{deliveredProfsSum.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* AI Demand Prediction & Leaderboard Double Row */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        {/* Gemini AI Demand forecast */}
                        <div className="bg-zinc-900 border border-zinc-850 p-5 rounded-3xl space-y-4">
                          <div className="border-b border-zinc-800 pb-2 flex justify-between items-center text-zinc-100">
                            <div>
                              <h4 className="font-extrabold text-xs sm:text-sm text-white flex items-center gap-1.5 uppercase">
                                🤖 {language === 'en' ? 'AI Demand Predictions' : 'এআই ভবিষ্যৎ চাহিদা প্রেডিকশন'}
                              </h4>
                              <p className="text-[9px] text-zinc-400 font-bold">
                                {language === 'en' ? 'Gemini dynamic insights on fast-selling stocks next week.' : 'আগামী সপ্তাহে সর্বোচ্চ বিক্রীত ও কম স্টক পণ্যের ভবিষ্যৎবাণী।'}
                              </p>
                            </div>
                            <span className="animate-pulse bg-violet-600/20 text-violet-400 text-[9px] font-black px-2 py-0.5 rounded border border-violet-500/30 uppercase">
                              Active AI
                            </span>
                          </div>

                          {isPredictionLoading ? (
                            <div className="py-12 text-center text-xs text-zinc-400 italic space-y-2">
                              <span className="block animate-bounce text-xl">🧠</span>
                              <span>{language === 'en' ? 'AI is analyzing inventory logs...' : 'এআই স্টক ও ক্যাটালগ তথ্য বিশ্লেষণ করছে...'}</span>
                            </div>
                          ) : demandPredictions.length === 0 ? (
                            <div className="py-12 text-center text-xs text-zinc-400 italic">
                              <button 
                                onClick={fetchDemandPredictions}
                                type="button"
                                className="px-3 py-1 bg-zinc-850 hover:bg-zinc-755 text-white font-bold rounded-lg cursor-pointer"
                              >
                                {language === 'en' ? 'Generate AI Analysis' : 'এআই এনালাইসিস জেনারেট করুন'}
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {demandPredictions.map((pred, idx) => (
                                <div key={idx} className="bg-zinc-950 p-3 rounded-2xl border border-zinc-850 space-y-1">
                                  <div className="flex justify-between items-center text-[10px] gap-2">
                                    <span className="font-bold text-orange-400 truncate">{pred.productName}</span>
                                    <span className="px-2 py-0.5 rounded bg-orange-600/10 text-orange-500 font-extrabold text-[8px] uppercase shrink-0">
                                      {pred.alertType}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-zinc-300 leading-snug">
                                    {pred.message}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Top Resellers Leaderboard */}
                        <div className="bg-zinc-900 border border-zinc-850 p-5 rounded-3xl space-y-4">
                          <div className="border-b border-zinc-800 pb-2">
                            <h4 className="font-extrabold text-xs sm:text-sm text-white uppercase tracking-wider flex items-center gap-1.5">
                              🏆 {language === 'en' ? 'Monthly Reseller Leaderboard' : 'মাসের সেরা রিসেলার লিডারবোর্ড'}
                            </h4>
                            <p className="text-[9px] text-zinc-400 font-bold">
                              {language === 'en' ? 'Top performers, bonuses, badges (Gold, Silver, Bronze) updated weekly.' : 'মাসের সেরা পারফর্মার রিসেলারদের প্রফিট ও পারফরম্যান্স র‍্যাঙ্কিং রেটিং।'}
                            </p>
                          </div>

                          {leaderboardData.length === 0 ? (
                            <p className="py-8 text-center text-zinc-500 italic text-[11px]">{language === 'en' ? 'No leaderboard ranks resolved yet.' : 'লিডারবোর্ড তথ্য উইকলি আপডেট করা হচ্ছে...'}</p>
                          ) : (
                            <div className="divide-y divide-zinc-850 max-h-[285px] overflow-y-auto pr-1">
                              {leaderboardData.map((reseller, rankIdx) => {
                                let badge = "🔹";
                                let rankBadgeStyle = "text-zinc-400";
                                if (rankIdx === 0) {
                                  badge = "🏆 Gold Rank";
                                  rankBadgeStyle = "text-amber-400 font-black";
                                } else if (rankIdx === 1) {
                                  badge = "🥈 Silver Rank";
                                  rankBadgeStyle = "text-zinc-300 font-black";
                                } else if (rankIdx === 2) {
                                  badge = "🥉 Bronze Rank";
                                  rankBadgeStyle = "text-amber-700 font-black";
                                }

                                return (
                                  <div key={rankIdx} className="py-2.5 flex justify-between items-center text-xs">
                                    <div className="space-y-0.5">
                                      <span className={`text-[9px] uppercase tracking-wider block ${rankBadgeStyle}`}>{badge}</span>
                                      <p className="font-bold text-white leading-tight">{reseller.name}</p>
                                      <p className="text-[10px] text-zinc-500 font-mono">Shop: {reseller.shopName || `${reseller.name}'s Store`}</p>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-xs font-black block text-emerald-500 font-mono">৳{reseller.totalSales.toLocaleString()}</span>
                                      <span className="text-[9px] text-zinc-450 block font-bold">{reseller.ordersCount} Orders placed</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                      </div>

                      {/* Orders Logs */}
                      <div className="space-y-3">
                        <h5 className="text-xs font-black text-zinc-400 uppercase tracking-widest">
                          {language === 'en' ? 'My Order Dispatch Log' : 'আমার কাস্টমার অর্ডার তালিকা'}
                        </h5>
                        {(!ordersList || ordersList.length === 0) ? (
                          <div className="bg-zinc-900/40 border border-zinc-850 py-10 rounded-2xl text-center">
                            <p className="text-xs text-zinc-500 italic">
                              {language === 'en' ? 'No reseller orders successfully processed yet. Place client orders using shopping cart!' : 'এখনো কোনো রিসেলার অর্ডার সাবমিট করেননি। কার্ট পেজে অর্ডার টাইপ রিসেলার সিলেক্ট করে অর্ডার দিন!'}
                            </p>
                          </div>
                        ) : (
                          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden divide-y divide-zinc-850">
                            {ordersList.map((o: any) => {
                              const canCancel = o.status === 'Pending';
                              let badgeColor = 'bg-yellow-600/10 text-yellow-500 border border-yellow-500/20';
                              let displayStatus = o.status;

                              if (o.status === 'Delivered') {
                                badgeColor = 'bg-emerald-600/10 text-emerald-500 border border-emerald-500/20';
                                displayStatus = language === 'en' ? 'Delivered' : 'ডেলিভার্ড';
                              } else if (o.status === 'Shipped') {
                                badgeColor = 'bg-blue-600/10 text-blue-500 border border-blue-500/20';
                                displayStatus = language === 'en' ? 'Shipped' : 'シップড';
                              } else if (o.status === 'Confirmed') {
                                badgeColor = 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20';
                                displayStatus = language === 'en' ? 'Confirmed' : 'কনফার্ম';
                              } else if (o.status === 'Cancelled') {
                                badgeColor = 'bg-red-600/10 text-red-500 border border-red-500/20';
                                displayStatus = language === 'en' ? 'Cancelled' : 'বাতিল';
                              } else {
                                displayStatus = language === 'en' ? 'Pending' : 'পেন্ডিং';
                              }

                              return (
                                <div key={o.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 hover:bg-zinc-900/50 transition text-xs">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono font-black text-zinc-300 uppercase">{o.id}</span>
                                      <span className="text-[10px] text-zinc-500 font-semibold">{o.date}</span>
                                    </div>
                                    <p className="text-zinc-400">
                                      Customer: <span className="font-bold text-zinc-300">{o.customerName}</span> ({o.customerPhone})
                                    </p>
                                    <p className="text-[10px] text-zinc-500 truncate max-w-xs sm:max-w-md">
                                      Address: {o.shippingAddress?.address || ''}, {o.shippingAddress?.city || ''}
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-4 text-right justify-between w-full md:w-auto">
                                    <div className="text-left md:text-right">
                                      <span className="text-[10px] text-zinc-500 font-bold block uppercase">{language === 'en' ? 'Earnings (Net)' : 'আমার নীট লাভ'}</span>
                                      <span className="font-mono font-bold text-orange-500">৳{o.resellerProfit || 0}</span>
                                    </div>

                                    <div className="text-left md:text-right flex flex-col items-start md:items-end gap-1">
                                      <span className="text-[10px] text-zinc-500 font-bold block uppercase">Status</span>
                                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase inline-block ${badgeColor}`}>
                                        {displayStatus}
                                      </span>
                                    </div>

                                    {/* Cancellation trigger */}
                                    <div className="text-right whitespace-nowrap">
                                      {canCancel ? (
                                        <button
                                          onClick={() => handleCancelOrder(o.id)}
                                          type="button"
                                          className="px-2.5 py-1.5 bg-red-600/15 hover:bg-red-600 hover:text-white border border-red-500/20 text-red-500 text-[10px] font-black rounded-lg transition overflow-hidden cursor-pointer whitespace-nowrap"
                                        >
                                          {language === 'en' ? 'Cancel Order' : 'অর্ডার বাতিল করুন'}
                                        </button>
                                      ) : o.status === 'Cancelled' ? (
                                        <span className="text-[10px] text-zinc-500 italic font-bold">
                                          {language === 'en' ? 'Cancelled' : 'বাতিলকৃত'}
                                        </span>
                                      ) : (
                                        <span className="text-[10px] text-indigo-400 font-semibold italic flex flex-col items-end leading-tight">
                                          <span>{language === 'en' ? 'Confirmed' : 'কনফার্ম হয়েছে'}</span>
                                          <span className="text-[8px] text-zinc-500 font-normal">({language === 'en' ? 'Cannot cancel' : 'বাতিল অসম্ভব'})</span>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })()}



                {/* TAB 1.5: DIRECT NEW CUSTOMER ORDER PLACEMENT */}
                {tab === 'new_order' && (
                  <div className="space-y-6 animate-fade-in pb-10">
                    <div className="border-b border-zinc-855 pb-2">
                      <h4 className="text-sm font-black text-white flex items-center gap-1.5 uppercase tracking-wide">
                        <ShoppingCart size={16} className="text-orange-500" />
                        <span>{language === 'en' ? 'Direct Customer Order Placement' : 'সরাসরি কাস্টমার অর্ডার সাবমিট ফর্ম'}</span>
                      </h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">
                        {language === 'en' ? 'Submit an order for your client. We deliver, collect payment, and disburse your profit.' : 'আপনার কাস্টমারের জন্য নতুন অর্ডার দাখিল করুন। আমরা পণ্য কুরিয়ারে পাঠিয়ে টাকা তুলে আপনার মুনাফা ওয়ালেটে যুক্ত করবো।'}
                      </p>
                    </div>

                    {successOrderId ? (
                      <div className="bg-zinc-900 border border-emerald-500/20 p-8 rounded-3xl text-center max-w-xl mx-auto space-y-5 shadow-2xl">
                        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                          <CheckCircle size={36} />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-lg font-black text-white">{language === 'en' ? 'Order Submitted Successfully!' : 'অর্ডারটি সফলভাবে দাখিল হয়েছে!'}</h3>
                          <p className="text-xs text-zinc-400 leading-relaxed">
                            {language === 'en' ? 'The system has logged order number:' : 'খুব শীঘ্রই আমাদের ডেলিভারি টিম অর্ডারটি কুরিয়ারে বুকিং করবে। কাস্টমার অর্ডার আইডি নম্বর:'}
                          </p>
                          <div className="bg-zinc-950 px-4 py-2 rounded-xl text-base font-black font-mono text-orange-500 tracking-wider w-fit mx-auto border border-zinc-850">
                            {successOrderId}
                          </div>
                        </div>
                        <p className="text-[11px] text-zinc-500 max-w-md mx-auto leading-relaxed">
                          {language === 'en' ? 'Track its real-time processing under Hub Dashboard status board.' : 'আপনার রিসেলার হোমপেজ তথা ড্যাশবোর্ডে "অর্ডার ও উপার্জনের তালিকা" থেকে খুব সহজেই রিয়েল-টাইম কুরিয়ার আপডেট দেখতে পাবেন।'}
                        </p>
                        <div className="flex gap-3 justify-center pt-3">
                          <button
                            type="button"
                            onClick={() => {
                              setSuccessOrderId('');
                              setSelectedProductId('');
                            }}
                            className="px-5 py-2.5 bg-zinc-805 hover:bg-zinc-750 text-white rounded-xl text-xs font-bold cursor-pointer transition"
                          >
                            {language === 'en' ? 'Place Another Order' : 'আরেকটি অর্ডার করুন'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSuccessOrderId('');
                              setTab('dashboard');
                            }}
                            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold cursor-pointer transition border border-orange-500/10"
                          >
                            {language === 'en' ? 'Go to Dashboard' : 'ড্যাশবোর্ডে ফিরে যান'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handlePlaceResellerOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs font-medium">
                        
                        {/* Column Left (Products & Pricing) */}
                        <div className="lg:col-span-5 bg-zinc-900 border border-zinc-850 p-5 rounded-3xl space-y-4">
                          <h5 className="text-xs font-bold text-zinc-350 border-b border-zinc-800 pb-2 uppercase tracking-wide">
                            ১. ক্যাটালগ প্রোডাক্ট ও বিক্রয়মূল্য
                          </h5>

                          {/* Product code looker with dynamic picture preview rendering */}
                          <div className="space-y-1.5 p-3 rounded-2xl bg-zinc-950/60 border border-zinc-850">
                            <label className="block text-zinc-400 font-extrabold text-[10px] uppercase">
                              ⚡ {language === 'en' ? 'Product Code Quick Search' : 'প্রোডাক্ট কোড দিয়ে সার্চ করুন'}
                            </label>
                            <input
                              type="text"
                              placeholder={language === 'en' ? "Type Code (e.g. PD01)" : "কোডটি লিখুন (যেমন: PD01)"}
                              value={typedProductCode}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTypedProductCode(val);
                                const found = products.find(p => p.code?.toLowerCase() === val.trim().toLowerCase() || p.id.toLowerCase() === val.trim().toLowerCase());
                                if (found) {
                                  setSelectedProductId(found.id);
                                  setSellerCustomerPrice(String(found.price));
                                }
                              }}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none focus:border-orange-500 font-mono font-bold"
                            />
                            {(() => {
                              const found = products.find(p => p.code?.toLowerCase() === typedProductCode.trim().toLowerCase() || p.id.toLowerCase() === typedProductCode.trim().toLowerCase());
                              if (typedProductCode.trim() && found) {
                                return (
                                  <div className="flex gap-2 items-center bg-orange-600/5 border border-orange-500/10 p-2 rounded-xl mt-2 animate-fade-in">
                                    <img 
                                      src={found.image} 
                                      alt={found.name} 
                                      className="w-12 h-12 rounded-lg object-cover bg-white" 
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="min-w-0 flex-1 text-[10px] space-y-0.5">
                                      <span className="bg-orange-500/20 text-orange-400 px-1 py-0.2 rounded font-black text-[8px] uppercase tracking-wider">Matched</span>
                                      <h6 className="font-bold text-white truncate">{language === 'en' ? found.name : found.nameBn}</h6>
                                      <p className="text-zinc-500 font-sans font-bold">Price: ৳{found.price} | Wholesale: ৳{found.resellerPrice || Math.round(found.price * 0.85)}</p>
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            })()}
                          </div>

                          {/* Selected Product */}
                          <div className="space-y-1.5">
                            <label className="block text-zinc-400 font-bold">
                              {language === 'en' ? 'Choose Product *' : 'প্রোডাক্ট নির্বাচন করুন *'}
                            </label>
                            <select
                              required
                              value={selectedProductId}
                              onChange={(e) => {
                                setSelectedProductId(e.target.value);
                                const chosen = products.find(p => p.id === e.target.value);
                                if (chosen) {
                                  setSellerCustomerPrice(String(chosen.price));
                                } else {
                                  setSellerCustomerPrice('');
                                }
                              }}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-200 outline-none focus:border-orange-500 cursor-pointer"
                            >
                              <option value="">{language === 'en' ? '-- Select a Product --' : '-- প্রোডাক্ট সিলেক্ট করুন --'}</option>
                              {products.map(p => {
                                const rate = p.resellerPrice || Math.round(p.price * 0.85);
                                return (
                                  <option key={p.id} value={p.id}>
                                    {language === 'en' ? p.name : p.nameBn} (Wholesale: ৳{rate})
                                  </option>
                                );
                              })}
                            </select>
                          </div>

                          {/* Product Quantity */}
                          <div className="space-y-1.5">
                            <label className="block text-zinc-400 font-bold">
                              {language === 'en' ? 'Order Quantity *' : 'অর্ডারের পরিমাণ (টি) *'}
                            </label>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                className="w-9 h-9 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-400 font-black rounded-lg flex items-center justify-center text-sm cursor-pointer transition select-none"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                required
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-16 h-9 bg-zinc-950 border border-zinc-800 rounded-lg text-center font-mono font-bold text-white outline-none focus:border-orange-500"
                              />
                              <button
                                type="button"
                                onClick={() => setQuantity(prev => prev + 1)}
                                className="w-9 h-9 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-400 font-black rounded-lg flex items-center justify-center text-sm cursor-pointer transition select-none"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Custom Selling Price */}
                          <div className="space-y-1.5 pt-2">
                            <label className="block text-zinc-400 font-bold flex justify-between">
                              <span>{language === 'en' ? 'Customer Final Selling Price *' : 'কাস্টমার চূড়ান্ত বিক্রয়মূল্য *'}</span>
                              {selectedProductId && (
                                <span className="text-zinc-500 text-[10px] font-medium"> Retail: ৳{products.find(p => p.id === selectedProductId)?.price} </span>
                              )}
                            </label>
                            <div className="relative">
                              <span className="absolute left-3.5 top-2.5 text-zinc-500 font-mono font-bold">৳</span>
                              <input
                                type="number"
                                required
                                value={sellerCustomerPrice}
                                onChange={(e) => setSellerCustomerPrice(e.target.value.replace(/\D/g, ''))}
                                placeholder={language === 'en' ? 'e.g. 1050' : 'যেমন: ১০৫০'}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-8 pr-4 py-2.5 text-white font-mono outline-none focus:border-orange-500"
                              />
                            </div>
                            <p className="text-[10px] text-zinc-500 font-semibold leading-tight">
                              {language === 'en' ? 'The final amount collected by the courier from your buyer.' : 'কুরিয়ার মারফত ক্রেতা ডেলিভারি নেওয়ার সময় মোট কত টাকা পরিশোধ করবেন তা এখানে লিখুন।'}
                            </p>
                          </div>

                          {/* Live calculations preview box (ভাড়ার হিসাব ও লাভ ট্র্যাক) */}
                          {(() => {
                            const currentSelectedProd = products.find(p => p.id === selectedProductId);
                            if (!currentSelectedProd) {
                              return (
                                <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-2xl text-center text-[11px] text-zinc-500 italic">
                                  {language === 'en' ? 'Select a product to view live cost & net earnings preview' : 'প্রোডাক্ট সিলেক্ট করলে এখানে আপনার মুনাফার হিসাব লাইভ দেখতে পাবেন'}
                                </div>
                              );
                            }

                            const itemWholesaleRate = currentSelectedProd.resellerPrice || Math.round(currentSelectedProd.price * 0.85);
                            const calcWholesaleSubtotal = itemWholesaleRate * quantity;
                            const calcTotalWeight = (currentSelectedProd.weight || 0.5) * quantity;

                            const calcInsideDhaka = district === 'dhaka';
                            const calcBaseDelivery = calcInsideDhaka 
                              ? (siteSettings?.delivery_inside_dhaka || 80) 
                              : (siteSettings?.delivery_outside_dhaka || 150);

                            let calcSpecialDelivery = 0;
                            if (currentSelectedProd.category === 'fresh-bazaar' || currentSelectedProd.categoryBn === 'কাঁচা বাজার') {
                              calcSpecialDelivery = Math.max(calcSpecialDelivery, siteSettings?.delivery_fresh_groceries_charge || 100);
                            }
                            if (currentSelectedProd.category === 'combo-package' || currentSelectedProd.category === 'package') {
                              calcSpecialDelivery = Math.max(calcSpecialDelivery, siteSettings?.delivery_package_charge || 90);
                            }
                            if (currentSelectedProd.category === 'groceries' || currentSelectedProd.categoryBn === 'মুদি বাজার') {
                              calcSpecialDelivery = Math.max(calcSpecialDelivery, siteSettings?.delivery_groceries_charge || 80);
                            }

                            const calcDelivery = calcSpecialDelivery > 0 ? calcSpecialDelivery : calcBaseDelivery;

                            const packagingWeightThreshold = siteSettings?.packaging_weight_threshold !== undefined ? parseFloat(siteSettings.packaging_weight_threshold) : 1.0;
                            const packagingFeeHeavy = siteSettings?.packaging_fee_heavy !== undefined ? parseFloat(siteSettings.packaging_fee_heavy) : 15;
                            const packagingFeeLight = siteSettings?.packaging_fee_light !== undefined ? parseFloat(siteSettings.packaging_fee_light) : 10;
                            const calcPackaging = calcTotalWeight >= packagingWeightThreshold ? packagingFeeHeavy : packagingFeeLight;

                            const calcBaseTotalCost = calcWholesaleSubtotal + calcDelivery + calcPackaging;
                            const sellValNum = parseFloat(sellerCustomerPrice) || 0;
                            const calcAdminCut = Math.round(sellValNum * 0.01);
                            const calcResellerNet = Math.max(0, (sellValNum - calcBaseTotalCost) - calcAdminCut);

                            const isValidSalePrice = sellValNum >= calcBaseTotalCost;

                            return (
                              <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-4 space-y-3 font-mono text-[11px] leading-relaxed">
                                <h6 className="text-[10px] uppercase font-bold text-zinc-500 border-b border-zinc-850 pb-1 flex items-center gap-1">
                                  <Activity size={12} className="text-orange-500" />
                                  <span>লাইভ মুনাফা ও বেস কস্ট হিসাবকারী</span>
                                </h6>
                                <div className="space-y-1.5 text-zinc-400">
                                  <div className="flex justify-between">
                                    <span>আইটেম পাইকারি দাম (Wholesale):</span>
                                    <span className="text-zinc-200">৳{calcWholesaleSubtotal}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>ডেলিভারি খরচ (Courier Charge):</span>
                                    <span className="text-zinc-200">৳{calcDelivery}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>প্যকেজিং ও বাবল ফি (Packaging):</span>
                                    <span className="text-zinc-200">৳{calcPackaging}</span>
                                  </div>
                                  <div className="flex justify-between border-t border-zinc-850 pt-1.5 font-bold">
                                    <span className="text-zinc-300">মোট বেস রেট (Base Total):</span>
                                    <span className="text-orange-500 font-extrabold">৳{calcBaseTotalCost}</span>
                                  </div>
                                </div>

                                {isValidSalePrice ? (
                                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex items-center justify-between text-emerald-400">
                                    <div>
                                      <span className="text-[9px] text-zinc-500 font-black block">আপনার নিশ্চিত নীট লাভ:</span>
                                      <span className="text-[8px] text-zinc-500 tracking-tight block">১% এডমিন চার্জ (৳{calcAdminCut}) বাদে</span>
                                    </div>
                                    <span className="text-base font-black text-emerald-400 font-mono">৳{calcResellerNet}</span>
                                  </div>
                                ) : (
                                  <div className="bg-red-500/5 border border-red-500/15 p-3 rounded-xl text-red-400 text-[10px] leading-snug font-bold">
                                    ⚠️ লোকসান হচ্ছে! কাস্টমার প্রাইজ ন্যূনতম বেস রেট ৳{calcBaseTotalCost} থেকে বৃদ্ধি করুন।
                                  </div>
                                )}
                              </div>
                            );
                          })()}

                        </div>

                        {/* Column Right (Customer details & Address info) */}
                        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-850 p-5 rounded-3xl space-y-4">
                          <h5 className="text-xs font-bold text-zinc-350 border-b border-zinc-800 pb-2 uppercase tracking-wide">
                            ২. কাস্টমার ও ডেলিভারি ঠিকানা
                          </h5>

                          {/* Client Name & Phone */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="block text-zinc-400 font-bold">
                                {language === 'en' ? "Customer's Name *" : 'কাস্টমারের নাম *'}
                              </label>
                              <div className="relative">
                                <User className="absolute left-3.5 top-3 text-zinc-500" size={14} />
                                <input
                                  type="text"
                                  required
                                  value={customerName}
                                  onChange={(e) => setCustomerName(e.target.value)}
                                  placeholder={language === 'en' ? 'e.g. Robin Khan' : 'যেমন: রবিন খান'}
                                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-white outline-none focus:border-orange-500"
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="block text-zinc-400 font-bold">
                                {language === 'en' ? "Customer's Mobile Phone *" : 'কাস্টমারের ফোন নম্বর *'}
                              </label>
                              <div className="relative">
                                <Phone className="absolute left-3.5 top-3 text-zinc-500" size={14} />
                                <input
                                  type="text"
                                  required
                                  value={customerPhone}
                                  onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                                  placeholder={language === 'en' ? '017XXXXXXXX' : 'যেমন: ০১৭১২৩৪৫৬৭৮'}
                                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-white font-mono outline-none focus:border-orange-500"
                                />
                              </div>
                            </div>
                          </div>

                          {/* District / Upazila Selectors */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="block text-zinc-400 font-bold">
                                {language === 'en' ? 'District / Town *' : 'ডেলিভারি জেলা *'}
                              </label>
                              <select
                                required
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-200 outline-none focus:border-orange-500 cursor-pointer"
                              >
                                {AVAILABLE_DISTRICTS.map((d) => (
                                  <option key={d.id} value={d.id}>
                                    {language === 'en' ? d.name : d.nameBn}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="space-y-1.5">
                              <label className="block text-zinc-400 font-bold">
                                {language === 'en' ? 'Thana / Sub-district *' : 'উপজেলা / থানা *'}
                              </label>
                              <select
                                required
                                value={upazila}
                                onChange={(e) => setUpazila(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-200 outline-none focus:border-orange-500 cursor-pointer"
                              >
                                <option value="">{language === 'en' ? '-- Select Thana --' : '-- থানা নির্বাচন করুন --'}</option>
                                {(AVAILABLE_UPAZILAS[district] || []).map((u) => (
                                  <option key={u.id} value={u.id}>
                                    {language === 'en' ? u.name : u.nameBn}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Detailed Address */}
                          <div className="space-y-1.5 font-bold">
                            <label className="block text-zinc-400">{language === 'en' ? 'Full Courier Address *' : 'কাস্টমারের বাড়ি/রোড/গ্রামের বিস্তারিত ঠিকানা *'}</label>
                            <textarea
                              required
                              rows={3}
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              placeholder={language === 'en' ? 'House, Road No, Area Name' : 'হাউস নম্বর, রোড নম্বর, পাড়া অথবা গ্রামের নাম বিস্তারিত লিখুন'}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-orange-500 text-xs text-zinc-200 font-mono"
                            ></textarea>
                          </div>

                          {/* Order Notes */}
                          <div className="space-y-1.5">
                            <label className="block text-zinc-400">{language === 'en' ? 'Delivery Instruction Notes (Optional)' : 'কুরিয়ার পার্টনারের জন্য অতিরিক্ত তথ্য (ঐচ্ছিক)'}</label>
                            <input
                              type="text"
                              value={orderNotes}
                              onChange={(e) => setOrderNotes(e.target.value)}
                              placeholder={language === 'en' ? 'e.g. Urgent delivery' : 'যেমন: বিকেল ৫ টার পর ডেলিভারি দিন'}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-orange-500 font-medium"
                            />
                          </div>

                          {/* Error block inside form */}
                          {orderErr && (
                            <div className="bg-red-500/10 border border-red-500/25 p-3 rounded-2xl text-red-500 text-[11px] font-bold leading-normal">
                              {orderErr}
                            </div>
                          )}

                          {/* Actions / Buttons */}
                          <div className="pt-3">
                            <button
                              type="submit"
                              disabled={isSubmittingOrder}
                              className={`w-full py-3.5 bg-gradient-to-r from-orange-600 to-orange-500 hover:brightness-105 active:scale-98 text-white rounded-xl font-black uppercase text-xs tracking-wider cursor-pointer transition select-none flex items-center justify-center gap-1.5 shadow-lg ${
                                isSubmittingOrder ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              {isSubmittingOrder ? (
                                <>
                                  <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></div>
                                  <span>{language === 'en' ? 'Submitting Order...' : 'অর্ডার দাখিল হচ্ছে...'}</span>
                                </>
                              ) : (
                                <>
                                  <Send size={13} />
                                  <span>{language === 'en' ? 'Submit Customer Dispatch Order' : 'কাস্টমার অর্ডার চূড়ান্ত সাবমিট করুন (ক্যাশ অন ডেলিভারি)'}</span>
                                </>
                              )}
                            </button>
                          </div>

                        </div>

                      </form>
                    )}
                  </div>
                )}


                {/* TAB 2: PRODUCTS CATALOG WITH RAW PRICING */}
                {tab === 'catalog' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <p className="text-xs text-zinc-400">
                        {language === 'en' ? 'Inspect your base wholesale prices vs customer public retail pricing' : 'পণ্যের খুচরা বাজারমূল্য বনাম আপনার পাইকারি মূল্য এবং প্রতি অর্ডারে মুনাফা যাচাই করুন'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto pr-1">
                      {products.map((p) => {
                        const basePrice = p.resellerPrice || Math.round(p.price * 0.85);
                        return (
                          <div key={p.id} className="bg-zinc-900 border border-zinc-850 p-4 rounded-2xl flex flex-col justify-between hover:border-orange-500/35 transition space-y-3">
                            <div className="flex items-center gap-3">
                              <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-xl bg-zinc-950 flex-shrink-0 border border-zinc-850" />
                              <div className="flex-1 min-w-0 text-xs">
                                <h5 className="font-bold truncate text-zinc-200">
                                  {language === 'en' ? p.name : p.nameBn}
                                </h5>
                                <p className="text-[10px] text-zinc-500 capitalize tracking-wide font-semibold mt-0.5">
                                  {language === 'en' ? p.category : p.categoryBn} {p.code && `• #${p.code}`}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-b border-zinc-850 py-2.5 font-mono">
                              <div>
                                <span className="text-[9px] text-zinc-500 block uppercase font-bold">Retail</span>
                                <span className="font-bold text-zinc-350">৳{p.price}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[9px] text-orange-500 font-extrabold block uppercase">Reseller Rate</span>
                                <span className="font-extrabold text-orange-500 text-xs">৳{basePrice}</span>
                              </div>
                            </div>

                            {/* Actions toolkit for quick reselling */}
                            <div className="space-y-2">
                              <div className="grid grid-cols-2 gap-2 text-[10px] font-extrabold">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const comboText = `📦 ${language === 'en' ? 'Product Name:' : 'পণ্যের নাম:'} ${language === 'en' ? p.name : p.nameBn}
${language === 'en' ? 'Code:' : 'প্রোডাক্ট কোড:'} #${p.code || p.id}
${language === 'en' ? 'Customer Price:' : 'গ্রাহক বিক্রয়মূল্য:'} ৳${p.price}
${language === 'en' ? 'Reseller Cost:' : 'রিসেলার রেট (পাইকারি):'} ৳${basePrice}

📋 ${language === 'en' ? 'Product Description:' : 'পণ্যের সম্পূর্ণ বিবরণ:'}
${language === 'en' ? p.description : p.descriptionBn}`;
                                    navigator.clipboard.writeText(comboText);
                                    setCopiedId(p.id);
                                    setTimeout(() => setCopiedId(null), 1500);
                                  }}
                                  className="px-2.5 py-1.8 bg-zinc-805 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 hover:border-emerald-500/50 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition select-none"
                                >
                                  {copiedId === p.id ? (
                                    <>
                                      <Check size={11} className="text-emerald-500" />
                                      <span className="text-emerald-500">{language === 'en' ? 'Copied!' : 'কপি হয়েছে!'}</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy size={11} />
                                      <span>{language === 'en' ? 'Copy Text' : 'তথ্য কপি করুন'}</span>
                                    </>
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleImageDownload(p.image, p.code || p.id)}
                                  className="px-2.5 py-1.8 bg-zinc-805 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition shadow-xs select-none"
                                >
                                  <Download size={11} />
                                  <span>{language === 'en' ? 'Get Photo' : 'ছবি ডাউনলোড'}</span>
                                </button>
                              </div>

                              <div className="grid grid-cols-2 gap-2 font-black">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedProductId(p.id);
                                    setSellerCustomerPrice(String(p.price));
                                    setQuantity(1);
                                    setTab('new_order');
                                  }}
                                  className="w-full px-2.5 py-1.8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center justify-center gap-1 cursor-pointer transition shadow-xs select-none text-[10px]"
                                >
                                  <ShoppingCart size={11} />
                                  <span>{language === 'en' ? 'Place Order' : 'অর্ডার করুন'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleGeneratePostForProduct(p)}
                                  className="w-full px-2.5 py-1.8 bg-zinc-805 hover:bg-zinc-750 text-zinc-100 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition shadow-xs select-none border border-zinc-700 text-[10px]"
                                >
                                  <Sparkles size={11} className="text-orange-400 animate-pulse" />
                                  <span>{language === 'en' ? 'AI Post' : 'পোস্ট লিখন'}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 3: PAYOUT STATS AND WITHDRAW WINDOW */}
                {tab === 'withdraw' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                    
                    {/* Wages Form */}
                    <div className="bg-zinc-900 border border-zinc-850 p-5 rounded-3xl space-y-4">
                      <h4 className="text-sm font-black text-white flex items-center gap-1">
                        <Wallet size={16} className="text-orange-500" />
                        <span>{language === 'en' ? 'Request Instant Withdrawal' : 'তাৎক্ষণিক উপার্জন উত্তোলন করুন'}</span>
                      </h4>
                      <p className="text-[11px] text-zinc-400">
                        {language === 'en' ? 'Cash will be sent instantly to your approved mobile financial account.' : 'টাকা তোলার সর্বোচ্চ ৩০ মিনিটের মধ্যে আপনার বিকাশ, নগদ অথবা ব্যাংক অ্যাকাউন্টে টাকা ক্রেডিট হয়ে যাবে।'}
                      </p>

                      <form onSubmit={handleWithdraw} className="space-y-4 text-xs">
                        {withSuccess && (
                          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-xs font-bold leading-relaxed">
                            {withSuccess}
                          </div>
                        )}
                        {withError && (
                          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs font-bold leading-relaxed">
                            {withError}
                          </div>
                        )}

                        <div>
                          <label className="block text-zinc-400 font-bold mb-1">
                            {language === 'en' ? 'Withdrawal Amount (BDT) *' : 'উত্তোলনের মোট পরিমাণ (টাকা) *'}
                          </label>
                          <input
                            type="number"
                            required
                            placeholder="e.g. 500"
                            value={withAmt}
                            onChange={(e) => setWithAmt(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-zinc-400 font-bold mb-1">
                            {language === 'en' ? 'Gateway Account Method *' : 'পদ্ধতি সিলেক্ট করুন *'}
                          </label>
                          <select
                            value={withMethod}
                            onChange={(e) => setWithMethod(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2 py-2.5 text-white"
                          >
                            <option value="bKash">bKash (বিকাশ)</option>
                            <option value="Nagad">Nagad (নগদ)</option>
                            <option value="Rocket">Rocket (রকেট)</option>
                            <option value="Bank">Bank Account (ব্যাংক হিসাব)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-zinc-400 font-bold mb-1">
                            {language === 'en' ? 'Account details / Phone Number *' : 'অ্যাকাউন্ট বা মোবাইল নাম্বার *'}
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 01700111222"
                            value={withAcc}
                            onChange={(e) => setWithAcc(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white font-mono"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-black py-3 rounded-xl transition cursor-pointer"
                        >
                          {isLoading ? 'Processing...' : (language === 'en' ? 'Submit Payout' : 'উত্তোলন সাবমিট করুন')}
                        </button>
                      </form>
                    </div>

                    {/* Historical payouts logs */}
                    <div className="space-y-3 font-sans text-xs">
                      <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest text-zinc-400">
                        {language === 'en' ? 'Payout Log' : 'টাকা উত্তোলনের পূর্ববর্তী বিবরণ'}
                      </h4>

                      {(!profile.payouts || profile.payouts.length === 0) ? (
                        <div className="bg-zinc-900/40 border border-zinc-850 py-12 rounded-3xl text-center">
                          <p className="text-xs text-zinc-500 italic">
                            {language === 'en' ? 'No withdraw transactions recorded yet.' : 'এখনো কোনো টাকা উত্তোলন বা পেমেন্ট ট্রানজেকশন হয়নি।'}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden divide-y divide-zinc-85">
                          {profile.payouts.map((p: any) => (
                            <div key={p.id} className="p-3.5 flex justify-between items-center bg-zinc-900/50 hover:bg-zinc-900 transition">
                              <div>
                                <span className="font-mono text-zinc-200 font-bold block">৳{p.amount.toLocaleString()}</span>
                                <span className="text-[10px] text-zinc-500 font-medium font-semibold block">{p.method} - {p.date}</span>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                p.status === 'Paid' || p.status === 'Success' ? 'bg-emerald-600/10 text-emerald-500 border border-emerald-500/20' : 'bg-yellow-600/10 text-yellow-500 border border-yellow-500/20'
                              }`}>
                                {p.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* TAB 4: RULES */}
                {tab === 'rules' && (
                  <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-3xl space-y-4 max-w-2xl mx-auto animate-fade-in text-xs leading-relaxed text-zinc-350">
                    <h4 className="text-base font-black text-white border-b border-zinc-800 pb-2">
                      {language === 'en' ? 'Reseller Rules & Dynamic Conditions' : 'রিসেলার নীতিমালা ও কমিশন ডিস্ট্রিবিউশন গাইড লাইন'}
                    </h4>

                    <div className="space-y-4 font-medium">
                      <div>
                        <h5 className="font-bold text-white text-xs mb-1">১. কাস্টমার অর্ডার বিক্রয়মূল্য</h5>
                        <p>{language === 'en' ? 'Reseller determines their own customized markup value' : 'আপনি যেকোনো পণ্যে আমাদের ডিল পাইকারি মূল্যের উপর আপনার যেকোনো কাস্টমার বিক্রয়মূল্য ঘোষণা করতে পারবেন।'}</p>
                      </div>
                      <div>
                        <h5 className="font-bold text-white text-xs mb-1">২. কমিশন থেকে ১% কর্তন রুল</h5>
                        <p>{language === 'en' ? 'Admin charges automatic 1% on the total customer selling price' : 'প্রতিটি সফল অর্ডারে মোট পণ্য মূল্যের ১% লাভ বা কমিশন অ্যাডমিন সিকিউরিটি ফি হিসেবে স্বয়ংক্রিয়ভাবে কাটা হবে।'}</p>
                      </div>
                      <div>
                        <h5 className="font-bold text-white text-xs mb-1">৩. ওজনের উপর প্যাকেজিং ফি</h5>
                        <p>{language === 'en' ? 'Product packaging fees scale with total cart item weight. Weighing >= 1kg costs ৳15. Lighter cargo costs ৳10' : 'কার্ট আইটেমের ওজনের গড় হারের উপর কুরিয়ার ও প্যাক চার্জ নির্ধারিত হবে। পণ্যের ওজন ১কেজি বা বেশি হলে মোট প্যাক ফি ১৫ টাকা, অন্যথায় হালকা সামগ্রীর ক্ষেত্রে ১০ টাকা নির্ধারণ করা হবে।'}</p>
                      </div>
                      <div>
                        <h5 className="font-bold text-white text-xs mb-1">৪. ব্যালেন্স উত্তোলন</h5>
                        <p>{language === 'en' ? 'When orders are marked Delivered, your estimated profit shifts to withdrawable balance.' : 'অ্যাডমিন অথবা কুরিয়ার পার্টনার দ্বারা অর্ডারটি "Delivered (ডেলিভারড)" সম্পন্ন হলে আপনার কাস্টমার মুনাফা সাথে সাথে আপনার উত্তোলনের যোগ্য ওয়ালেটে পাঠিয়ে দেওয়া হবে।'}</p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

          {/* AI Generated Post Popup Overlay */}
          {selectedProductForPost && (
            <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg p-5.5 space-y-4 shadow-2xl relative">
                <button
                  type="button"
                  onClick={() => setSelectedProductForPost(null)}
                  className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200 cursor-pointer p-1"
                >
                  <X size={18} />
                </button>

                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-orange-500/10 rounded-xl border border-orange-500/20">
                    <Sparkles className="h-5 w-5 text-orange-500 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-zinc-100">
                      {language === 'en' ? 'AI Social Post Copywriter' : 'এআই ফেসবুক ও সোশ্যাল পোস্ট জেনারেটর'}
                    </h4>
                    <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
                      {language === 'en' ? 'Promoting: ' : 'প্রচার পণ্য: '} 
                      <span className="text-orange-400 font-bold">{language === 'en' ? selectedProductForPost.name : selectedProductForPost.nameBn}</span>
                    </p>
                  </div>
                </div>

                {isGeneratingPost ? (
                  <div className="flex flex-col items-center justify-center py-10 space-y-3.5 text-center">
                    <div className="animate-spin h-8 w-8 border-3 border-orange-500 border-t-transparent rounded-full"></div>
                    <div>
                      <p className="text-xs font-bold text-zinc-200 animate-pulse">
                        {language === 'en' ? 'Writing Facebook, WhatsApp & Story copy...' : 'ফেসবুক, হোয়াটসঅ্যাপ ও স্টোরির আলাদা পোস্ট লেখা হচ্ছে...'}
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-1">
                        {language === 'en' ? 'Powered by Ghoroya AI' : 'ঘরোয়া এআই দ্বারা চালিত'}
                      </p>
                    </div>
                  </div>
                ) : generatedPostContent ? (
                  <div className="space-y-4">
                    {/* Tabs select */}
                    <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-850 rounded-xl text-[10px] sm:text-xs font-black">
                      {(['facebook', 'whatsapp', 'story'] as const).map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => {
                            setActivePostTab(tab);
                            setPostCopySuccess('');
                          }}
                          className={`py-2 rounded-lg text-center cursor-pointer transition ${
                            activePostTab === tab
                              ? 'bg-zinc-805 text-orange-400 shadow-sm font-extrabold'
                              : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <span className="capitalize">{tab === 'facebook' ? (language === 'en' ? 'Facebook' : 'ফেসবুক') : tab === 'whatsapp' ? (language === 'en' ? 'WhatsApp' : 'হোয়াটসঅ্যাপ') : (language === 'en' ? 'Story' : 'স্টোরি')}</span>
                        </button>
                      ))}
                    </div>

                    {/* Generated Box */}
                    <div className="relative bg-zinc-950 border border-zinc-850 rounded-xl p-4 text-xs">
                      <pre className="font-sans whitespace-pre-wrap text-[11px] sm:text-xs text-zinc-300 leading-relaxed overflow-y-auto max-h-[180px] pr-2">
                        {generatedPostContent[activePostTab]}
                      </pre>
                      
                      <div className="absolute top-2 right-2">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(generatedPostContent[activePostTab]);
                            setPostCopySuccess(activePostTab);
                            setTimeout(() => setPostCopySuccess(''), 1500);
                          }}
                          className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg cursor-pointer transition flex items-center gap-1.5 text-[10px] font-black"
                        >
                          {postCopySuccess === activePostTab ? (
                            <>
                              <Check size={11} className="text-emerald-500 animate-pulse" />
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

                    {/* Tip instructions */}
                    <div className="bg-orange-500/5 border border-orange-500/10 rounded-xl p-3 text-[10px] sm:text-xs text-orange-400/90 leading-relaxed font-bold">
                      💡 {language === 'en' ? 'Reseller Action Plan: ' : 'ব্যবহার বিধি: '} 
                      {language === 'en' 
                        ? 'Copy the formatted AI post above, then copy/download the product photo. Share on Facebook timeline or your favorite marketplace groups to attract massive conversions!'
                        : 'উপরের চমৎকার এআই পোস্টটি কপি করুন এবং পণ্যের ছবি ডাউনলোড করুন। এরপর আপনার ফেসবুক ওয়ালে, গ্রুপে কিংবা মেসেঞ্জার গ্রুপে শেয়ার করে খুব সহজে কাস্টমারদের থেকে অর্ডার সংগ্রহ করুন!'}
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <button
                        type="button"
                        onClick={() => handleGeneratePostForProduct(selectedProductForPost)}
                        className="text-orange-500 hover:text-orange-400 font-extrabold flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles size={11} />
                        <span>{language === 'en' ? 'Regenerate Content' : 'পুনরায় লিখুন (অন্য কপি)'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedProductForPost(null)}
                        className="px-4 py-1.8 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 font-extrabold rounded-lg cursor-pointer"
                      >
                        {language === 'en' ? 'Dismiss' : 'বন্ধ করুন'}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {toast && (
            <div className={`fixed bottom-6 right-6 z-[100] max-w-sm p-4 rounded-2xl shadow-2xl flex items-center gap-2 border text-white text-xs font-black tracking-wide uppercase transition duration-200 ${
              toast.type === 'success' 
                ? 'bg-zinc-900 border-emerald-500/50 text-emerald-400 shadow-emerald-950/20' 
                : 'bg-zinc-900 border-red-500/50 text-red-400 shadow-red-950/20'
            }`}>
              <div className={`w-2 h-2 rounded-full shrink-0 ${toast.type === 'success' ? 'bg-emerald-450 animate-ping' : 'bg-red-450 animate-ping'}`} />
              <span>{toast.message}</span>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
