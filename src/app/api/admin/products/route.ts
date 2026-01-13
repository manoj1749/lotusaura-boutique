import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { products } from "@/db/schema";

export const runtime = "nodejs";

export async function GET() {
  const rows = await db.select().from(products);
  return NextResponse.json({ products: rows });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, description, price, imageUrl, imagePath, category } = body;

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
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Create failed" },
      { status: 500 }
    );
  }
}
