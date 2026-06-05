/**
 * Razorpay payment helper utility
 */

import type { RazorpayOptions, RazorpayPaymentResponse } from "@/types";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: string, handler: () => void) => void;
    };
  }
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function initiateRazorpayPayment({
  razorpayOrderId,
  amount,
  currency = "INR",
  userName,
  userEmail,
  userPhone,
  onSuccess,
  onFailure,
}: {
  razorpayOrderId: string;
  amount: number; // in paise
  currency?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  onSuccess: (response: RazorpayPaymentResponse) => void;
  onFailure?: (error: unknown) => void;
}) {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    throw new Error("Failed to load Razorpay. Please check your internet connection.");
  }

  const options: RazorpayOptions = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
    amount,
    currency,
    name: "Nelmani Fresh",
    description: "Freshly Processed Kerala Heritage Rice",
    order_id: razorpayOrderId,
    prefill: {
      name: userName,
      email: userEmail,
      contact: userPhone,
    },
    theme: {
      color: "#15803d", // Deep green — brand color
    },
    handler: onSuccess,
    modal: {
      ondismiss: () => {
        onFailure?.(new Error("Payment cancelled by user"));
      },
    },
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
}
