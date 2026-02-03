import CollectionsClient from "./CollectionsClient";
import { db } from "@/db/client";
import { products } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";

export const revalidate = 60; // cache the rendered page for 60s on Vercel

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: { page?: string; category?: string; sort?: string };
}) {
  const page = Math.max(1, Number(searchParams.page ?? "1"));
  const limit = 12;
  const offset = (page - 1) * limit;

  // ✅ only fetch the fields you need for cards (faster, less payload)
  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      price: products.price,
      imageUrl: products.imageUrl,
      category: products.category,
      tags: products.tags,
      tagColor: products.tagColor,
      createdAt: products.createdAt,
    })
    .from(products)
    .where(eq(products.published, true))
    .orderBy(desc(products.id))
    .limit(limit)
    .offset(offset);

  // ✅ total count for pagination
  const totalRow = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(eq(products.published, true))
    .get();

  const totalCount = totalRow?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  return (
    <CollectionsClient
      initialProducts={rows}
      currentPage={page}
      totalPages={totalPages}
      initialCategory={searchParams.category ?? ""}
      initialSort={(searchParams.sort as any) ?? "newest"}
    />
  );
}
