import { useState, useEffect, useCallback } from 'react';
import { Search, X, Loader } from 'lucide-react';
import { searchProperties } from '../services/propertyService';
import { searchVehicles } from '../services/vehicleService';
import { searchJewelry } from '../services/jewelryService';

interface SearchResult {
  id: string;
  title: string;
  type: 'property' | 'vehicle' | 'jewelry';
  price: number;
  image?: string;
  location?: string;
}

interface AdvancedSearchProps {
  onClose?: () => void;
  onResultSelect?: (result: SearchResult) => void;
}

export default function AdvancedSearch({ onClose, onResultSelect }: AdvancedSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'properties' | 'vehicles' | 'jewelry'>('all');

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const allResults: SearchResult[] = [];

    try {
      if (selectedCategory === 'all' || selectedCategory === 'properties') {
        const properties = await searchProperties(query);
        allResults.push(
          ...properties.map((p) => ({
            id: p.id,
            title: p.title,
            type: 'property' as const,
            price: p.price_usd,
            image: p.main_image_url,
            location: `${p.location_city}, ${p.location_state}`,
          }))
        );
      }

      if (selectedCategory === 'all' || selectedCategory === 'vehicles') {
        const vehicles = await searchVehicles(query);
        allResults.push(
          ...vehicles.map((v) => ({
            id: v.id,
            title: `${v.year} ${v.make} ${v.model}`,
            type: 'vehicle' as const,
            price: v.price_usd,
            image: v.main_image_url,
          }))
        );
      }

      if (selectedCategory === 'all' || selectedCategory === 'jewelry') {
        const jewelry = await searchJewelry(query);
        allResults.push(
          ...jewelry.map((j) => ({
            id: j.id,
            title: j.title,
            type: 'jewelry' as const,
            price: j.price_usd,
            image: j.main_image_url,
          }))
        );
      }

      setResults(allResults.slice(0, 12));
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, performSearch]);

  return (
    <div className="w-full bg-black border border-gold/30 p-6 rounded-lg">
      <div className="relative mb-6">
        <Search className="absolute left-4 top-4 text-gold/50" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search properties, autos, jewelry..."
          className="w-full bg-gray-900 border border-gold/30 text-white px-4 py-3 pl-12 pr-10 focus:border-gold outline-none transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-4 text-gold/50 hover:text-gold transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { id: 'all', label: 'All' },
          { id: 'properties', label: 'Properties' },
          { id: 'vehicles', label: 'Vehicles' },
          { id: 'jewelry', label: 'Jewelry' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as any)}
            className={`px-4 py-2 text-sm font-light transition-all ${
              selectedCategory === cat.id
                ? 'bg-gold text-black'
                : 'bg-gray-900 border border-gold/30 text-gold hover:border-gold'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader className="animate-spin text-gold" size={24} />
        </div>
      )}

      {!loading && searchQuery && results.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400 font-light">No results found for "{searchQuery}"</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          {results.map((result) => (
            <button
              key={`${result.type}-${result.id}`}
              onClick={() => {
                onResultSelect?.(result);
                onClose?.();
              }}
              className="group bg-gray-900 border border-gold/20 hover:border-gold p-4 text-left transition-all"
            >
              {result.image && (
                <div className="w-full h-32 bg-black mb-3 overflow-hidden rounded">
                  <img
                    src={result.image}
                    alt={result.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </div>
              )}

              <h4 className="font-semibold text-white group-hover:text-gold transition-colors text-sm truncate">
                {result.title}
              </h4>

              {result.location && <p className="text-gray-400 text-xs mt-1">{result.location}</p>}

              <div className="flex items-center justify-between mt-3">
                <span className="text-gold text-sm font-semibold">${(result.price / 1000).toFixed(0)}K</span>
                <span className="text-gray-400 text-xs uppercase font-light">{result.type}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {!searchQuery && (
        <div className="text-center py-12">
          <p className="text-gray-400 font-light">Enter a search term to find properties, autos, or jewelry</p>
        </div>
      )}
    </div>
  );
}
