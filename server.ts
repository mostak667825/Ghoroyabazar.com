/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { PRODUCTS, VOUCHERS } from './src/data/products.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API endpoint to return product listings (simple backend backup if needed)
app.get('/api/products', (req, res) => {
  res.json(PRODUCTS);
});

// API endpoint for AI assistant requests
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, history, language } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    // Set up contextual background for the Gemini Model
    const systemPrompt = `You are "Ghoroya Bazar AI Shopping Assistant" (ঘরোয়া বাজার এআই সহকারী), a polite, welcoming, and helpful shopping assistant for Ghoroya Bazar (ঘরোয়া বাজার), BD's premium handcrafted, organic, and trending items e-commerce platform.
    
    Current local standard time: ${new Date().toISOString()}.
    Preferred customer language: ${language === 'bn' ? 'Bengali' : 'English'}.
    
    YOUR CAPABILITIES:
    1. Guide buyers in choosing products from the Ghoroya Bazar catalog provided below.
    2. Respond in the customer's language. If the query is in Bengali, respond in fluent Bengali. If in English, respond in English. Feel free to use mixed Benglish/English words (like 'অর্ডার', 'ইলেকট্রনিক্স', 'ডেলিভারি') as common in Bangladesh.
    3. Suggest existing discount vouchers/coupon codes to help them save money.
    4. Help the user compare products (rating, specifications, review counts).
    5. Encourage them to add products directly to their shopping cart.
    
    GHOROYA BAZAR CATALOG:
    ${JSON.stringify(PRODUCTS.map(p => ({
      id: p.id,
      name: p.name,
      nameBn: p.nameBn,
      price: p.price,
      originalPrice: p.originalPrice,
      rating: p.rating,
      category: p.category,
      categoryBn: p.categoryBn,
      description: p.description,
      descriptionBn: p.descriptionBn,
      stock: p.stock
    })), null, 2)}
    
    AVAILABLE EXPIRY/VOUCHER CODES:
    ${JSON.stringify(VOUCHERS, null, 2)}
    
    RESPONSE FORMAT REQUIREMENT:
    You must output your response STRICTLY as a single JSON object. Do not wrap it in markdown codeblocks like \`\`\`json. The schema of your JSON output must contain exactly these properties:
    {
      "text": "Your conversational response in the user's language.",
      "recommendedProductIds": ["id1", "id2"], // Option list of relevant product IDs. Max 3. Empty array if none.
      "voucherAppliedCode": "CODE" // Optional coupon code suggested by you if the user asks for discounting/shipping or general coupon. Empty string if none.
    }`;

    // Structure chat history cleanly
    const formattedContents = [
      ...history.map((h: any) => ({
        role: h.role,
        parts: [{ text: h.text }]
      })),
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    // Call the correct model gemini-3.5-flash with custom schema configuration
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: formattedContents as any,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['text'],
          properties: {
            text: {
              type: Type.STRING,
              description: 'The natural conversational response in the suitable language.'
            },
            recommendedProductIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Array of up to 3 product IDs from the catalog relevant to client query.'
            },
            voucherAppliedCode: {
              type: Type.STRING,
              description: 'Any voucher code suggested from available VOUCHERS. Empty if none.'
            }
          }
        }
      }
    });

    const parsedResponse = JSON.parse(response.text || '{}');
    res.json(parsedResponse);
  } catch (err: any) {
    console.warn('Gemini Assistant Error (Graceful Fallback Mode):', err.message || err);
    res.json({ 
      text: 'দুঃখিত, এই মুহূর্তে এআই সংযোগ বিচ্ছিন্ন রয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন বা সরাসরি পণ্যটি ব্রাউজ করুন। (Sorry, the AI helper is temporarily offline. Please try again.)', 
      recommendedProductIds: [] 
    });
  }
});

// API endpoint for Smart AI Search
app.post('/api/gemini/search', async (req, res) => {
  try {
    const { query, language } = req.body;
    if (!query) {
      res.status(400).json({ error: 'Query is required' });
      return;
    }

    const systemPrompt = `You are Ghoroya Bazar's "Smart AI Search Engine" (ঘরোয়া বাজার স্মার্ট অনুসন্ধান ইঞ্জিন).
    Your task is to analyze user queries (which can be in English, Bengali, or phonetic Benglish) and find the most semantically relevant products from the Ghoroya Bazar catalog.
    
    Current language: ${language === 'bn' ? 'Bengali (বাংলা)' : 'English'}.
    
    CATALOG PRODUCTS AVAILABLE:
    ${JSON.stringify(PRODUCTS.map(p => ({
      id: p.id,
      name: p.name,
      nameBn: p.nameBn,
      price: p.price,
      originalPrice: p.originalPrice,
      category: p.category,
      categoryBn: p.categoryBn,
      description: p.description,
      descriptionBn: p.descriptionBn
    })), null, 2)}

    Search for matching products based on ingredients, use cases, pricing, or target category.
    
    RESPONSE FORMAT REQUIREMENT:
    You must output your response STRICTLY as a single JSON object. Do not wrap it in markdown codeblocks. The schema of your JSON output must contain exactly these properties:
    {
      "explanation": "A short (1-2 sentences) polite, helpful summary of what you found or suggest in the requested language (e.g. 'আমি আপনার জন্য স্বাস্থ্যসম্মত ঘি এবং খাঁটি সর্ষের তেল নির্বাচন করেছি...').",
      "matchedProductIds": ["id1", "id2"], // Array of matched product IDs from the catalog, ordered by relevancy. Max 4. Empty array if none matched.
      "suggestedKeywords": ["keyword1", "keyword2"] // 2-3 related search tags or category terms (e.g., 'Ghee', 'Honey')
    }`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Search query: ${query}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['explanation', 'matchedProductIds'],
          properties: {
            explanation: {
              type: Type.STRING,
              description: 'Explanatory search text in requested language.'
            },
            matchedProductIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'The IDs of matching products.'
            },
            suggestedKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Useful suggestions for related search words.'
            }
          }
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.warn('Smart AI Search Error (Graceful Fallback Mode):', err.message || err);
    res.json({
      explanation: 'Search service is busy right now. (এই মুহূর্তে স্মার্ট অনুসন্ধান উপলব্ধ নেই)',
      matchedProductIds: [],
      suggestedKeywords: []
    });
  }
});

