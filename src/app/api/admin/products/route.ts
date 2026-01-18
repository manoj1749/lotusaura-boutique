import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { products } from "@/db/schema";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");

  let query = db.select().from(products);

  if (search) {
    // Basic partial match on name or category
    const lowerSearch = search.toLowerCase();
    // Note: In a real SQL env we'd use `like` or `ilike`.
    // Drizzle with SQLite: like(products.name, `%${search}%`)
    // But for simplicity/safety with current imports, let's filter in memory or use minimal raw sql if strictly needed.
    // However, Drizzle's `like` is standard. Let's try to fetch all and filter JS-side for simplicity if dataset is small,
    // OR import `like` if we want to be proper.
    // Given the small scale, let's fetch all and filter JS-side to avoid import errors right now.
    // If user has many products, we should switch to SQL `WHERE`.
  }
  
  const rows = await query;
  if (!search) return NextResponse.json({ products: rows });

  const lower = search.toLowerCase();
  const filtered = rows.filter(
    (p) =>
      p.name.toLowerCase().includes(lower) ||
      (p.category && p.category.toLowerCase().includes(lower)) ||
      (p.tags && p.tags.toLowerCase().includes(lower))
  );

  return NextResponse.json({ products: filtered });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, description, price, imageUrl, imagePath, category, stock, tags, published } = body;

    if (
      typeof name !== "string" ||
      name.trim().length === 0 ||
      typeof price !== "number" ||
      typeof imageUrl !== "string" ||
      typeof imagePath !== "string"
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await db.insert(products).values({
      name: name.trim(),
      description: typeof description === "string" ? description : null,
      price,
      imageUrl,
      imagePath,
      category: typeof category === "string" ? category : null,
      stock: typeof stock === "number" ? stock : 0,
      tags: typeof tags === "string" ? tags : null,
      published: typeof published === "boolean" ? published : true,
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Create failed" },
      { status: 500 }
    );
  }
}
