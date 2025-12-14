
import { GameState } from '../types';

export const getLocalStatusSummary = (state: GameState): string => {
  const { stats, attributes, location } = state;

  // 1. 生理感官 (女性化视角)
  let physical = "";
  if (stats.satiety < 20) physical = "胃部的空洞感已经让意识开始模糊，你觉得自己的骨架在廉价的校服里晃荡。";
  else if (stats.satiety < 50) physical = "饥饿像一根细针，在每一个呼吸间刺痛你的太阳穴，冷汗浸透了后背。";
  else physical = "身体里那一点微弱的热量在支撑着你，让你在那群不怀好意的目光中站稳脚步。";

  // 2. 环境感知 (针对女性主角的威胁感)
  let sensing = "";
  if (attributes.savviness < 4) sensing = "四周那些贪婪、黏稠的眼神让你感到一阵阵生理性的反胃，你却不知道该往哪躲。";
  else if (state.stats.corruption > 40) sensing = "你冷冷地扫视着路边的流氓，已经学会了如何利用自己的外貌去博弈，不再感到恐惧。";
  else sensing = "风里的煤灰让你眼睛生疼，你警觉地拉紧了领口，试图把自己缩进这片阴影里。";

  // 3. 社会/学业处境
  let social = "";
  if (stats.money < 5) {
    social = "在这个钱能买断一切的小镇，你手心里的那几枚硬币沉重得让人想哭。";
  } else if (stats.academic > 60) {
    social = "书本上的公式是你唯一的盾牌，虽然你很清楚，在这个地方，知识往往抵不过暴力和金钱。";
  } else {
    social = "矿井的轰鸣声像是一场永不停歇的葬礼，你担心自己也会成为那坟墓里的一部分。";
  }

  // 4. 心理状态 (向往与堕落)
  let mental = "";
  if (stats.mood < 20) mental = "绝望像粘稠的石油灌进了耳朵，你甚至觉得，就这么倒下被带走，也许也是一种解脱。";
  else if (stats.corruption > 50) mental = "你盯着舞厅霓虹灯的重影，发现那种腐烂的味道竟然有一丝诱人的甜味。";
  else mental = "你死死咬着牙，盯着黑板上的倒计时，那是你逃离这片泥泞的最后一张船票。";

  return `你站在${location}。${physical}${sensing}${social}你${mental}`;
};
