
import React, { useState } from 'react';
import { Attributes, AvatarConfig } from '../types';
import { INITIAL_POINTS, AVATAR_OPTIONS } from '../constants';
import ArtisticAvatar from './ArtisticAvatar';

interface Props {
  onComplete: (attr: Attributes, avatar: AvatarConfig) => void;
  onBack: () => void;
}

type AvatarCategory = 'hair' | 'eyes' | 'expression' | 'outfit' | 'accessory';

const categoryLabels: Record<AvatarCategory, string> = {
  hair: '发型',
  eyes: '神态',
  expression: '表情',
  outfit: '服饰',
  accessory: '配饰',
};

const CharacterCreation: React.FC<Props> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState<'ATTR' | 'AVATAR'>('ATTR');
  const [activeCategory, setActiveCategory] = useState<AvatarCategory>('hair');
  const [attr, setAttr] = useState<Attributes>({
    intelligence: 4, appearance: 4, stamina: 4, resilience: 4, savviness: 4,
  });
  const [avatar, setAvatar] = useState<AvatarConfig>({
    hair: 'messy', eyes: 'tired', expression: 'neutral', outfit: 'padded', accessory: 'none',
  });

  const usedPoints = (Object.values(attr) as number[]).reduce((a, b) => a + b, 0);
  const remaining = INITIAL_POINTS - usedPoints;

  const handleSliderChange = (key: keyof Attributes, value: number) => {
    const oldValue = attr[key];
    const diff = value - oldValue;
    if (diff > 0 && remaining < diff) {
      setAttr(prev => ({ ...prev, [key]: oldValue + remaining }));
      return;
    }
    setAttr(prev => ({ ...prev, [key]: Math.max(1, value) }));
  };

  const attrConfig: Record<keyof Attributes, { label: string, desc: string, color: string }> = {
    intelligence: { label: '智力', desc: '学习、理解与复杂判断', color: 'bg-blue-700' },
    appearance: { label: '魅力', desc: '社交资本与潜在威胁', color: 'bg-rose-600' },
    stamina: { label: '体力', desc: '肉体劳动与对抗能力', color: 'bg-emerald-700' },
    resilience: { label: '韧性', desc: '精神阈值与长期耐受', color: 'bg-amber-600' },
    savviness: { label: '心眼', desc: '识破谎言与地下博弈', color: 'bg-zinc-900' },
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="shrink-0 px-6 pt-8 pb-4 border-b-[6px] border-black flex justify-between items-end bg-white z-10">
        <div className="flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-black italic tracking-tighter">
            {step === 'ATTR' ? '分配天命' : '刻画身份'}
          </h1>
          <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 uppercase tracking-widest">Calibration // 2004</span>
        </div>
        <button onClick={onBack} className="text-[10px] sm:text-xs font-black border-2 border-black px-3 py-1 active:bg-black active:text-white transition-all">
          返回
        </button>
      </header>

      <main className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-5 sm:px-6 py-4">
        {step === 'ATTR' ? (
          <div className="max-w-md mx-auto space-y-1">
            <div className="bg-black text-white p-4 sm:p-5 border-[4px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] mb-6">
              <span className="text-[9px] font-black opacity-50 block uppercase mb-1">Available Points</span>
              <div className="flex items-baseline gap-2 leading-none">
                <span className={`text-5xl sm:text-6xl font-mono font-black ${remaining > 0 ? 'text-white' : 'text-red-500'}`}>
                  {remaining.toString().padStart(2, '0')}
                </span>
                <span className="text-xs sm:text-sm font-black italic">点</span>
              </div>
            </div>

            <div className="space-y-6 sm:space-y-8 pb-10">
              {(Object.keys(attr) as (keyof Attributes)[]).map((key) => (
                <div key={key} className="animate-up">
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-6 ${attrConfig[key].color} border border-black`}></div>
                      <label className="text-base sm:text-lg font-black text-black leading-none">{attrConfig[key].label}</label>
                    </div>
                    <span className="text-xl sm:text-2xl font-mono font-black border-b-2 border-black px-2 bg-slate-50 italic">{attr[key]}</span>
                  </div>
                  <div className="px-1">
                    <input 
                      type="range" 
                      min="1" max="10" step="1" 
                      className="w-full h-8"
                      value={attr[key]} 
                      onChange={(e) => handleSliderChange(key, parseInt(e.target.value))} 
                    />
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold mt-1 tracking-tight">
                    {attrConfig[key].desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col gap-4 max-w-lg mx-auto">
            <div className="shrink-0 flex flex-col items-center justify-center py-6 sm:py-8 bg-slate-900 border-4 border-black relative overflow-hidden shadow-inner grain-overlay">
              <div className="relative z-10 flex flex-col items-center">
                {/* 女主头像固定 w-32 (128px) */}
                <div className="relative p-1 bg-white border-2 border-black shadow-2xl">
                  <ArtisticAvatar className="w-28 h-28 sm:w-32 sm:h-32 grayscale" />
                  <div className="absolute -top-1 -left-1 w-4 h-4 bg-red-600/20"></div>
                </div>
                <div className="mt-4 bg-white text-black text-[8px] font-black px-3 py-1 border-2 border-black tracking-widest uppercase">Target // {avatar.hair}</div>
              </div>
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle,transparent_20%,rgba(0,0,0,0.8)_100%)] pointer-events-none opacity-50"></div>
            </div>

            <div className="flex-1 min-h-0 flex border-4 border-black bg-slate-50 overflow-hidden">
              <div className="w-10 sm:w-12 border-r-4 border-black bg-white flex flex-col shrink-0">
                {(Object.keys(categoryLabels) as AvatarCategory[]).map(cat => (
                  <button 
                    key={cat} onClick={() => setActiveCategory(cat)}
                    className={`flex-1 flex items-center justify-center border-b-2 border-black ${activeCategory === cat ? 'bg-black text-white' : 'bg-white'}`}
                  >
                    <span className="text-[9px] sm:text-[10px] font-black [writing-mode:vertical-lr] tracking-widest leading-none">{categoryLabels[cat]}</span>
                  </button>
                ))}
              </div>
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 no-scrollbar">
                {AVATAR_OPTIONS[activeCategory].map((opt: any) => (
                  <button 
                    key={opt.id} onClick={() => setAvatar({...avatar, [activeCategory]: opt.id})} 
                    className={`w-full p-2.5 sm:p-3 border-[3px] text-left transition-all relative ${avatar[activeCategory] === opt.id ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]' : 'bg-white border-slate-200 hover:border-black'}`}
                  >
                    <div className="flex flex-col">
                        <span className="text-[13px] sm:text-sm font-black leading-tight">{opt.label}</span>
                        {opt.impact && <span className={`text-[7px] sm:text-[8px] mt-1 ${avatar[activeCategory] === opt.id ? 'text-slate-400' : 'text-slate-500'}`}>{opt.impact}</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="shrink-0 p-5 sm:p-6 border-t-[6px] border-black bg-white">
        <div className="max-w-md mx-auto">
          {step === 'ATTR' ? (
            <button 
              disabled={remaining !== 0} 
              onClick={() => setStep('AVATAR')} 
              className={`btn-flat-filled w-full py-4 sm:py-5 text-xl sm:text-2xl tracking-[0.5em] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${remaining !== 0 ? 'opacity-30 cursor-not-allowed' : 'active:translate-y-1 active:shadow-none transition-all'}`}
            >
              下一步
            </button>
          ) : (
            <button 
              onClick={() => onComplete(attr, avatar)} 
              className="btn-flat-filled w-full py-4 sm:py-5 text-xl sm:text-2xl tracking-[0.5em] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all"
            >
              步入寒冬
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default CharacterCreation;
