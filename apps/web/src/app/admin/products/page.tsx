"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { productsApi } from "@/lib/api";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await productsApi.list({ page_size: 50 });
      setProducts(data.items);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await productsApi.delete(id);
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your rice catalog and pricing.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-sm"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Product</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Product</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Starting Price</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No products found. Start by adding a new one!
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                          {product.primary_image ? (
                            <img
                              src={product.primary_image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400">
                              <span className="text-xs">No img</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {product.starting_price ? `₹${product.starting_price}` : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      {product.is_featured ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Featured
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Standard
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/admin/products/${product.slug}/edit`}
                          className="p-2 text-gray-400 hover:text-primary transition-colors"
                          title="Edit"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
