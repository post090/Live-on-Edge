// Fix: Removed reference to non-existent PLOT_TIMELINE from constants.ts
import { GoogleGenAI } from "@google/genai";
import { GameState } from "../types";
import { DAYS_OF_WEEK } from "../constants";

// Fix: Cleaned up unused plot variable from narrative context
const getNarrativeContext = (state: GameState) => {
  const recentHistory = state.history.slice(-12).join('\n');
  const dayOfWeek = DAYS_OF_WEEK[(state.day - 1) % 7];
  return { recentHistory, dayOfWeek };
};

export async function generateMapSummary(state: GameState): Promise<string> {
  // Fix: Ensure GoogleGenAI is initialized correctly with a named parameter
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const { recentHistory } = getNarrativeContext(state);
  
  const prompt = `
    你现在是一个极其冷峻、写实的叙事者。
    【背景】2014年东北矿镇，高三学生，生活极度压抑。
    【当前地点】${state.location}
    【当前状态】饱腹${state.stats.satiety}, 精神${state.stats.mood}, 学业${state.stats.academic}, 现金${state.stats.money}
    【最近发生】${recentHistory.split('\n').pop()}

    请按照以下【固定格式】生成一段话（严禁添加任何额外文字或解释）：
    你站在[当前地点]。[根据当前状态和最近发生的事，用第二人称描述环境与身体感官状态]。你[用第二人称描述当下的核心心理特征或绝望感]。

    示例：
    你站在破败的家。煤烟味钻进肺里，胃部因为饥饿而阵阵抽搐。你感觉到一种快要溺死在生活里的绝望。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { 
        systemInstruction: "你是一个只输出固定格式第二人称叙述的生存游戏引擎。语气必须冷硬、深刻、带有伤痕文学色彩。",
        temperature: 0.8
      }
    });
    // Fix: Access response content using the .text property as per @google/genai guidelines
    return response.text?.trim() || "你站在寒风里。冷雪灌进脖子，手脚早已麻木。你感觉到命运正在一点点收紧。";
  } catch (e) {
    console.error("Gemini API Error:", e);
    return "你站在风雪中。世界是一片灰白的死寂。你感觉到自己像是一块快要燃尽的煤渣。";
  }
}
