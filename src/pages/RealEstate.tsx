import { useState, useEffect } from 'react';
import { Heart, MapPin, Bed, Bath, Home, ChevronRight, Search, SlidersHorizontal } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Property {
  id: string;
  title: string;
  description: string;
  price_usd: number;
  location_city: string;
  location_state: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  property_type: string;
  listing_type: string;
  main_image_url: string;
  is_featured: boolean;
}

export default function RealEstate() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    listingType: 'all',
    priceRange: 'all',
    bedrooms: 'all',
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [properties, searchQuery, filters]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'active')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (err) {
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...properties];

    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location_city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.listingType !== 'all') {
      filtered = filtered.filter((p) => p.listing_type === filters.listingType);
    }

    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange === 'under500k' ? [0, 500000] :
                         filters.priceRange === '500k-1m' ? [500000, 1000000] :
                         filters.priceRange === '1m-5m' ? [1000000, 5000000] : [5000000, Infinity];
      filtered = filtered.filter((p) => p.price_usd >= min && p.price_usd <= max);
    }

    if (filters.bedrooms !== 'all') {
      filtered = filtered.filter((p) => p.bedrooms === parseInt(filters.bedrooms));
    }

    setFilteredProperties(filtered);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-900 to-black py-16 px-4 sm:px-6 lg:px-8 border-b border-gold/30">
        <div className="max-w-6xl mx-auto">
          <p className="text-gold text-sm tracking-[0.2em] mb-4 font-light">PREMIUM PROPERTIES</p>
          <h1 className="text-4xl sm:text-5xl font-light text-white mb-8">
            LUXORIA
            <br />
            <span className="text-gold">ESTATES</span>
          </h1>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-4 text-gold/50" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by city or neighborhood..."
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
                <label className="block text-gold text-sm mb-2 font-light">Listing Type</label>
                <select
                  value={filters.listingType}
                  onChange={(e) => setFilters({ ...filters, listingType: e.target.value })}
                  className="w-full bg-gray-900 border border-gold/30 text-white px-3 py-2 focus:border-gold outline-none transition-colors text-sm"
                >
                  <option value="all">All Properties</option>
                  <option value="sale">For Sale</option>
                  <option value="lease">For Lease</option>
                  <option value="short-let">Short Let</option>
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
                  <option value="under500k">Under $500K</option>
                  <option value="500k-1m">$500K - $1M</option>
                  <option value="1m-5m">$1M - $5M</option>
                  <option value="above5m">Above $5M</option>
                </select>
              </div>

              <div>
                <label className="block text-gold text-sm mb-2 font-light">Bedrooms</label>
                <select
                  value={filters.bedrooms}
                  onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
                  className="w-full bg-gray-900 border border-gold/30 text-white px-3 py-2 focus:border-gold outline-none transition-colors text-sm"
                >
                  <option value="all">All Bedrooms</option>
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4">4+ Bedrooms</option>
                </select>
              </div>
            </div>
          )}

          <p className="text-gray-400 text-sm mt-6 font-light">
            {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
          </p>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block h-10 w-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No properties match your criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
                <div
                  key={property.id}
                  className="group bg-gradient-to-br from-gray-900 to-black border border-gold/20 overflow-hidden hover:border-gold transition-all duration-300"
                >
                  <div className="relative overflow-hidden h-56">
                    {property.main_image_url && (
                      <img
                        src={property.main_image_url}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                    {property.is_featured && (
                      <div className="absolute top-4 left-4 bg-gold text-black px-3 py-1 font-semibold text-sm">
                        PREMIER
                      </div>
                    )}
                    <button className="absolute top-4 right-4 bg-black/60 hover:bg-gold hover:text-black p-2 transition-all">
                      <Heart size={20} />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-white group-hover:text-gold transition-colors">
                          {property.title}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
                          <MapPin size={16} />
                          {property.location_city}, {property.location_state}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{property.description}</p>

                    <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-gold/20">
                      <div className="text-center">
                        <Bed className="w-5 h-5 text-gold mx-auto mb-1" />
                        <p className="text-white font-semibold">{property.bedrooms}</p>
                        <p className="text-gray-400 text-xs">Beds</p>
                      </div>
                      <div className="text-center">
                        <Bath className="w-5 h-5 text-gold mx-auto mb-1" />
                        <p className="text-white font-semibold">{property.bathrooms}</p>
                        <p className="text-gray-400 text-xs">Baths</p>
                      </div>
                      <div className="text-center">
                        <Home className="w-5 h-5 text-gold mx-auto mb-1" />
                        <p className="text-white font-semibold">{property.square_feet?.toLocaleString()}</p>
                        <p className="text-gray-400 text-xs">Sq Ft</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gold text-2xl font-semibold">
                          ${(property.price_usd / 1000000).toFixed(1)}M
                        </p>
                        <p className="text-gray-400 text-xs mt-1">{property.listing_type.replace('-', ' ').toUpperCase()}</p>
                      </div>
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