// API endpoint for AI Complementary Recommendations
app.post('/api/gemini/recommendations', async (req, res) => {
  try {
    const { cartProductIds = [], currentlyViewedId, language } = req.body;

    const systemPrompt = `You are Ghoroya Bazar's "AI Personalization & Recommendation Engine" (এআই পার্সোনালাইজড রেকমেন্ডেশন ইঞ্জিন).
    Your goal is to suggest up to 3 highly complementary products that the user is likely to buy, based on what is in their cart right now and/or the item they are currently viewing.
    
    Under no circumstances should you recommend a product that is already in their active cart, or standard viewed item if they can be varied.
    Provide an enticing rationale for why these items are recommended.
    
    CUSTOMER DATA:
    - User's cart items: ${JSON.stringify(cartProductIds)}
    - Viewed item ID: ${currentlyViewedId || 'none'}
    
    CATALOG PRODUCTS AVAILABLE:
    ${JSON.stringify(PRODUCTS.map(p => ({
      id: p.id,
      name: p.name,
      nameBn: p.nameBn,
      price: p.price,
      originalPrice: p.originalPrice,
      category: p.category,
      categoryBn: p.categoryBn,
      description: p.description
    })), null, 2)}
    
    COMPLEMENTARY MATCHES LOGIC:
    - If user has / views Redmi Note 13 (electronics), recommend Anker Earbuds.
    - If user views food/organic (Ghee, Honey), recommend organic Mustard oil or spices.
    - If user has/views Saree/Polo Shirt, suggest premium Attar or leather accessories.
    
    RESPONSE FORMAT REQUIREMENT:
    You must output your response STRICTLY as a single JSON object. Do not wrap it in markdown codeblocks. The schema of your JSON output must contain exactly these properties:
    {
      "rationale": "A brief, highly persuasive summary (1-2 sentences) in the customer's language explaining why these recommendations fit their profile.",
      "recommendedProductIds": ["id1", "id2", "id3"] // Up to 3 unique product IDs from Ghoroya Bazar. Do not include items they already have in cart/viewed if possible.
    }`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Generate recommended items. Cart: ${cartProductIds.join(', ')} | Viewing: ${currentlyViewedId || 'none'}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['rationale', 'recommendedProductIds'],
          properties: {
            rationale: {
              type: Type.STRING,
              description: 'Persuasive cross-sell pitch in user language.'
            },
            recommendedProductIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Product IDs recommended.'
            }
          }
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.warn('AI Recommendations Error (Graceful Fallback Mode):', err.message || err);
    res.json({
      rationale: 'খাঁটি ও স্বাস্থ্যসম্মত অর্গানিক পণ্য আপনার জন্য নির্বাচিত করা হয়েছে।',
      recommendedProductIds: []
    });
  }
});

// API endpoint for Dynamic Personalized Offers Generation
app.post('/api/gemini/offers', async (req, res) => {
  try {
    const { recentlyViewedIds = [], cartProductIds = [], language } = req.body;
    const combinedInterests = [...new Set([...recentlyViewedIds, ...cartProductIds])];

    const systemPrompt = `You are the Ghoroya Bazar "Personalized Offer Genius" (পার্সোনালাইজড অফার এআই).
    Your task is to analyze user profile history (viewed list, cart items) and output an exclusive, custom discount coupon code to convert them.
    
    SHOPPER PROFILE DATA:
    - Shopper recently viewed item IDs: ${JSON.stringify(recentlyViewedIds)}
    - Shopper cart item IDs: ${JSON.stringify(cartProductIds)}
    
    CATALOG PRODUCTS AVAILABLE:
    ${JSON.stringify(PRODUCTS.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      category: p.category
    })), null, 2)}

    You will generate a completely customized voucher coupon code (e.g. MUAZ80, EXTRA120, GIFT150) that grants a flat BDT (Taka) discount between ৳50 and ৳200.
    Select a value based on their shopping pattern, and write a beautiful, enticing personal explanation connecting their views to this surprise gift.
    
    RESPONSE FORMAT REQUIREMENT:
    Output STRICTLY as a single JSON object. Schema:
    {
      "code": "A custom uppercase voucher code e.g. MYSECRET100",
      "discountAmount": 100, // Numerical discount value (must be between 50 and 200).
      "title": "Short title in English",
      "titleBn": "বাংলায় একটি সুন্দর ক্ষণস্থায়ী চমকপ্রদ শিরোনাম",
      "description": "Short personalized description in English (max 2 sentences)",
      "descriptionBn": "বাংলায় কেন তারা এটি পাচ্ছেন তার ২ লাইনের সুন্দর প্রশংসা ও বিশ্লেষণ"
    }`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Generate customized coupon. History: ${combinedInterests.join(', ')}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['code', 'discountAmount', 'title', 'titleBn', 'description', 'descriptionBn'],
          properties: {
            code: { type: Type.STRING },
            discountAmount: { type: Type.NUMBER },
            title: { type: Type.STRING },
            titleBn: { type: Type.STRING },
            description: { type: Type.STRING },
            descriptionBn: { type: Type.STRING }
          }
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.warn('Personalized Offers Error (Graceful Fallback Mode):', err.message || err);
    res.json({
      code: 'GHOROYA100',
      discountAmount: 100,
      title: 'Surprise Discount Voucher!',
      titleBn: 'আপনার জন্য সারপ্রাইজ ডিসকাউন্ট কুপন!',
      description: 'An exclusive surprise voucher valid for the next 30 minutes.',
      descriptionBn: 'আপনার জন্য ঘরোয়া বাজারের পক্ষ থেকে ১০০ টাকার এই বিশেষ কুপনটি পরবর্তী ৩০ মিনিটের জন্য সচল।'
    });
  }
});

// API endpoint for AI Auto Facebook Post Generator for Resellers
app.post('/api/gemini/generate-post', async (req, res) => {
  try {
    const { product, language } = req.body;
    if (!product) {
      res.status(400).json({ error: 'Product is required' });
      return;
    }

    const systemPrompt = `You are Ghoroya Bazar's "AI Social Media Copywriter" (ঘরোয়া বাজার সোশ্যাল মিডিয়া কপিরাইটার).
    Your task is to write high-converting, extremely engaging promotional posts for resellers to sell this product on social media channels in Bangladesh.
    
    PRODUCT DETAILS:
    - Name: ${product.name} / ${product.nameBn || product.name}
    - Code: ${product.code || product.id}
    - Regular Price (Customer Price): ৳${product.price}
    - Reseller's Cost Price: ৳${product.resellerPrice || product.price} (reseller can sell at Regular Price to customers to earn profit).
    - Category: ${product.category}
    - Description: ${product.description} / ${product.descriptionBn || product.description}
    
    You must return three formatted posts in a single JSON object (fully in Bengali, written with a warm, persuasive, merchant-optimized tone using attractive emojis):
    1. 'facebook': A polished, full-length Facebook group/page post. It should have a catchy heading (e.g., '🛒 আজকের অফার!'), product benefits/key specifications in easy-to-read list/bullets, price points (৳${product.price}), home or nationwide cash-on-delivery guarantee, and contact instructions (e.g., 'অর্ডার করতে এখনই ইনবক্স করুন!').
    2. 'whatsapp': A brief, spacing-optimized WhatsApp message, readable at one glance, using standard emoticons.
    3. 'story': A short, punchy, vertical-format style copy suitable for Facebook, Instagram, or WhatsApp Stories. It must have sharp bold taglines and a strong call-to-action (CTA).
    
    RESPONSE FORMAT REQUIREMENT:
    You must output your response STRICTLY as a single JSON object. Do not wrap it in markdown codeblocks. The schema of your JSON output must contain exactly these properties:
    {
      "facebook": "The formatted text for Facebook Post in Bengali with rich emojis.",
      "whatsapp": "The formatted text for WhatsApp in Bengali with appropriate spacing.",
      "story": "The short vertical-style hook for Stories."
    }`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Generate social posts for: ${product.name}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['facebook', 'whatsapp', 'story'],
          properties: {
            facebook: { type: Type.STRING },
            whatsapp: { type: Type.STRING },
            story: { type: Type.STRING }
          }
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.warn('AI Generate Post Error (Graceful Fallback Mode):', err.message || err);
    // Return high-quality fallback text containing the exact details the user requested as fallback
    const pName = req.body.product?.nameBn || req.body.product?.name || 'প্রিমিয়াম প্রোডাক্ট';
    const pPrice = req.body.product?.price || '855';
    const pCode = req.body.product?.code || req.body.product?.id || '';
    
    res.json({
      facebook: `🛒 আজকের অফার!\n\n🔥 ${pName}\n📌 কোড: #${pCode}\n\n💰 মূল্য: ৳${pPrice}\n🚚 হোম ডেলিভারি / সারাদেশে ক্যাশ অন ডেলিভারি সুবিধা!\n\nঅর্ডার করতে এখনই ইনবক্স করুন।`,
      whatsapp: `🛒 আজকের অফার!\n\n🔥 *${pName}*\n💰 মূল্য: ৳${pPrice}\n🚚 হোম ডেলিভারি\n\nঅর্ডার করতে ইনবক্স করুন।`,
      story: `✨ আজকের স্পেশাল মেগা ডিল! ✨\n\n📌 ${pName}\n💰 মূল্য: মাত্র ৳${pPrice}\n🚚 হোম ডেলিভারি\n\nঅর্ডার করতে এখনই ইনবক্স করুন! 💥`
    });
  }
});

