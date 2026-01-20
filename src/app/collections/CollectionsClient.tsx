"use client";

import { useMemo, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductSort } from "@/components/products/ProductSort";
import { SortOption } from "@/types/product";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useEffect } from "react";

// Get unique categories

function CollectionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category).filter(Boolean))) as string[],
    [products]
  );

  const [loadingProducts, setLoadingProducts] = useState(true);
  
  // State for client-side filtering (URL matching would be ideal for shareability)
  // For simplicity MVP, using state + initial check from URL
  const selectedCategoryParam = searchParams.get('category');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    selectedCategoryParam ? [selectedCategoryParam] : []
  );
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const filteredProducts = useMemo(() => {
    let result = [...products];

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
  }, [products, selectedCategories, sortBy]);

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

  useEffect(() => {
    (async () => {
      try {
        setLoadingProducts(true);
        const res = await fetch("/api/admin/products", { cache: "no-store" });
        const data = await res.json();
        setProducts(data.products ?? []);
      } finally {
        setLoadingProducts(false);
      }
    })();
  }, []);

  const hasFilters = selectedCategories.length > 0;
  const isCatalogEmpty = !loadingProducts && products.length === 0;
  const isFilteredEmpty =
    !loadingProducts && products.length > 0 && filteredProducts.length === 0 && hasFilters;

  const PAGE_SIZE = 9; // change to 6/12 if you want
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, page]);
  const startIndex = filteredProducts.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(page * PAGE_SIZE, filteredProducts.length);

  useEffect(() => {
    setPage(1);
  }, [selectedCategories, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 shrink-0">
          <ProductFilters 
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            onClearFilters={clearFilters}
          />
        </div>

        {/* Mobile Filter & Content */}
        <div className="flex-1">
        <div className="mb-6">
        {/* Title */}
        <h1 className="font-display text-4xl font-bold leading-none md:text-3xl">
          All <br className="md:hidden" />
          Products
        </h1>

        {/* Controls */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: Filters button */}
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden w-full sm:w-auto justify-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="pt-6">
                  <ProductFilters
                    categories={categories}
                    selectedCategories={selectedCategories}
                    onCategoryChange={handleCategoryChange}
                    onClearFilters={clearFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Right: Sort */}
          <div className="w-full sm:w-[260px]">
            <ProductSort value={sortBy} onValueChange={setSortBy} />
          </div>
          </div>
          </div>        
          {loadingProducts ? (
            <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">
              Loading products...
            </div>
          ) : isCatalogEmpty ? (
            <div className="py-16 text-center">
              <p className="font-display text-xl font-semibold">No products available yet.</p>
              <p className="mt-2 text-sm text-muted-foreground">Check back soon ✨</p>
            </div>
          ) : isFilteredEmpty ? (
            <div className="py-16 text-center">
              <p className="font-display text-xl font-semibold">No products matching your criteria.</p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          ) : (
            <>
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {startIndex}-{endIndex} of {filteredProducts.length} products
            </div>
            <ProductGrid products={paginatedProducts} showAddToCart={true} />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </p>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CollectionsPage() {
  return (
    // <main className="bg-background min-h-screen flex flex-col">
    //   <AnnouncementBar />
    //   <Navbar />
    //   <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading...</div>}>
    //     <CollectionsContent />
    //   </Suspense>
    //   <Footer />
    // </main>
    <main className="bg-background min-h-screen flex flex-col">
      <AnnouncementBar />
      <Navbar />
      <div className="flex-1">
        <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading...</div>}>
          <CollectionsContent />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}
