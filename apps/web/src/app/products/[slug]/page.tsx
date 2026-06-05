import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/products/ProductDetailClient";
import { productsApi } from "@/lib/api";
import type { ProductDetail } from "@/types";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { data }: { data: ProductDetail } = await productsApi.get(params.slug);
    return {
      title: data.meta_title || data.name,
      description: data.meta_description || data.short_description,
      openGraph: {
        title: data.name,
        description: data.short_description,
        images: data.images[0] ? [{ url: data.images[0].url }] : [],
        type: "website",
      },
    };
  } catch {
    return { title: "Product Not Found" };
  }
}

export async function generateStaticParams() {
  try {
    const { data } = await productsApi.list({ page_size: 50 });
    return data.items.map((p: { slug: string }) => ({ slug: p.slug }));
  } catch {
    return [
      { slug: "rakthashali-rice" },
      { slug: "uma-matta-rice" },
      { slug: "ponmani-matta-rice" },
    ];
  }
}

export const revalidate = 3600; // Revalidate every hour

export default async function ProductDetailPage({ params }: Props) {
  let product: ProductDetail;

  try {
    const { data } = await productsApi.get(params.slug);
    product = data;
  } catch {
    notFound();
  }

  return (
    <main className="pt-20">
      <ProductDetailClient product={product} />
    </main>
  );
}
