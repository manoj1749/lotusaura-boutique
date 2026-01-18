import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Hero } from "@/components/home/Hero";
import { FeatureStrip } from "@/components/home/FeatureStrip";
import { AboutSection } from "@/components/home/AboutSection";
import { ProductGrid } from "@/components/products/ProductGrid";
import Link from "next/link";
import { PRODUCTS } from "@/lib/data";

// Featured products are the first 3
const FEATURED_PRODUCTS = PRODUCTS.slice(0, 3);

export default function HomePage() {
  return (
    <main className="bg-background text-foreground transition-colors duration-300">
      <AnnouncementBar />
      <Navbar />
      <Hero />
      <FeatureStrip />

      {/* Featured collections */}
      <section id="collections" className="py-20 bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="text-primary text-xs font-bold uppercase tracking-widest">
              Our Selection
            </div>
            <h2 className="font-display text-4xl mt-2 mb-4">
              Featured Collections
            </h2>
            <div className="h-1 w-24 bg-primary mx-auto rounded-full" />
          </div>

          <ProductGrid products={FEATURED_PRODUCTS} showAddToCart={false} />

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

      <AboutSection />
      <Footer />
    </main>
  );
}
