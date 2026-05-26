import { useState, useEffect } from 'react';
import { Heart, Gauge, Zap, Palette, ChevronRight, Search, SlidersHorizontal } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Vehicle {
  id: string;
  title: string;
  description: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  price_usd: number;
  condition: string;
  color: string;
  transmission: string;
  fuel_type: string;
  main_image_url: string;
  is_featured: boolean;
}

export default function Autos() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    condition: 'all',
    priceRange: 'all',
    year: 'all',
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [vehicles, searchQuery, filters]);

  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('status', 'active')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVehicles(data || []);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...vehicles];

    if (searchQuery) {
      filtered = filtered.filter((v) =>
        `${v.make} ${v.model}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.condition !== 'all') {
      filtered = filtered.filter((v) => v.condition === filters.condition);
    }

    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange === 'under50k' ? [0, 50000] :
                         filters.priceRange === '50k-100k' ? [50000, 100000] :
                         filters.priceRange === '100k-300k' ? [100000, 300000] : [300000, Infinity];
      filtered = filtered.filter((v) => v.price_usd >= min && v.price_usd <= max);
    }

    if (filters.year !== 'all') {
      const currentYear = new Date().getFullYear();
      const minYear = filters.year === 'recent' ? currentYear - 3 :
                      filters.year === 'mid' ? currentYear - 7 : 1990;
      filtered = filtered.filter((v) => v.year >= minYear);
    }

    setFilteredVehicles(filtered);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-900 to-black py-16 px-4 sm:px-6 lg:px-8 border-b border-gold/30">
        <div className="max-w-6xl mx-auto">
          <p className="text-gold text-sm tracking-[0.2em] mb-4 font-light">ELITE AUTOMOTIVE</p>
          <h1 className="text-4xl sm:text-5xl font-light text-white mb-8">
            LUXORIA
            <br />
            <span className="text-gold">AUTOS</span>
          </h1>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-4 text-gold/50" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by make or model..."
                className="w-full bg-gray-900 border border-gold/30 text-white px-4 py-3 pl-12 focus:border-gold outline-none transition-colors"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 border border-gold/30 text-gold hover:border-gold transition-colors"
            >
              <SlidersHorizontal size={20} />
              Filters
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-gold text-sm mb-2 font-light">Condition</label>
                <select
                  value={filters.condition}
                  onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                  className="w-full bg-gray-900 border border-gold/30 text-white px-3 py-2 focus:border-gold outline-none transition-colors text-sm"
                >
                  <option value="all">All Conditions</option>
                  <option value="new">New</option>
                  <option value="like-new">Like New</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>

              <div>
                <label className="block text-gold text-sm mb-2 font-light">Price Range</label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                  className="w-full bg-gray-900 border border-gold/30 text-white px-3 py-2 focus:border-gold outline-none transition-colors text-sm"
                >
                  <option value="all">All Prices</option>
                  <option value="under50k">Under $50K</option>
                  <option value="50k-100k">$50K - $100K</option>
                  <option value="100k-300k">$100K - $300K</option>
                  <option value="above300k">Above $300K</option>
                </select>
              </div>

              <div>
                <label className="block text-gold text-sm mb-2 font-light">Year</label>
                <select
                  value={filters.year}
                  onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                  className="w-full bg-gray-900 border border-gold/30 text-white px-3 py-2 focus:border-gold outline-none transition-colors text-sm"
                >
                  <option value="all">Any Year</option>
                  <option value="recent">Last 3 Years</option>
                  <option value="mid">Last 7 Years</option>
                  <option value="older">7+ Years Old</option>
                </select>
              </div>
            </div>
          )}

          <p className="text-gray-400 text-sm mt-6 font-light">
            {filteredVehicles.length} {filteredVehicles.length === 1 ? 'vehicle' : 'vehicles'} found
          </p>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block h-10 w-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No vehicles match your criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="group bg-gradient-to-br from-gray-900 to-black border border-gold/20 overflow-hidden hover:border-gold transition-all duration-300"
                >
                  <div className="relative overflow-hidden h-56">
                    {vehicle.main_image_url && (
                      <img
                        src={vehicle.main_image_url}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                    {vehicle.is_featured && (
                      <div className="absolute top-4 left-4 bg-gold text-black px-3 py-1 font-semibold text-sm">
                        FEATURED
                      </div>
                    )}
                    <button className="absolute top-4 right-4 bg-black/60 hover:bg-gold hover:text-black p-2 transition-all">
                      <Heart size={20} />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="mb-3">
                      <h3 className="text-xl font-semibold text-white group-hover:text-gold transition-colors">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </h3>
                      <p className="text-gold text-sm mt-1 font-light">{vehicle.condition.replace('-', ' ').toUpperCase()} CONDITION</p>
                    </div>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{vehicle.description}</p>

                    <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gold/20">
                      <div className="flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-gold" />
                        <div>
                          <p className="text-white font-semibold text-sm">{(vehicle.mileage / 1000).toFixed(0)}k</p>
                          <p className="text-gray-400 text-xs">Miles</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-gold" />
                        <div>
                          <p className="text-white font-semibold text-sm">{vehicle.fuel_type}</p>
                          <p className="text-gray-400 text-xs">Fuel</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 col-span-2">
                        <Palette className="w-4 h-4 text-gold" />
                        <div>
                          <p className="text-white font-semibold text-sm">{vehicle.color}</p>
                          <p className="text-gray-400 text-xs">{vehicle.transmission}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-gold text-2xl font-semibold">
                        ${(vehicle.price_usd / 1000).toFixed(0)}K
                      </p>
                      <button className="text-gold hover:text-white transition-colors flex items-center gap-2">
                        View <ChevronRight size={18} />
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
