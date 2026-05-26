# LUXORIA Quick Start Guide

## 5-Minute Setup

### 1. Environment Setup
```bash
# Create .env file with your Supabase credentials
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Create Storage Buckets
Go to Supabase Dashboard → Storage:
1. Create `properties-images` (Public)
2. Create `vehicles-images` (Public)
3. Create `jewelry-images` (Public)

### 3. Start Development
```bash
npm install
npm run dev
```

Visit http://localhost:5173

## Key Features at a Glance

### As a Buyer
1. **Search** - Find properties, autos, jewelry with advanced filters
2. **Browse** - View detailed listings with images
3. **Create Account** - Sign up or use Google OAuth
4. **Make Deposit** - Unlock auction participation
5. **Place Bids** - Bid on premium items
6. **Manage Account** - View history, settings, saved items

### As a Seller
1. **Navigate to** `/seller` after login
2. **Create Listings** - Properties, vehicles, jewelry
3. **Upload Images** - Multi-image support with cloud storage
4. **Manage** - Edit, delete, track performance
5. **Auction** - Set up auction listings with starting prices
6. **Monitor** - View bids and manage sales

### As an Admin
- Access dashboard and analytics (future feature)
- Manage user accounts
- Monitor transactions
- Review compliance

## Navigation Map

```
Home (/)
├── Real Estate (/realestate)
├── Autos (/autos)
├── Jewelry (/jewelry)
├── Investments (/investments)
├── Imports/Exports (/importsexports)
├── About (/about)
├── Contact (/contact)
├── Login (/login)
├── Dashboard (/dashboard) - Authenticated
└── Seller Dashboard (/seller) - Authenticated
```

## Common Tasks

### Search for Properties
1. Go to Real Estate page
2. Enter city or neighborhood in search
3. Use Advanced Filters for price, bedrooms, etc.
4. Click property to view details

### List a Property
1. Login or create account
2. Go to Seller Dashboard (/seller)
3. Click "Create New" → Select "property"
4. Fill in details (title, price, location, beds, baths)
5. Upload images
6. Click "Create Property"

### Upload Images
- Click "Upload Images" button
- Select multiple files at once
- Preview shows count of selected images
- Automatic upload when listing is created

### Search Across All Divisions
- Use the advanced search component
- Search term searches all categories
- Filter by type (Properties, Vehicles, Jewelry, All)
- See results with images and prices

### Manage Deposits
1. Go to Dashboard
2. Click "Deposits & Payments" tab
3. Enter amount and select payment method
4. Supported: Nigerian banks, PayPal, Stripe, Crypto, Wire

### Request Concierge Service
1. Click "Request Concierge" on home page
2. Fill in contact details
3. Select service type (personal shopping, property search, etc.)
4. Option to stay anonymous
5. Submit and wait for contact

## Database Quick Reference

### View Data in Supabase
1. Go to Supabase Dashboard
2. SQL Editor
3. Run queries:

```sql
-- View all active properties
SELECT * FROM properties WHERE status = 'active';

-- View user profiles
SELECT email, full_name, deposit_balance FROM profiles;

-- View vehicles
SELECT * FROM vehicles WHERE status = 'active';

-- View auctions
SELECT * FROM auctions WHERE status = 'active';
```

### Common Database Operations

**Add test property:**
```sql
INSERT INTO properties 
(title, description, price_usd, location_city, location_state, bedrooms, bathrooms, listing_type, seller_id)
VALUES 
('Test Villa', 'Beautiful property', 5000000, 'Lagos', 'Lagos', 4, 3, 'sale', 'user-uuid-here');
```

**Check user deposits:**
```sql
SELECT user_id, amount_usd, status FROM user_deposits ORDER BY created_at DESC;
```

**View recent concierge requests:**
```sql
SELECT email, service_type, status FROM concierge_requests ORDER BY created_at DESC LIMIT 10;
```

## File Organization

```
src/
├── components/          # Reusable UI components
│   ├── Navigation.tsx   # Top navigation bar
│   ├── AdvancedSearch   # Global search
│   └── ConciergeModal   # Concierge form
├── pages/              # Route pages (one per route)
│   ├── Home.tsx        # Hero and portfolio
│   ├── RealEstate.tsx  # Property listings
│   ├── Autos.tsx       # Vehicle listings
│   ├── Jewelry.tsx     # Jewelry listings
│   ├── SellerDashboard # Listing management
│   └── ...
├── services/           # Database service layer
│   ├── propertyService.ts
│   ├── vehicleService.ts
│   └── jewelryService.ts
├── lib/               # Utilities
│   ├── supabase.ts    # Supabase client
│   └── storage.ts     # Image upload
└── hooks/             # React hooks
    └── useAuth.ts     # Auth management
