# Luxoria Advanced Search System Guide

## Overview

Luxoria features a powerful, cross-platform search system that enables users to find properties, vehicles, and jewelry across all divisions with real-time results and intelligent filtering.

## Search Architecture

### Components

1. **AdvancedSearch Component** (`/src/components/AdvancedSearch.tsx`)
   - Universal search interface
   - Real-time search with debouncing
   - Category filtering
   - Result preview with images
   - Quick navigation

2. **Service Layer** (See Database Guide)
   - Property Service
   - Vehicle Service
   - Jewelry Service

3. **Database Queries**
   - PostgreSQL full-text search
   - ILIKE queries for partial matching
   - Indexed columns for performance

## How Search Works

### 1. User Input

User enters search term in the search bar:
```
"luxury villa Lagos"
```

### 2. Debounced Query

300ms debounce prevents excessive API calls:
```typescript
const timer = setTimeout(() => {
  performSearch(searchQuery);
}, 300);
```

### 3. Parallel Search Across Categories

Three database queries run simultaneously:

```typescript
// Property Search
const properties = await searchProperties(query);

// Vehicle Search
const vehicles = await searchVehicles(query);

// Jewelry Search
const jewelry = await searchJewelry(query);
```

### 4. Result Aggregation

Results from all categories are combined and limited to 12 results:

```typescript
const allResults = [
  ...properties.map(p => ({
    id: p.id,
    title: p.title,
    type: 'property',
    price: p.price_usd,
    image: p.main_image_url
  })),
  ...vehicles.map(v => ({...})),
  ...jewelry.map(j => ({...}))
].slice(0, 12);
```

### 5. Display Results

Results shown with:
- Thumbnail image
- Title
- Price
- Category badge
- Click-through capability

## Search Features

### Full-Text Search Across

**Properties:**
- Title
- Description
- Location city
- Location neighborhood
- Location state

**Vehicles:**
- Title
- Make
- Model
- Description

**Jewelry:**
- Title
- Material
- Gemstone
- Description

### Advanced Filtering

#### Property Filters

```typescript
{
  city?: string;              // Exact city match
  neighborhood?: string;      // Neighborhood search
  minPrice?: number;          // Minimum price
  maxPrice?: number;          // Maximum price
  bedrooms?: number;          // Exact bedroom count
  listingType?: 'sale' | 'lease' | 'short-let';
  search?: string;            // Full-text search
}
```

**Example:**
```typescript
const properties = await getProperties({
  city: 'Lagos',
  minPrice: 500000,
  maxPrice: 2000000,
  bedrooms: 3,
  listingType: 'sale'
});
```

#### Vehicle Filters

```typescript
{
  make?: string;              // Brand name
  model?: string;             // Model name
  minYear?: number;           // Year range
  maxYear?: number;
  minPrice?: number;          // Price range
  maxPrice?: number;
  condition?: string;         // new, excellent, good, etc.
  fuelType?: string;          // petrol, diesel, hybrid
  transmission?: string;      // manual, automatic
  search?: string;            // Full-text search
}
```

**Example:**
```typescript
const vehicles = await getVehicles({
  make: 'Mercedes',
  minYear: 2020,
  condition: 'excellent',
  minPrice: 100000,
  maxPrice: 250000
});
```

#### Jewelry Filters

```typescript
{
  material?: string;          // gold, silver, platinum
  gemstone?: string;          // diamond, ruby, etc.
  minPrice?: number;          // Price range
  maxPrice?: number;
  search?: string;            // Full-text search
}
```

**Example:**
```typescript
const jewelry = await getJewelry({
  material: 'gold',
  gemstone: 'diamond',
  minPrice: 5000,
  maxPrice: 50000
});
```

## Search Query Examples

### Real Estate Searches

```typescript
// Luxury properties in Lagos
await searchProperties('luxury villa Lagos');

// Leasehold apartments
await getProperties({
  city: 'Abuja',
  listingType: 'lease',
  minPrice: 100000,
  maxPrice: 500000
});

// High-end estates
await getProperties({
  neighborhood: 'Ikoyi',
  bedrooms: 4,
  minPrice: 1000000
});
```

### Vehicle Searches

```typescript
// Recent premium cars
await searchVehicles('2023 Mercedes BMW luxury');

// Specific models
await getVehicles({
  make: 'Toyota',
  model: 'Land Cruiser',
  minYear: 2020
});

// Affordable options
await getVehicles({
  maxPrice: 50000,
  condition: 'good'
});
```

### Jewelry Searches

```typescript
// Specific materials
await searchJewelry('gold diamond ring');

// Price range
await getJewelry({
  material: 'platinum',
  minPrice: 20000,
  maxPrice: 100000
});

// Specific gemstones
await getJewelry({
  gemstone: 'sapphire'
});
```

## Implementation in UI

### Property Page Search

```tsx
const [searchQuery, setSearchQuery] = useState('');
const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);

const handleSearch = async (query: string) => {
  const results = await searchProperties(query);
  setFilteredProperties(results);
};

return (
  <input
    type="text"
    value={searchQuery}
    onChange={(e) => handleSearch(e.target.value)}
    placeholder="Search by city or neighborhood..."
  />
);
```

### Advanced Filters

```tsx
const [filters, setFilters] = useState({
  listingType: 'all',
  priceRange: 'all',
  bedrooms: 'all'
});

const applyFilters = () => {
  const filtered = getProperties({
    listingType: filters.listingType !== 'all' ? filters.listingType : undefined,
    minPrice: parseRange(filters.priceRange).min,
    maxPrice: parseRange(filters.priceRange).max,
    bedrooms: filters.bedrooms !== 'all' ? parseInt(filters.bedrooms) : undefined
  });
};
```

