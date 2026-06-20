import React, { useState } from 'react';
import { X, Calendar, MapPin, ClipboardList, CheckCircle, Clock, Truck, Bell, MessageSquare, PhoneCall, Gift, Check, Search } from 'lucide-react';
import { Order } from '../types';

interface MyOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'bn';
  orders: Order[];
  onAiChatOpen: () => void;
}

export default function MyOrdersModal({
  isOpen,
  onClose,
  language,
  orders,
  onAiChatOpen
}: MyOrdersModalProps) {
  // Local state to track which order IDs have opted into Carrier SMS Alerts
  const [smsOptInList, setSmsOptInList] = useState<Record<string, boolean>>({});
  
  // Search and separate classification filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'Pending' | 'Shipped' | 'Delivered'>('all');

  if (!isOpen) return null;

  const handleSmsToggle = (orderId: string) => {
    setSmsOptInList((prev) => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const getEstimatedDate = () => {
    try {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 3);
      return targetDate.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return language === 'en' ? 'In 3 Days' : '৩ দিনের মধ্যে';
    }
  };

  // Determine active check-points for the timeline
  const getTimelineSteps = (status: string) => {
    const steps = [
      { id: 'placed', label: 'Order Placed', labelBn: 'অর্ডার সফল হয়েছে', desc: 'Awaiting seller review', descBn: 'অর্ডার কনফার্মেশনের অপেক্ষা' },
      { id: 'approved', label: 'Approved', labelBn: 'অর্ডার নিশ্চিত', desc: 'Invoice successfully matched', descBn: 'ভাউচার ও মূল্য যাচাই সম্পন্ন' },
      { id: 'packaging', label: 'Product Packaging', labelBn: 'প্যাকেজিং চলছে', desc: 'Secure wrapping & seal applied', descBn: 'নিরাপদ বাবল র‍্যাপ সম্পন্ন' },
      { id: 'shipped', label: 'Handed to Courier', labelBn: 'কুরিয়ারে পাঠানো হয়েছে', desc: 'Dispatched via Pathao/Redx', descBn: 'কুরিয়ারে ট্র্যাকিং নম্বর সহ হস্তান্তর' },
      { id: 'delivered', label: 'Delivered', labelBn: 'গ্রাহকের হাতে হস্তান্তর', desc: 'Package received & verified', descBn: 'শতভাগ সফলভাবে ডেলিভারি সম্পন্ন' }
    ];

    let activeCount = 1;
    if (status === 'Pending') {
      activeCount = 2; // Placed & Approved automatically
    } else if (status === 'Shipped') {
      activeCount = 4; // Placed, Approved, Packaging, Shipped
    } else if (status === 'Delivered') {
      activeCount = 5; // All active
    }

    return steps.map((st, idx) => ({
      ...st,
      completed: idx < activeCount,
      isCurrent: idx === activeCount - 1
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[92vh]">
        
        {/* Header bar banner */}
        <div className="bg-zinc-900 border-b border-zinc-800 text-white p-4.5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ClipboardList size={20} className="text-red-500" />
            <div>
              <h3 className="font-extrabold text-sm sm:text-base leading-none tracking-tight">
                {language === 'en' ? 'My Delivery Order Hub' : 'আমার অর্ডার ট্র্যাকিং হাব'}
              </h3>
              <p className="text-[10px] text-zinc-400 font-bold mt-1.5 uppercase tracking-widest leading-none">
                📍 {language === 'en' ? 'REAL-TIME STATUS MONITORING' : 'সরাসরি গতিবিধি ও ডেলিভারি বিবরণী'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="text-zinc-400 hover:text-white p-2 rounded-full hover:bg-zinc-800 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content body layout list */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1 bg-white text-zinc-800">
          
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-80 text-center gap-4 py-8">
              <ClipboardList size={64} className="text-zinc-250 stroke-[1.25]" />
              <div>
                <h4 className="font-extrabold text-zinc-850 text-sm">
                  {language === 'en' ? 'No Orders Placed Yet' : 'আপনার কোনো অর্ডার রেকর্ড নেই!'}
                </h4>
                <p className="text-xs text-zinc-550 leading-relaxed max-w-sm mt-1">
                  {language === 'en' 
                    ? 'Create your first orders by adding items in the cart and choosing dynamic bKash/Nagad/COD checkouts!' 
                    : 'স্টোর থেকে পছন্দের পণ্য কার্টে যোগ করে ক্যাশ অন ডেলিভারি অথবা সুরক্ষিত মোবাইল পেমেন্টের মাধ্যমে ফার্স্ট অর্ডারটি করুন।'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Intelligent Search Input & Status category tabs */}
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={language === 'en' ? "Search by Order ID or Recipient Mobile No..." : "অর্ডার নাম্বার অথবা কাস্টমারের মোবাইল নম্বর দিয়ে খুঁজুন..."}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-2xl pl-11 pr-14 py-3 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all shadow-xs"
                  />
                  <Search className="absolute left-4 top-3.5 text-zinc-400" size={16} />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-3 text-zinc-400 hover:text-red-500 transition-colors text-xs font-extrabold cursor-pointer"
                    >
                      {language === 'en' ? 'Clear' : 'মুছুন'}
                    </button>
                  )}
                </div>

                {/* Classification tabs layout */}
                <div className="flex border-b border-zinc-150 overflow-x-auto pb-1 gap-2 scrollbar-none select-none">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'all' 
                        ? 'bg-zinc-900 text-white shadow-sm' 
                        : 'text-zinc-500 hover:text-zinc-805 hover:bg-zinc-100'
                    }`}
                  >
                    <span>{language === 'en' ? 'All Orders' : 'সবগুলা'}</span>
                    <span className={`text-[9.5px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'all' ? 'bg-zinc-800 text-white' : 'bg-zinc-150 text-zinc-650'}`}>{orders.length}</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('Pending')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'Pending' 
                        ? 'bg-amber-400 text-zinc-950 shadow-sm' 
                        : 'text-zinc-500 hover:text-zinc-805 hover:bg-zinc-100'
                    }`}
                  >
                    <span>⏳ {language === 'en' ? 'Packing / Processing' : 'প্যাকিং চলছে'}</span>
                    <span className={`text-[9.5px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'Pending' ? 'bg-amber-500/30 text-amber-950' : 'bg-zinc-150 text-zinc-600'}`}>{orders.filter(o => o.status === 'Pending').length}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('Shipped')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'Shipped' 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-zinc-500 hover:text-blue-600 hover:bg-zinc-100'
                    }`}
                  >
                    <span>🚚 {language === 'en' ? 'Shipped / In Transit' : 'শিপড / সড়কপথে'}</span>
                    <span className={`text-[9.5px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'Shipped' ? 'bg-blue-700 text-white' : 'bg-zinc-150 text-zinc-600'}`}>{orders.filter(o => o.status === 'Shipped').length}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('Delivered')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'Delivered' 
                        ? 'bg-emerald-600 text-white shadow-sm' 
                        : 'text-zinc-500 hover:text-emerald-600 hover:bg-zinc-100'
                    }`}
                  >
                    <span>🎉 {language === 'en' ? 'Completed / Delivered' : 'ডেলিভার্ড সম্পন্ন'}</span>
                    <span className={`text-[9.5px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'Delivered' ? 'bg-emerald-700 text-white' : 'bg-zinc-150 text-zinc-650'}`}>{orders.filter(o => o.status === 'Delivered').length}</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Filtered list render */}
              {(() => {
                const filtered = [...orders].reverse().filter(o => {
                  const query = searchQuery.trim().toLowerCase();
                  const matchesSearch = !query || 
                    o.id.toLowerCase().includes(query) ||
                    (o.shippingAddress.phone && o.shippingAddress.phone.includes(query)) ||
                    (o.shippingAddress.name && o.shippingAddress.name.toLowerCase().includes(query));
                  const matchesTab = activeTab === 'all' || o.status === activeTab;
                  return matchesSearch && matchesTab;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="flex flex-col items-center justify-center p-12 text-center border bg-zinc-50 rounded-2xl space-y-2">
                      <Search size={32} className="text-zinc-350 animate-pulse" />
                      <p className="font-bold text-xs text-zinc-500">
                        {language === 'en' 
                          ? 'No matching orders found under current tab / search.' 
                          : 'খোঁজা অনুযায়ী কোনো অর্ডার পাওয়া যায়নি। সঠিক আইডি বা ফোন নম্বর দিন।'}
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-6">
                    {filtered.map((order) => {
                      const timeline = getTimelineSteps(order.status);
                      const isSmsEnabled = !!smsOptInList[order.id];

                      return (
                        <div
                          key={order.id}
                          className="border border-zinc-200 hover:border-zinc-350 bg-zinc-50 rounded-2xl p-4.5 space-y-5 transition shadow-sm"
                        >
                          {/* Unique Order ID and tracking badge */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-zinc-200 pb-3">
                            <div>
                              <span className="bg-red-650 text-white font-mono text-[10px] font-black px-3 py-1 rounded-full uppercase">
                                ID: {order.id}
                              </span>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-[10px] text-zinc-400 font-bold flex items-center gap-1">
                                  <Calendar size={11} />
                                  <span>{order.date}</span>
                                </span>
                              </div>
                            </div>

                            {/* Estimated Date Card banner */}
                            <div className="bg-white border border-orange-200 px-3.5 py-1.5 rounded-xl flex items-center gap-2 self-start sm:self-center select-none">
                              <Truck size={14} className="text-orange-500 animate-pulse" />
                              <span className="text-[10.5px] font-black text-orange-655">
                                {language === 'en' ? 'Estimated Delivery' : 'সম্ভাব্য পৌঁছানোর তারিখ'}: {getEstimatedDate()}
                              </span>
                            </div>
                          </div>

                          {/* CURRENT ORDER DELIVERY STATUS SUMMARY BANNER */}
                          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs select-none ${
                            order.status === 'Delivered' 
                              ? 'bg-emerald-50 border-emerald-250 text-emerald-950 font-sans' 
                              : order.status === 'Shipped'
                              ? 'bg-blue-50 border-blue-250 text-blue-950 font-sans'
                              : 'bg-amber-50 border-amber-200 text-amber-950 font-sans'
                          }`}>
                            <div className="space-y-1">
                              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block">
                                {language === 'en' ? 'CURRENT DELIVERY STATUS' : 'ডেলিভারির সর্বশেষ অবস্থা'}
                              </span>
                              <div className="flex items-center gap-2">
                                <div className={`w-2.5 h-2.5 rounded-full animate-ping shrink-0 ${
                                  order.status === 'Delivered' ? 'bg-emerald-500' : order.status === 'Shipped' ? 'bg-blue-500' : 'bg-amber-500'
                                }`} />
                                <h4 className="font-extrabold text-sm sm:text-base tracking-tight leading-none select-text text-zinc-900">
                                  {order.status === 'Delivered' 
                                    ? (language === 'en' ? '🎉 Package Delivered Successfully!' : '🎉 পণ্য ডেলিভারি সম্পন্ন ও অভিনন্দন!')
                                    : order.status === 'Shipped'
                                    ? (language === 'en' ? '🚚 Out of House & Handed to Courier' : '🚚 পার্সেলটি রওয়ানা হয়েছে ও ট্রানজিটে আছে')
                                    : (language === 'en' ? '⏳ Invoice Verified & Under Packaging' : '⏳ অর্ডার কনফার্ম হয়েছে ও পণ্যের মান যাচাই চলছে')}
                                </h4>
                              </div>
                              <p className="text-[10.5px] leading-relaxed text-zinc-500 font-extrabold max-w-xl select-text">
                                {order.status === 'Delivered' 
                                  ? (language === 'en' ? 'This delivery is marked as safely completed. Our team verified quality. Thank you for choosing Ghoroya Bazar!' : 'আপনার কুরিয়ার পার্সেলটি সফলভাবে আপনার ঠিকানায় পৌঁছানো হয়েছে। ঘরোয়া বাজার লিমিটেডের সাথে কেনাকাটার জন্য শুভকামনা!')
                                  : order.status === 'Shipped'
                                  ? (language === 'en' ? `Dispatched via Priority Post (Courier Dispatch Code: Pathao-${order.id}). Reach customer care hotline for direct tracking updates.` : `পার্সেলটি আমাদের প্রধান ক্যাটালগ হাউজ থেকে কুরিয়ার কুরিয়ারে হস্তান্তর করা হয়েছে। গতিবিধি ট্র্যাকিং কোড: Pathao-${order.id}।`)
                                  : (language === 'en' ? 'We have confirmed item counts and logged matching voucher codes. Our packers are double-layered sealing with freshness bubble bounds.' : 'অর্ডার ভাউচার ম্যানেজার কর্তৃক অনুমোদিত হয়েছে। মুদি বা অর্গানিক উপাদানের সঠিকতা ও ফ্রেশনেস নিশ্চিত করে বাবল র‍্যাপ সিলিং চলছে।')}
                              </p>
                            </div>

                            <div className="shrink-0 flex items-center justify-start sm:justify-end">
                              <span className={`px-4 py-2.5 rounded-xl text-[10.5px] font-black shadow-xs uppercase tracking-wider leading-none shrink-0 ${
                                order.status === 'Delivered'
                                  ? 'bg-emerald-600 border border-emerald-500 text-white'
                                  : order.status === 'Shipped'
                                  ? 'bg-blue-600 border border-blue-500 text-white'
                                  : 'bg-amber-400 border border-amber-300 text-zinc-950'
                              }`}>
                                {order.status === 'Delivered' 
                                  ? (language === 'en' ? 'DELIVERED' : 'ডেলিভার্ড সম্পন্ন') 
                                  : order.status === 'Shipped' 
                                  ? (language === 'en' ? 'SHIPPED / ON WAY' : 'শিপড / সড়কপথে') 
                                  : (language === 'en' ? 'PROCESSING' : 'প্যাকিং চলছে')}
                              </span>
                            </div>
                          </div>

                          {/* LIVE-ANIMATED STATUS TIMELINE PROGRESS */}
                          <div className="bg-white border border-zinc-200 p-4 rounded-xl">
                            <h5 className="text-[10.5px] font-black text-zinc-400 uppercase tracking-widest mb-4">
                              📊 {language === 'en' ? 'Live Progress Tracker' : 'ডেলিভারি টাইমলাইন লগ'}
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
                              {timeline.map((step, sIdx) => (
                                <div key={step.id} className="relative flex sm:flex-col items-start sm:items-center text-left sm:text-center gap-3 sm:gap-1.5">
                                  
                                  {/* Circle Badge Indicator */}
                                  <div className="relative z-10 flex-shrink-0">
                                    <div
                                      className={`w-7 h-7 rounded-full flex items-center justify-center transition border font-black text-xs ${
                                        step.completed
                                          ? 'bg-red-600 text-white border-red-600 shadow-md'
                                          : 'bg-zinc-100 text-zinc-400 border-zinc-200'
                                      }`}
                                    >
                                      {step.completed ? (
                                        <Check size={13} className="stroke-[3]" />
                                      ) : (
                                        <span>{sIdx + 1}</span>
                                      )}
                                    </div>
                                    {step.isCurrent && (
                                      <span className="absolute -inset-1 rounded-full bg-red-600/25 animate-ping pointer-events-none" />
                                    )}
                                  </div>

                                  {/* Text labels descriptor style */}
                                  <div className="min-w-0">
                                    <h6 className={`font-black text-xs leading-tight ${step.completed ? 'text-zinc-855' : 'text-zinc-400'}`}>
                                      {language === 'en' ? step.label : step.labelBn}
                                    </h6>
                                    <p className="text-[9.5px] text-zinc-400 font-extrabold mt-0.5 leading-none">
                                      {language === 'en' ? step.desc : step.descBn}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Product items detailed billing inside cards */}
                          <div className="space-y-2.5">
                            {order.items.map((item) => (
                              <div key={`${item.product.id}-${item.selectedColor}`} className="flex gap-4 items-center text-xs">
                                <img
                                  src={item.product.image}
                                  alt=""
                                  className="w-11 h-11 object-cover rounded-lg border bg-white"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-extrabold text-zinc-805 truncate">
                                    {language === 'en' ? item.product.name : item.product.nameBn}
                                  </p>
                                  <p className="text-[10px] text-zinc-450 font-bold mt-0.5">
                                    {language === 'en' ? 'Quantity' : 'পরিমাণ'}: {item.quantity}{' '}
                                    {item.selectedColor ? `| ${item.selectedColor}` : ''}{' '}
                                    {item.selectedSize ? `| Size: ${item.selectedSize}` : ''}
                                  </p>
                                </div>
                                <span className="font-mono text-xs font-black text-zinc-900 pr-1">
                                  ৳{(item.product.price * item.quantity).toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Delivery Notes / Special instructions if specified */}
                          {order.orderNotes && (
                            <div className="bg-amber-50 border border-amber-200/60 p-3 rounded-xl text-[11px] font-semibold text-amber-805">
                              📌 <strong>{language === 'en' ? 'Recipient Note: ' : 'ডেলিভারি বিশেষ নির্দেশনা: '}</strong>
                              {order.orderNotes}
                            </div>
                          )}

                          {/* Recipient details + Billing address summary */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border border-zinc-200 p-4 rounded-xl text-xs font-bold leading-relaxed text-zinc-600">
                            <div className="space-y-1">
                              <p className="font-black text-zinc-850 pb-0.5">
                                {language === 'en' ? 'Shipping Destination' : 'প্রাপকের ঠিকানা'}
                              </p>
                              <p className="text-zinc-700">🧑 {order.shippingAddress.name}</p>
                              <p className="text-zinc-700">📞 {order.shippingAddress.phone}</p>
                              <p className="text-zinc-700">📍 {order.shippingAddress.address}, {order.shippingAddress.city}</p>
                            </div>

                            <div className="space-y-1.5 md:text-right flex flex-col justify-between items-start md:items-end">
                              <div className="w-full">
                                <p className="font-black text-zinc-850 pb-0.5">
                                  {language === 'en' ? 'Bill Summary' : 'পেমেন্ট সারসংক্ষেপ'}
                                </p>
                                <p className="text-[11px] text-zinc-500 font-bold">
                                  {language === 'en' ? 'Gateway:' : 'পরিশোধ মাধ্যম:'} {order.paymentMethod}
                                </p>
                              </div>
                              <p className="text-zinc-900 font-mono text-sm font-black pt-1 block">
                                {language === 'en' ? 'Grand Total Paid: ' : 'সর্বমোট পরিশোধিত: '}
                                <span className="text-red-655 text-base font-black">৳{order.total.toLocaleString()}</span>
                              </p>
                            </div>
                          </div>

                          {/* CARRIER SMS UPDATES SIMULATION & HELP ASSISTANT CHAT LINK */}
                          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center bg-white border border-zinc-200 p-3 rounded-xl gap-3">
                            
                            {/* Carrier SMS Opt-in */}
                            <label className="flex items-center gap-2.5 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={isSmsEnabled}
                                onChange={() => handleSmsToggle(order.id)}
                                className="w-4 h-4 text-red-600 bg-zinc-50 border-zinc-300 rounded focus:ring-red-500 cursor-pointer"
                              />
                              <div className="text-left">
                                <p className="text-[11px] font-black text-zinc-800">
                                  {language === 'en' ? 'Get Instant Courier SMS updates' : 'মোবাইলে এসএমএস এলার্ট চালু করুন'}
                                </p>
                                <p className="text-[9.5px] text-zinc-400 font-extrabold">
                                  {language === 'en' ? 'Receive text alerts for dispatch & delivery' : 'শিপমেন্ট ও ট্র্যাকিং স্ট্যাটাস পাবেন সাথে সাথে'}
                                </p>
                              </div>
                            </label>

                            {/* Help & support trigger */}
                            <div className="flex items-center gap-2 self-end sm:self-center">
                              <button
                                onClick={onAiChatOpen}
                                type="button"
                                className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-650 px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wide transition cursor-pointer flex items-center gap-1"
                              >
                                <MessageSquare size={12} />
                                <span>{language === 'en' ? 'Live AI Help' : 'ডেলিভারি এআই সাপোর্ট'}</span>
                              </button>

                              <a
                                href="tel:01518489080"
                                className="bg-zinc-900 hover:bg-zinc-800 text-white px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wide transition flex items-center gap-1"
                              >
                                <PhoneCall size={12} />
                                <span>{language === 'en' ? 'Call Seller' : 'সরাসরি ফোন দিন'}</span>
                              </a>
                            </div>

                          </div>

                          {/* Opt-in Confirmation Feedback */}
                          {isSmsEnabled && (
                            <div className="bg-emerald-50 text-emerald-805 border border-emerald-200 text-[10.5px] font-bold p-3 rounded-xl flex items-center gap-2 animate-pulse leading-none text-left">
                              <Bell size={13} className="text-emerald-600 animate-bounce" />
                              <span>
                                {language === 'en' 
                                  ? `SMS tracking registered for mobile: ${order.shippingAddress.phone}`
                                  : `কুরিয়ার এসএমএস ট্র্যাকিং নম্বর (${order.shippingAddress.phone}) সফলভাবে নিবন্ধিত হয়েছে।`}
                              </span>
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
