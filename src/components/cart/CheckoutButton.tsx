"use client";

import { WhatsApp } from "@/components/icons/WhatsApp";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { getWhatsAppLink, WHATSAPP_NUMBER } from "@/lib/whatsapp";

interface CheckoutButtonProps {
  phoneNumber?: string;
  disabled?: boolean;
}

export function CheckoutButton({ phoneNumber = WHATSAPP_NUMBER, disabled }: CheckoutButtonProps) {
  const { generateWhatsAppMessage, cart } = useCart();

  const handleCheckout = () => {
    const message = generateWhatsAppMessage();
    const link = getWhatsAppLink(phoneNumber, message);
    window.open(link, "_blank");
  };

  return (
    <Button
      className="w-full bg-green-600 hover:bg-green-700 text-white gap-2 h-12 text-base"
      onClick={handleCheckout}
      disabled={disabled || cart.items.length === 0}
    >
      <WhatsApp className="h-5 w-5 fill-current" />
      Checkout on WhatsApp
    </Button>
  );
}
