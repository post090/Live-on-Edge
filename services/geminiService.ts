
import { GoogleGenAI, Type } from "@google/genai";
import { GameState, AIRootResponse } from "../types";
import { DAYS_OF_WEEK } from "../constants";

const getNarrativeContext = (state: GameState) => {
  const recentHistory = state.history.slice(-12).join('\n');
  const dayOfWeek = DAYS_OF_WEEK[(state.day - 1) % 7];
  return { recentHistory, dayOfWeek };
};

export async function generateNarrativeEvent(state: GameState, currentEventChoices: string[] = []): Promise<AIRootResponse> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const { recentHistory, dayOfWeek } = getNarrativeContext(state);
  
  const currentTurnContext = currentEventChoices.length > 0 
    ? `【玩家本轮已选路径：${currentEventChoices.join(' -> ')}】` 
    : "【玩家刚刚抵达此地，这是第一步行动】";

  const systemInstruction = `
    你是一个冷酷、宿命感极强的叙事引擎，背景是2004年的东北。
    
    【核心逻辑：必须维持因果连贯性】
    - 绝不能生成与之前行动脱节的随机事件。
    - 必须解析历史记录：${recentHistory}。
    - 如果玩家上一轮选择了“逃票”，这一轮必须生成关于“乘警盘问”或“在车厢夹缝躲藏”的冲突。
    
    【核心维度：外貌与魅力】
    - 主角魅力：${state.attributes.appearance}/10。
    - 当前发型：${state.avatar.hair}，眼神：${state.avatar.eyes}。
    
    【输出要求】
    - 文本风格：东北伤痕文学。
  `;

  const prompt = `
    当前位置：${state.location} (${state.currentArea})
    属性：智力${state.attributes.intelligence}, 魅力${state.attributes.appearance}
    
    历史因果：${recentHistory}
    本回合进展：${currentTurnContext}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          is_final: { type: Type.BOOLEAN },
          new_area: { type: Type.STRING, enum: ['MINING_TOWN', 'PROVINCIAL_CAPITAL', 'BORDER_TOWN'] },
          choices: {
            type: Type.ARRAY,
            minItems: 4,
            maxItems: 4,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                impact_description: { type: Type.STRING },
                escape_attempt: { type: Type.BOOLEAN },
                stat_changes: {
                  type: Type.OBJECT,
                  properties: {
                    satiety: { type: Type.NUMBER },
                    hygiene: { type: Type.NUMBER },
                    mood: { type: Type.NUMBER },
                    money: { type: Type.NUMBER },
                    academic: { type: Type.NUMBER },
                    corruption: { type: Type.NUMBER }
                  }
                }
              },
              required: ['text', 'impact_description', 'stat_changes']
            }
          }
        },
        required: ['title', 'description', 'is_final', 'choices']
      }
    }
  });

  const parsed = JSON.parse(response.text) as AIRootResponse;
  return { ...parsed, is_final: currentEventChoices.length >= 2 ? true : parsed.is_final };
}

export async function generateMapSummary(state: GameState): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const { recentHistory } = getNarrativeContext(state);
  const prompt = `
    当前时间：第 ${state.day} 天 ${state.timeOfDay}。
    刚才发生了：${recentHistory.split('\n').pop()}
    
    请写一段30字内的心理独白，反映主角在此时此地的绝望或不甘。
  `;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { systemInstruction: "极简风格，冷硬，写实。" }
  });
  return response.text?.trim() || "雪还在下，没有停的意思。";
}
