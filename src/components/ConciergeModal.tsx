import { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConciergeModal({ isOpen, onClose }: ConciergeModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    serviceType: 'personal-shopping',
    message: '',
    anonymous: false,
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('concierge_requests').insert([
        {
          email: formData.email,
          phone: formData.phone,
          service_type: formData.serviceType,
          message: formData.message,
          anonymous: formData.anonymous,
          status: 'pending',
        },
      ]);

      if (error) throw error;

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          email: '',
          phone: '',
          serviceType: 'personal-shopping',
          message: '',
          anonymous: false,
        });
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error submitting concierge request:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-black border border-gold/50 max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gold/30">
          <h2 className="text-2xl font-light text-white">Private Concierge</h2>
          <button
            onClick={onClose}
            className="text-gold hover:text-gold/80 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <p className="text-gold text-lg mb-4">Request Submitted Successfully</p>
            <p className="text-gray-400">Our team will contact you shortly with personalized recommendations.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-gold text-sm mb-2 font-light">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-900 border border-gold/30 text-white px-4 py-2 focus:border-gold outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-gold text-sm mb-2 font-light">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-gray-900 border border-gold/30 text-white px-4 py-2 focus:border-gold outline-none transition-colors"
                placeholder="+234 XXX XXX XXXX"
              />
            </div>

            <div>
              <label className="block text-gold text-sm mb-2 font-light">Service Type</label>
              <select
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                className="w-full bg-gray-900 border border-gold/30 text-white px-4 py-2 focus:border-gold outline-none transition-colors"
              >
                <option>personal-shopping</option>
                <option>property-search</option>
                <option>vehicle-acquisition</option>
                <option>investment-consultation</option>
                <option>other</option>
              </select>
            </div>

            <div>
              <label className="block text-gold text-sm mb-2 font-light">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-gray-900 border border-gold/30 text-white px-4 py-2 focus:border-gold outline-none transition-colors resize-none h-24"
                placeholder="Tell us what you're looking for..."
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.anonymous}
                onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
                className="w-4 h-4 accent-gold"
              />
              <span className="text-gray-400 text-sm">Keep my request anonymous</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-black font-semibold py-2 hover:bg-gold/90 transition-all disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
