
export interface Attributes {
  intelligence: number; // 智力
  appearance: number;   // 魅力
  stamina: number;      // 体力
  resilience: number;   // 韧性
  savviness: number;    // 心眼
}

export interface AvatarConfig {
  hair: string;
  eyes: string;
  accessory: string;
  outfit: string;
  expression: string;
}

export interface Stats {
  satiety: number;
  hygiene: number;
  mood: number;
  money: number;
  academic: number;
  corruption: number;
}

// Add missing LocationInfo interface to resolve errors in multiple files
export interface LocationInfo {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  area: 'MINING_TOWN' | 'PROVINCIAL_CAPITAL' | 'BORDER_TOWN';
  isTrap?: boolean;
}

export interface GameState {
  day: number;
  timeOfDay: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT';
  attributes: Attributes;
  avatar: AvatarConfig;
  stats: Stats;
  history: string[];
  location: string;
  currentArea: 'MINING_TOWN' | 'PROVINCIAL_CAPITAL' | 'BORDER_TOWN'; // 当前大区域
  isTrapped: boolean;
  trapType?: 'HOSPITAL' | 'PRISON' | 'LOCKED_HOME';
  lastUpdate?: string;
}

export interface AIRootResponse {
  title: string;
  description: string;
  is_final: boolean;
  new_area?: 'MINING_TOWN' | 'PROVINCIAL_CAPITAL' | 'BORDER_TOWN'; // 可选：触发区域切换
  choices: {
    text: string;
    impact_description: string;
    stat_changes: Partial<Stats>;
    escape_attempt?: boolean;
  }[];
}