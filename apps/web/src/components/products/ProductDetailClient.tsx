"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { ProductDetail, ProductVariant } from "@/types";
import { useCartStore } from "@/store/cart";

interface Props {
  product: ProductDetail;
}

export function ProductDetailClient({ product }: Props) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0]
  );
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const { addItem } = useCartStore();

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addItem(selectedVariant.id, quantity);
    } finally {
      setAdding(false);
    }
  };

  const images = product.images;

  // JSON-LD Product Schema
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_description,
    image: images[0]?.url,
    brand: { "@type": "Brand", name: "Nelmani Fresh" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: Math.min(...product.variants.map((v) => v.price)),
      highPrice: Math.max(...product.variants.map((v) => v.price)),
      availability: "https://schema.org/InStock",
    },
    ...(product.average_rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.average_rating,
        reviewCount: product.review_count,
      },
    }),
  };

  return (
    <div className="container mx-auto px-6 lg:px-8 py-12">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-green-700 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-green-700 transition-colors">Products</Link>
        <span>/</span>
        <span className="text-gray-700">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* Gallery */}
        <div className="space-y-4">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-green-50 to-amber-50 border border-gray-100"
          >
            {images[selectedImage] ? (
              <Image
                src={images[selectedImage].url}
                alt={images[selectedImage].alt_text || product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <span className="text-8xl">🌾</span>
                <p className="text-green-700 font-medium mt-3">{product.name}</p>
              </div>
            )}
          </motion.div>

          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                    i === selectedImage ? "border-green-600" : "border-gray-200"
                  }`}
                >
                  <Image src={img.url} alt={img.alt_text || ""} width={64} height={64} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            {product.origin_region || "Kerala, India"}
          </span>

          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">{product.name}</h1>

          {/* Rating */}
          {product.average_rating && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(product.average_rating!) ? "text-amber-400" : "text-gray-200"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.average_rating.toFixed(1)} ({product.review_count} reviews)
              </span>
            </div>
          )}

          <p className="text-gray-500 leading-relaxed mb-6">{product.short_description}</p>

          {/* Variant selector */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">Select Size</p>
            <div className="flex flex-wrap gap-3">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  disabled={!variant.is_available}
                  className={`relative px-5 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                    selectedVariant.id === variant.id
                      ? "border-green-600 bg-green-50 text-green-700"
                      : variant.is_available
                      ? "border-gray-200 hover:border-green-400 text-gray-700"
                      : "border-gray-100 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  <span className="block">{variant.size_kg}kg</span>
                  <span className="block text-xs font-normal mt-0.5">₹{variant.price}</span>
                  {!variant.is_available && (
                    <span className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl text-xs text-gray-400">
                      Out of Stock
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-green-700">
                ₹{selectedVariant.price.toFixed(0)}
              </span>
              {selectedVariant.compare_at_price && (
                <span className="text-xl text-gray-400 line-through mb-0.5">
                  ₹{selectedVariant.compare_at_price.toFixed(0)}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400">For {selectedVariant.size_kg}kg pack</p>
          </div>

          {/* Processing notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 text-amber-800 font-semibold mb-1">
              <span>⏱️</span> Fresh Processing Guarantee
            </div>
            <p className="text-amber-700 text-sm">
              This rice is processed fresh only after your order. Allow{" "}
              <strong>{product.processing_days} working days</strong> for processing before
              dispatch.
            </p>
          </div>

          {/* Quantity + CTA */}
          <div className="flex gap-4 mb-6">
            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-xl"
              >
                −
              </button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-xl"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={adding || !selectedVariant.is_available}
              className="flex-1 bg-green-700 hover:bg-green-600 disabled:bg-gray-200 text-white font-bold py-3 rounded-xl transition-all active:scale-95"
            >
              {adding ? "Adding..." : "Add to Cart"}
            </button>
          </div>

          <Link
            href="/checkout"
            className="block w-full text-center border-2 border-green-700 text-green-700 hover:bg-green-50 font-bold py-3 rounded-xl transition-colors"
          >
            Buy Now
          </Link>
        </div>
      </div>

      {/* Tabs: Description, Heritage, Nutrition, Cooking */}
      <ProductTabs product={product} />
    </div>
  );
}

function ProductTabs({ product }: { product: ProductDetail }) {
  const [tab, setTab] = useState<"description" | "heritage" | "nutrition" | "cooking">("description");

  const tabs = [
    { id: "description", label: "Description" },
    { id: "heritage", label: "Heritage Story" },
    { id: "nutrition", label: "Nutritional Info" },
    { id: "cooking", label: "Cooking Guide" },
  ] as const;

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden">
      <div className="flex border-b border-gray-100">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${
              tab === t.id
                ? "bg-green-50 text-green-700 border-b-2 border-green-700"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="p-8">
        {tab === "description" && (
          <div className="prose max-w-none text-gray-600 leading-relaxed">
            {product.description}
          </div>
        )}
        {tab === "heritage" && (
          <div className="prose max-w-none text-gray-600 leading-relaxed">
            {product.heritage_story || "Heritage story coming soon."}
          </div>
        )}
        {tab === "nutrition" && (
          <div className="text-gray-600">
            {product.nutritional_info ? (
              <pre className="whitespace-pre-wrap font-sans">{product.nutritional_info}</pre>
            ) : (
              <p>Nutritional information coming soon.</p>
            )}
          </div>
        )}
        {tab === "cooking" && (
          <div className="prose max-w-none text-gray-600 leading-relaxed">
            {product.cooking_instructions || "Cooking guide coming soon."}
            {product.storage_instructions && (
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <p className="font-semibold text-blue-800 mb-2">Storage Instructions</p>
                <p className="text-blue-700">{product.storage_instructions}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
