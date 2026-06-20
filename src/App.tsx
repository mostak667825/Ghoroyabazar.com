/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, ShoppingBag, ClipboardList, AlertCircle, ShoppingCart, X, Truck, User, Sparkles, Briefcase } from 'lucide-react';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import CategoryList from './components/CategoryList';
import FlashSale from './components/FlashSale';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import MyOrdersModal from './components/MyOrdersModal';
import AIShoppingAssistant from './components/AIShoppingAssistant';
import SellerDashboardModal from './components/SellerDashboardModal';
import SellerPinModal from './components/SellerPinModal';
import WishlistModal from './components/WishlistModal';
import TrustFeatures from './components/TrustFeatures';
import RecentlyViewed from './components/RecentlyViewed';
import PersonalizedOffers from './components/PersonalizedOffers';
import { Product, CartItem, Order } from './types';
import { PRODUCTS, VOUCHERS } from './data/products';
import ResellerPortalModal from './components/ResellerPortalModal';
import SubcategoryFolders from './components/SubcategoryFolders';
import TrackOrderModal from './components/TrackOrderModal';

export default function App() {
  const [language, setLanguage] = useState<'en' | 'bn'>('bn');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');

  useEffect(() => {
    setSelectedSubcategory('all');
  }, [selectedCategory]);

  const [sortBy, setSortBy] = useState<string>('default');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyDiscounts, setOnlyDiscounts] = useState<boolean>(false);

  // Load dynamic inventory and coupons from state / localStorage
  const [productsList, setProductsList] = useState<Product[]>(() => {
    const cached = localStorage.getItem('ghoroya_products');
    return cached ? JSON.parse(cached) : PRODUCTS;
  });

  const [vouchersList, setVouchersList] = useState<any[]>(() => {
    const cached = localStorage.getItem('ghoroya_vouchers');
    return cached ? JSON.parse(cached) : VOUCHERS;
  });

  // Load persistence states
  const [cart, setCart] = useState<CartItem[]>(() => {
    const cached = localStorage.getItem('daraz_cart');
    return cached ? JSON.parse(cached) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const cached = localStorage.getItem('daraz_orders');
    return cached ? JSON.parse(cached) : [];
  });

  const [typedProductCode, setTypedProductCode] = useState('');

  // Dynamic administrative site settings (Inside/Outside Dhaka delivery and special categories)
  const [siteSettings, setSiteSettings] = useState({
    delivery_inside_dhaka: 80,
    delivery_outside_dhaka: 150,
    delivery_groceries_charge: 80,
    delivery_package_charge: 90,
    delivery_fresh_groceries_charge: 100
  });

  const [resellerContext, setResellerContext] = useState<any>(null);

  // Complete live database hydration on mount
  useEffect(() => {
    const hydrateDatabases = async () => {
      try {
        const [prodRes, ordRes, vocRes, setRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/orders'),
          fetch('/api/vouchers'),
          fetch('/api/site-settings')
        ]);
        
        if (prodRes.ok) {
          const prods = await prodRes.json();
          if (prods && prods.length > 0) setProductsList(prods);
        }
        if (ordRes.ok) {
          const ords = await ordRes.json();
          setOrders(ords);
        }
        if (vocRes.ok) {
          const vocs = await vocRes.json();
          if (vocs && vocs.length > 0) setVouchersList(vocs);
        }
        if (setRes.ok) {
          const settings = await setRes.json();
          if (settings) setSiteSettings(settings);
        }

        // Parse custom reseller code from URL /r/RS1025 or query search params
        const pathname = window.location.pathname;
        const match = pathname.match(/^\/r\/([A-Za-z0-9_-]+)/);
        const code = match ? match[1] : new URLSearchParams(window.location.search).get('r');
        if (code) {
          const lookupRes = await fetch(`/api/resellers/lookup/${code}`);
          if (lookupRes.ok) {
            const data = await lookupRes.json();
            if (data && data.reseller) {
              setResellerContext(data.reseller);
              document.title = data.reseller.shopName || `${data.reseller.name} - Reseller Catalog | Ghoroya Bazar`;
            }
          }
        }
      } catch (err) {
        console.error("Failed to hydrate databases from server filesystem:", err);
      }
    };
    hydrateDatabases();
  }, []);

  // Drawer & modal states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isSellerPinOpen, setIsSellerPinOpen] = useState(false);
  const [isSellerOpen, setIsSellerOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isResellerPortalOpen, setIsResellerPortalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Success states
  const [recentOrderSuccess, setRecentOrderSuccess] = useState<Order | null>(null);
  const [appliedVoucherCode, setAppliedVoucherCode] = useState('');

  // Dark Mode State with cache synchronization
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ghoroya_dark_mode') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('ghoroya_dark_mode', String(isDarkMode));
    } catch (e) {
      console.error(e);
    }
  }, [isDarkMode]);

  // Wishlist locally persisted state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const cached = localStorage.getItem('ghoroya_wishlist');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('ghoroya_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Recently Viewed Products persisted locally
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ghoroya_recently_viewed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleClearRecent = () => {
    setRecentlyViewedIds([]);
    localStorage.removeItem('ghoroya_recently_viewed');
  };

  // Tracking viewed products inside selectedProduct trigger
  useEffect(() => {
    if (selectedProduct) {
      setRecentlyViewedIds((prev) => {
        const filtered = prev.filter((id) => id !== selectedProduct.id);
        const updated = [selectedProduct.id, ...filtered].slice(0, 8);
        localStorage.setItem('ghoroya_recently_viewed', JSON.stringify(updated));
        return updated;
      });
    }
  }, [selectedProduct]);

  // Smart AI Search State
  const [aiSearchState, setAiSearchState] = useState<{
    explanation: string;
    explanationBn: string;
    matchedProductIds: string[];
    suggestedKeywords: string[];
  } | null>(null);
  const [isSmartSearchLoading, setIsSmartSearchLoading] = useState(false);

  const handleSmartSearch = async (query: string) => {
    if (!query.trim()) return;
    setIsSmartSearchLoading(true);
    setSearchQuery(query);
    setAiSearchState(null);
    try {
      const response = await fetch('/api/gemini/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, language }),
      });
      const data = await response.json();
      if (data && data.matchedProductIds) {
        setAiSearchState(data);
      }
    } catch (err) {
      console.error('Failed to run AI Smart search:', err);
    } finally {
      setIsSmartSearchLoading(false);
    }
  };

  // Revert AI search state if query is changed manually
  useEffect(() => {
    setAiSearchState(null);
  }, [searchQuery]);

  // Handle custom product selection events from nested modules
  useEffect(() => {
    const handleSelectProductEvent = (e: Event) => {
      const customEvent = e as CustomEvent<Product>;
      if (customEvent.detail) {
        setSelectedProduct(customEvent.detail);
      }
    };
    window.addEventListener('ghoroya_select_product', handleSelectProductEvent);
    return () => window.removeEventListener('ghoroya_select_product', handleSelectProductEvent);
  }, []);

  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Sync cache
  useEffect(() => {
    localStorage.setItem('ghoroya_products', JSON.stringify(productsList));
  }, [productsList]);

  useEffect(() => {
    localStorage.setItem('ghoroya_vouchers', JSON.stringify(vouchersList));
  }, [vouchersList]);

  // Save cart modifications to cache
  useEffect(() => {
    localStorage.setItem('daraz_cart', JSON.stringify(cart));
  }, [cart]);

  // Save orders modifications to cache
  useEffect(() => {
    localStorage.setItem('daraz_orders', JSON.stringify(orders));
  }, [orders]);

  // Actions
  const handleAddToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          (!color || item.selectedColor === color) &&
          (!size || item.selectedSize === size)
      );

      if (idx > -1) {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          quantity: Math.min(next[idx].quantity + quantity, product.stock)
        };
        return next;
      } else {
        return [...prev, { product, quantity, selectedColor: color, selectedSize: size }];
      }
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.stock) }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleDirectBuyNow = (product: Product, quantity = 1, color?: string, size?: string) => {
    // Clear cart or inject item and prompt checkout instantly
    const targetItem: CartItem = { product, quantity, selectedColor: color, selectedSize: size };
    setCart([targetItem]);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleTriggerCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderCompletion = async (completedOrder: Order) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completedOrder)
      });
      if (res.ok) {
        const savedOrder = await res.json();
        setOrders((prev) => [savedOrder, ...prev]);
        setCart([]); // Clear Cart upon successful payment
        setAppliedVoucherCode('');
        setIsCheckoutOpen(false);
        setRecentOrderSuccess(savedOrder);

        // Auto-refresh the system-wide product stock counts dynamically
        const prodRes = await fetch('/api/products');
        if (prodRes.ok) {
          const updated = await prodRes.json();
          setProductsList(updated);
        }

        // Auto close success layout after 8 seconds
        setTimeout(() => {
          setRecentOrderSuccess(null);
        }, 8000);
      } else {
        throw new Error('Order submission failed on server');
      }
    } catch (err) {
      console.error("Failed saving order to central database", err);
      // Clean local fallback
      setOrders((prev) => [completedOrder, ...prev]);
      setCart([]);
      setAppliedVoucherCode('');
      setIsCheckoutOpen(false);
      setRecentOrderSuccess(completedOrder);
    }
  };

  const handleMockStatusUpdate = async (
    orderId: string, 
    status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled', 
    updatedAmount?: number,
    courierName?: string,
    courierTrackingId?: string,
    additionalFields?: any
  ) => {
    try {
      const existingOrder = orders.find((o) => o.id === orderId);
      if (existingOrder) {
        // Enforce update with custom delivery-adjusted amount if edited by Admin
        let statusBnValue = 'অপেক্ষমাণ';
        if (status === 'Delivered') statusBnValue = 'ডেলিভারড';
        else if (status === 'Shipped') statusBnValue = 'শিপড';
        else if (status === 'Confirmed') statusBnValue = 'নিশ্চিত';
        else if (status === 'Cancelled') statusBnValue = 'বাতিল';

        const adjustedOrder = {
          ...existingOrder,
          status,
          statusBn: statusBnValue,
          ...(updatedAmount !== undefined ? { total: updatedAmount } : {}),
          ...(courierName !== undefined ? { courierName } : {}),
          ...(courierTrackingId !== undefined ? { courierTrackingId } : {}),
          ...additionalFields
        };

        // If shipping charge was changed, update the order total correspondingly
        if (additionalFields && additionalFields.shippingCharge !== undefined) {
          const oldCharge = existingOrder.shippingCharge || 0;
          const newCharge = additionalFields.shippingCharge || 0;
          adjustedOrder.total = existingOrder.total - oldCharge + newCharge;
        }

        const res = await fetch(`/api/orders/${orderId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(adjustedOrder)
        });
        if (res.ok) {
          const saved = await res.json();
          setOrders((prev) => prev.map((o) => o.id === orderId ? saved : o));
        }
      }
    } catch (err) {
      console.error("Failed order update on database", err);
      // Local fallback
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status,
                statusBn: status === 'Delivered' ? 'ডেলিভারড' : status === 'Shipped' ? 'শিপড' : status === 'Confirmed' ? 'নিশ্চিত' : status === 'Cancelled' ? 'বাতিল' : 'অপেক্ষমাণ',
                ...(updatedAmount !== undefined ? { total: updatedAmount } : {}),
                ...(courierName !== undefined ? { courierName } : {}),
                ...(courierTrackingId !== undefined ? { courierTrackingId } : {})
              }
            : o
        )
      );
    }
  };

  // Filter & Sort Catalog Products
  const filteredProducts = productsList
    .filter((product) => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      
      const matchesSubcategory = selectedSubcategory === 'all' || product.subcategory === selectedSubcategory;

      const matchesSearch = aiSearchState
        ? aiSearchState.matchedProductIds.includes(product.id)
        : (!searchQuery.trim() ||
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.nameBn.includes(searchQuery) ||
          (product.code && product.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.descriptionBn.includes(searchQuery));

      const matchesStock = !onlyInStock || product.stock > 0;
      
      const matchesDiscount = !onlyDiscounts || 
        (product.originalPrice && product.originalPrice > product.price) || 
        (product.discountPrice && product.discountPrice > 0);

      let matchesPrice = true;
      if (priceRange === 'under500') {
        matchesPrice = product.price < 500;
      } else if (priceRange === '500to2000') {
        matchesPrice = product.price >= 500 && product.price <= 2000;
      } else if (priceRange === '2000to10000') {
        matchesPrice = product.price >= 2000 && product.price <= 10000;
      } else if (priceRange === 'above10000') {
        matchesPrice = product.price > 10000;
      }

      return matchesCategory && matchesSubcategory && matchesSearch && matchesStock && matchesDiscount && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'priceAsc') {
        return a.price - b.price;
      } else if (sortBy === 'priceDesc') {
        return b.price - a.price;
      } else if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }
      return 0; // default order / original order
    });

  return (
    <div className="bg-zinc-50 min-h-screen text-zinc-800 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Sticky Header Top Bar */}
      <Header
        language={language}
        setLanguage={setLanguage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cart={cart}
        setIsCartOpen={setIsCartOpen}
        setIsOrdersOpen={setIsOrdersOpen}
        setIsAiChatOpen={setIsAiChatOpen}
        onSellerOpen={() => setIsSellerPinOpen(true)}
        onResellerOpen={() => setIsResellerPortalOpen(true)}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        products={productsList}
        onProductClick={setSelectedProduct}
        onWishlistOpen={() => setIsWishlistOpen(true)}
        wishlistLength={wishlist.length}
        onSmartSearch={handleSmartSearch}
        isSmartSearchLoading={isSmartSearchLoading}
        onTrackOrderOpen={() => setIsTrackOrderOpen(true)}
      />

      {/* Main page layout */}
      <main className="flex-1 pb-24 md:pb-16">
        {resellerContext && (
          <div className="bg-gradient-to-r from-orange-600 to-red-650 text-white font-sans shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-white/25 rounded-full flex items-center justify-center font-black text-white text-base">
                  🛒
                </div>
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm md:text-base leading-tight">
                    {language === 'en' 
                      ? `Welcome to ${resellerContext.shopName || resellerContext.name}'s Custom Storefront!` 
                      : `স্বাগতম! আপনি ${resellerContext.shopName || resellerContext.name} এর নিজস্ব ক্যাটালাগে আছেন!`}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-white/90">
                    {language === 'en'
                      ? "Official Ghoroya Bazar Reseller. Ghoroya Bazar handles high-quality packaging & Cash on Delivery shipping for you."
                      : "অফিসিয়াল ঘরোয়া বাজার রিসেলার। ঘরোয়া বাজার আমাদের প্যাকিং, ডেলিভারি ও দ্রুত প্রসেসিং স্বয়ংক্রিয়ভাবে সম্পাদন করে।"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white font-bold text-[9px] sm:text-xs rounded-xl self-start sm:self-auto uppercase tracking-wider">
                  Code: {resellerContext.referralCode || `RS${resellerContext.phone.slice(-4)}`}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Banner Carousel */}
        {!searchQuery && selectedCategory === 'all' && (
          <HeroBanner language={language} setIsAiChatOpen={setIsAiChatOpen} />
        )}

        {/* Categories Bar */}
        <CategoryList
          language={language}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Subcategories (Item-wise Folders) displayed for Electronics / Fashion */}
        <SubcategoryFolders
          language={language}
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          setSelectedSubcategory={setSelectedSubcategory}
        />

        {/* Product Code quick lookup with live image */}
        <div className="max-w-7xl mx-auto px-4 mt-6">
          <div className="bg-white border rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-zinc-900 flex items-center gap-2">
                  🔍 {language === 'en' ? 'Product Code Quick Finder (Instant Image)' : 'প্রোডাক্ট কোড ইনস্ট্যান্ট ফাইন্ডার (ছবি সহ)'}
                </h4>
                <p className="text-[10px] text-zinc-400">
                  {language === 'en' ? 'Type any product code (e.g. PD01, PD101) to instantly preview its official image and state.' : 'পণ্য কোড লিখলেই সঙ্গে সঙ্গে ছবি সহ বিস্তারিত বিবরণ লোড হবে।'}
                </p>
              </div>
              <span className="bg-orange-50 text-orange-700 text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full border border-orange-100">
                {language === 'en' ? 'Smart Finder' : 'স্মার্ট ফাইন্ডার'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-4 space-y-1.5">
                <label className="block text-zinc-500 font-bold text-[10px] uppercase">
                  {language === 'en' ? 'Enter Code' : 'প্রোডাক্ট কোড লিখুন'}
                </label>
                <input
                  type="text"
                  placeholder={language === 'en' ? "e.g. PD01" : "যেমন: PD01"}
                  value={typedProductCode}
                  onChange={(e) => setTypedProductCode(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-zinc-900 outline-none font-mono font-bold text-xs"
                />
              </div>

              <div className="md:col-span-8">
                {(() => {
                  const matched = productsList.find(p => p.code?.toLowerCase() === typedProductCode.trim().toLowerCase() || p.id.toLowerCase() === typedProductCode.trim().toLowerCase());
                  if (!typedProductCode.trim()) {
                    return (
                      <p className="text-zinc-400 italic text-[11px] py-1">
                        {language === 'en' ? 'Awaiting product code entry...' : 'কোড টাইপ করার অপেক্ষায়...'}
                      </p>
                    );
                  }
                  if (!matched) {
                    return (
                      <p className="text-red-500 font-bold text-[11px] py-1">
                        ❌ {language === 'en' ? 'No product matches this code.' : 'এই কোডটির সাথে মিলে যাওয়া কোনো পণ্য পাওয়া যায়নি।'}
                      </p>
                    );
                  }
                  return (
                    <div className="bg-orange-50/50 border border-orange-100/60 rounded-2xl p-3 flex gap-4 items-center animate-fade-in">
                      <img
                        src={matched.image}
                        alt={matched.name}
                        className="w-20 h-20 rounded-xl object-cover border border-zinc-200 bg-white"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1 space-y-1 text-xs">
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-850 font-black rounded text-[9px] uppercase tracking-wide">
                          Code: {matched.code || matched.id}
                        </span>
                        <h5 className="font-extrabold text-zinc-900 truncate">
                          {language === 'en' ? matched.name : matched.nameBn}
                        </h5>
                        <p className="text-[10px] text-zinc-500">
                          {language === 'en' ? 'Category: ' : 'ক্যাটাগরি: '} {language === 'en' ? matched.category : matched.categoryBn || matched.category}
                        </p>
                        <div className="flex gap-4 items-center">
                          <span className="text-orange-600 font-extrabold text-xs">
                            ৳{matched.price}
                          </span>
                          <span className={`text-[10px] font-bold ${matched.stock > 0 ? 'text-emerald-600' : 'text-red-650'}`}>
                            {matched.stock > 0 ? `${language === 'en' ? 'Stock: ' : 'স্টক: '} ${matched.stock}টি` : (language === 'en' ? 'Out of Stock' : 'স্টক শেষ')}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          handleAddToCart(matched, 1);
                          setIsCartOpen(true);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-xs rounded-xl hover:opacity-95 shadow cursor-pointer self-center"
                      >
                        {language === 'en' ? 'Add To Cart' : 'ব্যাগে যোগ করুন'}
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Customer-to-Reseller Partner Recruitment dynamic flyer */}
        {orders.length >= 1 && (
          <div className="max-w-7xl mx-auto px-4 mt-6">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-150 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center md:text-left">
                <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-750 font-black text-[9px] uppercase tracking-wider rounded-full">
                  🌟 {language === 'en' ? 'Partner Business Opportunity' : 'রিসেলার পার্টনার সুযোগ'}
                </span>
                <h4 className="font-extrabold text-indigo-950 text-sm md:text-base">
                  {language === 'en' ? 'Share Products & Make Profit! Become an Official Reseller.' : 'প্রোডাক্ট শেয়ার করুন ও লাভ করুন! আজই ঘরোয়া বাজারের অফিসিয়াল রিসেলার হোন।'}
                </h4>
                <p className="text-[11px] text-indigo-650">
                  {language === 'en' ? 'Place orders for your customers and we will pack & deliver of deliveries directly under cash on delivery.' : 'বিনা পুঁজিতে শুরু করুন ব্যবসা। কাস্টমারদের অর্ডার দিন, প্যাকিং ও ডেলিভারি আমরাই সরাসরি করব।'}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsResellerPortalOpen(true);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-750 text-white font-extrabold text-xs rounded-xl hover:shadow h-fit transition cursor-pointer"
              >
                {language === 'en' ? '1-Click Registration' : '১-ক্লিকে রেজিস্ট্রেশন'}
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Countdown Sales Bar */}
        {!searchQuery && selectedCategory === 'all' && (
          <FlashSale
            language={language}
            onProductClick={setSelectedProduct}
            onAddToCart={(p, e) => {
              e.stopPropagation();
              handleAddToCart(p, 1);
            }}
            products={productsList}
          />
        )}

        {/* Global Hub trust Seals */}
        {!searchQuery && selectedCategory === 'all' && (
          <div className="bg-zinc-50/50 border-y border-zinc-200/60 py-10 px-4">
            <div className="max-w-7xl mx-auto">
              <TrustFeatures language={language} layout="grid" />
            </div>
          </div>
        )}

        {/* Personalized AI offers & Recently Viewed history panels displayed when browsing home */}
        {!searchQuery && selectedCategory === 'all' && (
          <div className="max-w-7xl mx-auto px-4 mt-6">
            <PersonalizedOffers
              language={language}
              recentlyViewedIds={recentlyViewedIds}
              cartProductIds={cart.map((item) => item.product.id)}
              onApplyVoucher={(code) => setAppliedVoucherCode(code)}
              appliedVoucherCode={appliedVoucherCode}
            />
            <RecentlyViewed
              recentlyViewedIds={recentlyViewedIds}
              products={productsList}
              onProductClick={setSelectedProduct}
              language={language}
              onClear={handleClearRecent}
            />
          </div>
        )}

        {/* Main "Just For You" list listings section */}
        <div className="px-4 py-8 max-w-7xl mx-auto">
          {/* AI Smart Search matched feedback */}
          {aiSearchState && (
            <div className="bg-gradient-to-tr from-zinc-900 to-zinc-950 border-2 border-red-600 rounded-3xl p-5 sm:p-6 mb-6 text-white shadow-lg animate-fade-in relative overflow-hidden">
              <span className="absolute -right-8 -top-8 w-24 h-24 bg-red-650/20 blur-xl rounded-full" />
              <div className="flex items-center justify-between gap-4 border-b border-zinc-800 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-red-600 text-white font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <span className="animate-pulse">✨</span>
                    {language === 'en' ? 'AI Search Explanation' : 'ঘরোয়া এআই অনুসন্ধান বিবরণী'}
                  </span>
                </div>
                <button
                  onClick={() => setAiSearchState(null)}
                  type="button"
                  className="text-zinc-400 hover:text-white text-xs font-bold flex items-center gap-1 transition"
                  title="Clear AI Results"
                >
                  ✕ {language === 'en' ? 'Reset AI Results' : 'এআই ফলাফল রিসেট'}
                </button>
              </div>

              <p className="text-xs sm:text-sm font-semibold leading-relaxed text-zinc-200">
                💡 {language === 'en' ? aiSearchState.explanation : aiSearchState.explanationBn}
              </p>

              {/* Related tags if any */}
              {aiSearchState.suggestedKeywords && aiSearchState.suggestedKeywords.length > 0 && (
                <div className="mt-4 pt-3.5 border-t border-zinc-800 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">
                    {language === 'en' ? 'Related Ideas / ধারণা সমূহ:' : 'সংশ্লিষ্ট ট্যাগ:'}
                  </span>
                  {aiSearchState.suggestedKeywords.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleSmartSearch(tag)}
                      type="button"
                      className="text-[10px] sm:text-xs font-bold px-3 py-1 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white rounded-xl border border-zinc-800 transition cursor-pointer"
                    >
                      # {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 select-none">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-6 bg-red-650 rounded" />
              <h3 className="text-zinc-900 font-extrabold text-lg sm:text-2xl tracking-tight">
                {searchQuery
                  ? language === 'en'
                    ? `Search results for "${searchQuery}"`
                    : `"${searchQuery}" এর জন্য অনুসন্ধানের ফলাফল`
                  : language === 'en'
                  ? 'Premium Handcrafted Collection'
                  : 'খাঁটি ও প্রিমিয়াম লাইভ পণ্যসমূহ'}
              </h3>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-zinc-500 font-bold bg-zinc-100 px-3 py-1.5 rounded-full border border-zinc-200">
                ✨ {filteredProducts.length} {language === 'en' ? 'products found' : 'টি পণ্য পাওয়া গেছে'}
              </span>
              {(sortBy !== 'default' || priceRange !== 'all' || onlyInStock || onlyDiscounts) && (
                <button
                  onClick={() => {
                    setSortBy('default');
                    setPriceRange('all');
                    setOnlyInStock(false);
                    setOnlyDiscounts(false);
                  }}
                  className="text-xs font-black text-red-655 hover:underline flex items-center gap-1 cursor-pointer bg-red-50 hover:bg-red-100/80 px-3 py-1.5 rounded-full border border-red-100 transition"
                >
                  ✕ {language === 'en' ? 'Reset Filters' : 'ফিল্টার মুছুন'}
                </button>
              )}
            </div>
          </div>

          {/* Interactive filter and sort control row */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-4 mb-6 shadow-sm space-y-4">
            <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
              
              {/* Left Side: Preset Price Range Toggles */}
              <div className="space-y-1.5 flex-1 min-w-[280px]">
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-wider">
                  Price Budget Range / বাজেট লিমিট
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', en: 'All Prices', bn: 'সব মূল্য' },
                    { id: 'under500', en: 'Under ৳500', bn: '৳৫০০ এর নিচে' },
                    { id: '500to2000', en: '৳500 - ৳2,000', bn: '৳৫০০ - ৳২,০০০' },
                    { id: '2000to10000', en: '৳2k - ৳10k', bn: '৳২,০০০ - ৳১০,০০০' },
                    { id: 'above10000', en: 'Above ৳10k', bn: '৳১০,০০০ এর বেশি' }
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setPriceRange(preset.id)}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-xl transition border cursor-pointer select-none ${
                        priceRange === preset.id
                          ? 'bg-zinc-900 border-zinc-900 text-white shadow-sm'
                          : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-600'
                      }`}
                    >
                      {language === 'en' ? preset.en : preset.bn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Side: Sorting select block */}
              <div className="space-y-1.5 md:w-56 w-full shrink-0">
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-wider">
                  Sort By / সাজানোর নিয়ম
                </label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-zinc-50 hover:bg-zinc-150 text-zinc-700 hover:text-zinc-900 font-extrabold text-xs px-3.5 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-red-650 transition cursor-pointer"
                  >
                    <option value="default">{language === 'en' ? '💡 Popularity (Default)' : '💡 জনপ্রিয়তা অনুসারে (ডিফল্ট)'}</option>
                    <option value="priceAsc">{language === 'en' ? '৳ Price: Low to High' : '৳ মূল্য: কম থেকে বেশি'}</option>
                    <option value="priceDesc">{language === 'en' ? '৳ Price: High to Low' : '৳ মূল্য: বেশি থেকে কম'}</option>
                    <option value="rating">{language === 'en' ? '⭐ Customer Rating' : '⭐ সর্বোচ্চ রেটিং অনুসারে'}</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Quick Badges Switch toggles for In Stock & Deals */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-zinc-100">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider mr-2">
                Preferences / বৈশিষ্ট্য‌:
              </span>
              
              <button
                onClick={() => setOnlyInStock(!onlyInStock)}
                className={`text-[11px] font-extrabold px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5 border cursor-pointer select-none ${
                  onlyInStock
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-xs'
                    : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-500'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${onlyInStock ? 'bg-emerald-600 animate-ping' : 'bg-zinc-400'}`} />
                {language === 'en' ? 'In Stock Only' : 'শুধুমাত্র স্টকে আছে'}
              </button>

              <button
                onClick={() => setOnlyDiscounts(!onlyDiscounts)}
                className={`text-[11px] font-extrabold px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5 border cursor-pointer select-none ${
                  onlyDiscounts
                    ? 'bg-red-50 border-red-200 text-red-655 shadow-xs'
                    : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-500'
                }`}
              >
                <span>🔥</span>
                {language === 'en' ? 'Discount Deals & Offers' : 'ডিসকাউন্ট ও অফারসমূহ'}
              </button>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-zinc-150 p-12 text-center rounded-2xl max-w-sm mx-auto flex flex-col items-center gap-3">
              <AlertCircle size={48} className="text-red-600 animate-pulse" />
              <div>
                <p className="font-extrabold text-zinc-700 text-sm">
                  {language === 'en' ? 'No products matched' : 'কোনো পণ্য পাওয়া যায়নি'}
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  {language === 'en' ? 'Try searching different keywords or ask Ghoroya Bazar AI!' : 'অন্য কি-ওয়ার্ড দিয়ে খুঁজুন অথবা আমাদের ঘরোয়া এআই অ্যাসিস্ট্যান্টকে জিজ্ঞেস করুন'}
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-2 text-xs font-bold text-orange-600 border border-orange-200 bg-orange-50 hover:bg-orange-100 px-4 py-1.5 rounded-lg transition cursor-pointer"
              >
                {language === 'en' ? 'Clear Filters' : 'ফিল্টার মুছুন'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  language={language}
                  onProductClick={setSelectedProduct}
                  onAddToCart={(prod, e) => {
                    e.stopPropagation();
                    handleAddToCart(prod, 1);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Bill Success Order Notification card overlay */}
      <AnimatePresence>
        {recentOrderSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-6 z-49 max-w-sm w-full bg-white rounded-2xl border border-emerald-250 shadow-2xl p-5 flex gap-4 animate-slide-in"
          >
            <div className="bg-emerald-50 text-emerald-600 p-2.5 h-fit rounded-full flex items-center justify-center border border-emerald-200">
              <CheckCircle size={28} className="stroke-[2.5]" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-exrabold text-zinc-900 text-sm leading-tight">
                  {language === 'en' ? 'Order Placed Successfully!' : 'অর্ডার সফলভাবে সম্পূর্ণ হয়েছে!'}
                </h4>
                <button
                  onClick={() => setRecentOrderSuccess(null)}
                  className="text-zinc-400 hover:text-zinc-600 cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>
              <p className="text-xs text-zinc-650 mt-1 font-medium">
                {language === 'en'
                  ? `Thanks for your purchase! ID of order is ${recentOrderSuccess.id}. Track it in "My Orders".`
                  : `আপনার ক্রয়ের জন্য ধন্যবাদ! অর্ডার আইডি: ${recentOrderSuccess.id}। "আমার অর্ডার" থেকে ট্র্যাক করতে পারবেন।`}
              </p>
              <button
                onClick={() => {
                  setRecentOrderSuccess(null);
                  setIsOrdersOpen(true);
                }}
                className="mt-3 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold px-3.5 py-1.5 rounded-lg border border-emerald-200 transition cursor-pointer flex items-center gap-1"
              >
                <ClipboardList size={11} />
                <span>{language === 'en' ? 'View Orders' : 'আমার অর্ডার দেখুন'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Subcomponents (Drawer, Modals, Assistant) */}
      <AnimatePresence>
        {/* Cart Drawer */}
        {isCartOpen && (
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            language={language}
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={handleTriggerCheckout}
            appliedVoucherCode={appliedVoucherCode}
            setAppliedVoucherCode={setAppliedVoucherCode}
            products={productsList}
            onProductClick={setSelectedProduct}
          />
        )}

        {/* Checkout Modal */}
        {isCheckoutOpen && (
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            language={language}
            cart={cart}
            appliedVoucherCode={appliedVoucherCode}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onOrderSuccess={handleOrderCompletion}
            siteSettings={siteSettings}
            resellerContext={resellerContext}
          />
        )}

        {/* Selected Product Detail Card Modal */}
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            language={language}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={(prod, qty, col, siz) => {
              handleAddToCart(prod, qty, col, siz);
              setSelectedProduct(null);
              setIsCartOpen(true);
            }}
            onBuyNow={(prod, qty, col, siz) => {
              handleDirectBuyNow(prod, qty, col, siz);
            }}
            allProducts={productsList}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {/* Previous orders list modal */}
        {isOrdersOpen && (
          <MyOrdersModal
            isOpen={isOrdersOpen}
            onClose={() => setIsOrdersOpen(false)}
            language={language}
            orders={orders}
            onAiChatOpen={() => {
              setIsOrdersOpen(false);
              setIsAiChatOpen(true);
            }}
          />
        )}

        {/* Package Real-Time tracking modal */}
        {isTrackOrderOpen && (
          <TrackOrderModal
            isOpen={isTrackOrderOpen}
            onClose={() => setIsTrackOrderOpen(false)}
            language={language}
          />
        )}

        {/* Wishlist Modal Drawer */}
        {isWishlistOpen && (
          <WishlistModal
            isOpen={isWishlistOpen}
            onClose={() => setIsWishlistOpen(false)}
            language={language}
            wishlist={wishlist}
            products={productsList}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={(prod) => {
              handleAddToCart(prod, 1);
              setIsCartOpen(true);
            }}
            onProductClick={setSelectedProduct}
          />
        )}

        {/* Dynamic Admin/Seller Dashboard Modal Control Panel */}
        {isSellerOpen && (
          <SellerDashboardModal
            isOpen={isSellerOpen}
            onClose={() => setIsSellerOpen(false)}
            language={language}
            products={productsList}
            orders={orders}
            vouchers={vouchersList}
            siteSettings={siteSettings}
            onUpdateSettings={async (newSettings) => {
              try {
                const res = await fetch('/api/site-settings', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(newSettings)
                });
                if (res.ok) {
                  setSiteSettings(newSettings);
                }
              } catch (e) {
                console.error(e);
                setSiteSettings(newSettings);
              }
            }}
            onAddProduct={async (newProd) => {
              try {
                const res = await fetch('/api/products', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(newProd)
                });
                if (res.ok) {
                  const saved = await res.json();
                  setProductsList((prev) => [saved, ...prev]);
                }
              } catch (e) {
                console.error(e);
                setProductsList((prev) => [newProd, ...prev]);
              }
            }}
            onDeleteProduct={async (id) => {
              const updatedList = productsList.filter((p) => p.id !== id);
              try {
                const res = await fetch('/api/products', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(updatedList)
                });
                if (res.ok) {
                  setProductsList(updatedList);
                }
              } catch (e) {
                console.error(e);
                setProductsList(updatedList);
              }
            }}
            onUpdateProductsList={async (updatedList) => {
              try {
                const res = await fetch('/api/products', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(updatedList)
                });
                if (res.ok) {
                  setProductsList(updatedList);
                }
              } catch (e) {
                console.error(e);
                setProductsList(updatedList);
              }
            }}
            onUpdateOrderStatus={handleMockStatusUpdate}
            onAddVoucher={async (newVoc) => {
              const updated = [...vouchersList, newVoc];
              try {
                const res = await fetch('/api/vouchers', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(updated)
                });
                if (res.ok) {
                  setVouchersList(updated);
                }
              } catch (e) {
                console.error(e);
                setVouchersList(updated);
              }
            }}
            onDeleteVoucher={async (code) => {
              const updated = vouchersList.filter((v) => v.code !== code);
              try {
                const res = await fetch('/api/vouchers', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(updated)
                });
                if (res.ok) {
                  setVouchersList(updated);
                }
              } catch (e) {
                console.error(e);
                setVouchersList(updated);
              }
            }}
          />
        )}

        {/* Dynamic Admin/Seller PIN Verification */}
        {isSellerPinOpen && (
          <SellerPinModal
            isOpen={isSellerPinOpen}
            onClose={() => setIsSellerPinOpen(false)}
            language={language}
            onSuccess={() => {
              setIsSellerPinOpen(false);
              setIsSellerOpen(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* Dynamic Ghoroya Reseller Hub modal overlay */}
      <ResellerPortalModal
        isOpen={isResellerPortalOpen}
        onClose={() => setIsResellerPortalOpen(false)}
        language={language}
        products={productsList}
      />

      {/* AI shopping chatbot companion */}
      <AIShoppingAssistant
        isOpen={isAiChatOpen}
        onOpen={() => setIsAiChatOpen(true)}
        onClose={() => setIsAiChatOpen(false)}
        language={language}
        onProductClick={(p) => {
          setSelectedProduct(p);
          setIsAiChatOpen(false);
        }}
        onAddToCart={(p) => {
          handleAddToCart(p, 1);
          setIsCartOpen(true);
        }}
        onApplyVoucherCode={(code) => {
          setAppliedVoucherCode(code);
        }}
      />

      {/* Footer copyright */}
      <footer className="bg-zinc-900 border-t border-zinc-800 text-zinc-500 py-8 pb-32 md:pb-8 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-extrabold text-zinc-400">
            © <button
              onClick={() => setIsSellerPinOpen(true)}
              className="hover:text-red-500 hover:underline transition font-extrabold focus:outline-none cursor-pointer text-zinc-400"
              title={language === 'en' ? 'Seller Secure Portal' : 'নিরাপদ সেলার পোর্টাল'}
            >
              2026
            </button> ঘরোয়া বাজার ডট কম (Ghoroya Bazar Dot Com). সর্বস্বত্ব সংরক্ষিত। হটলাইন: ০১৫১৮৪৮৯০৮০।
          </p>
          <p className="text-[10px]">
            {language === 'en'
              ? 'This is a simulation built in Google AI Studio to demonstrate full-stack capabilities, local state management, and real-time AI agents.'
              : 'এটি একটি সিমুলেশন অ্যাপ্লিকেশন যা গুগল এআই স্টুডিওতে তৈরি করা হয়েছে।'}
          </p>
        </div>
      </footer>

      {/* Modern, Highly Polished Floating Bottom Mobile Navigation Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800/80 text-white shadow-2xl flex items-center justify-around py-2.5 px-3 md:hidden rounded-t-2xl pb-4 safe-bottom">
        <button
          onClick={() => {
            setSearchQuery('');
            setSelectedCategory('all');
            setSelectedSubcategory('all');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
            !searchQuery && selectedCategory === 'all' ? 'text-red-500 scale-105' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <ShoppingBag size={18} />
          <span className="text-[9px] font-black">{language === 'en' ? 'Home' : 'হোম'}</span>
        </button>

        <button
          onClick={() => setIsResellerPortalOpen(true)}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
            isResellerPortalOpen ? 'text-red-500 scale-105 font-black' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Briefcase size={18} className="text-orange-500 animate-pulse" />
          <span className="text-[9px] font-black">{language === 'en' ? 'Reseller' : 'রিসেলার'}</span>
        </button>

        <button
          onClick={() => setIsTrackOrderOpen(true)}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
            isTrackOrderOpen ? 'text-red-500 scale-105' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Truck size={18} className="animate-pulse" />
          <span className="text-[9px] font-black">{language === 'en' ? 'Tracking' : 'ট্র্যাকিং'}</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-all relative ${
            isCartOpen ? 'text-red-500 scale-105' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <ShoppingCart size={18} />
          <span className="text-[9px] font-black">{language === 'en' ? 'Cart' : 'কার্ট'}</span>
          {cart.reduce((acc, item) => acc + item.quantity, 0) > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-650 text-white font-black text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-zinc-950">
              {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          )}
        </button>

        <button
          onClick={() => setIsOrdersOpen(true)}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
            isOrdersOpen ? 'text-red-500 scale-105' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <User size={18} />
          <span className="text-[9px] font-black">{language === 'en' ? 'Orders' : 'অর্ডার'}</span>
        </button>

        <button
          onClick={() => setIsAiChatOpen(true)}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
            isAiChatOpen ? 'text-red-500 scale-105' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Sparkles size={18} className="text-yellow-400 animate-pulse" />
          <span className="text-[9px] font-black">{language === 'en' ? 'AI Help' : 'এআই হেল্প'}</span>
        </button>
      </div>
    </div>
  );
}

