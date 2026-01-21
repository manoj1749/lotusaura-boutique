"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import Image from "next/image";

interface ProductImage {
  id: number | string;
  url: string;
  alt?: string;
}

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Fallback if no images provided
  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-[3/4] bg-muted/30 rounded-lg flex items-center justify-center text-muted-foreground">
        No Image
      </div>
    );
  }

  const mainImage = images[selectedIndex];

  return (
    <div className="space-y-6">
      {/* Main Image */}
      <div className="relative aspect-[3/4] bg-muted overflow-hidden rounded-lg shadow-sm border border-black/5 group">
        <Image
          src={mainImage?.url}
          alt={mainImage?.alt || productName}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />
        
        {/* Wishlist Button Overlay */}
        <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white text-muted-foreground hover:text-red-500 transition-colors shadow-sm z-10">
          <Heart className="h-5 w-5" />
        </button>
      </div>

      {/* Thumbnails - Only show if > 1 image */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                "relative aspect-[3/4] bg-muted rounded-md overflow-hidden border transition-all duration-200",
                selectedIndex === idx 
                  ? "border-primary ring-2 ring-primary/20 opacity-100" 
                  : "border-transparent opacity-70 hover:opacity-100 hover:border-primary/50"
              )}
            >
              <Image
                src={img.url}
                alt={img.alt || `View ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 150px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
