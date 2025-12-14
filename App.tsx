
import { useState, useEffect, useRef } from 'react';
// Move LocationInfo to the correct import source from types.ts
import { GameState, Attributes, AIRootResponse, Stats, AvatarConfig, LocationInfo } from './types';
import { INITIAL_GAME_STATE, TIME_ORDER, LOCATIONS, TIME_LABELS } from './constants';
import CharacterCreation from './components/CharacterCreation';
import StatusBar from './components/StatusBar';
import GameMenu from './components/GameMenu';
import MiniMap from './components/MiniMap';
import { generateNarrativeEvent, generateMapSummary } from './services/geminiService';

type Screen = 'TITLE' | 'CREATION' | 'EXPLORE' | 'SUMMARY';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('TITLE');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentEvent, setCurrentEvent] = useState<AIRootResponse | null>(null);
  const [eventHistory, setEventHistory] = useState<string[]>([]);
  const [accumulatedChanges, setAccumulatedChanges] = useState<Partial<Stats>>({});
  const [mapSummary, setMapSummary] = useState<string>("那是2004年的雪天。");
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo(0, 0);
  }, [currentEvent, screen, loading]);

  useEffect(() => {
    if (gameState && screen !== 'TITLE') {
      localStorage.setItem('edge_of_frost_save', JSON.stringify(gameState));
    }
  }, [gameState, screen]);

  const handleStartGame = (attr: Attributes, avatar: AvatarConfig) => {
    const newState = { ...INITIAL_GAME_STATE, attributes: attr, avatar: avatar };
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
    if (gameState.isTrapped && loc.name !== gameState.location) return;

    setLoading(true);
    setEventHistory([]);
    setAccumulatedChanges({});
    
    // 立即更新地点，但不推进时间（探索中消耗时间）
    const stateAtStartOfExplore = { ...gameState, location: loc.name };
    
    try {
      const ev = await generateNarrativeEvent(stateAtStartOfExplore, []);
      setCurrentEvent(ev);
      setGameState(stateAtStartOfExplore);
    } catch (e) {
      console.error(e);
      alert("风雪封路，无法继续前行。");
    } finally {
      setLoading(false);
    }
  };

  const handleChoice = async (choiceIndex: number) => {
    if (!gameState || !currentEvent || loading) return;
    const choice = currentEvent.choices[choiceIndex];
    if (!choice) return;

    const newChanges = { ...accumulatedChanges };
    Object.entries(choice.stat_changes).forEach(([key, val]) => {
      const k = key as keyof Stats;
      newChanges[k] = (newChanges[k] || 0) + (val || 0);
    });
    setAccumulatedChanges(newChanges);
    
    const updatedSceneHistory = [...eventHistory, `> ${choice.text}`];
    setEventHistory(updatedSceneHistory);
    
    let newlyFreed = false;
    if (gameState.isTrapped && choice.escape_attempt) {
      newlyFreed = true; 
    }

    if (currentEvent.is_final || updatedSceneHistory.length >= 3) {
      finalizeStats(newChanges, updatedSceneHistory, newlyFreed, currentEvent.new_area);
    } else {
      setLoading(true);
      try {
        const ev = await generateNarrativeEvent(gameState, updatedSceneHistory);
        setCurrentEvent(ev);
      } catch (e) {
        finalizeStats(newChanges, updatedSceneHistory, newlyFreed, currentEvent.new_area);
      } finally {
        setLoading(false);
      }
    }
  };

  const finalizeStats = async (changes: Partial<Stats>, history: string[], wasFreed: boolean, targetArea?: any) => {
    if (!gameState) return;
    
    // 时间推进逻辑：关键修复
    const currentTimeIdx = TIME_ORDER.indexOf(gameState.timeOfDay);
    let nextTimeIdx = (currentTimeIdx + 1) % TIME_ORDER.length;
    let nextDay = gameState.day;
    if (nextTimeIdx === 0) {
      nextDay = gameState.day + 1;
    }
    
    const newStats: Stats = { ...gameState.stats };
    Object.entries(changes).forEach(([key, val]) => {
      const k = key as keyof Stats;
      const changeVal = val || 0;
      if (k === 'money') {
        newStats[k] = Math.max(0, (gameState.stats.money || 0) + changeVal);
      } else {
        newStats[k] = Math.max(0, Math.min(100, (gameState.stats[k] || 0) + changeVal));
      }
    });

    let nextLocation = gameState.location;
    let nextArea = targetArea || gameState.currentArea;
    let nextIsTrapped = wasFreed ? false : gameState.isTrapped;
    let trapType = gameState.trapType;

    if (targetArea && targetArea !== gameState.currentArea) {
      const defaultLoc = LOCATIONS.find(l => l.area === targetArea);
      if (defaultLoc) nextLocation = defaultLoc.name;
    }

    if (!nextIsTrapped) {
      if (newStats.satiety <= 0) {
        nextIsTrapped = true; trapType = 'HOSPITAL'; nextLocation = '简陋诊所'; newStats.satiety = 15;
      } else if (newStats.mood <= 0) {
        nextIsTrapped = true; trapType = 'LOCKED_HOME'; nextLocation = '破败的家'; newStats.mood = 15;
      }
    }

    if (wasFreed) {
      const home = LOCATIONS.find(l => l.area === nextArea) || LOCATIONS[0];
      nextLocation = home.name;
      nextIsTrapped = false;
    }

    const newState: GameState = {
      ...gameState,
      day: nextDay,
      timeOfDay: TIME_ORDER[nextTimeIdx],
      stats: newStats,
      location: nextLocation,
      currentArea: nextArea,
      isTrapped: nextIsTrapped,
      trapType: trapType,
      history: [
        ...gameState.history, 
        `[Day ${gameState.day} ${gameState.timeOfDay} @${gameState.location}]：`,
        ...history
      ].slice(-50),
    };
    
    setGameState(newState);
    setScreen('EXPLORE');
    setCurrentEvent(null);

    try {
      const summary = await generateMapSummary(newState);
      setMapSummary(summary);
    } catch (e) {
      console.warn("Summary generation failed.");
    }
  };

  const formatTextLine = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed) return null;
    const dialogueMatch = trimmed.match(/^([^：:]{1,10})[：:](.*)/);
    if (dialogueMatch) {
      const [_, speaker, content] = dialogueMatch;
      const isSelf = speaker.includes('我');
      return (
        <div key={Math.random()} className="mb-6 animate-up">
          <div className={`inline-block border-[2px] border-black px-2 py-0.5 text-[11px] font-black mb-2 ${isSelf ? 'bg-blue-800 text-white' : 'bg-slate-900 text-white'}`}>
            {speaker}
          </div>
          <p className="text-black font-serif text-[18px] leading-relaxed font-black pl-3 border-l-[6px] border-slate-100">
            {content.trim()}
          </p>
        </div>
      );
    }
    return <p key={Math.random()} className="mb-8 text-slate-700 font-serif text-[17px] leading-relaxed font-medium pl-3 animate-up italic opacity-90">{trimmed}</p>;
  };

  if (screen === 'TITLE') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-10 text-center bg-white relative">
        <div className="mb-24 animate-up">
          <div className="inline-block bg-red-600 text-white px-4 py-1.5 text-xs font-black mb-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] uppercase">2004 // FRONTIER</div>
          <h1 className="text-8xl font-black text-black tracking-tighter mb-4 border-b-[12px] border-black inline-block px-6 py-3 italic">边缘生活</h1>
          <p className="text-[12px] text-slate-400 font-black tracking-[0.8em] mt-8 italic uppercase opacity-60">命运之论。永不回头。</p>
        </div>
        <div className="w-full max-w-xs space-y-6">
          <button onClick={() => setScreen('CREATION')} className="btn-flat-filled w-full py-6 text-2xl tracking-[0.5em] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">开启记录</button>
          {!!localStorage.getItem('edge_of_frost_save') && (
            <button onClick={() => {
              const saved = localStorage.getItem('edge_of_frost_save');
              if (saved) handleLoad(JSON.parse(saved));
            }} className="btn-flat w-full py-6 text-xl font-black hover:bg-slate-50">载入旧事</button>
          )}
        </div>
      </div>
    );
  }

  if (screen === 'CREATION') return <CharacterCreation onComplete={handleStartGame} onBack={() => setScreen('TITLE')} />;

  return (
    <div className={`flex flex-col h-screen relative transition-colors duration-1000 ${gameState?.isTrapped ? 'bg-red-50' : 'bg-white'}`}>
      <StatusBar gameState={gameState!} onMenuOpen={() => setIsMenuOpen(true)} />
      <GameMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} gameState={gameState} onLoad={handleLoad} onRestart={() => window.location.reload()} />
      
      <main className="flex-1 mt-44 overflow-hidden flex flex-col">
        {screen === 'EXPLORE' && !currentEvent && !loading && (
          <div className="animate-up h-full flex flex-col">
            <MiniMap 
              currentLocation={gameState!.location} 
              onSelect={handleExplore} 
              isTrapped={gameState!.isTrapped}
              day={gameState!.day}
              currentArea={gameState!.currentArea}
            />
            <div className="flex-1 flex flex-col items-center justify-center px-10 text-center pb-10 overflow-y-auto">
              <div className="w-10 h-1 bg-black mb-10"></div>
              <p className="text-slate-500 font-serif italic text-2xl leading-relaxed font-bold max-w-sm">
                “{mapSummary}”
              </p>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 pt-4 pb-36" ref={scrollRef}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-60 animate-pulse">
              <div className="w-20 h-1.5 bg-black mb-8"></div>
              <p className="text-[12px] tracking-[0.8em] text-slate-400 font-black uppercase italic">命运重组中...</p>
            </div>
          ) : screen === 'SUMMARY' ? (
            <div className="max-w-2xl mx-auto py-12 animate-up">
              <div className={`border-l-[12px] pl-8 mb-12 ${gameState?.isTrapped ? 'border-red-900' : 'border-black'}`}>
                <h2 className="text-4xl font-black mb-2 italic tracking-tighter uppercase">存活记录 // 第{gameState?.day}日</h2>
                <p className="text-slate-400 text-[10px] font-black tracking-[0.5em] uppercase">即将进入：{TIME_LABELS[gameState!.timeOfDay]}</p>
              </div>
              <div className="bg-slate-50 border-[4px] border-black p-8 mb-12">
                <div className="grid grid-cols-2 gap-6">
                  {Object.keys(accumulatedChanges).length === 0 ? (
                     <p className="col-span-2 text-center text-slate-400 font-black italic">—— 此时段无显著变化 ——</p>
                  ) : Object.entries(accumulatedChanges).map(([key, val]) => {
                    const labelMap: any = { satiety: '饱腹', hygiene: '清洁', mood: '精神', money: '现金', academic: '学业', corruption: '社会化' };
                    if (val === 0) return null;
                    return (
                      <div key={key} className="flex justify-between items-center border-b-[2px] border-slate-200 pb-2">
                        <span className="font-black text-[12px] text-slate-500">{labelMap[key]}</span>
                        <span className={`font-mono font-black ${val > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {val > 0 ? `+${val}` : val}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <button onClick={() => { setScreen('EXPLORE'); setCurrentEvent(null); }} className="btn-flat-filled w-full py-6 text-2xl tracking-[0.5em] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none transition-all">
                推进生命线
              </button>
            </div>
          ) : currentEvent ? (
            <div className="max-w-2xl mx-auto">
              <div className="mb-12">
                <h2 className={`text-4xl font-black mb-8 leading-tight border-l-[15px] pl-5 py-1 italic bg-slate-50 ${gameState?.isTrapped ? 'border-red-950 text-red-950' : 'border-red-600 text-black'}`}>
                  {currentEvent.title}
                </h2>
                <div className="space-y-4">{currentEvent.description.split('\n').map(line => formatTextLine(line))}</div>
              </div>
              <div className="space-y-3 pb-32">
                {currentEvent.choices.map((choice, idx) => (
                  <button 
                    key={idx} onClick={() => handleChoice(idx)} 
                    className={`btn-flat w-full text-left p-5 flex flex-col gap-1 border-[3px] transition-all hover:bg-slate-50 ${choice.escape_attempt ? 'border-red-600 border-dashed' : 'border-black'}`}
                  >
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Decision 0{idx + 1}</span>
                    <span className="text-lg font-black leading-tight">{choice.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default App;