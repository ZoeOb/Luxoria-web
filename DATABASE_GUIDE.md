# LUXORIA Backend & Database Guide

## Overview

Luxoria uses Supabase for complete backend infrastructure, including PostgreSQL database, authentication, and cloud storage. This guide covers all backend systems and how to use them.

## Database Schema

### Tables

#### 1. **profiles**
User account information and settings.

```sql
- id (uuid) - Primary key
- user_id (uuid) - References auth.users
- email (text) - User email
- full_name (text) - User's full name
- phone (text) - Contact number
- company_name (text) - Business name if applicable
- profile_image_url (text) - Avatar image URL
- deposit_balance (numeric) - Account balance for auctions
- is_verified (boolean) - Account verification status
- created_at (timestamptz) - Account creation date
- updated_at (timestamptz) - Last update date
```

#### 2. **properties**
Real estate listings.

```sql
- id (uuid) - Primary key
- title (text) - Property name
- description (text) - Full description
- location_city (text) - City name
- location_neighborhood (text) - Neighborhood
- location_state (text) - State/province
- location_country (text) - Country (default: Nigeria)
- price_usd (numeric) - Price in USD
- bedrooms (integer) - Number of bedrooms
- bathrooms (integer) - Number of bathrooms
- square_feet (numeric) - Property size
- property_type (text) - house, apartment, etc.
- listing_type (text) - 'sale', 'lease', or 'short-let'
- main_image_url (text) - Primary image
- images_url (jsonb) - Array of image URLs
- amenities (jsonb) - List of amenities
- is_featured (boolean) - Featured listing flag
- status (text) - active, sold, inactive
- seller_id (uuid) - References profiles
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### 3. **vehicles**
Automotive listings (eBay Motors style).

```sql
- id (uuid) - Primary key
- title (text) - Vehicle name
- description (text) - Full description
- make (text) - Manufacturer (Toyota, BMW, etc.)
- model (text) - Model name
- year (integer) - Year of manufacture
- mileage (integer) - Kilometers/miles driven
- price_usd (numeric) - Price in USD
- condition (text) - new, like-new, excellent, good, fair
- vehicle_type (text) - car, truck, motorcycle, etc.
- color (text) - Vehicle color
- transmission (text) - manual or automatic
- fuel_type (text) - petrol, diesel, electric, hybrid
- main_image_url (text) - Primary image
- images_url (jsonb) - Array of image URLs
- is_featured (boolean) - Featured listing flag
- status (text) - active, sold, inactive
- seller_id (uuid) - References profiles
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### 4. **jewelry**
Fine jewelry and gemstone listings.

```sql
- id (uuid) - Primary key
- title (text) - Jewelry name
- description (text) - Full description
- material (text) - gold, silver, platinum, etc.
- weight_grams (numeric) - Weight in grams
- purity (text) - 18K, 22K, 925, etc.
- gemstone (text) - diamond, ruby, sapphire, etc.
- price_usd (numeric) - Price in USD
- main_image_url (text) - Primary image
- images_url (jsonb) - Array of image URLs
- is_featured (boolean) - Featured listing flag
- status (text) - active, sold, inactive
- seller_id (uuid) - References profiles
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### 5. **investments**
Investment opportunity listings.

```sql
- id (uuid) - Primary key
- title (text) - Investment name
- description (text) - Full description
- investment_type (text) - real_estate, stocks, crypto, etc.
- min_investment_usd (numeric) - Minimum investment amount
- expected_roi_percent (numeric) - Expected return percentage
- duration_months (integer) - Investment duration
- status (text) - active, closed, inactive
- seller_id (uuid) - References profiles
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### 6. **imports_exports**
International trade listings.

```sql
- id (uuid) - Primary key
- title (text) - Product name
- description (text) - Full description
- product_category (text) - Category of goods
- origin_country (text) - Source country
- destination_country (text) - Destination country
- quantity (text) - Amount/quantity
- price_usd (numeric) - Price in USD
- transaction_type (text) - 'import' or 'export'
- status (text) - active, completed, inactive
- seller_id (uuid) - References profiles
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### 7. **auctions**
Auction listings and management.

```sql
- id (uuid) - Primary key
- item_id (uuid) - References properties, vehicles, or jewelry
- item_type (text) - 'property', 'vehicle', or 'jewelry'
- title (text) - Auction title
- starting_price_usd (numeric) - Opening bid
- current_bid_usd (numeric) - Highest bid
- reserve_price_usd (numeric) - Minimum acceptable price
- start_date (timestamptz) - Auction start time
- end_date (timestamptz) - Auction end time
- status (text) - active, completed, cancelled
- seller_id (uuid) - References profiles
- highest_bidder_id (uuid) - References profiles (winner)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### 8. **auction_bids**
Individual bids placed on auctions.

