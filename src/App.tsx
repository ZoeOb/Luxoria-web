import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
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
