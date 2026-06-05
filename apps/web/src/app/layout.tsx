import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://nelmanifresh.com"),
  title: {
    default: "Nelmani Fresh — Freshly Processed Kerala Heritage Rice",
    template: "%s | Nelmani Fresh",
  },
  description:
    "Traditional Kerala rice varieties — Rakthashali, Uma Matta, Ponmani Matta — freshly processed only after your order. Pan-India delivery.",
  keywords: [
    "Kerala rice",
    "Rakthashali rice",
    "Uma Matta",
    "Ponmani Matta",
    "Kerala heritage rice",
    "fresh processed rice",
    "buy rice online India",
    "traditional Kerala rice",
  ],
  authors: [{ name: "SyntharaSight Private Limited" }],
  creator: "SyntharaSight Private Limited",
  publisher: "Nelmani Fresh",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Nelmani Fresh",
  },
  twitter: {
    card: "summary_large_image",
    site: "@nelmanifresh",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-white text-gray-900">
        <Providers>
          <Header />
          {children}
          <Footer />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
