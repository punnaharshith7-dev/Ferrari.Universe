import React, { useState, useEffect } from 'react';
import { ferrariModels, FerrariModel } from './data/ferrariData';
import Hero from './components/Hero';
import Timeline from './components/Timeline';
import TechHeritage from './components/TechHeritage';
import CarCard from './components/CarCard';
import CarDetail from './components/CarDetail';
import Compare from './components/Compare';
import AIRecommend from './components/AIRecommend';
import MuseumRacingNews from './components/MuseumRacingNews';
import Studio3D from './components/Studio3D';
import LoginPage from './components/LoginPage';
import { 
  Compass, Search, Heart, Sliders, MapPin, 
  Trophy, MessageSquare, Info, Zap, ChevronRight, 
  Volume2, ShieldAlert, Sparkles, AlertCircle, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

export default function App() {
  // User Authentication States
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('ferrari_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('ferrari_token');
  });
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'home' | 'all-cars' | 'compare' | 'museum' | 'racing' | 'news' | 'ai-advisor' | 'contact' | 'studio-3d'>('home');
  const [activeStudioCarId, setActiveStudioCarId] = useState<string | undefined>(undefined);

  // Filtering states for "All Cars" catalog
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('year-desc');

  // Local-Storage Persistence States
  const [favoritedIds, setFavoritedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('ferrari_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [comparedIds, setComparedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('ferrari_compare');
    return saved ? JSON.parse(saved) : [];
  });

  // Highlight selected car details
  const [selectedCar, setSelectedCar] = useState<FerrariModel | null>(null);

  // Verify token on mount
  useEffect(() => {
    const verifySession = async () => {
      const savedToken = localStorage.getItem('ferrari_token');
      if (savedToken) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${savedToken}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.user) {
              setUser(data.user);
              localStorage.setItem('ferrari_user', JSON.stringify(data.user));
            }
          } else {
            // Token expired or invalid
            handleLogout();
          }
        } catch (e) {
          console.error('Session verification failed', e);
        }
      }
    };
    verifySession();
  }, []);

  const handleLogout = async () => {
    const savedToken = localStorage.getItem('ferrari_token');
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: savedToken ? `Bearer ${savedToken}` : ''
        }
      });
    } catch (e) {
      console.error('Logout request failed', e);
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('ferrari_user');
    localStorage.removeItem('ferrari_token');
  };

  const handleLoginSuccess = (userProfile: UserProfile, sessionToken: string) => {
    setUser(userProfile);
    setToken(sessionToken);
    localStorage.setItem('ferrari_user', JSON.stringify(userProfile));
    localStorage.setItem('ferrari_token', sessionToken);
    setShowLoginModal(false);
  };

  // Sync state with localstorage
  useEffect(() => {
    localStorage.setItem('ferrari_wishlist', JSON.stringify(favoritedIds));
  }, [favoritedIds]);

  useEffect(() => {
    localStorage.setItem('ferrari_compare', JSON.stringify(comparedIds));
  }, [comparedIds]);

  const handleToggleFavorite = (id: string) => {
    setFavoritedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleCompare = (id: string) => {
    setComparedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        if (prev.length >= 4) {
          alert('You can compare a maximum of 4 Ferrari models side-by-side.');
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  // Filter & Sort core lineup
  const filteredModels = ferrariModels.filter((car) => {
    const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          car.engine.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          car.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || car.category === categoryFilter;
    const matchesAvailability = availabilityFilter === 'All' || car.availability === availabilityFilter;
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const sortedModels = [...filteredModels].sort((a, b) => {
    if (sortBy === 'year-desc') return b.year - a.year;
    if (sortBy === 'year-asc') return a.year - b.year;
    if (sortBy === 'hp-desc') return b.horsepower - a.horsepower;
    if (sortBy === 'hp-asc') return a.horsepower - b.horsepower;
    if (sortBy === 'acc-asc') return a.zeroToHundredNum - b.zeroToHundredNum;
    if (sortBy === 'price-desc') return b.priceNum - a.priceNum;
    if (sortBy === 'price-asc') return a.priceNum - b.priceNum;
    return 0;
  });

  const categories = ['All', 'Supercars', 'Hypercars', 'GT Cars', 'Sports Cars', 'Convertible/Spider', 'Track Cars', 'Limited Editions', 'Icona Series', 'Classic', 'Formula 1', 'SUVs'];

  return (
    <div id="ferrari-universe-app" className="min-h-screen bg-black text-white font-sans selection:bg-red-600 selection:text-white overflow-x-hidden">
      
      {/* 1. GLOBAL LUXURY NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/10 w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo & Name */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Highly Authentic Scuderia Shield Logo */}
            <div className="w-8 h-10 transition-transform group-hover:scale-105">
              <svg className="w-full h-full drop-shadow-[0_0_8px_rgba(252,211,77,0.4)]" viewBox="0 0 100 130">
                <path
                  d="M10,10 C10,10 50,22 50,22 C50,22 90,10 90,10 C90,10 95,50 90,82 C85,110 50,126 50,126 C50,126 15,110 10,82 C5,50 10,10 10,10 Z"
                  fill="#FFEB00"
                  stroke="#000000"
                  strokeWidth="3.5"
                />
                <path
                  d="M11.5,14.5 C11.5,14.5 50,25.8 50,25.8 C50,25.8 88.5,14.5 88.5,14.5 C88.5,14.5 88.5,23.5 88,27 C80,24 50,33 50,33 C50,33 20,24 12,27 C11.5,23.5 11.5,14.5 11.5,14.5 Z"
                  fill="#FFFFFF"
                />
                <path
                  d="M11.5,14.5 C11.5,14.5 37,22 37,22 C37,22 37,30 35,31 C26,28 12,27 12,27 C11.5,23.5 11.5,14.5 11.5,14.5 Z"
                  fill="#10B981"
                />
                <path
                  d="M88.5,14.5 C88.5,14.5 63,22 63,22 C63,22 63,30 65,31 C74,28 88,27 88,27 C88.5,23.5 88.5,14.5 88.5,14.5 Z"
                  fill="#EF4444"
                />
                <path
                  d="M50,100 C47,90 43,85 39,80 C36,76 39,72 41,75 C43,77 47,81 49,76 C51,71 47,62 45,52 C43,44 48,38 55,44 C58,47 56,54 58,59 C60,64 64,59 66,55 C69,50 73,52 71,61 C69,68 66,75 68,82 C70,87 75,82 77,85 C75,92 67,97 64,106 C61,113 58,120 55,124 C54,124 51,105 50,100 Z"
                  fill="#000000"
                />
                <text x="24" y="105" fill="#000000" fontSize="16" fontWeight="bold" fontFamily="Georgia, serif">S</text>
                <text x="64" y="105" fill="#000000" fontSize="16" fontWeight="bold" fontFamily="Georgia, serif">F</text>
              </svg>
            </div>
            <div>
              <span className="text-sm font-serif font-bold uppercase tracking-widest text-white block group-hover:text-red-500 transition-colors">
                Ferrari Universe
              </span>
              <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">
                Maranello Archive
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 text-xs font-mono tracking-widest font-bold">
            {[
              { id: 'home', label: 'HOME' },
              { id: 'all-cars', label: 'CATALOGUE' },
              { id: 'studio-3d', label: '3D STUDIO' },
              { id: 'compare', label: `COMPARE (${comparedIds.length})` },
              { id: 'museum', label: 'MUSEUMS' },
              { id: 'racing', label: 'SCUDERIA RACING' },
              { id: 'news', label: 'NEWS' },
              { id: 'ai-advisor', label: 'AI ADVISOR' },
              { id: 'contact', label: 'CONTACT' },
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id as any)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === link.id
                    ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Header Status Quick Info (Wishlist counter & Auth Profile) */}
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => {
                setActiveTab('all-cars');
                setCategoryFilter('All');
                setSearchQuery('');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-mono text-neutral-300 transition-colors cursor-pointer h-9"
              title="Wishlist Favorites Count"
            >
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span className="font-bold text-white">{favoritedIds.length}</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2.5 h-9">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg h-full">
                  {user.picture ? (
                    <img 
                      src={user.picture} 
                      alt={user.name} 
                      referrerPolicy="no-referrer"
                      className="w-4.5 h-4.5 rounded-full object-cover border border-red-500"
                    />
                  ) : (
                    <div className="w-4.5 h-4.5 rounded-full bg-red-600 flex items-center justify-center text-[9px] font-black text-white font-mono uppercase">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <span className="hidden sm:inline text-[11px] font-mono font-bold text-neutral-300 font-black">
                    {user.name.split(' ')[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1.5 bg-neutral-950 border border-neutral-900 hover:border-red-600/40 hover:text-red-500 rounded-lg text-[9px] font-mono font-bold tracking-wider text-neutral-500 transition-colors uppercase cursor-pointer h-full flex items-center"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-500 border border-red-700/30 text-white rounded-lg text-[10px] font-mono font-black tracking-widest uppercase transition-all shadow-md shadow-red-600/20 hover:scale-[1.02] cursor-pointer h-9 flex items-center"
              >
                Sign In
              </button>
            )}
          </div>

        </div>
      </header>

      {/* MOBILE NAVIGATION BAR TABS (SCROLLABLE ROW FOR SMALL DEVICES) */}
      <div className="lg:hidden w-full bg-black/95 backdrop-blur-md border-b border-white/10 overflow-x-auto whitespace-nowrap py-3 px-4 flex items-center gap-2 sticky top-20 z-30">
        {[
          { id: 'home', label: 'Home' },
          { id: 'all-cars', label: 'Catalogue' },
          { id: 'studio-3d', label: '3D Studio' },
          { id: 'compare', label: `Compare (${comparedIds.length})` },
          { id: 'museum', label: 'Museums' },
          { id: 'racing', label: 'Racing' },
          { id: 'news', label: 'News' },
          { id: 'ai-advisor', label: 'AI Concierge' },
          { id: 'contact', label: 'Inquire' },
        ].map((link) => (
          <button
            key={link.id}
            onClick={() => setActiveTab(link.id as any)}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-wider inline-block transition-colors ${
              activeTab === link.id
                ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                : 'text-neutral-400 bg-white/5 border border-white/5 hover:text-white'
            }`}
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* 2. DYNAMIC MAIN CONTENTS TRANSITIONS */}
      <main className="w-full">
        
        {/* TAB: HOME */}
        {activeTab === 'home' && (
          <div id="home-tab-container" className="animate-fade-in">
            {/* Fullscreen interactive particle Hero */}
            <Hero 
              onEnterShowroom={() => setActiveTab('all-cars')} 
              onEnterAdviser={() => setActiveTab('ai-advisor')} 
            />

            {/* Featured Showcase Lineup (Top 3 Modern beasts) */}
            <section id="featured-showcase" className="py-20 px-4 md:px-8 bg-black">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <span className="text-red-500 font-mono text-xs uppercase tracking-widest font-bold block mb-2">
                    Maranello Masterpieces
                  </span>
                  <h2 className="text-3xl md:text-5xl font-sans font-extrabold text-white uppercase tracking-tight">
                    Featured Masterworks
                  </h2>
                  <p className="text-neutral-400 mt-2 max-w-xl mx-auto text-sm">
                    Inspect the absolute crown jewels of our mechanical lineup. Fusing active Formula 1 aerodynamics with hybrid-synergy powerplants.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...ferrariModels]
                    .sort((a, b) => b.year - a.year)
                    .slice(0, 3)
                    .map((car) => (
                      <CarCard
                        key={car.id}
                        car={car}
                        isFavorited={favoritedIds.includes(car.id)}
                        isCompared={comparedIds.includes(car.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onToggleCompare={handleToggleCompare}
                        onSelectCar={setSelectedCar}
                      />
                    ))}
                </div>
              </div>
            </section>

            {/* Interactive Timeline Chronology */}
            <Timeline onSelectCar={setSelectedCar} />

            {/* Tech & Heritage bento grid */}
            <TechHeritage />
          </div>
        )}

        {/* TAB: ALL CARS CATALOGUE */}
        {activeTab === 'all-cars' && (
          <div id="catalogue-tab-container" className="py-12 px-4 md:px-8 max-w-7xl mx-auto animate-fade-in">
            
            {/* Page Header */}
            <div className="mb-10 text-center md:text-left">
              <span className="text-red-500 font-mono text-xs uppercase tracking-widest font-bold block mb-1">
                The Complete Inventory
              </span>
              <h2 className="text-3xl md:text-5xl font-sans font-extrabold text-white uppercase tracking-tight">
                Maranello Archives
              </h2>
              <p className="text-neutral-400 text-sm mt-1">
                Browse every legendary supercar, hypercar, GT cruiser, classic, and racing machine produced by Ferrari.
              </p>
            </div>

            {/* Controls Bar: Search & Sort */}
            <div className="glass-panel rounded-2xl p-6 mb-10 flex flex-col lg:flex-row gap-6 items-center justify-between">
              
              {/* Search text input */}
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute top-3.5 left-4 w-4 h-4 text-neutral-500" />
                <input
                  id="catalogue-search-input"
                  type="text"
                  placeholder="Search model, engine, year, class (e.g. V12, 1987)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black border border-neutral-900 rounded-xl py-3 pl-12 pr-4 text-xs text-white focus:outline-none focus:border-red-500 placeholder-neutral-600 font-mono"
                />
              </div>

              {/* Selectors Group */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto justify-end">
                
                {/* Buy / Production status selector */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <span className="text-neutral-500 font-mono text-[10px] uppercase tracking-widest flex-shrink-0">
                    BUY STATUS
                  </span>
                  <select
                    id="catalogue-availability-select"
                    value={availabilityFilter}
                    onChange={(e) => setAvailabilityFilter(e.target.value)}
                    className="bg-black text-xs text-neutral-300 font-mono border border-neutral-900 p-3 rounded-xl focus:outline-none focus:border-red-500 w-full sm:w-44"
                  >
                    <option value="All">All Buy Statuses</option>
                    <option value="Available to Order">Available to Order</option>
                    <option value="Upcoming">Upcoming Releases</option>
                    <option value="Sold Out">Limited Edition (Sold Out)</option>
                    <option value="Discontinued">Discontinued Modern</option>
                    <option value="Historical Archive">Museum Classics</option>
                  </select>
                </div>

                {/* Sort parameters selector */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <span className="text-neutral-500 font-mono text-[10px] uppercase tracking-widest flex-shrink-0">
                    SORT BY
                  </span>
                  <select
                    id="catalogue-sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-black text-xs text-neutral-300 font-mono border border-neutral-900 p-3 rounded-xl focus:outline-none focus:border-red-500 w-full sm:w-44"
                  >
                    <option value="year-desc">Latest Production</option>
                    <option value="year-asc">Historical Vintage</option>
                    <option value="hp-desc">Max Output HP</option>
                    <option value="hp-asc">Min Output HP</option>
                    <option value="acc-asc">Fastest 0-100 km/h</option>
                    <option value="price-desc">Highest Valuation</option>
                    <option value="price-asc">Lowest Valuation</option>
                  </select>
                </div>

              </div>

            </div>

            {/* Filter Category Pills */}
            <div className="flex overflow-x-auto whitespace-nowrap gap-2 pb-6 mb-8 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold tracking-wider transition-colors ${
                    categoryFilter === cat
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-neutral-950 hover:bg-neutral-900 text-neutral-400 border border-neutral-900'
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Grid display */}
            {sortedModels.length === 0 ? (
              <div className="text-center py-20 border border-neutral-900 bg-neutral-950/40 rounded-3xl">
                <Info className="w-10 h-10 text-neutral-600 mx-auto mb-4" />
                <h4 className="text-lg font-bold text-white uppercase font-mono">No Models Match</h4>
                <p className="text-neutral-400 text-xs max-w-sm mx-auto mt-1">
                  Adjust your search inputs or try selecting a different Maranello category filter pill above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedModels.map((car) => (
                  <CarCard
                    key={car.id}
                    car={car}
                    isFavorited={favoritedIds.includes(car.id)}
                    isCompared={comparedIds.includes(car.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onToggleCompare={handleToggleCompare}
                    onSelectCar={setSelectedCar}
                  />
                ))}
              </div>
            )}

          </div>
        )}

        {/* TAB: COMPARE CARS GRID */}
        {activeTab === 'compare' && (
          <Compare 
            comparedIds={comparedIds} 
            onToggleCompare={handleToggleCompare} 
            onSelectCar={setSelectedCar} 
          />
        )}

        {/* TAB: FERRARI MUSEUM EXHIBITIONS */}
        {activeTab === 'museum' && (
          <MuseumRacingNews viewType="museum" />
        )}

        {/* TAB: SCUDERIA RACING / F1 DIVISION */}
        {activeTab === 'racing' && (
          <MuseumRacingNews viewType="racing" />
        )}

        {/* TAB: NEWS AND PRESS RELEASES */}
        {activeTab === 'news' && (
          <MuseumRacingNews viewType="news" />
        )}

        {/* TAB: AI-POWERED RECOMMENDATION SERVICE */}
        {activeTab === 'ai-advisor' && (
          <AIRecommend onSelectCar={setSelectedCar} />
        )}

        {/* TAB: ATELIER PRIVATE SHOWROOM CONTACT */}
        {activeTab === 'contact' && (
          <MuseumRacingNews viewType="contact" />
        )}

        {/* TAB: STUDIO 3D CUSTOMIZER & WIND TUNNEL */}
        {activeTab === 'studio-3d' && (
          <div id="studio-3d-tab-container" className="animate-fade-in">
            <Studio3D 
              initialCarId={activeStudioCarId} 
              onBackToCatalogue={() => {
                setActiveTab('all-cars');
                setActiveStudioCarId(undefined);
              }} 
            />
          </div>
        )}

      </main>

      {/* 3. DYNAMIC SPEC DETAIL OVERLAY VIEW PANEL */}
      <AnimatePresence>
        {selectedCar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md overflow-y-auto"
          >
            <CarDetail
              car={selectedCar}
              isFavorited={favoritedIds.includes(selectedCar.id)}
              isCompared={comparedIds.includes(selectedCar.id)}
              onToggleFavorite={handleToggleFavorite}
              onToggleCompare={handleToggleCompare}
              onClose={() => setSelectedCar(null)}
              onSelectCar={setSelectedCar}
              onLaunch3D={(carId) => {
                setActiveStudioCarId(carId);
                setActiveTab('studio-3d');
                setSelectedCar(null);
              }}
              user={user}
              onPromptLogin={() => setShowLoginModal(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. GLOBAL AESTHETIC FOOTER FOOTER */}
      <footer className="w-full bg-black border-t border-neutral-900 py-12 px-6 md:px-8 mt-20 text-neutral-500 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-8 opacity-45">
              <svg className="w-full h-full" viewBox="0 0 100 130">
                <path
                  d="M10,10 C10,10 50,22 50,22 C50,22 90,10 90,10 C90,10 95,50 90,82 C85,110 50,126 50,126 C50,126 15,110 10,82 C5,50 10,10 10,10 Z"
                  fill="#FFEB00"
                  stroke="#000000"
                  strokeWidth="3.5"
                />
                <path
                  d="M11.5,14.5 C11.5,14.5 50,25.8 50,25.8 C50,25.8 88.5,14.5 88.5,14.5 C88.5,14.5 88.5,23.5 88,27 C80,24 50,33 50,33 C50,33 20,24 12,27 C11.5,23.5 11.5,14.5 11.5,14.5 Z"
                  fill="#FFFFFF"
                />
                <path
                  d="M11.5,14.5 C11.5,14.5 37,22 37,22 C37,22 37,30 35,31 C26,28 12,27 12,27 C11.5,23.5 11.5,14.5 11.5,14.5 Z"
                  fill="#10B981"
                />
                <path
                  d="M88.5,14.5 C88.5,14.5 63,22 63,22 C63,22 63,30 65,31 C74,28 88,27 88,27 C88.5,23.5 88.5,14.5 88.5,14.5 Z"
                  fill="#EF4444"
                />
                <path
                  d="M50,100 C47,90 43,85 39,80 C36,76 39,72 41,75 C43,77 47,81 49,76 C51,71 47,62 45,52 C43,44 48,38 55,44 C58,47 56,54 58,59 C60,64 64,59 66,55 C69,50 73,52 71,61 C69,68 66,75 68,82 C70,87 75,82 77,85 C75,92 67,97 64,106 C61,113 58,120 55,124 C54,124 51,105 50,100 Z"
                  fill="#000000"
                />
                <text x="24" y="105" fill="#000000" fontSize="16" fontWeight="bold" fontFamily="Georgia, serif">S</text>
                <text x="64" y="105" fill="#000000" fontSize="16" fontWeight="bold" fontFamily="Georgia, serif">F</text>
              </svg>
            </div>
            <div>
              <p className="text-white font-serif font-bold tracking-widest uppercase">Ferrari Universe</p>
              <p className="text-[10px] mt-0.5 uppercase tracking-widest text-neutral-500">Atmospheric Mechanical Almanac</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 justify-center text-[10px] uppercase tracking-widest text-neutral-600">
            <span>MODENA ENGINE LABS</span>
            <span>•</span>
            <span>MARANELLO FIORANO TELEMETRY</span>
            <span>•</span>
            <span>EST. 1947</span>
          </div>

          <div className="text-center md:text-right text-[10px] text-neutral-600 uppercase">
            <p>© 2026 FERRARI UNIVERSE. NOT AFFILIATED WITH FERRARI S.P.A.</p>
            <p className="mt-1">DEVELOPED WITH GOOGLE GEMINI AI FLUID EMBEDDINGS</p>
          </div>
        </div>
      </footer>

      {/* 5. GORGEOUS FLOATING ATELIER GATEWAY LOGIN MODAL */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="max-w-md w-full"
            >
              <LoginPage 
                onLoginSuccess={handleLoginSuccess}
                onClose={() => setShowLoginModal(false)}
                showCloseButton={true}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
