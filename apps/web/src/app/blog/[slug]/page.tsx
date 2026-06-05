import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { blogApi } from "@/lib/api";
import type { BlogPostDetail } from "@/types";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { data }: { data: BlogPostDetail } = await blogApi.get(params.slug);
    return {
      title: data.meta_title || data.title,
      description: data.meta_description || data.excerpt,
      openGraph: {
        title: data.title,
        description: data.excerpt,
        type: "article",
        images: data.featured_image_url ? [{ url: data.featured_image_url }] : [],
      },
    };
  } catch {
    return { title: "Blog Post Not Found" };
  }
}

export const revalidate = 3600;

export default async function BlogPostPage({ params }: Props) {
  let post: BlogPostDetail;

  try {
    const { data } = await blogApi.get(params.slug);
    post = data;
  } catch {
    notFound();
  }

  const postSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: "Nelmani Fresh" },
    datePublished: post.published_at,
  };

  return (
    <main className="pt-20 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postSchema) }}
      />

      {/* Hero */}
      <div className="bg-gradient-to-br from-green-950 to-green-800 text-white py-16">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <nav className="flex items-center gap-2 text-sm text-green-300 mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <span>/</span>
            <span className="text-white">{post.title}</span>
          </nav>
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-amber-500/20 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full">
              {post.category}
            </span>
            {post.published_at && (
              <span className="text-green-300 text-sm">
                {new Date(post.published_at).toLocaleDateString("en-IN", {
                  day: "numeric", month: "long", year: "numeric"
                })}
              </span>
            )}
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">{post.title}</h1>
          <p className="text-green-200 text-lg">{post.excerpt}</p>
          <p className="text-green-400 text-sm mt-3">By {post.author}</p>
        </div>
      </div>

      {/* Content */}
      <article className="container mx-auto px-6 lg:px-8 max-w-3xl py-12">
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.body }} />

        <div className="mt-12 pt-8 border-t border-gray-100">
          <Link href="/blog" className="text-green-700 font-semibold hover:text-green-600 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
        </div>
      </article>
    </main>
  );
}
