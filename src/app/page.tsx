import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Hero } from "@/components/home/Hero";
import { FeatureStrip } from "@/components/home/FeatureStrip";
import { AboutSection } from "@/components/home/AboutSection";
import { ProductGrid } from "@/components/products/ProductGrid";
import Link from "next/link";
import { db } from "@/db/client";
import { products } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export default async function HomePage() {
  // Fetch latest 3 published products
  const latestProducts = await db.select().from(products)
    .where(eq(products.published, true))
    .orderBy(desc(products.id))
    .limit(3);

  // Map to match the expected type if necessary (handling nulls)
  const featuredProducts = latestProducts.map(p => ({
    ...p,
    tagColor: p.tagColor || undefined,
  }));
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

          <ProductGrid products={featuredProducts as any} showAddToCart={false} />

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
