"use client";

import Link from "next/link";

interface Category {
  name: string;
  slug: string;
  imageUrl: string;
}

// Default categories - customize these based on your actual categories
const CATEGORIES: Category[] = [
  {
    name: "Sarees",
    slug: "sarees",
    imageUrl: "/categories/sarees.jpg", // Add actual image
  },
  {
    name: "Salwar Suits",
    slug: "salwar-suits",
    imageUrl: "/categories/salwar.jpg",
  },
  {
    name: "Lehengas",
    slug: "lehengas",
    imageUrl: "/categories/lehenga.jpg",
  },
  {
    name: "Kurtis",
    slug: "kurtis",
    imageUrl: "/categories/kurti.jpg",
  },
  {
    name: "Dupattas",
    slug: "dupattas",
    imageUrl: "/categories/dupatta.jpg",
  },
  {
    name: "Blouses",
    slug: "blouses",
    imageUrl: "/categories/blouse.jpg",
  },
];

export function CategoryNav() {
  return (
    <section className="py-8 bg-background">
      <div className="mx-auto max-w-6xl px-4">
        {/* Mobile Optimized Grid - 3 columns */}
        <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/collections?category=${encodeURIComponent(category.name)}`}
              className="flex flex-col items-center gap-2 group"
            >
              {/* Circular Image */}
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-all duration-300 shadow-sm group-hover:shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    // Fallback to a placeholder if image not found
                    e.currentTarget.src = "/hero-saree-woman-white-bg.png";
                  }}
                />
              </div>
              {/* Category Name */}
              <span className="text-xs md:text-sm font-medium text-center group-hover:text-primary transition-colors">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
