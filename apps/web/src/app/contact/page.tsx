import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Nelmani Fresh. WhatsApp, email, or contact form — we're here to help.",
};

export default function ContactPage() {
  return (
    <main className="pt-20 pb-20">
      <div className="bg-gradient-to-br from-green-950 to-green-800 text-white py-16">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-green-200 text-lg">We're here to help with any questions about your order.</p>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 max-w-4xl py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input type="email" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" placeholder="Order inquiry, product questions..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                <textarea rows={5} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none resize-none" placeholder="How can we help?" />
              </div>
              <button type="submit" className="w-full bg-green-700 text-white font-bold py-3.5 rounded-xl hover:bg-green-600 transition-colors">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
            <div className="space-y-4">
              <a
                href="https://wa.me/91XXXXXXXXXX"
                className="flex items-center gap-4 p-4 bg-green-50 border border-green-100 rounded-xl hover:bg-green-100 transition-colors"
              >
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white text-xl">💬</div>
                <div>
                  <p className="font-semibold text-gray-900">WhatsApp</p>
                  <p className="text-gray-500 text-sm">Chat with us instantly</p>
                </div>
              </a>
              <a
                href="mailto:hello@nelmanifresh.com"
                className="flex items-center gap-4 p-4 bg-amber-50 border border-amber-100 rounded-xl hover:bg-amber-100 transition-colors"
              >
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white text-xl">📧</div>
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-gray-500 text-sm">hello@nelmanifresh.com</p>
                </div>
              </a>
              <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100 rounded-xl">
                <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center text-white text-xl">📍</div>
                <div>
                  <p className="font-semibold text-gray-900">Location</p>
                  <p className="text-gray-500 text-sm">Kerala, India</p>
                </div>
              </div>
            </div>
            <div className="bg-green-900 text-white rounded-2xl p-6">
              <p className="font-bold mb-2">📦 Order Queries</p>
              <p className="text-green-300 text-sm">
                For order-related queries, please include your order number (NF-XXXXXXXX-XXXXX) in your message for faster resolution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
