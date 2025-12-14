
import { GameState, LocationInfo, AIRootResponse, Message, ShortVideo, Product } from './types';

export const INITIAL_POINTS = 20;
export const DAYS_OF_WEEK = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
export const TIME_ORDER: ('MORNING' | 'FORENOON' | 'AFTERNOON' | 'DUSK' | 'NIGHT' | 'MIDNIGHT')[] = 
  ['MORNING', 'FORENOON', 'AFTERNOON', 'DUSK', 'NIGHT', 'MIDNIGHT'];

export const TIME_LABELS: Record<string, string> = { 
  MORNING: '清晨', 
  FORENOON: '上午', 
  AFTERNOON: '下午', 
  DUSK: '黄昏', 
  NIGHT: '夜晚', 
  MIDNIGHT: '午夜' 
};

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    sender: '母亲',
    content: '妮儿，你要是真去了省城，一定要给妈打个电话。外面人心狠，别听那些男的忽悠。',
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

export const LOCATIONS: LocationInfo[] = [
  // 矿镇区域
  { id: 'HOME', name: '霉味的家', description: '除了母爱，这里一无所有。', color: 'bg-slate-700', icon: '🏚', area: 'MINING_TOWN' },
  { id: 'SCHOOL', name: '高三二班', description: '充满了粉笔灰与绝望。', color: 'bg-emerald-900', icon: '🏫', area: 'MINING_TOWN' },
  { id: 'STATION', name: '火车站', description: '逃离或堕入的起点。', color: 'bg-blue-900', icon: '🚉', area: 'MINING_TOWN' },
  { id: 'CLUB', name: '红太阳舞厅', description: '希望的墓地。', color: 'bg-indigo-950', icon: '💃', area: 'MINING_TOWN' },
  { id: 'MINING_AREA', name: '矿区废墟', description: '穷人的博弈场。', color: 'bg-zinc-950', icon: '🏭', area: 'MINING_TOWN' },
  { id: 'BATHHOUSE', name: '公共澡堂', description: '洗不净的伤痕。', color: 'bg-sky-900', icon: '♨', area: 'MINING_TOWN' },
  // 省城区域
  { id: 'WANDA', name: '万达广场', description: '刺眼的霓虹，昂贵的空气。', color: 'bg-rose-900', icon: '🏢', area: 'PROVINCIAL_CAPITAL' },
  { id: 'SLUM', name: '城中村出租屋', description: '霉味更重，但多了些罪恶。', color: 'bg-stone-800', icon: '⛺', area: 'PROVINCIAL_CAPITAL' },
  { id: 'NIGHT_CLUB', name: '金色殿堂', description: '省城顶级的销金窟。', color: 'bg-purple-950', icon: '🔮', area: 'PROVINCIAL_CAPITAL' },
  { id: 'BUS_STATION', name: '长途汽车站', description: '通向更远处的迷雾。', color: 'bg-gray-700', icon: '🚌', area: 'PROVINCIAL_CAPITAL' },
];

