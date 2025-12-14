import React from 'react';
import { LOCATIONS, DAYS_OF_WEEK, AREA_LABELS } from '../constants';
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
  
  const availableLocations = LOCATIONS.filter(l => 
    l.area === currentArea && (!l.isTrap || (isTrapped && l.name === currentLocation))
  );

  return (
    <div className="w-full bg-slate-50 border-y-[4px] border-black p-4 select-none relative">
      {isTrapped && (
        <div className="absolute inset-0 bg-red-900/10 backdrop-blur-[2px] z-0 pointer-events-none"></div>
      )}
      
      <div className="flex items-center justify-between mb-3 px-2 relative z-10">
        <div className="flex flex-col">
          <h3 className="text-[12px] font-black text-black italic tracking-tighter uppercase leading-none">{AREA_LABELS[currentArea]}</h3>
          <span className="text-[7px] font-black text-slate-400 mt-0.5 uppercase tracking-widest leading-none">
            当前状态: {isTrapped ? '限制移动' : '自由探索'}
          </span>
        </div>
        <div className={`w-2 h-2 rounded-full ${isTrapped ? 'bg-red-600 animate-ping' : 'bg-emerald-500 animate-pulse'}`}></div>
      </div>
      
      <div className="grid grid-cols-2 xs:grid-cols-4 gap-2 relative z-10">
        {availableLocations.map((loc) => {
          const isCurrent = currentLocation === loc.name;
          const isDisabled = isTrapped && !isCurrent;
          
          return (
            <button
              key={loc.id}
              onClick={() => !isDisabled && onSelect(loc)}
              disabled={isDisabled}
              className={`
                relative flex flex-col items-center justify-center p-2 border-[3px] transition-all
                ${isCurrent 
                  ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]' 
                  : isDisabled
                    ? 'bg-slate-200 text-slate-400 border-slate-300 opacity-40 grayscale cursor-not-allowed'
                    : 'bg-white text-black border-slate-200 hover:border-black active:translate-y-0.5'}
              `}
            >
              <span className="text-xl mb-0.5">{loc.icon}</span>
              <span className="text-[8px] font-black whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                {loc.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MiniMap;