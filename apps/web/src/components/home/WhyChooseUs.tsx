"use client";

import { motion, type Variants } from "framer-motion";

const features = [
  {
    icon: "🌾",
    title: "Processed After Order",
    description:
      "We begin processing only after you place your order. No pre-stocked, aged inventory.",
    color: "from-green-500/10 to-green-600/5",
    border: "border-green-500/20",
    iconBg: "bg-green-100",
  },
  {
    icon: "🏺",
    title: "Heritage Rice Varieties",
    description:
      "Traditional Kerala varieties — Rakthashali, Uma Matta, Ponmani Matta — cultivated with generational care.",
    color: "from-amber-500/10 to-amber-600/5",
    border: "border-amber-500/20",
    iconBg: "bg-amber-100",
  },
  {
    icon: "🚜",
    title: "Direct From Source",
    description:
      "Sourced directly from Kerala paddy fields. Fewer hands, shorter supply chain, better quality.",
    color: "from-emerald-500/10 to-emerald-600/5",
    border: "border-emerald-500/20",
    iconBg: "bg-emerald-100",
  },
  {
    icon: "📦",
    title: "Small Batch Quality",
    description:
      "Each batch is carefully processed, quality-checked, and hygienically packed in small quantities.",
    color: "from-teal-500/10 to-teal-600/5",
    border: "border-teal-500/20",
    iconBg: "bg-teal-100",
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
              className={`relative p-6 rounded-2xl bg-gradient-to-br ${feature.color} border ${feature.border} group cursor-default`}
            >
              <div
                className={`w-14 h-14 ${feature.iconBg} rounded-xl flex items-center justify-center text-2xl mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300`}
              >
                {feature.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-3">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
