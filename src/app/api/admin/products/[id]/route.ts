import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { del } from "@vercel/blob";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;

  const numericId = Number(id);
  if (!Number.isFinite(numericId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const rows = await db.select().from(products).where(eq(products.id, numericId));
  const product = rows[0];

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.delete(products).where(eq(products.id, numericId));

  // best-effort blob delete
  try {
    await del(product.imagePath);
  } catch {}

  return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const numericId = Number(id);
    if (!Number.isFinite(numericId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await req.json();
    const { name, description, price, imageUrl, imagePath, category, stock, tags, published } = body;

    // Validate text/numbers
    if (typeof name !== "string" || name.trim().length === 0 || typeof price !== "number") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Prepare update object
    const updateData: any = {
      name: name.trim(),
      description: typeof description === "string" ? description : null,
      price,
      stock: typeof stock === "number" ? stock : 0,
      tags: typeof tags === "string" ? tags : null,
      category: typeof category === "string" ? category : null,
      published: typeof published === "boolean" ? published : true,
    };

    // Only update image if new one provided
    if (typeof imageUrl === "string" && typeof imagePath === "string") {
      updateData.imageUrl = imageUrl;
      updateData.imagePath = imagePath;
      
      // Ideally delete old image here if different, but let's keep it simple for now or do it if we fetched the old one.
    }

    await db.update(products).set(updateData).where(eq(products.id, numericId));

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Update failed" },
      { status: 500 }
    );
  }
}
