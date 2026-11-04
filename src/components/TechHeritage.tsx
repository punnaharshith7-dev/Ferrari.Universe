import React, { useState } from 'react';
import { Zap, Shield, Flame, Activity, Landmark, Trophy, Users, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export default function TechHeritage() {
  const [activeTab, setActiveTab] = useState<'tech' | 'heritage'>('tech');

  const techItems = [
    {
      id: 'hybrid',
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: 'HY-KERS & PHEV Hybrid Systems',
      subtitle: 'Formula 1 Kinetic Energy Recovery',
      description: 'Fusing raw combustion power with instant torque electric drive. Systems like LaFerrari\'s HY-KERS and SF90\'s triple-motor plug-in hybrid system manage intelligent torque vectoring, allowing power curves to break traditional mechanical limits.',
      stats: '1,184+ Total HP output capacity'
    },
    {
      id: 'aero',
      icon: <Flame className="w-6 h-6 text-red-500 animate-pulse" />,
      title: 'Active Dynamic Aerodynamics',
      subtitle: 'S-Ducts & Adaptive Drag Reduction',
      description: 'Airflow is not just bypassed—it is harnessed. Front-channel S-Ducts draw air through the nose to pin the front tires down, while computer-controlled active rear wings dynamically adjust angle to act as both air-brake and low-drag DRS systems.',
      stats: 'Over 1,000 kg downforce at 250 km/h'
    },
    {
      id: 'f1',
      icon: <Activity className="w-6 h-6 text-blue-500" />,
      title: 'F1 Telemetry & Steering Systems',
      subtitle: 'Dynamic Slip Slide Control (eSSC)',
      description: 'Straight from the Scuderia racing rigs. Features like electronic Side Slip Control (SSC) predict and manage lateral slides millisecond-by-millisecond. Drivers adjust parameters directly on the steering wheel using the famous Manettino dial.',
      stats: 'Sub-millisecond sensor feedback loops'
    },
    {
      id: 'engine',
      icon: <Activity className="w-6 h-6 text-orange-500" />,
      title: 'Atmospheric Engine Symphony',
      subtitle: 'V12, V8, and V6 Core Architectures',
      description: 'The physical soul of Maranello. Naturally aspirated screamers that rev up to 9,500 rpm or high-velocity twin-turbocharged powerhouses. Sound resonance tubes channel authentic mechanical engine tones directly into the cabin.',
      stats: 'Acoustic resonance matching to 9,500 RPM'
    }
  ];

  const heritageItems = [
    {
      id: 'enzo',
      icon: <Landmark className="w-6 h-6 text-yellow-500" />,
      title: 'The Enzo Ferrari Creed',
      subtitle: 'Born of Pure Racing Obsession',
      description: '“I have never designed a car to simply be a car. I design cars to dominate racing.” Enzo Ferrari\'s obsessive vision shaped the company from a racing garage in 1929 into the ultimate emblem of luxury. Road cars were originally built only to fund Scuderia races.',
      stats: 'Legacy founded in Maranello, Italy, 1947'
    },
    {
      id: 'racing',
      icon: <Trophy className="w-6 h-6 text-red-500" />,
      title: 'Le Mans & Endurance Triumphs',
      subtitle: 'Dominating 24-Hour World Battles',
      description: 'From early historic sweeps to the historic back-to-back modern victories in the Hypercar class. Ferrari\'s endurance racing programs test structure, thermal tolerance, and raw material efficiency under absolute mechanical pressure.',
      stats: '10x Absolute Le Mans Victories'
    },
    {
      id: 'moments',
      icon: <Users className="w-6 h-6 text-blue-500" />,
      title: 'Legendary Drivers & Dynasties',
      subtitle: 'Schumacher, Lauda, and the Red Tide',
      description: 'Every era has its champions. The legendary mechanical partnership with Michael Schumacher in the 2000s, Niki Lauda\'s analytical triumphs, and today\'s red tide spearheaded by Charles Leclerc. F1 is Ferrari\'s beating heart.',
      stats: '16x F1 Constructors Championships'
    },
    {
      id: 'excellence',
      icon: <Heart className="w-6 h-6 text-orange-500" />,
      title: 'La Nuova Dolce Vita',
      subtitle: 'Luxury, Art, and Craftsmanship',
      description: 'Ferrari represents more than speed—it is high Italian art. Hand-beaten aluminum bodies by Scaglietti, tailor-made bespoke interior leather from Poltrona Frau, and classical flowing grand touring design languages that inspire painters and designers alike.',
      stats: '100% Hand-tailored in Italy'
    }
  ];

  return (
    <div id="tech-heritage-section" className="w-full bg-neutral-950 py-16 px-4 md:px-8 border-t border-neutral-900 relative overflow-hidden">
      {/* Abstract Design shapes background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        
        {/* Toggle Header Tabs */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <span className="text-red-500 font-mono text-xs uppercase tracking-widest font-bold block mb-1">
              Engineering Excellence
            </span>
            <h2 className="text-3xl md:text-5xl font-sans font-extrabold text-white uppercase tracking-tight">
              Maranello Core values
            </h2>
          </div>

          {/* Switch Tab controls */}
          <div className="flex bg-neutral-900 border border-neutral-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('tech')}
              className={`px-6 py-2.5 rounded-lg text-xs font-mono font-bold tracking-widest uppercase transition-all ${
                activeTab === 'tech'
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Technology & Innovation
            </button>
            <button
              onClick={() => setActiveTab('heritage')}
              className={`px-6 py-2.5 rounded-lg text-xs font-mono font-bold tracking-widest uppercase transition-all ${
                activeTab === 'heritage'
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Heritage & History
            </button>
          </div>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(activeTab === 'tech' ? techItems : heritageItems).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="glass-panel glass-panel-hover p-6 rounded-2xl relative overflow-hidden group transition-all duration-300 shadow-xl"
            >
              {/* Highlight red-glow border */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-600/0 via-red-600/0 to-red-600/0 group-hover:from-red-600/10 group-hover:via-red-600 group-hover:to-red-600/10 transition-all duration-500" />
              
              <div className="flex items-start gap-4">
                <div className="p-3.5 bg-neutral-900 rounded-xl border border-neutral-800 group-hover:bg-neutral-800 transition-colors">
                  {item.icon}
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">
                    {item.subtitle}
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-white uppercase mt-1 group-hover:text-red-500 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-neutral-400 text-xs md:text-sm leading-relaxed mt-3">
                    {item.description}
                  </p>

                  {/* High Tech Stat bubble */}
                  <div className="mt-6 inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-900 rounded-lg text-[10px] font-mono text-red-400 border border-neutral-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    {item.stats}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Graphic Footer element */}
        <div className="mt-12 bg-radial-gradient from-red-600/10 via-transparent to-transparent text-center p-8 rounded-3xl border border-neutral-900">
          <p className="text-xs md:text-sm text-neutral-400 font-mono">
            “You don\'t choose a Ferrari. Ferrari chooses you based on your driving soul.” — Scuderia Creed
          </p>
        </div>

      </div>
    </div>
  );
}
