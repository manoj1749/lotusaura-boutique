import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { products, productImages } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const search = (searchParams.get("search") ?? "").trim();
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = 10;
  const offset = (page - 1) * limit;

  // Escape LIKE wildcards to prevent unintended matches
  const escaped = search.replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_");
  const like = `%${escaped}%`;

  // Build a WHERE clause: if no search, match all
  const whereClause =
    search.length > 0
      ? sql`(${products.name} LIKE ${like} ESCAPE '\\'
            OR ${products.category} LIKE ${like} ESCAPE '\\'
            OR ${products.tags} LIKE ${like} ESCAPE '\\')`
      : sql`1=1`;

  // ✅ total count (DB-side)
  const totalRow = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(whereClause)
    .get();

  const totalCount = totalRow?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  // ✅ fetch only current page (DB-side)
  const paginatedRows = await db
    .select()
    .from(products)
    .where(whereClause)
    .orderBy(desc(products.id))
    .limit(limit)
    .offset(offset);

  return NextResponse.json(
    {
      products: paginatedRows,
      totalPages,
      currentPage: page,
      totalCount,
    },
    {
      headers: {
        // ✅ Vercel edge caching for GET responses
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=300",
      },
    }
  );
}

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const search = searchParams.get("search");
//   const page = parseInt(searchParams.get("page") ?? "1");
//   const limit = 10;
//   const offset = (page - 1) * limit;

//   // Optimally we would do this in DB:
//   // const rows = await db.select().from(products).where(...).limit(limit).offset(offset);
//   // BUT we also need total count for pagination.
//   // AND we have client-side-like search logic in comments.

//   // Let's implement basic DB pagination + total count:
  
//   let allRows = await db.select().from(products);
  
//   // Filter
//   if (search) {
//       const lower = search.toLowerCase();
//       allRows = allRows.filter(
//         (p) =>
//           p.name.toLowerCase().includes(lower) ||
//           (p.category && p.category.toLowerCase().includes(lower)) ||
//           (p.tags && p.tags.toLowerCase().includes(lower))
//       );
//   }

//   const totalCount = allRows.length;
//   const totalPages = Math.ceil(totalCount / limit);
  
//   // Slice for pagination (simulating DB offset/limit on filtered set)
//   const paginatedRows = allRows.slice(offset, offset + limit);

//   return NextResponse.json({ 
//       products: paginatedRows,
//       totalPages,
//       currentPage: page,
//       totalCount
//   });
// }

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { 
      name, description, price, imageUrl, imagePath, category, stock, tags, published,
      dispatchTime, material, washCare, pattern, additionalImages 
    } = body;

    if (
      typeof name !== "string" ||
      name.trim().length === 0 ||
      typeof price !== "number" ||
      typeof imageUrl !== "string" ||
      typeof imagePath !== "string"
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const [newProduct] = await db.insert(products).values({
      name: name.trim(),
      description: typeof description === "string" ? description : null,
      price,
      imageUrl,
      imagePath,
      category: typeof category === "string" ? category : null,
      stock: typeof stock === "number" ? stock : 0,
      tags: typeof tags === "string" ? tags : null,
      published: typeof published === "boolean" ? published : true,
      dispatchTime: typeof dispatchTime === "string" ? dispatchTime : null,
      material: typeof material === "string" ? material : null,
      washCare: typeof washCare === "string" ? washCare : null,
      pattern: typeof pattern === "string" ? pattern : null,
    }).returning();

    // Insert additional images if any
    if (Array.isArray(additionalImages) && additionalImages.length > 0) {
      const imageRecords = additionalImages.map((img: any, index: number) => ({
        productId: newProduct.id,
        imageUrl: img.url,
        imagePath: img.path,
        displayOrder: index,
      }));
      await db.insert(productImages).values(imageRecords);
    }

    return NextResponse.json({ ok: true, product: newProduct });
  } catch (e: any) {
    console.error("Create error:", e);
    return NextResponse.json(
      { error: e?.message ?? "Create failed" },
      { status: 500 }
    );
  }
}
