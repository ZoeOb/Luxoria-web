# LUXORIA - Premium Luxury Commerce Platform

A full-stack, production-ready luxury commerce platform featuring real estate, automotive, jewelry, investments, and international trade. Built with React, TypeScript, Tailwind CSS, and Supabase.

## Overview

LUXORIA Group is a prestigious collection of enterprises dedicated to the art of luxury living, exclusive real estate, and elite automotive engineering. This platform provides:

- **Real Estate Division**: Premium property listings with advanced search and filters
- **Automotive Division**: eBay Motors-style vehicle marketplace with auctions
- **Jewelry Division**: Fine jewelry and gemstone showcase with pricing
- **Investment Division**: High-return investment opportunities
- **Trade Division**: Import/export of premium goods globally
- **User Ecosystem**: Authentication, profiles, deposits, and auction system

## Features

### For Buyers
- Advanced search across all divisions
- Real-time filtering by price, location, specs
- User dashboard with saved items and transaction history
- Deposit system to unlock auctions
- Private concierge service requests
- Multi-payment method support

### For Sellers
- Full seller dashboard with listing management
- Multi-image upload with cloud storage
- Property, vehicle, and jewelry listing creation
- Edit and delete capabilities
- View analytics on listings
- Manage auctions and bids

### For Platform
- Secure user authentication (Email, Google OAuth)
- Row-level security on all data
- Full-text search across all divisions
- Real-time bidding system
- Transaction tracking
- Responsive design (mobile, tablet, desktop)

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State Management**: React Hooks
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Custom theme

## Project Structure

```
src/
├── components/
│   ├── Navigation.tsx          # Main navigation bar
│   ├── AdvancedSearch.tsx      # Cross-category search
│   └── ConciergeModal.tsx      # Concierge request form
├── pages/
│   ├── Home.tsx                # Hero and portfolio showcase
│   ├── RealEstate.tsx          # Property listings with filters
│   ├── Autos.tsx               # Vehicle listings
│   ├── Jewelry.tsx             # Jewelry showcase
│   ├── Investments.tsx         # Investment opportunities
│   ├── ImportsExports.tsx      # Global trade listings
│   ├── About.tsx               # Company info
│   ├── Contact.tsx             # Contact and support
│   ├── Login.tsx               # Authentication
│   ├── Dashboard.tsx           # User account dashboard
│   └── SellerDashboard.tsx     # Seller listing management
├── services/
│   ├── propertyService.ts      # Real estate CRUD & search
│   ├── vehicleService.ts       # Vehicle CRUD & search
│   └── jewelryService.ts       # Jewelry CRUD & search
├── lib/
│   ├── supabase.ts             # Supabase client
│   └── storage.ts              # Image upload utilities
├── hooks/
│   └── useAuth.ts              # Authentication hook
└── App.tsx                      # Main app component
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd luxoria
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Create storage buckets** (See STORAGE_SETUP.md)
   - `properties-images`
   - `vehicles-images`
   - `jewelry-images`

5. **Start development server**
   ```bash
   npm run dev
   ```

   Visit `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Database Setup

The Supabase database includes 10 tables with full RLS security:

- `profiles` - User accounts and settings
- `properties` - Real estate listings
- `vehicles` - Automotive inventory
- `jewelry` - Jewelry and gemstones
- `investments` - Investment opportunities
- `imports_exports` - Global trade goods
- `auctions` - Auction listings
- `auction_bids` - Individual bids
- `user_deposits` - User account balances
- `concierge_requests` - Service requests

See [DATABASE_GUIDE.md](./DATABASE_GUIDE.md) for full schema details.

## Services & APIs

### Property Service
```typescript
import { getProperties, searchProperties, createProperty } from '@/services/propertyService';

const properties = await getProperties({
  city: 'Lagos',
  minPrice: 1000000,
  listingType: 'sale'
});

const results = await searchProperties('luxury villa');
```

### Vehicle Service
```typescript
import { getVehicles, searchVehicles, createVehicle } from '@/services/vehicleService';

const vehicles = await getVehicles({
  make: 'Mercedes',
  minYear: 2020,
  condition: 'excellent'
});
```

### Jewelry Service
```typescript
import { getJewelry, searchJewelry, createJewelry } from '@/services/jewelryService';

const jewelry = await getJewelry({
  material: 'gold',
  minPrice: 5000
});
```

See [SEARCH_GUIDE.md](./SEARCH_GUIDE.md) for advanced search examples.

## Image Management

Images are stored in Supabase Storage with public CDN access:

```typescript
import { uploadImage, uploadMultipleImages } from '@/lib/storage';

// Single image
const url = await uploadImage(file, 'PROPERTIES');

// Multiple images
const urls = await uploadMultipleImages(files, 'VEHICLES');
```

See [STORAGE_SETUP.md](./STORAGE_SETUP.md) for detailed storage configuration.

## Authentication

### Sign Up
```typescript
const { error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: { full_name: 'John Doe' }
  }
});
```

### Login
```typescript
const { error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});
```

### Google OAuth
```typescript
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: window.location.origin }
});
```

### Check Auth Status
```typescript
const { user, loading } = useAuth();
```

## Pages Overview

### Home (`/`)
- Hero section with brand messaging
- Portfolio showcases (5 divisions)
- Featured properties and vehicles
- CTA buttons for portfolio exploration
- Concierge request modal

### Real Estate (`/realestate`)
- Advanced property search
- Filters: city, neighborhood, price, bedrooms, listing type
- Property cards with details
- Featured properties highlighted
- Responsive grid layout

### Autos (`/autos`)
- Vehicle search and filtering
- Filters: make, model, year, price, condition
- Vehicle specifications display
- Featured vehicles
- Auction-ready interface

