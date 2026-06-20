/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, Percent, ArrowRight, ShoppingCart } from 'lucide-react';
import { Message, Product } from '../types';
import { PRODUCTS } from '../data/products';

interface AIShoppingAssistantProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  language: 'en' | 'bn';
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onApplyVoucherCode: (code: string) => void;
}

export default function AIShoppingAssistant({
  isOpen,
  onOpen,
  onClose,
  language,
  onProductClick,
  onAddToCart,
  onApplyVoucherCode
}: AIShoppingAssistantProps) {
  // Create or retrieve unique session ID for the support inbox
  const [sessionId] = useState<string>(() => {
    let id = localStorage.getItem('ghoroya_support_session_id');
    if (!id) {
      id = `cust-${Math.floor(1000 + Math.random() * 9000)}-${Date.now()}`;
      localStorage.setItem('ghoroya_support_session_id', id);
    }
    return id;
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Load chat messages from shared localStorage thread and server database on mount
  useEffect(() => {
    const fetchThread = async () => {
      try {
        const res = await fetch('/api/support_chats');
        if (res.ok) {
          const serverThreads = await res.json();
          if (Array.isArray(serverThreads)) {
            const myThread = serverThreads.find((t: any) => t.id === sessionId);
            if (myThread && myThread.messages && myThread.messages.length > 0) {
              setMessages(myThread.messages);
              localStorage.setItem('ghoroya_support_chats', JSON.stringify(serverThreads));
              return;
            }
          }
        }
      } catch (err) {
        console.error('Error fetching chats from server:', err);
      }

      // Fallback to localStorage if server fails or hasn't got this thread yet
      try {
        const storedChats = localStorage.getItem('ghoroya_support_chats');
        if (storedChats) {
          const parsed = JSON.parse(storedChats);
          const myThread = parsed.find((t: any) => t.id === sessionId);
          if (myThread && myThread.messages && myThread.messages.length > 0) {
            setMessages(myThread.messages);
            return;
          }
        }
      } catch (err) {
        console.error(err);
      }

      // Default Greeting if empty
      setMessages([
        {
          id: 'welcome',
          sender: 'assistant',
          text:
            language === 'en'
              ? "Hello! I am Ghoroya Bazar AI Shopping Assistant. How can I assist you today? Ask me about products, discounts, or coupons! Helpline: 01518489080."
              : 'আসসালামু আলাইকুম! আমি ঘরোয়া বাজার এআই অ্যাসিস্ট্যান্ট। আজ আপনাকে কীভাবে সাহায্য করতে পারি? পণ্য, স্পেশাল ডিসকাউন্ট বা ভাউচার কোড সম্পর্কে আমাকে জিজ্ঞেস করুন! যেকোনো প্রয়োজনে ফোন করতে পারেন: ০১৫১৮৪৮৯০৮০।',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    };

    fetchThread();
  }, [sessionId]);

  // Synchronize state messages to ghoroya_support_chats and server DB whenever messages change
  useEffect(() => {
    if (messages.length === 0) return;
    try {
      const storedChats = localStorage.getItem('ghoroya_support_chats');
      const parsed = storedChats ? JSON.parse(storedChats) : [];
      const threadIndex = parsed.findIndex((t: any) => t.id === sessionId);

      const customerName = localStorage.getItem('ghoroya_customer_name') || `Dhaka Guest #${sessionId.split('-')[1]}`;
      const customerPhone = localStorage.getItem('ghoroya_customer_phone') || 'Unknown Helpline';

      const updatedThread = {
        id: sessionId,
        customerName,
        customerPhone,
        messages: messages,
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        unreadByAdmin: messages[messages.length - 1]?.sender === 'user',
        unreadByUser: false
      };

      if (threadIndex > -1) {
        parsed[threadIndex] = updatedThread;
      } else {
        parsed.push(updatedThread);
      }
      localStorage.setItem('ghoroya_support_chats', JSON.stringify(parsed));

      // Push to Firestore on server
      fetch('/api/support_chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(parsed)
      }).catch(err => console.error('Error posting chat sync:', err));
    } catch (err) {
      console.error(err);
    }
  }, [messages, sessionId]);

  // Poll support database (API server) every 2.5 seconds for admin responses
  useEffect(() => {
    const handlePoll = async () => {
      try {
        const res = await fetch('/api/support_chats');
        if (res.ok) {
          const serverThreads = await res.json();
          if (Array.isArray(serverThreads)) {
            // Keep localStorage in sync with server as well
            localStorage.setItem('ghoroya_support_chats', JSON.stringify(serverThreads));

            const myThread = serverThreads.find((t: any) => t.id === sessionId);
            if (myThread && myThread.messages) {
              if (myThread.messages.length > messages.length) {
                setMessages(myThread.messages);
                
                // Mark thread as read by user and push update back
                myThread.unreadByUser = false;
                const threadIndex = serverThreads.findIndex((t: any) => t.id === sessionId);
                if (threadIndex > -1) {
                  serverThreads[threadIndex] = myThread;
                  await fetch('/api/support_chats', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(serverThreads)
                  });
                }
              }
            }
          }
        }
      } catch (err) {
        console.error('Error polling chat from server:', err);
      }
    };
    const interval = setInterval(handlePoll, 2500);
    return () => clearInterval(interval);
  }, [sessionId, messages.length]);

  const handleSend = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || isLoading) return;

    // Retrieve live dynamic catalog list
    const activeProductsList = (() => {
      try {
        const cached = localStorage.getItem('ghoroya_products');
        return cached ? JSON.parse(cached) : PRODUCTS;
      } catch {
        return PRODUCTS;
      }
    })();

    // Create user bubble
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setUserInput('');
    setIsLoading(true);

    try {
      // Gather simplified chat history
      const historyPayload = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text
        }));

      // Post payload to server-side Express Gemini router
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
          language
        })
      });

      const data = await response.json();

      // Hydrate recommended product records if returned from model
      let recommendedProducts: Product[] = [];
      if (data.recommendedProductIds && Array.isArray(data.recommendedProductIds)) {
        recommendedProducts = activeProductsList.filter((p: Product) =>
          data.recommendedProductIds.includes(p.id)
        );
      }

      // Automatically apply suggested voucher directly to customer shopping session!
      if (data.voucherAppliedCode) {
        onApplyVoucherCode(data.voucherAppliedCode);
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.text || 'দুঃখিত, আমি ঠিক বুঝতে পারিনি। পুনরায় জিজ্ঞেস করুন।',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProducts: recommendedProducts.length > 0 ? recommendedProducts : undefined
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      // Fallback bubble
      const errMsg: Message = {
        id: `bot-err-${Date.now()}`,
        sender: 'assistant',
        text:
          language === 'en'
            ? 'Sorry! It seems the model is temporarily busy. Please browse the catalog or query again.'
            : 'দুঃখিত! এই মুহূর্তে সার্ভার ব্যস্ত রয়েছে। অনুগ্রহ করে ক্যাটালগ ব্রাউজ করুন অথবা একটু পর পুনরায় রিকোয়েস্ট পাঠান।',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestClick = (txt: string) => {
    handleSend(txt);
  };

  const suggestionPills = [
    {
      en: 'Tell me coupon codes',
      bn: 'ডিসকাউন্ট কুপন কোড বলো',
      prompt: 'বিকাশ ও অন্যান্য ডিসকাউন্ট কুপন কোডগুলো বলো'
    },
    {
      en: 'Best earbuds available?',
      bn: 'ভালো ওয়্যারলেস ইয়ারবাড সাজেস্ট করো',
      prompt: 'সবচেয়ে ভালো ফিচারযুক্ত ওয়্যারলেস ব্লুটুথ ইয়ারবাডস কোনটা?'
    },
    {
      en: 'Show me beautiful Sarees',
      bn: 'ঐতিহ্যবাহী তাঁতের শাড়ি দেখাও',
      prompt: 'তাঁতের খাঁটি সুতি শাড়ির দাম এবং বিস্তারিত বিবরণ দেখাও'
    },
    {
      en: 'How to get free delivery?',
      bn: 'ফ্রি ডেলিভারি কোড কী?',
      prompt: 'ফ্রি এক্সপ্রেস হোম ডেলিভারি পাওয়ার কোনো ভাউচার কোড আছে কি?'
    }
  ];

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col h-[550px] max-h-[85vh] animate-slide-in">
      
      {/* Bot Chat Header */}
      <div className="bg-gradient-to-r from-red-600 to-zinc-950 text-white p-4 flex items-center justify-between border-b border-zinc-800 shadow">
        <div className="flex items-center gap-2">
          <div className="bg-white/10 p-2.5 rounded-full flex items-center justify-center border border-white/20">
            <Sparkles size={16} className="text-yellow-300 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base leading-none">
              {language === 'en' ? 'Ghoroya Bazar AI Companion' : 'ঘরোয়া বাজার এআই সহকারী'}
            </h3>
            <span className="text-[10px] text-zinc-300 font-bold mt-1 block flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-ping" />
              {language === 'en' ? 'Hotline: 01518489080' : 'হটলাইন: ০১৫১৮৪৮৯০৮০'}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/20 p-2 rounded-full cursor-pointer transition text-white"
        >
          <X size={16} />
        </button>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 bg-zinc-50 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {/* Avatar block */}
            {m.sender !== 'user' && (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center select-none flex-shrink-0 shadow-sm ${
                m.sender === 'admin' 
                  ? 'bg-red-100 border border-red-200 text-red-600 animate-pulse' 
                  : 'bg-orange-100 border border-orange-200 text-orange-600'
              }`}>
                {m.sender === 'admin' ? <User size={13} /> : <Bot size={15} />}
              </div>
            )}

            <div className="max-w-[80%] flex flex-col gap-2">
              <div
                className={`p-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed shadow-sm transition-all duration-300 ${
                  m.sender === 'user'
                    ? 'bg-orange-600 text-white rounded-tr-none'
                    : m.sender === 'admin'
                    ? 'bg-red-50 border-2 border-red-200/80 text-zinc-900 rounded-tl-none font-bold'
                    : 'bg-white border border-zinc-200 text-zinc-800 rounded-tl-none'
                }`}
              >
                {m.sender === 'admin' && (
                  <span className="text-[9px] uppercase font-black tracking-widest text-red-650 flex items-center gap-1 mb-1 bg-red-100/50 px-1.5 py-0.5 rounded w-max select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-650 animate-ping inline-block" />
                    {language === 'en' ? 'Live Store Owner' : 'স্টোর ম্যানেজার (লাইভ)'}
                  </span>
                )}
                {m.text}
              </div>

              {/* Related Interactive Recommendations */}
              {m.recommendedProducts && (
                <div className="space-y-2 mt-1">
                  <span className="text-[10px] text-zinc-400 font-extrabold block">
                    {language === 'en' ? 'SUGGESTED BY AI:' : 'এআই সাজেস্টেড প্রোডাক্ট:'}
                  </span>
                  {m.recommendedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white border border-zinc-200 rounded-xl p-2 flex gap-2 shadow-sm relative group hover:border-orange-300 transition"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        onClick={() => onProductClick(p)}
                        className="w-12 h-12 object-cover rounded-md border bg-zinc-50 cursor-pointer flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 text-left">
                        <h4
                          onClick={() => onProductClick(p)}
                          className="font-extrabold text-[11px] text-zinc-800 truncate cursor-pointer leading-tight mb-1"
                        >
                          {language === 'en' ? p.name : p.nameBn}
                        </h4>
                        <div className="flex items-center justify-between">
                          <span className="text-orange-600 font-extrabold text-[11px]">
                            ৳{p.price.toLocaleString()}
                          </span>
                          {/* Easy push to cart */}
                          <button
                            onClick={() => onAddToCart(p)}
                            className="bg-orange-50 hover:bg-orange-500 hover:text-white border border-orange-200 text-orange-600 text-[9px] px-2 py-1 rounded transition flex items-center gap-1 cursor-pointer font-bold select-none"
                          >
                            <ShoppingCart size={9} />
                            <span>{language === 'en' ? 'Add' : 'যোগ'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {m.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-zinc-850 flex items-center justify-center text-white text-xs select-none flex-shrink-0 font-bold border border-zinc-700">
                <User size={13} />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-8 h-8 rounded-full bg-zinc-150 flex items-center justify-center text-zinc-500 animate-spin">
              <Bot size={15} />
            </div>
            <div className="bg-white border border-zinc-200 px-4 py-2.5 rounded-2xl rounded-tl-none font-bold text-xs text-zinc-400 shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggested Quick Buttons */}
      {messages.length <= 2 && (
        <div className="px-3 py-2 bg-zinc-50 border-t border-zinc-150 overflow-x-auto whitespace-nowrap flex gap-2 scrollbar-none">
          {suggestionPills.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestClick(language === 'en' ? s.prompt : s.prompt)}
              className="inline-block bg-white hover:bg-orange-50 border border-zinc-200 hover:border-orange-300 text-[10px] text-zinc-700 font-extrabold px-3 py-1.5 rounded-full transition cursor-pointer select-none"
            >
              {language === 'en' ? s.en : s.bn}
            </button>
          ))}
        </div>
      )}

      {/* Input Form Message */}
      <div className="p-3 border-t border-zinc-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(userInput);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            placeholder={language === 'en' ? 'Ask Ghoroya Bazar Assistant...' : 'ঘরোয়া এআই সহকারীকে বলুন...'}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-zinc-55 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-red-500 text-zinc-900 font-semibold"
          />
          <button
            type="submit"
            disabled={!userInput.trim() || isLoading}
            className="p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl flex items-center justify-center transition disabled:bg-zinc-150 disabled:text-zinc-400 shadow-sm disabled:cursor-not-allowed cursor-pointer flex-shrink-0"
          >
            <Send size={15} />
          </button>
        </form>
      </div>

    </div>
  );
}
