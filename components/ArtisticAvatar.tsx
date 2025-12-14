
import React from 'react';

interface Props {
  className?: string;
  isSmall?: boolean;
}

const ArtisticAvatar: React.FC<Props> = ({ className, isSmall }) => {
  return (
    <div className={`relative overflow-hidden bg-black ${className}`}>
      {/* 极简高对比度人像 SVG */}
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* 背景光晕感 */}
        <circle cx="50" cy="50" r="45" fill="#111" />
        {/* 脸部轮廓 - 极简主义 */}
        <path d="M50 20C35 20 25 35 25 55C25 75 40 85 50 85C60 85 75 75 75 55C75 35 65 20 50 20Z" fill="#fff" fillOpacity="0.9" />
        {/* 发型 - 边缘锋利的碎发感 */}
        <path d="M25 50C25 30 40 15 50 15C60 15 75 30 75 50L80 60L75 55C70 45 60 40 50 40C40 40 30 45 25 55L20 60L25 50Z" fill="#000" />
        <path d="M45 15L35 30L25 45L30 35Z" fill="#000" />
        <path d="M55 15L65 30L75 45L70 35Z" fill="#000" />
        {/* 眼神 - 极简的一道横线，透着冰冷 */}
        <rect x="38" y="55" width="10" height="1.5" fill="#000" />
        <rect x="52" y="55" width="10" height="1.5" fill="#000" />
        {/* 脖子与肩膀 */}
        <path d="M40 85L30 100H70L60 85" fill="#fff" />
        {/* 阴影与质感线 */}
        <path d="M25 55Q25 75 50 85" stroke="#000" strokeWidth="0.5" />
      </svg>
      {/* 边缘颗粒感/噪点叠加 (CSS 模拟) */}
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
    </div>
  );
};

export default ArtisticAvatar;
