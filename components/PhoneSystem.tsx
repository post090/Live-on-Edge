
import React, { useState } from 'react';
import { GameState, Message, ShortVideo, Stats, Product, MessageOption } from '../types';
import { YUEYUE_USERS, GRAY_TASKS } from '../constants';

interface Props {
  gameState: GameState;
  onUpdateStats: (changes: Partial<Stats>) => void;
  onClose: () => void;
  onMarkMessageRead: (msgId: string) => void;
}

const PhoneSystem: React.FC<Props> = ({ gameState, onUpdateStats, onClose, onMarkMessageRead }) => {
  const [activeApp, setActiveApp] = useState<'HOME' | 'SOCIAL' | 'VIDEO' | 'SHOP' | 'YUEYUE' | 'TG' | 'LOAN'>('HOME');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [showCommentsId, setShowCommentsId] = useState<string | null>(null);
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());

  const unreadCount = gameState.phone.messages.filter(m => !m.isRead).length;

  const handleReadMessage = (msg: Message) => {
    if (!msg.isRead) {
      onMarkMessageRead(msg.id);
      if (msg.impact) onUpdateStats(msg.impact);
    }
    setSelectedChatId(msg.id);
  };

  const handleReply = (msgId: string, option: MessageOption, index: number) => {
    onMarkMessageRead(msgId);
    onUpdateStats(option.impact);
    const msg = gameState.phone.messages.find(m => m.id === msgId);
    if (msg) msg.selectedOptionIndex = index;
  };

  const handleBorrow = (amount: number) => {
    onUpdateStats({ money: amount, debt: amount * 1.5 }); // 借500还750
    alert(`借款成功！¥${amount}已汇入余额。请注意，逾期利息惊人。`);
  };

  const handleGrayTask = (task: any) => {
    if (confirm(`确认接单：${task.name}? 风险：${task.risk}`)) {
      onUpdateStats({ money: task.reward, corruption: task.corruption, stamina: task.stamina, mood: -10 });
      alert(`单子已接。你完成了任务，拿到了 ¥${task.reward}，但你的心跳很久才平复。`);
    }
  };

  const handleYueYue = (user: any) => {
    if (confirm(`给“${user.name}”发消息?`)) {
      onUpdateStats(user.impact);
      alert(`你和他见了一面... ${user.impact.money && user.impact.money > 0 ? '他给了你一点“零花钱”。' : '你遭遇了一些不愉快的事情。'}`);
    }
  };

  const renderHome = () => (
    <div className="flex-1 grid grid-cols-3 gap-6 p-8 content-start bg-slate-100 h-full">
      <AppIcon label="沉默通讯" icon="✉" bg="bg-blue-600" onClick={() => setActiveApp('SOCIAL')} badge={unreadCount} />
      <AppIcon label="快见视频" icon="▶" bg="bg-red-600" onClick={() => setActiveApp('VIDEO')} />
      <AppIcon label="淘货网" icon="🛒" bg="bg-amber-500" onClick={() => setActiveApp('SHOP')} />
      <AppIcon label="约约" icon="💜" bg="bg-purple-600" onClick={() => setActiveApp('YUEYUE')} />
      <AppIcon label="纸飞机" icon="✈" bg="bg-cyan-700" onClick={() => setActiveApp('TG')} />
      <AppIcon label="小借贷" icon="💰" bg="bg-yellow-600" onClick={() => setActiveApp('LOAN')} />
    </div>
  );

  const AppIcon = ({ label, icon, bg, onClick, badge }: any) => (
    <button onClick={onClick} className="flex flex-col items-center gap-2">
      <div className={`w-14 h-14 ${bg} border-4 border-black flex items-center justify-center relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 active:translate-y-1 transition-all`}>
        <span className="text-white text-2xl">{icon}</span>
        {badge > 0 && <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[8px] font-black w-5 h-5 flex items-center justify-center border-2 border-black rounded-full">{badge}</div>}
      </div>
      <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
    </button>
  );

  const renderSocial = () => {
    const selectedChat = gameState.phone.messages.find(m => m.id === selectedChatId);
    if (selectedChat) {
      return (
        <div className="flex-1 flex flex-col bg-slate-100 h-full overflow-hidden">
          <div className="p-4 bg-white border-b-4 border-black flex items-center gap-4 shrink-0">
            <button onClick={() => setSelectedChatId(null)} className="font-black text-xl">←</button>
            <span className="font-black text-sm">{selectedChat.sender}</span>
          </div>
          <div className="flex-1 p-4 space-y-4 overflow-y-auto no-scrollbar pb-24">
            <div className="bg-white border-2 border-black p-3 rounded-sm text-xs font-serif shadow-sm max-w-[85%]">
              {selectedChat.content}
            </div>
            {selectedChat.selectedOptionIndex !== undefined && (
              <div className="flex flex-col items-end">
                 <div className="bg-blue-600 text-white border-2 border-black p-3 rounded-sm text-xs font-serif max-w-[85%]">
                  {selectedChat.options?.[selectedChat.selectedOptionIndex].replyText}
                 </div>
              </div>
            )}
          </div>
          {selectedChat.selectedOptionIndex === undefined && selectedChat.options && (
            <div className="absolute bottom-16 inset-x-0 p-3 bg-white border-t-4 border-black space-y-2 z-20">
              {selectedChat.options.map((opt, i) => (
                <button key={i} onClick={() => handleReply(selectedChat.id, opt, i)} className="w-full p-2 border-2 border-black text-[10px] font-black text-left hover:bg-blue-50">
                  {opt.text}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }
    return (
      <div className="flex-1 flex flex-col bg-white">
        <div className="p-4 border-b-4 border-black font-black text-sm italic bg-blue-50">沉默通讯</div>
        <div className="flex-1 overflow-y-auto">
          {gameState.phone.messages.map(msg => (
            <button key={msg.id} onClick={() => handleReadMessage(msg)} className={`w-full p-4 border-b-2 border-slate-100 flex items-center gap-4 text-left ${!msg.isRead ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'bg-white'}`}>
              <div className="w-10 h-10 border-2 border-black flex items-center justify-center text-white bg-slate-900 font-black">{msg.sender[0]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline"><span className="font-black text-xs">{msg.sender}</span><span className="text-[8px] text-slate-400">{msg.time}</span></div>
                <p className="text-[10px] text-slate-500 truncate mt-1">{msg.content}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderYueYue = () => (
    <div className="flex-1 flex flex-col bg-purple-50">
      <div className="p-4 bg-purple-600 text-white border-b-4 border-black font-black italic tracking-tighter">约约 // 附近的人</div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {YUEYUE_USERS.map(user => (
          <div key={user.id} className="bg-white border-4 border-black p-4 flex gap-4 shadow-[4px_4px_0px_0px_rgba(147,51,234,1)]">
            <div className="w-12 h-12 bg-purple-200 border-2 border-black shrink-0 flex items-center justify-center text-2xl">👤</div>
            <div className="flex-1">
              <div className="flex justify-between items-center"><span className="font-black text-sm">{user.name}</span><span className="text-[8px] text-purple-400 font-bold">{user.dist}</span></div>
              <p className="text-[10px] text-slate-500 italic mt-1 leading-snug">“{user.bio}”</p>
              <button onClick={() => handleYueYue(user)} className="mt-3 w-full py-1.5 bg-purple-600 text-white text-[10px] font-black border-2 border-black active:translate-y-1">打个招呼</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTG = () => (
    <div className="flex-1 flex flex-col bg-slate-900 text-cyan-400">
      <div className="p-4 border-b-4 border-black font-mono font-black italic text-cyan-500 bg-slate-950 flex justify-between items-center">
        <span>ENCRYPTED_TG // v4.0</span>
        <span className="text-[8px] animate-pulse">● SECURE</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono">
        {GRAY_TASKS.map(task => (
          <div key={task.id} className="border-2 border-cyan-900 p-4 bg-black/50 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-white">{task.name}</span>
              <span className="text-emerald-500 text-xs">¥{task.reward}</span>
            </div>
            <p className="text-[9px] text-cyan-700 leading-snug">{task.desc}</p>
            <div className="flex justify-between items-center pt-2">
              <span className="text-[8px] border border-red-900 text-red-700 px-1">风险: {task.risk}</span>
              <button onClick={() => handleGrayTask(task)} className="bg-cyan-900 text-black px-4 py-1 text-[10px] font-black hover:bg-cyan-400">接单</button>
            </div>
          </div>
        ))}
        <div className="p-4 text-center text-[8px] text-cyan-950">--- 端到端加密已启用 ---</div>
      </div>
    </div>
  );

  const renderLoan = () => (
    <div className="flex-1 flex flex-col bg-yellow-50">
      <div className="p-4 bg-yellow-600 text-white border-b-4 border-black font-black italic">小借贷 // 现金秒到账</div>
      <div className="p-6 flex-1 flex flex-col items-center">
        <div className="w-full bg-white border-4 border-black p-6 mb-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]">
           <span className="text-[10px] font-black text-slate-400 uppercase">当前账户负债</span>
           <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-mono font-black text-red-600">¥{gameState.stats.debt}</span>
           </div>
           <p className="text-[8px] text-slate-400 mt-4 leading-relaxed italic">“珍惜信用，就是珍惜生命。” —— 催收组宣</p>
        </div>
        <div className="grid grid-cols-2 gap-4 w-full">
           <button onClick={() => handleBorrow(200)} className="btn-flat h-24 flex flex-col gap-1 items-center justify-center border-yellow-700 hover:bg-yellow-100">
              <span className="text-xl font-black">¥200</span>
              <span className="text-[8px] font-bold">快速周转</span>
           </button>
           <button onClick={() => handleBorrow(500)} className="btn-flat h-24 flex flex-col gap-1 items-center justify-center border-yellow-700 hover:bg-yellow-100">
              <span className="text-xl font-black">¥500</span>
              <span className="text-[8px] font-bold">急需用钱</span>
           </button>
        </div>
        <div className="mt-auto w-full p-4 border-4 border-dashed border-yellow-300 text-center">
           <p className="text-[10px] text-yellow-800 font-black italic">只需身份证，无需担保。考上大学后慢慢还。</p>
        </div>
      </div>
    </div>
  );

  const renderVideo = () => (
    <div className="flex-1 bg-black flex flex-col justify-center items-center relative overflow-hidden">
       <div className="absolute top-4 inset-x-0 z-20 flex justify-center gap-6 text-white text-[10px] font-black uppercase opacity-60">
          <span>关注</span><span className="border-b-2 border-white">推荐</span>
       </div>
       {gameState.phone.videos.map(v => (
         <div key={v.id} className="h-full w-full flex flex-col justify-end p-6 relative">
            <div className="relative z-10 space-y-2">
               <span className="text-white font-black text-xs italic">@{v.author}</span>
               <p className="text-white text-[11px] leading-snug">{v.description}</p>
            </div>
            <div className="absolute right-4 bottom-24 flex flex-col gap-6 text-white text-2xl">
               <button onClick={() => onUpdateStats(v.impact)}>❤</button>
               <button onClick={() => setShowCommentsId(v.id)}>💬</button>
            </div>
         </div>
       ))}
    </div>
  );

  const renderShop = () => (
    <div className="flex-1 flex flex-col bg-slate-50">
      <div className="p-4 bg-amber-500 text-white border-b-4 border-black font-black italic">淘货网 // 余额: ¥{gameState.stats.money}</div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {gameState.phone.products.map(p => (
          <div key={p.id} className="bg-white border-4 border-black p-4 flex flex-col shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
             <div className="flex justify-between items-start">
               <span className="font-black text-sm">{p.name}</span>
               <span className="font-mono font-black text-amber-600 italic">¥{p.price}</span>
             </div>
             <p className="text-[10px] text-slate-500 italic mt-2 leading-relaxed">{p.description}</p>
             <button onClick={() => { if(gameState.stats.money >= p.price) { onUpdateStats({money: -p.price, ...p.impact}); alert('购买成功！'); } else alert('余额不足。'); }} className="mt-4 w-full py-2 bg-black text-white text-[10px] font-black uppercase border-2 border-black active:translate-y-1">立即购买</button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-[320px] h-[640px] bg-slate-900 border-[8px] border-black rounded-[40px] flex flex-col overflow-hidden animate-up">
        <div className="flex-1 m-2 bg-white rounded-[30px] flex flex-col overflow-hidden relative border-4 border-slate-800">
           <div className="h-6 bg-black text-white px-6 flex items-center justify-between text-[7px] font-black shrink-0">
              <div className="flex gap-2"><span>3G</span><span>📶</span></div>
              <div className="font-mono">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
              <div className="flex items-center gap-1"><span>🔋</span><span>45%</span></div>
           </div>
           <div className="flex-1 flex flex-col overflow-hidden relative">
              {activeApp === 'HOME' && renderHome()}
              {activeApp === 'SOCIAL' && renderSocial()}
              {activeApp === 'YUEYUE' && renderYueYue()}
              {activeApp === 'TG' && renderTG()}
              {activeApp === 'LOAN' && renderLoan()}
              {activeApp === 'VIDEO' && renderVideo()}
              {activeApp === 'SHOP' && renderShop()}
           </div>
           <div className="h-14 border-t-4 border-black bg-white flex items-center justify-around shrink-0 z-50">
              <button onClick={() => setActiveApp('HOME')} className="text-xl">🏠</button>
              <button onClick={() => setActiveApp('SOCIAL')} className="text-xl relative">✉{unreadCount > 0 && <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full"></div>}</button>
              <button onClick={() => setActiveApp('TG')} className="text-xl">✈</button>
              <button onClick={() => setActiveApp('LOAN')} className="text-xl">💰</button>
           </div>
        </div>
        <div className="h-10 flex items-center justify-center cursor-pointer" onClick={onClose}><div className="w-8 h-8 rounded-full border-2 border-slate-700"></div></div>
      </div>
    </div>
  );
};

export default PhoneSystem;
