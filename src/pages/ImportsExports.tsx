import { useState, useEffect } from 'react';
import { Globe, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Trade {
  id: string;
  title: string;
  description: string;
  product_category: string;
  origin_country: string;
  destination_country: string;
  quantity: string;
  price_usd: number;
  transaction_type: string;
  status: string;
  created_at: string;
}

export default function ImportsExports() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'import' | 'export'>('all');

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    try {
      const { data, error } = await supabase
        .from('imports_exports')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrades(data || []);
    } catch (err) {
      console.error('Error fetching trades:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrades = filter === 'all' ? trades :
    trades.filter(t => t.transaction_type === filter);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-900 to-black py-16 px-4 sm:px-6 lg:px-8 border-b border-gold/30">
        <div className="max-w-6xl mx-auto">
          <p className="text-gold text-sm tracking-[0.2em] mb-4 font-light">GLOBAL COMMERCE</p>
          <h1 className="text-4xl sm:text-5xl font-light text-white mb-8">
            IMPORTS &
            <br />
            <span className="text-gold">EXPORTS</span>
          </h1>
          <p className="text-gray-400 text-lg font-light max-w-2xl">
            Premium goods sourced and distributed globally with exclusive partnerships.
          </p>

          {/* Filter Buttons */}
          <div className="flex gap-3 mt-8">
            {[
              { label: 'All Trades', value: 'all' as const },
              { label: 'Imports', value: 'import' as const },
              { label: 'Exports', value: 'export' as const },
            ].map((btn) => (
              <button
                key={btn.value}
                onClick={() => setFilter(btn.value)}
                className={`px-6 py-2 text-sm font-light transition-all ${
                  filter === btn.value
                    ? 'bg-gold text-black'
                    : 'border border-gold/50 text-gold hover:border-gold'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trades Grid */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block h-10 w-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredTrades.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No trades available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredTrades.map((trade) => (
                <div
                  key={trade.id}
                  className="group bg-gradient-to-br from-gray-900 to-black border border-gold/20 hover:border-gold p-8 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-semibold text-white group-hover:text-gold transition-colors">
                        {trade.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-3">
                        <span className={`px-3 py-1 text-xs font-semibold ${
                          trade.transaction_type === 'import'
                            ? 'bg-blue-900/30 text-blue-300'
                            : 'bg-green-900/30 text-green-300'
                        }`}>
                          {trade.transaction_type.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <Globe className="text-gold opacity-50 group-hover:opacity-100 transition-opacity" size={28} />
                  </div>

                  <p className="text-gray-400 mb-6 leading-relaxed">{trade.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gold/20">
                    <div>
                      <p className="text-gold text-sm font-light mb-2">From</p>
                      <p className="text-white font-semibold">{trade.origin_country}</p>
                    </div>
                    <div>
                      <p className="text-gold text-sm font-light mb-2">To</p>
                      <p className="text-white font-semibold">{trade.destination_country}</p>
                    </div>
                    <div>
                      <p className="text-gold text-sm font-light mb-2">Category</p>
                      <p className="text-white font-semibold">{trade.product_category}</p>
                    </div>
                    <div>
                      <p className="text-gold text-sm font-light mb-2">Quantity</p>
                      <p className="text-white font-semibold">{trade.quantity}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-gold text-2xl font-semibold">
                      ${(trade.price_usd / 1000).toFixed(0)}K
                    </p>
                    <button className="flex items-center gap-2 text-gold hover:text-white transition-colors group/btn">
                      Inquire <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
