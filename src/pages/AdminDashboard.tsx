import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { uploadMultipleImages } from '../lib/storage';
import { createProperty, getUserProperties, deleteProperty, updateProperty } from '../services/propertyService';
import { createVehicle, getUserVehicles, deleteVehicle, updateVehicle } from '../services/vehicleService';
import { Plus, Trash2, Edit2, ImagePlus, Lock } from 'lucide-react';

const ADMIN_EMAILS = [
  'obidah@luxoriagroup.com',
  'charles@luxoriagroup.com',
  'zedg7729@gmail.com',
  'esomchi2016@gmail.com'
];

type Tab = 'properties' | 'vehicles' | 'create';

interface AdminDashboardProps {
  onNavigate: (page: any) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('properties');
  const [properties, setProperties] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<any>({});
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      const userEmail = user.email?.toLowerCase() || '';
      const isAuthorized = ADMIN_EMAILS.some(email => email.toLowerCase() === userEmail);
      setIsAdmin(isAuthorized);

      if (isAuthorized) {
        loadListings();
      } else {
        setLoading(false);
      }
    }
  }, [user]);

  const loadListings = async () => {
    try {
      const [propsData, vehicles] = await Promise.all([
        getUserProperties(user!.id),
        getUserVehicles(user!.id),
      ]);

      setProperties(propsData);
      setVehicles(vehicles);
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Please log in to access admin dashboard</p>
          <button
            onClick={() => onNavigate('login')}
            className="text-gold hover:text-white transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Lock className="w-16 h-16 text-gold mx-auto mb-6" />
          <h2 className="text-3xl font-light text-white mb-4">Access Denied</h2>
          <p className="text-gray-400 mb-6 font-light">
            This dashboard is restricted to authorized administrators only.
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-3 bg-gold text-black font-semibold hover:bg-gold/90 transition-all"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const handlePropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUploading(true);
    try {
      let imageUrls: string[] = [];

      if (imageFiles.length > 0) {
        imageUrls = await uploadMultipleImages(imageFiles, 'PROPERTIES');
      }

      const result = await createProperty(
        {
          ...formData,
          images_url: imageUrls,
          main_image_url: imageUrls[0] || '',
        },
        user.id
      );

      if (result) {
        setProperties([result, ...properties]);
        setFormData({});
        setImageFiles([]);
        setActiveTab('properties');
        alert('Property created successfully!');
      }
    } catch (error) {
      console.error('Error creating property:', error);
      alert('Failed to create property');
    } finally {
      setUploading(false);
    }
  };

  const handleVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUploading(true);
    try {
      let imageUrls: string[] = [];

      if (imageFiles.length > 0) {
        imageUrls = await uploadMultipleImages(imageFiles, 'VEHICLES');
      }

      const result = await createVehicle(
        {
          ...formData,
          images_url: imageUrls,
          main_image_url: imageUrls[0] || '',
        },
        user.id
      );

      if (result) {
        setVehicles([result, ...vehicles]);
        setFormData({});
        setImageFiles([]);
        setActiveTab('vehicles');
        alert('Vehicle created successfully!');
      }
    } catch (error) {
      console.error('Error creating vehicle:', error);
      alert('Failed to create vehicle');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, type: 'property' | 'vehicle') => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      let success = false;

      if (type === 'property') {
        success = await deleteProperty(id);
        if (success) setProperties(properties.filter((p) => p.id !== id));
      } else {
        success = await deleteVehicle(id);
        if (success) setVehicles(vehicles.filter((v) => v.id !== id));
      }

      if (success) {
        alert('Listing deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Failed to delete listing');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="inline-block h-10 w-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-900 to-black py-8 px-4 sm:px-6 lg:px-8 border-b border-gold/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="text-gold" size={24} />
            <h1 className="text-3xl font-light text-white">
              Admin <span className="text-gold">Dashboard</span>
            </h1>
          </div>
          <p className="text-gray-400 font-light">Manage property and vehicle listings</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-4 mb-8 border-b border-gold/30 overflow-x-auto">
          {[
            { id: 'properties', label: 'Properties' },
            { id: 'vehicles', label: 'Vehicles' },
            { id: 'create', label: 'Add New' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`px-6 py-4 text-sm font-light tracking-wider transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-gold border-b-2 border-gold'
                  : 'text-gray-400 hover:text-gold'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div>
            <h2 className="text-2xl font-light text-white mb-6">Properties</h2>
            {properties.length === 0 ? (
              <div className="text-center py-12 bg-gray-900 border border-gold/20 p-8">
                <p className="text-gray-400 mb-4 font-light">No properties listed yet</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-6 py-2 bg-gold text-black font-semibold hover:bg-gold/90 transition-all"
                >
                  Add First Property
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <div key={property.id} className="bg-gradient-to-br from-gray-900 to-black border border-gold/20 overflow-hidden group hover:border-gold transition-colors">
                    {property.main_image_url && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={property.main_image_url}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                    )}

                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-2 truncate">{property.title}</h3>
                      <p className="text-gold font-semibold mb-1">${(property.price_usd / 1000000).toFixed(1)}M</p>
                      <p className="text-gray-400 text-xs mb-4">
                        {property.location_city}, {property.location_state}
                      </p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setFormData(property);
                            setActiveTab('create');
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gold/30 text-gold hover:bg-gold hover:text-black transition-all text-sm"
                        >
                          <Edit2 size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(property.id, 'property')}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-red-600 text-red-400 hover:bg-red-600/20 transition-all text-sm"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Vehicles Tab */}
        {activeTab === 'vehicles' && (
          <div>
            <h2 className="text-2xl font-light text-white mb-6">Vehicles</h2>
            {vehicles.length === 0 ? (
              <div className="text-center py-12 bg-gray-900 border border-gold/20 p-8">
                <p className="text-gray-400 mb-4 font-light">No vehicles listed yet</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-6 py-2 bg-gold text-black font-semibold hover:bg-gold/90 transition-all"
                >
                  Add First Vehicle
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="bg-gradient-to-br from-gray-900 to-black border border-gold/20 overflow-hidden group hover:border-gold transition-colors">
                    {vehicle.main_image_url && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={vehicle.main_image_url}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                    )}

                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-2">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </h3>
                      <p className="text-gold font-semibold mb-1">${(vehicle.price_usd / 1000).toFixed(0)}K</p>
                      <p className="text-gray-400 text-xs mb-4">{vehicle.condition} Condition</p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setFormData(vehicle);
                            setActiveTab('create');
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gold/30 text-gold hover:bg-gold hover:text-black transition-all text-sm"
                        >
                          <Edit2 size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(vehicle.id, 'vehicle')}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-red-600 text-red-400 hover:bg-red-600/20 transition-all text-sm"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Tab */}
        {activeTab === 'create' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-light text-white mb-8">Add New Listing</h2>

            <div className="flex gap-4 mb-8">
              {['property', 'vehicle'].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setFormData({ type });
                    setImageFiles([]);
                  }}
                  className={`px-6 py-3 font-light capitalize transition-all ${
                    formData.type === type
                      ? 'bg-gold text-black'
                      : 'border border-gold/30 text-gold hover:border-gold'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {formData.type === 'property' && (
              <form onSubmit={handlePropertySubmit} className="space-y-6 bg-gray-900 border border-gold/20 p-8">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Title" required value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="col-span-2 bg-black border border-gold/30 text-white px-4 py-2 focus:border-gold outline-none" />
                  <input type="number" placeholder="Price (USD)" required value={formData.price_usd || ''} onChange={(e) => setFormData({ ...formData, price_usd: parseFloat(e.target.value) })} className="bg-black border border-gold/30 text-white px-4 py-2 focus:border-gold outline-none" />
                  <select value={formData.listing_type || ''} onChange={(e) => setFormData({ ...formData, listing_type: e.target.value })} className="bg-black border border-gold/30 text-white px-4 py-2 focus:border-gold outline-none">
                    <option value="">Listing Type</option>
                    <option value="sale">For Sale</option>
                    <option value="lease">For Lease</option>
                    <option value="short-let">Short Let</option>
                  </select>
                  <input type="text" placeholder="City" value={formData.location_city || ''} onChange={(e) => setFormData({ ...formData, location_city: e.target.value })} className="bg-black border border-gold/30 text-white px-4 py-2 focus:border-gold outline-none" />
                  <input type="text" placeholder="State" value={formData.location_state || ''} onChange={(e) => setFormData({ ...formData, location_state: e.target.value })} className="bg-black border border-gold/30 text-white px-4 py-2 focus:border-gold outline-none" />
                  <input type="number" placeholder="Bedrooms" value={formData.bedrooms || ''} onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })} className="bg-black border border-gold/30 text-white px-4 py-2 focus:border-gold outline-none" />
                  <input type="number" placeholder="Bathrooms" value={formData.bathrooms || ''} onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) })} className="bg-black border border-gold/30 text-white px-4 py-2 focus:border-gold outline-none" />
                </div>
                <textarea placeholder="Description" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-black border border-gold/30 text-white px-4 py-2 focus:border-gold outline-none resize-none h-24" />
                <div>
                  <label className="block text-gold text-sm mb-2 font-light flex items-center gap-2">
                    <ImagePlus size={16} />
                    Upload Images
                  </label>
                  <input type="file" multiple accept="image/*" onChange={(e) => setImageFiles(Array.from(e.target.files || []))} className="w-full" />
                  {imageFiles.length > 0 && <p className="text-gold text-sm mt-2">{imageFiles.length} image(s) selected</p>}
                </div>
                <button type="submit" disabled={uploading} className="w-full bg-gold text-black font-semibold py-3 hover:bg-gold/90 transition-all disabled:opacity-50">
                  {uploading ? 'Uploading...' : 'Add Property'}
                </button>
              </form>
            )}

            {formData.type === 'vehicle' && (
              <form onSubmit={handleVehicleSubmit} className="space-y-6 bg-gray-900 border border-gold/20 p-8">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Make" required value={formData.make || ''} onChange={(e) => setFormData({ ...formData, make: e.target.value })} className="bg-black border border-gold/30 text-white px-4 py-2 focus:border-gold outline-none" />
                  <input type="text" placeholder="Model" required value={formData.model || ''} onChange={(e) => setFormData({ ...formData, model: e.target.value })} className="bg-black border border-gold/30 text-white px-4 py-2 focus:border-gold outline-none" />
                  <input type="number" placeholder="Year" required value={formData.year || ''} onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })} className="bg-black border border-gold/30 text-white px-4 py-2 focus:border-gold outline-none" />
                  <input type="number" placeholder="Price (USD)" required value={formData.price_usd || ''} onChange={(e) => setFormData({ ...formData, price_usd: parseFloat(e.target.value) })} className="bg-black border border-gold/30 text-white px-4 py-2 focus:border-gold outline-none" />
                  <input type="number" placeholder="Mileage" value={formData.mileage || ''} onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) })} className="bg-black border border-gold/30 text-white px-4 py-2 focus:border-gold outline-none" />
                  <select value={formData.condition || ''} onChange={(e) => setFormData({ ...formData, condition: e.target.value })} className="bg-black border border-gold/30 text-white px-4 py-2 focus:border-gold outline-none">
                    <option value="">Condition</option>
                    <option value="new">New</option>
                    <option value="like-new">Like New</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                  </select>
                </div>
                <textarea placeholder="Description" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-black border border-gold/30 text-white px-4 py-2 focus:border-gold outline-none resize-none h-24" />
                <div>
                  <label className="block text-gold text-sm mb-2 font-light flex items-center gap-2">
                    <ImagePlus size={16} />
                    Upload Images
                  </label>
                  <input type="file" multiple accept="image/*" onChange={(e) => setImageFiles(Array.from(e.target.files || []))} className="w-full" />
                  {imageFiles.length > 0 && <p className="text-gold text-sm mt-2">{imageFiles.length} image(s) selected</p>}
                </div>
                <button type="submit" disabled={uploading} className="w-full bg-gold text-black font-semibold py-3 hover:bg-gold/90 transition-all disabled:opacity-50">
                  {uploading ? 'Uploading...' : 'Add Vehicle'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
