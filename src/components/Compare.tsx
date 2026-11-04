import React from 'react';
import { FerrariModel, ferrariModels } from '../data/ferrariData';
import { X, Sliders, Trophy, ArrowRight, Info, Plus } from 'lucide-react';
import { motion } from 'motion/react';

interface CompareProps {
  comparedIds: string[];
  onToggleCompare: (id: string) => void;
  onSelectCar: (car: FerrariModel) => void;
}

export default function Compare({ comparedIds, onToggleCompare, onSelectCar }: CompareProps) {
  const selectedCars = ferrariModels.filter((c) => comparedIds.includes(c.id));

  // Determine winners (min or max values) for highlighting
  const maxHorsepower = Math.max(...selectedCars.map((c) => c.horsepower), 0);
  const minZeroToHundred = Math.min(...selectedCars.map((c) => c.zeroToHundredNum), 999);
  const maxTopSpeed = Math.max(...selectedCars.map((c) => c.topSpeedNum), 0);
  const minWeight = Math.min(...selectedCars.map((c) => c.weightNum), 99999);

  const availableToSelect = ferrariModels.filter((c) => !comparedIds.includes(c.id));

  return (
    <div id="ferrari-compare-view" className="w-full bg-black py-12 px-4 md:px-8 border-t border-neutral-900 min-h-[70vh]">
      <div className="max-w-7xl mx-auto">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
          <div>
            <span className="text-red-500 font-mono text-xs uppercase tracking-widest font-bold block mb-1">
              Performance Matching
            </span>
            <h2 className="text-3xl md:text-5xl font-sans font-extrabold text-white uppercase tracking-tight">
              Compare Supercars ({selectedCars.length}/4)
            </h2>
            <p className="text-neutral-400 text-sm max-w-lg mt-1">
              Side-by-side engineering statistics and material specifications. Up to 4 models compared to locate your absolute winner.
            </p>
          </div>

          {selectedCars.length > 0 && (
            <button
              id="clear-comparison-btn"
              onClick={() => selectedCars.forEach((c) => onToggleCompare(c.id))}
              className="px-4 py-2 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 text-xs font-mono font-bold tracking-wider rounded-lg text-neutral-400 hover:text-white transition-all"
            >
              CLEAR COMPARISON
            </button>
          )}
        </div>

        {selectedCars.length === 0 ? (
          /* Empty State */
          <div className="glass-panel border-dashed rounded-3xl p-12 text-center max-w-2xl mx-auto my-10">
            <Sliders className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white uppercase tracking-tight">No Models Selected</h3>
            <p className="text-neutral-400 text-sm mt-2 max-w-sm mx-auto">
              Choose Ferraris from the All Cars gallery, or pick from the recommended quick options below to load the comparative analyzer grid.
            </p>

            {/* Quick selectors list */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {ferrariModels.slice(0, 3).map((car) => (
                <button
                  key={car.id}
                  onClick={() => onToggleCompare(car.id)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-mono rounded-lg text-neutral-300 hover:text-red-500 transition-colors"
                >
                  + Add {car.name.replace('Ferrari ', '')}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Comparison Grid Table */
          <div className="overflow-x-auto rounded-2xl glass-panel shadow-2xl">
            <table className="w-full text-left border-collapse table-fixed min-w-[800px]">
              
              {/* Header: Visual Cards */}
              <thead>
                <tr className="border-b border-neutral-900">
                  <th className="p-6 text-neutral-500 font-mono text-[10px] uppercase tracking-widest w-48 bg-neutral-950">
                    Comparative Specifications
                  </th>
                  {selectedCars.map((car) => (
                    <th key={car.id} className="p-6 align-top relative border-l border-neutral-900 group">
                      {/* Close button */}
                      <button
                        onClick={() => onToggleCompare(car.id)}
                        className="absolute top-4 right-4 p-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-red-500 rounded-full border border-neutral-800 transition-all"
                        title="Remove from comparison"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      {/* Small visual image */}
                      <div className="w-full h-24 rounded-lg overflow-hidden mb-3 border border-neutral-800">
                        <img
                          src={car.images[0]}
                          alt={car.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <span className="text-[9px] font-mono text-neutral-500 uppercase">{car.category}</span>
                      <h4 className="text-sm font-bold text-white uppercase group-hover:text-red-500 transition-colors truncate mt-1">
                        {car.name}
                      </h4>
                      <p className="text-red-500 font-mono text-xs font-bold mt-1">{car.price}</p>
                    </th>
                  ))}

                  {/* Empty comparison slots if < 4 */}
                  {Array.from({ length: Math.max(0, 4 - selectedCars.length) }).map((_, i) => (
                    <th key={`empty-slot-${i}`} className="p-6 align-middle border-l border-neutral-900 bg-neutral-950/20 text-center">
                      <div className="flex flex-col items-center justify-center text-neutral-600 gap-2">
                        <Plus className="w-8 h-8 stroke-[1.5]" />
                        <span className="text-[10px] font-mono uppercase tracking-widest">Add Slot</span>
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              onToggleCompare(e.target.value);
                              e.target.value = '';
                            }
                          }}
                          className="mt-2 bg-neutral-900 text-xs text-neutral-300 font-mono border border-neutral-800 p-1.5 rounded-md focus:outline-none focus:border-red-500 max-w-[130px]"
                        >
                          <option value="">Select Ferrari...</option>
                          {availableToSelect.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name.replace('Ferrari ', '')}
                            </option>
                          ))}
                        </select>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Specs Rows */}
              <tbody className="divide-y divide-neutral-900 text-xs font-mono">
                
                {/* Year */}
                <tr className="hover:bg-neutral-900/30">
                  <td className="p-4 font-bold text-neutral-400 bg-neutral-950">Production Year</td>
                  {selectedCars.map((car) => (
                    <td key={car.id} className="p-4 text-white border-l border-neutral-900">{car.year}</td>
                  ))}
                  {Array.from({ length: 4 - selectedCars.length }).map((_, i) => (
                    <td key={`empty-y-${i}`} className="p-4 border-l border-neutral-900 bg-neutral-950/10" />
                  ))}
                </tr>

                {/* Horsepower */}
                <tr className="hover:bg-neutral-900/30">
                  <td className="p-4 font-bold text-neutral-400 bg-neutral-950">Horsepower</td>
                  {selectedCars.map((car) => {
                    const isWinner = car.horsepower === maxHorsepower && selectedCars.length > 1;
                    return (
                      <td key={car.id} className={`p-4 border-l border-neutral-900 font-semibold ${isWinner ? 'text-yellow-500 font-extrabold' : 'text-neutral-200'}`}>
                        <div className="flex items-center gap-1.5">
                          {car.horsepower} HP
                          {isWinner && <Trophy className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500/20" />}
                        </div>
                      </td>
                    );
                  })}
                  {Array.from({ length: 4 - selectedCars.length }).map((_, i) => (
                    <td key={`empty-hp-${i}`} className="p-4 border-l border-neutral-900 bg-neutral-950/10" />
                  ))}
                </tr>

                {/* 0-100 acceleration */}
                <tr className="hover:bg-neutral-900/30">
                  <td className="p-4 font-bold text-neutral-400 bg-neutral-950">0-100 km/h</td>
                  {selectedCars.map((car) => {
                    const isWinner = car.zeroToHundredNum === minZeroToHundred && selectedCars.length > 1;
                    return (
                      <td key={car.id} className={`p-4 border-l border-neutral-900 font-semibold ${isWinner ? 'text-yellow-500 font-extrabold' : 'text-neutral-200'}`}>
                        <div className="flex items-center gap-1.5">
                          {car.zeroToHundred}
                          {isWinner && <Trophy className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500/20" />}
                        </div>
                      </td>
                    );
                  })}
                  {Array.from({ length: 4 - selectedCars.length }).map((_, i) => (
                    <td key={`empty-0100-${i}`} className="p-4 border-l border-neutral-900 bg-neutral-950/10" />
                  ))}
                </tr>

                {/* Top Speed */}
                <tr className="hover:bg-neutral-900/30">
                  <td className="p-4 font-bold text-neutral-400 bg-neutral-950">Top Speed</td>
                  {selectedCars.map((car) => {
                    const isWinner = car.topSpeedNum === maxTopSpeed && selectedCars.length > 1;
                    return (
                      <td key={car.id} className={`p-4 border-l border-neutral-900 font-semibold ${isWinner ? 'text-yellow-500 font-extrabold' : 'text-neutral-200'}`}>
                        <div className="flex items-center gap-1.5">
                          {car.topSpeed}
                          {isWinner && <Trophy className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500/20" />}
                        </div>
                      </td>
                    );
                  })}
                  {Array.from({ length: 4 - selectedCars.length }).map((_, i) => (
                    <td key={`empty-ts-${i}`} className="p-4 border-l border-neutral-900 bg-neutral-950/10" />
                  ))}
                </tr>

                {/* Weight */}
                <tr className="hover:bg-neutral-900/30">
                  <td className="p-4 font-bold text-neutral-400 bg-neutral-950">Chassis Weight</td>
                  {selectedCars.map((car) => {
                    const isWinner = car.weightNum === minWeight && selectedCars.length > 1;
                    return (
                      <td key={car.id} className={`p-4 border-l border-neutral-900 font-semibold ${isWinner ? 'text-yellow-500 font-extrabold' : 'text-neutral-200'}`}>
                        <div className="flex items-center gap-1.5">
                          {car.weight}
                          {isWinner && <Trophy className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500/20" />}
                        </div>
                      </td>
                    );
                  })}
                  {Array.from({ length: 4 - selectedCars.length }).map((_, i) => (
                    <td key={`empty-w-${i}`} className="p-4 border-l border-neutral-900 bg-neutral-950/10" />
                  ))}
                </tr>

                {/* Engine Architecture */}
                <tr className="hover:bg-neutral-900/30">
                  <td className="p-4 font-bold text-neutral-400 bg-neutral-950 font-sans">Engine Block</td>
                  {selectedCars.map((car) => (
                    <td key={car.id} className="p-4 text-neutral-300 border-l border-neutral-900 text-xs truncate max-w-[200px]" title={car.engine}>
                      {car.engine}
                    </td>
                  ))}
                  {Array.from({ length: 4 - selectedCars.length }).map((_, i) => (
                    <td key={`empty-eng-${i}`} className="p-4 border-l border-neutral-900 bg-neutral-950/10" />
                  ))}
                </tr>

                {/* Torque */}
                <tr className="hover:bg-neutral-900/30">
                  <td className="p-4 font-bold text-neutral-400 bg-neutral-950">Peak Torque</td>
                  {selectedCars.map((car) => (
                    <td key={car.id} className="p-4 text-neutral-300 border-l border-neutral-900 truncate max-w-[200px]" title={car.torque}>{car.torque}</td>
                  ))}
                  {Array.from({ length: 4 - selectedCars.length }).map((_, i) => (
                    <td key={`empty-tq-${i}`} className="p-4 border-l border-neutral-900 bg-neutral-950/10" />
                  ))}
                </tr>

                {/* Transmission */}
                <tr className="hover:bg-neutral-900/30">
                  <td className="p-4 font-bold text-neutral-400 bg-neutral-950">Transmission</td>
                  {selectedCars.map((car) => (
                    <td key={car.id} className="p-4 text-neutral-300 border-l border-neutral-900 truncate max-w-[200px]">{car.transmission}</td>
                  ))}
                  {Array.from({ length: 4 - selectedCars.length }).map((_, i) => (
                    <td key={`empty-trans-${i}`} className="p-4 border-l border-neutral-900 bg-neutral-950/10" />
                  ))}
                </tr>

                {/* Propulsion Fuel Type */}
                <tr className="hover:bg-neutral-900/30">
                  <td className="p-4 font-bold text-neutral-400 bg-neutral-950">Fuel Type</td>
                  {selectedCars.map((car) => (
                    <td key={car.id} className="p-4 border-l border-neutral-900">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        car.fuelType === 'Hybrid'
                          ? 'bg-yellow-500/15 text-yellow-500 border border-yellow-500/30'
                          : car.fuelType === 'Racing Fuel'
                          ? 'bg-blue-500/15 text-blue-500 border border-blue-500/30'
                          : 'bg-red-500/15 text-red-400 border border-red-500/30'
                      }`}>
                        {car.fuelType}
                      </span>
                    </td>
                  ))}
                  {Array.from({ length: 4 - selectedCars.length }).map((_, i) => (
                    <td key={`empty-f-${i}`} className="p-4 border-l border-neutral-900 bg-neutral-950/10" />
                  ))}
                </tr>

                {/* Drive style */}
                <tr className="hover:bg-neutral-900/30">
                  <td className="p-4 font-bold text-neutral-400 bg-neutral-950">Drive Type</td>
                  {selectedCars.map((car) => (
                    <td key={car.id} className="p-4 text-neutral-300 border-l border-neutral-900">{car.driveType}</td>
                  ))}
                  {Array.from({ length: 4 - selectedCars.length }).map((_, i) => (
                    <td key={`empty-dt-${i}`} className="p-4 border-l border-neutral-900 bg-neutral-950/10" />
                  ))}
                </tr>

                {/* Dimensions */}
                <tr className="hover:bg-neutral-900/30">
                  <td className="p-4 font-bold text-neutral-400 bg-neutral-950">Dimensions</td>
                  {selectedCars.map((car) => (
                    <td key={car.id} className="p-4 text-neutral-400 border-l border-neutral-900 text-[10px] truncate max-w-[200px]" title={car.dimensions}>
                      {car.dimensions}
                    </td>
                  ))}
                  {Array.from({ length: 4 - selectedCars.length }).map((_, i) => (
                    <td key={`empty-dim-${i}`} className="p-4 border-l border-neutral-900 bg-neutral-950/10" />
                  ))}
                </tr>

                {/* Production numbers */}
                <tr className="hover:bg-neutral-900/30">
                  <td className="p-4 font-bold text-neutral-400 bg-neutral-950">Availability</td>
                  {selectedCars.map((car) => (
                    <td key={car.id} className="p-4 text-neutral-400 border-l border-neutral-900 text-[10px] truncate max-w-[200px]" title={car.productionNumbers}>
                      {car.productionNumbers}
                    </td>
                  ))}
                  {Array.from({ length: 4 - selectedCars.length }).map((_, i) => (
                    <td key={`empty-prod-${i}`} className="p-4 border-l border-neutral-900 bg-neutral-950/10" />
                  ))}
                </tr>

                {/* Full Spec link CTA */}
                <tr className="hover:bg-neutral-900/30">
                  <td className="p-4 font-bold text-neutral-400 bg-neutral-950">Actions</td>
                  {selectedCars.map((car) => (
                    <td key={car.id} className="p-4 border-l border-neutral-900">
                      <button
                        onClick={() => onSelectCar(car)}
                        className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-red-500 text-[10px] text-white font-mono rounded-md font-bold flex items-center gap-1 tracking-wider"
                      >
                        OPEN FULL VIEW
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  ))}
                  {Array.from({ length: 4 - selectedCars.length }).map((_, i) => (
                    <td key={`empty-act-${i}`} className="p-4 border-l border-neutral-900 bg-neutral-950/10" />
                  ))}
                </tr>

              </tbody>
            </table>
          </div>
        )}

        {/* Small educational helper */}
        <div className="mt-6 flex items-center gap-2 text-xs text-neutral-500 bg-neutral-950 border border-neutral-900 p-4 rounded-xl">
          <Info className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span>Note: Prices are estimates based on latest historical auction metrics or base manufacturer suggested retail pricing (MSRP) where applicable. Performance data recorded at Maranello Fiorano track conditions.</span>
        </div>

      </div>
    </div>
  );
}
