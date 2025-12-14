
import React from 'react';
import { Stats, GameState } from '../types';
import { TIME_LABELS, DAYS_OF_WEEK, AREA_LABELS } from '../constants';
import ArtisticAvatar from './ArtisticAvatar';

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
      <div className="flex flex-col gap-0.5 px-1 min-w-0">
        <div className="flex items-center justify-between text-[7px] sm:text-[9px] font-black">
          <span className="text-slate-400 flex items-center gap-0.5 truncate uppercase tracking-tighter">
            <span className="shrink-0">{icon}</span>
            <span className="hidden xs:inline">{label}</span>
          </span>
          <span className={`${isLow ? 'text-red-600 animate-pulse' : 'text-black'} font-mono ml-0.5`}>
            {Math.round(value)}
          </span>
        </div>
        <div className="h-1 sm:h-1.5 w-full bg-slate-100 border-[1px] border-black overflow-hidden">
          <div className={`h-full ${isLow ? 'bg-red-600' : colorClass} transition-all duration-700`} style={{ width: `${Math.min(100, value)}%` }} />
        </div>
      </div>
    );
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 bg-white border-b-[4px] border-black flex flex-col shadow-xl transition-colors duration-500 ${isTrapped ? 'bg-red-50' : 'bg-white'}`}>
      <div className="flex items-stretch h-24 sm:h-32">
        {/* 头像尺寸固定为 w-24 到 w-32 满足用户对 w30 的视觉要求 */}
        <div className="w-24 sm:w-32 bg-black flex items-center justify-center border-r-[4px] border-black shrink-0 relative p-1 grain-overlay">
           <ArtisticAvatar className="w-full h-full grayscale border-2 border-white/20" />
           {isTrapped && <div className="absolute inset-0 bg-red-600/30 animate-pulse z-20"></div>}
           <div className="absolute bottom-1 right-1 bg-white text-black text-[6px] sm:text-[8px] font-black px-1 border border-black z-30">ARCHIVE_M</div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-3 sm:px-4 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
             <div className="flex items-center gap-2">
                <span className="bg-black text-white px-1.5 py-0.5 text-[8px] sm:text-[10px] font-black italic">D-{day}</span>
                <span className="text-[11px] sm:text-sm font-black text-blue-800 uppercase tracking-tighter">{TIME_LABELS[timeOfDay]} ({dayOfWeek})</span>
             </div>
             <div className={`text-[8px] sm:text-[10px] font-black truncate tracking-tight ${isTrapped ? 'text-red-600' : 'text-slate-400'}`}>
                {AREA_LABELS[currentArea]}
             </div>
          </div>
          <div className="flex flex-col gap-0.5">
             <div className="flex items-baseline gap-1">
               <span className="text-[8px] font-black text-slate-400 uppercase">LOCATION:</span>
               <span className="text-[12px] sm:text-[16px] font-black text-black italic truncate leading-none">{location}</span>
             </div>
             <div className="flex items-baseline gap-1 mt-1">
               <span className="text-[8px] font-black text-slate-400">¥</span>
               <span className="text-lg sm:text-2xl font-mono font-black italic text-amber-700 leading-none">{stats.money}</span>
             </div>
          </div>
        </div>

        <button onClick={onMenuOpen} className="w-12 sm:w-16 bg-white border-l-[4px] border-black flex flex-col items-center justify-center gap-1.5 active:bg-black group shrink-0 transition-colors">
          <div className="w-5 sm:w-6 h-1 bg-black group-active:bg-white"></div>
          <div className="w-5 sm:w-6 h-1 bg-black group-active:bg-white"></div>
          <div className="w-5 sm:w-6 h-1 bg-black group-active:bg-white"></div>
        </button>
      </div>

      {/* 指标栏 - 移动端响应式，间距缩小 */}
      <div className="grid grid-cols-5 gap-0.5 border-t-[2px] border-black bg-white p-1 sm:p-2">
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
