import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: "noindex",
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-8xl mb-6">🌾</div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md">
          Looks like this page has gone missing — like rice before the harvest.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="bg-green-700 text-white font-bold px-8 py-4 rounded-full hover:bg-green-600 transition-colors">
            Go Home
          </Link>
          <Link href="/products" className="border-2 border-green-700 text-green-700 font-semibold px-8 py-4 rounded-full hover:bg-green-50 transition-colors">
            Browse Products
          </Link>
        </div>
      </div>
    </main>
  );
}
