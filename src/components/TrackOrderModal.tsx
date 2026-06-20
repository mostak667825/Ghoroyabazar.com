import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Search, Package, MapPin, Truck, Calendar, CheckCircle, AlertCircle, 
  Loader2, CreditCard, ChevronRight, Hash, Phone, Clock, BarChart3, 
  TrendingUp, Check, AlertTriangle, ArrowUpRight, Award, ShieldAlert
} from 'lucide-react';
import { Order } from '../types';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'bn';
}

interface CourierStat {
  courier: string;
  takenOrders: number;
  takenItems: number;
  cancelledOrders: number;
  cancelledItems: number;
}

interface SellerStatsResult {
  phone: string;
  totalOrders: number;
  stats: CourierStat[];
}

export default function TrackOrderModal({ isOpen, onClose, language }: TrackOrderModalProps) {
  const [activeTab, setActiveTab] = useState<'track' | 'sellerStats'>('track');
  
  // Tab 1 States (Single Order Track)
  const [orderIdInput, setOrderIdInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Tab 2 States (Seller Courier Stats & Fraud Checker)
  const [sellerPhoneInput, setSellerPhoneInput] = useState('');
  const [statsLoading, setStatsLoading] = useState(false);
  const [sellerStatsData, setSellerStatsData] = useState<SellerStatsResult | null>(null);
  const [statsErrorMsg, setStatsErrorMsg] = useState<string | null>(null);

  // Buyer Reports Lists
  const [buyerReports, setBuyerReports] = useState<any[]>([]);
  const [isAddingReport, setIsAddingReport] = useState(false);
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [newReportComment, setNewReportComment] = useState('');
  const [newReportCourier, setNewReportCourier] = useState('SteadFast');
  const [newReportReporter, setNewReportReporter] = useState('');
  const [newReportStore, setNewReportStore] = useState('');

  if (!isOpen) return null;

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderIdInput.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setOrderData(null);

    try {
      const res = await fetch(`/api/orders/${orderIdInput.trim()}`);
      if (res.ok) {
        const data = await res.json();
        setOrderData(data);
      } else {
        setErrorMsg(
          language === 'en'
            ? 'We could not find any order matching this ID. Please make sure the ID is correct.'
            : 'এই অর্ডার আইডির কোনো তথ্য পাওয়া যায়নি। অনুগ্রহ করে সঠিক আইডিটি পুনরায় লিখে চেষ্টা করুন।'
        );
      }
    } catch (err) {
      setErrorMsg(
        language === 'en'
          ? 'Network problem. Could not connect to order backend.'
          : 'কিছু ভুল হয়েছে। আমাদের সার্ভারে সংযোগ করতে সমস্যা হচ্ছে।'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFetchSellerStats = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneNum = sellerPhoneInput.trim();
    if (!phoneNum) return;

    setStatsLoading(true);
    setStatsErrorMsg(null);
    setSellerStatsData(null);
    setBuyerReports([]);

    try {
      // 1. Fetch courier stats
      const res = await fetch(`/api/sellers/courier-stats/${phoneNum}`);
      if (res.ok) {
        const data = await res.json();
        setSellerStatsData(data);
      } else {
        setStatsErrorMsg(
          language === 'en'
            ? 'Fail to compile statistics for this number.'
            : 'এই নম্বরের কুরিয়ার রিপোর্ট ও ডাটা প্রসেস করতে ব্যর্থ হয়েছে।'
        );
      }

      // 2. Fetch reports
      const resRep = await fetch(`/api/sellers/buyer-reports/${phoneNum}`);
      if (resRep.ok) {
        const reportsData = await resRep.json();
        setBuyerReports(reportsData);
      }
    } catch (err) {
      setStatsErrorMsg(
        language === 'en'
          ? 'Failed connecting to database. Verify connection parameters.'
          : 'ডেটাবেস লোড করতে সমস্যা হচ্ছে। অনুগ্রহ করে আপনার নেটওয়ার্ক পুনরায় চেক করুন।'
      );
    } finally {
      setStatsLoading(false);
    }
  };

  const handleAddNewReport = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneNum = sellerPhoneInput.trim();
    if (!phoneNum || !newReportComment.trim()) return;

    setReportSubmitting(true);
    try {
      const res = await fetch('/api/sellers/buyer-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneNum,
          reporterName: newReportReporter.trim() || 'উৎসর্গীকৃত মার্চেন্ট',
          reporterStore: newReportStore.trim() || 'ঘরোয়া স্টোর ওনার',
          courierName: newReportCourier,
          comment: newReportComment.trim()
        })
      });

      if (res.ok) {
        const result = await res.json();
        // Append newly created report to current listing
        setBuyerReports(prev => [result.report, ...prev]);
        setNewReportComment('');
        setIsAddingReport(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReportSubmitting(false);
    }
  };

  const getEstimatedDate = (orderDateStr: string) => {
    try {
      const date = new Date(orderDateStr);
      date.setDate(date.getDate() + 3);
      return date.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return language === 'en' ? 'Within 3 days' : '৩ দিনের মধ্যে';
    }
  };

  const getTimelineSteps = (status: string, courierName?: string) => {
    const courierLabel = courierName || (language === 'en' ? 'authorized partner' : 'নির্ধারিত কুরিয়ার');
    const steps = [
      { id: 'placed', label: 'Order Placed', labelBn: 'অর্ডার সফল হয়েছে', desc: 'Received at processing center', descBn: 'অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে' },
      { id: 'approved', label: 'Confirmed', labelBn: 'অর্ডার নিশ্চিত', desc: 'Verified and quality scrutinized', descBn: 'অর্ডারটি যাচাই করে বুকিং কনফার্ম করা হয়েছে' },
      { id: 'packaging', label: 'Packaging', labelBn: 'প্যাকেজিং ও র‍্যাপিং', desc: 'Fragile label & security wrap applied', descBn: 'বাস্তব বাবল র‍্যাপ এবং সিল করা হয়েছে' },
      { id: 'shipped', label: 'In Transit', labelBn: 'কুরিয়ারে সড়কপথে', desc: `Dispatched with ${courierLabel}`, descBn: `${courierLabel}-এর মাধ্যমে ট্রানজিট চালু হয়েছে` },
      { id: 'delivered', label: 'Delivered', labelBn: 'গ্রাহকের নিকট হস্তান্তর', desc: 'Successfully collected & hand-delivered', descBn: 'গ্রাহকের নিকট শতভাগ সফলভাবে সীলযুক্ত অবস্থায় ট্র্যাকিং সম্পন্ন' }
    ];

    let activeCount = 1;
    if (status === 'Pending') {
      activeCount = 1;
    } else if (status === 'Confirmed') {
      activeCount = 2;
    } else if (status === 'Packaging' || status === 'Pending_Packaging') {
      activeCount = 3;
    } else if (status === 'Shipped') {
      activeCount = 4;
    } else if (status === 'Delivered') {
      activeCount = 5;
    } else {
      activeCount = 1;
    }

    return steps.map((st, idx) => ({
      ...st,
      completed: idx < activeCount,
      isCurrent: idx === activeCount - 1
    }));
  };

  const getTransitLogs = (order: Order) => {
    const orderDate = new Date(order.date);
    const formatDate = (daysAdd: number, timeStr: string) => {
      const d = new Date(orderDate);
      d.setDate(d.getDate() + daysAdd);
      return `${d.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { month: 'short', day: 'numeric' })} - ${timeStr}`;
    };

    const logs = [];

    logs.push({
      date: formatDate(0, '10:14 AM'),
      title: language === 'en' ? 'Ghoroya Bazar Central System Registration' : 'ঘরোয়া বাজার কেন্দ্রীয় সার্ভারে ইনভয়েস সৃষ্টি',
      body: language === 'en' 
        ? `Order was successfully placed by invoice #${order.id}. Selected payment method: ${order.paymentMethod}.`
        : `ইনভয়েস নম্বর #${order.id} অনুযায়ী ক্যাশবুক রেকর্ড করা হয়েছে। নির্বাচিত পেমেন্ট পদ্ধতি: ${order.paymentMethod}।`
    });

    if (order.status !== 'Pending') {
      logs.push({
        date: formatDate(0, '02:30 PM'),
        title: language === 'en' ? 'Quality Assessment & Approval' : 'পণ্য গুণগতমান নিরীক্ষা ও অনুমোদন',
        body: language === 'en' 
          ? 'Manual checking done. Order approved by compliance administrator.'
          : 'গুণগত মান নিশ্চিত করে কাস্টমার সার্ভিস অফিসার কর্তৃক অর্ডারটি চূড়ান্ত মঞ্জুর করা হয়েছে।'
      });
    }

    if (order.status !== 'Pending' && order.status !== 'Confirmed') {
      logs.push({
        date: formatDate(1, '09:00 AM'),
        title: language === 'en' ? 'Ghoroya Central Hub Protective Wrapping' : 'ঘরোয়া কেন্দ্রীয় হাব প্যাকেজিং শাখা',
        body: language === 'en'
          ? `Order items (${order.items.length} units) wrapped in environment-safe heavy-duty packaging with tracking seal.`
          : `অর্ডারকৃত পণ্যসমূহ (${order.items.length} টি আইটেম) কুরিয়ার বান্ধব থার্মাল বাবল র‍্যাপ কার্টনে সিল করা হয়েছে।`
      });
    }

    if (order.status === 'Shipped' || order.status === 'Delivered') {
      const courierPartner = order.courierName || 'Steadfast Courier';
      logs.push({
        date: formatDate(1, '05:00 PM'),
        title: language === 'en' ? `Courier Handover (${courierPartner})` : `কুরিয়ার বিভাগে হস্তান্তর (${courierPartner})`,
        body: language === 'en'
          ? `Dispatched via ${courierPartner}. Tracking ID: ${order.courierTrackingId || 'Registered'}. Gateway transit active.`
          : `ঘরোয়া বাজার অনুমোদিত ফাস্ট কুরিয়ার (${courierPartner}) ট্র্যাকিং আইডি (${order.courierTrackingId || 'রেজিস্টার্ড'}) সহ পার্সেল হস্তান্তর সম্পন্ন।`
      });

      logs.push({
        date: formatDate(2, '11:15 AM'),
        title: language === 'en' ? 'Regional Sorting Hub Dispatch' : 'আঞ্চলিক বাছাই ও বিতরণ শাখা',
        body: language === 'en'
          ? `Arrived at regional central hub near ${order.shippingAddress.district || 'recipient district'}. Under local sortation.`
          : `আঞ্চলিক প্রধান বাছাই কেন্দ্রে প্রবেশ করেছে। দ্রুত লোকাল ডেলিভারি এজেন্টের নিকট চালানের প্রক্রিয়া শুরু হয়েছে।`
      });
    }

    if (order.status === 'Delivered') {
      logs.push({
        date: formatDate(2, '04:15 PM'),
        title: language === 'en' ? 'Assigned to Local Runner Agent' : 'লোকাল ডেলিভারি রানার অ্যাসাইনমেন্ট সম্পন্ন',
        body: language === 'en'
          ? 'Runner assigned. Package loaded.'
          : 'ডেলিভারি ম্যানকে সফলভাবে পার্সেলটি বুথ থেকে বুঝিয়ে দেওয়া হয়েছে।'
      });

      logs.push({
        date: formatDate(3, '12:30 PM'),
        title: language === 'en' ? 'Out for Delivery / Delivered!' : 'গ্রাহক প্রান্তে সফলভাবে হস্তান্তর!',
        body: language === 'en'
          ? 'Package handed over to recipient. Thank you for choosing organic, home-made authentic products!'
          : 'গ্রাহকের স্বাক্ষর সহ সিল করা কন্টেইনার পার্সেলটি বুঝিয়ে দেওয়া হয়েছে। প্রিমিয়াম প্রাকৃতিক পণ্য কিনে ঘরোয়া বাজারের পাশে থাকার জন্য ধন্যবাদ।'
      });
    }

    if (order.status === 'Cancelled') {
      logs.push({
        date: formatDate(0, '05:15 PM'),
        title: language === 'en' ? 'Order Cancelled' : 'অর্ডার বাতিল বা স্থগিত',
        body: language === 'en'
          ? 'Order was marked as cancelled in the database pipeline.'
          : 'অর্ডারটি কোনো কারণে গ্রাহক বা বিক্রেতা কর্তৃক বাতিল বা স্থগিত করা হয়েছে।'
      });
    }

    return logs.reverse(); // New logs first
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-zinc-50 dark:bg-zinc-950 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header banner area */}
        <div className="bg-zinc-950 border-b border-zinc-850 px-4 py-3 sm:px-5 sm:py-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <div className="bg-red-650 p-1.5 sm:p-2 rounded-xl text-white shrink-0">
              <Truck size={16} className="animate-pulse" />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-xs sm:text-sm md:text-base leading-tight tracking-tight">
                {language === 'en' ? 'Consignment Tracking & Seller Analytics Registry' : 'কুরিয়ার কন্টেইনার ট্র্যাকিং ও বিক্রেতা রিপোর্ট'}
              </h3>
              <p className="text-[9px] sm:text-[10px] text-zinc-400 font-bold mt-1 uppercase tracking-wider leading-none">
                {language === 'en' ? 'Real-Time Logistics Center' : 'লাইভ কুরিয়ার ও কন্টেইনার ট্র্যাকিং হাব'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-2 rounded-full hover:bg-zinc-900 transition-all cursor-pointer shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Dynamic Navigation Tabs inside the tracking portal modal */}
        <div className="bg-zinc-900 px-3 py-2 border-b border-zinc-800 flex flex-wrap gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveTab('track')}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer grow sm:grow-0 text-center ${
              activeTab === 'track' 
                ? 'bg-red-650 text-white shadow-md' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            🔍 {language === 'en' ? 'Track Order Package' : 'অর্ডার ট্র্যাকিং'}
          </button>
          <button
            onClick={() => setActiveTab('sellerStats')}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer grow sm:grow-0 text-center ${
              activeTab === 'sellerStats' 
                ? 'bg-red-650 text-white shadow-md' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            📊 {language === 'en' ? 'Reseller Courier Summaries' : 'বিক্রেতা কুরিয়ার রিপোর্ট'}
          </button>
        </div>

        {/* Modal scrolling container */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1 bg-white text-zinc-805 select-none scrollbar-none">
          
          {/* TAB 1: ORDER PACKAGE TRACKING */}
          {activeTab === 'track' && (
            <div className="space-y-6">
              {/* Tracking Input form */}
              <form onSubmit={handleTrack} className="bg-zinc-50 border border-zinc-200/60 p-4 rounded-2xl shadow-xs space-y-3">
                <label className="block text-xs font-black text-zinc-650">
                  {language === 'en' ? 'ENTER YOUR UNIQUE ORDER ID OR INVOICE :' : 'আপনার ইউনিক অর্ডার / ইনভয়েস নম্বরটি লিখুন :'}
                </label>
                <div className="flex gap-2 flex-col sm:flex-row">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder={language === 'en' ? 'e.g. ORD-171866 or custom invoice code' : 'যেমন: ORD-171866 বা কাস্টম অর্ডার কোড'}
                      value={orderIdInput}
                      onChange={(e) => setOrderIdInput(e.target.value)}
                      className="w-full bg-white text-zinc-900 border border-zinc-250 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold uppercase focus:ring-2 focus:ring-red-500 outline-none transition"
                    />
                    <Hash size={14} className="absolute left-3.5 top-3.5 text-zinc-400" />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !orderIdInput.trim()}
                    className="bg-red-650 hover:bg-red-750 disabled:bg-zinc-300 text-white font-black text-xs px-5 py-2.5 sm:py-0 rounded-xl shadow-md transition-all uppercase flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={14} className="animate-spin text-white" />
                        <span>{language === 'en' ? 'Fetching...' : 'লোডিং...'}</span>
                      </>
                    ) : (
                      <>
                        <Search size={14} />
                        <span>{language === 'en' ? 'Track Package' : 'ট্র্যাক করুন'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Loading Indicator */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-16 space-y-3">
                  <Loader2 size={40} className="text-red-650 animate-spin" />
                  <p className="text-xs font-black text-zinc-500 animate-pulse">
                    {language === 'en' ? 'Synchronizing Live Courier Dispatch Records...' : 'লাইভ কুরিয়ার ডেটাবেস সিঙ্ক হচ্ছে...'}
                  </p>
                </div>
              )}

              {/* Error Message */}
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-150 p-4 rounded-xl flex gap-3 text-red-700 text-xs font-bold leading-relaxed"
                >
                  <AlertCircle size={18} className="shrink-0 text-red-600 mt-0.5" />
                  <div>
                    <p>{errorMsg}</p>
                    <div className="mt-3 flex gap-4 text-[10px] font-black uppercase text-red-800">
                      <span>📞 {language === 'en' ? 'Hotline:' : 'হটলাইন:'} ০১৫১৮৪৮৯০৮০</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Consignment Tracking Info Details Panel */}
              {orderData && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* Box 1: Highlights Info card */}
                  <div className="bg-[#FFF6F3] border border-[#FF6B35]/20 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row justify-between gap-4 select-none">
                    <div className="space-y-2">
                      <span className="bg-red-600/10 text-red-650 text-[10px] font-black px-2.5 py-1 rounded-full uppercase leading-none inline-block border border-red-650/10">
                        {language === 'en' ? `Status: ${orderData.status}` : `অবস্থা: ${orderData.statusBn}`}
                      </span>

                      {/* Display Assigned Courier Badge */}
                      {orderData.courierName && (
                        <span className="bg-emerald-600/10 text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase leading-none inline-block border border-emerald-600/10 ml-2">
                          🚚 {orderData.courierName}
                        </span>
                      )}

                      <h4 className="text-sm font-black text-zinc-900 flex items-center gap-1.5 pt-1">
                        <Package size={16} className="text-zinc-650" />
                        {language === 'en' ? 'Invoice Key:' : 'ইনভয়েস কোড:'} <span className="font-mono text-xs text-red-650 font-black">{orderData.id}</span>
                      </h4>
                      <div className="text-xs text-zinc-650 font-bold space-y-1">
                        <p className="flex items-center gap-1.5"><Calendar size={13} /> {language === 'en' ? 'Order Date:' : 'অর্ডার তারিখ:'} {new Date(orderData.date).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p className="flex items-center gap-1.5"><CreditCard size={13} /> {language === 'en' ? 'Method:' : 'পেমেন্ট পদ্ধতি:'} {orderData.paymentMethod}</p>
                        {orderData.courierTrackingId && (
                          <p className="flex items-center gap-1.5 text-zinc-900 font-black"><Hash size={13} /> {language === 'en' ? 'Courier Tracking ID:' : 'কুরিয়ার ট্র্যাকিং নম্বর:'} <span className="font-mono bg-zinc-100 rounded text-[11px] px-1.5 py-0.5 text-emerald-700">{orderData.courierTrackingId}</span></p>
                        )}
                      </div>
                    </div>

                    <div className="border-t md:border-t-0 md:border-l border-zinc-200/60 pt-4 md:pt-0 md:pl-5 flex flex-col justify-center space-y-1">
                      <p className="text-[10px] font-black text-zinc-450 uppercase tracking-widest leading-none">
                        🎁 {language === 'en' ? 'Estimated Delivery Date relative' : 'সম্ভাভ্য ডেলিভারি তারিখ'}
                      </p>
                      <p className="text-base sm:text-lg font-black text-emerald-600 pt-1">
                        {getEstimatedDate(orderData.date)}
                      </p>
                      <p className="text-[10px] text-zinc-500 font-bold leading-normal">
                        {language === 'en' 
                          ? 'Nationwide 48-72 hours swift doorstep transport guarantee.' 
                          : 'সারাদেশে ৪৮ থেকে ৭২ ঘণ্টার মধ্যে নিরাপদ হোম ডেলিভারি নিশ্চয়তা।'}
                      </p>
                    </div>
                  </div>

                  {/* Box 1.5: Detailed Auto Courier Link simulation widget */}
                  {orderData.courierName && (
                    <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                      <div>
                        <h5 className="text-xs font-black text-zinc-800">
                          {language === 'en' ? `Auto-Tracking Integrated Router (${orderData.courierName})` : `অটো-ট্র্যাকিং সংযুক্ত লজিস্টিক গেটওয়ে (${orderData.courierName})`}
                        </h5>
                        <p className="text-[10px] text-zinc-500 font-semibold mt-1">
                          {language === 'en' 
                            ? 'Your package is securely dispatched and synced under dynamic API webhooks.' 
                            : 'সার্ভার কুরিয়ার পার্টনার এপিআই হুকের সাথে আপনার প্যাকেজটিকে রিয়েল-টাইমে মেলানো হয়েছে।'}
                        </p>
                      </div>
                      <a
                        href={`https://g.co/kx/track?id=${orderData.courierTrackingId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black px-4 py-2 rounded-xl transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        <span>{language === 'en' ? 'Open Logistics Portal' : 'কুরিয়ার গেটওয়ে ওপেন'}</span>
                        <ArrowUpRight size={13} />
                      </a>
                    </div>
                  )}

                  {/* Box 2: Horizontal/Vertical Timeline Visualizer */}
                  <div>
                    <h5 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 border-b pb-1.5">
                      🟢 {language === 'en' ? 'Step Timeline Status Checked' : 'ধাপভিত্তিক ট্র্যাকিং বিবরণ'}
                    </h5>
                    <div className="relative">
                      {/* Progress Line */}
                      <div className="absolute top-0 bottom-0 left-[21px] sm:left-[21px] w-0.5 bg-zinc-150 z-0" />
                      
                      <div className="space-y-6">
                        {getTimelineSteps(orderData.status, orderData.courierName).map((st, idx) => (
                          <div key={st.id} className="relative flex items-start gap-4 z-10 select-none">
                            {/* Bullet Marker */}
                            <div
                              className={`w-11 h-11 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors ${
                                st.isCurrent
                                  ? 'bg-red-650 border-red-650 text-white shadow-md shadow-red-600/20'
                                  : st.completed
                                  ? 'bg-emerald-50 border-emerald-500 text-emerald-600'
                                  : 'bg-white border-zinc-200 text-zinc-400'
                              }`}
                            >
                              {st.completed ? (
                                <CheckCircle size={18} className="stroke-[2.5]" />
                              ) : (
                                <Clock size={16} />
                              )}
                            </div>

                            {/* Text info description */}
                            <div className="flex-1 min-w-0 pt-1.5">
                              <h6
                                className={`text-xs font-black ${
                                  st.isCurrent
                                    ? 'text-red-650'
                                    : st.completed
                                    ? 'text-zinc-800'
                                    : 'text-zinc-400'
                                }`}
                              >
                                {language === 'en' ? st.label : st.labelBn}
                              </h6>
                              <p className="text-[10px] sm:text-xs font-bold text-zinc-500 leading-normal mt-0.5">
                                {language === 'en' ? st.desc : st.descBn}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Box 3: Recipient & Courier Consignee */}
                  <div className="bg-zinc-50 border border-zinc-200/60 p-4 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold select-none leading-relaxed text-left">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{language === 'en' ? 'Consignee / Recipient Info' : 'গ্রাহক ও শিপিং ঠিকানা'}</p>
                      <p className="text-zinc-900 font-extrabold flex items-center gap-1.5 pt-1"><MapPin size={13} className="text-red-500 shrink-0" /> {orderData.shippingAddress.name}</p>
                      <p className="text-zinc-650 pl-4.5">{orderData.shippingAddress.address}, {orderData.shippingAddress.upazila || ''} {orderData.shippingAddress.district || ''}</p>
                    </div>

                    <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-zinc-200/60 pt-3 sm:pt-0 sm:pl-4">
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{language === 'en' ? 'Contact Details' : 'যোগাযোগ মাধ্যম'}</p>
                      <p className="text-zinc-900 font-extrabold flex items-center gap-1.5 pt-1"><Phone size={13} className="text-blue-500 shrink-0" /> {orderData.shippingAddress.phone}</p>
                      <p className="text-zinc-550 pl-4.5">{language === 'en' ? 'Fast courier agent contact support.' : 'যেকোনো সমস্যায় আমাদের কল বা মেসেজ দিন।'}</p>
                    </div>
                  </div>

                  {/* Box 4: Log Tracking Hub routes */}
                  <div className="text-left">
                    <h5 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 border-b pb-1.5">
                      📍 {language === 'en' ? 'Multi-Channel Gateways Transit Logs' : 'মাল্টি-চ্যানেল লাইভ ট্রানজিট লগ বুক'}
                    </h5>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl divide-y divide-zinc-200 text-[11px] leading-relaxed">
                      {getTransitLogs(orderData).map((log, index) => (
                        <div key={index} className="p-3 hover:bg-zinc-100/50 transition border-b last:border-0">
                          <div className="flex justify-between items-center text-[10px] font-black text-zinc-400">
                             <span>{log.date}</span>
                             <span className="bg-zinc-200/60 px-2 py-0.5 rounded uppercase font-black text-[8px] select-none text-zinc-650">{language === 'en' ? 'Hub OK' : 'সফল'}</span>
                          </div>
                          <h6 className="font-extrabold text-zinc-800 pt-1 flex items-center gap-1 text-xs">
                             <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block shrink-0 animate-pulse" />
                             {log.title}
                          </h6>
                          <p className="text-zinc-500 select-none pl-2.5 mt-0.5 font-bold">
                             {log.body}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                </motion.div>
              )}
            </div>
          )}

          {/* TAB 2: SELLER COURIER PERFORMANCE STATISTICS */}
          {activeTab === 'sellerStats' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-red-600/5 to-orange-500/5 border border-zinc-200/60 p-4 rounded-2xl">
                <h4 className="text-xs font-black text-zinc-900 uppercase tracking-tight flex items-center gap-2">
                  📊 {language === 'en' ? 'Customer Courier History & Commerce Fraud Checker' : 'গ্রাহক কুরিয়ার হিস্ট্রি ও ফ্রড চেকার প্যানেল'}
                </h4>
                <p className="text-[11px] text-zinc-550 pt-1.5 leading-normal">
                  {language === 'en' 
                    ? "Enter a customer's standard mobile phone number to retrieve detailed analytical metrics of their delivery behaviors, success rates, and cautionary reports filed by digital merchants."
                    : 'আপনার গ্রাহকের মোবাইল নম্বরটি লিখে সার্চ করে ওনার পূর্বের সফল পার্সেল ডেলিভারি ও বাতিলকৃত রিজেক্ট পার্সেলের কুরিয়ারভিত্তিক রেকর্ড এবং অন্যান্য বিক্রেতাদের রিভিউ অভিযোগ পর্যবেক্ষণ করুন।'}
                </p>
              </div>

              {/* Input Form for Seller Stats */}
              <form onSubmit={handleFetchSellerStats} className="bg-zinc-50 border border-zinc-200/60 p-4 rounded-2xl shadow-xs space-y-3">
                <label className="block text-xs font-black text-zinc-650">
                  {language === 'en' ? 'ENTER CUSTOMER MOBILE NUMBER :' : 'চেক করতে গ্রাহকের মোবাইল নম্বরটি লিখুন :'}
                </label>
                <div className="flex gap-2 flex-col sm:flex-row">
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 01700000000"
                      value={sellerPhoneInput}
                      onChange={(e) => setSellerPhoneInput(e.target.value)}
                      className="w-full bg-white text-zinc-900 border border-zinc-250 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold focus:ring-2 focus:ring-red-500 outline-none transition"
                    />
                    <Phone size={14} className="absolute left-3.5 top-3.5 text-zinc-400" />
                  </div>
                  <button
                    type="submit"
                    disabled={statsLoading || !sellerPhoneInput.trim()}
                    className="bg-red-650 hover:bg-red-750 disabled:bg-zinc-300 text-white font-black text-xs px-5 py-2.5 sm:py-0 rounded-xl shadow-md transition-all uppercase flex items-center justify-center gap-1.5 cursor-pointer animate-none"
                  >
                    {statsLoading ? (
                      <>
                        <Loader2 size={14} className="animate-spin text-white" />
                        <span>{language === 'en' ? 'Compiling Stats...' : 'হিসাব হচ্ছে...'}</span>
                      </>
                    ) : (
                      <>
                        <Search size={14} />
                        <span>{language === 'en' ? 'Check Client' : 'গ্রাহক চেক করুন'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Stats Loading indicator */}
              {statsLoading && (
                <div className="flex flex-col items-center justify-center py-16 space-y-3">
                  <Loader2 size={40} className="text-red-500 animate-spin" />
                  <p className="text-xs font-black text-zinc-500 animate-pulse">
                    {language === 'en' ? 'Scanning all order files and computing courier parameters...' : 'কুরিয়ার ডাটাবেস গেটওয়ে থেকে গ্রাহকের পার্সেল রেকর্ড প্রসেস করা হচ্ছে...'}
                  </p>
                </div>
              )}

              {/* Stats Error message */}
              {statsErrorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-150 p-4 rounded-xl flex gap-3 text-red-700 text-xs font-semibold leading-relaxed"
                >
                  <AlertCircle size={18} className="shrink-0 text-red-600 mt-0.5" />
                  <p>{statsErrorMsg}</p>
                </motion.div>
              )}

              {/* Stats Rendering Area */}
              {sellerStatsData && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Summary Metric Strip */}
                  {(() => {
                    // Calculate totals
                    const totalTaken = sellerStatsData.stats.reduce((acc, curr) => acc + curr.takenOrders, 0);
                    const totalCancelled = sellerStatsData.stats.reduce((acc, curr) => acc + curr.cancelledOrders, 0);
                    const grandTotal = totalTaken + totalCancelled;
                    const successRate = grandTotal > 0 ? Math.round((totalTaken / grandTotal) * 100) : 100;

                    return (
                      <div className="space-y-6">
                        {/* LIVE SUMMARY HEADER */}
                        <div>
                          <h5 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest border-b pb-1.5 flex items-center gap-1.5 leading-none">
                            🔴 {language === 'en' ? 'LIVE SUMMARY' : 'লাইভ সামারি'}
                          </h5>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-3 select-none">
                            <div className="bg-white border rounded-2xl p-4 text-center shadow-xs">
                              <span className="text-[10px] text-zinc-400 font-extrabold uppercase block">{language === 'en' ? 'Total Parcel' : 'মোট পার্সেল (Total Parcel)'}</span>
                              <span className="text-2xl sm:text-3xl font-black text-zinc-850 block pt-1.5 font-mono">{grandTotal}</span>
                            </div>
                            <div className="bg-white border rounded-2xl p-4 text-center shadow-xs">
                              <span className="text-[10px] text-zinc-400 font-extrabold uppercase block">{language === 'en' ? 'Success Ratio' : 'সফলতার হার (Success Ratio)'}</span>
                              <span className="text-2xl sm:text-3xl font-black text-emerald-600 block pt-1.5 font-mono">{successRate}%</span>
                            </div>
                            <div className="bg-white border rounded-2xl p-4 text-center shadow-xs">
                              <span className="text-[10px] text-zinc-400 font-extrabold uppercase block">{language === 'en' ? 'Success' : 'সফল (Success)'}</span>
                              <span className="text-2xl sm:text-3xl font-black text-emerald-500 block pt-1.5 font-mono">{totalTaken}</span>
                            </div>
                            <div className="bg-white border rounded-2xl p-4 text-center shadow-xs">
                              <span className="text-[10px] text-zinc-400 font-extrabold uppercase block">{language === 'en' ? 'Cancelled' : 'বাতিল (Cancelled)'}</span>
                              <span className="text-2xl sm:text-3xl font-black text-red-555 block pt-1.5 font-mono">{totalCancelled}</span>
                            </div>
                          </div>
                        </div>

                        {/* COURIER STATUS TABLE */}
                        <div>
                          <h5 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest border-b pb-1.5 flex items-center gap-1.5 leading-none mb-3">
                            🚛 {language === 'en' ? 'COURIER STATUS' : 'কুরিয়ার স্ট্যাটাস বিবরণ (COURIER STATUS)'}
                          </h5>
                          
                          <div className="border border-zinc-200 rounded-2xl overflow-x-auto shadow-xs max-w-full scrollbar-thin">
                            <table className="w-full min-w-[500px] text-left border-collapse bg-white">
                              <thead>
                                <tr className="bg-[#00b0f0] text-white">
                                  <th className="p-3 font-extrabold text-xs uppercase">{language === 'en' ? 'Courier' : 'কুরিয়ার (Courier)'}</th>
                                  <th className="p-3 font-extrabold text-xs text-center uppercase">{language === 'en' ? 'Total' : 'মোট (Total)'}</th>
                                  <th className="p-3 font-extrabold text-xs text-center uppercase">{language === 'en' ? 'Success' : 'সফল (Success)'}</th>
                                  <th className="p-3 font-extrabold text-xs text-center uppercase">{language === 'en' ? 'Cancelled' : 'বাতিল (Cancelled)'}</th>
                                  <th className="p-3 font-extrabold text-xs text-center uppercase">{language === 'en' ? 'Success Ratio' : 'সফলতার হার'}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {sellerStatsData.stats.map((item, idx) => {
                                  const courierSum = item.takenOrders + item.cancelledOrders;
                                  const courierRate = courierSum > 0 ? Math.round((item.takenOrders / courierSum) * 100) : 0;
                                  return (
                                    <tr key={idx} className="border-b border-zinc-150 last:border-0 hover:bg-zinc-50/60 transition">
                                      <td className="p-3 font-black text-zinc-800 text-xs flex items-center gap-1.5">
                                        <span className="inline-block w-2.5 h-2.5 rounded bg-sky-450 bg-sky-400" />
                                        {item.courier}
                                      </td>
                                      <td className="p-3 text-center text-zinc-900 font-mono text-xs font-extrabold">{courierSum}</td>
                                      <td className="p-3 text-center text-emerald-600 font-mono text-xs font-extrabold">{item.takenOrders}</td>
                                      <td className="p-3 text-center text-red-500 font-mono text-xs font-extrabold">{item.cancelledOrders}</td>
                                      <td className="p-3 text-center text-zinc-850 font-mono text-xs font-extrabold">{courierRate}%</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* REPORTS / COMMENTS COLUMN */}
                        <div>
                          <div className="flex justify-between items-center border-b pb-1.5 mb-3">
                            <h5 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 leading-none">
                              📝 {language === 'en' ? 'REPORTS FEEDBACK' : 'মার্চেন্ট অভিযোগ ও রিভিউসমূহ (REPORTS)'}
                            </h5>
                            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-red-100 text-red-655 font-mono uppercase">
                              {buyerReports.length} {language === 'en' ? 'Reports' : 'অভিযোগ'}
                            </span>
                          </div>

                          {buyerReports.length === 0 ? (
                            <div className="bg-zinc-50 border border-zinc-200/60 p-6 rounded-2xl text-center">
                              <p className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">{language === 'en' ? 'No Negative Feedback Found' : 'এই নম্বরের বিরুদ্ধে কোনো অভিযোগ পাওয়া যায়নি।'}</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {buyerReports.map((rep, rIdx) => {
                                const isNegative = rep.rating === 'fraud' || rep.rating === 'warning';
                                return (
                                  <div key={rep.id || rIdx} className={`p-4 rounded-2xl border transition-all text-left space-y-2.5 ${
                                    isNegative ? 'bg-red-50/40 border-red-200' : 'bg-zinc-50/50 border-zinc-200'
                                  }`}>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                                      <div className="flex items-center gap-1.5">
                                        <div className={`w-2 h-2 rounded-full ${isNegative ? 'bg-red-500' : 'bg-zinc-400'}`} />
                                        <span className="font-extrabold text-xs text-zinc-800">{rep.reporterName}</span>
                                        <span className="text-[10px] text-zinc-450 font-bold">({rep.reporterStore || 'ঘরোয়া মার্চেন্ট'})</span>
                                      </div>
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-[9px] font-mono text-zinc-400 font-bold">{rep.date}</span>
                                        <span className={`text-[9px] font-black px-1.5 py-0.2 rounded border uppercase ${
                                          isNegative ? 'bg-red-100/60 text-red-655 border-red-200' : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                                        }`}>
                                          {rep.courierName || 'SteadFast'}
                                        </span>
                                      </div>
                                    </div>
                                    <p className="text-[12px] sm:text-[13px] font-extrabold text-zinc-900 leading-relaxed font-sans">{rep.comment}</p>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* ADD NEW WARNING REPORT OPTION */}
                        <div className="bg-zinc-50 border border-zinc-250 p-4 rounded-2xl">
                          <button
                            type="button"
                            onClick={() => setIsAddingReport(!isAddingReport)}
                            className="w-full flex justify-between items-center text-xs font-black text-red-655 hover:text-red-750 transition uppercase cursor-pointer"
                          >
                            <span>⚠️ {language === 'en' ? 'Submit Fraud / Refusal Incident Report' : 'গ্রাহকের বিরুদ্ধে অভিযোগ বা ফ্রড রিপোর্ট পোস্ট করুন'}</span>
                            <span className="text-sm font-bold">{isAddingReport ? '▲' : '▼'}</span>
                          </button>

                          {isAddingReport && (
                            <form onSubmit={handleAddNewReport} className="mt-4 pt-4 border-t border-zinc-200 space-y-4 text-left">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="block text-[10px] font-black text-zinc-450 uppercase tracking-wider">{language === 'en' ? 'Reporter Store Name :' : 'আপনার স্টোরের নাম :'}</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="e.g. Ghoroya Fashion House"
                                    value={newReportStore}
                                    onChange={(e) => setNewReportStore(e.target.value)}
                                    className="w-full bg-white text-zinc-900 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-1 focus:ring-red-500 outline-none"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="block text-[10px] font-black text-zinc-450 uppercase tracking-wider">{language === 'en' ? 'Reporter Name :' : 'রিপোর্টারের নাম :'}</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="e.g. Mostak Ahmed"
                                    value={newReportReporter}
                                    onChange={(e) => setNewReportReporter(e.target.value)}
                                    className="w-full bg-white text-zinc-900 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-1 focus:ring-red-500 outline-none"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="block text-[10px] font-black text-zinc-450 uppercase tracking-wider">{language === 'en' ? 'Courier Service :' : 'কুরিয়ার পার্টনার :'}</label>
                                <select
                                  value={newReportCourier}
                                  onChange={(e) => setNewReportCourier(e.target.value)}
                                  className="w-full bg-white text-zinc-900 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-1 focus:ring-red-500 outline-none"
                                >
                                  <option value="SteadFast">SteadFast Courier</option>
                                  <option value="pathao">Pathao Courier</option>
                                  <option value="REDX">REDX Courier</option>
                                  <option value="parceldex">ParcelDex</option>
                                  <option value="PAPERFLY">PAPERFLY</option>
                                  <option value="Carryboo">Carryboo</option>
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="block text-[10px] font-black text-zinc-450 uppercase tracking-wider">{language === 'en' ? 'Write detailed experience/allegation :' : 'অভিযোগ বিবরণ ও রিভিউ লিখুন :'}</label>
                                <textarea
                                  required
                                  rows={3}
                                  placeholder={language === 'en' ? "e.g. Returned parcel, blocked number when delivery agent tried calling..." : "উদাঃ অর্ডার বুক করে ডেলিভারির সময় ফোন রিসিভ করেনি এবং ব্লক করে দিয়েছে। চরম ক্ষতি করল কোম্পানিটির।"}
                                  value={newReportComment}
                                  onChange={(e) => setNewReportComment(e.target.value)}
                                  className="w-full bg-white text-zinc-900 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-1 focus:ring-red-500 outline-none leading-relaxed"
                                />
                              </div>

                              <div className="flex justify-end pt-1">
                                <button
                                  type="submit"
                                  disabled={reportSubmitting || !newReportComment.trim()}
                                  className="bg-red-650 hover:bg-red-750 disabled:bg-zinc-300 text-white font-black text-[11px] px-5 py-2 rounded-xl transition uppercase cursor-pointer"
                                >
                                  {reportSubmitting ? 'Posting...' : (language === 'en' ? 'Submit Case Report' : 'অভিযোগ পোস্ট করুন')}
                                </button>
                              </div>
                            </form>
                          )}
                        </div>

                      </div>
                    );
                  })()}
                </motion.div>
              )}
            </div>
          )}

        </div>

        {/* Footer actions options */}
        <div className="bg-zinc-950 border-t border-zinc-850 p-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10.5px] font-extrabold text-zinc-400">
          <span>🛡️ {language === 'en' ? 'SSL Secure Consignment Gateway 128-bit' : 'এসএসএল সিকিউর ১২৮-বিট ট্র্যাকিং গেটওয়ে'}</span>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="text-zinc-300 hover:text-white uppercase font-black"
            >
              {language === 'en' ? 'Close Portal' : 'পোর্টাল বন্ধ করুন'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
