import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Hero } from "@/components/home/Hero";
import { CategoryNav } from "@/components/home/CategoryNav";
import { FeatureStrip } from "@/components/home/FeatureStrip";
import { AboutSection } from "@/components/home/AboutSection";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { db } from "@/db/client";
import { products } from "@/db/schema";
import { getSiteSettings } from "@/db/queries";
import { desc, and, eq, isNotNull, ne, sql } from "drizzle-orm";

export const revalidate = 60; // ISR — refresh from DB every 60 seconds

export default async function HomePage() {
  // Fetch all site settings in a single query
  const settings = await getSiteSettings();
  const heroImageUrl = settings.heroImageUrl ?? undefined;

  // Fetch latest 9 published products for featured section
  const latestProducts = await db.select().from(products)
    .where(eq(products.published, true))
    .orderBy(desc(products.id))
    .limit(9);

  // Map to match the expected type if necessary (handling nulls)
  const featuredProducts = latestProducts.map(p => ({
    ...p,
    tagColor: p.tagColor || undefined,
  }));

  // Categories from DB (published only) + representative image from a product in that category
  const catSub = db
  .select({
    category: products.category,
    maxId: sql<number>`max(${products.id})`.as("maxId"),
  })
  .from(products)
  .where(
    and(
      eq(products.published, true),
      isNotNull(products.category),
      ne(products.category, "")
    )
  )
  .groupBy(products.category)
  .as("catSub");

const categoriesFromDb = await db
  .select({
    name: catSub.category,
    imageUrl: products.imageUrl,
  })
  .from(catSub)
  .innerJoin(products, eq(products.id, catSub.maxId));

const categoriesForNav = categoriesFromDb
  .filter((c) => !!c.name) // safety
  .map((c) => ({
    name: c.name as string,
    imageUrl: c.imageUrl,
  }));

  return (
    <main className="bg-background text-foreground transition-colors duration-300">
      <AnnouncementBar />
      <Navbar siteSettings={settings} />
      <Hero heroImageUrl={heroImageUrl} />
      
      {/* Category Navigation - Mobile Optimized */}
      <CategoryNav categories={categoriesForNav} />

      {/* Featured collections */}
      <FeaturedCollections products={featuredProducts as any} />

      {/* Feature Strip - Moved Below Collections */}
      <FeatureStrip />

      <AboutSection siteSettings={settings} />
      <Footer siteSettings={settings} />
    </main>
  );
}

