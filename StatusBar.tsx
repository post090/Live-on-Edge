
import React from 'react';
import { Stats, GameState, Attributes } from './types';
import { TIME_LABELS, DAYS_OF_WEEK } from './constants';
import ArtisticAvatar from './components/ArtisticAvatar';

interface Props {
  gameState: GameState;
  onMenuOpen: () => void;
  onPhoneOpen: () => void;
}

const StatusBar: React.FC<Props> = ({ gameState, onMenuOpen, onPhoneOpen }) => {
  const { stats, attributes, day, timeOfDay, location, isTrapped, phone } = gameState;
  const dayOfWeek = DAYS_OF_WEEK[(day - 1) % 7];
  const timeLabel = TIME_LABELS[timeOfDay];
  const unreadMessages = phone.messages.filter(m => !m.isRead).length;

  const predictedScore = Math.min(750, Math.floor(stats.academic * 2.0 + stats.intelligence * 12 - stats.corruption * 0.8));
  
  let tierLabel = "无缘大学";
  let tierColor = "bg-red-800";
  if (predictedScore >= 620) { tierLabel = "重点本科"; tierColor = "bg-emerald-700"; }
  else if (predictedScore >= 480) { tierLabel = "普通本科"; tierColor = "bg-blue-800"; }
  else if (predictedScore >= 320) { tierLabel = "专科预备"; tierColor = "bg-amber-700"; }

  const StatProgress = ({ label, value, colorClass }: { label: string, value: number, colorClass: string }) => (
    <div className="flex flex-col gap-0.5 w-full">
      <div className="flex justify-between items-center px-0.5">
        <span className="text-[7px] font-black uppercase tracking-tighter text-slate-400">{label}</span>
        <span className="text-[8px] font-mono font-black">{Math.round(value)}</span>
      </div>
      <div className="h-1 bg-black/10 relative overflow-hidden border border-black/5">
        <div 
          className={`absolute inset-y-0 left-0 ${colorClass} transition-all duration-500`}
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
    </div>
  );

  const AttrTag = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="flex flex-col items-center justify-center px-1 sm:px-2 min-w-[32px] sm:min-w-[48px]">
      <span className="text-[5px] font-black text-slate-400 uppercase leading-none mb-0.5">{label}</span>
      <span className={`text-[12px] sm:text-[14px] font-mono font-black italic ${color}`}>{Math.round(value)}</span>
    </div>
  );

  // 时段徽章样式映射
  const timeStyles: Record<string, string> = {
    MORNING: 'bg-sky-100 text-sky-900 border-sky-400',
    FORENOON: 'bg-blue-50 text-blue-900 border-blue-400',
    AFTERNOON: 'bg-yellow-50 text-yellow-900 border-yellow-400',
    DUSK: 'bg-orange-100 text-orange-900 border-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.3)]',
    NIGHT: 'bg-slate-900 text-slate-100 border-slate-600',
    MIDNIGHT: 'bg-red-950 text-red-500 border-red-500 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.4)]'
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col select-none bg-white shadow-2xl">
      {/* 1. 系统状态栏 */}
      <div className="bg-black text-white px-4 h-10 flex items-center justify-between border-b-2 border-black">
        <div className="flex items-center gap-2">
          <div className="flex items-baseline gap-1">
            <span className="text-[10px] font-black italic tracking-tighter opacity-50 uppercase">Day</span>
            <span className="text-[14px] font-black italic tracking-tighter">{day.toString().padStart(2, '0')}</span>
          </div>
          <span className="text-[8px] font-black bg-white text-black px-1 leading-none">{dayOfWeek}</span>
          
          <div className="h-4 w-[2px] bg-white/20 mx-1"></div>
          
          {/* 时段标签 - 核心更新点 */}
          <div className={`flex items-center gap-1.5 px-2.5 py-0.5 border-2 rounded-sm transition-all duration-700 ${timeStyles[timeOfDay]}`}>
             <span className="text-[11px] font-black italic tracking-[0.1em] leading-none">{timeLabel}</span>
          </div>

          <div className="h-4 w-[2px] bg-white/20 mx-1"></div>
          <span className="text-[9px] font-black text-rose-500 italic uppercase animate-pulse">Gaokao: {30 - day}d</span>
        </div>
        
        <div className="flex items-center gap-5">
          <button onClick={onPhoneOpen} className="relative active:scale-90 transition-transform p-1">
            <span className="text-lg">✉</span>
            {unreadMessages > 0 && <span className="absolute -top-0 -right-0 w-3 h-3 bg-rose-600 rounded-full border-2 border-black animate-pulse flex items-center justify-center text-[7px] font-black text-white">{unreadMessages}</span>}
          </button>
          <button onClick={onMenuOpen} className="text-base font-black active:scale-90 transition-transform">☰</button>
        </div>
      </div>

      {/* 2. 身份属性栏 */}
      <div className="bg-white border-b-2 border-black flex items-stretch h-16 relative overflow-hidden">
        <div className="flex items-stretch border-r border-black/10 bg-slate-50/50">
          <div className="w-16 h-full relative">
             <ArtisticAvatar speakerId="PLAYER" className="w-full h-full grayscale opacity-80" />
             {isTrapped && <div className="absolute inset-0 bg-rose-600/30 animate-pulse"></div>}
          </div>
          <div className="flex flex-col justify-center px-3 border-l border-black/10">
            <span className="text-[6px] font-black text-slate-400 uppercase leading-none mb-1">生存金</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-[10px] font-black opacity-30 italic">¥</span>
              <span className="text-lg font-mono font-black italic leading-none">{stats.money}</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 flex justify-center items-center gap-0 sm:gap-1 px-1">
          <AttrTag label="智力" value={stats.intelligence} color="text-blue-700" />
          <AttrTag label="魅力" value={stats.appearance} color="text-rose-600" />
          <AttrTag label="体力" value={stats.stamina} color="text-emerald-700" />
          <AttrTag label="韧性" value={stats.resilience} color="text-amber-600" />
          <AttrTag label="心眼" value={stats.savviness} color="text-zinc-900" />
        </div>

        <div className="flex items-stretch border-l border-black/10">
          <div className="flex flex-col justify-center px-3 text-right bg-slate-50/30">
             <span className="text-[6px] font-black text-slate-400 uppercase leading-none mb-1">当前位置</span>
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-black leading-none truncate max-w-[65px]">{location}</span>
                <div className={`mt-1 px-1.5 py-0.5 ${tierColor} text-white text-[7px] font-black uppercase tracking-tighter italic`}>
                  Score:{predictedScore}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* 3. 生存状态栏 */}
      <div className="bg-slate-50 border-b-[4px] border-black px-4 h-8 flex items-center gap-2">
        <StatProgress label="饱腹" value={stats.satiety} colorClass="bg-orange-700" />
        <StatProgress label="精神" value={stats.mood} colorClass="bg-indigo-700" />
        <StatProgress label="学业" value={stats.academic} colorClass="bg-emerald-700" />
        <StatProgress label="整洁" value={stats.hygiene} colorClass="bg-sky-700" />
        <StatProgress label="堕落" value={stats.corruption} colorClass="bg-rose-950" />
      </div>
      
      <div className="absolute inset-0 pointer-events-none grain-overlay opacity-5"></div>
    </div>
  );
};

export default StatusBar;
