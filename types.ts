
export interface Attributes {
  intelligence: number;
  appearance: number;
  stamina: number;
  resilience: number;
  savviness: number;
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
  debt: number; // 新增债务字段
  academic: number;
  corruption: number;
  stamina: number;
  resilience: number;
  savviness: number;
  intelligence: number;
  appearance: number;
}

export interface MessageOption {
  text: string;
  impact: Partial<Stats>;
  replyText: string;
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  isRead: boolean;
  impact?: Partial<Stats>;
  options?: MessageOption[];
  selectedOptionIndex?: number;
  attribute_requirement?: {
    attr: keyof Attributes;
    min: number;
    hidden_text: string;
  };
}

export interface VideoComment {
  user: string;
  content: string;
}

export interface ShortVideo {
  id: string;
  author: string;
  description: string;
  tags: string[];
  impact: Partial<Stats>;
  likes: number;
  isLiked?: boolean;
  comments: VideoComment[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  impact: Partial<Stats>;
}

export interface PhoneState {
  isOpen: boolean;
  messages: Message[];
  videos: ShortVideo[];
  products: Product[];
  activeApp: 'HOME' | 'SOCIAL' | 'VIDEO' | 'SHOP' | 'YUEYUE' | 'TG' | 'LOAN'; // 新增三个APP
}

export interface LocationInfo {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  area: 'MINING_TOWN' | 'PROVINCIAL_CAPITAL' | 'BORDER_TOWN';
  isTrap?: boolean;
}

export interface Choice {
  text: string;
  impact_description: string;
  stat_changes: Partial<Stats>;
  next_event?: AIRootResponse;
  unlock_message?: Message;
  new_area?: 'MINING_TOWN' | 'PROVINCIAL_CAPITAL' | 'BORDER_TOWN';
  attribute_overrides?: {
    attribute: keyof Attributes;
    min_value: number;
    impact_description: string;
    stat_changes?: Partial<Stats>;
    next_event?: AIRootResponse;
  }[];
}

export interface AIRootResponse {
  title: string;
  description: string;
  is_final: boolean;
  choices: Choice[];
  speakerId?: 'PLAYER' | 'TEACHER' | 'MOTHER' | 'THUG' | 'OLD_MINER' | 'BOSS';
}

export interface GameState {
  day: number;
  timeOfDay: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT';
  attributes: Attributes;
  avatar: AvatarConfig;
  stats: Stats;
  history: string[];
  location: string;
  currentArea: 'MINING_TOWN' | 'PROVINCIAL_CAPITAL' | 'BORDER_TOWN';
  isTrapped: boolean;
  phone: PhoneState;
}
