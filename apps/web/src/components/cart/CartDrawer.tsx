"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cart";
import Link from "next/link";
import Image from "next/image";

export function CartDrawer() {
  const { isOpen, closeCart, items, item_count, subtotal, shipping_fee, total, updateItem, removeItem, isLoading } =
    useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-lg text-gray-900">Your Cart</h2>
                <p className="text-sm text-gray-400">
                  {item_count} {item_count === 1 ? "item" : "items"}
                </p>
              </div>
              <button
                onClick={closeCart}
                className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="text-gray-900 font-semibold text-lg mb-2">Your cart is empty</p>
                  <p className="text-gray-400 text-sm mb-6">Add some freshly processed rice to get started</p>
                  <button
                    onClick={closeCart}
                    className="bg-green-700 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-green-600 transition-colors"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    {/* Image */}
                    <div className="w-16 h-16 bg-green-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.primary_image ? (
                        <Image src={item.primary_image} alt={item.product_name} width={64} height={64} className="object-cover w-full h-full" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">🌾</div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{item.product_name}</p>
                      <p className="text-gray-400 text-xs mb-2">{item.size_kg}kg pack</p>
                      <div className="flex items-center justify-between">
                        {/* Quantity controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateItem(item.id, item.quantity - 1)}
                            disabled={isLoading}
                            className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:border-gray-400 transition-colors disabled:opacity-50"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateItem(item.id, item.quantity + 1)}
                            disabled={isLoading}
                            className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:border-gray-400 transition-colors disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                        {/* Price */}
                        <div className="text-right">
                          <p className="font-bold text-green-700">₹{item.total_price.toFixed(0)}</p>
                          <p className="text-xs text-gray-400">₹{item.unit_price}/kg</p>
                        </div>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors self-start mt-1"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Summary + CTA */}
            {items.length > 0 && (
              <div className="p-5 border-t border-gray-100 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Shipping</span>
                    <span>{shipping_fee === 0 ? <span className="text-green-600 font-medium">Free</span> : `₹${shipping_fee}`}</span>
                  </div>
                  {shipping_fee > 0 && (
                    <p className="text-xs text-amber-600">
                      Add ₹{(999 - subtotal).toFixed(0)} more for free shipping
                    </p>
                  )}
                  <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span className="text-green-700">₹{total.toFixed(0)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full bg-green-700 hover:bg-green-600 text-white text-center font-bold py-4 rounded-xl transition-colors"
                >
                  Proceed to Checkout
                </Link>
                <div className="text-center text-xs text-gray-400 flex items-center justify-center gap-2">
                  <span>🔒</span>
                  <span>Secure checkout powered by Razorpay</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
