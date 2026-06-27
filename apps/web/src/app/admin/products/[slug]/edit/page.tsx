"use client";

import { useEffect, useState } from "react";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { productsApi } from "@/lib/api";

export default function EditProductPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await productsApi.get(params.slug);
        setProduct(data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Product not found or failed to load.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [params.slug]);

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading product data...</div>;
  }

  if (error || !product) {
    return (
      <div className="space-y-6">
        <Link href="/admin/products" className="text-primary hover:underline flex items-center">
          <ArrowLeftIcon className="w-4 h-4 mr-1" /> Back to Products
        </Link>
        <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/products" className="p-2 text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Product: {product.name}</h1>
          <p className="text-sm text-gray-500 mt-1">Update pricing, details, and stock.</p>
        </div>
      </div>

      <ProductForm initialData={product} />
    </div>
  );
}
