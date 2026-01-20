"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { toast } from "sonner";
import { Product } from "@/types/product";
import { Cart, CartItem, CartContextType } from "@/types/cart";
import { calculateTotal, calculateItemCount, formatPrice } from "@/lib/cart-utils";
import { generateWhatsAppMessage, getWhatsAppLink } from "@/lib/whatsapp";
import { usePathname, useSearchParams } from "next/navigation";

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "lotusaura-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({
    items: [],
    totalItems: 0,
    totalPrice: 0,
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error("Failed to parse cart from local storage:", error);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.items.findIndex(
        (item) => item.product.id === product.id
      );

      let newItems;
      if (existingItemIndex > -1) {
        // Update existing item
        newItems = [...prevCart.items];
        newItems[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        newItems = [...prevCart.items, { product, quantity }];
      }

      toast.success(`Added ${product.name} to cart`);

      return {
        items: newItems,
        totalItems: calculateItemCount(newItems),
        totalPrice: calculateTotal(newItems),
      };
    });
    
    // Open cart drawer when adding item
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter((item) => item.product.id !== productId);
      
      return {
        items: newItems,
        totalItems: calculateItemCount(newItems),
        totalPrice: calculateTotal(newItems),
      };
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;

    setCart((prevCart) => {
      const newItems = prevCart.items.map((item) => {
        if (item.product.id === productId) {
          return { ...item, quantity };
        }
        return item;
      });

      return {
        items: newItems,
        totalItems: calculateItemCount(newItems),
        totalPrice: calculateTotal(newItems),
      };
    });
  };

  const clearCart = () => {
    setCart({
      items: [],
      totalItems: 0,
      totalPrice: 0,
    });
    localStorage.removeItem(STORAGE_KEY);
  };

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  }

  const generateWhatsAppMessageFunc = () => {
    // Basic placeholder number, will be replaced by environment variable or prop in Checkout button
    // The actual sending happens in the component which has access to the phone number
    return generateWhatsAppMessage(cart.items, ""); 
  };

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Close cart on ANY navigation (back, forward, link click)
    setIsCartOpen(false);
  }, [pathname, searchParams]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        toggleCart,
        generateWhatsAppMessage: generateWhatsAppMessageFunc,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
