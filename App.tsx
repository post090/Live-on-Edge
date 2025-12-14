
import React, { useState, useEffect, useRef } from 'react';
import { GameState, Attributes, AIRootResponse, Stats, AvatarConfig, LocationInfo, Choice } from './types';
import { INITIAL_GAME_STATE, TIME_ORDER, LOCATIONS, TIME_LABELS, STORY_SCRIPT, LOCATION_INTERACTIONS, DAYS_OF_WEEK, FAINT_EVENTS } from './constants';
import { getLocalStatusSummary } from './logic/statusSystem';
import CharacterCreation from './components/CharacterCreation';
import StatusBar from './components/StatusBar';
import GameMenu from './components/GameMenu';
import MiniMap from './components/MiniMap';
import PhoneSystem from './components/PhoneSystem';
import ArtisticAvatar from './components/ArtisticAvatar';

type Screen = 'TITLE' | 'CREATION' | 'EXPLORE' | 'RESULT' | 'SUMMARY';

interface ChoiceResult {
  text: string;
  impact: string;
  changes: Partial<Stats>;
  newArea?: 'MINING_TOWN' | 'PROVINCIAL_CAPITAL' | 'BORDER_TOWN';
}

const STAT_LABELS: Record<keyof Stats, string> = {
  satiety: '饱腹',
  hygiene: '整洁',
  mood: '精神',
  money: '现金',
  debt: '债务',
  academic: '学业',
  corruption: '堕落',
  stamina: '体力',
  resilience: '韧性',
  savviness: '心眼',
  intelligence: '智力',
  appearance: '魅力'
};

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('TITLE');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentEvent, setCurrentEvent] = useState<AIRootResponse | null>(null);
  const [resultData, setResultData] = useState<ChoiceResult | null>(null);
  const [accumulatedChanges, setAccumulatedChanges] = useState<Partial<Stats>>({});
  const [statusDescription, setStatusDescription] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo(0, 0);
  }, [currentEvent, screen, loading]);

  useEffect(() => {
    if (gameState) {
      setStatusDescription(getLocalStatusSummary(gameState));
    }
  }, [gameState]);

  const handleStartGame = (attr: Attributes, avatar: AvatarConfig) => {
    const newState = { 
      ...INITIAL_GAME_STATE, 
      attributes: attr, 
      avatar: avatar,
      stats: {
        ...INITIAL_GAME_STATE.stats,
        intelligence: attr.intelligence,
        appearance: attr.appearance,
        stamina: attr.stamina,
        resilience: attr.resilience,
        savviness: attr.savviness
      }
    };
    setGameState(newState);
    setScreen('EXPLORE');
  };

  const handleLoad = (savedState: GameState) => {
    setGameState(savedState);
    setScreen('EXPLORE');
    setIsMenuOpen(false);
    setCurrentEvent(null);
  };

  const handleExplore = async (loc: LocationInfo) => {
    if (!gameState || loading) return;
    setLoading(true);
    setAccumulatedChanges({});
    
    const dayPlots = STORY_SCRIPT[gameState.day];
    let finalEvent: AIRootResponse | null = dayPlots ? dayPlots[loc.id] : null;
    
    if (!finalEvent) {
      const timeKey = gameState.timeOfDay;
      const interactions = LOCATION_INTERACTIONS[loc.id];
      if (interactions) finalEvent = interactions[timeKey] || Object.values(interactions)[0] || null;
    }
    
    if (!finalEvent) {
      const homeInteractions = LOCATION_INTERACTIONS['HOME'];
      if (homeInteractions) {
        finalEvent = homeInteractions[gameState.timeOfDay] || Object.values(homeInteractions)[0] || null;
      }
    }
    
    if (!finalEvent) {
      finalEvent = FAINT_EVENTS['DEFAULT'];
    }
    
    setTimeout(() => {
      setGameState(prev => prev ? { ...prev, location: loc.name } : null);
      setCurrentEvent(finalEvent);
      setLoading(false);
    }, 600);
  };

  const handleChoice = (choiceIndex: number) => {
    if (!gameState || !currentEvent || loading) return;
    const choice = currentEvent.choices[choiceIndex];
    if (!choice) return;

    const newChanges = { ...accumulatedChanges };
    Object.entries(choice.stat_changes).forEach(([k, v]) => {
      const key = k as keyof Stats;
      newChanges[key] = (newChanges[key] || 0) + (v || 0);
    });
    setAccumulatedChanges(newChanges);

    if (choice.unlock_message) {
      setGameState(prev => {
        if (!prev) return null;
        if (prev.phone.messages.some(m => m.id === choice.unlock_message!.id)) return prev;
        return {
          ...prev,
          phone: { ...prev.phone, messages: [choice.unlock_message!, ...prev.phone.messages] }
        };
      });
    }

    if (choice.next_event) {
      setCurrentEvent(choice.next_event);
      return;
    }

    setResultData({
      text: choice.text,
      impact: choice.impact_description,
      changes: newChanges,
      newArea: choice.new_area
    });
    setScreen('RESULT');
  };

  const handleAcceptConsequences = () => {
    if (!gameState || !resultData) return;
    finalizeStats(resultData.changes, resultData.newArea);
  };

  const finalizeStats = (changes: Partial<Stats>, newArea?: 'MINING_TOWN' | 'PROVINCIAL_CAPITAL' | 'BORDER_TOWN') => {
    if (!gameState) return;
    
    const newStats: Stats = { ...gameState.stats };
    // 基础自然损耗
    newStats.satiety = Math.max(0, newStats.satiety - 6); 
    newStats.hygiene = Math.max(0, newStats.hygiene - 8); 
    newStats.mood = Math.max(0, newStats.mood - 3);
    
    Object.entries(changes).forEach(([key, val]) => {
      const k = key as keyof Stats;
      let changeVal = val || 0;
      newStats[k] = Math.max(0, (newStats[k] || 0) + changeVal);
    });

    if (newStats.satiety <= 0 || newStats.mood <= 0) {
      handleFaint(newStats);
      return;
    }

    const currentTimeIdx = TIME_ORDER.indexOf(gameState.timeOfDay);
    let nextTimeIdx = (currentTimeIdx + 1) % TIME_ORDER.length;
    let nextDay = gameState.day;
    
    if (nextTimeIdx === 0) {
      nextDay = Math.min(30, gameState.day + 1);
      if (newStats.debt > 0) {
        newStats.debt = Math.floor(newStats.debt * 1.2);
        newStats.mood = Math.max(0, newStats.mood - 10);
      }
    }

    const newState: GameState = {
      ...gameState,
      day: nextDay,
      timeOfDay: TIME_ORDER[nextTimeIdx],
      stats: newStats,
      currentArea: newArea || gameState.currentArea,
      location: newArea ? (newArea === 'PROVINCIAL_CAPITAL' ? '城中村出租屋' : '火车站') : gameState.location,
      history: [
        ...gameState.history, 
        `[第 ${gameState.day} 天 ${TIME_LABELS[gameState.timeOfDay]}] ${resultData?.text || '行动'}`,
      ].slice(-50),
    };
    
    setGameState(newState);
    setScreen('EXPLORE');
    setCurrentEvent(null);
    setResultData(null);
    setAccumulatedChanges({});
  };

  const handleFaint = (faintedStats: Stats) => {
    if (!gameState) return;
    let locationKey = 'DEFAULT';
    const locName = gameState.location;
    if (locName.includes('家')) locationKey = 'HOME';
    else if (locName.includes('学')) locationKey = 'SCHOOL';
    else if (locName.includes('矿')) locationKey = 'MINING_AREA';
    else if (locName.includes('舞厅')) locationKey = 'CLUB';

    const faintEvent = FAINT_EVENTS[locationKey] || FAINT_EVENTS['DEFAULT'];
    const rescuedStats: Stats = { ...faintedStats, satiety: 20, mood: 20 };
    
    setGameState({
      ...gameState,
      timeOfDay: 'MORNING',
      day: Math.min(30, gameState.day + 1),
      stats: rescuedStats,
      history: [...gameState.history, `[第 ${gameState.day} 天] 力竭昏迷。`],
    });
    setAccumulatedChanges({});
    setCurrentEvent(faintEvent);
    setScreen('EXPLORE');
    setResultData(null);
  };

  const updateStatsDirectly = (changes: Partial<Stats>) => {
    if (!gameState) return;
    const newStats: Stats = { ...gameState.stats };
    Object.entries(changes).forEach(([key, val]) => {
      const k = key as keyof Stats;
      newStats[k] = Math.max(0, (gameState.stats[k] || 0) + (val || 0));
    });
    setGameState({ ...gameState, stats: newStats });
  };

  const markMessageRead = (msgId: string) => {
    if (!gameState) return;
    const newMessages = gameState.phone.messages.map(m => m.id === msgId ? { ...m, isRead: true } : m);
    setGameState({ ...gameState, phone: { ...gameState.phone, messages: newMessages } });
  };

  const formatTextLine = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed) return null;
    const dialogueMatch = trimmed.match(/^([^：:]{1,10})[：:](.*)/);
    if (dialogueMatch) {
      const [_, speaker, content] = dialogueMatch;
      const isSelf = speaker.includes('我');
      return (
        <div key={Math.random()} className="mb-4 animate-up">
          <div className={`inline-block border-2 border-black px-1.5 py-0.5 text-[10px] font-black mb-1.5 ${isSelf ? 'bg-blue-800 text-white' : 'bg-slate-950 text-white'}`}>{speaker}</div>
          <p className="text-black font-serif text-[17px] leading-snug font-black pl-3 border-l-[4px] border-slate-200">{content.trim()}</p>
        </div>
      );
    }
    return <p key={Math.random()} className="mb-4 text-slate-800 font-serif text-[16px] leading-relaxed font-medium pl-3 animate-up italic opacity-90">{trimmed}</p>;
  };

  if (screen === 'TITLE') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-white relative overflow-hidden grain-overlay">
        <div className="mb-12 animate-up z-20">
          <div className="inline-block bg-red-700 text-white px-3 py-1 text-[9px] font-black mb-6 uppercase tracking-[0.2em]">2014 // 矿镇伤痕</div>
          <h1 className="text-6xl sm:text-8xl font-black text-black tracking-tighter mb-4 border-b-[10px] border-black inline-block px-4 py-2 italic leading-none">边缘生活</h1>
          <p className="text-[11px] text-slate-400 font-black tracking-[0.5em] mt-6 italic uppercase text-center max-w-xs">不读书，就得下井。逃离，或被吞噬。</p>
        </div>
        <div className="w-full max-w-xs space-y-4 z-20">
          <button onClick={() => setScreen('CREATION')} className="btn-flat-filled w-full py-5 text-xl tracking-[0.5em] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">开启人生</button>
        </div>
      </div>
    );
  }

  if (screen === 'CREATION') return <CharacterCreation onComplete={handleStartGame} onBack={() => setScreen('TITLE')} />;

  return (
    <div className="flex flex-col h-screen relative bg-white overflow-hidden">
      <StatusBar gameState={gameState!} onMenuOpen={() => setIsMenuOpen(true)} onPhoneOpen={() => setIsPhoneOpen(true)} />
      <GameMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} gameState={gameState} onLoad={handleLoad} onRestart={() => window.location.reload()} />
      {isPhoneOpen && <PhoneSystem gameState={gameState!} onClose={() => setIsPhoneOpen(false)} onUpdateStats={updateStatsDirectly} onMarkMessageRead={markMessageRead} />}
      <main className="flex-1 mt-[136px] overflow-hidden flex flex-col h-full">
        {screen === 'EXPLORE' && !currentEvent && !loading && (
          <div className="animate-up h-full flex flex-col overflow-y-auto no-scrollbar">
            <MiniMap currentLocation={gameState!.location} onSelect={handleExplore} isTrapped={gameState!.isTrapped} day={gameState!.day} currentArea={gameState!.currentArea} />
            <div className="flex-1 flex flex-col items-center justify-center px-10 text-center py-12">
              <div className="w-12 h-[2px] bg-black/10 mb-8"></div>
              <p className="text-black font-serif italic text-base sm:text-lg leading-snug font-black px-4 opacity-90">{statusDescription}</p>
            </div>
          </div>
        )}
        {screen === 'RESULT' && resultData && (
          <div className="flex-1 overflow-y-auto px-5 pt-6 pb-12 no-scrollbar animate-up bg-slate-50">
            <div className="max-w-2xl mx-auto flex flex-col">
               <header className="mb-6 flex flex-col border-b-[4px] border-black pb-4">
                  <h2 className="text-2xl font-black italic tracking-tighter text-black leading-tight border-l-[8px] border-black pl-4">{resultData.text}</h2>
               </header>
               <div className="mb-6 p-6 bg-white border-2 border-black shadow-sm relative overflow-hidden">
                  <p className="text-lg font-serif font-black italic text-slate-800 relative z-10">“{resultData.impact}”</p>
               </div>

               {/* 属性变动显示区域 */}
               <div className="mb-10 space-y-2">
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                   <div className="h-[1px] flex-1 bg-slate-200"></div>
                   <span>属性修正记录</span>
                   <div className="h-[1px] flex-1 bg-slate-200"></div>
                 </div>
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries(resultData.changes).map(([stat, val]) => {
                      if (val === 0) return null;
                      // Fix: Explicitly cast 'val' as a number to resolve 'unknown' comparison error.
                      const isPositive = (val as number) > 0;
                      return (
                        <div key={stat} className="flex items-center justify-between p-3 border-2 border-black bg-white animate-up shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <span className="text-[10px] font-black text-slate-500 uppercase">{STAT_LABELS[stat as keyof Stats]}</span>
                          <span className={`text-sm font-mono font-black ${isPositive ? 'text-blue-700' : 'text-red-700'}`}>
                            {isPositive ? '+' : ''}{val}
                          </span>
                        </div>
                      );
                    })}
                    {/* 自然损耗提示 */}
                    <div className="flex items-center justify-between p-3 border-2 border-dashed border-slate-300 bg-slate-50 opacity-60">
                      <span className="text-[10px] font-black text-slate-400">时间流逝</span>
                      <span className="text-xs font-mono font-black text-slate-400">- 损耗</span>
                    </div>
                 </div>
               </div>

               <div className="pb-24">
                 <button onClick={handleAcceptConsequences} className="btn-flat-filled w-full py-5 text-xl tracking-[0.8em] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-1 active:shadow-none">继续呼吸</button>
               </div>
            </div>
          </div>
        )}
        {screen === 'EXPLORE' && currentEvent && !loading && (
          <div className="flex-1 overflow-y-auto px-6 pt-4 pb-24 no-scrollbar h-full" ref={scrollRef}>
            <div className="max-w-2xl mx-auto">
              <div className="mb-8 flex flex-col">
                <div className="flex items-end gap-4 mb-6">
                  {currentEvent.speakerId && <div className="w-16 h-16 border-4 border-black shrink-0 bg-slate-100"><ArtisticAvatar speakerId={currentEvent.speakerId} className="w-full h-full grayscale" /></div>}
                  <h2 className="text-xl font-black border-l-[10px] pl-4 py-0.5 italic bg-slate-50 border-red-800 text-black flex-1">{currentEvent.title}</h2>
                </div>
                <div className="space-y-3 px-1">{currentEvent.description.split('\n').map(line => formatTextLine(line))}</div>
              </div>
              <div className="grid grid-cols-1 gap-3 pb-24">
                {currentEvent.choices.map((choice, idx) => (
                  <button key={idx} onClick={() => handleChoice(idx)} className="btn-flat w-full text-left p-4 flex flex-col border-[3px] hover:bg-slate-50 transition-all">
                    <span className="text-[7px] font-black uppercase opacity-30">选项 // {idx + 1}</span>
                    <span className="text-sm sm:text-lg font-black leading-tight mt-0.5">{choice.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
