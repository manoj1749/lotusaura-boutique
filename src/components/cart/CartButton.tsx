"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function CartButton() {
  const { cart, toggleCart } = useCart();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (cart.totalItems > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cart.totalItems]);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={toggleCart}
      aria-label="Open cart"
    >
      <ShoppingBag className="h-5 w-5" />
      {cart.totalItems > 0 && (
        <span
          className={cn(
            "absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center transition-transform",
            animate ? "scale-125" : "scale-100"
          )}
        >
          {cart.totalItems}
        </span>
      )}
    </Button>
  );
}
