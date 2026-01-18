"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem as CartItemType } from "@/types/cart";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/cart-utils";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  // Handle price if it's a string
  const price = typeof product.price === 'string'
      ? parseFloat((product.price as string).replace(/[^0-9.]/g, ''))
      : product.price;

  return (
    <div className="flex gap-4 py-4 border-b border-border/50">
      <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted shrink-0">
        {/* Using standard img for now to match current codebase style if Next Image setup is tricky with external domains */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-col flex-1 gap-1">
        <h4 className="font-semibold text-sm line-clamp-1">{product.name}</h4>
        <p className="text-sm text-muted-foreground">{formatPrice(price)}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={() => updateQuantity(product.id, quantity - 1)}
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-xs w-4 text-center">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={() => updateQuantity(product.id, quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
            onClick={() => removeFromCart(product.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