export const LOCATION_INTERACTIONS: Record<string, Record<string, AIRootResponse>> = {
  HOME: {
    MORNING: {
      title: "清晨的稀粥",
      description: "母亲在狭小的厨房里忙活，碗里只有几粒米。'妮儿，多喝点汤，长身体。' 她始终避开你的目光，桌角那张逾期三个月的电费单在寒风中微微抖动。",
      is_final: true,
      speakerId: 'MOTHER',
      choices: [
        { text: "默默喝完清汤", impact_description: "这是她能给你的全部了，虽然肚子还是很空。", stat_changes: { satiety: 8, mood: 5, resilience: 2 } },
        { text: "借口说不饿", impact_description: "你把口粮留给了她，腹部的绞痛让你更加清醒。", stat_changes: { satiety: -5, mood: -5, resilience: 8 } },
        { text: "盯着电费单发呆", impact_description: "那一串红色的数字像烙印一样烫在你的心上。", stat_changes: { mood: -12, savviness: 3 } }
      ]
    },
    AFTERNOON: {
      title: "催债的阴影",
      description: "急促的敲门声打破了午后的死寂。是矿上的陈哥，他吐着烟圈：'妮儿，你妈欠的那点钱，到底什么时候能清？没钱的话，人过来顶也行啊。'",
      is_final: true,
      speakerId: 'THUG',
      choices: [
        { text: "紧紧反锁房门", impact_description: "你在恐惧中瑟瑟发抖，直到门外的咒骂声消失。", stat_changes: { mood: -20, resilience: 5, stamina: -5 } },
        { text: "隔着门哀求他", impact_description: "你用最卑微的语气争取到了三天时间。", stat_changes: { resilience: -10, savviness: 5, mood: -15 } },
        { text: "从窗缝偷看他的车", impact_description: "那辆黑色的轿车，是你从未见过的奢华，也是深渊的入口。", stat_changes: { corruption: 10, savviness: 8, mood: -5 } }
      ]
    },
    MIDNIGHT: {
      title: "黑暗中的寒意",
      description: "窗外是矿镇特有的、充满霉味的夜色。你蜷缩在被子里，感觉这间漏雨的小屋像是一艘正在下沉的破船，随时会被贫穷吞没。",
      is_final: true,
      choices: [
        { text: "握紧生锈的剪刀", impact_description: "冰冷的金属是你在黑暗中唯一的安全感。", stat_changes: { resilience: 10, mood: -5, savviness: 2 } },
        { text: "听着隔壁母亲的咳嗽", impact_description: "每一声咳嗽都在提醒你，时间不多了。", stat_changes: { mood: -15, resilience: 12 } },
        { text: "强迫自己进入梦境", impact_description: "在梦里，你已经飞到了省城。", stat_changes: { stamina: 15, mood: 5, satiety: -2 } }
      ]
    }
  },
  SCHOOL: {
    FORENOON: {
      title: "粉笔灰下的窒息",
      description: "老李在黑板上飞快地写着数学公式。'看看你们，现在不吃苦，以后就去下井！' 他手中的粉笔断裂，灰尘在阳光里跳动，像是一个个嘲弄的幽灵。",
      is_final: true,
      speakerId: 'TEACHER',
      choices: [
        { text: "疯狂记笔记", impact_description: "虽然大脑发木，但这是你唯一的救命稻草。", stat_changes: { academic: 10, intelligence: 2, stamina: -15 } },
        { text: "盯着窗外的矿井", impact_description: "你在想，那下面真的比这间教室更黑吗？", stat_changes: { academic: -5, mood: -8, savviness: 5 } },
        { text: "在桌子底下揉搓衣角", impact_description: "廉价的校服面料已经起球，一如你粗糙的人生。", stat_changes: { resilience: 5, mood: -5, appearance: -2 } }
      ]
    },
    AFTERNOON: {
      title: "走廊的阴影",
      description: "几个穿着名牌运动鞋的女生把你围在水房角落。'听说你妈在澡堂给人搓背？真臭。' 她们哄笑着，试图把你的书包丢进脏水池。",
      is_final: true,
      choices: [
        { text: "死死护住书包", impact_description: "你被推倒在地，但那些破旧的课本没有湿。", stat_changes: { resilience: 15, mood: -25, stamina: -10 } },
        { text: "反唇相讥", impact_description: "你戳中了她们的痛处，却招来了更响亮的耳光。", stat_changes: { resilience: 10, savviness: 5, mood: -20, stamina: -15 } },
        { text: "卑微地低头认错", impact_description: "你学会了服软，但自尊心在这一刻彻底粉碎。", stat_changes: { resilience: -20, corruption: 10, mood: -10, savviness: 8 } }
      ]
    },
    DUSK: {
      title: "残阳与铁栏",
      description: "放学后的校园空荡荡的。残阳把教学楼的影子拉得很长，像是监狱的铁栅栏。你站在操场边缘，不知道该回家还是去舞厅赚那点小费。",
      is_final: true,
      choices: [
        { text: "在操场跑圈", impact_description: "风灌进肺部，带走了暂时的压抑。", stat_changes: { stamina: 10, resilience: 5, mood: 12 } },
        { text: "回教室继续自习", impact_description: "孤灯伴着你，虽然眼睛酸涩，但心里踏实一点。", stat_changes: { academic: 8, intelligence: 1, hygiene: -5 } },
        { text: "去翻找垃圾桶", impact_description: "你捡到了一些还没喝完的奶茶瓶子，那是属于另一个世界的味道。", stat_changes: { money: 2, corruption: 5, satiety: 2, hygiene: -15 } }
      ]
    }
  },
  STATION: {
    MORNING: {
      title: "铁轨的震动",
      description: "一列绿皮火车吐着白烟靠站了。陈哥靠在柱子上：'妮儿，想通了吗？这一走，可就没回头路了。车票钱 ¥200，要是没钱，我这还有另一张“票”。'",
      is_final: true,
      speakerId: 'THUG',
      choices: [
        { text: "递上 ¥200 购买车票", impact_description: "汽笛声响起的瞬间，矿区的烟囱在你视线里崩塌。你自由了，也孤独了。", stat_changes: { money: -200, academic: -20, corruption: 10, mood: 20 }, new_area: 'PROVINCIAL_CAPITAL' },
        { text: "问他‘另一张票’是什么", impact_description: "他暧昧地笑了，递给你一张名片。那是通向深渊的捷径。", stat_changes: { corruption: 15, savviness: 12, mood: -10 } },
        { text: "目送火车离开", impact_description: "你终究还是缺少了那一股决裂的勇气。", stat_changes: { resilience: 5, mood: -15, academic: 2 } }
      ]
    },
    AFTERNOON: {
      title: "出站口的迷茫",
      description: "人潮涌动。背着蛇皮袋的民工，穿着劣质西装的商贩。你在人群中显得如此瘦小，仿佛随时会被这股洪流冲走。",
      is_final: true,
      choices: [
        { text: "尝试帮人提包赚小费", impact_description: "你累得腰酸背痛，只换来几枚铜板。", stat_changes: { money: 8, stamina: -20, mood: -5 } },
        { text: "盯着那张省城地图", impact_description: "复杂的线条在你眼里交织成一张巨大的蛛网。", stat_changes: { intelligence: 1, savviness: 5 } },
        { text: "在长椅上打个盹", impact_description: "你梦见自己变成了一只飞出矿区的鸟。", stat_changes: { stamina: 10, mood: 5 } }
      ]
    },
    MIDNIGHT: {
      title: "月台下的阴影",
      description: "深夜的火车站，灯光昏暗刺眼。流浪汉在角落里发出浑浊的鼾声。你无处可去，只能在这里寻找一丝暂时的庇护。",
      is_final: true,
      choices: [
        { text: "躲在阴暗的角落", impact_description: "警觉地盯着每一个路过的人，你的心跳从未如此之快。", stat_changes: { resilience: 8, savviness: 10, mood: -12 } },
        { text: "和旁边的乞丐聊天", impact_description: "他告诉你，省城的路是用金子铺的，也是用骨头垒的。", stat_changes: { savviness: 15, mood: -8, intelligence: 1 } },
        { text: "寻找垃圾箱里的食物", impact_description: "饥饿战胜了廉耻。那块干硬的饼干竟然如此美味。", stat_changes: { satiety: 10, hygiene: -25, corruption: 8 } }
      ]
    }
  },
  CLUB: {
    EVENING: {
      title: "霓虹下的序幕",
      description: "红太阳舞厅的霓虹灯牌缺了个角。重低音像是在敲击你的灵魂。陈哥递给你一支细长的烟：'妮儿，这才是活着。那帮老外才不管你是不是学生。'",
      is_final: true,
      speakerId: 'THUG',
      choices: [
        { text: "接过烟试着吸一口", impact_description: "辛辣的味道呛得你流泪，但你学会了如何伪装老练。", stat_changes: { corruption: 12, mood: 10, appearance: 5, stamina: -5 } },
        { text: "帮他去后台‘拿个包’", impact_description: "你在秘密中越走越远，包里硬邦邦的，像是一把手枪。", stat_changes: { money: 80, corruption: 18, savviness: 12 } },
        { text: "在阴影里观察这些人", impact_description: "你看穿了几个老男人的虚伪，心眼多了不少。", stat_changes: { savviness: 10, mood: -5, intelligence: 1 } }
      ]
    },
    NIGHT: {
      title: "重低音的狂欢",
      description: "舞池里的人群像是一群在油锅里挣扎的鱼。汗水和劣质香水的味道让你窒息。一个醉醺醺的矿工伸手想要拉你：'小妮儿，陪叔跳一支？'",
      is_final: true,
      choices: [
        { text: "灵活地闪躲开", impact_description: "你像一条滑溜的鱼，学会了在危险中生存。", stat_changes: { stamina: -5, savviness: 10, resilience: 5 } },
        { text: "忍着恶心陪他旋转", impact_description: "他塞给你几张皱巴巴的大钞，你的手心全出汗了。", stat_changes: { money: 60, corruption: 15, mood: -20, appearance: 2 } },
        { text: "向陈哥求救", impact_description: "陈哥帮你了结了麻烦，但也意味着你欠了他一个大人情。", stat_changes: { resilience: -10, corruption: 5, mood: -5, savviness: 8 } }
      ]
    },
    MIDNIGHT: {
      title: "散场后的余温",
      description: "人群散去，只剩下破碎的酒瓶和满地的烟蒂。灯光调亮后的舞厅看起来如此寒碜、颓废。你在后台帮着收拾残局。",
      is_final: true,
      choices: [
        { text: "捡起遗落的酒瓶底", impact_description: "最后的一口烈酒让你彻底麻木。", stat_changes: { mood: 15, stamina: -10, corruption: 10, hygiene: -5 } },
        { text: "偷拿卡座缝隙里的钱", impact_description: "你的手在发抖，这是你人生中第一次真正意义上的‘窃取’。", stat_changes: { money: 45, corruption: 25, mood: -30, savviness: 5 } },
        { text: "看着破碎的镜子发呆", impact_description: "镜子里的那个女孩，眼神越来越陌生了。", stat_changes: { mood: -10, resilience: 15 } }
      ]
    }
  },
  MINING_AREA: {
    AFTERNOON: {
      title: "废墟里的博弈",
      description: "你在废弃的矿区捡煤渣。'女娃子，别在这晃悠，这土层不稳。' 一个满脸煤灰的老矿工路过，他看起来随时会倒在黑色的尘土里。",
      is_final: true,
      speakerId: 'OLD_MINER',
      choices: [
        { text: "分他一截烟屁股", impact_description: "他笑了，露出缺了的门牙，给了你一个带血的矿工牌：‘拿去卖，值点钱。’", stat_changes: { money: 15, mood: 10, savviness: 5 } },
        { text: "埋头继续挖掘", impact_description: "指甲缝里塞满了洗不净的煤灰，但你多捡了一筐。", stat_changes: { money: 10, stamina: -25, satiety: -5, hygiene: -20 } },
        { text: "询问他当年的矿难", impact_description: "他的故事比这片荒地更冷，你感到一阵恶寒。", stat_changes: { intelligence: 2, mood: -12, resilience: 5 } }
      ]
    },
    DUSK: {
      title: "深渊的喘息",
      description: "夕阳把矿区的铁架染成血红色。废弃的矿井像一张黑洞洞的大嘴。你在这里游荡，试图寻找某种能够逃离这片死地的‘奇迹’。",
      is_final: true,
      choices: [
        { text: "探索废弃的家属楼", impact_description: "你在破沙发缝里翻出了半包过期的饼干。", stat_changes: { satiety: 8, stamina: -15, hygiene: -10 } },
        { text: "坐在矿车轨道上发呆", impact_description: "那一刻，你觉得时间停止了。", stat_changes: { mood: 10, resilience: 3 } },
        { text: "在墙上刻下你的名字", impact_description: "一笔一划，仿佛在刻一座属于自己的墓碑。", stat_changes: { resilience: 8, mood: -5 } }
      ]
    },
    MIDNIGHT: {
      title: "漆黑的幽灵",
      description: "深夜的矿区死寂得可怕。只有风吹过铁锈的尖叫声。有几个模糊的身影在远处晃动，可能是偷铁贼，也可能是别的什么。",
      is_final: true,
      choices: [
        { text: "躲进废弃的变电房", impact_description: "你蜷缩在这里，直到那些身影消失。", stat_changes: { resilience: 12, mood: -15, savviness: 5 } },
        { text: "尝试和他们‘谈生意’", impact_description: "你帮他们放哨，换来了人生中第一笔带血的快钱。", stat_changes: { money: 100, corruption: 30, mood: -10, savviness: 15 } },
        { text: "疯狂地向亮光处逃跑", impact_description: "你跑丢了一只鞋子，肺都要炸裂了。", stat_changes: { stamina: -30, resilience: 5, mood: -10 } }
      ]
    }
  },
  BATHHOUSE: {
    FORENOON: {
      title: "水汽中的宁静",
      description: "这里的地板永远滑腻腻的，带着洗不掉的垢味。温水冲刷着肩膀，这是你少有的能躲开所有目光的时刻。",
      is_final: true,
      choices: [
        { text: "彻底清洗全身", impact_description: "虽然肥皂沫很少，但你觉得久违的干净。", stat_changes: { hygiene: 35, mood: 15, stamina: 10 } },
        { text: "帮旁边的大姐搓背", impact_description: "你忍受着刺鼻的体味，赚到了几块小钱。", stat_changes: { money: 12, stamina: -20, hygiene: 10 } },
        { text: "对着破碎的镜子自怜", impact_description: "你发现自己其实长得很漂亮，这也是一种‘资源’。", stat_changes: { appearance: 5, mood: -5, savviness: 5 } }
      ]
    },
    NIGHT: {
      title: "流言的温度",
      description: "深夜的澡堂水温冰凉。几个在红太阳上班的女人在聊天。她们盯着你，眼神里有同情，更多的是嘲弄：'小妮儿，别装了，迟早的事。'",
      is_final: true,
      choices: [
        { text: "偷听省城的‘生意’", impact_description: "你记住了几个关键的人名：‘娜姐’、‘老李’。", stat_changes: { savviness: 15, intelligence: 1, corruption: 5 } },
        { text: "主动向她们示好", impact_description: "她们给了你半袋昂贵的沐浴露，虽然是二手的。", stat_changes: { appearance: 3, mood: 5, resilience: -5 } },
        { text: "快步离开这个是非地", impact_description: "她们的笑声像尖刺一样扎在你的背后。", stat_changes: { resilience: 5, mood: -8 } }
      ]
    },
    MIDNIGHT: {
      title: "最后的滴水声",
      description: "澡堂关门了，只剩下一盏昏黄的灯和无处不在的滴水声。你在最后的热气消散前，想洗净那些永远也洗不掉的伤痕。",
      is_final: true,
      choices: [
        { text: "把自己浸在冷水里", impact_description: "那种刺骨的冷让你觉得非常有力量。", stat_changes: { resilience: 15, stamina: -5, mood: -5 } },
        { text: "在更衣室长凳上发呆", impact_description: "你看着自己青紫的膝盖，那是之前的代价。", stat_changes: { mood: -10, resilience: 10 } },
        { text: "偷走别人遗忘的毛巾", impact_description: "生活把你变成了你自己最讨厌的样子。", stat_changes: { corruption: 15, money: 5, hygiene: 5 } }
      ]
    }
  },
  WANDA: {
    FORENOON: {
      title: "玻璃森林的震撼",
      description: "省城的万达广场。大理石地面干净得能倒映出你的卑微。这里的空气竟然是香的。你穿着矿区的破球鞋，走在这里像个透明的幽灵。",
      is_final: true,
      choices: [
        { text: "在昂贵橱窗前伫立", impact_description: "你看到了标价 5000 块的裙子，那是母亲一年的血汗钱。", stat_changes: { mood: -20, resilience: 10, savviness: 5 } },
        { text: "试着走进高档商场", impact_description: "保安的眼神像刀子一样把你从头到脚刮了一遍。", stat_changes: { mood: -15, resilience: 12, appearance: -2 } },
        { text: "在广场长椅上观察人群", impact_description: "你试图模仿那些女孩走路的姿态，虽然看起来很笨拙。", stat_changes: { appearance: 5, savviness: 5, intelligence: 1 } }
      ]
    },
    AFTERNOON: {
      title: "廉价劳动的尊严",
      description: "你找到了一份发传单的临时工。在烈日下，你穿着沉重的玩偶服。路人冷漠地避开你，偶尔还有顽皮的小孩踢你的腿。",
      is_final: true,
      choices: [
        { text: "拼命递出传单", impact_description: "你的嗓子哑了，但老板多给了你五块钱。", stat_changes: { money: 45, stamina: -30, mood: -10 } },
        { text: "偷偷躲在阴影里休息", impact_description: "被老板抓个正着，钱被扣了一半。", stat_changes: { money: 15, stamina: -5, mood: -15, savviness: 2 } },
        { text: "把传单塞进垃圾桶", impact_description: "这是一种小小的、复仇般的快感。", stat_changes: { corruption: 10, savviness: 8, stamina: 10, mood: 5 } }
      ]
    },
    DUSK: {
      title: "不属于你的灯火",
      description: "夕阳沉下，万达的霓虹灯渐次亮起。这里的美轮美奂让你感到一阵强烈的眩晕。你意识到，你只是这个城市的过客，除非你能付出某种代价。",
      is_final: true,
      choices: [
        { text: "找路人打听赚快钱的路子", impact_description: "有人指了指不远处的‘金色殿堂’。", stat_changes: { savviness: 12, corruption: 8, mood: -5 } },
        { text: "去快餐店买个特价套餐", impact_description: "炸鸡的味道让你泪流满面。", stat_changes: { satiety: 25, money: -25, mood: 15 } },
        { text: "在喷泉池边洗脸", impact_description: "路人的围观让你感到无地自容。", stat_changes: { hygiene: 10, mood: -15, resilience: 5 } }
      ]
    }
  },
  SLUM: {
    NIGHT: {
      title: "城中村的夜响",
      description: "电线在头顶交织成网。楼间距近得能听见隔壁的呼吸声。房东又在敲门催租了：'小妮儿，下个月再没钱，就去巷子口站着！'",
      is_final: true,
      choices: [
        { text: "低头翻找口袋", impact_description: "在这个城市，没有钱连呼吸都是错的。", stat_changes: { money: 0, mood: -15, resilience: 8 } },
        { text: "把门反锁装不在家", impact_description: "你蜷缩在黑漆漆的屋子里，大气都不敢出。", stat_changes: { mood: -12, resilience: 10, savviness: 5 } },
        { text: "给母亲打个电话", impact_description: "听着她的声音，你觉得胸口更闷了。", stat_changes: { mood: -5, resilience: 15 } }
      ]
    },
    MIDNIGHT: {
      title: "握不住的归宿",
      description: "深夜的城中村。醉汉的呕吐声，女人的哭喊声。你躺在潮湿的被窝里，盯着天花板上的霉斑，思考着明天的去处。",
      is_final: true,
      choices: [
        { text: "帮邻居大妈倒垃圾", impact_description: "她给了你半个冷馒头和一句廉价的同情。", stat_changes: { satiety: 5, mood: 5, stamina: -10 } },
        { text: "去公用电话亭发呆", impact_description: "你拨了一个并不存在的号码，对着空气倾诉。", stat_changes: { mood: 10, resilience: 5 } },
        { text: "偷用邻居不加密的Wi-Fi", impact_description: "外面的世界很大，却没有任何一个地方属于你。", stat_changes: { intelligence: 2, savviness: 8, corruption: 5 } }
      ]
    }
  },
  NIGHT_CLUB: {
    NIGHT: {
      title: "销金窟的审视",
      description: "‘金色殿堂’内部的奢华超乎你的想象。娜姐坐在一群男人中间，眼神像冰一样利落。她看着你：'想好了？这门一进，你就再也不是矿区那个穷酸的学生妹了。'",
      is_final: true,
      speakerId: 'BOSS',
      choices: [
        { text: "挺胸抬头接受面试", impact_description: "你发现出卖尊严竟然能换来这么多钱。", stat_changes: { money: 200, corruption: 40, mood: -30, appearance: 15 } },
        { text: "在门口退缩了", impact_description: "你逃离了这里，回到了那间发霉的出租屋。", stat_changes: { resilience: 15, mood: 10, money: -20, corruption: -5 } },
        { text: "帮娜姐跑个腿", impact_description: "你第一次见识到了什么叫权势。", stat_changes: { money: 50, savviness: 15, intelligence: 1, corruption: 10 } }
      ]
    },
    MIDNIGHT: {
      title: "残酒与灵魂",
      description: "午夜的舞厅是欲望的温床。一个中年男人递给你一叠厚厚的小费。你看着那叠钱，感觉自己的灵魂正在一点点剥落。",
      is_final: true,
      choices: [
        { text: "笑着接过小费", impact_description: "你学会了这种生存方式。心冷了，但兜里热了。", stat_changes: { money: 300, corruption: 50, mood: -40, appearance: 5 } },
        { text: "把酒泼在对方脸上", impact_description: "一记耳光让你清醒，你也彻底丢了这份工作。", stat_changes: { resilience: 20, corruption: -10, mood: -20, stamina: -15 } },
        { text: "躲在后台厕所偷偷哭泣", impact_description: "哭声被巨大的音响声彻底淹没。", stat_changes: { mood: -10, resilience: 12 } }
      ]
    }
  },
  BUS_STATION: {
    MORNING: {
      title: "陌生的起点",
      description: "省城汽车站的清晨。这里比矿区大十倍，也冷十倍。你拖着蛇皮袋，看着一张张冷漠的面孔，不知道该往哪里走。",
      is_final: true,
      choices: [
        { text: "找个角落蹲着看报纸", impact_description: "你试图寻找招工信息，但大多都是骗局。", stat_changes: { intelligence: 2, savviness: 8, mood: -5 } },
        { text: "问路被骗了 ¥10", impact_description: "这是你在省城学到的第一课。", stat_changes: { money: -10, savviness: 15, mood: -15 } },
        { text: "在公共长椅上整理仪容", impact_description: "你想看起来不那么像个‘乡下妹子’。", stat_changes: { appearance: 5, hygiene: 5, mood: 5 } }
      ]
    }
  }
};

