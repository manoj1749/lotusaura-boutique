"use client";

import Link from "next/link";
import { WhatsApp } from "@/components/icons/WhatsApp";
import { ProductWithTag } from "@/types/product";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/cart-utils";

import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

interface ProductCardProps {
  product: ProductWithTag;
  whatsappNumber?: string;
  hideActionButtons?: boolean;
}

export function ProductCard({
  product,
  whatsappNumber = WHATSAPP_NUMBER,
  hideActionButtons = false,
}: ProductCardProps) {
  const handleWhatsApp = () => {
    const text = `Hi, I'm interested in ${product.name} priced at ${formatPrice(product.price)}. Is it available?`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="group relative bg-card text-card-foreground rounded-lg overflow-hidden border border-border/40 hover:border-primary/20 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
        </Link>

        {product.tag ? (
          <div className="absolute top-2 left-2 pointer-events-none z-10">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide ${product.tagColor ? product.tagColor : "bg-primary text-primary-foreground"}`}
            >
              {product.tag}
            </span>
          </div>
        ) : null}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1 gap-1">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-display text-sm leading-snug line-clamp-2 group-hover:text-primary transition">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm font-bold">{formatPrice(product.price)}</p>

        {!hideActionButtons && (
          <Button
            size="sm"
            className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white h-8 px-2 gap-1 text-[10px] font-bold tracking-wide"
            onClick={handleWhatsApp}
          >
            <WhatsApp className="h-3.5 w-3.5 fill-current shrink-0" />
            Enquire on WhatsApp
          </Button>
        )}
      </div>
    </div>
  );
}
