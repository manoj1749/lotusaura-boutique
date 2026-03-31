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
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";

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

  // ── Navigate helper ───────────────────────────────────────────────────────
  const navigateWithCategories = (categories: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categories.length > 0) {
      params.set("category", categories.join(","));
    } else {
      params.delete("category");
    }
    params.delete("page");
    startTransition(() => router.push(`/collections?${params.toString()}`));
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const next = checked
      ? [...optimisticCategories, category]
      : optimisticCategories.filter((c) => c !== category);
    setOptimisticCategories(next);
    navigateWithCategories(next);
  };

  const togglePill = (category: string) => {
    const isSelected = optimisticCategories.includes(category);
    handleCategoryChange(category, !isSelected);
  };

  const handleSortChange = (sort: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    params.delete("page");
    startTransition(() => router.push(`/collections?${params.toString()}`));
  };

  const clearFilters = () => {
    setOptimisticCategories([]);
    startTransition(() => router.push("/collections"));
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    startTransition(() => router.push(`/collections?${params.toString()}`));
  };

  const hasFilters = optimisticCategories.length > 0;

  return (
    <main className="bg-background min-h-screen flex flex-col">
      <AnnouncementBar />
      <Navbar />

      <div className="flex-1 mx-auto max-w-6xl px-4 sm:px-6 py-6 md:py-12">
        <div className="flex flex-col md:flex-row gap-8">

          {/* ── Desktop sidebar filters ──────────────────────────────────── */}
          <aside className="hidden md:block w-64 shrink-0 self-start">
            <div className="sticky top-28">
              <ProductFilters
                categories={allCategories}
                selectedCategories={optimisticCategories}
                onCategoryChange={handleCategoryChange}
                onClearFilters={clearFilters}
              />
            </div>
          </aside>

          {/* ── Main content ─────────────────────────────────────────────── */}
          <section className="flex-1 min-w-0">

            {/* Page title */}
            <h1 className="font-display text-3xl font-bold mb-5 md:text-3xl">
              All Products
            </h1>

            {/* ── Mobile: category pills + sort row ─────────────────────── */}
            <div className="md:hidden mb-5 space-y-3">

              {/* Horizontally scrollable category pills */}
              {allCategories.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {/* "All" pill — deselects everything */}
                  <button
                    onClick={clearFilters}
                    className={[
                      "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                      !hasFilters
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-background text-foreground hover:bg-muted",
                    ].join(" ")}
                  >
                    All
                  </button>

                  {allCategories.map((cat) => {
                    const active = optimisticCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => togglePill(cat)}
                        className={[
                          "shrink-0 flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                          active
                            ? "border-foreground bg-foreground text-background"
                            : "border-border bg-background text-foreground hover:bg-muted",
                        ].join(" ")}
                      >
                        {cat}
                        {active && (
                          <X className="h-3 w-3 opacity-70" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Sort row */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {hasFilters ? `${optimisticCategories.join(", ")}` : "All categories"}
                </span>
                <ProductSort value={initialSort} onValueChange={handleSortChange} />
              </div>
            </div>

            {/* ── Desktop: sort row only (sidebar handles filters) ───────── */}
            <div className="hidden md:flex items-center justify-end mb-6">
              <ProductSort value={initialSort} onValueChange={handleSortChange} />
            </div>

            {/* ── Product grid with loading overlay ─────────────────────── */}
            <div className="relative w-full">
              {isPending && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-background/70 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-foreground/60" />
                    <span className="text-sm text-muted-foreground">Loading products…</span>
                  </div>
                </div>
              )}

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