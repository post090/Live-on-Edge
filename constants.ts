
import { GameState, LocationInfo, AIRootResponse, Message, ShortVideo, Product } from './types';

export const INITIAL_POINTS = 20;
export const DAYS_OF_WEEK = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
export const TIME_ORDER: ('MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT')[] = ['MORNING', 'AFTERNOON', 'EVENING', 'NIGHT'];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    sender: '母亲',
    content: '妮儿，你要是真去了省城，一定要给妈打个电话。外面人心狠，别听那些男的瞎忽悠。',
    time: '07:30',
    isRead: false,
    impact: { mood: 10, resilience: 1 },
    options: [
      { text: "妈，我会有出息的。", impact: { mood: 5 }, replyText: "我知道，外面冷，记得穿厚点。" }
    ]
  }
];

export const INITIAL_VIDEOS: ShortVideo[] = [
  {
    id: 'v1',
    author: '省城娜姐',
    description: '这里的香水味能盖住一切。欢迎来到地狱，或者天堂。',
    tags: ['#省城夜色', '#逆袭'],
    likes: 120,
    impact: { corruption: 2, mood: -2 },
    comments: [{ user: '迷途羊', content: '娜姐，我到站了。' }]
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: '假发片', price: 20, description: '能掩盖你因为营养不良和压力掉落的头发。', impact: { appearance: 5 } },
  { id: 'p2', name: '廉价香水', price: 45, description: '刺鼻的香味，能压住矿区的煤烟味。', impact: { appearance: 10, corruption: 5 } },
];

export const GRAY_TASKS = [
  { id: 'tg1', name: '放哨单', reward: 100, risk: '低', corruption: 5, stamina: -20, desc: '在城西废弃仓库门口待两小时，看到巡逻车按三次喇叭。' },
  { id: 'tg2', name: '背货单', reward: 500, risk: '极高', corruption: 20, stamina: -40, desc: '把一包密封的“茶叶”从火车站带到北郊宾馆。不要拆开看。' },
  { id: 'tg3', name: '洗水单', reward: 200, risk: '中', corruption: 10, stamina: -10, desc: '帮“陈哥”用你的身份证去银行取一笔钱。' }
];

export const YUEYUE_USERS = [
  { id: 'u1', name: '孤独的大哥', dist: '0.5km', bio: '只想找个单纯的妹子聊聊天。', impact: { money: 50, corruption: 5, mood: 10 } },
  { id: 'u2', name: '夜色温柔', dist: '1.2km', bio: '出来喝一杯？我买单。', impact: { corruption: 15, satiety: 20, mood: 5 } },
  { id: 'u3', name: '矿上小狼', dist: '3.0km', bio: '想找个听话的，懂的来。', impact: { money: -20, stamina: -30, corruption: 10 } }
];

export const LOCATIONS: LocationInfo[] = [
  // 遗忘的矿区
  { id: 'HOME', name: '霉味的家', description: '除了母爱，这里一无所有。', color: 'bg-slate-700', icon: '🏚', area: 'MINING_TOWN' },
  { id: 'SCHOOL', name: '高三二班', description: '充满粉笔灰和欺凌的教室。', color: 'bg-emerald-900', icon: '🏫', area: 'MINING_TOWN' },
  { id: 'STATION', name: '火车站', description: '逃离或堕入的起点。', color: 'bg-blue-900', icon: '🚉', area: 'MINING_TOWN' },
  { id: 'CLUB', name: '红太阳舞厅', description: '希望的墓地。', color: 'bg-indigo-950', icon: '💃', area: 'MINING_TOWN' },
  { id: 'MINING_AREA', name: '矿区废墟', description: '穷人的博弈场。', color: 'bg-zinc-950', icon: '🏭', area: 'MINING_TOWN' },
  { id: 'BATHHOUSE', name: '公共澡堂', description: '水汽氤氲中，藏着洗不净的伤痕。', color: 'bg-sky-900', icon: '♨', area: 'MINING_TOWN' },
  
  // 繁华的毒药（省城）
  { id: 'WANDA', name: '万达广场', description: '刺眼的霓虹，昂贵的空气。', color: 'bg-rose-900', icon: '🏢', area: 'PROVINCIAL_CAPITAL' },
  { id: 'SLUM', name: '城中村出租屋', description: '霉味更重，但多了些罪恶。', color: 'bg-stone-800', icon: '⛺', area: 'PROVINCIAL_CAPITAL' },
  { id: 'NIGHT_CLUB', name: '金色殿堂', description: '娜姐真正的领地。', color: 'bg-purple-950', icon: '🔮', area: 'PROVINCIAL_CAPITAL' },
  { id: 'BUS_STATION', name: '长途汽车站', description: '通向更远处的迷雾。', color: 'bg-gray-700', icon: '🚌', area: 'PROVINCIAL_CAPITAL' },
];

