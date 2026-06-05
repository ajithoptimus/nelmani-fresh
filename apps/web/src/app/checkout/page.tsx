"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { ordersApi, addressesApi, paymentsApi } from "@/lib/api";
import { initiateRazorpayPayment } from "@/lib/razorpay";
import { INDIAN_STATES, type Address, type AddressInput } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, subtotal, shipping_fee, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [step, setStep] = useState<"address" | "review" | "payment">("address");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<AddressInput>({
    name: user?.full_name || "",
    phone: user?.phone || "",
    address_line1: "",
    address_line2: "",
    city: "",
    district: "",
    state: "Kerala",
    pincode: "",
    is_default: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout");
      return;
    }
    if (items.length === 0) {
      router.push("/products");
      return;
    }
    loadAddresses();
  }, [isAuthenticated]);

  const loadAddresses = async () => {
    try {
      const { data } = await addressesApi.list();
      setAddresses(data);
      const defaultAddr = data.find((a: Address) => a.is_default);
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      else if (data.length === 0) setShowNewAddress(true);
    } catch {}
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId && !showNewAddress) {
      setError("Please select a delivery address");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let addressId = selectedAddressId;

      // Create new address if form is shown
      if (showNewAddress || !addressId) {
        const { data: newAddr } = await addressesApi.create(form);
        addressId = newAddr.id;
      }

      // Create internal order
      const { data: order } = await ordersApi.create(addressId!, undefined);

      // Create Razorpay order
      const { data: rzpData } = await paymentsApi.createRazorpayOrder(order.id);

      // Initiate payment
      await initiateRazorpayPayment({
        razorpayOrderId: rzpData.razorpay_order_id,
        amount: rzpData.amount,
        currency: rzpData.currency,
        userName: user?.full_name || undefined,
        userEmail: user?.email,
        userPhone: user?.phone || undefined,
        onSuccess: async (response) => {
          try {
            await paymentsApi.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: order.id,
            });
            await clearCart();
            router.push(`/order-success?order_id=${order.id}&order_number=${order.order_number}`);
          } catch {
            setError("Payment verification failed. Please contact support.");
          }
        },
        onFailure: (err) => {
          setError("Payment was cancelled. Your order has not been placed.");
        },
      });
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-20 pb-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg mb-5">Delivery Address</h2>

              {/* Existing addresses */}
              {addresses.length > 0 && (
                <div className="space-y-3 mb-4">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                        selectedAddressId === addr.id && !showNewAddress
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === addr.id && !showNewAddress}
                        onChange={() => { setSelectedAddressId(addr.id); setShowNewAddress(false); }}
                        className="mt-1 accent-green-700"
                      />
                      <div className="text-sm">
                        <p className="font-semibold text-gray-900">{addr.name} · {addr.phone}</p>
                        <p className="text-gray-500">{addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ""}</p>
                        <p className="text-gray-500">{addr.city}, {addr.district}, {addr.state} — {addr.pincode}</p>
                        {addr.is_default && <span className="text-xs text-green-600 font-medium">Default</span>}
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {/* Add new address */}
              <button
                onClick={() => { setShowNewAddress(!showNewAddress); setSelectedAddressId(null); }}
                className="text-sm text-green-700 font-semibold hover:text-green-600 transition-colors"
              >
                + {addresses.length === 0 ? "Add delivery address" : "Use a different address"}
              </button>

              {showNewAddress && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 space-y-4"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        placeholder="Ravi Kumar"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                    <input
                      type="text"
                      value={form.address_line1}
                      onChange={(e) => setForm({ ...form, address_line1: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      placeholder="House / Street / Colony"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                    <input
                      type="text"
                      value={form.address_line2}
                      onChange={(e) => setForm({ ...form, address_line2: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      placeholder="Landmark (optional)"
                    />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
                      <input
                        type="text"
                        value={form.district}
                        onChange={(e) => setForm({ ...form, district: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                      <input
                        type="text"
                        value={form.pincode}
                        onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                        maxLength={6}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <select
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white"
                    >
                      {INDIAN_STATES.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-24">
              <h2 className="font-bold text-gray-900 text-lg mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <p className="text-gray-900 font-medium">{item.product_name}</p>
                      <p className="text-gray-400">{item.size_kg}kg × {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">₹{item.total_price.toFixed(0)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span>{shipping_fee === 0 ? <span className="text-green-600">Free</span> : `₹${shipping_fee}`}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-green-700">₹{total.toFixed(0)}</span>
                </div>
              </div>

              <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700">
                ⏱️ Your rice will be processed fresh after payment confirmation. Allow 3 working days.
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading || items.length === 0}
                className="mt-5 w-full bg-green-700 hover:bg-green-600 disabled:bg-gray-200 text-white font-bold py-4 rounded-xl transition-all active:scale-95"
              >
                {loading ? "Processing..." : `Pay ₹${total.toFixed(0)}`}
              </button>

              <p className="mt-3 text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                🔒 Secure payment via Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