```

## Code Examples

### Fetch Properties
```typescript
import { getProperties } from '@/services/propertyService';

const properties = await getProperties({
  city: 'Lagos',
  minPrice: 1000000,
  maxPrice: 5000000,
  listingType: 'sale'
});
```

### Upload Images
```typescript
import { uploadMultipleImages } from '@/lib/storage';

const imageUrls = await uploadMultipleImages(files, 'PROPERTIES');
```

### Create Property
```typescript
import { createProperty } from '@/services/propertyService';

const newProperty = await createProperty({
  title: 'Luxury Villa',
  price_usd: 2500000,
  location_city: 'Lagos',
  listing_type: 'sale',
  // ... more fields
}, userId);
```

### Search
```typescript
import { searchProperties } from '@/services/propertyService';

const results = await searchProperties('luxury villa');
```

### Check Auth Status
```typescript
import { useAuth } from '@/hooks/useAuth';

const { user, loading } = useAuth();

if (!user) {
  // Show login prompt
}
```

## Styling Guide

### Color System
- **Gold** (#d4a574): Primary accent, hover states, active elements
- **Black** (#000000): Primary background
- **Dark Gray** (#1f2937, #374151): Secondary backgrounds
- **White** (#ffffff): Text on dark backgrounds

### Apply Styles
```tsx
// Gold background
className="bg-gold text-black"

// Gold text
className="text-gold"

// Gold border
className="border-gold"

// Dark background
className="bg-black"

// Hover effect
className="hover:bg-gold hover:text-black"
```

## Production Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
vercel deploy --prod
```

### Deploy to Netlify
```bash
netlify deploy --prod --dir=dist
```

### Environment Variables (Production)
Set in deployment platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Monitoring & Troubleshooting

### Check Logs
1. Supabase Dashboard → Logs
2. Check API, Auth, Database logs
3. Look for error patterns

### Performance Monitoring
- Browser DevTools → Performance
- Check bundle size: `npm run build`
- Monitor API calls: Supabase Dashboard

### Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Images not uploading | Check bucket is public, verify RLS policies |
| Search returns empty | Ensure listings have 'active' status |
| Auth fails | Clear browser cookies, check credentials |
| Slow performance | Check database indexes, limit query results |
| Page blank | Check console for JS errors, verify Supabase URL |

## Advanced Features

### Set Up Auctions
1. Create property/vehicle listing
2. Go to auctions table in Supabase
3. Create auction record linking to item_id
4. Set start_date, end_date, starting_price

### Enable Deposits
- Users navigate to Dashboard
- Click "Deposits & Payments"
- Select payment method
- Enter amount
- System tracks balance in profiles table

### Custom Payment Integration
1. Stripe: Configure Stripe API keys
2. PayPal: Set up PayPal OAuth
3. Banks: Implement bank transfer API
4. Crypto: Integrate blockchain wallet

### Real-Time Updates
Use Supabase realtime subscriptions:
```typescript
supabase
  .from('auctions')
  .on('*', payload => {
    // Handle auction updates in real-time
  })
  .subscribe();
```

## API Reference

See full documentation in:
- [DATABASE_GUIDE.md](./DATABASE_GUIDE.md) - Database schema and queries
- [SEARCH_GUIDE.md](./SEARCH_GUIDE.md) - Search implementation
- [STORAGE_SETUP.md](./STORAGE_SETUP.md) - Image storage configuration
- [README.md](./README.md) - Complete project documentation

## Support Resources

### Documentation
- README.md - Project overview
- DATABASE_GUIDE.md - Database and backend
- SEARCH_GUIDE.md - Search functionality
- STORAGE_SETUP.md - Image storage

### Supabase Resources
- [Supabase Docs](https://supabase.io/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
- [Supabase Dashboard](https://app.supabase.com)

### React Resources
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Contact & Support

For questions or support:
- **Email**: luxoriagroupltd@gmail.com
- **WhatsApp**: +234 913 301 7951
- **Website**: https://luxoriagroup.com

---

**Last Updated**: May 2024
**Status**: Production Ready ✓
