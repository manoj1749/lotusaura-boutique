import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-24">
      <h1 className="font-serif text-4xl">Page not found</h1>
      <p className="mt-3 text-stone-600">
        The page you’re looking for doesn’t exist.
      </p>

      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="px-5 py-3 bg-stone-900 text-white rounded-md"
        >
          Go Home
        </Link>
        <Link
          href="/collections"
          className="px-5 py-3 border border-stone-300 rounded-md"
        >
          View Collections
        </Link>
      </div>
    </div>
  );
}
