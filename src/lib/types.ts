import { ObjectId } from 'mongodb';

/* ================= CATEGORY ================= */

export interface Category {
  _id?: ObjectId;
  id: string;
  name: string;
  slug: string;
  featured: boolean;
  image: string;
  status: 'active' | 'inactive';
}

/* ================= PRODUCT ================= */

export interface ProductUnit {
  unit: string;
  price: number;
}

export type Product = {
    _id?: string;
  id: string;
  name: string;
  description: string;
  slug: string;

  category: string;
  categoryName?: string;

  hsCode: string;

  /* 🔹 OLD (keep for backward compatibility) */
  units?: ProductUnit[];

  /* 🔹 NEW (current product model) */
  minOrderQty?: string;
  discountedPrice?: number;
  sellingPrice?: number;

  images: string[];
  primaryImage: string;

  featured: boolean;
  status: 'active' | 'inactive';
};

/* ================= CART ================= */

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  name: string;
  variantName: string;
  image: string;
}

/* ================= ORDER ================= */

export interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  country: string;
  zip: string;
}

export interface Order {
  _id?: ObjectId;
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  paymentId?: string;
  createdAt: string;
}

/* ================= USER ================= */

export interface User {
  _id?: ObjectId;
  id: string;
  user_id: string;
  name: string;
  email: string;
  password?: string;
  role: 'User' | 'Admin';
}
