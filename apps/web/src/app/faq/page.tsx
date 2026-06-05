import type { Metadata } from "next";
import { FAQSection } from "@/components/home/FAQSection";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions",
  description:
    "Answers to common questions about Nelmani Fresh — processing time, freshness, delivery, and storage.",
};

export default function FAQPage() {
  return (
    <main className="pt-20">
      <div className="bg-gradient-to-br from-green-950 to-green-800 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-3">Frequently Asked Questions</h1>
        <p className="text-green-200">Everything you need to know about Nelmani Fresh</p>
      </div>
      <FAQSection />
    </main>
  );
}
