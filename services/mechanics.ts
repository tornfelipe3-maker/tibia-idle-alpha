
import { Monster, HuntingTask, Player, EquipmentSlot, SkillType } from "../types";
import { MONSTERS, SHOP_ITEMS } from "../constants";
import { getEffectiveSkill } from "./progression";

export const getXpStageMultiplier = (level: number): number => {
  if (level < 8) return 15;
  if (level < 20) return 10;
  if (level < 50) return 5;
  if (level < 100) return 3;
  return 1;
};

export const calculateLootDrop = (monster: Monster): { [itemId: string]: number } => {
  const loot: { [itemId: string]: number } = {};
  
  if (monster.lootTable) {
    monster.lootTable.forEach(drop => {
      if (Math.random() <= drop.chance) {
        const amount = Math.floor(Math.random() * drop.maxAmount) + 1;
        loot[drop.itemId] = amount;
      }
    });
  }
  
  return loot;
};

export const generateTaskOptions = (playerLevel: number): HuntingTask[] => {
  const candidates = MONSTERS.filter(m => 
    m.level >= Math.max(1, playerLevel - 30) &&
    m.level <= playerLevel + 30
  );

  const pool = candidates.length >= 3 ? candidates : MONSTERS.slice(0, 5);
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3);

  return selected.map(monster => {
    const baseKills = 100;
    const levelFactor = playerLevel * 2;
    const kills = Math.min(500, Math.max(50, baseKills + levelFactor));

    const stageMult = getXpStageMultiplier(playerLevel);
    const xpReward = Math.floor(monster.exp * stageMult * kills * 0.6);
    const goldReward = Math.floor(((monster.minGold + monster.maxGold) / 2) * kills * 0.6);

    return {
      monsterId: monster.id,
      killsRequired: kills,
      killsCurrent: 0,
      rewardXp: xpReward,
      rewardGold: goldReward,
      isComplete: false
    };
  });
};

export const estimateHuntStats = (player: Player, monster: Monster) => {
  const weapon = player.equipment[EquipmentSlot.HAND_RIGHT];
  let avgDmg = 10;
  
  if (!weapon) {
      avgDmg = 5 + (player.level / 2);
  } else {
      let attackValue = weapon.attack || 1;
      let skill = getEffectiveSkill(player, weapon.scalingStat || SkillType.SWORD);
      
      if (weapon.scalingStat === SkillType.DISTANCE && weapon.weaponType) {
         const ammo = player.equipment[EquipmentSlot.AMMO];
         if (ammo && ammo.attack) attackValue = ammo.attack;
      }

      avgDmg = (0.06 * attackValue * skill) + (player.level / 5);
      if (weapon.scalingStat === SkillType.MAGIC) avgDmg *= 1.5; 
  }

  avgDmg = Math.max(1, avgDmg);

  const secondsToKill = Math.ceil(monster.hp / avgDmg);
  const respawnTime = 2;
  const killsPerHour = 3600 / (secondsToKill + respawnTime);

  const avgGold = (monster.minGold + monster.maxGold) / 2;
  
  let avgLootValue = 0;
  if (monster.lootTable) {
      monster.lootTable.forEach(drop => {
          const item = SHOP_ITEMS.find(i => i.id === drop.itemId);
          if (item && item.sellPrice > 0) {
              const avgQty = (1 + drop.maxAmount) / 2;
              avgLootValue += (drop.chance * avgQty * item.sellPrice);
          }
      });
  }

  const stageMult = getXpStageMultiplier(player.level);

  return {
    xpPerHour: Math.floor(killsPerHour * monster.exp * stageMult),
    goldPerHour: Math.floor(killsPerHour * (avgGold + avgLootValue))
  };
};
