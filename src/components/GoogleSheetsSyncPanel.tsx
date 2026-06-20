/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { Database, RefreshCw, CheckCircle, AlertCircle, ExternalLink, ShieldCheck, HelpCircle, FileText, Settings, Key } from 'lucide-react';
import firebaseConfig from '../../firebase-applet-config.json';
import { Product, Order } from '../types';

// Safe singleton instantiation for Firebase Auth
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

interface GoogleSheetsSyncPanelProps {
  language: 'en' | 'bn';
  orders: Order[];
  products: Product[];
  vouchers: any[];
}

export default function GoogleSheetsSyncPanel({ language, orders, products, vouchers }: GoogleSheetsSyncPanelProps) {
  const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem('gs_sheets_token'));
  const [user, setUser] = useState<any>(null);
  const [spreadsheetId, setSpreadsheetId] = useState<string>(() => localStorage.getItem('gs_spreadsheet_id') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Notice systems
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [lastSyncDate, setLastSyncDate] = useState<string>(() => localStorage.getItem('gs_last_sync') || 'Never');

  // Listen to Auth State to restore profile if token exists
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      if (u && accessToken) {
        setUser(u);
      } else {
        setUser(null);
      }
    });
    return () => unsub();
  }, [accessToken]);

  // Load spreadsheet id from site settings on mounting
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch('/api/site-settings');
        if (res.ok) {
          const settings = await res.json();
          if (settings.google_spreadsheet_id) {
            setSpreadsheetId(settings.google_spreadsheet_id);
            localStorage.setItem('gs_spreadsheet_id', settings.google_spreadsheet_id);
          }
          if (settings.google_last_sync) {
            setLastSyncDate(settings.google_last_sync);
            localStorage.setItem('gs_last_sync', settings.google_last_sync);
          }
        }
      } catch (err) {
        console.error("Failed loading sheets settings:", err);
      }
    };
    loadSettings();
  }, []);

  const handleConnectGoogle = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const provider = new GoogleAuthProvider();
      // Ensure specific sheets permission is requested
      provider.addScope('https://www.googleapis.com/auth/spreadsheets');
      
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      
      if (!token) {
        throw new Error(language === 'en' ? 'Failed to retrieve access token' : 'অ্যাক্সেস টোকেন পাওয়া যায়নি');
      }

      setAccessToken(token);
      localStorage.setItem('gs_sheets_token', token);
      setUser(result.user);
      
      setSuccessMsg(language === 'en' ? 'Connected successfully with Google API!' : 'গুগল এপিআই দিয়ে কনেকশন সফল হয়েছে!');
    } catch (err: any) {
      console.error("Auth error:", err);
      setErrorMsg(err.message || 'Google Auth Connection Failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await signOut(auth);
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem('gs_sheets_token');
      setSuccessMsg(language === 'en' ? 'Disconnected successfully' : 'কনেকশন বিচ্ছিন্ন করা হয়েছে');
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleCreateNewSheet = async () => {
    if (!accessToken) {
      setErrorMsg(language === 'en' ? 'Please connect to Google first' : 'দয়া করে প্রথমে গুগল কানেক্ট করুন');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: {
            title: 'Ghoroya Bazar - Systems Management Sheet'
          },
          sheets: [
            { properties: { title: 'Orders' } },
            { properties: { title: 'Products' } },
            { properties: { title: 'Vouchers' } }
          ]
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error?.message || 'Failed to generate spreadsheet');
      }

      const data = await res.json();
      const generatedId = data.spreadsheetId;
      setSpreadsheetId(generatedId);
      localStorage.setItem('gs_spreadsheet_id', generatedId);

      // Create column templates
      await initSheetHeaders(generatedId);
      
      // Save ID securely into the Firestore backend site_settings so all administrators share the sheet!
      await saveSpreadsheetIdToBackend(generatedId);

      setSuccessMsg(language === 'en' 
        ? 'Automatic Bootstrap Done! Created "Ghoroya Bazar" Spreadsheet successfully.' 
        : 'সফলভাবে "Ghoroya Bazar" গুগল স্প্রেডশিট তৈরি করা হয়েছে!'
      );
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Could not bootstrap new sheet');
    } finally {
      setIsLoading(false);
    }
  };

  const saveSpreadsheetIdToBackend = async (idOfSheet: string) => {
    try {
      const settingsRes = await fetch('/api/site-settings');
      let currentSettings = {
        delivery_inside_dhaka: 80,
        delivery_outside_dhaka: 150,
        delivery_groceries_charge: 80,
        delivery_package_charge: 90,
        delivery_fresh_groceries_charge: 100
      };
      if (settingsRes.ok) {
        const parsed = await settingsRes.json();
        currentSettings = { ...currentSettings, ...parsed };
      }

      const payload = {
        ...currentSettings,
        google_spreadsheet_id: idOfSheet
      };

      await fetch('/api/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error("Failed saving sheets setting to backend:", err);
    }
  };

  const handleManualSaveId = async () => {
    if (!spreadsheetId.trim()) return;
    setIsLoading(true);
    await saveSpreadsheetIdToBackend(spreadsheetId.trim());
    localStorage.setItem('gs_spreadsheet_id', spreadsheetId.trim());
    setSuccessMsg(language === 'en' ? 'Spreadsheet ID saved successfully!' : 'স্প্রেডশিট আইডি সফলভাবে সংরক্ষণ করা হয়েছে!');
    setIsLoading(false);
  };

  const initSheetHeaders = async (sid: string) => {
    const rangesData = [
      {
        range: 'Orders!A1:N1',
        values: [[
          'Order ID', 'Date', 'Customer Name', 'Phone', 'City', 'Address', 
          'Product Items', 'Total Price (৳)', 'Courier Name', 'Order Status', 
          'Reseller Shop/Name', 'Reseller Profit (৳)', 'Is Reseller Order?', 'Payment Account Used'
        ]]
      },
      {
        range: 'Products!A1:G1',
        values: [[
          'Product ID', 'Product Code', 'Title (English)', 'Title (Bengali)', 
          'Selling Price (৳)', 'Store Purchase Price (৳)', 'Current Stock Qty'
        ]]
      },
      {
        range: 'Vouchers!A1:D1',
        values: [[
          'Coupon Code', 'Discount Amount (৳)', 'Discount Type (Flat/Pct)', 'Promo Description'
        ]]
      }
    ];

    for (const dataItem of rangesData) {
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sid}/values/${dataItem.range}?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values: dataItem.values })
      });
    }
  };

  const handleSyncDatabases = async () => {
    if (!accessToken) {
      setErrorMsg(language === 'en' ? 'Please connect with Google first' : 'দয়া করে আগে গুগল লাইভ কানেক্ট করুন');
      return;
    }
    if (!spreadsheetId.trim()) {
      setErrorMsg(language === 'en' ? 'Valid Spreadsheet ID is missing' : 'স্প্রেডশিট আইডি পাওয়া যায়নি');
      return;
    }

    setIsSyncing(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const sid = spreadsheetId.trim();

      // Clear existing records dynamically to overwrite securely
      const sheetsToClear = ['Orders!A2:N2000', 'Products!A2:G2000', 'Vouchers!A2:D2000'];
      for (const scope of sheetsToClear) {
        await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sid}/values/${scope}:clear`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
      }

      // 1. Map Orders
      const mappedOrders = orders.map(ord => {
        const itemLog = (ord.items || []).map(i => `${i.product?.nameBn || i.product?.name || 'Item'} (x${i.quantity || 1})`).join(', ');
        return [
          ord.id || 'N/A',
          ord.date || 'N/A',
          ord.shippingAddress?.name || 'Guest Customer',
          ord.shippingAddress?.phone || 'N/A',
          ord.shippingAddress?.city || 'N/A',
          ord.shippingAddress?.address || 'N/A',
          itemLog,
          ord.total || 0,
          ord.courierName || 'SteadFast',
          ord.statusBn || ord.status || 'Pending',
          ord.resellerPhone || 'N/A',
          ord.resellerProfit || 0,
          ord.isResellerOrder ? 'Yes' : 'No',
          ord.paymentMethod || 'Cash On Delivery'
        ];
      });

      // 2. Map Products
      const mappedProducts = products.map(prod => [
        prod.id || '',
        prod.code || '',
        prod.name || '',
        prod.nameBn || '',
        prod.price || 0,
        prod.purchasePrice || Math.round(prod.price * 0.7),
        prod.stock ?? 0
      ]);

      // 3. Map Vouchers
      const mappedVouchers = vouchers.map(voc => [
        voc.code || '',
        voc.discount || 0,
        voc.type || 'flat',
        voc.description || voc.descriptionBn || ''
      ]);

      // Write values using single range PUT operations
      if (mappedOrders.length > 0) {
        await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sid}/values/Orders!A2?valueInputOption=USER_ENTERED`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ values: mappedOrders })
        });
      }

      if (mappedProducts.length > 0) {
        await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sid}/values/Products!A2?valueInputOption=USER_ENTERED`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ values: mappedProducts })
        });
      }

      if (mappedVouchers.length > 0) {
        await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sid}/values/Vouchers!A2?valueInputOption=USER_ENTERED`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ values: mappedVouchers })
        });
      }

      // Record Sync Success
      const dateStr = new Date().toLocaleString();
      setLastSyncDate(dateStr);
      localStorage.setItem('gs_last_sync', dateStr);

      // Save back to backend settings so it replicates
      const settingsRes = await fetch('/api/site-settings');
      let currentSettings = {};
      if (settingsRes.ok) {
        currentSettings = await settingsRes.json();
      }
      await fetch('/api/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...currentSettings,
          google_last_sync: dateStr
        })
      });

      setSuccessMsg(language === 'en' 
        ? `Corporate Sync Successful! Exported ${orders.length} orders, ${products.length} products to Google Sheets.` 
        : `সিঙ্ক সম্পূর্ণ হয়েছে! গুগল শিটে ${orders.length}টি অর্ডার এবং ${products.length}টি পণ্য সফলভাবে এক্সপোর্ট হয়েছে।`
      );
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Synchronization request failed, token might be expired. Reconnect.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Informational Hero Card */}
      <div className="bg-white border rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <div className="bg-green-100 p-2.5 rounded-2xl text-green-700 font-extrabold shadow-sm">
              <Database size={20} className="animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-zinc-950 uppercase tracking-tight">
                {language === 'en' ? 'Google Sheets Data Replication System' : 'গুগল শিট লাইভ ডেটা সিঙ্ক গেটওয়ে'}
              </h3>
              <p className="text-[10px] text-zinc-400 font-bold block mt-0.5">PLATFORM INTEGRATION SERVICE</p>
            </div>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed max-w-xl">
            {language === 'en' 
              ? 'Synchronize all sales orders, products list, and promotional campaigns data securely into a multi-tab Google Sheets spreadsheet inside your Google Workspace with permission.'
              : 'আপনার ঘরোয়া বাজারের সমস্ত প্ল্যাটফর্ম ডাটা (যেমন: ক্রেতার অর্ডার, পেমেন্ট অ্যাকাউন্ট, স্টক ক্যাটালগ এবং কুপন কোড) সরাসরি আপনার নিজস্ব গুগল সাইট ড্রাইভে একটি মাত্র ক্লিকে সিঙ্ক করে ফেলুন। অনুমতি সাপেক্ষে সরাসরি ড্রাইভের স্প্রেডশিটে এটি সংরক্ষিত হবে।'}
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 border border-zinc-200 bg-zinc-50 p-4 rounded-2.5xl min-w-[200px] shrink-0 text-center select-none">
          <div className="flex items-center gap-1">
            <span className={`w-2.5 h-2.5 rounded-full ${accessToken ? 'bg-green-500 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-zinc-500">API Gateway Status</span>
          </div>
          <p className="text-xs font-extrabold text-zinc-900">{accessToken ? (language === 'en' ? 'Connected' : 'কানেক্টেড') : (language === 'en' ? 'Google Auth Needed' : 'অফলাইন')}</p>
          <div className="text-[9px] text-zinc-400 font-mono mt-1">
            {language === 'en' ? 'Last Synced:' : 'সর্বশেষ সিঙ্ক:'} <span className="text-zinc-950 font-black">{lastSyncDate}</span>
          </div>
        </div>
      </div>

      {/* Warnings & Success notices */}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-2xl p-4 flex items-start gap-2.5 text-xs font-bold shadow-sm">
          <CheckCircle className="shrink-0 text-green-600 mt-0.5" size={16} />
          <div>{successMsg}</div>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-900 rounded-2xl p-4 flex items-start gap-2.5 text-xs font-bold shadow-sm">
          <AlertCircle className="shrink-0 text-red-600 mt-0.5" size={16} />
          <div>{errorMsg}</div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Step 1: Authentication */}
        <div className="bg-white border rounded-3xl p-5 shadow-sm md:col-span-4 space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <Key size={16} className="text-red-500" />
            <h4 className="font-extrabold text-xs text-zinc-900 uppercase">
              {language === 'en' ? '1. Google API Secure' : '১. গুগল ওথ কনেকশন'}
            </h4>
          </div>

          <p className="text-[11px] text-zinc-500 leading-normal font-medium">
            {language === 'en'
              ? 'Authenticate to unlock spreadsheets scopes to append or modify sheets data.'
              : 'আপনার গুগল ড্রাইভের শিটে অর্ডার লিখার জন্য গুগলের সিকিউর অথরাইজেশন মোড এনাবেল করতে নিচের বাটনে ক্লিক করুন।'}
          </p>

          {user ? (
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center gap-2.5 bg-zinc-50 p-2.5 rounded-xl border border-zinc-150">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Admin" referrerPolicy="no-referrer" className="w-8 h-8 rounded-full shadow-inner tracking-tight" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-xs">A</div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-zinc-900 truncate">{user.displayName || 'Enterprise Admin'}</p>
                  <p className="text-[9px] text-zinc-400 truncate">{user.email || 'admin@workspace.com'}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDisconnect}
                className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs py-2.5 rounded-xl font-bold transition cursor-pointer"
              >
                {language === 'en' ? 'Disconnect Google Account' : 'ভিন্ন গুগল অ্যাকাউন্ট যুক্ত করুন'}
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnectGoogle}
              disabled={isLoading}
              className="w-full bg-red-650 hover:bg-red-700 text-white text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-bold transition shadow-md shadow-red-600/10 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="animate-spin" size={14} />
                  <span>{language === 'en' ? 'Authorizing...' : 'অনুমোদন নেওয়া হচ্ছে...'}</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.529-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-11 0-.746-.08-1.32-.176-1.9H12.24z"/>
                  </svg>
                  <span>{language === 'en' ? 'Connect with Google Workspace' : 'গুগল স্পেস কনেক্ট করুন'}</span>
                </>
              )}
            </button>
          )}

          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 p-2.5 rounded-xl text-[10px] font-bold">
            <ShieldCheck size={14} className="shrink-0 text-emerald-600" />
            <span>{language === 'en' ? 'OAuth scopes will expire in 60 minutes.' : 'গুগুল ওথ সেশনের মেয়াদ ৬০ মিনিট কার্যকর থাকে।'}</span>
          </div>
        </div>

        {/* Step 2: Spreadsheet Configuration */}
        <div className="bg-white border rounded-3xl p-5 shadow-sm md:col-span-8 space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-2">
              <Settings size={16} className="text-zinc-500" />
              <h4 className="font-extrabold text-xs text-zinc-900 uppercase">
                {language === 'en' ? '2. Spreadsheet ID Mapping & Creation' : '২. গুগল ড্রাইভ স্প্রেডশিট কনফিগারেশন'}
              </h4>
            </div>
          </div>

          <div className="space-y-3 font-semibold text-xs text-zinc-700">
            <div>
              <label className="block mb-1 text-[11px] font-black text-zinc-600">
                {language === 'en' ? 'Spreadsheet ID (or Google sheet entire URL)' : 'গুগল স্প্রেডশিট আইডি (অথবা শিটের সম্পূর্ণ লিংক)'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 1a2b3c4d5e6f..."
                  value={spreadsheetId}
                  onChange={e => {
                    // Extract ID if a full Google Sheets URL is pasted
                    const text = e.target.value;
                    const urlRegex = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
                    const matched = text.match(urlRegex);
                    if (matched && matched[1]) {
                      setSpreadsheetId(matched[1]);
                    } else {
                      setSpreadsheetId(text);
                    }
                  }}
                  className="flex-1 bg-zinc-50 border border-zinc-250 p-2.5 rounded-xl text-zinc-950 font-mono text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={handleManualSaveId}
                  disabled={!spreadsheetId.trim() || isLoading}
                  className="bg-zinc-900 hover:bg-black text-white text-xs px-4 py-2.5 rounded-xl font-bold transition disabled:opacity-50 cursor-pointer"
                >
                  {language === 'en' ? 'Save ID' : 'আইডি সেভ'}
                </button>
              </div>
            </div>

            <div className="bg-zinc-50/55 rounded-2xl p-4 border border-zinc-150 space-y-3.5">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block">⚡ {language === 'en' ? 'Alternative: Automated Quick Bootstrap' : 'বিকল্প পদ্ধতি: অটোমেটিক শিট জেনারেটর'}</span>
              <p className="text-[11px] text-zinc-500 leading-normal">
                {language === 'en'
                  ? 'If you do not have an existing sheet, our system can instantly build a beautifully formatted Google Spreadsheet in your Google Drive with dedicated default tabs.'
                  : 'আপনার যদি কোনো স্প্রেডশিট তৈরি করা না থাকে, তবে এই বাটনে চাপ দিন। আপনার এপিআই ব্যবহার করে আমরা আপনার গুগল ড্রাইভে "Ghoroya Bazar" নামে একটি চমৎকার মাল্টি-ট্যাব শিট তৈরি করে দেব।'}
              </p>
              
              <button
                type="button"
                onClick={handleCreateNewSheet}
                disabled={!accessToken || isLoading}
                className="bg-emerald-650 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (language === 'en' ? 'Generating...' : 'তৈরি হচ্ছে...') : (language === 'en' ? '✨ Create New Google Sheet' : '✨ নতুন গুগল শিট অটো-তৈরি করুন')}
              </button>
            </div>

            {spreadsheetId && (
              <div className="pt-2 flex items-center justify-between border-t border-zinc-100">
                <a
                  href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-zinc-900 hover:text-green-700 hover:underline transition font-bold text-[11px]"
                >
                  <FileText size={14} className="text-zinc-500" />
                  <span>{language === 'en' ? 'Open Selected Google Spreadsheet' : 'গুগল স্প্রেডশিট ফাইলটি ওপেন করুন'}</span>
                  <ExternalLink size={10} />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sync Matrix Center */}
      <div className="bg-white border rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-1 text-sm border-b pb-3">
          <RefreshCw size={18} className="text-green-600 shrink-0" />
          <h4 className="font-extrabold text-zinc-950 uppercase tracking-tight">
            {language === 'en' ? '3. System Data Sync Center & Multi-tab Overview' : '৩. রিডিং ও সিঙ্ক্রোনাইজেশন ম্যাট্রিক্স কন্ট্রোল'}
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-2xl p-4 bg-zinc-50/50 flex items-center gap-3">
            <div className="p-2.5 bg-sky-100 rounded-xl text-sky-700 font-bold">📂</div>
            <div className="min-w-0">
              <h5 className="text-[10px] uppercase font-black text-zinc-400">{language === 'en' ? 'Sales Orders Log' : 'ক্রেতাদের কাস্টমার অর্ডার'}</h5>
              <p className="text-base font-extrabold text-zinc-950 mt-0.5">{orders.length} <span className="text-[10px] text-zinc-400 font-bold">Rows</span></p>
            </div>
          </div>

          <div className="border rounded-2xl p-4 bg-zinc-50/50 flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 rounded-xl text-blue-700 font-bold">📦</div>
            <div className="min-w-0">
              <h5 className="text-[10px] uppercase font-black text-zinc-400">{language === 'en' ? 'Products Catalog' : 'হালনাগাদ কৃত পণ্য তালিকা'}</h5>
              <p className="text-base font-extrabold text-zinc-950 mt-0.5">{products.length} <span className="text-[10px] text-zinc-400 font-bold">Rows</span></p>
            </div>
          </div>

          <div className="border rounded-2xl p-4 bg-zinc-50/50 flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 rounded-xl text-amber-700 font-bold">🎟️</div>
            <div className="min-w-0">
              <h5 className="text-[10px] uppercase font-black text-zinc-400">{language === 'en' ? 'Promo & Vouchers' : 'সচল ডিসকাউন্ট কুপন'}</h5>
              <p className="text-base font-extrabold text-zinc-950 mt-0.5">{vouchers.length} <span className="text-[10px] text-zinc-400 font-bold">Rows</span></p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-zinc-100">
          <div className="text-[11px] text-zinc-500 font-medium">
            💡 {language === 'en' 
              ? 'Clicking Sync will reinitialize sheets, replace all lines gracefully with database records.'
              : 'সিঙ্ক করুন বাটনে ক্লিক করলে আপনার স্প্রেডশিটের পূর্বের রেকর্ডগুলো মুছে সম্পূর্ণ নতুনভাবে সকল ডেটা সারিবদ্ধ করা হবে।'}
          </div>

          <button
            type="button"
            onClick={handleSyncDatabases}
            disabled={isSyncing || isLoading || !accessToken || !spreadsheetId}
            className="w-full sm:w-auto bg-green-650 hover:bg-green-700 text-white font-extrabold text-xs py-3 px-8 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-green-600/10 disabled:opacity-50"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="animate-spin" size={14} />
                <span>{language === 'en' ? 'Exporting Logs...' : 'তথ্য আপলোড হচ্ছে...'}</span>
              </>
            ) : (
              <>
                <span>🔄</span>
                <span>{language === 'en' ? 'Launch Sync to Google Sheets Now' : 'সব ডেটা গুগল শিটে সিঙ্ক করুন'}</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
