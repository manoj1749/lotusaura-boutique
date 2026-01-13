import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { del } from "@vercel/blob";

export const runtime = "nodejs";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const rows = await db.select().from(products).where(eq(products.id, id));
  const product = rows[0];

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.delete(products).where(eq(products.id, id));

  // best-effort blob delete
  try {
    await del(product.imagePath);
  } catch {}

  return NextResponse.json({ ok: true });
}