// ==========================================
// SECURE GOOGLE CLOUD FIRESTORE PRODUCTION DB
// ==========================================
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// Load config from firebase-applet-config.json
const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const firebaseApp = initializeApp(firebaseConfig);
const firestoreDb = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, collPath: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: 'server-admin',
      email: 'server-admin@ghoroya.com',
    },
    operationType,
    path: collPath
  };
  console.error('Firestore Error Details: ', JSON.stringify(errInfo));
  return errInfo;
}

// Ensure database is seeded with beautiful Ghoroya Bazar initial items
async function ensureSeeded() {
  try {
    const productsSnap = await getDocs(collection(firestoreDb, 'products'));
    if (productsSnap.empty) {
      console.log('Seeding products to Firestore...');
      for (const prod of PRODUCTS) {
        // Add resellerPrice (approx 15-20% lower than standard price)
        const resellerPrice = Math.round(prod.price * (prod.price > 1000 ? 0.85 : 0.8));
        // Add weight based on category (heavy items like electronics, home_kitchen get weight >= 1kg; others get lighter)
        let weight = 0.5;
        if (prod.id.includes('ghee') || prod.id.includes('honey') || prod.category === 'electronics' || prod.category === 'home_kitchen') {
          weight = 1.5;
        }
        const seededProd = {
          ...prod,
          resellerPrice,
          weight,
          soldCount: prod.soldCount || 0
        };
        await setDoc(doc(firestoreDb, 'products', prod.id), seededProd);
      }
    }

    const vouchersSnap = await getDocs(collection(firestoreDb, 'vouchers'));
    if (vouchersSnap.empty) {
      console.log('Seeding vouchers to Firestore...');
      for (const voc of VOUCHERS) {
        await setDoc(doc(firestoreDb, 'vouchers', voc.code), voc);
      }
    }

    const settingsSnap = await getDocs(collection(firestoreDb, 'site_settings'));
    if (settingsSnap.empty) {
      console.log('Seeding site settings to Firestore...');
      await setDoc(doc(firestoreDb, 'site_settings', 'main'), {
        delivery_inside_dhaka: 80,
        delivery_outside_dhaka: 150,
        delivery_groceries_charge: 80,
        delivery_package_charge: 90,
        delivery_fresh_groceries_charge: 100
      });
    }

    const usersSnap = await getDocs(collection(firestoreDb, 'users'));
    if (usersSnap.empty) {
      console.log('Seeding users to Firestore...');
      const defaultUsers = [
        { id: '1', name: 'Kabir Ahmed', email: 'kabir@ghoroya.com', phone: '01755100200', role: 'customer', status: 'Active', walletBalance: 0 },
        { id: '2', name: 'Sultana Razia', email: 'sultana@ghoroya.com', phone: '01844200300', role: 'customer', status: 'Active', walletBalance: 0 },
        { id: '3', name: 'Admin Ghoroya', email: 'admin@ghoroya.com', phone: '01758498020', role: 'admin', status: 'Active', walletBalance: 0 }
      ];
      for (const u of defaultUsers) {
        await setDoc(doc(firestoreDb, 'users', u.phone), u);
      }
    }

    const notificationsSnap = await getDocs(collection(firestoreDb, 'notifications'));
    if (notificationsSnap.empty) {
      console.log('Seeding notifications to Firestore...');
      const defaultNotifs = [
        { id: 'n-1', title: 'Eid Mubarak Campaign!', titleBn: 'ঈদ মোবারক অফার!', message: 'Use EID150 for ৳150 discount!', date: 'June 10, 2026', type: 'campaign' }
      ];
      for (const n of defaultNotifs) {
        await setDoc(doc(firestoreDb, 'notifications', n.id), n);
      }
    }

    const ordersSnap = await getDocs(collection(firestoreDb, 'orders'));
    if (ordersSnap.empty) {
      console.log('Seeding initial orders database to Firestore for courier status lookup...');
      const sampleOrders = [
        {
          id: 'GB-10214',
          shippingAddress: { phone: '165165', name: 'আব্দুর রহমান', city: 'ঢাকা', address: 'মিরপুর ২, রোড ৪' },
          items: [{ product: { id: 'honey_premium', name: 'Premium Organic Honey', price: 950, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600' }, quantity: 1 }],
          total: 1030,
          courierName: 'pathao',
          status: 'Delivered',
          statusBn: 'ডেলিভারি সম্পন্ন',
          date: '02-06-2026',
          resellerName: 'মোস্তফা কামাল',
          resellerShop: 'Kamal Grocery Store'
        },
        {
          id: 'GB-10218',
          shippingAddress: { phone: '165165', name: 'আব্দুর রহমান', city: 'ঢাকা', address: 'মিরপুর ২, রোড ৪' },
          items: [{ product: { id: 'ghee_premium', name: 'Premium Organic Ghee', price: 1200, image: 'https://images.unsplash.com/photo-1622484211148-717085cbe5b2?w=600' }, quantity: 1 }],
          total: 1280,
          courierName: 'pathao',
          status: 'Delivered',
          statusBn: 'ডেলিভারি সম্পন্ন',
          date: '04-06-2026',
          resellerName: 'তাহের এন্টারপ্রাইজ',
          resellerShop: 'Taher Retail'
        },
        {
          id: 'GB-10222',
          shippingAddress: { phone: '165165', name: 'আব্দুর রহমান', city: 'ঢাকা', address: 'মিরপুর ২, রোড ৪' },
          items: [{ product: { id: 'polo_shirt', name: 'Stylish Cotton Polo Shirt', price: 490, image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600' }, quantity: 2 }],
          total: 1060,
          courierName: 'SteadFast',
          status: 'Delivered',
          statusBn: 'ডেলিভারি সম্পন্ন',
          date: '06-06-2026',
          resellerName: 'ফ্যাশন গ্যালারি',
          resellerShop: 'Fashion Hub BD'
        },
        {
          id: 'GB-10226',
          shippingAddress: { phone: '165165', name: 'আব্দুর রহমান', city: 'ঢাকা', address: 'মিরপুর ২, রোড ৪' },
          items: [{ product: { id: 'earbd_sports', name: 'Wireless Sports Earbuds', price: 1750, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600' }, quantity: 1 }],
          total: 1830,
          courierName: 'SteadFast',
          status: 'Delivered',
          statusBn: 'ডেলিভারি সম্পন্ন',
          date: '08-06-2026',
          resellerName: 'মিরাজ ইলেকট্রনিক্স',
          resellerShop: 'Miraj Gadget Corner'
        },
        {
          id: 'GB-10230',
          shippingAddress: { phone: '165165', name: 'আব্দুর রহমান', city: 'ঢাকা', address: 'মিরপুর ২, রোড ৪' },
          items: [{ product: { id: 'polo_shirt', name: 'Stylish Cotton Polo Shirt', price: 490, image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600' }, quantity: 1 }],
          total: 570,
          courierName: 'REDX',
          status: 'Delivered',
          statusBn: 'ডেলিভারি সম্পন্ন',
          date: '10-06-2026',
          resellerName: 'আলফাতাহ স্টোর',
          resellerShop: 'Al-Fatah Store'
        },
        {
          id: 'GB-10234',
          shippingAddress: { phone: '165165', name: 'আব্দুর রহমান', city: 'ঢাকা', address: 'মিরপুর ২, রোড ৪' },
          items: [{ product: { id: 'honey_premium', name: 'Premium Organic Honey', price: 950, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600' }, quantity: 1 }],
          total: 1030,
          courierName: 'REDX',
          status: 'Delivered',
          statusBn: 'ডেলিভারি সম্পন্ন',
          date: '12-06-2026',
          resellerName: 'ফয়সাল এক্সপ্রেস',
          resellerShop: 'Faysal Trade International'
        },
        {
          id: 'GB-10238',
          shippingAddress: { phone: '165165', name: 'আব্দুর রহমান', city: 'ঢাকা', address: 'মিরপুর ২, রোড ৪' },
          items: [{ product: { id: 'earbd_sports', name: 'Wireless Sports Earbuds', price: 1750, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600' }, quantity: 1 }],
          total: 1830,
          courierName: 'REDX',
          status: 'Cancelled',
          statusBn: 'বাতিলকৃত / রিটার্ন',
          date: '14-06-2026',
          resellerName: 'স্মার্ট চয়েস বিডি',
          resellerShop: 'Smart Choice BD'
        },
        {
          id: 'GB-10242',
          shippingAddress: { phone: '165165', name: 'আব্দুর রহমান', city: 'ঢাকা', address: 'মিরপুর ২, রোড ৪' },
          items: [{ product: { id: 'ghee_premium', name: 'Premium Organic Ghee', price: 1200, image: 'https://images.unsplash.com/photo-1622484211148-717085cbe5b2?w=600' }, quantity: 1 }],
          total: 1280,
          courierName: 'REDX',
          status: 'Cancelled',
          statusBn: 'বাতিলকৃত / রিটার্ন',
          date: '15-06-2026',
          resellerName: 'রুপা ফ্যাশনস',
          resellerShop: 'Rupa Collection'
        }
      ];
      for (const ord of sampleOrders) {
        await setDoc(doc(firestoreDb, 'orders', ord.id), ord);
      }
      console.log('Seeded sample orders successfully!');
    }
  } catch (error) {
    console.error('Error seeding Firestore database:', error);
  }
}

// --- API IMPLEMENTATION ---

// 1. PRODUCTS API
app.get('/api/products', async (req, res) => {
  try {
    const snap = await getDocs(collection(firestoreDb, 'products'));
    const list = snap.docs.map(d => d.data());
    res.json(list);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'products');
    res.status(500).json([]);
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const newProduct = req.body;
    if (!newProduct.id) {
      newProduct.id = `prod-${Date.now()}`;
    }
    if (newProduct.price && !newProduct.resellerPrice) {
      newProduct.resellerPrice = Math.round(newProduct.price * 0.85);
    }
    if (!newProduct.weight) {
      newProduct.weight = 0.5;
    }
    await setDoc(doc(firestoreDb, 'products', newProduct.id), newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'products');
    res.status(500).json({ error: 'Failed to write product' });
  }
});

app.put('/api/products', async (req, res) => {
  try {
    const updatedProducts = req.body;
    for (const p of updatedProducts) {
      if (p.id) {
        await setDoc(doc(firestoreDb, 'products', p.id), p);
      }
    }
    res.json(updatedProducts);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'products');
    res.status(500).json({ error: 'Failed to update products list' });
  }
});

// 2. VOUCHERS API
app.get('/api/vouchers', async (req, res) => {
  try {
    const snap = await getDocs(collection(firestoreDb, 'vouchers'));
    res.json(snap.docs.map(d => d.data()));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'vouchers');
    res.status(500).json([]);
  }
});

app.post('/api/vouchers', async (req, res) => {
  try {
    const updatedVouchers = req.body;
    for (const v of updatedVouchers) {
      if (v.code) {
        await setDoc(doc(firestoreDb, 'vouchers', v.code), v);
      }
    }
    res.json(updatedVouchers);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'vouchers');
    res.status(500).json({ error: 'Failed saving vouchers' });
  }
});

// 3. ORDERS API
app.get('/api/orders', async (req, res) => {
  try {
    const snap = await getDocs(collection(firestoreDb, 'orders'));
    const orders = snap.docs.map(d => d.data());
    // Sort by date desc
    orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    res.json(orders);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'orders');
    res.status(500).json([]);
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = req.body;
    
    // Handle dynamic product stock and sold counts inside Firestore
    const productsSnap = await getDocs(collection(firestoreDb, 'products'));
    const products = productsSnap.docs.map(d => d.data());
    for (const item of newOrder.items) {
      const dRef = doc(firestoreDb, 'products', item.product.id);
      const found = products.find(p => p.id === item.product.id);
      if (found) {
        const newStock = Math.max(0, (found.stock || 0) - item.quantity);
        const newSold = (found.soldCount || 0) + item.quantity;
        await updateDoc(dRef, { stock: newStock, soldCount: newSold });
      }
    }

    // Save order document to Firestore
    await setDoc(doc(firestoreDb, 'orders', newOrder.id), newOrder);
    res.status(201).json(newOrder);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'orders');
    res.status(500).json({ error: 'Failed submitting order' });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const orderId = req.params.id.trim();
    // 1. Try exact document match
    const orderRef = doc(firestoreDb, 'orders', orderId);
    const orderDoc = await getDoc(orderRef);
    if (orderDoc.exists()) {
      res.json(orderDoc.data());
      return;
    }
    
    // 2. Fallback: Search all orders for case-insensitive match
    const snap = await getDocs(collection(firestoreDb, 'orders'));
    const matched = snap.docs
      .map(d => d.data())
      .find(o => o.id.toLowerCase() === orderId.toLowerCase());
    
    if (matched) {
      res.json(matched);
      return;
    }
    
    res.status(404).json({ error: 'Order not found' });
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `orders/${req.params.id}`);
    res.status(500).json({ error: 'Failed updating order' });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const orderRef = doc(firestoreDb, 'orders', orderId);
    const orderDoc = await getDoc(orderRef);
    if (orderDoc.exists()) {
      const currentOrder = orderDoc.data();
      const updatedData = { ...currentOrder, ...req.body };
      await setDoc(orderRef, updatedData);

      // Advanced reseller profit disbursement logic:
      // If a reseller order goes from NOT Delivered to Delivered
      if (updatedData.status === 'Delivered' && currentOrder.status !== 'Delivered' && updatedData.isResellerOrder && updatedData.resellerPhone) {
        const resellerRef = doc(firestoreDb, 'users', updatedData.resellerPhone);
        const resellerDoc = await getDoc(resellerRef);
        if (resellerDoc.exists()) {
          const resInfo = resellerDoc.data();
          const currentBal = resInfo.walletBalance || 0;
          const newBal = currentBal + (updatedData.resellerProfit || 0);
          await updateDoc(resellerRef, { walletBalance: newBal });
          console.log(`Disbursed BDT ${updatedData.resellerProfit} to reseller ${updatedData.resellerPhone} wallet. New balance: ${newBal}`);
        }
      }

      res.json(updatedData);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `orders/${req.params.id}`);
    res.status(500).json({ error: 'Failed updating order' });
  }
});

// Phone normalization helper to safely match alternative formatting (+880, 0, etc.)
const normalizePhone = (phone: string): string => {
  if (!phone) return "";
  let digits = phone.trim().replace(/\D/g, ''); // Keep only numbers
  if (digits.startsWith('880')) {
    digits = digits.slice(2); // turn 88019... to 019...
  } else if (digits.startsWith('80') && digits.length === 11) {
    digits = '0' + digits.slice(2);
  } else if (!digits.startsWith('0') && digits.length === 10) {
    digits = '0' + digits;
  }
  return digits;
};

app.get('/api/sellers/courier-stats/:phone', async (req, res) => {
  try {
    const rawPhone = req.params.phone.trim();
    const searchPhoneNorm = normalizePhone(rawPhone);
    const snap = await getDocs(collection(firestoreDb, 'orders'));
    const allOrders = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
    
    // Filter actual orders belonging to this phone number based on normalized shipping phone
    const actualOrders = allOrders.filter(o => {
      const shippingPhone = o.shippingAddress && o.shippingAddress.phone ? o.shippingAddress.phone : '';
      return normalizePhone(shippingPhone) === searchPhoneNorm;
    });
    
    // Standard couriers from user's live reference
    const standardCouriers = ['pathao', 'SteadFast', 'parceldex', 'REDX', 'PAPERFLY', 'Carryboo'];
    const courierStats: { [key: string]: { courier: string; takenOrders: number; takenItems: number; cancelledOrders: number; cancelledItems: number } } = {};
    
    // Initialize standard couriers so they ALWAYS appear in the status table
    for (const name of standardCouriers) {
      courierStats[name] = {
        courier: name,
        takenOrders: 0,
        takenItems: 0,
        cancelledOrders: 0,
        cancelledItems: 0
      };
    }
    
    // Process matching actual orders
    actualOrders.forEach(o => {
      let cName = o.courierName ? o.courierName.trim() : '';
      // Map legacy/variation names to our primary courier grid keys
      if (!cName) {
        cName = 'SteadFast';
      } else if (cName.toLowerCase().includes('steadfast')) {
        cName = 'SteadFast';
      } else if (cName.toLowerCase().includes('pathao')) {
        cName = 'pathao';
      } else if (cName.toLowerCase().includes('redx')) {
        cName = 'REDX';
      } else if (cName.toLowerCase().includes('parceldex')) {
        cName = 'parceldex';
      } else if (cName.toLowerCase().includes('paperfly')) {
        cName = 'PAPERFLY';
      } else if (cName.toLowerCase().includes('carryboo')) {
        cName = 'Carryboo';
      } else {
        cName = 'SteadFast';
      }
      
      if (!courierStats[cName]) {
        courierStats[cName] = { courier: cName, takenOrders: 0, takenItems: 0, cancelledOrders: 0, cancelledItems: 0 };
      }
      
      const itemCount = (o.items || []).reduce((sNum: number, item: any) => sNum + (item.quantity || 1), 0);
      if (o.status === 'Cancelled' || o.status === 'Returned' || o.status === 'Refunded') {
        courierStats[cName].cancelledOrders += 1;
        courierStats[cName].cancelledItems += itemCount;
      } else {
        // Pending, Processing, Shipped, Delivered etc.
        courierStats[cName].takenOrders += 1;
        courierStats[cName].takenItems += itemCount;
      }
    });

    const finalStats = Object.values(courierStats);
    const totalTaken = finalStats.reduce((acc, curr) => acc + curr.takenOrders, 0);
    const totalCancelled = finalStats.reduce((acc, curr) => acc + curr.cancelledOrders, 0);
    const grandTotal = totalTaken + totalCancelled;
    
    res.json({
      phone: rawPhone,
      totalOrders: grandTotal,
      stats: finalStats
    });
  } catch (err) {
    console.error("Failed fetching reseller courier stats:", err);
    res.status(500).json({ error: 'Failed retrieving courier statistics' });
  }
});

// GET buyer reports
app.get('/api/sellers/buyer-reports/:phone', async (req, res) => {
  try {
    const rawPhone = req.params.phone.trim();
    const searchPhoneNorm = normalizePhone(rawPhone);
    
    // 1. Fetch real reports from database
    const reportsSnap = await getDocs(collection(firestoreDb, 'buyer_reports'));
    const realReports = reportsSnap.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as any))
      .filter((r: any) => r.phone && normalizePhone(r.phone) === searchPhoneNorm);

    // 2. Fetch real orders matching this phone number (shippingAddress.phone or resellerPhone)
    const ordersSnap = await getDocs(collection(firestoreDb, 'orders'));
    const allOrders = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
    const matchingOrders = allOrders.filter(o => {
      const shipPhone = o.shippingAddress && o.shippingAddress.phone ? o.shippingAddress.phone : '';
      const resPhone = o.resellerPhone ? o.resellerPhone : '';
      return normalizePhone(shipPhone) === searchPhoneNorm || normalizePhone(resPhone) === searchPhoneNorm;
    });

    // Map real orders to report structures so they can show actual history
    const orderReports = matchingOrders.map((o: any) => {
      const isDelivered = o.status === 'Delivered';
      const isCancelled = o.status === 'Cancelled' || o.status === 'Returned' || o.status === 'Refunded';
      
      let commentText = '';
      let ratingVal = 'neutral';
      
      if (isDelivered) {
        commentText = `অর্ডার (${o.id}): সফলভাবে সম্পন্ন হয়েছে। কাস্টমার পার্সেল বুঝে নিয়েছেন এবং ৳${(o.total || 0).toLocaleString()} সম্পূর্ণ পরিশোধ করা হয়েছে।`;
        ratingVal = 'positive';
      } else if (isCancelled) {
        commentText = `অর্ডার (${o.id}): বাতিল বা রিটার্ন হয়েছে। ডেলিভারি করা সম্ভব হয়নি এবং এটি কুরিয়ার কোম্পানি থেকে ব্যাক দেওয়া হয়েছে।`;
        ratingVal = 'fraud';
      } else {
        commentText = `অর্ডার (${o.id}): বর্তমানে ${o.statusBn || o.status} অবস্থায় লাইভ প্রসেসিংয়ে রয়েছে কুরিয়ার জংশনে।`;
        ratingVal = 'warning';
      }

      return {
        id: `rep-order-${o.id}`,
        phone: rawPhone,
        reporterName: o.resellerName || 'ঘরোয়া বাজার মার্চেন্ট',
        reporterStore: o.resellerShop || 'Ghoroya Partner',
        courierName: o.courierName || 'SteadFast',
        comment: commentText,
        date: o.date || '১২-০৬-২০২৬',
        rating: ratingVal
      };
    });

    // Combine both outputs
    const reports = [...realReports, ...orderReports];
    
    res.json(reports);
  } catch (err) {
    console.error("Failed fetching buyer reports:", err);
    res.status(500).json({ error: 'Failed retrieving comments logs' });
  }
});

// POST buyer report
app.post('/api/sellers/buyer-reports', async (req, res) => {
  try {
    const { phone, reporterName, reporterStore, courierName, comment, rating } = req.body;
    if (!phone || !comment) {
      return res.status(400).json({ error: 'Phone and comment are required' });
    }
    const reportId = `rep-${Date.now()}`;
    const newReport = {
      id: reportId,
      phone: phone.trim(),
      reporterName: reporterName || 'অনামী মার্চেন্ট',
      reporterStore: reporterStore || 'ঘরোয়া সেলার',
      courierName: courierName || 'SteadFast',
      comment: comment.trim(),
      date: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'), // DD-MM-YYYY format
      rating: rating || 'warning'
    };
    
    await setDoc(doc(firestoreDb, 'buyer_reports', reportId), newReport);
    res.json({ success: true, report: newReport });
  } catch (err) {
    console.error("Failed to add buyer report:", err);
    res.status(500).json({ error: 'Failed to write report feedback to database' });
  }
});

// 4. SITE SETTINGS API
app.get('/api/site-settings', async (req, res) => {
  try {
    const d = await getDoc(doc(firestoreDb, 'site_settings', 'main'));
    if (d.exists()) {
      res.json(d.data());
    } else {
      res.json({
        delivery_inside_dhaka: 80,
        delivery_outside_dhaka: 150,
        delivery_groceries_charge: 80,
        delivery_package_charge: 90,
        delivery_fresh_groceries_charge: 100
      });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed site-settings read' });
  }
});

app.post('/api/site-settings', async (req, res) => {
  try {
    await setDoc(doc(firestoreDb, 'site_settings', 'main'), req.body);
    res.json({ success: true, settings: req.body });
  } catch (err) {
    res.status(500).json({ error: 'Failed site-settings write' });
  }
});

// 5. SUPPORT CHATS API
app.get('/api/support_chats', async (req, res) => {
  try {
    const snap = await getDocs(collection(firestoreDb, 'support_chats'));
    res.json(snap.docs.map(d => d.data()));
  } catch (err) {
    res.status(500).json([]);
  }
});

app.post('/api/support_chats', async (req, res) => {
  try {
    const threads = req.body;
    for (const chat of threads) {
      if (chat.id) {
        await setDoc(doc(firestoreDb, 'support_chats', chat.id), chat);
      }
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json([]);
  }
});

// 6. DB GETTERS FOR PANELS (USERS, SELLERS, NOTIFICATIONS, PAYOUTS)
app.get('/api/users', async (req, res) => {
  try {
    const snap = await getDocs(collection(firestoreDb, 'users'));
    res.json(snap.docs.map(d => d.data()));
  } catch (err) {
    res.status(500).json([]);
  }
});
app.post('/api/users', async (req, res) => {
  try {
    const users = req.body;
    for (const u of users) {
      if (u.phone) {
        await setDoc(doc(firestoreDb, 'users', u.phone), u);
      }
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed users post' });
  }
});

app.get('/api/sellers', async (req, res) => {
  try {
    const snap = await getDocs(collection(firestoreDb, 'sellers'));
    res.json(snap.docs.map(d => d.data()));
  } catch (err) {
    res.status(500).json([]);
  }
});
app.post('/api/sellers', async (req, res) => {
  try {
    const sellers = req.body;
    for (const s of sellers) {
      if (s.id) {
        await setDoc(doc(firestoreDb, 'sellers', s.id), s);
      }
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed sellers post' });
  }
});

app.get('/api/notifications', async (req, res) => {
  try {
    const snap = await getDocs(collection(firestoreDb, 'notifications'));
    res.json(snap.docs.map(d => d.data()));
  } catch (err) {
    res.status(500).json([]);
  }
});
app.post('/api/notifications', async (req, res) => {
  try {
    const notifs = req.body;
    for (const n of notifs) {
      if (n.id) {
        await setDoc(doc(firestoreDb, 'notifications', n.id), n);
      }
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed notifications post' });
  }
});

app.get('/api/payouts', async (req, res) => {
  try {
    const snap = await getDocs(collection(firestoreDb, 'payouts'));
    res.json(snap.docs.map(d => d.data()));
  } catch (err) {
    res.status(500).json([]);
  }
});
app.post('/api/payouts', async (req, res) => {
  try {
    const payouts = req.body;
    for (const p of payouts) {
      if (p.id) {
        await setDoc(doc(firestoreDb, 'payouts', p.id), p);
      }
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed payouts post' });
  }
});

// --- NEW RESELLER INTEGRATIONS & ACTIONS ---

// Get all reseller applications
app.get('/api/resellers/applications', async (req, res) => {
  try {
    const snap = await getDocs(collection(firestoreDb, 'reseller_applications'));
    res.json(snap.docs.map(d => d.data()));
  } catch (err) {
    res.status(500).json([]);
  }
});

// Submit a reseller application
app.post('/api/resellers/apply', async (req, res) => {
  try {
    const application = req.body;
    if (!application.id) {
      application.id = `rapp-${Date.now()}`;
    }
    application.status = 'Pending';
    application.date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    await setDoc(doc(firestoreDb, 'reseller_applications', application.id), application);
    
    // Create / ensure user exists in current DB as phone
    const userRef = doc(firestoreDb, 'users', application.phone);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        id: `usr-${Date.now()}`,
        name: application.name,
        email: application.email,
        phone: application.phone,
        role: 'customer',
        status: 'Active',
        walletBalance: 0,
        password: application.password || '123456'
      });
    } else {
      await updateDoc(userRef, {
        password: application.password || '123456'
      });
    }
    
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ error: 'Failed application write' });
  }
});

// Admin approves/rejects application
app.post('/api/resellers/approve', async (req, res) => {
  try {
    const { id, status } = req.body; // status: 'Approved' | 'Rejected'
    const appRef = doc(firestoreDb, 'reseller_applications', id);
    const appDoc = await getDoc(appRef);
    if (appDoc.exists()) {
      const application = appDoc.data();
      await updateDoc(appRef, { status });
      
      if (status === 'Approved') {
        const userRef = doc(firestoreDb, 'users', application.phone);
        const userDoc = await getDoc(userRef);
        
        // Dynamic referral code generation for the newly approved reseller
        const referralCode = `RS${application.phone.slice(-4)}`;

        if (userDoc.exists()) {
          await updateDoc(userRef, { 
            role: 'reseller', 
            password: application.password || '123456',
            referralCode: referralCode 
          });
        } else {
          await setDoc(userRef, {
            id: `usr-${Date.now()}`,
            name: application.name,
            email: application.email,
            phone: application.phone,
            role: 'reseller',
            status: 'Active',
            walletBalance: 0,
            password: application.password || '123456',
            referralCode: referralCode
          });
        }

        // Process referral affiliate rewards sponsor bonus
        const sponsorCode = application.sponsorCode || application.regSponsor;
        if (sponsorCode) {
          const cleanSponsor = sponsorCode.trim().toUpperCase();
          const usersSnap = await getDocs(collection(firestoreDb, 'users'));
          const sponsorUserDoc = usersSnap.docs.find(d => {
            const u = d.data();
            if (u.role !== 'reseller') return false;
            const expectedCode = u.referralCode || `RS${u.phone.slice(-4)}`;
            return expectedCode.toUpperCase() === cleanSponsor || u.phone === cleanSponsor;
          });

          if (sponsorUserDoc) {
            const sponsorData = sponsorUserDoc.data();
            const feePaid = Number(application.feePaid) || 100;
            // ৳100 package -> ৳20 bonus, ৳500 package -> ৳100 bonus (otherwise 20% of fee)
            const bonus = feePaid === 500 ? 100 : (feePaid === 100 ? 20 : Math.round(feePaid * 0.2));

            const curBalance = sponsorData.walletBalance || 0;
            await updateDoc(doc(firestoreDb, 'users', sponsorData.phone), {
              walletBalance: curBalance + bonus
            });

            // Log payout item as referral bonus
            const payoutId = `bonus-${Date.now()}`;
            await setDoc(doc(firestoreDb, 'payouts', payoutId), {
              id: payoutId,
              resellerPhone: sponsorData.phone,
              amount: bonus,
              method: 'Wallet Credit',
              account: `Referring ${application.name} (${application.phone})`,
              status: 'Paid',
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              isBonus: true,
              description: `Affiliate Bonus: recruited ${application.name}`
            });
            console.log(`Successfully credited referral bonus of ৳${bonus} to sponsor ${sponsorData.phone}`);
          }
        }
      } else {
        const userRef = doc(firestoreDb, 'users', application.phone);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          await updateDoc(userRef, { role: 'customer' });
        }
      }
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Application not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Approval failure' });
  }
});

// Reseller Login verification (phone & password)
app.post('/api/resellers/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ error: 'Phone and password are required' });
    }

    // Direct override for Admin credentials to bypass manual registration
    if ((phone === '01518489080' || phone === '01518489088') && password === 'Mostak667825') {
      const userRef = doc(firestoreDb, 'users', phone);
      const userDoc = await getDoc(userRef);
      const dataToSet = {
        phone: phone,
        password: 'Mostak667825',
        role: 'reseller',
        fullName: 'Mostak (Admin)',
        name: 'Mostak (Admin)',
        walletBalance: userDoc.exists() ? (userDoc.data().walletBalance ?? 12500) : 12500,
        accountStatus: 'Active',
        status: 'Approved',
        updatedAt: new Date().toISOString()
      };
      
      if (!userDoc.exists()) {
        (dataToSet as any).createdAt = new Date().toISOString();
      }
      await setDoc(userRef, dataToSet, { merge: true });
      
      await setDoc(doc(firestoreDb, 'reseller_applications', `app_${phone}`), {
        id: `app_${phone}`,
        phone: phone,
        fullName: 'Mostak (Admin)',
        status: 'Approved',
        email: 'paswo.admin@gmail.com',
        resellerExp: 'Yes, experienced.',
        bkashNumber: phone,
        approvedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }, { merge: true });
    }

    const userDoc = await getDoc(doc(firestoreDb, 'users', phone));
    if (userDoc.exists()) {
      const user = userDoc.data();
      // If there is a password set, verify it
      if (user.password && user.password !== password) {
        return res.status(401).json({ error: 'Incorrect phone number or password. / পাসওয়ার্ডটি সঠিক নয়।' });
      }
      
      const ordersSnap = await getDocs(collection(firestoreDb, 'orders'));
      const allOrders = ordersSnap.docs.map(d => d.data());
      const resellerOrders = allOrders.filter(o => o.isResellerOrder && o.resellerPhone === phone);
      
      const payoutsSnap = await getDocs(collection(firestoreDb, 'payouts'));
      const allPayouts = payoutsSnap.docs.map(d => d.data());
      const resellerPayouts = allPayouts.filter(p => p.resellerPhone === phone);

      const appsSnap = await getDocs(collection(firestoreDb, 'reseller_applications'));
      const myApp = appsSnap.docs.map(d => d.data()).find(app => app.phone === phone);

      res.json({
        user: user,
        orders: resellerOrders,
        payouts: resellerPayouts,
        application: myApp || null
      });
    } else {
      res.status(404).json({ error: 'Reseller not registered. Please register first. / এই নম্বরে কোনো রিসেলার রেজিস্ট্রেশন পাওয়া যায়নি।' });
    }
  } catch (err: any) {
    console.error("Reseller login error:", err);
    res.status(500).json({ error: `Server error during reseller login: ${err.message || err}` });
  }
});

// Find reseller statistics
app.get('/api/resellers/profile/:phone', async (req, res) => {
  try {
    const phone = req.params.phone;

    // Direct override auto-provision for Admin count
    if (phone === '01518489080' || phone === '01518489088') {
      const userRef = doc(firestoreDb, 'users', phone);
      const userDoc = await getDoc(userRef);
      const dataToSet = {
        phone: phone,
        password: 'Mostak667825',
        role: 'reseller',
        fullName: 'Mostak (Admin)',
        name: 'Mostak (Admin)',
        walletBalance: userDoc.exists() ? (userDoc.data().walletBalance ?? 12500) : 12500,
        accountStatus: 'Active',
        status: 'Approved',
        updatedAt: new Date().toISOString()
      };
      
      if (!userDoc.exists()) {
        (dataToSet as any).createdAt = new Date().toISOString();
      }
      await setDoc(userRef, dataToSet, { merge: true });
      
      await setDoc(doc(firestoreDb, 'reseller_applications', `app_${phone}`), {
        id: `app_${phone}`,
        phone: phone,
        fullName: 'Mostak (Admin)',
        status: 'Approved',
        email: 'paswo.admin@gmail.com',
        resellerExp: 'Yes, experienced.',
        bkashNumber: phone,
        approvedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }, { merge: true });
    }

    const userDoc = await getDoc(doc(firestoreDb, 'users', phone));
    if (userDoc.exists()) {
      const userInfo = userDoc.data();
      
      const ordersSnap = await getDocs(collection(firestoreDb, 'orders'));
      const allOrders = ordersSnap.docs.map(d => d.data());
      const resellerOrders = allOrders.filter(o => o.isResellerOrder && o.resellerPhone === phone);
      
      const payoutsSnap = await getDocs(collection(firestoreDb, 'payouts'));
      const allPayouts = payoutsSnap.docs.map(d => d.data());
      const resellerPayouts = allPayouts.filter(p => p.resellerPhone === phone);

      const appsSnap = await getDocs(collection(firestoreDb, 'reseller_applications'));
      const myApp = appsSnap.docs.map(d => d.data()).find(app => app.phone === phone);

      res.json({
        user: userInfo,
        orders: resellerOrders,
        payouts: resellerPayouts,
        application: myApp || null
      });
    } else {
      res.status(404).json({ error: 'Reseller not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed getting reseller stats' });
  }
});

// Submit reseller payout request
app.post('/api/resellers/payout', async (req, res) => {
  try {
    const { phone, amount, method, account } = req.body;
    const userRef = doc(firestoreDb, 'users', phone);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const user = userDoc.data();
      const balance = user.walletBalance || 0;
      if (balance < amount) {
        res.status(400).json({ error: 'Insufficient wallet balance' });
        return;
      }
      const newBal = balance - amount;
      await updateDoc(userRef, { walletBalance: newBal });

      const pId = `pay-${Date.now()}`;
      const payoutDoc = {
        id: pId,
        resellerPhone: phone,
        amount,
        method,
        account,
        status: 'Pending',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      await setDoc(doc(firestoreDb, 'payouts', pId), payoutDoc);

      res.status(201).json(payoutDoc);
    } else {
      res.status(404).json({ error: 'User profile not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Payout processing failed' });
  }
});

// Lookup reseller profile by code or phone
app.get('/api/resellers/lookup/:code', async (req, res) => {
  try {
    const code = req.params.code.trim().toUpperCase();
    
    // In case there is no reseller yet for RS1025, let's fall back to any active reseller or Admin account
    let targetPhone = "";
    if (code === 'RS1025') {
      targetPhone = '01518489080';
    }

    const usersSnap = await getDocs(collection(firestoreDb, 'users'));
    let resellerUser = usersSnap.docs.map(doc => doc.data()).find(u => {
      if (u.role !== 'reseller') return false;
      const expectedCode = u.referralCode || `RS${u.phone.slice(-4)}`;
      return expectedCode.toUpperCase() === code || u.phone === code;
    });

    if (resellerUser) {
      res.json({ success: true, reseller: resellerUser });
    } else if (targetPhone) {
      // Auto-provision or find the matching user
      const userDoc = await getDoc(doc(firestoreDb, 'users', targetPhone));
      if (userDoc.exists()) {
        res.json({ success: true, reseller: { ...userDoc.data(), referralCode: 'RS1025' } });
      } else {
        res.status(404).json({ error: 'Reseller not found' });
      }
    } else {
      res.status(404).json({ error: 'Reseller not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to look up reseller' });
  }
});

// Reseller performance leaderboard
app.get('/api/resellers/leaderboard', async (req, res) => {
  try {
    const usersSnap = await getDocs(collection(firestoreDb, 'users'));
    const resellers = usersSnap.docs.map(doc => doc.data()).filter(u => u.role === 'reseller');

    const ordersSnap = await getDocs(collection(firestoreDb, 'orders'));
    const allOrders = ordersSnap.docs.map(doc => doc.data());

    const leaderboard = resellers.map(r => {
      const resellerOrders = allOrders.filter(o => o.resellerPhone === r.phone);
      const ordersCount = resellerOrders.length;
      // Get completed/delivered or overall sales
      const totalSales = resellerOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      const totalCommission = resellerOrders.reduce((sum, o) => sum + (o.resellerProfit || 0), 0);
      
      return {
        phone: r.phone,
        name: r.name,
        shopName: r.shopName || r.shop || `${r.name}'s Store`,
        referralCode: r.referralCode || `RS${r.phone.slice(-4)}`,
        ordersCount,
        totalSales,
        totalCommission
      };
    });

    // Sort by sales descending
    leaderboard.sort((a, b) => b.totalSales - a.totalSales);

    // Make sure we have at least 3 mock/real ones to show Gold/Silver/Bronze
    if (leaderboard.length < 3) {
      const dummyResellers = [
        { phone: "01711111111", name: "Sajid Rahman", shopName: "Sajid's Deal", referralCode: "RS1250", ordersCount: 42, totalSales: 50000, totalCommission: 8500 },
        { phone: "01722222222", name: "Moumita Islam", shopName: "Ghoroya Anondo", referralCode: "RS1025", ordersCount: 31, totalSales: 35000, totalCommission: 5800 },
        { phone: "01733333333", name: "Anisur Rahman", shopName: "Bazar Express", referralCode: "RS9088", ordersCount: 22, totalSales: 24000, totalCommission: 3900 }
      ];
      
      // Merge with real
      const merged = [...leaderboard];
      for (const dummy of dummyResellers) {
        if (!merged.find(m => m.name === dummy.name)) {
          merged.push(dummy);
        }
      }
      merged.sort((a, b) => b.totalSales - a.totalSales);
      res.json(merged.slice(0, 5));
    } else {
      res.json(leaderboard.slice(0, 5));
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate leaderboard' });
  }
});

// Gemini-powered sales demand prediction with smart Bengali fallback
app.post('/api/gemini/demand-prediction', async (req, res) => {
  try {
    const { products } = req.body;
    const prods = products || PRODUCTS;

    const systemPrompt = `You are Ghoroya Bazar's "AI Sales Predictor" (ঘরোয়া বাজার এআই সেলস প্রেডিক্টর).
    Your task is to analyze the product stock levels and categories, and output a highly realistic, professional AI demand prediction report for resellers in Bangladesh.
    Make sure to specifically identify items with predicted demand shifts in the coming week (e.g., Soybean oil, organic Honey, grocery combo box, raw items), note which items have low stock, and flag items that are likely to sell out rapidly.

    Write the predictions fully in Bengali (বাংলা).
    Examples structure:
    "আগামী সপ্তাহে সয়াবিন তেলের চাহিদা বাড়তে পারে।"
    "এই পণ্য স্টকে কম আছে।"
    "এই পণ্য দ্রুত শেষ হবে।"

    Return a list of exactly 3 relevant demand alerts/notices.
    RESPONSE FORMAT REQUIREMENT:
    Output strictly a JSON object matching this schema:
    {
      "predictions": [
        {
          "productName": "Saffola Soybean Oil",
          "alertType": "High Demand / Low Stock / Fast Selling",
          "message": "আগামী সপ্তাহে সয়াবিন তেলের চাহিদা ৮৫% বাড়তে পারে এবং এটি দ্রুত শেষ হওয়ার সম্ভাবনা রয়েছে।"
        }
      ]
    }`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Perform demand prediction for these products: ${JSON.stringify(prods.slice(0, 10))}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['predictions'],
          properties: {
            predictions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ['productName', 'alertType', 'message'],
                properties: {
                  productName: { type: Type.STRING },
                  alertType: { type: Type.STRING },
                  message: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text);
    res.json(result);
  } catch (err: any) {
    console.warn("Demand prediction error (Graceful Fallback Mode):", err.message || err);
    // fallback clean predictions if call fails
    res.json({
      predictions: [
        {
          productName: "সয়াবিন তেল (Soybean Oil)",
          alertType: "High Demand (উচ্চ চাহিদা)",
          message: "আগামী সপ্তাহে সয়াবিন তেলের চাহিদা ১৫% বাড়তে পারে। আমাদের ডিস্ট্রিবিউটর হাব অনুযায়ী সয়াবিন তেল দ্রুত শেষ হতে পারে।"
        },
        {
          productName: "খাঁটি মধু (Honey)",
          alertType: "Low Stock (কম স্টক)",
          message: "এই পণ্যটি আমাদের স্টকে খুবই সামান্য আছে। বর্ষা মৌসুমের কারণে এর চাহিদা ব্যাপক বৃদ্ধি পাওয়ার সম্ভাবনা রয়েছে।"
        },
        {
          productName: "ঘরোয়া স্পেশাল ক্যাটেরিং কম্বো",
          alertType: "Fast Selling (দ্রুত বিক্রি)",
          message: "রিসেলার অগ্রিম বুকিং বৃদ্ধির কারণে এই কম্বো পণ্যটি আগামী ৪২ ঘণ্টার ভিতর শেষ হয়ে যাবে।"
        }
      ]
    });
  }
});

// Configure Vite and Asset Serving
async function startServer() {
  // Ensure database has necessary dynamic seeds
  await ensureSeeded();

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Daraz Express App] Server running on http://localhost:${PORT}`);
  });
}

startServer();

