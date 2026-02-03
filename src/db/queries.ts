// src/db/queries.ts
import { cache } from "react";
import { db } from "@/db/client";
import { products, productImages } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getProductById = cache(async (productId: number) => {
  return db.select().from(products).where(eq(products.id, productId)).get();
});

export const getProductImages = cache(async (productId: number) => {
  return db.select().from(productImages).where(eq(productImages.productId, productId)).all();
});
