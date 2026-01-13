import { NextResponse } from "next/server";
import { db } from "@/db/client";

export const runtime = "nodejs";

export async function GET() {
  const tables = await db.run(
    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"
  );
  return NextResponse.json({ ok: true, tables });
}
