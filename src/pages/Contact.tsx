import { Mail, MessageCircle, Phone, MapPin, Send } from 'lucide-react';
import { useState, type ElementType } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 3000);
  };

  const contactInfo: {
    icon: ElementType;
    label: string;
    items: { text: string; href: string; subtitle?: string }[];
  }[] = [
    {
      icon: Phone,
      label: 'Phone Lines',
      items: [
        { text: '+234 913 301 7951', href: 'tel:+2349133017951' },
        { text: '+234 913 178 3786', href: 'tel:+2349131783786' },
        { text: '+234 916 082 6451', href: 'tel:+2349160826451' },
        { text: '+234 915 658 9328', href: 'tel:+2349156589328' },
      ],
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      items: [
        { text: '+234 913 301 7951', href: 'https://wa.me/2349133017951' },
        { text: '+234 913 178 3786', href: 'https://wa.me/2349131783786' },
        { text: '+234 916 082 6451', href: 'https://wa.me/2349160826451' },
        { text: '+234 915 658 9328', href: 'https://wa.me/2349156589328' },
      ],
    },
    {
      icon: Mail,
      label: 'Email',
      items: [
        { text: 'zedg7729@gmail.com', href: 'mailto:zedg7729@gmail.com', subtitle: 'Personal' },
        { text: 'esomchi2016@gmail.com', href: 'mailto:esomchi2016@gmail.com', subtitle: 'Personal' },
        { text: 'luxoriagroupltd@gmail.com', href: 'mailto:luxoriagroupltd@gmail.com', subtitle: 'Business' },
        { text: 'luxoriaautos@gmail.com', href: 'mailto:luxoriaautos@gmail.com', subtitle: 'Automotive Division' },
        { text: 'luxoriapropertiesandhomes@gmail.com', href: 'mailto:luxoriapropertiesandhomes@gmail.com', subtitle: 'Real Estate Division' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-900 to-black py-16 px-4 sm:px-6 lg:px-8 border-b border-gold/30">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gold text-sm tracking-[0.2em] mb-4 font-light">GET IN TOUCH</p>
          <h1 className="text-4xl sm:text-5xl font-light text-white mb-6">
            CONTACT
            <br />
            <span className="text-gold">LUXORIA</span>
          </h1>
          <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto">
            Reach out to our team for inquiries, partnerships, or to schedule a private consultation.
          </p>
        </div>
      </div>

      {/* Contact Info Cards */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((section, index) => {
              const Icon = section.icon;
              return (
                <div key={index} className="bg-gradient-to-br from-gray-900 to-black border border-gold/20 p-8 hover:border-gold transition-colors">
                  <div className="flex items-center gap-3 mb-6">
                    <Icon className="text-gold" size={28} />
                    <h3 className="text-xl font-semibold text-white">{section.label}</h3>
                  </div>

                  <div className="space-y-4">
                    {section.items.map((item, itemIndex) => (
                      <a
                        key={itemIndex}
                        href={item.href}
                        target={item.href.startsWith('http') && !item.href.startsWith('mailto:') ? '_blank' : undefined}
                        rel={item.href.startsWith('http') && !item.href.startsWith('mailto:') ? 'noopener noreferrer' : undefined}
                        className="block group"
                      >
                        <p className="text-gold group-hover:text-white transition-colors font-light">{item.text}</p>
                        {item.subtitle && <p className="text-gray-400 text-sm mt-1 font-light">{item.subtitle}</p>}
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto bg-gradient-to-br from-gray-900 to-black border border-gold/20 p-8 sm:p-12">
            <h2 className="text-2xl font-light text-white mb-8">Send us a Message</h2>

            {submitted ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/20 border border-gold rounded-full mb-4">
                  <Send className="text-gold" size={28} />
                </div>
                <p className="text-gold text-lg font-semibold">Message Sent Successfully</p>
                <p className="text-gray-400 mt-2 font-light">We'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gold text-sm mb-2 font-light">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-black border border-gold/30 text-white px-4 py-3 focus:border-gold outline-none transition-colors"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-gold text-sm mb-2 font-light">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-black border border-gold/30 text-white px-4 py-3 focus:border-gold outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gold text-sm mb-2 font-light">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-black border border-gold/30 text-white px-4 py-3 focus:border-gold outline-none transition-colors"
                    placeholder="+234 XXX XXX XXXX"
                  />
                </div>

                <div>
                  <label className="block text-gold text-sm mb-2 font-light">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-black border border-gold/30 text-white px-4 py-3 focus:border-gold outline-none transition-colors"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-gold text-sm mb-2 font-light">Message</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-black border border-gold/30 text-white px-4 py-3 focus:border-gold outline-none transition-colors resize-none h-32"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gold text-black font-semibold py-3 hover:bg-gold/90 transition-all flex items-center justify-center gap-2"
                >
                  Send Message
                  <Send size={18} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Office Info */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-black py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-gold/30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className="flex items-start gap-4 mb-8">
              <MapPin className="text-gold mt-1 flex-shrink-0" size={24} />
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Headquarters</h3>
                <p className="text-gray-400 font-light">Lagos, Nigeria</p>
                <p className="text-gray-400 text-sm mt-2 font-light">
                  Serving luxury markets across West Africa and expanding globally
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Business Hours</h3>
            <div className="space-y-3 text-gray-400 font-light">
              <p>Monday - Friday: 9:00 AM - 6:00 PM WAT</p>
              <p>Saturday: 10:00 AM - 4:00 PM WAT</p>
              <p>Sunday: By appointment only</p>
              <p className="text-sm mt-4 text-gold">Available 24/7 for urgent inquiries via WhatsApp</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
