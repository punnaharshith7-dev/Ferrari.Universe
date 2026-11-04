import React, { useState, useEffect } from 'react';
import { FerrariModel, ferrariModels } from '../data/ferrariData';
import EngineSound from './EngineSound';
import { X, Sliders, Heart, Info, ChevronRight, Zap, Flame, Compass, ChevronLeft, Volume2, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CarDetailProps {
  car: FerrariModel;
  isFavorited: boolean;
  isCompared: boolean;
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onClose: () => void;
  onSelectCar: (car: FerrariModel) => void;
  onLaunch3D?: (id: string) => void;
  user?: { name: string; email: string; picture?: string } | null;
  onPromptLogin?: () => void;
}

export default function CarDetail({
  car,
  isFavorited,
  isCompared,
  onToggleFavorite,
  onToggleCompare,
  onClose,
  onSelectCar,
  onLaunch3D,
  user = null,
  onPromptLogin,
}: CarDetailProps) {
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [perspectiveAngle, setPerspectiveAngle] = useState(180); // 360 viewer angle simulation slider (0 to 360)

  // Inquiry and customization states
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [selectedPaint, setSelectedPaint] = useState('Rosso Corsa');
  const [selectedLeather, setSelectedLeather] = useState('Cuoio');
  const [selectedWheel, setSelectedWheel] = useState('Forged Diamond Cut');
  const [selectedCaliper, setSelectedCaliper] = useState('Rosso');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientNotes, setClientNotes] = useState('');

  // Auto-fill or clear contact information based on user session
  useEffect(() => {
    if (user) {
      setClientName(user.name);
      setClientEmail(user.email);
    } else {
      setClientName('');
      setClientEmail('');
    }
  }, [user]);

  const relatedCars = ferrariModels
    .filter((c) => c.category === car.category && c.id !== car.id)
    .slice(0, 3);

  // Helper for 360 simulated rotation styling (moves the image background horizontally!)
  const simulatedRotateStyle = {
    transform: `rotateY(${(perspectiveAngle - 180) * 0.4}deg) scale(1.02)`,
    transition: 'transform 0.1s ease-out',
  };

  // Generate mock Dyno data for the SVG chart based on engine hp
  const dynoPoints = Array.from({ length: 9 }).map((_, i) => {
    const rpm = 1000 + i * 1000;
    const hpRatio = Math.sin((i / 8) * (Math.PI / 1.5)) * 0.95 + 0.05;
    const calculatedHp = Math.round(car.horsepower * Math.min(1, Math.max(0.1, hpRatio)));
    return { rpm, hp: calculatedHp };
  });

  // Calculate coordinates for the SVG dyno curve
  const chartWidth = 500;
  const chartHeight = 150;
  const svgPath = dynoPoints
    .map((p, idx) => {
      const x = (idx / 8) * chartWidth;
      const y = chartHeight - (p.hp / car.horsepower) * (chartHeight - 20) - 10;
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <div id="car-detail-fullscreen-overlay" className="fixed inset-0 z-50 bg-black/95 overflow-y-auto overflow-x-hidden p-4 md:p-8 flex justify-center">
      <div className="max-w-6xl w-full glass-panel rounded-3xl overflow-hidden relative shadow-2xl h-fit">
        
        {/* TOP FLOATING NAVIGATION BAR */}
        <div className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-none">
          {/* Back button */}
          <button
            onClick={onClose}
            className="p-3 bg-black/80 hover:bg-neutral-900 backdrop-blur-md border border-neutral-800 rounded-full text-neutral-300 hover:text-white transition-all hover:scale-105 pointer-events-auto"
            title="Close details"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Quick buttons */}
          <div className="flex items-center gap-3 pointer-events-auto">
            {/* Favorite toggle */}
            <button
              onClick={() => onToggleFavorite(car.id)}
              className="p-3 bg-black/80 hover:bg-neutral-900 backdrop-blur-md border border-neutral-800 rounded-full text-neutral-300 hover:text-red-500 transition-all hover:scale-105"
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500 stroke-red-500 text-red-500' : ''}`} />
            </button>

            {/* Compare toggle */}
            <button
              onClick={() => onToggleCompare(car.id)}
              className={`px-4 py-2.5 backdrop-blur-md border rounded-xl text-xs font-mono font-bold tracking-widest transition-all ${
                isCompared
                  ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-500/30'
                  : 'bg-black/80 hover:bg-neutral-900 border-neutral-800 text-neutral-300'
              }`}
            >
              {isCompared ? 'COMPARING' : 'ADD TO COMPARE'}
            </button>
          </div>
        </div>

        {/* 1. HERO SHOWCASE (FULLSCREEN GALLERY & 360 VIEWER) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 bg-black">
          
          {/* Main Visual Carousel with simulated 3D perspectives */}
          <div className="lg:col-span-8 relative h-[350px] md:h-[500px] flex items-center justify-center p-6 overflow-hidden bg-radial-gradient from-neutral-900 to-black">
            <div className="absolute inset-0 bg-radial-gradient from-red-600/5 via-transparent to-transparent opacity-60 pointer-events-none" />

            {/* 3D simulated perspective image wrapper */}
            <div style={{ perspective: '1000px' }} className="w-full h-full flex items-center justify-center">
              <img
                src={car.images[activeImgIdx]}
                alt={car.name}
                style={simulatedRotateStyle}
                className="max-h-[85%] max-w-[90%] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Simulated 360 Rotator Control Overlay */}
            <div className="absolute bottom-6 left-6 right-6 bg-black/75 backdrop-blur-md border border-neutral-800 p-4 rounded-xl flex flex-col xl:flex-row items-center gap-4 justify-between">
              <div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">Interactive</span>
                <span className="text-xs text-white font-mono font-bold uppercase">360° Perspective Visualizer</span>
              </div>

              {/* Angle Slider */}
              <div className="flex-1 max-w-xs flex items-center gap-3 w-full">
                <span className="text-[10px] text-neutral-500 font-mono">0°</span>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={perspectiveAngle}
                  onChange={(e) => setPerspectiveAngle(Number(e.target.value))}
                  className="w-full accent-red-600 bg-neutral-800 rounded-lg appearance-none h-1.5 cursor-pointer"
                />
                <span className="text-[10px] text-neutral-500 font-mono">360°</span>
              </div>

              {/* Interactive 3D Studio Launcher */}
              <button
                onClick={() => onLaunch3D && onLaunch3D(car.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-mono text-[10px] font-black tracking-widest uppercase rounded-lg shadow-lg shadow-red-600/30 transition-all hover:scale-105 cursor-pointer pointer-events-auto"
              >
                Launch 3D Studio & Aero Tunnel
              </button>
            </div>
          </div>

          {/* Side Gallery Thumbnails */}
          <div className="lg:col-span-4 p-4 md:p-6 glass-panel border-0 border-l border-white/5 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto h-auto lg:h-[500px]">
            {car.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveImgIdx(idx);
                  setPerspectiveAngle(180); // Reset simulation angle on photo change
                }}
                className={`relative w-28 lg:w-full h-16 lg:h-28 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                  idx === activeImgIdx ? 'border-red-600 scale-[0.98]' : 'border-neutral-900 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>

        </div>

        {/* 2. SPECIFICATIONS CORE METADATA */}
        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Technical Specs Details */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="text-red-500 font-mono text-xs uppercase tracking-widest font-bold block mb-1">
                {car.category} Lineage
              </span>
              <h2 className="text-3xl md:text-5xl font-sans font-extrabold text-white uppercase tracking-tight">
                {car.name}
              </h2>
              <p className="text-neutral-400 mt-3 text-sm leading-relaxed font-light">
                {car.description}
              </p>
            </div>

            {/* Core specifications grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-b border-neutral-900 py-6">
              {[
                { label: 'Engine Configuration', val: car.engine },
                { label: 'Total Horsepower', val: `${car.horsepower} HP` },
                { label: 'Peak Torque', val: car.torque },
                { label: 'Top Speed Capacity', val: car.topSpeed },
                { label: '0-100 km/h acceleration', val: car.zeroToHundred },
                { label: 'Transmission System', val: car.transmission },
                { label: 'Chassis Curb Weight', val: car.weight },
                { label: 'Propulsion Fuel', val: car.fuelType },
                { label: 'Drive Layout', val: car.driveType },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col text-left">
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">{item.label}</span>
                  <span className="text-sm font-mono text-white font-bold mt-1 truncate" title={item.val}>{item.val}</span>
                </div>
              ))}
            </div>

            {/* Custom SVG Power-curve chart */}
            <div className="glass-panel p-5 rounded-2xl">
              <span className="text-red-500 font-mono text-[10px] uppercase tracking-widest block mb-2">
                Engine Telemetry Dyno Curve
              </span>
              <h4 className="text-sm font-bold text-white uppercase font-sans mb-4">Horsepower Curve vs. RPM</h4>
              
              <div className="w-full overflow-hidden">
                <svg viewBox="0 0 500 150" className="w-full h-36">
                  {/* Grid Lines */}
                  <line x1="0" y1="130" x2="500" y2="130" stroke="#1c1917" strokeWidth="1" />
                  <line x1="0" y1="80" x2="500" y2="80" stroke="#1c1917" strokeWidth="1" />
                  <line x1="0" y1="30" x2="500" y2="30" stroke="#1c1917" strokeWidth="1" />

                  {/* Dyno Curve Path */}
                  <path d={svgPath} fill="none" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />

                  {/* Redline zone */}
                  <rect x="440" y="10" width="60" height="130" fill="rgba(239, 68, 68, 0.08)" />

                  {/* Points with text */}
                  {dynoPoints.map((p, idx) => {
                    const x = (idx / 8) * chartWidth;
                    const y = chartHeight - (p.hp / car.horsepower) * (chartHeight - 20) - 10;
                    if (idx % 2 === 0) {
                      return (
                        <g key={idx}>
                          <circle cx={x} cy={y} r="4" fill="#ffffff" stroke="#ef4444" strokeWidth="2" />
                          <text x={x} y={y - 10} fill="#78716c" fontSize="9" fontFamily="monospace" textAnchor="middle">
                            {p.hp}hp
                          </text>
                          <text x={x} y="145" fill="#44403c" fontSize="8" fontFamily="monospace" textAnchor="middle">
                            {p.rpm}
                          </text>
                        </g>
                      );
                    }
                    return null;
                  })}
                </svg>
              </div>
            </div>

            {/* Custom Features lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Interior */}
              <div className="p-5 glass-panel rounded-2xl">
                <h4 className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-widest mb-3">Interior Comforts</h4>
                <div className="space-y-2">
                  {car.interiorFeatures.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-neutral-400 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* Exterior */}
              <div className="p-5 glass-panel rounded-2xl">
                <h4 className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-widest mb-3">Exterior Materials</h4>
                <div className="space-y-2">
                  {car.exteriorFeatures.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-neutral-400 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. RIGHT SIDEBAR: ACOUSTIC SYNTH & PRICE BREAKDOWN */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Real-time Web Audio Synthesizer */}
            <EngineSound
              modelName={car.name.replace('Ferrari ', '')}
              idleFreq={car.idleFreq}
              maxFreq={car.soundFreq}
              hasExhaustFlame={car.exhaustFlame}
            />

            {/* Production Status & Ordering Card */}
            <div className="glass-panel p-6 rounded-2xl shadow-xl border-l-4 border-red-600">
              <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Maranello Production Status</span>
              
              {car.availability === 'Available to Order' && (
                <div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <h4 className="text-sm font-bold text-emerald-400 uppercase font-mono">ACTIVE SERIES PRODUCTION</h4>
                  </div>
                  <p className="text-neutral-400 text-xs mt-2 leading-relaxed">
                    This model is currently built-to-order at the Maranello factory. Custom configuration options are fully open for luxury tailoring.
                  </p>
                  <div className="mt-4 p-3 bg-neutral-950 rounded-xl border border-neutral-900 flex flex-col gap-2">
                    <div className="flex justify-between text-[11px] font-mono text-neutral-500">
                      <span>Maranello Allocation</span>
                      <span className="text-emerald-400 font-bold">Open (9-12 mo wait)</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-mono text-neutral-500">
                      <span>Tailor Made Customizing</span>
                      <span className="text-white">Full Access</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      if (!user && onPromptLogin) {
                        onPromptLogin();
                        return;
                      }
                      setInquirySubmitted(false);
                      setShowInquiryForm(true);
                    }}
                    className="w-full mt-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[11px] font-black tracking-widest uppercase rounded-lg shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    Configure & Order
                  </button>
                </div>
              )}

              {car.availability === 'Upcoming' && (
                <div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                    <h4 className="text-sm font-bold text-amber-400 uppercase font-mono">UPCOMING RELEASE</h4>
                  </div>
                  <p className="text-neutral-400 text-xs mt-2 leading-relaxed">
                    This hypercar model represents the absolute peak of future design. Factory slots are highly restricted to legacy collectors.
                  </p>
                  <div className="mt-4 p-3 bg-neutral-950 rounded-xl border border-neutral-900 flex flex-col gap-2">
                    <div className="flex justify-between text-[11px] font-mono text-neutral-500">
                      <span>Factory Slots</span>
                      <span className="text-amber-400 font-bold">Allocation Restricted</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      if (!user && onPromptLogin) {
                        onPromptLogin();
                        return;
                      }
                      setInquirySubmitted(false);
                      setShowInquiryForm(true);
                    }}
                    className="w-full mt-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-black font-mono text-[11px] font-black tracking-widest uppercase rounded-lg shadow-lg shadow-amber-600/20 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    Atelier Allocation Request
                  </button>
                </div>
              )}

              {car.availability === 'Sold Out' && (
                <div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                    <h4 className="text-sm font-bold text-rose-400 uppercase font-mono">LIMITED SERIES - SOLD OUT</h4>
                  </div>
                  <p className="text-neutral-400 text-xs mt-2 leading-relaxed">
                    Factory production slots for this limited series have been fully allocated. Sourcing available through pre-owned channels.
                  </p>
                  <div className="mt-4 p-3 bg-neutral-950 rounded-xl border border-neutral-900 flex flex-col gap-2">
                    <div className="flex justify-between text-[11px] font-mono text-neutral-500">
                      <span>Total Production</span>
                      <span className="text-white">{car.productionNumbers}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-mono text-neutral-500">
                      <span>Secondary Market Sourcing</span>
                      <span className="text-rose-400 font-bold">Available</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      if (!user && onPromptLogin) {
                        onPromptLogin();
                        return;
                      }
                      setInquirySubmitted(false);
                      setShowInquiryForm(true);
                    }}
                    className="w-full mt-4 py-2.5 bg-rose-950/80 hover:bg-rose-900/80 text-rose-300 border border-rose-800/40 font-mono text-[11px] font-black tracking-widest uppercase rounded-lg transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    Ferrari Approved Registry Search
                  </button>
                </div>
              )}

              {car.availability === 'Discontinued' && (
                <div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-neutral-500"></span>
                    <h4 className="text-sm font-bold text-neutral-400 uppercase font-mono">PRODUCTION CONCLUDED</h4>
                  </div>
                  <p className="text-neutral-400 text-xs mt-2 leading-relaxed">
                    This modern masterpiece has completed its planned production cycle. Sourcing can be brokered through certified luxury networks.
                  </p>
                  <button 
                    onClick={() => {
                      if (!user && onPromptLogin) {
                        onPromptLogin();
                        return;
                      }
                      setInquirySubmitted(false);
                      setShowInquiryForm(true);
                    }}
                    className="w-full mt-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 font-mono text-[11px] font-black tracking-widest uppercase rounded-lg transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    Brokerage Intake Form
                  </button>
                </div>
              )}

              {car.availability === 'Historical Archive' && (
                <div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-yellow-400/50 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                    </span>
                    <h4 className="text-sm font-bold text-yellow-500 uppercase font-mono">HISTORICAL CLASSIC ARCHIVE</h4>
                  </div>
                  <p className="text-neutral-400 text-xs mt-2 leading-relaxed">
                    A rare, historical legacy treasure. Classic Ferraris are premium museum assets, traded privately or via auction houses.
                  </p>
                  <div className="mt-4 p-3 bg-neutral-950 rounded-xl border border-neutral-900 flex flex-col gap-2">
                    <div className="flex justify-between text-[11px] font-mono text-neutral-500">
                      <span>Total Units Built</span>
                      <span className="text-white">{car.productionNumbers}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-mono text-neutral-500">
                      <span>Ferrari Classiche Certification</span>
                      <span className="text-yellow-500">Eligible</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      if (!user && onPromptLogin) {
                        onPromptLogin();
                        return;
                      }
                      setInquirySubmitted(false);
                      setShowInquiryForm(true);
                    }}
                    className="w-full mt-4 py-2.5 bg-yellow-950/60 hover:bg-yellow-900/60 text-yellow-400 border border-yellow-800/30 font-mono text-[11px] font-black tracking-widest uppercase rounded-lg transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    Consignment & Acquisition Desk
                  </button>
                </div>
              )}
            </div>

            {/* Pricing Matrix */}
            <div className="glass-panel p-6 rounded-2xl shadow-xl">
              <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Maranello Cost Estimate</span>
              <h4 className="text-base font-bold text-white uppercase mb-4">Value Breakdown</h4>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Base Manufacturer Price (MSRP)</span>
                  <span className="text-white font-bold">{car.price}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Tailor-Made Customization Accents</span>
                  <span className="text-white font-bold">Included</span>
                </div>
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Carbon-Fiber Aerodynamic Pack</span>
                  <span className="text-white font-bold">Included</span>
                </div>
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Logistics & Maranello PDI Fee</span>
                  <span className="text-white font-bold">$4,500</span>
                </div>
                <div className="border-t border-neutral-900 pt-3 flex items-center justify-between text-sm">
                  <span className="text-neutral-300 font-bold">Target Est. Acquisition Value</span>
                  <span className="text-red-500 font-black">{car.price}</span>
                </div>
              </div>
            </div>

            {/* Related Models List */}
            {relatedCars.length > 0 && (
              <div className="glass-panel p-6 rounded-2xl shadow-xl">
                <h4 className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-widest mb-4">Related {car.category}</h4>
                <div className="flex flex-col gap-3">
                  {relatedCars.map((rc) => (
                    <div
                      key={rc.id}
                      onClick={() => {
                        onSelectCar(rc);
                        setActiveImgIdx(0);
                      }}
                      className="flex items-center gap-3 p-2 bg-black hover:bg-neutral-900 border border-neutral-900 hover:border-neutral-800 rounded-xl cursor-pointer transition-colors"
                    >
                      <img
                        src={rc.images[0]}
                        alt={rc.name}
                        className="w-16 h-12 rounded-lg object-cover border border-neutral-900 flex-shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <span className="text-[9px] font-mono text-neutral-500 uppercase block">Year {rc.year}</span>
                        <p className="text-xs font-bold text-white uppercase truncate mt-0.5">{rc.name.replace('Ferrari ', '')}</p>
                        <span className="text-red-500 font-mono text-[10px] block mt-0.5">{rc.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* INTERACTIVE TAILOR-MADE CUSTOMIZATION & ALLOCATION INQUIRY FORM */}
        <AnimatePresence>
          {showInquiryForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 z-50 overflow-y-auto p-6 flex items-center justify-center"
            >
              <div className="max-w-xl w-full bg-neutral-950 border border-neutral-900 rounded-3xl p-6 md:p-8 relative shadow-2xl my-8">
                {/* Close Button */}
                <button
                  onClick={() => setShowInquiryForm(false)}
                  className="absolute top-4 right-4 p-2.5 bg-neutral-900 hover:bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                {!inquirySubmitted ? (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!clientName || !clientEmail) {
                      alert('Please provide your name and email to proceed with the Maranello inquiry.');
                      return;
                    }
                    setInquirySubmitted(true);
                  }} className="space-y-6">
                    <div>
                      <span className="text-red-500 font-mono text-xs uppercase tracking-widest font-bold block mb-1">
                        Ferrari Atelier Configurator
                      </span>
                      <h3 className="text-2xl font-extrabold text-white uppercase tracking-tight">
                        Tailor-Made Commission
                      </h3>
                      <p className="text-neutral-400 text-xs mt-1">
                        Specify your bespoke selections for the legendary <span className="text-white font-bold">{car.name}</span>.
                      </p>
                    </div>

                    {/* Paint Selection */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block font-bold">Bespoke Exterior Paint Color</label>
                      <div className="grid grid-cols-5 gap-2">
                        {[
                          { name: 'Rosso Corsa', color: 'bg-red-600' },
                          { name: 'Giallo Modena', color: 'bg-yellow-400' },
                          { name: 'Nero Aldebaran', color: 'bg-neutral-950 border border-neutral-800' },
                          { name: 'Bianco Avus', color: 'bg-white' },
                          { name: 'Grigio Silverstone', color: 'bg-stone-500' },
                        ].map((paint) => (
                          <button
                            key={paint.name}
                            type="button"
                            onClick={() => setSelectedPaint(paint.name)}
                            className={`flex flex-col items-center gap-1.5 p-1 rounded-xl border transition-all cursor-pointer ${
                              selectedPaint === paint.name ? 'border-red-500 bg-red-950/20' : 'border-neutral-900 bg-neutral-950 hover:bg-neutral-900/40'
                            }`}
                          >
                            <span className={`w-6 h-6 rounded-full ${paint.color}`} />
                            <span className="text-[8px] font-mono text-neutral-500 text-center leading-none truncate w-full">{paint.name.split(' ')[0]}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Leather Selection */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block font-bold">Bespoke Interior Leather Trim</label>
                      <div className="grid grid-cols-4 gap-2">
                        {['Cuoio (Classic Tan)', 'Nero (Deep Black)', 'Rosso (Sport Red)', 'Sabia (Luxury Sand)'].map((leather) => (
                          <button
                            key={leather}
                            type="button"
                            onClick={() => setSelectedLeather(leather)}
                            className={`px-2 py-2 rounded-xl border text-[9px] font-mono text-center transition-all cursor-pointer ${
                              selectedLeather === leather ? 'border-red-500 bg-red-950/20 text-white' : 'border-neutral-900 bg-neutral-950 text-neutral-500 hover:text-neutral-300'
                            }`}
                          >
                            {leather.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Wheels & Calipers */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block font-bold">Wheel Style</label>
                        <select
                          value={selectedWheel}
                          onChange={(e) => setSelectedWheel(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                        >
                          <option value="Forged Diamond Cut">Forged Diamond Cut</option>
                          <option value="Carbon Fiber Wheels">Carbon Fiber Composite</option>
                          <option value="Classic Spoke Alloys">Classic Spoke Alloys</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block font-bold">Brake Calipers</label>
                        <select
                          value={selectedCaliper}
                          onChange={(e) => setSelectedCaliper(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                        >
                          <option value="Rosso">Rosso (Sport Red)</option>
                          <option value="Giallo">Giallo (Modena Yellow)</option>
                          <option value="Nero">Nero (Carbon Black)</option>
                          <option value="Alluminio">Alluminio (Classic Silver)</option>
                        </select>
                      </div>
                    </div>

                    {/* Client Contact Info */}
                    <div className="space-y-4 pt-2 border-t border-neutral-900">
                      <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block font-bold">Client Credentials</label>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <input
                            type="text"
                            placeholder="Full Name"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            required
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <input
                            type="email"
                            placeholder="Email Address"
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                            required
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <textarea
                          placeholder="Special Requests (e.g. carbon upgrades, private track delivery, vintage tribute paint code...)"
                          rows={2}
                          value={clientNotes}
                          onChange={(e) => setClientNotes(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono resize-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-black tracking-widest uppercase rounded-xl shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      Submit Atelier Request
                    </button>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6 space-y-6"
                  >
                    <div className="w-16 h-16 bg-red-600/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto text-red-500 animate-pulse">
                      <Compass className="w-8 h-8" />
                    </div>

                    <div>
                      <h4 className="text-xl font-extrabold text-white uppercase font-mono tracking-tight">COMMISSION SUBMITTED</h4>
                      <p className="text-neutral-400 text-xs mt-2 max-w-sm mx-auto leading-relaxed">
                        Gratitude for your inquiry. A private Maranello Atelier Concierge will contact you at <span className="text-white font-mono font-bold">{clientEmail}</span> within 24 hours to review your configuration and reservation queue allocation.
                      </p>
                    </div>

                    {/* Summary of Configuration */}
                    <div className="p-4 bg-neutral-900 rounded-2xl text-left border border-neutral-800 space-y-2 max-w-sm mx-auto">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase block border-b border-neutral-800 pb-1.5 mb-1.5 font-bold">Your Custom Configuration</span>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-neutral-400">Model:</span>
                        <span className="text-white font-bold uppercase">{car.name.replace('Ferrari ', '')}</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-neutral-400">Exterior Paint:</span>
                        <span className="text-red-500 font-bold">{selectedPaint}</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-neutral-400">Cabin Leather:</span>
                        <span className="text-white">{selectedLeather}</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-neutral-400">Wheel Choice:</span>
                        <span className="text-white">{selectedWheel}</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-neutral-400">Brake Calipers:</span>
                        <span className="text-white">{selectedCaliper}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowInquiryForm(false)}
                      className="px-6 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-mono text-xs rounded-xl border border-neutral-800 transition-colors cursor-pointer"
                    >
                      Return to Showcase
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
