"use client";

import Link from "next/link";
import { WhatsApp } from "@/components/icons/WhatsApp";
import { ProductWithTag } from "@/types/product";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/cart-utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

interface ProductCardProps {
  product: ProductWithTag;
  whatsappNumber?: string;
  hideActionButtons?: boolean;
  // Additional images for grid display (optional)
  // additionalImage?: string;
}

export function ProductCard({ 
  product, 
  whatsappNumber = WHATSAPP_NUMBER,
  hideActionButtons = false,
  // additionalImage
}: ProductCardProps) {
  const handleWhatsApp = () => {
    const text = `Hi, I'm interested in ${product.name} priced at ${formatPrice(product.price)}. Is it available?`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");
  };

  // Truncate description for card view
  const truncatedDescription = product.description 
    ? product.description.length > 80 
      ? product.description.substring(0, 80) + "..." 
      : product.description
    : null;

  return (
    <div className="group relative bg-card text-card-foreground rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-primary/20 overflow-hidden flex flex-col h-full">
      {/* 2-Image Grid Layout - Mobile First */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          {/* <div className="grid grid-cols-2 gap-0.5 h-full"> */}
            {/* Main Image - Left */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {/* <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            /> */}
            {/* Second Image - Right (or duplicate if no additional image) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {/* <img
              src={additionalImage || product.imageUrl}
              alt={`${product.name} - view 2`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            /> */}
          {/* </div> */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
        </Link>
        {product.tag ? (
          <div className="absolute top-2 left-2 pointer-events-none z-10">
            <span 
              className={`text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wide ${product.tagColor ? product.tagColor : 'bg-primary text-primary-foreground'}`}
            >
              {product.tag}
            </span>
          </div>
        ) : null}
      </div>

      <div className="p-4 text-center flex flex-col flex-1">
        <Link href={`/products/${product.id}`} className="inline-block">
          <h3 className="font-display text-sm mb-2 group-hover:text-primary transition line-clamp-4 leading-snug">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-base font-bold mb-3">
          {formatPrice(product.price)}
        </p>

        {/* Description Accordion */}
        {product.description && (
          <Accordion type="single" collapsible className="w-full mb-3">
            <AccordionItem value="description" className="border-none">
              <AccordionTrigger className="text-xs font-medium py-2 hover:no-underline">
                Details
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground text-left pb-2">
                <p className="mb-2 whitespace-pre-line">{truncatedDescription}</p>
                <Link 
                  href={`/products/${product.id}`}
                  className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                >
                  Read More →
                </Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {!hideActionButtons && (
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white gap-2 text-xs py-2 mt-auto"
            onClick={handleWhatsApp}
          >
            <WhatsApp className="h-4 w-4 fill-current" />
            Enquire on WhatsApp
          </Button>
        )}
      </div>
    </div>
  );
}
