
import { Player, SkillType } from "../types";
import { getTicksForNextSkill } from "../constants";

export const getEffectiveSkill = (player: Player, skillType: SkillType): number => {
  let baseLevel = player.skills[skillType].level;
  
  Object.values(player.equipment).forEach(item => {
    if (item && item.skillBonus && item.skillBonus[skillType]) {
      baseLevel += item.skillBonus[skillType]!;
    }
  });

  return baseLevel;
};

export const processSkillTraining = (player: Player, skillType: SkillType, isTrainingMode: boolean): { player: Player, leveledUp: boolean } => {
  const p = { ...player };
  const skill = p.skills[skillType];
  
  const progressAmount = isTrainingMode ? 5 : 1;
  const ticksNeeded = getTicksForNextSkill(skillType, skill.level, p.vocation);
  
  const percentGain = (progressAmount / ticksNeeded) * 100;
  
  skill.progress += percentGain;
  
  let leveledUp = false;
  if (skill.progress >= 100) {
    skill.level += 1;
    skill.progress = 0;
    leveledUp = true;
  }
  
  return { player: p, leveledUp };
};
