import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import ConciergeModal from '../components/ConciergeModal';

type Page = 'home' | 'realestate' | 'autos' | 'jewelry' | 'investments' | 'importsexports' | 'about' | 'contact' | 'login' | 'dashboard';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const [conciergeOpen, setConciergeOpen] = useState(false);

  const portfolioItems = [
    { title: 'Luxury Estates', page: 'realestate', description: 'Premium properties in exclusive neighborhoods' },
    { title: 'Elite Autos', page: 'autos', description: 'Curated collection of luxury and performance vehicles' },
    { title: 'Fine Jewelry', page: 'jewelry', description: 'Exquisite jewelry pieces and gemstones' },
    { title: 'Investments', page: 'investments', description: 'High-yield investment opportunities' },
    { title: 'Global Trade', page: 'importsexports', description: 'Premium imports and exports' },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.pexels.com/photos/221298/pexels-photo-221298.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Luxury background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 animate-fade-in">
            <p className="text-gold text-sm tracking-[0.2em] mb-4 font-light">REFINED EXCELLENCE</p>
            <h1 className="text-5xl sm:text-7xl font-light mb-6 text-white tracking-wide">
              LUXORIA
              <br />
              <span className="text-gold font-light">GROUP</span>
            </h1>
          </div>

          <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            A prestigious collection of enterprises dedicated to the art of luxury living, exclusive real estate, and elite automotive engineering.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => onNavigate('realestate')}
              className="w-full sm:w-auto px-12 py-4 bg-gold text-black font-semibold hover:bg-gold/90 transition-all duration-300 transform hover:scale-105"
            >
              EXPLORE PORTFOLIO
            </button>
            <button
              onClick={() => setConciergeOpen(true)}
              className="w-full sm:w-auto px-12 py-4 border-2 border-gold text-gold font-semibold hover:bg-gold hover:text-black transition-all duration-300"
            >
              REQUEST CONCIERGE
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="animate-bounce text-gold">
            <ChevronRight className="rotate-90" size={24} />
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section className="bg-black py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <p className="text-gold text-sm tracking-[0.2em] mb-4 font-light">OUR ECOSYSTEM</p>
            <h2 className="text-4xl sm:text-5xl font-light mb-6 text-white">
              THE LUXORIA
              <br />
              <span className="text-gold">PORTFOLIO</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl leading-relaxed font-light">
              Consolidating excellence across multiple sectors, Luxoria Group ensures the same standard of premium service and uncompromised quality everywhere we operate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioItems.map((item, index) => (
              <button
                key={index}
                onClick={() => onNavigate(item.page as Page)}
                className="group bg-gradient-to-br from-gray-900 to-black border border-gold/30 p-8 hover:border-gold transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white group-hover:text-gold transition-colors">
                    {item.title}
                  </h3>
                  <ChevronRight className="text-gold opacity-0 group-hover:opacity-100 transform group-hover:translate-x-2 transition-all" />
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="bg-gradient-to-b from-black to-gray-900 py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-gold text-sm tracking-[0.2em] mb-4 font-light">FEATURED</p>
            <h2 className="text-4xl sm:text-5xl font-light text-white mb-4">
              Elite Offerings
            </h2>
            <p className="text-gray-400 text-lg font-light">
              Discover our most exclusive and sought-after properties and assets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-gray-800 to-black border border-gold/20 overflow-hidden hover:border-gold transition-colors">
              <img
                src="https://images.pexels.com/photos/450441/pexels-photo-450441.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt="Luxury property"
                className="w-full h-64 object-cover hover:scale-110 transition-transform duration-500"
              />
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-gold mb-3">Luxury Properties</h3>
                <p className="text-gray-400 mb-6">Experience the pinnacle of residential excellence with our curated collection of premium estates.</p>
                <button
                  onClick={() => onNavigate('realestate')}
                  className="text-gold hover:text-white transition-colors flex items-center gap-2"
                >
                  View Properties <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-black border border-gold/20 overflow-hidden hover:border-gold transition-colors">
              <img
                src="https://images.pexels.com/photos/280191/pexels-photo-280191.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt="Luxury vehicle"
                className="w-full h-64 object-cover hover:scale-110 transition-transform duration-500"
              />
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-gold mb-3">Elite Vehicles</h3>
                <p className="text-gray-400 mb-6">Explore our exclusive selection of luxury and performance automobiles with premium conditions.</p>
                <button
                  onClick={() => onNavigate('autos')}
                  className="text-gold hover:text-white transition-colors flex items-center gap-2"
                >
                  Browse Autos <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black border-t border-gold/30 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-light text-white mb-6">
            Join the <span className="text-gold">Elite</span> Community
          </h2>
          <p className="text-gray-400 text-lg mb-8 font-light">
            Create your account to unlock exclusive auctions, access member-only deals, and manage your luxury portfolio.
          </p>
          <button
            onClick={() => onNavigate('login')}
            className="px-10 py-3 bg-gold text-black font-semibold hover:bg-gold/90 transition-all"
          >
            Create Account
          </button>
        </div>
      </section>

      <ConciergeModal isOpen={conciergeOpen} onClose={() => setConciergeOpen(false)} />
    </div>
  );
}
