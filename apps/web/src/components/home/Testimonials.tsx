"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const testimonials = [
  {
    name: "Priya Nair",
    location: "Thrissur, Kerala",
    rating: 5,
    text: "The Rakthashali rice tastes completely different from what I was buying at the supermarket. You can actually tell it's been freshly processed. My family loved it.",
    product: "Rakthashali Rice",
  },
  {
    name: "Anand Krishnan",
    location: "Bengaluru, Karnataka",
    rating: 5,
    text: "I was skeptical about ordering rice online but the fresh processing concept convinced me to try. The Uma Matta rice arrived well-packed and the quality is excellent.",
    product: "Uma Matta Rice",
  },
  {
    name: "Meera Suresh",
    location: "Chennai, Tamil Nadu",
    rating: 5,
    text: "Ponmani Matta has such a wonderful texture. The 3-day processing time is worth the wait. This is now our household rice.",
    product: "Ponmani Matta Rice",
  },
  {
    name: "Rajesh Menon",
    location: "Kochi, Kerala",
    rating: 5,
    text: "Finally a brand that takes freshness seriously. The packaging is premium, the rice quality is top-notch. Will definitely order again.",
    product: "Rakthashali Rice",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-24 bg-green-950 text-white overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-semibold tracking-widest text-amber-400 uppercase mb-3 block">
            Customer Stories
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Loved by Rice Connoisseurs
          </h2>
          <p className="text-green-300 text-lg">
            Real customers. Real freshness. Real difference.
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-colors"
            >
              <StarRating rating={t.rating} />
              <p className="text-green-100 mt-4 mb-6 text-sm leading-relaxed italic">
                "{t.text}"
              </p>
              <div className="border-t border-white/10 pt-4">
                <p className="font-semibold text-white">{t.name}</p>
                <p className="text-green-400 text-xs mt-0.5">{t.location}</p>
                <span className="inline-block mt-2 bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded">
                  {t.product}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
