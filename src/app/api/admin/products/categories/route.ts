import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { products } from "@/db/schema";
import { isNotNull, asc } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET() {
  const rows = await db
    .selectDistinct({ category: products.category })
    .from(products)
    .where(isNotNull(products.category))
    .orderBy(asc(products.category));

  const categories = rows
    .map((r) => r.category)
    .filter((c): c is string => !!c);

  return NextResponse.json({ categories });
}
