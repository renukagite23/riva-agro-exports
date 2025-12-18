import { ObjectId } from 'mongodb';

export interface Category {
  _id?: ObjectId;
  id: string;
  name: string;
  slug: string;
  featured: boolean;
  image: string;
  status: 'active' | 'inactive';
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  _id?: ObjectId;
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string; // category slug
  variants: ProductVariant[];
  hsCode: string;
  images: string[];
  featured: boolean;
  status: 'active' | 'inactive';
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  name: string;
  variantName: string;
  image: string;
}

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


export interface User {
  _id?: ObjectId;
  id: string;
  user_id: string;
  name: string;
  email: string;
  password?: string;
  role: 'User' | 'Admin';
}
