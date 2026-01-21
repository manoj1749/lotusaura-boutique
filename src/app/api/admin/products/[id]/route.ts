import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { products, productImages } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { del } from "@vercel/blob";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
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

    // Fetch images
    const images = await db.select()
      .from(productImages)
      .where(eq(productImages.productId, numericId))
      .orderBy(asc(productImages.displayOrder))
      .all();

    return NextResponse.json({ product: { ...product, images } });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

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
    // Also delete additional images
    const images = await db.select().from(productImages).where(eq(productImages.productId, numericId));
    await Promise.all(images.map(img => del(img.imagePath).catch(() => {})));
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
    const { 
      name, description, price, imageUrl, imagePath, category, stock, tags, published,
      dispatchTime, material, washCare, pattern, additionalImages 
    } = body;

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
      dispatchTime: typeof dispatchTime === "string" ? dispatchTime : null,
      material: typeof material === "string" ? material : null,
      washCare: typeof washCare === "string" ? washCare : null,
      pattern: typeof pattern === "string" ? pattern : null,
    };

    // Only update image if new one provided
    if (typeof imageUrl === "string" && typeof imagePath === "string") {
      updateData.imageUrl = imageUrl;
      updateData.imagePath = imagePath;
      
      // Ideally delete old image here if different, but let's keep it simple for now or do it if we fetched the old one.
    }

    await db.update(products).set(updateData).where(eq(products.id, numericId));

    // Handle Additional Images (Sync strategy: Delete all not in list? Or just append? Simpler: Replace all for now or just add new ones)
    // For "manageable" editing, users expect full control.
    // Let's assume frontend sends the FULL desired list of additional images.
    // So we delete all existing for this product and re-insert. 
    // Optimization: Diff them. But specific delete is simpler for logic.
    if (Array.isArray(additionalImages)) {
      // Delete existing
      await db.delete(productImages).where(eq(productImages.productId, numericId));
      
      // Insert new list
      if (additionalImages.length > 0) {
         const imageRecords = additionalImages.map((img: any, index: number) => ({
          productId: numericId,
          imageUrl: img.url,
          imagePath: img.path,
          displayOrder: index,
        }));
        await db.insert(productImages).values(imageRecords);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message ?? "Update failed" },
      { status: 500 }
    );
  }
}
