import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Wallet, Heart, Clock, TrendingUp, LogOut, Settings } from 'lucide-react';

type Page = 'home' | 'realestate' | 'autos' | 'jewelry' | 'investments' | 'importsexports' | 'about' | 'contact' | 'login' | 'dashboard';

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

interface Profile {
  email: string;
  full_name: string;
  phone: string;
  deposit_balance: number;
  is_verified: boolean;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'deposits' | 'settings'>('overview');
  const [depositAmount, setDepositAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank-transfer');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositAmount || !user) return;

    try {
      const { error } = await supabase.from('user_deposits').insert([
        {
          user_id: user.id,
          amount_usd: parseFloat(depositAmount),
          payment_method: paymentMethod,
          status: 'pending',
        },
      ]);

      if (error) throw error;

      setDepositAmount('');
      alert('Deposit request submitted. Awaiting payment verification.');
    } catch (err) {
      console.error('Error creating deposit:', err);
      alert('Failed to create deposit. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="inline-block h-10 w-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Unable to load profile</p>
          <button
            onClick={() => onNavigate('home')}
            className="text-gold hover:text-white transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-900 to-black py-8 px-4 sm:px-6 lg:px-8 border-b border-gold/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-light text-white">Welcome, <span className="text-gold">{profile.full_name || profile.email}</span></h1>
            {!profile.is_verified && (
              <div className="bg-yellow-900/20 border border-yellow-600 text-yellow-200 px-4 py-2 text-sm font-light">
                Account Pending Verification
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-black border border-gold/30 p-6">
              <div className="flex items-center gap-3">
                <Wallet className="text-gold" size={24} />
                <div>
                  <p className="text-gray-400 text-sm font-light">Deposit Balance</p>
                  <p className="text-2xl font-semibold text-gold">${profile.deposit_balance?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
            </div>

            <div className="bg-black border border-gold/30 p-6">
              <div className="flex items-center gap-3">
                <Heart className="text-gold" size={24} />
                <div>
                  <p className="text-gray-400 text-sm font-light">Saved Items</p>
                  <p className="text-2xl font-semibold text-gold">0</p>
                </div>
              </div>
            </div>

            <div className="bg-black border border-gold/30 p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-gold" size={24} />
                <div>
                  <p className="text-gray-400 text-sm font-light">Active Bids</p>
                  <p className="text-2xl font-semibold text-gold">0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gold/30">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'deposits', label: 'Deposits & Payments' },
              { id: 'settings', label: 'Settings' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 text-sm font-light tracking-wider transition-colors ${
                  activeTab === tab.id
                    ? 'text-gold border-b-2 border-gold'
                    : 'text-gray-400 hover:text-gold'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-light text-white mb-6">Your Account</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-gray-900 to-black border border-gold/20 p-8">
                  <h3 className="text-xl font-semibold text-gold mb-6">Profile Information</h3>

                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm mb-1 font-light">Email</p>
                      <p className="text-white font-light">{profile.email}</p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm mb-1 font-light">Full Name</p>
                      <p className="text-white font-light">{profile.full_name || 'Not set'}</p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm mb-1 font-light">Phone</p>
                      <p className="text-white font-light">{profile.phone || 'Not provided'}</p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm mb-1 font-light">Verification Status</p>
                      <p className={`font-light ${profile.is_verified ? 'text-green-400' : 'text-yellow-400'}`}>
                        {profile.is_verified ? 'Verified' : 'Pending Verification'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-black border border-gold/20 p-8">
                  <h3 className="text-xl font-semibold text-gold mb-6">Account Activity</h3>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 pb-4 border-b border-gold/20">
                      <Clock className="text-gold flex-shrink-0" size={20} />
                      <div>
                        <p className="text-white font-light">Account Created</p>
                        <p className="text-gray-400 text-sm font-light">Member since 2024</p>
                      </div>
                    </div>

                    <div className="text-gray-400 text-sm font-light pt-4">
                      <p>No recent transactions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'deposits' && (
            <div>
              <h2 className="text-2xl font-light text-white mb-6">Manage Your Deposits</h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-gradient-to-br from-gray-900 to-black border border-gold/20 p-8">
                    <h3 className="text-xl font-semibold text-gold mb-6">Add Deposit</h3>

                    <form onSubmit={handleDeposit} className="space-y-6">
                      <div>
                        <label className="block text-gold text-sm mb-2 font-light">Deposit Amount (USD)</label>
                        <input
                          type="number"
                          min="100"
                          step="0.01"
                          required
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          className="w-full bg-black border border-gold/30 text-white px-4 py-3 focus:border-gold outline-none transition-colors"
                          placeholder="Enter amount in USD"
                        />
                        <p className="text-gray-400 text-xs mt-2 font-light">Minimum: $100 USD</p>
                      </div>

                      <div>
                        <label className="block text-gold text-sm mb-2 font-light">Payment Method</label>
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-full bg-black border border-gold/30 text-white px-4 py-3 focus:border-gold outline-none transition-colors"
                        >
                          <optgroup label="Nigeria">
                            <option value="gtbank">Guaranteed Trust Bank (GTBank)</option>
                            <option value="access">Access Bank</option>
                            <option value="fbk">First Bank of Nigeria</option>
                            <option value="zenith">Zenith Bank</option>
                            <option value="uba">United Bank for Africa (UBA)</option>
                            <option value="sterling">Sterling Bank</option>
                          </optgroup>
                          <optgroup label="International">
                            <option value="paypal">PayPal</option>
                            <option value="stripe">Stripe</option>
                            <option value="wise">Wise (TransferWise)</option>
                            <option value="crypto">Cryptocurrency</option>
                          </optgroup>
                          <optgroup label="Other">
                            <option value="bank-transfer">International Bank Transfer</option>
                            <option value="wire">Wire Transfer</option>
                          </optgroup>
                        </select>
                      </div>

                      <button
                        type="submit"
                        disabled={!depositAmount}
                        className="w-full bg-gold text-black font-semibold py-3 hover:bg-gold/90 transition-all disabled:opacity-50"
                      >
                        Proceed to Payment
                      </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-gold/20">
                      <h4 className="text-gold font-semibold mb-4">Supported Payment Methods</h4>
                      <ul className="space-y-2 text-gray-400 text-sm font-light">
                        <li>✓ Nigerian Bank Transfers (All Major Banks)</li>
                        <li>✓ PayPal & Stripe</li>
                        <li>✓ International Wire Transfers</li>
                        <li>✓ Wise & Cross-border Payments</li>
                        <li>✓ Cryptocurrency (Bitcoin, Ethereum, USDT)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-gradient-to-br from-gray-900 to-black border border-gold/20 p-8">
                    <h3 className="text-lg font-semibold text-gold mb-6">Deposit Information</h3>

                    <div className="space-y-4 text-sm text-gray-400 font-light">
                      <div>
                        <p className="text-gold mb-1">Current Balance</p>
                        <p className="text-2xl text-white font-semibold">${profile.deposit_balance?.toFixed(2) || '0.00'}</p>
                      </div>

                      <div className="pt-4 border-t border-gold/20">
                        <p className="text-gold mb-2">Purpose</p>
                        <p>Unlock exclusive auctions and secure premium items</p>
                      </div>

                      <div className="pt-4 border-t border-gold/20">
                        <p className="text-gold mb-2">Auction Access</p>
                        <p>Deposit required to participate in auctions for vehicles, jewelry, and properties</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-light text-white mb-6">Account Settings</h2>

              <div className="max-w-2xl">
                <div className="bg-gradient-to-br from-gray-900 to-black border border-gold/20 p-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gold mb-4 flex items-center gap-2">
                        <Settings size={20} />
                        Preferences
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 font-light">Customize your Luxoria experience</p>

                      <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" defaultChecked className="w-4 h-4 accent-gold" />
                          <span className="text-gray-300 font-light">Receive email notifications about new listings</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" defaultChecked className="w-4 h-4 accent-gold" />
                          <span className="text-gray-300 font-light">Get alerts for auctions in my saved categories</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 accent-gold" />
                          <span className="text-gray-300 font-light">Receive promotional offers and special deals</span>
                        </label>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gold/20">
                      <h3 className="text-lg font-semibold text-gold mb-4">Security</h3>
                      <button className="px-6 py-2 border border-gold text-gold hover:bg-gold hover:text-black transition-all font-light">
                        Change Password
                      </button>
                    </div>

                    <div className="pt-6 border-t border-gold/20">
                      <h3 className="text-lg font-semibold text-gold mb-4">Danger Zone</h3>
                      <button className="px-6 py-2 border border-red-600 text-red-400 hover:bg-red-600/20 transition-all font-light">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
