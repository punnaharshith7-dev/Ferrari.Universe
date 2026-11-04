import React, { useState } from 'react';
import { ferrariModels, FerrariModel } from '../data/ferrariData';
import { Sparkles, HelpCircle, ArrowRight, RefreshCw, Send, Lock, Compass, Clipboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AIRecommendProps {
  onSelectCar: (car: FerrariModel) => void;
}

export default function AIRecommend({ onSelectCar }: AIRecommendProps) {
  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState<string>('Unlimited');
  const [lifestyle, setLifestyle] = useState<string>('Weekend GT Cruising');
  const [preference, setPreference] = useState<string>('Pure screaming V12');
  const [narrative, setNarrative] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Result state
  const [result, setResult] = useState<{
    recommendedModelId: string;
    reasoning: string;
    alternativeIds: string[];
  } | null>(null);

  const loadingStatuses = [
    'Igniting Maranello simulation servers...',
    'Analyzing power-to-weight coefficients...',
    'Tuning exhaust sound frequencies to your lifestyle...',
    'Calculating downforce vectors on Fiorano tracks...',
    'Assembling carbon monocoque configurations...',
    'Sealing letter from Scuderia head concierge...',
  ];

  const handleRunRecommendation = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    
    // Cycle loading statuses
    let currentIdx = 0;
    setLoadingStatus(loadingStatuses[0]);
    const statusInterval = setInterval(() => {
      currentIdx = (currentIdx + 1) % loadingStatuses.length;
      setLoadingStatus(loadingStatuses[currentIdx]);
    }, 1500);

    // Prepare car list to feed the context so the model doesn't hallucinate non-existent models
    const carModelsList = ferrariModels.map((c) => ({
      id: c.id,
      name: c.name,
      year: c.year,
      price: c.price,
      horsepower: c.horsepower,
      category: c.category,
      description: c.description,
    }));

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          budget,
          lifestyle,
          preference,
          description: narrative || 'I desire the ultimate Scuderia performance experience.',
          carModelsList,
        }),
      });

      clearInterval(statusInterval);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || errData.details || 'Database connection error.');
      }

      const data = await response.json();
      setResult(data);
      setStep(5); // Show results page
    } catch (err: any) {
      clearInterval(statusInterval);
      setErrorMsg(err.message || 'Maranello lookup failed. Please verify API configurations.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setBudget('Unlimited');
    setLifestyle('Weekend GT Cruising');
    setPreference('Pure screaming V12');
    setNarrative('');
    setResult(null);
    setErrorMsg(null);
  };

  // Get matching objects
  const recommendedCar = ferrariModels.find((c) => c.id === result?.recommendedModelId);
  const alternativeCars = ferrariModels.filter((c) => result?.alternativeIds?.includes(c.id));

  return (
    <div id="ai-advisor-section" className="w-full bg-black py-16 px-4 md:px-8 border-t border-neutral-900 relative">
      <div className="absolute inset-0 bg-radial-gradient from-red-600/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto">
        
        {/* Header Title */}
        <div className="text-center mb-12">
          <span className="text-red-500 font-mono text-xs uppercase tracking-widest font-bold block mb-2">
            Artificial Intelligence Advisor
          </span>
          <h2 className="text-3xl md:text-5xl font-sans font-extrabold text-white uppercase tracking-tight">
            Maranello AI Concierge
          </h2>
          <p className="text-neutral-400 mt-2 max-w-xl mx-auto text-sm">
            Engage the server-side intelligence framework. Specify your lifestyle dynamics to receive an authentic, personalized recommendation.
          </p>
        </div>

        {/* Error Warning */}
        {errorMsg && (
          <div className="mb-8 p-4 bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-start gap-3">
            <Lock className="w-5 h-5 flex-shrink-0 text-red-500" />
            <div>
              <p className="font-bold uppercase tracking-wider">Service Limitation Alert</p>
              <p className="mt-1">{errorMsg}</p>
              <p className="mt-2 text-neutral-400">
                To enable real server-side AI, configure your <code className="text-red-300 font-mono">GEMINI_API_KEY</code> within the <strong>Settings &gt; Secrets</strong> pane in the Google AI Studio UI.
              </p>
            </div>
          </div>
        )}

        {/* LOADING ANIMATION */}
        {isLoading ? (
          <div className="glass-panel rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
            <RefreshCw className="w-12 h-12 text-red-500 animate-spin mb-6" />
            <h4 className="text-lg font-mono font-bold text-white uppercase tracking-wider">
              Analyzing Specifications
            </h4>
            
            {/* Dynamic Status update lines */}
            <p className="text-neutral-400 text-sm mt-2 max-w-sm animate-pulse">
              {loadingStatus}
            </p>

            <div className="w-48 h-1 bg-neutral-900 rounded-full mt-8 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-infinite-loading" style={{ width: '50%' }} />
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* STEP 1: BUDGET */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="glass-panel p-8 rounded-3xl"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-red-600/20 text-red-500 font-mono text-xs font-bold flex items-center justify-center">1</span>
                  <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest">Financial Parameter</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight mb-6">
                  What is your targeted financial acquisition scope?
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Under $350,000', value: 'Under $350,000', desc: 'Entry-level entry supercars (e.g. Roma, 296 GTB)' },
                    { label: 'Under $600,000', value: 'Under $600,000', desc: 'High-end V12 and hybrid models (e.g. 12Cilindri, SF90)' },
                    { label: 'Under $3,000,000', value: 'Under $3,000,000', desc: 'Limited series and Icona collectible cars (e.g. Daytona SP3)' },
                    { label: 'Unlimited / Collector Spec', value: 'Unlimited', desc: 'Ultimate hypercars and racing heritage (e.g. F80, SF-24)' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setBudget(opt.value)}
                      className={`p-5 rounded-xl border text-left transition-all ${
                        budget === opt.value
                          ? 'bg-red-950/20 border-red-500 shadow-lg shadow-red-500/5'
                          : 'bg-black border-neutral-900 hover:border-neutral-700'
                      }`}
                    >
                      <div className="font-bold text-white text-sm uppercase">{opt.label}</div>
                      <div className="text-[11px] text-neutral-500 mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-lg flex items-center gap-1.5 transition-transform hover:translate-x-1"
                  >
                    Next Phase
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: LIFESTYLE */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="glass-panel p-8 rounded-3xl"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-red-600/20 text-red-500 font-mono text-xs font-bold flex items-center justify-center">2</span>
                  <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest">Driving Environment</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight mb-6">
                  What is your primary mechanical intent and lifestyle use?
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Weekend GT Grand Touring', value: 'Weekend GT Cruising', desc: 'Long luxury coastlines, luggage space, maximum comfort.' },
                    { label: 'Fiorano Track Weaponry', value: 'Fiorano Track Weaponry', desc: 'Braking G-forces, lap telemetry, slick tyres, raw adrenaline.' },
                    { label: 'Monaco Daily Commuter', value: 'Monaco Daily Commuter', desc: 'City street usability, modern driving assists, hybrid efficiency.' },
                    { label: 'Climate & Active SUV Comfort', value: 'Climate SUV Comfort', desc: 'All-wheel drive, four doors, elevated perspective, high utility.' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setLifestyle(opt.value)}
                      className={`p-5 rounded-xl border text-left transition-all ${
                        lifestyle === opt.value
                          ? 'bg-red-950/20 border-red-500 shadow-lg shadow-red-500/5'
                          : 'bg-black border-neutral-900 hover:border-neutral-700'
                      }`}
                    >
                      <div className="font-bold text-white text-sm uppercase">{opt.label}</div>
                      <div className="text-[11px] text-neutral-500 mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => setStep(1)}
                    className="px-5 py-3 text-neutral-400 hover:text-white font-mono text-xs font-bold uppercase tracking-widest"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-lg flex items-center gap-1.5 transition-transform hover:translate-x-1"
                  >
                    Next Phase
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: PROPULSION */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="glass-panel p-8 rounded-3xl"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-red-600/20 text-red-500 font-mono text-xs font-bold flex items-center justify-center">3</span>
                  <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest">Powertrain Preference</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight mb-6">
                  What is your acoustic & engineering preference?
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Pure Screaming Naturally-Aspirated V12', value: 'Pure screaming V12', desc: 'No turbochargers. Classic high mechanical pitch symphony.' },
                    { label: 'High Velocity Twin-Turbo V8', value: 'Twin-Turbo V8', desc: 'Explosive mid-range torque, loud whistles, heavy acceleration.' },
                    { label: 'Next-Gen Formula 1 Hybrid Synergy', value: 'Next-Gen Hybrid Synergy', desc: 'Silent battery starts, electric front vectoring, insane 1000+ HP.' },
                    { label: 'Open-Air Convertible / Spider', value: 'Open-Air Spider', desc: 'Unobstructed engine roar directly behind your head.' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setPreference(opt.value)}
                      className={`p-5 rounded-xl border text-left transition-all ${
                        preference === opt.value
                          ? 'bg-red-950/20 border-red-500 shadow-lg shadow-red-500/5'
                          : 'bg-black border-neutral-900 hover:border-neutral-700'
                      }`}
                    >
                      <div className="font-bold text-white text-sm uppercase">{opt.label}</div>
                      <div className="text-[11px] text-neutral-500 mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => setStep(2)}
                    className="px-5 py-3 text-neutral-400 hover:text-white font-mono text-xs font-bold uppercase tracking-widest"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-lg flex items-center gap-1.5 transition-transform hover:translate-x-1"
                  >
                    Next Phase
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: NARRATIVE DESCRIPTION */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="glass-panel p-8 rounded-3xl"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-red-600/20 text-red-500 font-mono text-xs font-bold flex items-center justify-center">4</span>
                  <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest">Personal Narrative</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight mb-2">
                  Describe your ideal driving dreamscape.
                </h3>
                <p className="text-xs text-neutral-400 mb-6">
                  Provide custom guidance. Express how you want the throttle response to feel, where you plan to showcase the car, or your collectors preference.
                </p>

                <textarea
                  value={narrative}
                  onChange={(e) => setNarrative(e.target.value)}
                  placeholder="e.g., I want an extreme track monster that has racing heritage, sounds high-pitched, is highly collectible, but occasionally allows an open-sky driving experience."
                  className="w-full h-32 bg-black border border-neutral-900 rounded-xl p-4 text-sm text-neutral-200 focus:outline-none focus:border-red-500 placeholder-neutral-600 resize-none font-sans"
                  maxLength={500}
                />

                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => setStep(3)}
                    className="px-5 py-3 text-neutral-400 hover:text-white font-mono text-xs font-bold uppercase tracking-widest"
                  >
                    Go Back
                  </button>
                  <button
                    id="submit-ai-recom-btn"
                    onClick={handleRunRecommendation}
                    className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 transition-transform hover:scale-[1.02] shadow-lg shadow-red-600/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Consult Advisor
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 5: RESULTS DISPLAY */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                {/* Left side: Golden advisory letter */}
                <div className="lg:col-span-7 glass-panel border border-amber-500/20 p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-2xl">
                  {/* Decorative stamp shadow */}
                  <div className="absolute top-6 right-6 w-16 h-16 rounded-full border border-amber-500/20 flex items-center justify-center text-[10px] font-mono text-amber-500/20 rotate-12 select-none">
                    SEALED AT MARANELLO
                  </div>

                  <span className="text-amber-500 font-mono text-[10px] uppercase tracking-widest block mb-1">
                    Confidential Client Advisory
                  </span>
                  <h4 className="text-xl font-bold text-white uppercase font-sans tracking-tight mb-6 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    Concierge Dossier
                  </h4>

                  {/* Letter content with calligraphic slant */}
                  <div className="font-serif italic text-neutral-300 text-sm md:text-base leading-relaxed space-y-4 pr-4 border-l-2 border-amber-500/20 pl-4 py-2">
                    {result?.reasoning.split('\n\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>

                  {/* Gold sealed signature */}
                  <div className="mt-8 pt-6 border-t border-neutral-900 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-neutral-500 block font-mono">ADVISOR SIGNATURE</span>
                      <span className="font-serif italic text-amber-500 text-sm">Direzione Clienti Speciali</span>
                    </div>

                    <button
                      onClick={resetForm}
                      className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-mono font-bold text-neutral-300 hover:text-white rounded-lg transition-colors"
                    >
                      New Consultation
                    </button>
                  </div>
                </div>

                {/* Right side: Primary Recommendation Card & Alternatives */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  
                  {/* Recommended Car display */}
                  {recommendedCar && (
                    <div className="glass-panel rounded-3xl p-5 shadow-xl relative overflow-hidden group">
                      <div className="absolute top-4 right-4 px-2 py-1 bg-amber-500/20 text-amber-400 font-mono text-[9px] uppercase tracking-widest rounded border border-amber-500/30">
                        Primary Match
                      </div>

                      <div className="w-full h-40 rounded-2xl overflow-hidden mb-4 border border-neutral-900">
                        <img
                          src={recommendedCar.images[0]}
                          alt={recommendedCar.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <span className="text-[10px] font-mono text-neutral-500 uppercase">Year {recommendedCar.year}</span>
                      <h5 className="text-lg font-bold text-white uppercase mt-0.5">{recommendedCar.name}</h5>
                      <p className="text-red-500 font-mono text-sm font-bold mt-1">{recommendedCar.price}</p>

                      <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] font-mono border-t border-b border-neutral-900 py-3 mb-4">
                        <div className="text-neutral-400">Power: <span className="text-white font-bold">{recommendedCar.horsepower} HP</span></div>
                        <div className="text-neutral-400 text-right">0-100: <span className="text-white font-bold">{recommendedCar.zeroToHundred}</span></div>
                      </div>

                      <button
                        onClick={() => onSelectCar(recommendedCar)}
                        className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase tracking-widest font-bold rounded-xl transition-all"
                      >
                        Inspect Specifications
                      </button>
                    </div>
                  )}

                  {/* Alternative runners-up */}
                  {alternativeCars.length > 0 && (
                    <div className="glass-panel rounded-3xl p-5">
                      <h6 className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-3">
                        Alternative Runner-ups
                      </h6>
                      
                      <div className="flex flex-col gap-3">
                        {alternativeCars.map((altCar) => (
                          <div
                            key={altCar.id}
                            onClick={() => onSelectCar(altCar)}
                            className="flex items-center gap-3 p-2 bg-black hover:bg-neutral-900 border border-neutral-900 hover:border-neutral-800 rounded-xl cursor-pointer transition-colors"
                          >
                            <img
                              src={altCar.images[0]}
                              alt={altCar.name}
                              className="w-16 h-12 rounded-lg object-cover border border-neutral-900 flex-shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-[9px] font-mono text-neutral-500 uppercase">Year {altCar.year}</span>
                              <p className="text-xs font-bold text-white uppercase truncate mt-0.5">{altCar.name}</p>
                              <span className="text-[10px] text-red-500 font-mono">{altCar.price}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

      </div>
    </div>
  );
}
