import { useState } from 'react';
import { Menu, X, LogOut, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

type Page = 'home' | 'realestate' | 'autos' | 'jewelry' | 'investments' | 'importsexports' | 'about' | 'contact' | 'login' | 'dashboard' | 'seller' | 'admin';

const ADMIN_EMAILS = [
  'obidah@luxoriagroup.com',
  'charles@luxoriagroup.com',
  'zedg7729@gmail.com',
  'esomchi2016@gmail.com'
];

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  user: User | null;
}

export default function Navigation({ currentPage, onNavigate, user }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onNavigate('home');
    setMobileMenuOpen(false);
  };

  const navItems: { label: string; page: Page }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Real Estate', page: 'realestate' },
    { label: 'Autos', page: 'autos' },
    { label: 'Jewelry', page: 'jewelry' },
    { label: 'Investments', page: 'investments' },
    { label: 'Imports/Exports', page: 'importsexports' },
    { label: 'About', page: 'about' },
    { label: 'Contact', page: 'contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-black border-b border-gold/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 border-2 border-gold transform rotate-45 flex items-center justify-center">
              <span className="text-gold font-bold text-lg transform -rotate-45">L</span>
            </div>
            <span className="text-xl font-light tracking-widest text-gold hidden sm:inline">LUXORIA</span>
          </button>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`text-sm tracking-wider transition-colors ${
                  currentPage === item.page
                    ? 'text-gold'
                    : 'text-gray-300 hover:text-gold'
                }`}
              >
                {item.label}
              </button>
            ))}
            {user && (
              <>
                <button
                  onClick={() => onNavigate('seller')}
                  className={`text-sm tracking-wider transition-colors ${
                    currentPage === 'seller'
                      ? 'text-gold'
                      : 'text-gray-300 hover:text-gold'
                  }`}
                >
                  Sell
                </button>
                {user.email && ADMIN_EMAILS.some(email => email.toLowerCase() === user.email?.toLowerCase()) && (
                  <button
                    onClick={() => onNavigate('admin')}
                    className={`text-sm tracking-wider transition-colors flex items-center gap-1 ${
                      currentPage === 'admin'
                        ? 'text-gold'
                        : 'text-gray-300 hover:text-gold'
                    }`}
                  >
                    <Lock size={14} />
                    Admin
                  </button>
                )}
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="hidden sm:flex items-center gap-4">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="text-sm tracking-wider text-gray-300 hover:text-gold transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold text-gold hover:bg-gold hover:text-black transition-all text-sm"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="hidden sm:block px-6 py-2 bg-gold text-black font-semibold hover:bg-gold/90 transition-colors text-sm"
              >
                Login
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-gold hover:text-gold/80 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-gold/20">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  onNavigate(item.page);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 text-sm tracking-wider transition-colors ${
                  currentPage === item.page
                    ? 'text-gold bg-gold/5'
                    : 'text-gray-300 hover:text-gold hover:bg-gold/5'
                }`}
              >
                {item.label}
              </button>
            ))}
            {user && (
              <>
                <button
                  onClick={() => {
                    onNavigate('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-sm tracking-wider text-gray-300 hover:text-gold hover:bg-gold/5 transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    onNavigate('seller');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-sm tracking-wider text-gray-300 hover:text-gold hover:bg-gold/5 transition-colors"
                >
                  Sell Listings
                </button>
                {user.email && ADMIN_EMAILS.some(email => email.toLowerCase() === user.email?.toLowerCase()) && (
                  <button
                    onClick={() => {
                      onNavigate('admin');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-sm tracking-wider text-gold hover:bg-gold/5 transition-colors flex items-center gap-2"
                  >
                    <Lock size={16} />
                    Admin Dashboard
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm tracking-wider text-gold hover:bg-gold/5 transition-colors mt-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            )}
            {!user && (
              <button
                onClick={() => {
                  onNavigate('login');
                  setMobileMenuOpen(false);
                }}
                className="block w-full px-4 py-3 mt-2 bg-gold text-black font-semibold hover:bg-gold/90 transition-colors text-sm"
              >
                Login
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
