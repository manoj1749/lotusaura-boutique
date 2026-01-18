"use client";

import { useMemo, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductSort } from "@/components/products/ProductSort";
import { PRODUCTS } from "@/lib/data";
import { SortOption } from "@/types/product";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

// Get unique categories
const CATEGORIES = Array.from(new Set(PRODUCTS.map(p => p.category).filter(Boolean))) as string[];

function CollectionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State for client-side filtering (URL matching would be ideal for shareability)
  // For simplicity MVP, using state + initial check from URL
  const selectedCategoryParam = searchParams.get('category');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    selectedCategoryParam ? [selectedCategoryParam] : []
  );
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (selectedCategories.length > 0) {
      result = result.filter(p => p.category && selectedCategories.includes(p.category));
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        // Assuming createdAt is ISO strings
        result.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
        });
        break;
    }

    return result;
  }, [selectedCategories, sortBy]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories(prev => {
      if (checked) return [...prev, category];
      return prev.filter(c => c !== category);
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSortBy('newest');
    router.push('/collections'); // Clear URL params
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 shrink-0">
          <ProductFilters 
            categories={CATEGORIES}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            onClearFilters={clearFilters}
          />
        </div>

        {/* Mobile Filter & Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-display text-3xl font-bold">All Products</h1>
            
            <div className="flex items-center gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="md:hidden">
                      <Filter className="mr-2 h-4 w-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <div className="pt-6">
                      <ProductFilters 
                        categories={CATEGORIES}
                        selectedCategories={selectedCategories}
                        onCategoryChange={handleCategoryChange}
                        onClearFilters={clearFilters}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

              <ProductSort value={sortBy} onValueChange={setSortBy} />
            </div>
          </div>

          <div className="mb-4 text-sm text-muted-foreground">
            Showing {filteredProducts.length} products
          </div>

          <ProductGrid products={filteredProducts} showAddToCart={true} />
        </div>
      </div>
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <main className="bg-background min-h-screen flex flex-col">
      <AnnouncementBar />
      <Navbar />
      <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading...</div>}>
        <CollectionsContent />
      </Suspense>
      <Footer />
    </main>
  );
}
