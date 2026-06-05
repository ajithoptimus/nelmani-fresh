import type { Metadata } from "next";
import Link from "next/link";
import { blogApi } from "@/lib/api";
import type { BlogPost } from "@/types";

export const metadata: Metadata = {
  title: "Blog — Kerala Rice Guides & Heritage Stories",
  description:
    "Learn about Kerala's heritage rice varieties, health benefits, cooking tips, and traditional cultivation practices.",
};

const BLOG_POSTS_FALLBACK: BlogPost[] = [
  { id: 1, slug: "benefits-of-kerala-matta-rice", title: "Benefits of Kerala Matta Rice", excerpt: "Explore the traditional nutritional qualities and cultural significance of Kerala Matta rice in Indian cuisine.", category: "Heritage", author: "Nelmani Fresh Team", featured_image_url: null, published_at: "2024-01-15" },
  { id: 2, slug: "rakthashali-rice-guide", title: "Rakthashali Rice: A Complete Guide", excerpt: "Everything you need to know about Rakthashali — Kerala's prized red rice variety with centuries of heritage.", category: "Product Guide", author: "Nelmani Fresh Team", featured_image_url: null, published_at: "2024-01-20" },
  { id: 3, slug: "traditional-kerala-rice-varieties", title: "Traditional Kerala Rice Varieties", excerpt: "A deep dive into the diverse rice varieties of Kerala — from Rakthashali to Jyothi, and their place in Kerala cuisine.", category: "Heritage", author: "Nelmani Fresh Team", featured_image_url: null, published_at: "2024-02-01" },
  { id: 4, slug: "freshly-processed-vs-stored-rice", title: "Freshly Processed vs Stored Rice: What's the Difference?", excerpt: "Why freshly milled rice tastes and performs differently from rice that has been stored for months.", category: "Quality", author: "Nelmani Fresh Team", featured_image_url: null, published_at: "2024-02-10" },
  { id: 5, slug: "kerala-rice-cooking-tips", title: "Rice Cooking Tips: Getting Perfect Kerala Rice Every Time", excerpt: "Professional tips for cooking Matta rice and Rakthashali to perfection — texture, water ratio, and more.", category: "Cooking", author: "Nelmani Fresh Team", featured_image_url: null, published_at: "2024-02-20" },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Heritage": "bg-amber-100 text-amber-700",
  "Product Guide": "bg-green-100 text-green-700",
  "Quality": "bg-blue-100 text-blue-700",
  "Cooking": "bg-purple-100 text-purple-700",
};

async function getPosts(): Promise<BlogPost[]> {
  try {
    const { data } = await blogApi.list();
    return data.length > 0 ? data : BLOG_POSTS_FALLBACK;
  } catch {
    return BLOG_POSTS_FALLBACK;
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main className="pt-20">
      <div className="bg-gradient-to-br from-green-950 to-green-800 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-3">Kerala Rice Stories</h1>
        <p className="text-green-200 text-lg">Heritage, quality, and the freshness difference</p>
      </div>

      <div className="container mx-auto px-6 lg:px-8 py-16 max-w-5xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                <div className="aspect-video bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center">
                  <span className="text-5xl">🌾</span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[post.category] || "bg-gray-100 text-gray-600"}`}>
                      {post.category}
                    </span>
                    {post.published_at && (
                      <span className="text-xs text-gray-400">
                        {new Date(post.published_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    )}
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-green-700 transition-colors leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">{post.excerpt}</p>
                  <div className="mt-4 flex items-center gap-1 text-green-700 text-sm font-semibold">
                    Read more
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
