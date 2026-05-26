import { supabase } from '../lib/supabase';

export interface CreateVehicleData {
  title: string;
  description: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  price_usd: number;
  condition: 'new' | 'like-new' | 'excellent' | 'good' | 'fair';
  color: string;
  transmission?: string;
  fuel_type?: string;
  main_image_url?: string;
  images_url?: string[];
  vehicle_type?: string;
  seller_id?: string;
}

export interface Vehicle extends CreateVehicleData {
  id: string;
  created_at: string;
  updated_at: string;
  status: string;
  is_featured: boolean;
}

export interface VehicleFilter {
  make?: string;
  model?: string;
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  fuelType?: string;
  transmission?: string;
  search?: string;
}

// Create a new vehicle
export async function createVehicle(data: CreateVehicleData, userId: string): Promise<Vehicle | null> {
  try {
    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .insert([{ ...data, seller_id: userId, status: 'active' }])
      .select()
      .single();

    if (error) throw error;
    return vehicle;
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return null;
  }
}

// Get vehicles with advanced filtering
export async function getVehicles(filters?: VehicleFilter): Promise<Vehicle[]> {
  try {
    let query = supabase.from('vehicles').select('*').eq('status', 'active');

    if (filters) {
      if (filters.make) {
        query = query.ilike('make', `%${filters.make}%`);
      }

      if (filters.model) {
        query = query.ilike('model', `%${filters.model}%`);
      }

      if (filters.minYear !== undefined) {
        query = query.gte('year', filters.minYear);
      }

      if (filters.maxYear !== undefined) {
        query = query.lte('year', filters.maxYear);
      }

      if (filters.minPrice !== undefined) {
        query = query.gte('price_usd', filters.minPrice);
      }

      if (filters.maxPrice !== undefined) {
        query = query.lte('price_usd', filters.maxPrice);
      }

      if (filters.condition) {
        query = query.eq('condition', filters.condition);
      }

      if (filters.fuelType) {
        query = query.ilike('fuel_type', `%${filters.fuelType}%`);
      }

      if (filters.transmission) {
        query = query.ilike('transmission', `%${filters.transmission}%`);
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,make.ilike.%${filters.search}%,model.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
    }

    const { data, error } = await query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return [];
  }
}

// Get featured vehicles
export async function getFeaturedVehicles(limit = 6): Promise<Vehicle[]> {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('status', 'active')
      .eq('is_featured', true)
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching featured vehicles:', error);
    return [];
  }
}

// Search vehicles with full-text search
export async function searchVehicles(query: string): Promise<Vehicle[]> {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('status', 'active')
      .or(`title.ilike.%${query}%,make.ilike.%${query}%,model.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(50);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching vehicles:', error);
    return [];
  }
}

// Get single vehicle
export async function getVehicleById(id: string): Promise<Vehicle | null> {
  try {
    const { data, error } = await supabase.from('vehicles').select('*').eq('id', id).single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return null;
  }
}

// Update vehicle
export async function updateVehicle(id: string, updates: Partial<Vehicle>): Promise<Vehicle | null> {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return null;
  }
}

// Delete vehicle
export async function deleteVehicle(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('vehicles').delete().eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return false;
  }
}

// Get user vehicles
export async function getUserVehicles(userId: string): Promise<Vehicle[]> {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('seller_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user vehicles:', error);
    return [];
  }
}
