import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { HealthBenefits } from "@/components/home/HealthBenefits";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQSection } from "@/components/home/FAQSection";
import { CTABanner } from "@/components/home/CTABanner";

export const metadata: Metadata = {
  title: "Nelmani Fresh — Freshly Processed Kerala Heritage Rice",
  description:
    "Order traditional Kerala rice varieties — Rakthashali, Uma Matta, and Ponmani Matta — processed fresh only after your order. Delivered across India.",
  openGraph: {
    title: "Nelmani Fresh — Freshly Processed Kerala Heritage Rice",
    description:
      "We process and pack your rice only after receiving your order. Traditional Kerala varieties with 3-day fresh processing.",
    url: "https://nelmanifresh.com",
    siteName: "Nelmani Fresh",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nelmani Fresh — Freshly Processed Kerala Heritage Rice",
    description: "Fresh-processed traditional Kerala rice. Order now.",
  },
};

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <WhyChooseUs />
      <HowItWorks />
      <FeaturedProducts />
      <HealthBenefits />
      <Testimonials />
      <FAQSection />
      <CTABanner />
    </main>
  );
}
