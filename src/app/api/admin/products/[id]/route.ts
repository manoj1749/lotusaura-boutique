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
