import { Award, Users, Zap, Globe, Building2 } from 'lucide-react';

export default function About() {
  const founders = [
    {
      name: 'OBIDAH IMOITSIKE ZOE',
      title: 'Co-Founder & Chief Executive Officer',
      description: 'Visionary leader driving the expansion of Luxoria Group across global markets, with expertise in luxury commerce and strategic business development.',
      contact: '+234 913 301 7951 (Opay)',
    },
    {
      name: 'OKONKWO CHARLES ESOMCHI',
      title: 'Co-Founder & Chief Executive Officer',
      description: 'Strategic architect building scalable solutions across multiple sectors, overseeing operations and innovation in our global enterprise ecosystem.',
      contact: '+234 2007251656 (Kuda)',
    },
  ];

  const values = [
    {
      icon: Award,
      title: 'Excellence',
      description: 'Unwavering commitment to premium quality and exceptional standards in every transaction and service.',
    },
    {
      icon: Users,
      title: 'Client-Centric',
      description: 'Personalized service and attention to detail that exceeds expectations at every touchpoint.',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Continuous evolution and adoption of cutting-edge solutions for global luxury commerce.',
    },
    {
      icon: Globe,
      title: 'Global Vision',
      description: 'Expanding across continents with presence in every sector of luxury and enterprise.',
    },
  ];

  const sectors = [
    'Real Estate & Properties',
    'Automotive & Luxury Vehicles',
    'Fine Jewelry & Gemstones',
    'Investment Opportunities',
    'International Trade & Import/Export',
    'Hospitality & Luxury Hotels',
    'Premium Services & Concierge',
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-900 to-black py-16 px-4 sm:px-6 lg:px-8 border-b border-gold/30">
        <div className="max-w-6xl mx-auto">
          <p className="text-gold text-sm tracking-[0.2em] mb-4 font-light">OUR VISION</p>
          <h1 className="text-4xl sm:text-5xl font-light text-white mb-8">
            ABOUT LUXORIA
            <br />
            <span className="text-gold">GROUP</span>
          </h1>
          <p className="text-gray-300 text-lg font-light max-w-3xl">
            Building the world's premier luxury conglomerate with integrated operations spanning every sector of premium commerce, hospitality, and investment.
          </p>
        </div>
      </div>

      {/* Mission Statement */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-gold/30">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.pexels.com/photos/3482443/pexels-photo-3482443.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt="Global operations"
                className="w-full h-80 object-cover border border-gold/30"
              />
            </div>
            <div>
              <h2 className="text-3xl font-light text-white mb-6">Our Mission</h2>
              <p className="text-gray-400 leading-relaxed mb-4 font-light">
                Luxoria Group is dedicated to becoming the leading global luxury enterprise, commanding presence across diverse sectors including real estate, automotive, jewelry, hospitality, and strategic investments.
              </p>
              <p className="text-gray-400 leading-relaxed font-light">
                We are committed to delivering uncompromising excellence, innovative solutions, and transformative experiences to our clients worldwide while maintaining the highest standards of integrity and professionalism.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Expansion */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-gold/30 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-white mb-4">
              <Building2 className="inline mr-3 text-gold" size={40} />
              Sectors of Excellence
            </h2>
            <p className="text-gray-400 font-light">Expanding across multiple industries globally</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {sectors.map((sector, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-900 to-black border border-gold/20 p-6 hover:border-gold transition-colors group cursor-pointer">
                <Globe className="text-gold mb-4 group-hover:scale-110 transition-transform" size={28} />
                <p className="text-white font-light">{sector}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-gold/20 to-transparent border border-gold/30 p-8 text-center">
            <p className="text-gray-300 text-lg font-light">
              With strategic operations spanning continents, we are positioning Luxoria Group as the definitive global leader in luxury commerce, investment, and enterprise services.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-gold/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-white mb-4">Our Core Values</h2>
            <p className="text-gray-400 font-light">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-gradient-to-br from-gray-900 to-black border border-gold/20 p-8 text-center hover:border-gold transition-colors">
                  <div className="flex justify-center mb-4">
                    <Icon className="text-gold" size={40} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                  <p className="text-gray-400 font-light leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-gold/30 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-gold text-sm tracking-[0.2em] mb-4 font-light">LEADERSHIP</p>
            <h2 className="text-3xl sm:text-4xl font-light text-white mb-4">Meet Our Founders</h2>
            <p className="text-gray-400 font-light">Visionary leaders driving Luxoria Group's global expansion</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {founders.map((founder, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-900 to-black border border-gold/20 overflow-hidden hover:border-gold transition-colors group">
                <div className="h-80 bg-gradient-to-b from-gold/20 to-transparent flex items-center justify-center group-hover:from-gold/30 transition-colors">
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full bg-gold/20 border-2 border-gold mx-auto mb-4 flex items-center justify-center">
                      <span className="text-6xl text-gold font-light">{founder.name.charAt(0)}</span>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-semibold text-white mb-2">{founder.name}</h3>
                  <p className="text-gold text-sm mb-4 font-light">{founder.title}</p>
                  <p className="text-gray-400 mb-4 leading-relaxed font-light">{founder.description}</p>
                  <div className="pt-4 border-t border-gold/20">
                    <p className="text-gray-300 text-sm font-light">{founder.contact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Social Media Links */}
          <div className="text-center bg-gradient-to-r from-black via-gray-900 to-black border border-gold/20 p-8">
            <p className="text-gold text-sm tracking-widest mb-6 font-light">CONNECT WITH US</p>
            <div className="flex gap-6 justify-center flex-wrap">
              <a
                href="https://tiktok.com/@luxoria.group"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-gold text-gold hover:bg-gold hover:text-black transition-all font-light"
              >
                @luxoria.group
              </a>
              <a
                href="https://tiktok.com/@luxoria.autos"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-gold text-gold hover:bg-gold hover:text-black transition-all font-light"
              >
                @luxoria.autos
              </a>
              <a
                href="https://wa.me/2349133017951"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-gold text-gold hover:bg-gold hover:text-black transition-all font-light"
              >
                WhatsApp Support
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-black py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-gold/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { number: '7+', label: 'Sectors' },
              { number: '50+', label: 'Global Markets' },
              { number: '$2B+', label: 'Assets Managed' },
              { number: '24/7', label: 'Client Support' },
            ].map((stat, index) => (
              <div key={index}>
                <p className="text-4xl font-light text-gold mb-2">{stat.number}</p>
                <p className="text-gray-400 font-light">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
