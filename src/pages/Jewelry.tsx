import { Sparkles } from 'lucide-react';

export default function Jewelry() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-900 to-black py-16 px-4 sm:px-6 lg:px-8 border-b border-gold/30">
        <div className="max-w-6xl mx-auto">
          <p className="text-gold text-sm tracking-[0.2em] mb-4 font-light">FINE JEWELRY</p>
          <h1 className="text-4xl sm:text-5xl font-light text-white mb-8">
            LUXORIA
            <br />
            <span className="text-gold">JEWELS</span>
          </h1>
        </div>
      </div>

      {/* Coming Soon Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl">
          <div className="mb-8 inline-block">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-gold/20 to-transparent rounded-full animate-pulse"></div>
              <Sparkles className="text-gold" size={80} />
            </div>
          </div>

          <h2 className="text-5xl sm:text-6xl font-light text-white mb-6">
            Coming
            <br />
            <span className="text-gold">Soon</span>
          </h2>

          <p className="text-gray-400 text-xl font-light mb-8 leading-relaxed">
            We are curating an exquisite collection of fine jewelry, gemstones, and luxury accessories from around the world. Our jewelry division will showcase the finest pieces handpicked for discerning collectors.
          </p>

          <div className="space-y-4">
            <p className="text-gray-300 font-light">
              In the meantime, explore our other luxury divisions or reach out for exclusive previews.
            </p>

            <div className="flex gap-4 justify-center flex-wrap pt-6">
              <a
                href="https://wa.me/2349133017951"
                className="px-8 py-3 bg-gold text-black font-semibold hover:bg-gold/90 transition-all"
              >
                Notify Me
              </a>
              <a
                href="/"
                className="px-8 py-3 border border-gold text-gold hover:bg-gold hover:text-black transition-all font-light"
              >
                Back to Home
              </a>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="mt-16 pt-8 border-t border-gold/20">
            <div className="flex justify-center gap-8 flex-wrap">
              <div className="text-center">
                <p className="text-3xl font-light text-gold mb-2">100%</p>
                <p className="text-gray-400 text-sm font-light">Authentic</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-light text-gold mb-2">Curated</p>
                <p className="text-gray-400 text-sm font-light">by Experts</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-light text-gold mb-2">Certified</p>
                <p className="text-gray-400 text-sm font-light">Gemstones</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
