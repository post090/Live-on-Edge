
import React from 'react';
import { Stats, GameState } from '../types.ts';
import { TIME_LABELS, DAYS_OF_WEEK, AREA_LABELS } from '../constants.ts';
import ArtisticAvatar from './ArtisticAvatar.tsx';

interface Props {
  gameState: GameState;
  onMenuOpen: () => void;
}

const StatusBar: React.FC<Props> = ({ gameState, onMenuOpen }) => {
  const { stats, day, timeOfDay, location, isTrapped, currentArea } = gameState;
  const dayOfWeek = DAYS_OF_WEEK[(day - 1) % 7];

  const StatItem = ({ label, icon, value, colorClass, lowThreshold = 20 }: { label: string, icon: string, value: number, colorClass: string, lowThreshold?: number }) => {
    const isLow = value <= lowThreshold;
    return (
      <div className="flex flex-col gap-1 px-1 min-w-0">
        <div className="flex items-center justify-between text-[8px] font-black">
          <span className="text-slate-400 flex items-center gap-0.5 truncate uppercase tracking-tighter">
            <span className="shrink-0">{icon}</span>
            <span className="hidden xs:inline">{label}</span>
          </span>
          <span className={`${isLow ? 'text-red-600 animate-pulse' : 'text-black'} font-mono ml-0.5`}>
            {Math.round(value)}
          </span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 border-[1px] border-black">
          <div className={`h-full ${isLow ? 'bg-red-600' : colorClass} transition-all duration-700`} style={{ width: `${Math.min(100, value)}%` }} />
        </div>
      </div>
    );
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 bg-white border-b-[4px] border-black flex flex-col shadow-xl transition-colors duration-500 ${isTrapped ? 'bg-red-50' : 'bg-white'}`}>
      <div className="flex items-stretch h-14 sm:h-16">
        {/* 头像容器进一步缩小至 w-14 */}
        <div className="w-14 sm:w-16 bg-black flex items-center justify-center border-r-[4px] border-black shrink-0 relative p-1">
           <ArtisticAvatar className="w-full h-full grayscale border-2 border-white/10" />
           {isTrapped && <div className="absolute inset-0 bg-red-600/30 animate-pulse"></div>}
        </div>

        <div className="flex-1 flex flex-col justify-center px-3 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
             <div className="flex items-center gap-1.5">
                <span className="bg-black text-white px-1 py-0.5 text-[7px] font-black italic leading-none">D-{day} ({dayOfWeek})</span>
                <span className="text-[10px] font-black text-blue-800 uppercase">{TIME_LABELS[timeOfDay]}</span>
             </div>
             <div className={`text-[8px] font-black truncate text-right tracking-tight ${isTrapped ? 'text-red-600' : 'text-slate-400'}`}>
                {AREA_LABELS[currentArea]}
             </div>
          </div>
          <div className="flex items-center justify-between">
             <div className="flex items-baseline gap-1">
               <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">LOC:</span>
               <span className="text-[11px] font-black text-black italic truncate max-w-[150px]">{location}</span>
             </div>
             <div className="flex items-baseline gap-1">
               <span className="text-[8px] font-black text-slate-400">¥</span>
               <span className="text-sm font-mono font-black italic text-amber-700">{stats.money}</span>
             </div>
          </div>
        </div>

        <button onClick={onMenuOpen} className="w-10 sm:w-12 bg-white border-l-[4px] border-black flex flex-col items-center justify-center gap-1 active:bg-black group shrink-0 transition-colors">
          <div className="w-4 h-0.5 bg-black group-active:bg-white"></div>
          <div className="w-4 h-0.5 bg-black group-active:bg-white"></div>
          <div className="w-4 h-0.5 bg-black group-active:bg-white"></div>
        </button>
      </div>

      <div className="grid grid-cols-5 gap-0.5 border-t-[1px] border-black bg-white p-0.5">
        <StatItem label="饱腹" icon="◒" value={stats.satiety} colorClass="bg-orange-500" />
        <StatItem label="整洁" icon="🧼" value={stats.hygiene} colorClass="bg-sky-400" />
        <StatItem label="精神" icon="🧠" value={stats.mood} colorClass="bg-indigo-500" />
        <StatItem label="学业" icon="📚" value={stats.academic} colorClass="bg-emerald-500" />
        <StatItem label="社会" icon="⛓" value={stats.corruption} colorClass="bg-red-600" lowThreshold={0} />
      </div>
    </div>
  );
};

export default StatusBar;
