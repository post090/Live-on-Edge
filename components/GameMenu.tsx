import React from 'react';
import { GameState } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState | null;
  onLoad: (state: GameState) => void;
  onRestart: () => void;
}

const GameMenu: React.FC<Props> = ({ isOpen, onClose, gameState, onLoad, onRestart }) => {
  if (!isOpen) return null;

  const handleSave = () => {
    if (gameState) {
      const stateToSave = { ...gameState, lastUpdate: new Date().toLocaleString() };
      localStorage.setItem('edge_of_frost_save', JSON.stringify(stateToSave));
      alert('系统：当前人生进度已记录到存档。');
    }
  };

  const handleLoad = () => {
    const saved = localStorage.getItem('edge_of_frost_save');
    if (saved) {
      onLoad(JSON.parse(saved));
      onClose();
    } else {
      alert('错误：未能在存储中找到生存记录。');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-stretch">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-sm bg-white border-r-[10px] border-black flex flex-col p-10 animate-up">
        <header className="mb-16 border-b-[6px] border-black pb-5">
           <div className="bg-red-600 text-white inline-block px-2 py-0.5 text-[10px] font-black uppercase mb-3">系统设置 // 管理员</div>
           <h2 className="text-5xl font-black text-black italic tracking-tighter">控制台</h2>
           <span className="text-[10px] text-slate-300 font-black tracking-widest mt-3 block uppercase">人生进程管理界面</span>
        </header>
        
        <div className="flex-1 space-y-6">
          <button 
            onClick={handleSave}
            disabled={!gameState}
            className="btn-flat w-full py-6 text-left px-8 text-xl flex justify-between items-center border-[4px] bg-slate-50 hover:bg-slate-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-blue-600"></div>
              <span>保存进度</span>
            </div>
            <span className="text-[10px] font-mono opacity-20">本地存储</span>
          </button>
          
          <button 
            onClick={handleLoad}
            className="btn-flat w-full py-6 text-left px-8 text-xl flex justify-between items-center border-[4px] bg-slate-50 hover:bg-slate-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-emerald-600"></div>
              <span>载入进度</span>
            </div>
            <span className="text-[10px] font-mono opacity-20">档案库</span>
          </button>

          <button 
            onClick={() => { if(confirm("你确定要重置这段人生吗？所有未保存的苦难都将消失。")) onRestart(); }}
            className="btn-flat w-full py-6 text-left px-8 text-xl border-black text-red-600 hover:bg-red-50 flex justify-between items-center border-[4px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-red-600"></div>
              <span>重置人生</span>
            </div>
            <span className="text-[10px] font-mono text-red-600 font-black">警告</span>
          </button>
        </div>

        <div className="mt-auto pt-10">
          <button 
            onClick={onClose}
            className="btn-flat-filled w-full py-6 text-2xl tracking-[0.8em]"
          >
            返回
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameMenu;