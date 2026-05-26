import { Award, Users, Zap } from 'lucide-react';

export default function About() {
  const founders = [
    {
      name: 'Founder & CEO',
      title: 'Visionary Leadership',
      description: 'Leading the Luxoria Group with a commitment to excellence and innovation in luxury markets.',
    },
    {
      name: 'Chief Operations Officer',
      title: 'Strategic Operations',
      description: 'Ensuring seamless operations across all divisions with precision and professionalism.',
    },
    {
      name: 'Chief Technology Officer',
      title: 'Digital Innovation',
      description: 'Driving technological advancement to enhance customer experience and market reach.',
    },
  ];

  const values = [
    {
      icon: Award,
      title: 'Excellence',
      description: 'Unwavering commitment to premium quality and exceptional standards in every transaction.',
    },
    {
      icon: Users,
      title: 'Client-Centric',
      description: 'Personalized service and attention to detail that exceeds expectations at every touchpoint.',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Continuous evolution and adoption of cutting-edge solutions for luxury commerce.',
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-900 to-black py-16 px-4 sm:px-6 lg:px-8 border-b border-gold/30">
        <div className="max-w-6xl mx-auto">
          <p className="text-gold text-sm tracking-[0.2em] mb-4 font-light">OUR STORY</p>
          <h1 className="text-4xl sm:text-5xl font-light text-white mb-8">
            ABOUT LUXORIA
            <br />
            <span className="text-gold">GROUP</span>
          </h1>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-gold/30">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img
                src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt="Team collaboration"
                className="w-full h-80 object-cover border border-gold/30"
              />
            </div>
            <div>
              <h2 className="text-3xl font-light text-white mb-6">Our Foundation</h2>
              <p className="text-gray-400 leading-relaxed mb-4 font-light">
                Luxoria Group was founded on the principle that luxury is not merely about possessions, but about experiences, relationships, and the pursuit of excellence. We believe in creating pathways for discerning individuals to access premium assets with confidence and ease.
              </p>
              <p className="text-gray-400 leading-relaxed font-light">
                With a presence across real estate, automotive, jewelry, investments, and international trade, we have established ourselves as the premier destination for luxury commerce in Africa.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-light text-white mb-6">Our Mission</h2>
              <p className="text-gray-400 leading-relaxed font-light">
                To democratize access to luxury while maintaining the exclusivity and prestige that defines our brand. We strive to connect buyers, sellers, and investors in a secure, transparent, and seamless ecosystem where every transaction reflects our commitment to excellence.
              </p>
            </div>
            <div>
              <img
                src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt="Business meeting"
                className="w-full h-80 object-cover border border-gold/30"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-gold/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-white mb-4">Our Core Values</h2>
            <p className="text-gray-400 font-light">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

      {/* Leadership Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-gold text-sm tracking-[0.2em] mb-4 font-light">LEADERSHIP</p>
            <h2 className="text-3xl sm:text-4xl font-light text-white mb-4">Meet Our Founders</h2>
            <p className="text-gray-400 font-light">Driving excellence and innovation across Luxoria Group</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {founders.map((founder, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-900 to-black border border-gold/20 overflow-hidden hover:border-gold transition-colors group">
                <div className="h-72 bg-gradient-to-b from-gold/20 to-transparent flex items-center justify-center group-hover:from-gold/30 transition-colors">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-gold/20 border-2 border-gold mx-auto mb-4 flex items-center justify-center">
                      <span className="text-4xl text-gold font-light">{founder.name.charAt(0)}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{founder.name}</h3>
                  <p className="text-gold text-sm mb-4 font-light">{founder.title}</p>
                  <p className="text-gray-400 text-sm leading-relaxed font-light">{founder.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-black py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-gold/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { number: '500+', label: 'Premium Listings' },
              { number: '10K+', label: 'Active Members' },
              { number: '5', label: 'Business Divisions' },
              { number: '$2B+', label: 'Assets Under Management' },
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
