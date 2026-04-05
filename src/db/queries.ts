// src/db/queries.ts
import { cache } from "react";
import { db } from "@/db/client";
import { products, productImages, siteSettings } from "@/db/schema";
import { and, desc, eq, not } from "drizzle-orm";
import type { SiteSettings } from "@/types/site-settings";

export const getProductById = cache(async (productId: number) => {
  return db.select().from(products).where(eq(products.id, productId)).get();
});

export const getProductImages = cache(async (productId: number) => {
  return db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, productId))
    .all();
});

// ✅ One pool for related products (replaces 3 queries)
export const getRelatedPool = cache(async (productId: number) => {
  return db
    .select({
      id: products.id,
      name: products.name,
      price: products.price,
      imageUrl: products.imageUrl,
      category: products.category,
      tagColor: products.tagColor,
      tags: products.tags,
      createdAt: products.createdAt,
    })
    .from(products)
    .where(and(eq(products.published, true), not(eq(products.id, productId))))
    .orderBy(desc(products.id))
    .limit(24);
});

// Fetch all site settings as a typed object — cached per request
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const rows = await db.select().from(siteSettings).all();
  const map: Record<string, string> = {};
  for (const row of rows) map[row.key] = row.value;
  return {
    heroImageUrl: map["heroImageUrl"] ?? null,
    logoUrl:      map["logoUrl"]      ?? null,
    instagramUrl: map["instagramUrl"] ?? null,
    address:      map["address"]      ?? null,
    contactNumber: map["contactNumber"] ?? null,
    email:        map["email"]        ?? null,
  };
});