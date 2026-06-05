"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function CTABanner() {
  return (
    <section className="py-20 bg-gradient-to-r from-green-700 to-green-800">
      <div className="container mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-4xl mb-6 block">🌾</span>
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
            Taste the Freshness Difference
          </h2>
          <p className="text-green-200 text-xl mb-10 max-w-2xl mx-auto">
            Order today. We start processing your Kerala heritage rice tomorrow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-amber-400 hover:bg-amber-300 text-green-950 font-bold px-10 py-4 rounded-full transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-amber-400/25"
            >
              Shop All Products
            </Link>
            <Link
              href="/about"
              className="border-2 border-white/40 hover:border-white text-white font-semibold px-10 py-4 rounded-full transition-all duration-300 hover:bg-white/10"
            >
              Our Story
            </Link>
          </div>
          <p className="text-green-300 text-sm mt-8">
            ✓ Free shipping on orders above ₹999 &nbsp;·&nbsp; ✓ Pan-India delivery &nbsp;·&nbsp; ✓ 3-day fresh processing
          </p>
        </motion.div>
      </div>
    </section>
  );
}