### Search Component Usage

```tsx
import AdvancedSearch from '@/components/AdvancedSearch';

export default function SearchPage() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <AdvancedSearch
        onClose={() => setSearchOpen(false)}
        onResultSelect={(result) => {
          // Navigate to selected listing
          navigateTo(result.type, result.id);
        }}
      />
    </>
  );
}
```

## Database Query Optimization

### Indexes

The following indexes are created for performance:

```sql
-- Property indexes
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_listing_type ON properties(listing_type);

-- Vehicle indexes
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_make_model ON vehicles(make, model);

-- Jewelry indexes
CREATE INDEX idx_jewelry_status ON jewelry(status);
```

### Query Patterns

**Exact Match (Fast):**
```typescript
.eq('status', 'active')  // Uses index
```

**Range Query (Fast):**
```typescript
.gte('price_usd', minPrice)  // Can use index
.lte('price_usd', maxPrice)
```

**Text Search (Slower):**
```typescript
.ilike('location_city', `%${query}%`)  // Full table scan
```

### Performance Tips

1. **Filter on indexed columns first:**
   ```typescript
   query = query.eq('status', 'active');  // Fast
   query = query.ilike('title', `%${search}%`);  // Slower
   ```

2. **Use exact matches when possible:**
   ```typescript
   .eq('bedrooms', 3)  // Faster than range
   ```

3. **Limit results early:**
   ```typescript
   .limit(50)  // Get 50 results instead of all
   ```

4. **Avoid multiple text searches:**
   ```typescript
   // Instead of three separate OR conditions
   // Combine into one OR clause
   ```

## Search Analytics

Track search behavior:

```typescript
// Log search queries
async function logSearch(query: string, category: string, resultCount: number) {
  await supabase.from('search_logs').insert([
    {
      query,
      category,
      result_count: resultCount,
      timestamp: new Date()
    }
  ]);
}
```

## Common Search Patterns

### Featured Results

Get most relevant listings:

```typescript
// Properties
const featured = await getFeaturedProperties();

// Vehicles
const featured = await getFeaturedVehicles();

// Jewelry
const featured = await getFeaturedJewelry();
```

### Pagination

For large result sets:

```typescript
const resultsPerPage = 20;
const page = 1;

const { data, count } = await supabase
  .from('properties')
  .select('*', { count: 'exact' })
  .eq('status', 'active')
  .range((page - 1) * resultsPerPage, page * resultsPerPage);
```

### Sorting

```typescript
// Newest first
.order('created_at', { ascending: false })

// Price ascending
.order('price_usd', { ascending: true })

// Featured first, then newest
.order('is_featured', { ascending: false })
.order('created_at', { ascending: false })
```

## Mobile Search Optimization

1. **Smaller Search Results**
   ```typescript
   const results = await searchProperties(query)
     .limit(6);  // Fewer results on mobile
   ```

2. **Touch-Friendly UI**
   - Large tap targets
   - Simplified filters
   - Quick category selection

3. **Responsive Design**
   - Full-width search on mobile
   - Stacked filter buttons
   - Optimized image sizes

## Search Best Practices

1. **Debounce User Input**
   ```typescript
   // 300ms minimum delay
   const debounce = useCallback(fn => {
     const timer = setTimeout(fn, 300);
     return () => clearTimeout(timer);
   }, []);
   ```

2. **Handle Empty Results**
   ```typescript
   if (results.length === 0) {
     // Show helpful message
     // Suggest alternative searches
     // Show featured items
   }
   ```

3. **Cache Recent Searches**
   ```typescript
   const recentSearches = localStorage.getItem('searches');
   ```

4. **Show Loading State**
   ```typescript
   if (loading) {
     return <Spinner />;
   }
   ```

5. **Error Handling**
   ```typescript
   try {
     const results = await searchProperties(query);
   } catch (error) {
     console.error('Search failed:', error);
     // Show error message to user
   }
   ```

## Advanced Features

### Typo Tolerance

For future enhancement - implement fuzzy matching:

```typescript
// Would match 'merceeds' to 'mercedes'
await fuzzySearch('merceeds', 'vehicles');
```

### Search Suggestions

Auto-complete suggestions:

```typescript
async function getSearchSuggestions(query: string) {
  // Return common searches and popular items
}
```

### Search Filters UI

Dynamic filter generation based on available data:

```typescript
// Build filters from database statistics
const prices = await getPriceRange('properties');
const cities = await getCities('properties');
```

### Saved Searches

Allow users to save search criteria:

```typescript
// Save search
await supabase.from('saved_searches').insert([
  {
    user_id: user.id,
    search_name: 'My Luxury Homes',
    criteria: { city: 'Lagos', bedrooms: 3, minPrice: 1000000 }
  }
]);
```

## Troubleshooting Search Issues

### No Results Returned
1. Check spelling of search terms
2. Verify listings have 'active' status
3. Try broader search terms
4. Check date filters aren't too restrictive

### Slow Search Performance
1. Check database indexes are created
2. Review query count in logs
3. Add LIMIT clause to reduce data
4. Consider caching popular searches

### Unexpected Results
1. Verify filter values are correct
2. Check data consistency in database
3. Test with simple search first
4. Review RLS policies

## Future Enhancements

1. **Elasticsearch Integration** - For ultra-fast full-text search
2. **Map-Based Search** - Geographic proximity search
3. **AI Recommendations** - ML-based search suggestions
4. **Voice Search** - Search by voice input
5. **Visual Search** - Search by image
6. **Saved Searches** - User search history
7. **Search Analytics** - Popular searches dashboard
8. **Advanced Filters** - More granular filtering options
