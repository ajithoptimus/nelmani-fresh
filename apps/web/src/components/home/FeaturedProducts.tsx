"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import { useEffect, useState } from "react";
import { productsApi } from "@/lib/api";
import type { ProductListItem } from "@/types";

export function FeaturedProducts() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi
      .list({ is_featured: true, page_size: 3 })
      .then(({ data }) => setProducts(data.items))
      .catch(() => setProducts(FALLBACK_PRODUCTS))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-semibold tracking-widest text-amber-600 uppercase mb-3 block">
            Our Products
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Kerala's Finest{" "}
            <span className="text-green-700">Heritage Rice</span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Three traditional varieties. One freshness promise.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 border-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-white font-semibold px-8 py-4 rounded-full transition-all duration-300"
          >
            View All Products
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// Shown when API unavailable (development / no DB yet)
const FALLBACK_PRODUCTS: ProductListItem[] = [
  {
    id: 1,
    slug: "rakthashali-rice",
    name: "Rakthashali Rice",
    short_description: "Traditional Kerala red rice variety known for its rich color and heritage value.",
    is_featured: true,
    primary_image: null,
    starting_price: 180,
  },
  {
    id: 2,
    slug: "uma-matta-rice",
    name: "Uma Matta Rice",
    short_description: "Traditional Kerala Matta rice suitable for daily family consumption.",
    is_featured: true,
    primary_image: null,
    starting_price: 120,
  },
  {
    id: 3,
    slug: "ponmani-matta-rice",
    name: "Ponmani Matta Rice",
    short_description: "Premium Kerala Matta rice with rich flavor and texture.",
    is_featured: true,
    primary_image: null,
    starting_price: 150,
  },
];
