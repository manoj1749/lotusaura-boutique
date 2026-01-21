"use client";

import Link from "next/link";
import { MessageCircle, ShoppingCart } from "lucide-react";
import { ProductWithTag } from "@/types/product";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/cart-utils";

import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

interface ProductCardProps {
  product: ProductWithTag;
  showAddToCart?: boolean;
  whatsappNumber?: string;
  hideActionButtons?: boolean;
}

export function ProductCard({ 
  product, 
  showAddToCart = false, 
  whatsappNumber = WHATSAPP_NUMBER,
  hideActionButtons = false
}: ProductCardProps) {
  const { addToCart } = useCart();

  const handleWhatsApp = () => {
    const text = `Hi, I'm interested in ${product.name} priced at ${formatPrice(product.price)}. Is it available?`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="group relative bg-card text-card-foreground rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-primary/20 overflow-hidden flex flex-col h-full">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
        </Link>
        {product.tag ? (
          <div className="absolute top-4 left-4 pointer-events-none">
            <span 
              className={`text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wide ${product.tagColor ? product.tagColor : 'bg-primary text-primary-foreground'}`}
            >
              {product.tag}
            </span>
          </div>
        ) : null}
      </div>

      <div className="p-6 text-center flex flex-col flex-1">
        <Link href={`/products/${product.id}`} className="inline-block">
          <h3 className="font-display text-xl mb-1 group-hover:text-primary transition line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[2.5em]">
          {product.description}
        </p>
        <p className="text-lg font-bold mb-6 mt-auto">
          {formatPrice(product.price)}
        </p>

        {!hideActionButtons && (showAddToCart ? (
          <Button 
            className="w-full gap-2" 
            onClick={() => addToCart(product)}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        ) : (
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
            onClick={handleWhatsApp}
          >
            <MessageCircle className="h-4 w-4" />
            Enquire on WhatsApp
          </Button>
        ))}
      </div>
    </div>
  );
}
