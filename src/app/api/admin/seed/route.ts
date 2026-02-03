// import { NextResponse } from "next/server";
// import { db } from "@/db/client";
// import { products } from "@/db/schema";
// import { PRODUCTS } from "@/lib/data";

// export const runtime = "nodejs";

// export async function POST() {
//   try {
//     // Optional: Clear existing data if you want a clean slate
//     // await db.delete(products);

//     const values = PRODUCTS.map((p) => ({
//       name: p.name,
//       description: p.description ?? null,
//       price: p.price,
//       imageUrl: p.imageUrl,
//       imagePath: p.imagePath,
//       category: p.category ?? null,
//       tags: p.tag ?? null, // Map 'tag' from data.ts to 'tags' in DB
//       tagColor: p.tagColor ?? null,
//       stock: 10, // Default stock for seeded items
//     }));

//     await db.insert(products).values(values);

//     return NextResponse.json({ success: true, count: values.length });
//   } catch (e: any) {
//     return NextResponse.json(
//       { error: e?.message ?? "Seed failed" },
//       { status: 500 }
//     );
//   }
// }
