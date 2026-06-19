"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";

const features = [
  {
    image: "/images/feature_fresh.png",
    title: "Processed After Order",
    description:
      "We begin processing only after you place your order. No pre-stocked, aged inventory.",
  },
  {
    image: "/images/feature_heritage.png",
    title: "Heritage Rice Varieties",
    description:
      "Traditional Kerala varieties — Rakthashali, Uma Matta, Ponmani Matta — cultivated with generational care.",
  },
  {
    image: "/images/feature_source.png",
    title: "Direct From Source",
    description:
      "Sourced directly from Kerala paddy fields. Fewer hands, shorter supply chain, better quality.",
  },
  {
    image: "/images/feature_quality.png",
    title: "Small Batch Quality",
    description:
      "Each batch is carefully processed, quality-checked, and hygienically packed in small quantities.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export function WhyChooseUs() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-sm font-semibold tracking-widest text-amber-600 uppercase mb-3 block">
            Why Nelmani Fresh
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            The Freshness{" "}
            <span className="text-green-700">Difference</span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Most rice is processed months before it reaches you. We do it differently.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-default"
            >
              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-gray-900 text-lg mb-3">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
