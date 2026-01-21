"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { ProductWithTag } from "@/types/product";

interface AddToCartButtonProps {
  product: ProductWithTag;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  return (
    <Button 
      className="w-full gap-2 py-6 text-sm font-bold tracking-wide uppercase transition-all shadow-md bg-black text-white hover:bg-black/90 rounded-full"
      onClick={() => addToCart(product)}
    >
      Add to Cart
    </Button>
  );
}
