import CollectionsClient from "./CollectionsClient";
import { db } from "@/db/client";
import { products } from "@/db/schema";
import { asc, desc, eq, and, inArray, isNotNull, sql } from "drizzle-orm";

export const revalidate = 0; // always fresh — filters change per request

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; sort?: string }>;
}) {
  const { page: pageParam, category, sort } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? "1"));
  const limit = 12;
  const offset = (page - 1) * limit;

  // ── Parse comma-separated categories ────────────────────────────────────
  const selectedCategories = category
    ? category.split(",").map((c) => c.trim()).filter(Boolean)
    : [];

  // ── Build WHERE clause ───────────────────────────────────────────────────
  const whereClause =
    selectedCategories.length > 0
      ? and(eq(products.published, true), inArray(products.category, selectedCategories))
      : eq(products.published, true);

  // ── Sort order ───────────────────────────────────────────────────────────
  let orderBy;
  switch (sort) {
    case "price-asc":  orderBy = asc(products.price);  break;
    case "price-desc": orderBy = desc(products.price); break;
    case "name-asc":   orderBy = asc(products.name);   break;
    case "name-desc":  orderBy = desc(products.name);  break;
    default:           orderBy = desc(products.id);    break; // newest
  }

  // ── Paginated products ───────────────────────────────────────────────────
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
    .where(whereClause)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  // ── Total count (respects active category filter) ────────────────────────
  const totalRow = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(whereClause)
    .get();

  const totalCount = totalRow?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  // ── All distinct categories (for filter sidebar) ─────────────────────────
  const categoryRows = await db
    .selectDistinct({ category: products.category })
    .from(products)
    .where(and(eq(products.published, true), isNotNull(products.category)))
    .orderBy(asc(products.category));

  const allCategories = categoryRows
    .map((r) => r.category)
    .filter((c): c is string => !!c);

  return (
    <CollectionsClient
      initialProducts={rows}
      allCategories={allCategories}
      currentPage={page}
      totalPages={totalPages}
      initialCategories={selectedCategories}
      initialSort={(sort as any) ?? "newest"}
    />
  );
}