export const AREA_LABELS = { 
  MINING_TOWN: '被遗忘的矿区', 
  PROVINCIAL_CAPITAL: '繁华的毒药', 
  BORDER_TOWN: '最后的绝地' 
};

export const YUEYUE_USERS = [
  { id: 'u1', name: '李哥', dist: '0.5km', bio: '矿上跑运输的，偶尔赚点外快。', impact: { money: 50, corruption: 5, mood: -5 } },
  { id: 'u2', name: '阿强', dist: '1.2km', bio: '省城夜场常客，带你见识大场面。', impact: { money: 100, corruption: 15, mood: -10 } },
  { id: 'u3', name: '沉默的大叔', dist: '3.0km', bio: '生活太苦，只想找个干净孩子聊聊。', impact: { mood: 10, corruption: 2 } },
];

export const GRAY_TASKS = [
  { id: 't1', name: '暗巷速递', reward: 150, desc: '把封好的黑袋子送到舞厅后门。', risk: '中', corruption: 12, stamina: -20 },
  { id: 't2', name: '地下酒保', reward: 300, desc: '在非法赌场外围负责倒酒和看眼色。', risk: '高', corruption: 25, stamina: -45 },
  { id: 't3', name: '校园贴纸', reward: 60, desc: '把借贷贴纸贴满宿舍楼公共区域。', risk: '低', corruption: 8, stamina: -10 },
];

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
  phone: { isOpen: false, messages: INITIAL_MESSAGES, videos: INITIAL_VIDEOS, products: INITIAL_PRODUCTS, activeApp: 'HOME' },
  visitedLocations: ['SCHOOL']
};

export const STORY_SCRIPT: Record<number, Record<string, AIRootResponse>> = {
  1: {
    SCHOOL: {
      title: "宿命的第一课",
      description: "老李拍着桌子：'女同学更要注意！要是现在不读书，以后就只能下井！'",
      is_final: true,
      speakerId: 'TEACHER',
      choices: [
        { text: "咬牙忍耐", impact_description: "你死死盯着窗外，直到眼睛酸疼。", stat_changes: { resilience: 2 } },
        { text: "在课本上乱涂乱画", impact_description: "你画了一个笼子，把自己关在里面。", stat_changes: { academic: -2, mood: 5 } },
        { text: "举手提问", impact_description: "老李愣了一下，语气稍稍缓和。", stat_changes: { intelligence: 1, academic: 1 } }
      ]
    }
  }
};

export const FAINT_EVENTS: Record<string, AIRootResponse> = {
  HOME: {
    title: "虚弱的梦境",
    description: "你在充满霉味的床上醒来。母亲正红着眼眶给你擦汗。",
    is_final: true,
    speakerId: 'MOTHER',
    choices: [{ text: "默默流泪", impact_description: "醒来了。", stat_changes: { mood: 5, resilience: 2 } }]
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