```sql
- id (uuid) - Primary key
- auction_id (uuid) - References auctions
- bidder_id (uuid) - References profiles
- bid_amount_usd (numeric) - Bid amount
- created_at (timestamptz) - Bid timestamp
```

#### 9. **user_deposits**
User deposit accounts for unlocking auction access.

```sql
- id (uuid) - Primary key
- user_id (uuid) - References profiles
- amount_usd (numeric) - Deposit amount
- payment_method (text) - Bank, PayPal, Stripe, Crypto, etc.
- status (text) - pending, completed, failed
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### 10. **concierge_requests**
Private concierge service requests.

```sql
- id (uuid) - Primary key
- user_id (uuid) - References profiles (nullable for anonymous)
- email (text) - Request email
- phone (text) - Contact phone
- service_type (text) - Type of service requested
- message (text) - Request message
- anonymous (boolean) - Anonymous request flag
- status (text) - pending, in_progress, completed
- created_at (timestamptz)
- updated_at (timestamptz)
```

## Row Level Security (RLS)

All tables have RLS enabled with specific policies:

### Properties
- Anyone can read active properties
- Users can create/edit their own
- Only sellers can delete their listings

### Vehicles
- Anyone can read active vehicles
- Users can create/edit their own
- Only sellers can delete their listings

### Jewelry
- Anyone can read active jewelry
- Users can create/edit their own
- Only sellers can delete their listings

### Profiles
- Users can only read their own profile
- Users can only edit their own profile
- Public data visible to all

### Auctions
- Anyone can view active auctions
- Authenticated users can place bids
- Sellers manage their auctions

## Image Storage

Supabase Storage buckets for image uploads:

- **properties-images** - Real estate property photos
- **vehicles-images** - Vehicle photos
- **jewelry-images** - Jewelry item photos

### Upload Process

```typescript
import { uploadImage, uploadMultipleImages } from '@/lib/storage';

// Single image
const url = await uploadImage(file, 'PROPERTIES');

// Multiple images
const urls = await uploadMultipleImages(files, 'VEHICLES');
```

## Services Layer

### Property Service (`src/services/propertyService.ts`)

**Functions:**
- `createProperty()` - Create new property listing
- `getProperties()` - Get all active properties with filters
- `searchProperties()` - Full-text search
- `getFeaturedProperties()` - Get featured listings
- `getPropertyById()` - Get single property
- `updateProperty()` - Update property details
- `deleteProperty()` - Delete listing
- `getUserProperties()` - Get user's listings

**Example:**
```typescript
import { getProperties, searchProperties } from '@/services/propertyService';

// Get filtered properties
const props = await getProperties({
  city: 'Lagos',
  minPrice: 1000000,
  maxPrice: 5000000,
  bedrooms: 3,
  listingType: 'sale'
});

// Search
const results = await searchProperties('luxury estate Lagos');
```

### Vehicle Service (`src/services/vehicleService.ts`)

**Functions:**
- `createVehicle()` - Create vehicle listing
- `getVehicles()` - Get all vehicles with filters
- `searchVehicles()` - Full-text search
- `getFeaturedVehicles()` - Get featured listings
- `getVehicleById()` - Get single vehicle
- `updateVehicle()` - Update vehicle
- `deleteVehicle()` - Delete listing
- `getUserVehicles()` - Get user's vehicles

**Example:**
```typescript
import { searchVehicles, getVehicles } from '@/services/vehicleService';

// Filter vehicles
const vehicles = await getVehicles({
  make: 'Mercedes',
  minYear: 2020,
  maxPrice: 150000,
  condition: 'excellent'
});

// Search
const results = await searchVehicles('2023 BMW M5');
```

### Jewelry Service (`src/services/jewelryService.ts`)

**Functions:**
- `createJewelry()` - Create jewelry listing
- `getJewelry()` - Get all jewelry with filters
- `searchJewelry()` - Full-text search
- `getFeaturedJewelry()` - Get featured items
- `getJewelryById()` - Get single item
- `updateJewelry()` - Update listing
- `deleteJewelry()` - Delete listing
- `getUserJewelry()` - Get user's jewelry

## Search Implementation

### Advanced Search Component

Located in `src/components/AdvancedSearch.tsx`

Features:
- Real-time search with 300ms debouncing
- Cross-category search (properties, vehicles, jewelry)
- Category filtering
- Image preview in results
- Click-through to listings

```typescript
<AdvancedSearch 
  onClose={() => setSearchOpen(false)}
  onResultSelect={(result) => handleNavigation(result)}
