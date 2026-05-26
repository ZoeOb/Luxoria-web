import { supabase } from './supabase';

const BUCKETS = {
  PROPERTIES: 'properties-images',
  VEHICLES: 'vehicles-images',
  JEWELRY: 'jewelry-images',
};

export async function uploadImage(
  file: File,
  bucketName: keyof typeof BUCKETS,
  fileName?: string
): Promise<string | null> {
  try {
    const bucket = BUCKETS[bucketName];
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = fileName || `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(uniqueFileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

export async function deleteImage(bucketName: keyof typeof BUCKETS, fileName: string): Promise<boolean> {
  try {
    const bucket = BUCKETS[bucketName];
    const { error } = await supabase.storage.from(bucket).remove([fileName]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

export async function uploadMultipleImages(
  files: File[],
  bucketName: keyof typeof BUCKETS
): Promise<string[]> {
  const urls: string[] = [];

  for (const file of files) {
    const url = await uploadImage(file, bucketName);
    if (url) urls.push(url);
  }

  return urls;
}

export function getImageUrl(bucketName: keyof typeof BUCKETS, fileName: string): string {
  return `${supabase.storage.from(BUCKETS[bucketName]).getPublicUrl(fileName).data.publicUrl}`;
}
