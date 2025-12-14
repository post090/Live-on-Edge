
import React from 'react';

interface Props {
  className?: string;
  isSmall?: boolean;
  speakerId?: 'PLAYER' | 'TEACHER' | 'MOTHER' | 'THUG' | 'OLD_MINER' | 'BOSS';
}

const ArtisticAvatar: React.FC<Props> = ({ className, speakerId = 'PLAYER' }) => {
  const getColors = () => {
    switch(speakerId) {
      case 'TEACHER': return { face: '#f8f8f8', hair: '#333', accent: '#444' };
      case 'MOTHER': return { face: '#fffaf0', hair: '#555', accent: '#888' };
      case 'THUG': return { face: '#ddd', hair: '#000', accent: '#ff0000' };
      case 'OLD_MINER': return { face: '#bbb', hair: '#222', accent: '#000' };
      case 'BOSS': return { face: '#eee', hair: '#111', accent: '#ff0080' }; // 娜姐的颜色
      default: return { face: '#fff', hair: '#111', accent: '#ff0080' }; // 主角：带点病态粉
    }
  };

  const colors = getColors();

  return (
    <div className={`relative overflow-hidden bg-black ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="50" cy="50" r="45" fill="#0a0a0a" />
        
        {/* 脸部：更清瘦的轮廓 */}
        <path d="M50 25C38 25 30 38 30 55C30 72 40 82 50 82C60 82 70 72 70 55C70 38 62 25 50 25Z" fill={colors.face} fillOpacity="0.95" />
        
        {/* 发型：针对女性特征优化 */}
        {speakerId === 'PLAYER' ? (
          <path d="M30 50Q30 20 50 20Q70 20 70 50L75 80L25 80Z" fill={colors.hair} /> // 长发遮面
        ) : speakerId === 'MOTHER' ? (
          <path d="M30 55C30 35 40 25 50 25C60 25 70 35 70 55Q70 45 50 45Q30 45 30 55Z" fill={colors.hair} />
        ) : speakerId === 'BOSS' ? (
          <path d="M25 40Q25 15 50 15Q75 15 75 40L80 70Q50 60 20 70Z" fill={colors.hair} /> // 娜姐的大波浪感
        ) : (
          <path d="M30 40Q50 10 70 40L75 60H25L30 40Z" fill={colors.hair} />
        )}

        {/* 眼睛：更深沉或带有妆感 */}
        {speakerId === 'PLAYER' ? (
          <g>
            <path d="M38 55L48 56" stroke={colors.accent} strokeWidth="2" />
            <path d="M52 56L62 55" stroke={colors.accent} strokeWidth="2" />
            <circle cx="43" cy="55" r="1.5" fill="#000" />
            <circle cx="57" cy="55" r="1.5" fill="#000" />
          </g>
        ) : (
          <g>
            <rect x="38" y="55" width="10" height="1.5" fill="#000" />
            <rect x="52" y="55" width="10" height="1.5" fill="#000" />
          </g>
        )}

        {/* 嘴部：更小的轮廓，唇蜜感 */}
        <path d="M46 72Q50 75 54 72" stroke={speakerId === 'PLAYER' ? colors.accent : '#000'} strokeWidth="1" fill="none" />
        
        <path d="M42 82L35 100H65L58 82" fill={colors.face} />
      </svg>
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
    </div>
  );
};

export default ArtisticAvatar;
