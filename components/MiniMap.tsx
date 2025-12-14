
import React from 'react';
import { LOCATIONS, DAYS_OF_WEEK, AREA_LABELS } from '../constants';
// Correctly import LocationInfo from types.ts
import { LocationInfo } from '../types';

interface Props {
  currentLocation: string;
  onSelect: (location: LocationInfo) => void;
  isTrapped: boolean;
  day: number;
  currentArea: 'MINING_TOWN' | 'PROVINCIAL_CAPITAL' | 'BORDER_TOWN';
}

const MiniMap: React.FC<Props> = ({ currentLocation, onSelect, isTrapped, day, currentArea }) => {
  const dayOfWeek = DAYS_OF_WEEK[(day - 1) % 7];
  
  // 仅显示当前区域的地点，除非是在困境中
  const availableLocations = LOCATIONS.filter(l => 
    l.area === currentArea && (!l.isTrap || (isTrapped && l.name === currentLocation))
  );

  return (
    <div className="w-full bg-slate-50 border-y-[6px] border-black p-6 select-none relative">
      {isTrapped && (
        <div className="absolute inset-0 bg-red-900/10 backdrop-blur-[2px] z-0 pointer-events-none"></div>
      )}
      
      <div className="flex items-center justify-between mb-6 px-2 relative z-10">
        <div className="flex flex-col">
          <h3 className="text-[16px] font-black text-black italic tracking-tighter uppercase">{AREA_LABELS[currentArea]}</h3>
          <span className="text-[9px] font-black text-slate-400 mt-1 uppercase tracking-widest">
            Date Trace: {dayOfWeek} • {isTrapped ? 'LOCKED' : 'ACTIVE'}
          </span>
        </div>
        <div className={`w-3 h-3 rounded-full ${isTrapped ? 'bg-red-600 animate-ping' : 'bg-emerald-500 animate-pulse'}`}></div>
      </div>
      
      <div className="grid grid-cols-2 xs:grid-cols-4 gap-3 relative z-10">
        {availableLocations.map((loc) => {
          const isCurrent = currentLocation === loc.name;
          const isDisabled = isTrapped && !isCurrent;
          
          return (
            <button
              key={loc.id}
              onClick={() => !isDisabled && onSelect(loc)}
              disabled={isDisabled}
              className={`
                relative flex flex-col items-center justify-center p-3 border-[4px] transition-all
                ${isCurrent 
                  ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]' 
                  : isDisabled
                    ? 'bg-slate-200 text-slate-400 border-slate-300 opacity-40 grayscale cursor-not-allowed'
                    : 'bg-white text-black border-slate-200 hover:border-black active:translate-