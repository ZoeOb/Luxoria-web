# Supabase Storage Setup for Luxoria

## Storage Buckets

Three public storage buckets need to be created in your Supabase project for image uploads:

### 1. properties-images
**Path:** `storage/buckets/properties-images`

Contains all real estate property photos.

**Configuration:**
- Public bucket: YES
- Row level security: Enabled
- Max file size: 100MB
- Allowed file types: JPEG, PNG, WebP, GIF

**Upload path format:** `user-{user_id}/{property_id}/{timestamp}-{filename}`

### 2. vehicles-images
**Path:** `storage/buckets/vehicles-images`

Contains all vehicle/automotive photos (eBay Motors style).

**Configuration:**
- Public bucket: YES
- Row level security: Enabled
- Max file size: 100MB
- Allowed file types: JPEG, PNG, WebP, GIF

**Upload path format:** `user-{user_id}/{vehicle_id}/{timestamp}-{filename}`

### 3. jewelry-images
**Path:** `storage/buckets/jewelry-images`

Contains all jewelry and gemstone photos.

**Configuration:**
- Public bucket: YES
- Row level security: Enabled
- Max file size: 100MB
- Allowed file types: JPEG, PNG, WebP, GIF

**Upload path format:** `user-{user_id}/{jewelry_id}/{timestamp}-{filename}`

## Manual Setup Instructions

### Via Supabase Dashboard

1. Go to **Storage** in your Supabase dashboard
2. Click **Create a new bucket**
3. Name the bucket: `properties-images`
4. Ensure **Public bucket** is checked
5. Click **Create bucket**
6. Repeat for `vehicles-images` and `jewelry-images`

### Via Supabase CLI

```bash
# Create buckets
supabase buckets create properties-images --public
supabase buckets create vehicles-images --public
supabase buckets create jewelry-images --public
```

## RLS Policies for Storage

Apply these policies to each bucket:

### Allow Public Read Access

```sql
-- For properties-images bucket
CREATE POLICY "Allow public read access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'properties-images');

-- For vehicles-images bucket
CREATE POLICY "Allow public read access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'vehicles-images');

-- For jewelry-images bucket
CREATE POLICY "Allow public read access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'jewelry-images');
```

### Allow Authenticated Users to Upload

```sql
-- For properties-images bucket
CREATE POLICY "Allow authenticated users to upload" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'properties-images' AND
    (storage.foldername(name))[1] = 'user-' || auth.uid()::text
  );

-- For vehicles-images bucket
CREATE POLICY "Allow authenticated users to upload" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'vehicles-images' AND
    (storage.foldername(name))[1] = 'user-' || auth.uid()::text
  );

-- For jewelry-images bucket
CREATE POLICY "Allow authenticated users to upload" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'jewelry-images' AND
    (storage.foldername(name))[1] = 'user-' || auth.uid()::text
  );
```

### Allow Users to Delete Their Own Files

```sql
-- For all buckets
CREATE POLICY "Allow users to delete their own files" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    (storage.foldername(name))[1] = 'user-' || auth.uid()::text
  );
```

## Image Upload Implementation

The upload system is implemented in `/src/lib/storage.ts`:

```typescript
import { uploadImage, uploadMultipleImages } from '@/lib/storage';

// Upload single image
const imageUrl = await uploadImage(file, 'PROPERTIES');

// Upload multiple images
const imageUrls = await uploadMultipleImages(files, 'VEHICLES');
```

## Image URL Format

Once uploaded, images are publicly accessible at:

```
https://{project_id}.supabase.co/storage/v1/object/public/{bucket_name}/{file_path}
```

Example:
```
https://abc123.supabase.co/storage/v1/object/public/properties-images/user-xyz/property-123/1234567890-villa.jpg
```

## Integration with Listings

When creating a listing, the image URLs are stored in the database:

### Properties Table
```typescript
{
  main_image_url: "https://...",  // Primary image
  images_url: [                    // Array of all images
    "https://...",
    "https://...",
    "https://..."
  ]
}
```

## Image Optimization Tips

1. **Before Upload:**
   - Compress images to reduce file size
   - Use WEBP format for better compression
   - Resize to max 2000px width
   - Remove EXIF data

2. **Lazy Loading:**
   ```typescript
   <img src={image} loading="lazy" />
   ```

3. **Responsive Images:**
   ```typescript
   <img 
     src={image} 
     srcSet={`${image}?width=400 400w, ${image}?width=800 800w`}
     sizes="(max-width: 600px) 100vw, 50vw"
   />
   ```

## Image Deletion

When deleting a listing, automatically delete associated images:

```typescript
import { deleteImage } from '@/lib/storage';

// Delete when removing listing
await deleteProperty(propertyId);
// Also delete images
for (const imageUrl of property.images_url) {
  const fileName = imageUrl.split('/').pop();
  await deleteImage('PROPERTIES', fileName);
}
```

## Troubleshooting Storage Issues

### Bucket Not Found
- Verify bucket name in your Supabase project
- Check bucket is public
- Ensure RLS policies are configured

### Upload Fails with 403 Forbidden
- Check user is authenticated
- Verify file path matches policy requirements
- Ensure bucket policies allow INSERT

### Images Not Loading
- Check image URL is correct
- Verify bucket is public
- Test image URL in browser

### File Too Large
- Maximum file size is 100MB per file
- Compress images before upload
- Consider resizing very large images

## CDN Configuration

Enable CDN caching for faster image delivery:

1. Go to **Storage** in Supabase dashboard
2. Select bucket
3. Enable **CDN**
4. Set cache duration (default: 3600 seconds)

## Backup Strategy

Regularly backup images from storage:

```bash
# Using Supabase CLI
supabase db pull
supabase storage download properties-images ./backups/
```

## Monitoring

Monitor storage usage:

1. Supabase Dashboard → Storage → Usage
2. Check storage quota
3. Monitor bandwidth usage
4. Review file counts per bucket

## Cost Optimization

- **Storage:** $0.021/GB per month
- **Bandwidth:** $0.025/GB per month
- Compress images to reduce costs
- Set appropriate cache headers
- Consider CDN for high-traffic images

## Future Enhancements

1. **Image Processing:**
   - Automatic thumbnail generation
   - Multi-size variants
   - Format conversion

2. **Advanced Features:**
   - Image cropping in UI
   - Batch uploads
   - Drag-and-drop interface

3. **Analytics:**
   - Image view tracking
   - Download statistics
   - Popular images report
