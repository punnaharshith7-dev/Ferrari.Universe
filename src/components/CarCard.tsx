import React from 'react';
import { FerrariModel } from '../data/ferrariData';
import { Heart, Activity, Flame, Zap, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

interface CarCardProps {
  key?: string;
  car: FerrariModel;
  isFavorited: boolean;
  isCompared: boolean;
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onSelectCar: (car: FerrariModel) => void;
}

export default function CarCard({
  car,
  isFavorited,
  isCompared,
  onToggleFavorite,
  onToggleCompare,
  onSelectCar,
}: CarCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
      className="glass-panel glass-panel-hover rounded-2xl overflow-hidden relative group shadow-xl"
    >
      {/* Laser Red Line Glow Effect */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-600/0 via-red-600 to-red-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

      {/* Heart Wishlist Trigger */}
      <button
        id={`fav-btn-${car.id}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(car.id);
        }}
        className="absolute top-4 right-4 z-20 p-2.5 bg-black/70 backdrop-blur-md rounded-full border border-neutral-800 text-neutral-400 hover:text-red-500 hover:scale-110 transition-all"
        title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            isFavorited ? 'fill-red-500 stroke-red-500 text-red-500' : ''
          }`}
        />
      </button>

      {/* Compare Checkbox Tracker */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <label
          className="flex items-center gap-2 px-3 py-1.5 bg-black/80 backdrop-blur-md border border-neutral-800 rounded-lg cursor-pointer text-[10px] font-mono tracking-wider hover:border-red-500/50 text-neutral-300 select-none"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={isCompared}
            onChange={() => onToggleCompare(car.id)}
            className="w-3.5 h-3.5 rounded bg-neutral-900 border-neutral-700 text-red-600 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-red-600"
          />
          COMPARE
        </label>
      </div>

      {/* Graphic Showcase Image Frame */}
      <div
        className="relative w-full h-48 overflow-hidden bg-neutral-900 cursor-pointer"
        onClick={() => onSelectCar(car)}
      >
        <img
          src={car.images[0]}
          alt={car.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />

        {/* Dynamic Category Tag Overlay */}
        <span className="absolute bottom-3 left-4 px-2.5 py-1 bg-red-600/90 text-white font-mono text-[9px] uppercase tracking-widest rounded">
          {car.category}
        </span>

        {/* Acceleration Stat Badge */}
        <span className="absolute bottom-3 right-4 px-2.5 py-1 bg-neutral-900/90 text-neutral-300 font-mono text-[10px] rounded border border-neutral-800 flex items-center gap-1">
          <Zap className="w-3 h-3 text-yellow-500" />
          {car.zeroToHundred}
        </span>
      </div>

      {/* Car Specs Description Frame */}
      <div className="p-5 flex flex-col justify-between">
        <div className="cursor-pointer" onClick={() => onSelectCar(car)}>
          {/* Year, Name & Availability Badge */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
              Year {car.year}
            </span>
            <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
              car.availability === 'Available to Order' ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40' :
              car.availability === 'Upcoming' ? 'bg-amber-950/60 text-amber-400 border-amber-800/40' :
              car.availability === 'Sold Out' ? 'bg-rose-950/60 text-rose-400 border-rose-800/40' :
              car.availability === 'Discontinued' ? 'bg-neutral-900/80 text-neutral-400 border-neutral-800' :
              'bg-yellow-950/60 text-yellow-500 border-yellow-800/40' // Historical Archive
            }`}>
              {car.availability.toUpperCase()}
            </span>
          </div>
          <h3 className="text-lg font-extrabold text-white uppercase group-hover:text-red-500 transition-colors mt-1.5 leading-tight flex items-center justify-between gap-1">
            {car.name.replace('Ferrari ', '')}
            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 flex-shrink-0" />
          </h3>

          <p className="text-neutral-400 text-xs line-clamp-2 mt-2 leading-relaxed">
            {car.description}
          </p>
        </div>

        {/* Mini stats block */}
        <div className="grid grid-cols-3 gap-2 border-t border-b border-neutral-900 py-3 my-4">
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-[9px] font-mono text-neutral-500 uppercase">HP</span>
            <span className="text-sm font-bold font-mono text-white mt-0.5">{car.horsepower}</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center border-l border-r border-neutral-900">
            <span className="text-[9px] font-mono text-neutral-500 uppercase">Top Speed</span>
            <span className="text-sm font-bold font-mono text-white mt-0.5">{car.topSpeed.split(' ')[0]}</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-[9px] font-mono text-neutral-500 uppercase">Drive</span>
            <span className="text-sm font-bold font-mono text-white mt-0.5">{car.driveType}</span>
          </div>
        </div>

        {/* Price & Primary CTA */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[9px] font-mono text-neutral-500 uppercase">Est. Value</span>
            <span className="text-sm font-bold font-mono text-red-500">{car.price}</span>
          </div>

          <button
            id={`details-btn-${car.id}`}
            onClick={() => onSelectCar(car)}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-800 hover:border-red-500/50 rounded-lg text-xs font-mono font-bold tracking-wider transition-all"
          >
            SPECIFICATIONS
          </button>
        </div>
      </div>
    </motion.div>
  );
}
