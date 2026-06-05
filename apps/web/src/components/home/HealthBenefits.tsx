"use client";

import { motion } from "framer-motion";

const benefits = [
  {
    icon: "🌿",
    title: "Naturally Nutrient-Rich",
    description:
      "Naturally contains fiber and essential nutrients found in traditionally milled rice. Part of balanced traditional Kerala diets.",
  },
  {
    icon: "🏛️",
    title: "Traditionally Valued",
    description:
      "Traditionally valued for nutritional qualities by generations of Kerala families. Rich in traditional goodness.",
  },
  {
    icon: "🌾",
    title: "Heritage Processing",
    description:
      "Processed using traditional methods that naturally retain the grain's wholesome characteristics.",
  },
  {
    icon: "🍚",
    title: "Daily Nourishment",
    description:
      "Part of a balanced diet. Traditional Kerala rice has been a dietary staple for centuries.",
  },
];

export function HealthBenefits() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-green-50">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Visual */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-green-800 to-green-950 aspect-square max-w-md">
              <div className="w-full h-full flex items-center justify-center p-12">
                <div className="text-center">
                  <div className="text-8xl mb-6">🌾</div>
                  <h3 className="text-white text-2xl font-bold mb-2">Traditional Goodness</h3>
                  <p className="text-green-300">Rakthashali • Uma Matta • Ponmani</p>
                </div>
              </div>

              {/* Decorative circles */}
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-amber-400/10 rounded-full" />
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-green-400/10 rounded-full" />
            </div>

            {/* Stat cards */}
            <div className="absolute -right-6 top-8 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Processing</p>
              <p className="text-2xl font-bold text-green-700">Fresh</p>
              <p className="text-xs text-gray-400">Only After Order</p>
            </div>
            <div className="absolute -left-6 bottom-8 bg-amber-50 rounded-2xl p-4 shadow-xl border border-amber-100">
              <p className="text-xs text-amber-600 mb-1">Heritage Since</p>
              <p className="text-2xl font-bold text-amber-700">Centuries</p>
              <p className="text-xs text-amber-600">Kerala Tradition</p>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-sm font-semibold tracking-widest text-amber-600 uppercase mb-3 block">
              Natural Goodness
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              The Way Rice Was{" "}
              <span className="text-green-700">Meant to Be</span>
            </h2>
            <p className="text-gray-500 text-lg mb-10 leading-relaxed">
              Kerala's traditional rice varieties carry the wisdom of centuries of cultivation.
              Naturally contains the wholesome qualities found in traditionally processed grains.
            </p>

            <div className="space-y-6">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit.title}
                  className="flex gap-4"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{benefit.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <p className="mt-8 text-xs text-gray-400 italic">
              * These statements reflect traditional dietary practices. Not intended as medical advice.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
