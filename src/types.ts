/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  nameBn: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewsCount: number;
  category: string;
  categoryBn: string;
  image: string;
  images?: string[]; // Multiple images for carousel zoom
  description: string;
  descriptionBn: string;
  stock: number;
  flashSale?: boolean;
  soldCount: number;
  specifications: { [key: string]: string };
  specificationsBn: { [key: string]: string };
  weight?: number;          // Reseller item weight in kg
  resellerPrice?: number;   // Reseller special wholesale price
  purchasePrice?: number;   // Purchase price representing the cost of the item
  code?: string;            // Product identification code
  subcategory?: string;     // Product subcategory ID
  subcategoryBn?: string;   // Product subcategory Bengali name
  merchantName?: string;    // Associated merchant name
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  shippingCharge: number;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city?: string;
    district?: string;
    upazila?: string;
  };
  paymentMethod: string;
  orderNotes?: string;
  status: string;
  statusBn: string;
  isResellerOrder?: boolean;
  resellerPhone?: string;
  customerPrice?: number;
  packagingFee?: number;
  commissionDeducted?: number;
  resellerProfit?: number;
  courierName?: string;
  courierTrackingId?: string;
  courierStatus?: string;
  purchasePrice?: number; // admin order buying/purchase cost
  profit?: number;        // admin order custom profit
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant' | 'admin';
  text: string;
  timestamp: string;
  recommendedProducts?: Product[];
}

