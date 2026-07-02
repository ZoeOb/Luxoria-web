import { useState, useEffect } from 'react';
import { isSupabaseConfigured } from './lib/supabase';
import { useAuth } from './hooks/useAuth';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import RealEstate from './pages/RealEstate';
import Autos from './pages/Autos';
import Jewelry from './pages/Jewelry';
import Investments from './pages/Investments';
import ImportsExports from './pages/ImportsExports';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SellerDashboard from './pages/SellerDashboard';

type Page = 'home' | 'realestate' | 'autos' | 'jewelry' | 'investments' | 'importsexports' | 'about' | 'contact' | 'login' | 'dashboard' | 'seller';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!user && currentPage === 'dashboard') {
      setCurrentPage('login');
    }
  }, [user, currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gold mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    if (!isSupabaseConfigured && ['login', 'dashboard', 'seller'].includes(currentPage)) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
          <div className="max-w-md text-center border border-gold/30 bg-gradient-to-br from-gray-900 to-black p-8 sm:p-12">
            <div className="w-16 h-16 border-2 border-gold flex items-center justify-center mx-auto mb-6">
              <span className="text-gold font-bold text-2xl">!</span>
            </div>
            <h1 className="text-2xl font-light text-white mb-4">Configuration Required</h1>
            <p className="text-gray-400 font-light mb-6">
              Supabase credentials are missing. Please set:
            </p>
            <div className="text-left bg-black/50 border border-gold/20 p-4 mb-6 text-sm font-mono text-gold/90 space-y-2">
              <p>VITE_SUPABASE_URL=https://your-project.supabase.co</p>
              <p>VITE_SUPABASE_ANON_KEY=your-anon-key</p>
            </div>
            <p className="text-gray-500 text-sm font-light">
              Public pages (Home, About, Contact) will still render without these credentials.
            </p>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'realestate':
        return <RealEstate />;
      case 'autos':
        return <Autos />;
      case 'jewelry':
        return <Jewelry />;
      case 'investments':
        return <Investments />;
      case 'importsexports':
        return <ImportsExports />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'login':
        return <Login onNavigate={setCurrentPage} />;
      case 'dashboard':
        return user ? <Dashboard onNavigate={setCurrentPage} /> : <Login onNavigate={setCurrentPage} />;
      case 'seller':
        return user ? <SellerDashboard onNavigate={setCurrentPage} /> : <Login onNavigate={setCurrentPage} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} user={user} />
      {renderPage()}
    </div>
  );
}

export default App;
