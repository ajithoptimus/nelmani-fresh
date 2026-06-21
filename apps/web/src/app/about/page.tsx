import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Nelmani Fresh — our commitment to freshly processed Kerala heritage rice, traditional varieties, and direct-from-source quality.",
};

const timeline = [
  { icon: "🌱", title: "Traditional Roots", desc: "Rooted in Kerala's centuries-old rice cultivation traditions, where each variety carries generational wisdom." },
  { icon: "🚜", title: "Direct Sourcing", desc: "We source directly from trusted paddy farms in Kerala, ensuring traceability and quality from field to pack." },
  { icon: "⚙️", title: "Fresh Processing", desc: "Rice is milled, cleaned, and graded only after your order — no pre-processing, no long storage." },
  { icon: "📦", title: "Premium Packaging", desc: "Hygienically packed in food-grade, moisture-resistant packaging to preserve freshness during transit." },
  { icon: "🚚", title: "Pan-India Delivery", desc: "Delivered fresh across India, with primary focus on Kerala, Tamil Nadu, and Karnataka." },
];

export default function AboutPage() {
  return (
    <main className="pt-20">
      {/* Hero */}
      <div className="relative text-white py-32 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/about_hero.png"
            alt="Lush green paddy fields in Kerala"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-green-950/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-green-950 via-transparent to-transparent opacity-80" />
        </div>

        <div className="container relative z-10 mx-auto px-6 lg:px-8 text-center max-w-3xl">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 drop-shadow-md">Our Story</h1>
          <p className="text-green-50 text-xl leading-relaxed drop-shadow">
            Nelmani Fresh was born from a simple belief: rice should reach you fresh, not
            months after processing. We honour Kerala's heritage rice traditions while bringing
            freshness you can taste.
          </p>
        </div>
      </div>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-semibold tracking-widest text-amber-600 uppercase mb-3 block">Our Mission</span>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Freshness Is Not a Feature.{" "}
                <span className="text-green-700">It's Our Promise.</span>
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                Conventional rice brands process in bulk and store for months before it reaches
                shelves. By the time you buy it, the rice may have been milled weeks or months ago.
              </p>
              <p className="text-gray-500 leading-relaxed">
                Nelmani Fresh does the opposite. We process only after you order. Your rice is
                milled, cleaned, packed, and shipped — all within 3 working days of your order
                confirmation.
              </p>
            </div>
            <div className="relative rounded-3xl overflow-hidden shadow-xl bg-white border border-gray-100 group">
              <div className="relative h-64 w-full bg-green-900">
                <Image
                  src="/images/about_mission.png"
                  alt="Farmer hands holding Kerala red rice"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 text-center">
                <p className="text-green-800 font-bold text-xl mb-1">SyntharaSight Private Limited</p>
                <p className="text-gray-500 text-sm">Parent Company</p>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-green-700 font-semibold">Nelmani Fresh</p>
                  <p className="text-gray-400 text-sm">Kerala Heritage Rice Brand</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">The Nelmani Fresh Way</h2>
          </div>
          <div className="space-y-8">
            {timeline.map((step, i) => (
              <div key={i} className="flex gap-5 items-start">
                <div className="w-14 h-14 bg-white border border-green-100 rounded-2xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0">
                  {step.icon}
                </div>
                <div className="pt-2">
                  <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-20 bg-green-950 text-white">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Three Varieties. One Promise.</h2>
          <p className="text-green-300 text-lg mb-12 max-w-xl mx-auto">
            Rakthashali, Uma Matta, and Ponmani Matta — each with their own heritage story.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { name: "Rakthashali", desc: "Traditional Kerala red rice, known for rich color and heritage value." },
              { name: "Uma Matta", desc: "Classic Matta rice for daily family consumption." },
              { name: "Ponmani Matta", desc: "Premium Matta rice with exceptional flavor and texture." },
            ].map((p) => (
              <div key={p.name} className="bg-white/10 border border-white/10 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-2">{p.name}</h3>
                <p className="text-green-300 text-sm">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
