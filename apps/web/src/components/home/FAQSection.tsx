"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "Why does processing take 3 working days?",
    a: "Unlike conventional rice brands that process in bulk and store for months, we begin milling your specific order only after payment confirmation. This ensures you receive the freshest possible rice — no aged inventory, no long storage periods.",
  },
  {
    q: "How fresh is the rice when it reaches me?",
    a: "Your rice is processed within 3 working days of your order. By the time it reaches you, it has been milled, cleaned, graded, and packed fresh — typically within the past week.",
  },
  {
    q: "How is the rice packed?",
    a: "Each batch is packed in food-grade, moisture-resistant packaging immediately after processing. We use airtight sealing to preserve freshness during transit.",
  },
  {
    q: "Do you deliver across India?",
    a: "Yes, we deliver pan-India. While our primary focus is on Kerala, Tamil Nadu, and Karnataka, we ship to all Indian states and union territories.",
  },
  {
    q: "How should I store the rice after delivery?",
    a: "Store in a cool, dry place away from direct sunlight. For best results, use an airtight container. Consume within 3–6 months of delivery for optimal freshness.",
  },
  {
    q: "What are the available sizes?",
    a: "We offer 1 kg, 5 kg, and 10 kg packs for all our rice varieties. The 5 kg and 10 kg packs offer better value for families.",
  },
];

function FAQItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-green-50/50 transition-colors"
        onClick={onToggle}
      >
        <span className="font-semibold text-gray-900 pr-4">{q}</span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-lg"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <p className="px-5 pb-5 text-gray-500 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-semibold tracking-widest text-amber-600 uppercase mb-3 block">
            Got Questions?
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked{" "}
            <span className="text-green-700">Questions</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <FAQItem
                q={faq.q}
                a={faq.a}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
