import { useState, useEffect } from 'react';
import { TrendingUp, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Investment {
  id: string;
  title: string;
  description: string;
  investment_type: string;
  min_investment_usd: number;
  expected_roi_percent: number;
  duration_months: number;
  status: string;
  created_at: string;
}

export default function Investments() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvestments(data || []);
    } catch (err) {
      console.error('Error fetching investments:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-900 to-black py-16 px-4 sm:px-6 lg:px-8 border-b border-gold/30">
        <div className="max-w-6xl mx-auto">
          <p className="text-gold text-sm tracking-[0.2em] mb-4 font-light">WEALTH GROWTH</p>
          <h1 className="text-4xl sm:text-5xl font-light text-white mb-8">
            INVESTMENT
            <br />
            <span className="text-gold">OPPORTUNITIES</span>
          </h1>
          <p className="text-gray-400 text-lg font-light max-w-2xl">
            Explore high-return investment opportunities carefully curated for discerning investors.
          </p>
        </div>
      </div>

      {/* Investments */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block h-10 w-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : investments.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No active investments available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {investments.map((inv) => (
                <div
                  key={inv.id}
                  className="group bg-gradient-to-br from-gray-900 to-black border border-gold/20 hover:border-gold p-8 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-semibold text-white group-hover:text-gold transition-colors">
                        {inv.title}
                      </h3>
                      <p className="text-gold text-sm mt-2 font-light">{inv.investment_type.replace('_', ' ').toUpperCase()}</p>
                    </div>
                    <TrendingUp className="text-gold opacity-50 group-hover:opacity-100 transition-opacity" size={28} />
                  </div>

                  <p className="text-gray-400 mb-6 leading-relaxed">{inv.description}</p>

                  <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gold/20">
                    <div>
                      <p className="text-gold text-sm font-light mb-2">Min Investment</p>
                      <p className="text-white font-semibold">${(inv.min_investment_usd / 1000).toFixed(0)}K</p>
                    </div>
                    <div>
                      <p className="text-gold text-sm font-light mb-2">Expected ROI</p>
                      <p className="text-white font-semibold">{inv.expected_roi_percent}%</p>
                    </div>
                    <div>
                      <p className="text-gold text-sm font-light mb-2">Duration</p>
                      <p className="text-white font-semibold">{inv.duration_months} months</p>
                    </div>
                  </div>

                  <button className="flex items-center gap-2 text-gold hover:text-white transition-colors group/btn">
                    Learn More <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