### Jewelry (`/jewelry`)
- Jewelry showcase grid
- Search by material, gemstone
- Item details (material, weight, purity, gemstone)
- Pricing display
- Responsive 4-column layout

### Investments (`/investments`)
- Investment opportunities listing
- ROI and duration details
- Minimum investment amounts
- Risk level indicators

### Imports/Exports (`/importsexports`)
- Global trade goods listing
- Filter by import/export type
- Origin and destination countries
- Quantity and pricing

### About (`/about`)
- Company mission and values
- Founder profiles
- Company statistics
- Core values section

### Contact (`/contact`)
- Contact form
- Multiple phone numbers with WhatsApp links
- Email addresses by division
- Business hours and location info

### Login (`/login`)
- Email/password authentication
- Google OAuth
- Sign up and sign in forms
- Account creation

### Dashboard (`/dashboard`)
- User profile information
- Deposit management system
- Payment method selection
- Account activity
- Settings and preferences

### Seller Dashboard (`/seller`)
- List management interface
- Create new listings (properties, vehicles, jewelry)
- Edit existing listings
- Delete functionality
- Image upload with preview
- Form validation

## Design System

### Color Palette
- **Gold**: #d4a574 (Primary accent)
- **Black**: #000000 (Primary background)
- **Dark Gray**: #111827, #1f2937, #374151 (Secondary backgrounds)
- **Light Gray**: #9ca3af, #d1d5db (Text secondary)
- **White**: #ffffff (Text primary)

### Typography
- **Font Family**: Default system fonts (optimized for performance)
- **Weights**: Light (300), Normal (400), Semibold (600)
- **Sizing**: Responsive from mobile to desktop

### Spacing
- Based on 8px unit system
- Consistent margins and padding
- Responsive breakpoints

### Components
- Custom styled buttons
- Form inputs with validation
- Image galleries with hover effects
- Responsive grid layouts
- Navigation with mobile menu

## Performance Optimizations

1. **Database Indexes** - Optimized query performance
2. **Image CDN** - Supabase Storage CDN for fast delivery
3. **Code Splitting** - Lazy-loaded components
4. **Debounced Search** - 300ms debounce on search inputs
5. **Caching** - Browser caching for static assets
6. **Responsive Images** - Optimized for all screen sizes

## Security Features

1. **Row-Level Security** - Database policies restrict data access
2. **Authentication** - Secure password hashing with Supabase Auth
3. **OAuth** - Google authentication support
4. **Input Validation** - Client and server-side validation
5. **HTTPS** - All traffic encrypted
6. **CORS** - Restricted cross-origin requests

## Payment Integration

The deposit system supports:
- Nigerian Banks (GTBank, Access, First Bank, Zenith, UBA, Sterling)
- PayPal
- Stripe
- Wise (TransferWise)
- Cryptocurrency (Bitcoin, Ethereum, USDT)
- Wire Transfer

## Deployment

### Deploy to Vercel

```bash
npm run build
vercel deploy
```

### Deploy to Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

### Environment Variables for Production

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-key
```

## Maintenance

### Database Backups
```bash
supabase db pull
```

### Storage Backups
```bash
supabase storage download properties-images ./backups/
```

### Monitor Logs
Check Supabase dashboard for:
- API logs
- Storage logs
- Authentication logs
- Database activity

## Troubleshooting

### Common Issues

**Search not returning results:**
- Verify listings have 'active' status
- Check spelling in filters
- Try broader search terms

**Images not uploading:**
- Check bucket is public
- Verify storage policies
- Ensure file size < 100MB

**Authentication failing:**
- Check Supabase credentials
- Verify email not already registered
- Clear browser cache/cookies

**Slow performance:**
- Check database indexes
- Monitor API usage
- Review query performance
- Clear unused data

See individual guides for detailed troubleshooting:
- [DATABASE_GUIDE.md](./DATABASE_GUIDE.md)
- [STORAGE_SETUP.md](./STORAGE_SETUP.md)
- [SEARCH_GUIDE.md](./SEARCH_GUIDE.md)

## Contributing

1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## API Documentation

### Search Endpoints

Search across all divisions with flexible filters and full-text search.

**Property Search:**
```typescript
GET /api/properties?search=&city=&listingType=&minPrice=&maxPrice=
```

**Vehicle Search:**
```typescript
GET /api/vehicles?search=&make=&condition=&minPrice=&maxPrice=
```

**Jewelry Search:**
```typescript
GET /api/jewelry?search=&material=&minPrice=&maxPrice=
```

### Listing Endpoints

Create, read, update, delete listings.

**Create Property:**
```typescript
POST /api/properties
Body: { title, description, price_usd, location_city, ... }
```

**Get Property:**
```typescript
GET /api/properties/:id
```

**Update Property:**
```typescript
PUT /api/properties/:id
Body: { ...updates }
```

**Delete Property:**
```typescript
DELETE /api/properties/:id
```

Similar endpoints available for vehicles and jewelry.

## License

Proprietary - LUXORIA Group

## Support

For support, contact:
- **Email**: luxoriagroupltd@gmail.com
- **WhatsApp**: +234 913 301 7951
- **Website**: https://luxoriagroup.com

## Roadmap

- [ ] Advanced auction bidding system
- [ ] Real-time notifications
- [ ] Mobile app (React Native)
- [ ] AI-powered recommendations
- [ ] Video property tours
- [ ] Escrow payment system
- [ ] Dispute resolution
- [ ] Insurance integration
- [ ] Logistics partnership
- [ ] Analytics dashboard

## Team

- **Founder & CEO**: Visionary Leadership
- **CTO**: Digital Innovation
- **Operations**: Strategic Operations

---

Built with ❤️ for luxury commerce. © 2024 LUXORIA Group. All rights reserved.
