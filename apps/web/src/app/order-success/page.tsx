"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

function OrderSuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("order_id");
  const orderNumber = params.get("order_number");

  return (
    <div className="container mx-auto px-6 lg:px-8 max-w-2xl text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-5xl mx-auto mb-8"
      >
        ✅
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-bold text-gray-900 mb-4"
      >
        Order Confirmed!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-500 text-lg mb-8"
      >
        Thank you for your order. Your fresh Kerala heritage rice is now being prepared.
      </motion.p>

      {orderNumber && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-green-100 rounded-2xl p-6 mb-8 text-left shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 text-sm">Order Number</span>
            <span className="font-bold text-green-700 font-mono">{orderNumber}</span>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
            <p className="font-semibold text-amber-800 mb-3">🌾 What happens next?</p>
            <div className="space-y-2 text-sm text-amber-700">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">✓</span>
                <span>Payment confirmed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">⏱</span>
                <span>Rice processing begins within 24 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">📦</span>
                <span>Fresh packing within 3 working days</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">🚚</span>
                <span>Shipping notification sent via email</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Link
          href="/account"
          className="bg-green-700 text-white font-bold px-8 py-4 rounded-full hover:bg-green-600 transition-colors shadow-lg shadow-green-700/25"
        >
          Track Your Order
        </Link>
        <Link
          href="/products"
          className="border-2 border-gray-200 text-gray-700 font-semibold px-8 py-4 rounded-full hover:border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Continue Shopping
        </Link>
      </motion.div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <main className="pt-20 pb-16 min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center">
      <Suspense
        fallback={
          <div className="container mx-auto text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full animate-pulse mx-auto mb-8" />
            <div className="h-8 bg-gray-100 rounded animate-pulse w-64 mx-auto" />
          </div>
        }
      >
        <OrderSuccessContent />
      </Suspense>
    </main>
  );
}
