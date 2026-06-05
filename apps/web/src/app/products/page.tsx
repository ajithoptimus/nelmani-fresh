import type { Metadata } from "next";
import { ProductsPageClient } from "@/components/products/ProductsPageClient";
import { productsApi } from "@/lib/api";
import type { PaginatedProducts } from "@/types";

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Shop Rakthashali, Uma Matta, and Ponmani Matta — traditional Kerala rice varieties freshly processed after your order. Available in 1kg, 5kg, and 10kg.",
  openGraph: {
    title: "Kerala Heritage Rice Products — Nelmani Fresh",
    description: "Freshly processed traditional Kerala rice. Order online, pan-India delivery.",
  },
};

async function getProducts(): Promise<PaginatedProducts | null> {
  try {
    const { data } = await productsApi.list({ page_size: 12 });
    return data;
  } catch {
    return null;
  }
}

export default async function ProductsPage() {
  const initialData = await getProducts();

  return (
    <main className="pt-20">
      <ProductsPageClient initialData={initialData} />
    </main>
  );
}