export const LOCATION_INTERACTIONS: Record<string, Record<string, AIRootResponse>> = {
  HOME: {
    MORNING: {
      title: "清晨的稀粥",
      description: "母亲在厨房忙活，碗里只有几粒米。'妮儿，多喝点汤。' 她避开你的目光。桌角的电费单已经逾期三个月了。",
      is_final: true,
      speakerId: 'MOTHER',
      choices: [
        { text: "默默喝完", impact_description: "这是她能给的全部了。", stat_changes: { satiety: 10, mood: 5 } },
        { text: "放下筷子说不饿", impact_description: "你把仅剩的口粮留给了她，腹部的绞痛让你清醒。", stat_changes: { satiety: -5, mood: -5, resilience: 5 } }
      ]
    },
    EVENING: {
      title: "昏黄的灯火",
      description: "家里唯一的白炽灯闪烁着。母亲在缝补你的校服，眼神浑浊。'妮儿，妈没本事，考不上大学，就去镇上找个好人家吧。' ",
      is_final: true,
      speakerId: 'MOTHER',
      choices: [{ text: "沉默不语", impact_description: "你看着窗外漆黑的矿井，那是你不想进去的坟墓。", stat_changes: { mood: -5, resilience: 1 } }]
    }
  },
  BATHHOUSE: {
    MORNING: {
      title: "水汽中的宁静",
      description: "在这个漏风的澡堂里，难得有还没变凉的温水。你脱下厚重的校服，水柱冲刷着由于营养不良而发青的肩膀。",
      is_final: true,
      choices: [{ text: "彻底清洗", impact_description: "虽然肥皂沫很少，但你觉得久违的干净。", stat_changes: { hygiene: 30, mood: 10, stamina: 5 } }]
    },
    NIGHT: {
      title: "红肿与流言",
      description: "深夜的澡堂水温冰凉。几个在红太阳上班的女人正在聊天，背上的抓痕在灯光下触目惊心。她们看着你，眼神里有同情，更多的是嘲弄：'小妮儿，别装清高，迟早的事。'",
      is_final: true,
      choices: [
        { text: "低头洗浴", impact_description: "你试图洗掉她们那种黏糊糊的话语。", stat_changes: { hygiene: 15, mood: -10, resilience: 5 } },
        { text: "偷听她们谈论‘省城单子’", impact_description: "你记住了几个词：‘纸飞机’、‘背货’。", stat_changes: { savviness: 10, corruption: 5 } }
      ]
    }
  },
  SCHOOL: {
    MORNING: {
      title: "粉笔灰的窒息",
      description: "黑板上的倒计时‘30天’被老李画了个圈。'看看你们，现在不吃苦，以后下井去吃土！' 同座的富二代在桌下玩着最新款手机，而你的书包带已经断了三次。",
      is_final: true,
      speakerId: 'TEACHER',
      choices: [
        { text: "死命刷题", impact_description: "这是你唯一的救命稻草。", stat_changes: { academic: 10, intelligence: 2, mood: -10 } },
        { text: "呆呆望着黑板", impact_description: "公式在你眼里像是一条条蠕动的虫子。", stat_changes: { mood: -5, academic: -2 } }
      ]
    },
    AFTERNOON: {
      title: "走廊里的霸凌",
      description: "几个穿着名牌运动服的女生把你围在角落。'听说你妈在澡堂给人搓背？真臭。' 她们哄笑着，把脏水泼在你干净的校服上。",
      is_final: true,
      choices: [
        { text: "握紧拳头忍耐", impact_description: "你的指甲深深掐进肉里，这是成长的代价。", stat_changes: { resilience: 10, mood: -20 } },
        { text: "猛地推开她们", impact_description: "你反击了，但也意味着你彻底被这个‘干净’的班级排挤。", stat_changes: { savviness: 5, mood: -5, stamina: -5 } }
      ]
    }
  },
  CLUB: {
    EVENING: {
      title: "燥热的舞池",
      description: "红太阳舞厅的音箱劣质，低音震得窗户发抖。陈哥递给你一支细长的烟：'妮儿，这才是活着。那帮老外才不管你是不是学生，给钱就是爷。'",
      is_final: true,
      speakerId: 'THUG',
      choices: [
        { text: "接过烟，试着吸一口", impact_description: "烟雾挡住了灰暗的现实，你学会了赔笑。", stat_changes: { corruption: 10, mood: 15, money: 20, appearance: 2 } },
        { text: "帮他去后台拿个包", impact_description: "你在秘密中越走越远。", stat_changes: { money: 50, corruption: 5, savviness: 5 } }
      ]
    },
    NIGHT: {
      title: "霓虹下的交易",
      description: "娜姐把你叫到一旁，递给你一套豹纹裙子：'换上，有个老板想见见所谓的“矿区之花”。别给我丢脸。'",
      is_final: true,
      speakerId: 'BOSS',
      choices: [
        { text: "去更衣室换上", impact_description: "镜子里的女孩陌生得让你害怕。", stat_changes: { money: 100, corruption: 20, appearance: 10, mood: -30 } },
        { text: "拒绝并离开", impact_description: "你保住了最后一点尊严，但陈哥看你的眼神变得冰冷。", stat_changes: { mood: 10, money: -20, resilience: 5 } }
      ]
    }
  },
  MINING_AREA: {
    AFTERNOON: {
      title: "深渊的喘息",
      description: "废弃的矿井像一张黑洞洞的大嘴。你在这里捡煤渣，打算拿回去给母亲。'女娃子，别在这晃悠，这土层不稳。' 一个满脸煤灰的老矿工路过。",
      is_final: true,
      speakerId: 'OLD_MINER',
      choices: [
        { text: "分他一截捡到的烟屁股", impact_description: "他笑了，露出缺了的门牙，告诉了你一些矿上的陈年往事。", stat_changes: { savviness: 5, mood: 5 } },
        { text: "埋头继续捡", impact_description: "每一点煤渣都是冬天的温度。", stat_changes: { stamina: -10, satiety: -5, resilience: 2 } }
      ]
    }
  },
  STATION: {
    MORNING: {
      title: "铁轨的震动",
      description: "一列绿皮火车吐着白烟靠站了。陈哥靠在柱子上：'妮儿，想通了吗？这一走，可就没回头路了。'",
      is_final: true,
      speakerId: 'THUG',
      choices: [
        { text: "接过票，踏进车厢", impact_description: "随着汽笛声，矿区的烟囱越来越远。你感觉到一种报复性的快感。", stat_changes: { money: -50, academic: -20, corruption: 10, mood: 15 }, new_area: 'PROVINCIAL_CAPITAL' },
        { text: "我还是回去上课吧", impact_description: "你把票揉成一团。陈哥冷笑：'随你，妮儿。'", stat_changes: { mood: -10, resilience: 5 } }
      ]
    }
  },
  // 省城事件
  WANDA: {
    AFTERNOON: {
      title: "玻璃墙里的影子",
      description: "万达广场明亮的玻璃倒映出你发黄的校服。路过的白领皱着眉避开你。一个柜姐正盯着你，手里的对讲机已经拿了起来。",
      is_final: true,
      choices: [{ text: "快速离开", impact_description: "这种被世界排挤的感觉让你想呕吐。", stat_changes: { mood: -15, resilience: 2 } }]
    }
  },
  SLUM: {
    NIGHT: {
      title: "隔墙的喘息",
      description: "出租屋的木板墙薄得像纸。隔壁传来咒骂声。你缩在霉味的被子里，手机屏幕亮着，“约约”上那个“孤独的大哥”一直发消息。",
      is_final: true,
      choices: [
        { text: "回复：你在哪？", impact_description: "你开始了第二次博弈。", stat_changes: { corruption: 15, mood: -10 } },
        { text: "蒙头睡觉", impact_description: "你试图逃避，但明天要交房租。", stat_changes: { mood: -20, satiety: -10 } }
      ]
    }
  },
  NIGHT_CLUB: {
    NIGHT: {
      title: "重低音的葬礼",
      description: "省城的金色殿堂比红太阳奢华百倍。男人把钞票塞进你衣领，娜姐在一旁抽烟，眼神冰冷：'别掉眼泪，妆花了老板会生气。'",
      is_final: true,
      speakerId: 'BOSS',
      choices: [{ text: "咬牙赔笑", impact_description: "你赚了钱，丢了灵魂。", stat_changes: { money: 300, corruption: 20, appearance: -2, mood: -40 } }]
    }
  }
};

