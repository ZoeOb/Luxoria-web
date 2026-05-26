import { useState, useEffect } from 'react';
import { Heart, Sparkles, ChevronRight, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface JewelryItem {
  id: string;
  title: string;
  description: string;
  material: string;
  weight_grams: number;
  purity: string;
  gemstone: string;
  price_usd: number;
  main_image_url: string;
  is_featured: boolean;
}

export default function Jewelry() {
  const [items, setItems] = useState<JewelryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<JewelryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchJewelry();
  }, []);

  useEffect(() => {
    const filtered = items.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.material.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [items, searchQuery]);

  const fetchJewelry = async () => {
    try {
      const { data, error } = await supabase
        .from('jewelry')
        .select('*')
        .eq('status', 'active')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error('Error fetching jewelry:', err);
    } finally {
      setLoading(false);
    }
  };

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

          {/* Search Bar */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-4 text-gold/50" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jewelry by name or material..."
              className="w-full bg-gray-900 border border-gold/30 text-white px-4 py-3 pl-12 focus:border-gold outline-none transition-colors"
            />
          </div>

          <p className="text-gray-400 text-sm mt-6 font-light">
            {filteredItems.length} {filteredItems.length === 1 ? 'piece' : 'pieces'} available
          </p>
        </div>
      </div>

      {/* Jewelry Grid */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block h-10 w-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No jewelry matches your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group bg-gradient-to-br from-gray-900 to-black border border-gold/20 overflow-hidden hover:border-gold transition-all duration-300"
                >
                  <div className="relative overflow-hidden h-64">
                    {item.main_image_url && (
                      <img
                        src={item.main_image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                    {item.is_featured && (
                      <div className="absolute top-3 left-3 bg-gold text-black px-2 py-1 font-semibold text-xs flex items-center gap-1">
                        <Sparkles size={14} />
                        FEATURED
                      </div>
                    )}
                    <button className="absolute top-3 right-3 bg-black/60 hover:bg-gold hover:text-black p-2 transition-all">
                      <Heart size={18} />
                    </button>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-white group-hover:text-gold transition-colors mb-2">
                      {item.title}
                    </h3>

                    <div className="space-y-1 mb-4 text-sm">
                      <p className="text-gold font-light">{item.material}</p>
                      {item.purity && <p className="text-gray-400">Purity: {item.purity}</p>}
                      {item.gemstone && <p className="text-gray-400">Stone: {item.gemstone}</p>}
                      {item.weight_grams && <p className="text-gray-400">Weight: {item.weight_grams}g</p>}
                    </div>

                    <p className="text-gray-400 text-xs mb-4 line-clamp-2">{item.description}</p>

                    <div className="flex items-center justify-between pt-3 border-t border-gold/20">
                      <p className="text-gold text-xl font-semibold">
                        ${(item.price_usd / 1000).toFixed(1)}K
                      </p>
                      <button className="text-gold hover:text-white transition-colors">
                        <ChevronRight size={18} />
                      </button>
                    </div>
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