/>
```

### Search Filters

Each service supports comprehensive filtering:

**Property Filters:**
- City name
- Neighborhood
- Price range
- Bedroom count
- Listing type (sale, lease, short-let)
- Full-text search

**Vehicle Filters:**
- Make and model
- Year range
- Price range
- Condition
- Fuel type
- Transmission type
- Full-text search

**Jewelry Filters:**
- Material type
- Gemstone type
- Price range
- Full-text search

## Seller Dashboard

Access: `/seller` (authenticated users only)

### Features

1. **Property Listings**
   - View all created properties
   - Edit property details
   - Delete listings
   - Upload multiple images
   - Set listing type (sale, lease, short-let)

2. **Vehicle Listings**
   - View all vehicles
   - Edit vehicle specs
   - Delete listings
   - Upload images
   - Set condition, mileage, specs

3. **Jewelry Listings**
   - View all jewelry items
   - Edit item details
   - Delete listings
   - Upload images
   - Set material, purity, gemstone

4. **Create Listings**
   - Intuitive form interface
   - Image upload with preview
   - Real-time validation
   - Multi-image support

## Authentication

### User Registration

```typescript
const { error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'SecurePassword123',
  options: {
    data: {
      full_name: 'John Doe'
    }
  }
});
```

### Login

```typescript
const { error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});
```

### Google OAuth

```typescript
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/dashboard`
  }
});
```

## Deposit System

Users must have a deposit to participate in auctions:

```typescript
// Create deposit
const { error } = await supabase.from('user_deposits').insert([
  {
    user_id: user.id,
    amount_usd: 5000,
    payment_method: 'stripe',
    status: 'pending'
  }
]);

// View user balance
const profile = await supabase
  .from('profiles')
  .select('deposit_balance')
  .eq('id', user.id)
  .single();
```

## Payment Integration Points

Deposit system supports:
- Nigerian Banks (GTBank, Access, First Bank, Zenith, UBA, Sterling)
- PayPal
- Stripe
- Wise (TransferWise)
- Cryptocurrency (Bitcoin, Ethereum, USDT)
- Wire Transfer

## Performance Optimizations

1. **Indexing**
   - Properties indexed on status, city
   - Vehicles indexed on status, make, model
   - Auctions indexed on end_date, status
   - User foreign keys indexed for quick lookups

2. **Query Optimization**
   - Use `limit()` for pagination
   - Filter before `.select()` when possible
   - Use `maybeSingle()` for single record queries
   - Batch related queries with Promise.all()

3. **Image Optimization**
   - Compress images before upload
   - Use optimized formats (WEBP where possible)
   - Implement lazy loading for galleries
   - Cache public URLs

## Data Security

1. **RLS Policies**
   - All sensitive data requires authentication
   - Users can only access their own data
   - Public listings visible to anonymous users
   - Strict foreign key enforcement

2. **Storage Security**
   - Public read, authenticated write
   - File path includes user ID for isolation
   - Automatic cleanup for deleted listings

3. **Validation**
   - Client-side validation before upload
   - Server-side validation in database
   - Type checking with TypeScript

## API Response Examples

### Get Properties
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Luxury Villa in Ikoyi",
  "description": "Modern 5-bedroom villa...",
  "location_city": "Lagos",
  "price_usd": 2500000,
  "bedrooms": 5,
  "bathrooms": 4,
  "main_image_url": "https://...",
  "status": "active",
  "is_featured": true
}
```

### Get Vehicles
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "2023 Mercedes-Benz S-Class",
  "make": "Mercedes-Benz",
  "model": "S-Class",
  "year": 2023,
  "price_usd": 150000,
  "condition": "new",
  "mileage": 0,
  "main_image_url": "https://..."
}
```

## Troubleshooting

### Common Issues

1. **Image Upload Fails**
   - Check bucket permissions
   - Verify file size < 100MB
   - Ensure file is valid image

2. **Search Returns No Results**
   - Check spelling in filter values
   - Ensure listings are 'active' status
   - Try broader search terms

3. **RLS Policy Errors**
   - Verify user is authenticated
   - Check user_id matches selector
   - Ensure row-level policy exists

4. **Slow Queries**
   - Check if indexes are created
   - Avoid filtering on text fields
   - Use `.limit()` for large result sets

## Best Practices

1. Always use `maybeSingle()` for optional single records
2. Handle errors gracefully in service calls
3. Debounce search inputs (300ms minimum)
4. Validate inputs before database operations
5. Use transactions for multi-step operations
6. Clean up images when deleting listings
7. Implement pagination for large result sets
8. Cache frequently accessed data client-side
