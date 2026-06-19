"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-green-950">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-paddy.png"
          alt="Lush green paddy fields in Kerala"
          fill
          priority
          className="object-cover opacity-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-green-950 via-green-900/60 to-green-900/40" />
      </div>

      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-sm font-medium px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                </span>
                Freshly Processed After Your Order
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Kerala Heritage
              <span className="block text-amber-400 mt-1">Rice,</span>
              <span className="block text-green-300 mt-1">Freshly Processed</span>
            </motion.h1>

            <motion.p
              className="text-xl text-green-100 mb-8 leading-relaxed max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Traditional rice varieties processed{" "}
              <span className="text-amber-300 font-semibold">only after your order</span>.
              No stockpiles. No months-old inventory. Just freshly processed Rakthashali, Uma Matta,
              and Ponmani Matta — delivered across India.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link
                href="/products"
                className="group inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-green-950 font-bold px-8 py-4 rounded-full transition-all duration-300 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5"
              >
                Shop Now
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white/60 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 backdrop-blur-sm hover:bg-white/10"
              >
                Explore Products
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              className="mt-12 flex flex-wrap gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {[
                { icon: "🌾", label: "Heritage Varieties" },
                { icon: "⏱️", label: "3-Day Processing" },
                { icon: "🚚", label: "Pan-India Delivery" },
                { icon: "✅", label: "Quality Verified" },
              ].map((badge) => (
                <div key={badge.label} className="flex items-center gap-2 text-green-200">
                  <span className="text-xl">{badge.icon}</span>
                  <span className="text-sm font-medium">{badge.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero Visual */}
          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-3xl scale-110" />

              {/* Main image container */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40 aspect-square max-w-lg mx-auto group">
                <div className="w-full h-full relative">
                  <Image
                    src="/images/red-rice-bowl.png"
                    alt="Premium traditional Kerala red Matta rice in an antique brass bowl"
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-950/90 via-green-900/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-amber-400 text-xl font-bold tracking-wide mb-1">Rakthashali Red Rice</p>
                    <p className="text-green-100 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">Traditionally Cultivated • Premium Quality</p>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <motion.div
                className="absolute -left-8 top-1/4 bg-white rounded-2xl p-4 shadow-xl border border-green-100"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl">
                    🌿
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Processing Time</p>
                    <p className="font-bold text-green-800 text-sm">3 Working Days</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -right-8 bottom-1/4 bg-white rounded-2xl p-4 shadow-xl border border-amber-100"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-xl">
                    ⭐
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Rakthashali</p>
                    <p className="font-bold text-amber-700 text-sm">Heritage Rice</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.div>
    </section>
  );
}
