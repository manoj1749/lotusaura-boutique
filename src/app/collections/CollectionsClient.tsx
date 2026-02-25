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

type ProductCardRow = {
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
  initialProducts: ProductCardRow[];
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

      {/* ✅ THIS must be flex-1 to avoid white space under footer */}
      <div className="flex-1 mx-auto max-w-6xl px-4 sm:px-6 py-6 md:py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left filters (desktop) */}
          <aside className="hidden md:block w-64 shrink-0 self-start">
            <div className="sticky top-28">
              <ProductFilters
                categories={categories}
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
                onClearFilters={clearFilters}
              />
            </div>
          </aside>

          {/* Right content */}
          <section className="flex-1 min-w-0">
            {/* Header always visible */}
            <div className="mb-8">
              <h1 className="font-display text-4xl font-bold leading-none md:text-3xl">
                All <br className="md:hidden" />
                Products
              </h1>

              <div className="mt-5 flex items-center gap-3">
                {/* Mobile filters button */}
                <div className="md:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        Filters
                      </Button>
                    </SheetTrigger>

                    <SheetContent side="left" className="w-[85vw] max-w-sm px-6 py-6">
                      <SheetTitle className="sr-only">Filters</SheetTitle>
                      <ProductFilters
                        showHeader={false}
                        categories={categories}
                        selectedCategories={selectedCategories}
                        onCategoryChange={handleCategoryChange}
                        onClearFilters={clearFilters}
                      />
                    </SheetContent>
                  </Sheet>
                </div>

                {/* Sort */}
                <div className="ml-auto">
                  <ProductSort value={sortBy} onValueChange={setSortBy} />
                </div>
              </div>
            </div>

            {/* ✅ Body: keep same left-aligned content column as products */}
            <div className="w-full">
              {initialProducts.length === 0 ? (
                <div className="py-16 text-left">
                  <p className="font-display text-xl font-semibold">No products available yet.</p>
                  <p className="mt-2 text-sm text-muted-foreground">Check back soon ✨</p>
                </div>
              ) : isFilteredEmpty ? (
                <div className="py-16 text-left">
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

                  <div className="mt-12">
                    <PaginationControl
                      totalPages={totalPages}
                      hasNextPage={currentPage < totalPages}
                      hasPrevPage={currentPage > 1}
                      totalSize={0}
                    />
                  </div>

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
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}