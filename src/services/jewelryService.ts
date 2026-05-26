import { supabase } from '../lib/supabase';

export interface CreateJewelryData {
  title: string;
  description: string;
  material: string;
  weight_grams?: number;
  purity?: string;
  gemstone?: string;
  price_usd: number;
  main_image_url?: string;
  images_url?: string[];
  seller_id?: string;
}

export interface Jewelry extends CreateJewelryData {
  id: string;
  created_at: string;
  updated_at: string;
  status: string;
  is_featured: boolean;
}

export interface JewelryFilter {
  material?: string;
  gemstone?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

// Create a new jewelry item
export async function createJewelry(data: CreateJewelryData, userId: string): Promise<Jewelry | null> {
  try {
    const { data: jewelry, error } = await supabase
      .from('jewelry')
      .insert([{ ...data, seller_id: userId, status: 'active' }])
      .select()
      .single();

    if (error) throw error;
    return jewelry;
  } catch (error) {
    console.error('Error creating jewelry:', error);
    return null;
  }
}

// Get jewelry with filtering
export async function getJewelry(filters?: JewelryFilter): Promise<Jewelry[]> {
  try {
    let query = supabase.from('jewelry').select('*').eq('status', 'active');

    if (filters) {
      if (filters.material) {
        query = query.ilike('material', `%${filters.material}%`);
      }

      if (filters.gemstone) {
        query = query.ilike('gemstone', `%${filters.gemstone}%`);
      }

      if (filters.minPrice !== undefined) {
        query = query.gte('price_usd', filters.minPrice);
      }

      if (filters.maxPrice !== undefined) {
        query = query.lte('price_usd', filters.maxPrice);
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,material.ilike.%${filters.search}%,gemstone.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
    }

    const { data, error } = await query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching jewelry:', error);
    return [];
  }
}

// Get featured jewelry
export async function getFeaturedJewelry(limit = 8): Promise<Jewelry[]> {
  try {
    const { data, error } = await supabase
      .from('jewelry')
      .select('*')
      .eq('status', 'active')
      .eq('is_featured', true)
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching featured jewelry:', error);
    return [];
  }
}

// Search jewelry
export async function searchJewelry(query: string): Promise<Jewelry[]> {
  try {
    const { data, error } = await supabase
      .from('jewelry')
      .select('*')
      .eq('status', 'active')
      .or(`title.ilike.%${query}%,material.ilike.%${query}%,gemstone.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(50);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching jewelry:', error);
    return [];
  }
}

// Get single jewelry item
export async function getJewelryById(id: string): Promise<Jewelry | null> {
  try {
    const { data, error } = await supabase.from('jewelry').select('*').eq('id', id).single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching jewelry:', error);
    return null;
  }
}

// Update jewelry
export async function updateJewelry(id: string, updates: Partial<Jewelry>): Promise<Jewelry | null> {
  try {
    const { data, error } = await supabase
      .from('jewelry')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating jewelry:', error);
    return null;
  }
}

// Delete jewelry
export async function deleteJewelry(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('jewelry').delete().eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting jewelry:', error);
    return false;
  }
}

// Get user jewelry
export async function getUserJewelry(userId: string): Promise<Jewelry[]> {
  try {
    const { data, error } = await supabase
      .from('jewelry')
      .select('*')
      .eq('seller_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user jewelry:', error);
    return [];
  }
}
