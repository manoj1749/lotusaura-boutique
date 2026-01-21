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
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useEffect } from "react";
import { PaginationControl } from "@/components/ui/PaginationControl"; // Import added

// Get unique categories

function CollectionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL params for pagination
  const pageParam = searchParams.get("page");
  const currentPage = Number(pageParam ?? "1");

  const [products, setProducts] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingProducts, setLoadingProducts] = useState(true);
  
  // Filtering & Sorting State
  const selectedCategoryParam = searchParams.get('category');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    selectedCategoryParam ? [selectedCategoryParam] : []
  );
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Fetch data when page changes
  useEffect(() => {
    (async () => {
      try {
        setLoadingProducts(true);
        const params = new URLSearchParams();
        params.set("page", currentPage.toString());
        // Note: Currently API doesn't support category filtering, so this will only filter the *current page* of results client-side.
        // TODO: Update API to support server-side filtering.
        
        const res = await fetch(`/api/admin/products?${params.toString()}`, { cache: "no-store" });
        const data = await res.json();
        
        // Handle both API response formats (paginated vs non-paginated if we revert API)
        if (data.products) {
            setProducts(data.products);
            setTotalPages(data.totalPages ?? 1);
        } else {
            setProducts([]);
        }
      } catch (e) {
          console.error("Failed to fetch products", e);
      } finally {
        setLoadingProducts(false);
      }
    })();
  }, [currentPage]);

  // Derived unique categories (ideally this should come from a separate API to show ALL categories)
  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category).filter(Boolean))) as string[],
    [products]
  );

  // Client-side filtering/sorting of the *fetched* page
  // (This is a temporary limitation until backend filtering is implemented)
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
    const params = new URLSearchParams(searchParams.toString());
    params.delete('category');
    router.push(`/collections?${params.toString()}`);
  };

  const hasFilters = selectedCategories.length > 0;
  const isCatalogEmpty = !loadingProducts && products.length === 0;
  const isFilteredEmpty = !loadingProducts && products.length > 0 && filteredProducts.length === 0 && hasFilters;

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
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden w-full sm:w-auto justify-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] max-w-sm px-6 py-6">
                <SheetTitle className="sr-only">Filters</SheetTitle>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-semibold">Filters</h2>
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                    Reset
                  </Button>
                </div>
                <div className="space-y-8">
                  <ProductFilters
                    showHeader={false}
                    categories={categories}
                    selectedCategories={selectedCategories}
                    onCategoryChange={handleCategoryChange}
                    onClearFilters={clearFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

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
               Showing {filteredProducts.length} results on this page
             </div>
             <ProductGrid products={filteredProducts} showAddToCart={true} />
 
             <PaginationControl 
                totalPages={totalPages} 
                hasNextPage={currentPage < totalPages} 
                hasPrevPage={currentPage > 1}
                totalSize={0}
             />
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
