
import React from 'react';
import { LOCATIONS } from '../constants';
// Import LocationInfo from types.ts instead of constants.ts
import { GameState, LocationInfo } from '../types';

interface Props {
  gameState: GameState;
  onExplore: (location: LocationInfo) => void;
}

const WorldMap: React.FC<Props> = ({ gameState, onExplore }) => {
  return (
    <div className="flex flex-col gap-8 animate-up max-w-2xl mx-auto px-4 py-8">
      <div className="border-l-8 border-black pl-4">
        <h2 className="text-4xl font-black italic tracking-tighter mb-2">地理概览</h2>
        <p className="text-slate-500 text-[16px] font-bold">点击地点消耗一个时段并进行探索</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LOCATIONS.map((loc) => (
          <button
            key={loc.id}
            onClick={() => onExplore(loc)}
            className="group relative flex flex-col items-start p-6 bg-white border-[4px] border-black transition-all active:translate-x-1 active:translate-y-1"
          >
            <div className="flex justify-between w-full mb-3">
              <span className="text-3xl">{loc.icon}</span>
              <span className={`px-2 py-0.5 text-[10px] font-black text-white ${loc.color}`}>区域标记</span>
            </div>
            <h3 className="text-2xl font-black mb-2">{loc.name}</h3>
            <p className="text-[14px] text-slate-500 font-medium leading-snug text-left">{loc.description}</p>
            
            {/* 装饰条 */}
            <div className="absolute bottom-0 left-0 w-0 h-1.5 bg-black transition-all group-hover:w-full"></div>
          </button>
        ))}
      </div>
      
      <div className="mt-8 p-6 border-4 border-dashed border-slate-300">
        <p className="text-[14px] text-slate-400 font-bold leading-relaxed italic text-center">
          "在这座被遗忘的城市里，每个转角都藏着一个可能让你粉身碎骨的秘密。"
        </p>
      </div>
    </div>
  );
};

export default WorldMap;