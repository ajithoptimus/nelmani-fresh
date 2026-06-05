"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/products/ProductCard";
import { productsApi } from "@/lib/api";
import type { PaginatedProducts, ProductListItem } from "@/types";

interface Props {
  initialData: PaginatedProducts | null;
}

const SORT_OPTIONS = [
  { value: "sort_order", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export function ProductsPageClient({ initialData }: Props) {
  const [products, setProducts] = useState<ProductListItem[]>(
    initialData?.items || []
  );
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("sort_order");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchProducts = useCallback(async (searchVal: string, sort: string) => {
    setLoading(true);
    try {
      const { data } = await productsApi.list({
        search: searchVal || undefined,
        sort_by: sort,
        page_size: 20,
      });
      setProducts(data.items);
    } catch {
      // Keep existing products on error
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    fetchProducts(search, sortBy);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    fetchProducts(search, sort);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="bg-gradient-to-br from-green-950 to-green-800 text-white py-16">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <motion.h1
            className="text-4xl lg:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Kerala Heritage Rice
          </motion.h1>
          <motion.p
            className="text-green-200 text-xl max-w-xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Freshly processed. Traditional varieties. Delivered pan-India.
          </motion.p>

          {/* Search bar */}
          <motion.form
            onSubmit={handleSearch}
            className="max-w-md mx-auto flex gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search rice varieties..."
              className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-amber-400 backdrop-blur-sm"
            />
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-green-950 font-bold px-6 py-3 rounded-full transition-colors"
            >
              Search
            </button>
          </motion.form>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 py-12">
        {/* Sort controls */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-gray-500 text-sm">
            {products.length} {products.length === 1 ? "product" : "products"}{" "}
            {searched && search ? `for "${search}"` : ""}
          </p>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">Sort by:</span>
            <div className="flex gap-2">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSortChange(opt.value)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    sortBy === opt.value
                      ? "bg-green-700 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🌾</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-400">Try a different search term</p>
          </div>
        ) : (
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            layout
          >
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                layout
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
