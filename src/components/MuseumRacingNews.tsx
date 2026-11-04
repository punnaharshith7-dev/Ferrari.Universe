import React, { useState } from 'react';
import { Landmark, Trophy, FileText, MapPin, Send, Mail, Phone, Info, Clock, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

interface MuseumRacingNewsProps {
  viewType: 'museum' | 'racing' | 'news' | 'dealerships' | 'contact';
}

export default function MuseumRacingNews({ viewType }: MuseumRacingNewsProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [inquiryType, setInquiryType] = useState('Bespoke Customization');

  // 1. MUSEUM DATA
  const museums = [
    {
      name: 'Museo Ferrari Maranello',
      location: 'Via Dino Ferrari 43, Maranello, Italy',
      hours: '09:30 - 19:00 Daily',
      description: 'The live exhibition of Scuderia racing heritage and road car development. Featuring the Hall of Victories containing the authentic Championship-winning Formula 1 cars, racing trophies, and Enzo Ferrari\'s original office design.',
      highlights: ['Hall of Victories', 'F1 Simulators', 'Hypercars Exhibit', 'Prancing Horse Cafe']
    },
    {
      name: 'Museo Enzo Ferrari Modena',
      location: 'Via Paolo Ferrari 85, Modena, Italy',
      hours: '09:30 - 19:00 Daily',
      description: 'Built around the restored birth house of Enzo Ferrari. A futuristic architectural pavilion showcasing classic grand tourers, high mechanical V12 configurations, and a cinema screening Enzo\'s personal life story.',
      highlights: ['Enzo\'s Birthplace', 'Classic GT Pavilion', 'Engine Museum Hall', 'Interactive Cinema']
    }
  ];

  // 2. RACING & F1 DIVISION DATA
  const f1Stats = [
    { label: 'Constructors Titles', value: '16' },
    { label: 'Drivers Titles', value: '15' },
    { label: 'Grand Prix Wins', value: '245+' },
    { label: 'Podiums', value: '815+' }
  ];

  const f1Drivers = [
    { name: 'Charles Leclerc', number: '16', country: 'Monaco', role: 'Scuderia Driver' },
    { name: 'Lewis Hamilton', number: '44', country: 'United Kingdom', role: 'Scuderia Driver (2025+)' }
  ];

  // 3. NEWS ARTICLES
  const newsArticles = [
    {
      date: 'June 18, 2026',
      title: 'Scuderia Ferrari Secures Historic Victory at 24 Hours of Le Mans',
      category: 'Racing Division',
      excerpt: 'For the fourth consecutive year, Ferrari\'s 499P hypercar dominated the circuit, defeating intense manufacturer battles to claim the absolute crown under severe rainy conditions.',
      source: 'Maranello Press Office'
    },
    {
      date: 'May 10, 2026',
      title: 'Ferrari F80 Sells Out Entire Limited Run Within Hours',
      category: 'Hypercars Launch',
      excerpt: 'The newly unveiled 1184-horsepower hybrid hypercar, limited to 799 bespoke builds, has officially sold out to qualified historic brand collectors globally.',
      source: 'Maserati/Ferrari Group HQ'
    },
    {
      date: 'April 02, 2026',
      title: 'Maranello Unveils Bespoke Tailor-Made Craftsmanship Atelier',
      category: 'Atelier News',
      excerpt: 'A state-of-the-art facility allowing clients to select carbon prepregs, hand-woven Kevlars, and historically sourced vintage leather fibers alongside dedicated personal designers.',
      source: 'Tailor-Made Division'
    }
  ];

  // 4. DEALERSHIPS
  const dealerships = [
    { city: 'Rome', name: 'Ferrari Roma Centro', address: 'Via Bissolati 42, Rome, Italy', phone: '+39 06 422 100' },
    { city: 'Beverly Hills', name: 'Ferrari West Beverly Hills', address: '9372 Wilshire Blvd, Beverly Hills, CA', phone: '+1 (310) 843-2200' },
    { city: 'Monaco', name: 'Ferrari Monaco Garages', address: 'Avenue de la Costa 14, Monte Carlo, Monaco', phone: '+377 97 97 90 00' },
    { city: 'London', name: 'Ferrari HR Owen London', address: '125 Old Brompton Rd, South Kensington, London', phone: '+44 20 7341 6300' },
    { city: 'Tokyo', name: 'Ferrari Cornes Tokyo', address: '3-10-5 Shiba, Minato-ku, Tokyo, Japan', phone: '+81 3 5730 1610' },
    { city: 'Dubai', name: 'Ferrari Al Tayer Motors', address: 'Sheikh Zayed Rd, Dubai, United Arab Emirates', phone: '+971 4 301 1111' }
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div id="museum-racing-news-wrapper" className="w-full bg-black py-16 px-4 md:px-8 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto">
        
        {/* ==================== 1. MUSEUM PAGE ==================== */}
        {viewType === 'museum' && (
          <div id="museum-page">
            <div className="text-center mb-12">
              <span className="text-red-500 font-mono text-xs uppercase tracking-widest font-bold block mb-2">
                Galleria Ferrari
              </span>
              <h2 className="text-3xl md:text-5xl font-sans font-extrabold text-white uppercase tracking-tight">
                The Ferrari Museums
              </h2>
              <p className="text-neutral-400 text-sm max-w-xl mx-auto mt-2">
                Embark on a virtual pilgrimage to Modena and Maranello. Experience the sacred grounds where the legend was forged.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {museums.map((mus, i) => (
                <div key={i} className="glass-panel glass-panel-hover p-6 rounded-2xl relative overflow-hidden shadow-2xl transition-all group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-25 transition-opacity">
                    <Landmark className="w-24 h-24 text-red-500" />
                  </div>

                  <h3 className="text-xl font-bold text-white uppercase font-sans mb-1">{mus.name}</h3>
                  <p className="text-[10px] text-red-500 font-mono tracking-wider flex items-center gap-1.5 mb-4">
                    <MapPin className="w-3.5 h-3.5" />
                    {mus.location}
                  </p>

                  <p className="text-neutral-400 text-xs leading-relaxed mb-6">
                    {mus.description}
                  </p>

                  {/* Exhibits checklist */}
                  <div className="border-t border-neutral-900 pt-4">
                    <h4 className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono mb-2">Permanent Exhibits</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {mus.highlights.map((hl, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-neutral-300">
                          <span className="w-1 h-1 rounded-full bg-red-600" />
                          {hl}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Schedule info block */}
                  <div className="mt-6 flex items-center gap-2 text-xs text-neutral-400 bg-neutral-900 px-3 py-2.5 rounded-lg border border-neutral-800">
                    <Clock className="w-3.5 h-3.5 text-red-500" />
                    Open Today: {mus.hours}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 2. RACING & F1 DIVISION ==================== */}
        {viewType === 'racing' && (
          <div id="racing-page">
            <div className="text-center mb-12">
              <span className="text-red-500 font-mono text-xs uppercase tracking-widest font-bold block mb-2">
                Scuderia Ferrari
              </span>
              <h2 className="text-3xl md:text-5xl font-sans font-extrabold text-white uppercase tracking-tight">
                Racing & F1 Division
              </h2>
              <p className="text-neutral-400 text-sm max-w-xl mx-auto mt-2">
                The only manufacturer to compete in every single Formula 1 World Championship season since its inception in 1950.
              </p>
            </div>

            {/* Stats list */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {f1Stats.map((stat, i) => (
                <div key={i} className="glass-panel p-6 rounded-2xl text-center shadow-xl">
                  <div className="text-3xl md:text-5xl font-mono font-black text-red-600 mb-1">{stat.value}</div>
                  <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Drivers roster */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              
              {/* Drivers card */}
              <div className="glass-panel p-6 rounded-2xl shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white uppercase mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-red-500" />
                    Active Scuderia Roster
                  </h3>
                  
                  <div className="flex flex-col gap-4">
                    {f1Drivers.map((drv, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3.5 bg-black border border-neutral-900 rounded-xl">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-mono font-black text-red-500">#{drv.number}</span>
                          <div>
                            <div className="text-sm font-bold text-white uppercase">{drv.name}</div>
                            <div className="text-[10px] text-neutral-500 font-mono">{drv.role}</div>
                          </div>
                        </div>
                        <span className="text-xs text-neutral-400 font-mono bg-neutral-900 px-2 py-1 rounded">{drv.country}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 border-t border-neutral-900 pt-4 text-xs text-neutral-500 leading-relaxed font-mono">
                  * Scuderia Ferrari HP racing operations are managed directly out of the Gestione Sportiva facilities in Maranello.
                </div>
              </div>

              {/* F1 Engine/PU Highlight */}
              <div className="glass-panel p-6 rounded-2xl shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white uppercase mb-2">
                    F1 Power Unit Architecture
                  </h3>
                  <p className="text-[11px] text-neutral-500 font-mono uppercase tracking-widest mb-4">
                    The hybrid mechanical boundary
                  </p>
                  <p className="text-neutral-400 text-xs leading-relaxed mb-4">
                    The SF-24 power system utilizes an ultra-complex 1.6-litre V6 internal combustion engine matched with high-voltage hybrid generators (MGU-K and MGU-H). Operating at thermal efficiencies exceeding 50%, it produces upwards of 1,000 equivalent horsepower.
                  </p>
                </div>

                <div className="bg-black p-4 rounded-xl border border-neutral-900">
                  <span className="text-[10px] text-red-500 font-mono uppercase tracking-widest block mb-1">Race Fuel Research</span>
                  <p className="text-[11px] text-neutral-300">
                    Collaborating with Shell to build fully sustainable biofuels, targeting 100% greenhouse gas reduction by the upcoming seasons.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================== 3. NEWS PAGE ==================== */}
        {viewType === 'news' && (
          <div id="news-page">
            <div className="text-center mb-12">
              <span className="text-red-500 font-mono text-xs uppercase tracking-widest font-bold block mb-2">
                Maranello Dispatch
              </span>
              <h2 className="text-3xl md:text-5xl font-sans font-extrabold text-white uppercase tracking-tight">
                Latest Ferrari News
              </h2>
              <p className="text-neutral-400 text-sm max-w-xl mx-auto mt-2">
                Keep track of direct press releases, Le Mans hypercar developments, and limited-edition product reveals.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              {newsArticles.map((art, i) => (
                <div key={i} className="glass-panel glass-panel-hover p-6 rounded-2xl transition-all shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 bg-red-600/10 text-red-400 border border-red-500/20 rounded font-mono text-[10px] uppercase tracking-widest w-fit">
                      {art.category}
                    </span>
                    <span className="text-xs text-neutral-500 font-mono">{art.date}</span>
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-white uppercase font-sans mb-2 hover:text-red-500 transition-colors cursor-pointer">
                    {art.title}
                  </h3>

                  <p className="text-neutral-400 text-xs md:text-sm leading-relaxed">
                    {art.excerpt}
                  </p>

                  <div className="border-t border-neutral-900 mt-4 pt-3 flex items-center justify-between text-neutral-500 text-[10px] font-mono">
                    <span>SOURCE: {art.source}</span>
                    <span className="flex items-center gap-1 hover:text-red-500 cursor-pointer">
                      READ FULL RELEASE
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 4. DEALERSHIPS ==================== */}
        {viewType === 'dealerships' && (
          <div id="dealerships-page">
            <div className="text-center mb-12">
              <span className="text-red-500 font-mono text-xs uppercase tracking-widest font-bold block mb-2">
                Bespoke Showrooms
              </span>
              <h2 className="text-3xl md:text-5xl font-sans font-extrabold text-white uppercase tracking-tight">
                Bespoke Dealerships
              </h2>
              <p className="text-neutral-400 text-sm max-w-xl mx-auto mt-2">
                Locate our elite Maranello Atelier networks. Experience personal bespoke consultations globally.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dealerships.map((deal, i) => (
                <div key={i} className="glass-panel glass-panel-hover p-5 rounded-2xl relative shadow-xl transition-all group">
                  <div className="absolute top-4 right-4 text-xs font-mono text-red-500 font-bold tracking-widest">
                    {deal.city.toUpperCase()}
                  </div>

                  <span className="text-[10px] font-mono text-neutral-500 uppercase">Atelier Room</span>
                  <h3 className="text-base font-bold text-white uppercase mt-1 mb-4">{deal.name}</h3>

                  <div className="flex flex-col gap-2 text-xs text-neutral-400 font-mono border-t border-neutral-900 pt-4">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span>{deal.address}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Phone className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span>{deal.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 5. CONTACT INQUIRY ==================== */}
        {viewType === 'contact' && (
          <div id="contact-page">
            <div className="text-center mb-12">
              <span className="text-red-500 font-mono text-xs uppercase tracking-widest font-bold block mb-2">
                Atelier Client Relations
              </span>
              <h2 className="text-3xl md:text-5xl font-sans font-extrabold text-white uppercase tracking-tight">
                Atelier Client Inquiry
              </h2>
              <p className="text-neutral-400 text-sm max-w-xl mx-auto mt-2">
                Submit an inquiry to Maranello or schedule an Atelier consultation.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              
              {/* Left Contact coordinates */}
              <div className="lg:col-span-5 glass-panel rounded-3xl p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white uppercase mb-4">Maranello HQ</h3>
                  <p className="text-neutral-400 text-xs leading-relaxed mb-6">
                    Our master artisans, wind tunnels, and racetrack structures reside at our historic home.
                  </p>

                  <div className="flex flex-col gap-4 text-xs font-mono text-neutral-300">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4.5 h-4.5 text-red-500 flex-shrink-0" />
                      <div>
                        <div className="text-[10px] text-neutral-500 uppercase">Headquarters</div>
                        <p className="text-white mt-0.5">Via Abetone Inferiore 4, Maranello, Italy</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="w-4.5 h-4.5 text-red-500 flex-shrink-0" />
                      <div>
                        <div className="text-[10px] text-neutral-500 uppercase">Telephone</div>
                        <p className="text-white mt-0.5">+39 0536 949 111</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="w-4.5 h-4.5 text-red-500 flex-shrink-0" />
                      <div>
                        <div className="text-[10px] text-neutral-500 uppercase">Special Relations</div>
                        <p className="text-white mt-0.5">atelier@ferrari.corp</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-neutral-900 pt-6 mt-8 flex items-center gap-2 text-xs text-neutral-400">
                  <Info className="w-4.5 h-4.5 text-red-500 flex-shrink-0" />
                  <span>Atelier visits are strictly by scheduled appointment only.</span>
                </div>
              </div>

              {/* Right Inquiry Form */}
              <div className="lg:col-span-7 glass-panel rounded-3xl p-6 md:p-8 relative">
                {formSubmitted ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-neutral-950 rounded-3xl">
                    <Trophy className="w-12 h-12 text-red-500 animate-bounce mb-4" />
                    <h3 className="text-xl font-bold text-white uppercase">Inquiry Registered</h3>
                    <p className="text-neutral-400 text-xs max-w-sm mt-2 leading-relaxed">
                      Your Maranello Atelier consultation dossier has been securely logged. An elite client relations specialist will reach out within 24 working hours.
                    </p>
                    <button
                      onClick={() => setFormSubmitted(false)}
                      className="mt-6 px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 text-xs font-mono font-bold rounded"
                    >
                      New Submission
                    </button>
                  </div>
                ) : null}

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <h3 className="text-lg font-bold text-white uppercase mb-2">Schedule Atelier Consultation</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-[9px] font-mono text-neutral-500 uppercase mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        className="bg-black border border-neutral-900 rounded p-2 text-xs text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[9px] font-mono text-neutral-500 uppercase mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="client@luxury.com"
                        className="bg-black border border-neutral-900 rounded p-2 text-xs text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[9px] font-mono text-neutral-500 uppercase mb-1">Select Inquiry Category</label>
                    <select
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value)}
                      className="bg-black border border-neutral-900 rounded p-2 text-xs text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="Bespoke Customization">Bespoke Tailor-Made Customization</option>
                      <option value="Showroom Private Booking">Showroom Private Appointment</option>
                      <option value="Track Program XX Request">XX Track Development Program</option>
                      <option value="Collector Verification">Historic Car Classiche Verification</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[9px] font-mono text-neutral-500 uppercase mb-1">Personal Message / Requirements</label>
                    <textarea
                      required
                      placeholder="Specify your model interest and custom requirements..."
                      className="bg-black border border-neutral-900 rounded p-2 h-24 text-xs text-white focus:outline-none focus:border-red-500 resize-none font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase tracking-widest font-bold rounded transition-all flex items-center justify-center gap-2 mt-4"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Transmit Inquiry
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
