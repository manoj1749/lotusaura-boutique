"use client";

import Link from "next/link";

type CategoryNavItem = {
  name: string;
  imageUrl: string;
};

export function CategoryNav({ categories }: { categories: CategoryNavItem[] }) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="pt-6 pb-2 bg-background">
      <div className="mx-auto max-w-4xl">
        {/* Horizontal scrollable carousel — no wrapping, works for any number of categories */}
        <div
          className="flex flex-row gap-6 overflow-x-auto px-4 pb-2 justify-center"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/collections?category=${encodeURIComponent(category.name)}`}
              prefetch={false}
              className="flex flex-col items-center gap-2 group flex-shrink-0"
            >
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-all duration-300 shadow-sm group-hover:shadow-md bg-muted">
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.src = "/hero-saree-woman-white-bg.png";
                  }}
                />
              </div>

              <span className="text-xs md:text-sm font-medium text-center text-foreground/80 group-hover:text-primary transition-colors">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}