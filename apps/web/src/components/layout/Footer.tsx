import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-green-950 text-white">
      {/* Main footer */}
      <div className="container mx-auto px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                N
              </div>
              <div>
                <span className="font-bold text-xl">Nelmani Fresh</span>
                <p className="text-xs text-green-400 -mt-0.5">Freshly Processed Kerala Rice</p>
              </div>
            </div>
            <p className="text-green-300 text-sm leading-relaxed mb-6">
              Traditional Kerala heritage rice varieties, processed fresh only after your order.
              By SyntharaSight Private Limited.
            </p>
            <div className="flex gap-3">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-green-800 hover:bg-green-700 rounded-lg flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a
                href="mailto:hello@nelmanifresh.com"
                className="w-9 h-9 bg-green-800 hover:bg-green-700 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Email"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-bold text-sm tracking-wider uppercase text-green-400 mb-5">Products</h4>
            <ul className="space-y-3">
              {[
                { href: "/products/rakthashali-rice", label: "Rakthashali Rice" },
                { href: "/products/uma-matta-rice", label: "Uma Matta Rice" },
                { href: "/products/ponmani-matta-rice", label: "Ponmani Matta Rice" },
                { href: "/products", label: "All Products" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-green-300 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-sm tracking-wider uppercase text-green-400 mb-5">Company</h4>
            <ul className="space-y-3">
              {[
                { href: "/about", label: "About Nelmani Fresh" },
                { href: "/blog", label: "Blog" },
                { href: "/contact", label: "Contact Us" },
                { href: "/faq", label: "FAQ" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-green-300 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm tracking-wider uppercase text-green-400 mb-5">Get in Touch</h4>
            <ul className="space-y-3 text-green-300 text-sm">
              <li>📧 hello@nelmanifresh.com</li>
              <li>📱 WhatsApp Support Available</li>
              <li>📍 Kerala, India</li>
            </ul>
            <div className="mt-6 bg-green-900/50 rounded-xl p-4 border border-green-800">
              <p className="text-xs text-green-400 mb-1">Processing Time</p>
              <p className="font-bold text-white">3 Working Days</p>
              <p className="text-xs text-green-400 mt-1">Fresh. Every order.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-green-900">
        <div className="container mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-green-400 text-xs">
            © {currentYear} Nelmani Fresh. All rights reserved. A brand of SyntharaSight Private Limited.
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="text-green-400 hover:text-white text-xs transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-green-400 hover:text-white text-xs transition-colors">Terms of Service</Link>
            <Link href="/refunds" className="text-green-400 hover:text-white text-xs transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
