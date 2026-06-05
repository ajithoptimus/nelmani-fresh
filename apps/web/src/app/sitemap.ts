import type { MetadataRoute } from "next";
import { productsApi, blogApi } from "@/lib/api";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://nelmanifresh.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/products`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  // Dynamic product pages
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const { data } = await productsApi.list({ page_size: 50 });
    productPages = data.items.map((p: any) => ({
      url: `${BASE_URL}/products/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));
  } catch {}

  // Dynamic blog pages
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const { data } = await blogApi.list();
    blogPages = data.map((post: any) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.published_at || new Date()),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {}

  return [...staticPages, ...productPages, ...blogPages];
}
