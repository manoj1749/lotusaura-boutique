"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { PaginationControl } from "@/components/ui/PaginationControl";

type ProductCard = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category: string | null;
  tags: string | null;
  tagColor: string | null;
  createdAt: string | null;
};

export default function CollectionsClient({
  initialProducts,
  currentPage,
  totalPages,
  initialCategory,
  initialSort,
}: {
  initialProducts: ProductCard[];
  currentPage: number;
  totalPages: number;
  initialCategory: string;
  initialSort: SortOption;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [sortBy, setSortBy] = useState<SortOption>(initialSort);

  // categories from current page data
  const categories = useMemo(
    () =>
      Array.from(new Set(initialProducts.map((p) => p.category).filter(Boolean))) as string[],
    [initialProducts]
  );

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (selectedCategories.length > 0) {
      result = result.filter((p) => p.category && selectedCategories.includes(p.category));
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "newest":
        result.sort((a, b) => {
          const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return db - da;
        });
        break;
    }
    return result;
  }, [initialProducts, selectedCategories, sortBy]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories((prev) => {
      if (checked) return [...prev, category];
      return prev.filter((c) => c !== category);
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSortBy("newest");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    router.push(`/collections?${params.toString()}`);
  };

  // ✅ server-driven pagination (fast, cacheable)
  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/collections?${params.toString()}`);
  };

  const hasFilters = selectedCategories.length > 0;
  const isFilteredEmpty = initialProducts.length > 0 && filteredProducts.length === 0 && hasFilters;

  return (
    <main className="bg-background min-h-screen flex flex-col">
      <AnnouncementBar />
      <Navbar />

      <div className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="hidden md:block w-64 shrink-0">
            <ProductFilters
              categories={categories}
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
              onClearFilters={clearFilters}
            />
          </div>

          <div className="flex-1">
            <div className="mb-6">
              <h1 className="font-display text-4xl font-bold leading-none md:text-3xl">
                All <br className="md:hidden" />
                Products
              </h1>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="md:hidden w-full sm:w-auto justify-center"
                      >
                        <Filter className="mr-2 h-4 w-4" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[85vw] max-w-sm px-6 py-6">
                      <SheetTitle className="sr-only">Filters</SheetTitle>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="font-display text-xl font-semibold">Filters</h2>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearFilters}
                          className="text-muted-foreground"
                        >
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

            {initialProducts.length === 0 ? (
              <div className="py-16 text-center">
                <p className="font-display text-xl font-semibold">No products available yet.</p>
                <p className="mt-2 text-sm text-muted-foreground">Check back soon ✨</p>
              </div>
            ) : isFilteredEmpty ? (
              <div className="py-16 text-center">
                <p className="font-display text-xl font-semibold">
                  No products matching your criteria.
                </p>
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Clear filters
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-muted-foreground">
                  Showing {filteredProducts.length} results on this page
                </div>

                <ProductGrid products={filteredProducts as any} />

                {/* ✅ if PaginationControl doesn't support onChange, see file request below */}
                <PaginationControl
                  totalPages={totalPages}
                  hasNextPage={currentPage < totalPages}
                  hasPrevPage={currentPage > 1}
                  totalSize={0}
                  // If your component supports it, add:
                  // onPageChange={goToPage}
                />
                {/* Temporary fallback if needed: */}
                <div className="mt-6 flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    disabled={currentPage <= 1}
                    onClick={() => goToPage(currentPage - 1)}
                  >
                    Prev
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={currentPage >= totalPages}
                    onClick={() => goToPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
