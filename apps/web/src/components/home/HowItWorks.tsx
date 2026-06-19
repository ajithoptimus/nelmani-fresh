"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const steps = [
  {
    number: "01",
    image: "/images/timeline_order.png",
    title: "Customer Orders",
    description: "You place your order through our website. Payment confirmed.",
    color: "bg-green-600",
  },
  {
    number: "02",
    image: "/images/timeline_processing.png",
    title: "Processing Begins",
    description: "We begin milling and processing your selected rice variety fresh.",
    color: "bg-amber-600",
  },
  {
    number: "03",
    image: "/images/timeline_packing.png",
    title: "Fresh Packing",
    description: "Rice is hygienically packed in food-grade packaging immediately after processing.",
    color: "bg-teal-600",
  },
  {
    number: "04",
    image: "/images/timeline_quality.png",
    title: "Quality Check",
    description: "Every batch passes our quality verification before shipping.",
    color: "bg-green-700",
  },
  {
    number: "05",
    image: "/images/timeline_delivery.png",
    title: "Delivered Fresh",
    description: "Shipped within 3 working days of your order. Fresh to your door.",
    color: "bg-emerald-600",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-gradient-to-b from-green-50 to-white">
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
            Our Process
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            From Order to{" "}
            <span className="text-green-700">Your Door</span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Every grain is processed fresh. This is how we deliver freshness you can taste.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-200 via-amber-200 to-green-200 -translate-x-1/2 hidden sm:block" />

          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className={`relative flex items-start gap-6 ${
                  index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                }`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Step circle */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={`w-12 h-12 ${step.color} rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-black/10`}
                  >
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <div
                  className={`flex-1 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 ${
                    index % 2 === 0 ? "sm:mr-[10%] lg:mr-[50%] lg:pr-8" : "sm:ml-[10%] lg:ml-[50%] lg:pl-8"
                  }`}
                >
                  <div className="relative h-48 w-full bg-gray-100">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{step.title}</h3>
                    <p className="text-gray-500 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Processing time badge */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-3 bg-green-900 text-white px-8 py-4 rounded-full shadow-lg shadow-green-900/25">
            <span className="text-2xl">⏱️</span>
            <div className="text-left">
              <p className="font-bold text-lg">3 Working Days Processing</p>
              <p className="text-green-300 text-sm">From order confirmation to dispatch</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
