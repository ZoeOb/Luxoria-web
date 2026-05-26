import { supabase } from '../lib/supabase';

export interface CreatePropertyData {
  title: string;
  description: string;
  price_usd: number;
  location_city: string;
  location_state: string;
  location_neighborhood?: string;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  property_type?: string;
  listing_type: 'sale' | 'lease' | 'short-let';
  main_image_url?: string;
  images_url?: string[];
  amenities?: string[];
  seller_id?: string;
}

export interface Property extends CreatePropertyData {
  id: string;
  created_at: string;
  updated_at: string;
  status: string;
  is_featured: boolean;
}

export interface PropertyFilter {
  city?: string;
  neighborhood?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  listingType?: 'sale' | 'lease' | 'short-let';
  search?: string;
}

// Create a new property
export async function createProperty(data: CreatePropertyData, userId: string): Promise<Property | null> {
  try {
    const { data: property, error } = await supabase
      .from('properties')
      .insert([{ ...data, seller_id: userId, status: 'active' }])
      .select()
      .single();

    if (error) throw error;
    return property;
  } catch (error) {
    console.error('Error creating property:', error);
    return null;
  }
}

// Get properties with advanced filtering
export async function getProperties(filters?: PropertyFilter): Promise<Property[]> {
  try {
    let query = supabase.from('properties').select('*').eq('status', 'active');

    if (filters) {
      if (filters.city) {
        query = query.ilike('location_city', `%${filters.city}%`);
      }

      if (filters.neighborhood) {
        query = query.ilike('location_neighborhood', `%${filters.neighborhood}%`);
      }

      if (filters.minPrice !== undefined) {
        query = query.gte('price_usd', filters.minPrice);
      }

      if (filters.maxPrice !== undefined) {
        query = query.lte('price_usd', filters.maxPrice);
      }

      if (filters.bedrooms !== undefined) {
        query = query.eq('bedrooms', filters.bedrooms);
      }

      if (filters.listingType) {
        query = query.eq('listing_type', filters.listingType);
      }

      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,location_city.ilike.%${filters.search}%,location_neighborhood.ilike.%${filters.search}%`
        );
      }
    }

    const { data, error } = await query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

// Get featured properties
export async function getFeaturedProperties(limit = 6): Promise<Property[]> {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'active')
      .eq('is_featured', true)
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    return [];
  }
}

// Search properties with full-text search
export async function searchProperties(query: string): Promise<Property[]> {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'active')
      .or(
        `title.ilike.%${query}%,description.ilike.%${query}%,location_city.ilike.%${query}%,location_neighborhood.ilike.%${query}%,location_state.ilike.%${query}%`
      )
      .limit(50);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching properties:', error);
    return [];
  }
}

// Get single property
export async function getPropertyById(id: string): Promise<Property | null> {
  try {
    const { data, error } = await supabase.from('properties').select('*').eq('id', id).single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
}

// Update property
export async function updateProperty(id: string, updates: Partial<Property>): Promise<Property | null> {
  try {
    const { data, error } = await supabase
      .from('properties')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating property:', error);
    return null;
  }
}

// Delete property
export async function deleteProperty(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('properties').delete().eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting property:', error);
    return false;
  }
}

// Get user properties
export async function getUserProperties(userId: string): Promise<Property[]> {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('seller_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user properties:', error);
    return [];
  }
}
