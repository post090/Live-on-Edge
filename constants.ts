
import { GameState, LocationInfo } from './types.ts';

export const INITIAL_POINTS = 20;

export const DAYS_OF_WEEK = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

export const AVATAR_OPTIONS = {
  hair: [
    { id: 'messy', label: '乱糟糟的短发', impact: '给人一种野狗般的生命力' },
    { id: 'ponytail', label: '高束的马尾', impact: '显得干净利落，像个学生' },
    { id: 'short', label: '齐耳学生头', impact: '一种被规训的、胆怯的气质' },
    { id: 'braids', label: '粗壮的麻花辫', impact: '充满乡土气息，容易让人生出同情或轻视' },
    { id: 'shaggy', label: '盖住眼睛的长碎', impact: '非主流的颓废感，惹人侧目' },
    { id: 'shaved', label: '近乎板寸的短发', impact: '极端的叛逆，NPC会感到畏惧' },
  ],
  eyes: [
    { id: 'tired', label: '深陷的黑眼圈', impact: '透着长久的疲惫' },
    { id: 'sharp', label: '锐利的鹰眼', impact: '让人不敢轻易欺骗你' },
    { id: 'calm', label: '死水般的平静', impact: '对苦难已经麻木' },
    { id: 'sad', label: '湿漉漉的泪眼', impact: '容易激发强者的控制欲' },
    { id: 'hollow', label: '瞳孔涣散', impact: '看起来精神处于崩溃边缘' },
  ],
  expression: [
    { id: 'neutral', label: '嘴角下垂的木然' },
    { id: 'grim', label: '紧咬牙关的愤怒' },
    { id: 'sneer', label: '带着挑衅的冷笑' },
    { id: 'stoic', label: '毫无波动的隐忍' },
    { id: 'lost', label: '茫然无措的惊恐' },
  ],
  outfit: [
    { id: 'padded', label: '油腻的黑棉袄' },
    { id: 'uniform', label: '开线的校服' },
    { id: 'denim', label: '磨损严重的牛仔套装' },
    { id: 'trendy', label: '盗版的阿迪达斯' },
    { id: 'work', label: '沾着煤灰的工服' },
  ],
  accessory: [
    { id: 'none', label: '无' },
    { id: 'scarf', label: '褪色的红围巾' },
    { id: 'glasses', label: '胶带缠绕的眼镜' },
    { id: 'bandage', label: '额头的陈旧纱布' },
    { id: 'earrings', label: '廉价的塑料耳钉' },
  ]
};

export const LOCATIONS: LocationInfo[] = [
  // 矿镇区域 (起始)
  { id: 'HOME', name: '破败的家', description: '唯一的避风港。', color: 'bg-slate-600', icon: '◒', area: 'MINING_TOWN' },
  { id: 'SCHOOL', name: '子弟中学', description: '逃离泥潭的唯一窄门。', color: 'bg-emerald-700', icon: '⧉', area: 'MINING_TOWN' },
  { id: 'RUINS', name: '矿区废墟', description: '被遗弃的钢铁尸骸。', color: 'bg-stone-500', icon: '▲', area: 'MINING_TOWN' },
  { id: 'CLUB', name: '红太阳厅', description: '廉价的迪斯科与欲望。', color: 'bg-indigo-800', icon: '✦', area: 'MINING_TOWN' },
  { id: 'MINE', name: '非法小矿井', description: '黑暗深处有金钱也有坟墓。', color: 'bg-zinc-900', icon: '◈', area: 'MINING_TOWN' },
  
  // 省城区域
  { id: 'STATION', name: '省城火车站', description: '外地人的第一场噩梦。', color: 'bg-blue-900', icon: '⇄', area: 'PROVINCIAL_CAPITAL' },
  { id: 'BASEMENT', name: '群租房', description: '尊严比空气还稀薄。', color: 'bg-zinc-700', icon: '⬚', area: 'PROVINCIAL_CAPITAL' },
  { id: 'FACTORY', name: '制衣流水线', description: '吞噬时间的钢铁机器。', color: 'bg-amber-800', icon: '⚙', area: 'PROVINCIAL_CAPITAL' },
  { id: 'BAR', name: '不夜城娱乐会所', description: '在这里，容貌就是唯一的货币。', color: 'bg-purple-900', icon: '⚛', area: 'PROVINCIAL_CAPITAL' },
  { id: 'OVERPASS', name: '天桥底下', description: '这是没有去处者的去处。', color: 'bg-slate-500', icon: '⩔', area: 'PROVINCIAL_CAPITAL' },

  // 边境城镇
  { id: 'BORDER_GATE', name: '国境线卡口', description: '再走一步就是另一种人生。', color: 'bg-red-950', icon: '⚔', area: 'BORDER_TOWN' },
  { id: 'TRUCK_STOP', name: '货运中继站', description: '充满了流浪汉和暴躁的司机。', color: 'bg-orange-900', icon: '🚛', area: 'BORDER_TOWN' },
];

export const AREA_LABELS = {
  MINING_TOWN: '故土 // 衰败矿区',
  PROVINCIAL_CAPITAL: '远方 // 省级中心',
  BORDER_TOWN: '尽头 // 边境黑市',
};

export const INITIAL_GAME_STATE: GameState = {
  day: 1,
  timeOfDay: 'MORNING',
  attributes: { intelligence: 4, appearance: 4, stamina: 4, resilience: 4, savviness: 4 },
  avatar: { hair: 'messy', eyes: 'tired', expression: 'neutral', outfit: 'padded', accessory: 'none' },
  stats: { satiety: 80, hygiene: 90, mood: 70, money: 150, academic: 30, corruption: 0 },
  history: ["2004年的雪天，你站在破损的镜子前。"],
  location: "破败的家",
  currentArea: 'MINING_TOWN',
  isTrapped: false,
};

export const TIME_ORDER: ('MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT')[] = ['MORNING', 'AFTERNOON', 'EVENING', 'NIGHT'];

export const TIME_LABELS: Record<string, string> = {
  MORNING: '清晨', AFTERNOON: '午后', EVENING: '傍晚', NIGHT: '深夜',
};
