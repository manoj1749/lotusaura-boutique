import { CartItem } from "@/types/cart";
import { calculateTotal, formatPrice } from "./cart-utils";

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "916281287188";

export const generateWhatsAppMessage = (items: CartItem[], phoneNumber: string): string => {
  if (items.length === 0) return "";

  const greeting = "Hello! I'd like to order the following items from Lotus Aura:\n\n";
  
  const itemsList = items.map((item, index) => {
    const price = typeof item.product.price === 'string'
      ? parseFloat((item.product.price as string).replace(/[^0-9.]/g, ''))
      : item.product.price;
      
    const itemTotal = price * item.quantity;
    
    return `${index + 1}. ${item.product.name} (Qty: ${item.quantity}) - ${formatPrice(itemTotal)}`;
  }).join("\n");
  
  const total = calculateTotal(items);
  const footer = `\n\nTotal: ${formatPrice(total)}\n\nPlease confirm availability and provide payment details.\n\nThank you!`;
  
  return `${greeting}${itemsList}${footer}`;
};

export const getWhatsAppLink = (phoneNumber: string, message: string): string => {
  // Remove any non-numeric characters from phone number
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
};
