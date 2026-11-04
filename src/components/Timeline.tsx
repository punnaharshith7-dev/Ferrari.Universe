import React, { useState } from 'react';
import { ferrariModels, FerrariModel } from '../data/ferrariData';
import { Calendar, Award, Hourglass, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface TimelineProps {
  onSelectCar: (car: FerrariModel) => void;
}

export default function Timeline({ onSelectCar }: TimelineProps) {
  // Sort models by year ascending
  const sortedModels = [...ferrariModels].sort((a, b) => a.year - b.year);
  const [activeId, setActiveId] = useState<string>(sortedModels[0]?.id || '');

  const activeCar = sortedModels.find((c) => c.id === activeId);

  return (
    <div id="ferrari-timeline-view" className="w-full bg-black py-16 px-4 md:px-8 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Title */}
        <div className="text-center mb-16">
          <span className="text-red-500 font-mono text-xs uppercase tracking-widest font-bold block mb-2">
            Maranello Chronology
          </span>
          <h2 className="text-3xl md:text-5xl font-sans font-extrabold text-white uppercase tracking-tight">
            The Historical Timeline
          </h2>
          <p className="text-neutral-400 mt-2 max-w-xl mx-auto text-sm">
            Experience the evolution of speed, power, and design. Select an era below to reveal the engineering milestones that defined generations.
          </p>
        </div>

        {/* Layout: Interactive Decades bar, then details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: Axis of Years (Vertical Navigation) */}
          <div className="lg:col-span-4 glass-panel rounded-2xl p-6 relative">
            <div className="absolute top-0 bottom-0 left-10 w-0.5 bg-neutral-800" />
            
            <div className="flex flex-col gap-6 relative z-10">
              {sortedModels.map((car) => {
                const isActive = car.id === activeId;
                return (
                  <button
                    key={car.id}
                    onClick={() => setActiveId(car.id)}
                    className="flex items-center gap-4 text-left group focus:outline-none"
                  >
                    {/* Glowing Bullet point */}
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      isActive 
                        ? 'bg-red-600 border-red-500 shadow-lg shadow-red-600/50 scale-110' 
                        : 'bg-neutral-950 border-neutral-800 group-hover:border-red-500/50'
                    }`}>
                      <div className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-white' : 'bg-neutral-700'}`} />
                    </div>

                    {/* Year & Name */}
                    <div>
                      <span className={`font-mono text-sm font-bold block transition-colors duration-300 ${isActive ? 'text-red-500' : 'text-neutral-500 group-hover:text-neutral-300'}`}>
                        {car.year}
                      </span>
                      <span className={`text-xs font-sans block truncate max-w-[200px] transition-colors duration-300 ${isActive ? 'text-white font-semibold' : 'text-neutral-400 group-hover:text-neutral-200'}`}>
                        {car.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Immersive Era Detail Panel */}
          <div className="lg:col-span-8">
            {activeCar && (
              <motion.div
                key={activeCar.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-panel rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl"
              >
                {/* Background watermarked Year */}
                <div className="absolute top-4 right-6 font-mono text-[9rem] font-black text-white/[0.02] leading-none select-none pointer-events-none">
                  {activeCar.year}
                </div>

                {/* Main Visual Image frame with luxury border */}
                <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8 border border-neutral-800 group">
                  <img
                    src={activeCar.images[0]}
                    alt={activeCar.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                  
                  {/* Category overlay */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 bg-red-600/90 text-white font-mono text-[10px] uppercase tracking-widest rounded-md">
                      {activeCar.category}
                    </span>
                    <span className="px-3 py-1 bg-black/80 text-neutral-300 border border-neutral-800 font-mono text-[10px] rounded-md">
                      {activeCar.price} Value
                    </span>
                  </div>
                </div>

                {/* Technical milestone badge */}
                <div className="flex flex-wrap items-center gap-4 mb-4 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-neutral-400 bg-neutral-900 px-3 py-1.5 rounded-md border border-neutral-800">
                    <Calendar className="w-3.5 h-3.5 text-red-500" />
                    Era of {activeCar.year}
                  </span>
                  <span className="flex items-center gap-1.5 text-neutral-400 bg-neutral-900 px-3 py-1.5 rounded-md border border-neutral-800">
                    <Hourglass className="w-3.5 h-3.5 text-red-500" />
                    {activeCar.horsepower} HP output
                  </span>
                  <span className="flex items-center gap-1.5 text-neutral-400 bg-neutral-900 px-3 py-1.5 rounded-md border border-neutral-800">
                    <Award className="w-3.5 h-3.5 text-red-500" />
                    {activeCar.zeroToHundred} (0-100 km/h)
                  </span>
                </div>

                {/* Description */}
                <h3 className="text-2xl md:text-3xl font-extrabold text-white font-sans uppercase mb-4 tracking-tight">
                  {activeCar.name}
                </h3>
                
                <p className="text-neutral-300 text-sm md:text-base leading-relaxed mb-6">
                  {activeCar.description}
                </p>

                {/* Historical context block */}
                <div className="border-l-2 border-red-600 pl-4 py-1 mb-8 bg-neutral-900/40 pr-3 rounded-r-lg">
                  <h4 className="text-xs font-mono font-bold text-red-500 uppercase tracking-wider mb-1">
                    Historical Milestones & Heritage
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {activeCar.history}
                  </p>
                </div>

                {/* CTA buttons */}
                <div className="flex items-center justify-between gap-4 pt-4 border-t border-neutral-900">
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono">Engine Type</span>
                    <span className="text-xs text-neutral-300 font-mono truncate max-w-[200px] md:max-w-none">{activeCar.engine}</span>
                  </div>

                  <button
                    onClick={() => onSelectCar(activeCar)}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase tracking-widest font-bold rounded-md transition-all duration-300 flex items-center gap-1.5 hover:translate-x-1"
                  >
                    View Specifications
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </motion.div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
