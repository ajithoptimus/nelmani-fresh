"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { ProductListItem } from "@/types";
import { useCartStore } from "@/store/cart";
import { useState } from "react";

interface ProductCardProps {
  product: ProductListItem;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [adding, setAdding] = useState(false);

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Quick add uses the smallest variant — user can choose size on product page
    // For now we navigate to product page
    window.location.href = `/products/${product.slug}`;
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-green-900/10 transition-shadow duration-300 overflow-hidden"
    >
      <Link href={`/products/${product.slug}`}>
        {/* Image */}
        <div className="relative aspect-square bg-gradient-to-br from-green-50 to-amber-50 overflow-hidden">
          {product.primary_image ? (
            <Image
              src={product.primary_image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <span className="text-6xl mb-2">🌾</span>
              <span className="text-green-700 font-medium text-sm">Kerala Heritage Rice</span>
            </div>
          )}

          {/* Fresh badge */}
          <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
            Fresh Processed
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-green-700 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.short_description}</p>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-400">Starting from</span>
              <div className="text-green-700 font-bold text-xl">
                ₹{product.starting_price?.toFixed(0) ?? "—"}
                <span className="text-sm font-normal text-gray-400">/kg</span>
              </div>
            </div>

            <button
              onClick={handleQuickAdd}
              className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-green-700/25 active:scale-95"
            >
              Buy Now
            </button>
          </div>

          {/* Processing notice */}
          <div className="mt-4 flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
            <span>⏱️</span>
            <span>Processed fresh in 3 working days</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
