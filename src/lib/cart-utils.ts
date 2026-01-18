import { CartItem } from "@/types/cart";

export const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    // Check if price is a string number (e.g. from some APIs) or pre-formatted string
    // Our Product type has price as number, but handling safety just in case
    const price = typeof item.product.price === 'string' 
      ? parseFloat((item.product.price as string).replace(/[^0-9.]/g, '')) 
      : item.product.price;
      
    return total + (price * item.quantity);
  }, 0);
};

export const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0);
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};
