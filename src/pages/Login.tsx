import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Lock, ArrowRight } from 'lucide-react';

type Page = 'home' | 'realestate' | 'autos' | 'jewelry' | 'investments' | 'importsexports' | 'about' | 'contact' | 'login' | 'dashboard';

interface LoginProps {
  onNavigate: (page: Page) => void;
}

export default function Login({ onNavigate }: LoginProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (signUpError) throw signUpError;

        setMessage('Check your email to confirm your account');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        onNavigate('dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Google login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-black border border-gold/30 p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-gold mb-4">
              <span className="text-gold font-bold text-2xl">L</span>
            </div>
            <h1 className="text-3xl font-light text-white mb-2">LUXORIA</h1>
            <p className="text-gold text-sm tracking-widest">{isSignUp ? 'Create Account' : 'Welcome Back'}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-200 px-4 py-3 mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {message && (
            <div className="bg-green-900/20 border border-green-500 text-green-200 px-4 py-3 mb-6 text-sm">
              {message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
            {isSignUp && (
              <div>
                <label className="block text-gold text-sm mb-2 font-light">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full bg-gray-900 border border-gold/30 text-white px-4 py-3 focus:border-gold outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label className="block text-gold text-sm mb-2 font-light">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gold/50 opacity-50" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-gray-900 border border-gold/30 text-white px-4 py-3 pl-10 focus:border-gold outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-gold text-sm mb-2 font-light">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gold/50 opacity-50" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-gray-900 border border-gold/30 text-white px-4 py-3 pl-10 focus:border-gold outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-black font-semibold py-3 hover:bg-gold/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 border-t border-gold/20"></div>
            <span className="text-gold/50 text-xs">OR</span>
            <div className="flex-1 border-t border-gold/20"></div>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full border border-gold/30 text-white py-3 hover:bg-gold/5 transition-colors mb-4 font-light"
          >
            Sign in with Google
          </button>

          {/* Toggle */}
          <p className="text-center text-gray-400 text-sm">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setMessage('');
              }}
              className="text-gold hover:text-gold/80 font-semibold transition-colors"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>

          {/* Back Home */}
          <button
            onClick={() => onNavigate('home')}
            className="w-full mt-6 text-gold text-sm hover:text-gold/80 transition-colors font-light"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
