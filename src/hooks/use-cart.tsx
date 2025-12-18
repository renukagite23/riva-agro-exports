"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import type { CartItem } from '@/lib/types';
import { useToast } from './use-toast';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const addToCart = useCallback((itemToAdd: Omit<CartItem, 'quantity'>) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.variantId === itemToAdd.variantId);
      if (existingItem) {
        return prevItems.map(item =>
          item.variantId === itemToAdd.variantId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Ensure we don't add duplicates if logic ever fails upstream
      if (prevItems.some(item => item.variantId === itemToAdd.variantId)) {
        return prevItems;
      }
      return [...prevItems, { ...itemToAdd, quantity: 1 }];
    });
    toast({
      title: 'Added to cart',
      description: `${itemToAdd.name} (${itemToAdd.variantName}) has been added to your cart.`,
    });
  }, [toast]);

  const removeFromCart = useCallback((variantId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.variantId !== variantId));
     toast({
      title: 'Item removed',
      description: 'The item has been removed from your cart.',
    });
  }, [toast]);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.variantId === variantId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
