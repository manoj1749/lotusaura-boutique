"use client";

import { useTransition, useState } from "react";
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
import { Filter, Loader2 } from "lucide-react";

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
  allCategories,
  currentPage,
  totalPages,
  initialCategories,
  initialSort,
}: {
  initialProducts: ProductCardRow[];
  allCategories: string[];
  currentPage: number;
  totalPages: number;
  initialCategories: string[];
  initialSort: SortOption;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Optimistic multi-select — updates instantly before server responds
  const [optimisticCategories, setOptimisticCategories] = useState<string[]>(initialCategories);

  // ── Navigate helper — comma-joins categories into URL ────────────────────
  const navigateWithCategories = (categories: string[], extraUpdates: Record<string, string | null> = {}) => {
    const params = new URLSearchParams(searchParams.toString());

    if (categories.length > 0) {
      params.set("category", categories.join(","));
    } else {
      params.delete("category");
    }

    for (const [key, val] of Object.entries(extraUpdates)) {
      if (val === null || val === "") params.delete(key);
      else params.set(key, val);
    }

    // Reset to page 1 on filter/sort change
    params.delete("page");

    startTransition(() => {
      router.push(`/collections?${params.toString()}`);
    });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const next = checked
      ? [...optimisticCategories, category]
      : optimisticCategories.filter((c) => c !== category);

    setOptimisticCategories(next); // instant checkbox feedback
    navigateWithCategories(next);
  };

  const handleSortChange = (sort: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    params.delete("page");
    startTransition(() => {
      router.push(`/collections?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    setOptimisticCategories([]);
    startTransition(() => {
      router.push("/collections");
    });
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    startTransition(() => {
      router.push(`/collections?${params.toString()}`);
    });
  };

  const hasFilters = optimisticCategories.length > 0;

  const FiltersPanel = ({ showHeader = true }: { showHeader?: boolean }) => (
    <ProductFilters
      showHeader={showHeader}
      categories={allCategories}
      selectedCategories={optimisticCategories}
      onCategoryChange={handleCategoryChange}
      onClearFilters={clearFilters}
    />
  );

  return (
    <main className="bg-background min-h-screen flex flex-col">
      <AnnouncementBar />
      <Navbar />

      <div className="flex-1 mx-auto max-w-6xl px-4 sm:px-6 py-6 md:py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left filters (desktop) */}
          <aside className="hidden md:block w-64 shrink-0 self-start">
            <div className="sticky top-28">
              <FiltersPanel showHeader={true} />
            </div>
          </aside>

          {/* Right content */}
          <section className="flex-1 min-w-0">
            {/* Header */}
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
                        {hasFilters && (
                          <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-semibold text-background">
                            {optimisticCategories.length}
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>

                    <SheetContent side="left" className="w-[85vw] max-w-sm px-6 py-6">
                      <SheetTitle className="sr-only">Filters</SheetTitle>
                      <FiltersPanel showHeader={false} />
                    </SheetContent>
                  </Sheet>
                </div>

                {/* Sort */}
                <div className="ml-auto">
                  <ProductSort value={initialSort} onValueChange={handleSortChange} />
                </div>
              </div>
            </div>

            {/* Body — with loading overlay */}
            <div className="relative w-full">
              {/* ── Loading overlay ──────────────────────────────────────── */}
              {isPending && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-background/70 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-foreground/60" />
                    <span className="text-sm text-muted-foreground">Loading products…</span>
                  </div>
                </div>
              )}

              {/* ── Content ─────────────────────────────────────────────── */}
              <div className={isPending ? "pointer-events-none select-none opacity-50" : ""}>
                {initialProducts.length === 0 ? (
                  hasFilters ? (
                    <div className="py-16 text-left">
                      <p className="font-display text-xl font-semibold">
                        No products in {optimisticCategories.length === 1
                          ? `"${optimisticCategories[0]}"`
                          : "the selected categories"}.
                      </p>
                      <Button variant="outline" className="mt-4" onClick={clearFilters}>
                        Clear filters
                      </Button>
                    </div>
                  ) : (
                    <div className="py-16 text-left">
                      <p className="font-display text-xl font-semibold">No products available yet.</p>
                      <p className="mt-2 text-sm text-muted-foreground">Check back soon ✨</p>
                    </div>
                  )
                ) : (
                  <>
                    <div className="mb-4 text-sm text-muted-foreground">
                      Showing {initialProducts.length} result{initialProducts.length !== 1 ? "s" : ""} on this page
                    </div>

                    <ProductGrid products={initialProducts as any} />

                    <div className="mt-6 flex items-center justify-center gap-3">
                      <Button
                        variant="outline"
                        disabled={currentPage <= 1 || isPending}
                        onClick={() => goToPage(currentPage - 1)}
                      >
                        Prev
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        disabled={currentPage >= totalPages || isPending}
                        onClick={() => goToPage(currentPage + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}