export const TIME_LABELS: Record<string, string> = { MORNING: '清晨', AFTERNOON: '午后', EVENING: '傍晚', NIGHT: '深夜' };
export const AREA_LABELS = { MINING_TOWN: '被遗忘的矿区', PROVINCIAL_CAPITAL: '繁华的毒药', BORDER_TOWN: '最后的绝地' };
export const PLOT_TIMELINE: Record<number, { title: string, hook: string, npc: string }> = {
  1: { title: "最后的春寒", hook: "高考的倒计时在黑板上吱嘎作响。", npc: "老李" },
  2: { title: "破旧的野心", hook: "你听见有人在火车站谈论省城的灯火。", npc: "陈哥" },
};

export const INITIAL_GAME_STATE: GameState = {
  day: 1,
  timeOfDay: 'MORNING',
  attributes: { intelligence: 3, appearance: 6, stamina: 3, resilience: 5, savviness: 3 },
  avatar: { hair: 'ponytail', eyes: 'tired', expression: 'stoic', outfit: 'uniform', accessory: 'none' },
  stats: { satiety: 60, hygiene: 50, mood: 40, money: 8, debt: 0, academic: 4, corruption: 10, stamina: 100, resilience: 100, savviness: 3, intelligence: 3, appearance: 6 },
  history: ["2014年春，高考倒计时30天。你是这矿镇泥潭里的一朵野花。"],
  location: "高三二班",
  currentArea: 'MINING_TOWN',
  isTrapped: false,
  phone: { isOpen: false, messages: INITIAL_MESSAGES, videos: INITIAL_VIDEOS, products: INITIAL_PRODUCTS, activeApp: 'HOME' }
};

