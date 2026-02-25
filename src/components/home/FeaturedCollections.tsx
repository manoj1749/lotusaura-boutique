"use client";

import { useState } from "react";
import Link from "next/link";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductWithTag } from "@/types/product";

type Props = {
  products: ProductWithTag[];
};

export function FeaturedCollections({ products }: Props) {
  const [tab, setTab] = useState<"all" | "new">("all");

  if (products.length === 0) return null;

  // New arrivals: first 4 products (already sorted newest-first by the server)
  const newArrivals = products.slice(0, Math.min(4, products.length));
  const displayed = tab === "all" ? products : newArrivals;

  return (
    <section id="collections" className="pt-12 pb-20 bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="text-primary text-xs font-bold uppercase tracking-widest">
            Our Selection
          </div>
          <h2 className="font-display text-4xl mt-2 mb-4">Featured Collections</h2>
          <div className="h-1 w-24 bg-primary mx-auto rounded-full" />
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <button
            onClick={() => setTab("all")}
            className={`px-6 py-2 text-xs font-bold uppercase tracking-widest border transition ${
              tab === "all"
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setTab("new")}
            className={`px-6 py-2 text-xs font-bold uppercase tracking-widest border transition ${
              tab === "new"
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            New Arrivals
          </button>
        </div>

        <ProductGrid products={displayed} />

        <div className="mt-10 text-center">
          <Link
            href="/collections"
            className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary uppercase tracking-widest text-xs font-bold hover:bg-primary hover:text-white transition"
          >
            View All Collections
          </Link>
        </div>
      </div>
    </section>
  );
}
