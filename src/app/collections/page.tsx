import { Suspense } from "react";
import CollectionsClient from "./CollectionsClient";

export default function CollectionsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-10">Loading…</div>}>
      <CollectionsClient />
    </Suspense>
  );
}