export const STORY_SCRIPT: Record<number, Record<string, AIRootResponse>> = {
  1: {
    SCHOOL: {
      title: "宿命的第一课",
      description: "老李拍着桌子：'女同学更要注意！' ",
      is_final: true,
      speakerId: 'TEACHER',
      choices: [{ text: "咬牙忍耐", impact_description: "你死死盯着窗外。", stat_changes: { resilience: 2 } }]
    }
  }
};

export const FAINT_EVENTS: Record<string, AIRootResponse> = {
  HOME: {
    title: "虚弱的梦境",
    description: "你在充满霉味的床上醒来。母亲正红着眼眶给你擦汗。'妮儿，咱不拼了，命要紧。'",
    is_final: true,
    speakerId: 'MOTHER',
    choices: [{ text: "默默流泪", impact_description: "温热的泪水滑入发鬓。", stat_changes: { mood: 5, resilience: 2 } }]
  },
  DEFAULT: {
    title: "漆黑的断点",
    description: "世界在旋转中崩塌。当你醒来，发现自己躺在冰冷的地上。",
    is_final: true,
    choices: [{ text: "挣扎坐起", impact_description: "醒来了。", stat_changes: { stamina: 10 } }]
  }
};

export const AVATAR_OPTIONS = {
  hair: [{ id: 'ponytail', label: '马尾', impact: '学生样' }, { id: 'bleached', label: '漂染', impact: '边缘感' }],
  eyes: [{ id: 'tired', label: '疲惫', impact: '劳累' }, { id: 'hooked', label: '勾魂', impact: '警觉' }],
  expression: [{ id: 'stoic', label: '隐忍' }, { id: 'numb', label: '木然' }],
  outfit: [{ id: 'uniform', label: '校服' }, { id: 'leopard', label: '豹纹' }],
  accessory: [{ id: 'none', label: '无' }, { id: 'piercing', label: '唇钉' }],
};
