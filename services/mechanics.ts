
import { Monster, HuntingTask, Player, EquipmentSlot, SkillType, PreySlot, PreyBonusType, AscensionPerk } from "../types";
import { MONSTERS, SHOP_ITEMS } from "../constants";
import { getEffectiveSkill } from "./progression";

export const getXpStageMultiplier = (level: number): number => {
  if (level < 8) return 15;
  if (level < 20) return 10;
  if (level < 50) return 5;
  if (level < 100) return 3;
  return 1;
};

// Updated to accept Loot Bonus (percentage, e.g. 40 = 40% more chance)
export const calculateLootDrop = (monster: Monster, lootBonusPercent: number = 0): { [itemId: string]: number } => {
  const loot: { [itemId: string]: number } = {};
  const multiplier = 1 + (lootBonusPercent / 100);
  
  if (monster.lootTable) {
    monster.lootTable.forEach(drop => {
      // Apply bonus to drop chance
      if (Math.random() <= (drop.chance * multiplier)) {
        const amount = Math.floor(Math.random() * drop.maxAmount) + 1;
        loot[drop.itemId] = amount;
      }
    });
  }
  
  return loot;
};

// --- ASCENSION HELPERS ---

export const calculateSoulPointsToGain = (player: Player): number => {
    if (player.level < 25) return 0;
    
    // Base 1 + 1 for every 10 levels after 25
    const base = 1 + Math.floor((player.level - 25) / 10);
    
    // Apply Soul Gain Multiplier (1% per level)
    const multiplier = 1 + ((player.ascension?.soul_gain || 0) / 100);
    
    return Math.floor(base * multiplier);
};

export const getAscensionUpgradeCost = (currentLevel: number): number => {
    // Linear progression: Lvl 0->1 costs 1. Lvl 1->2 costs 2.
    return currentLevel + 1;
};

export const getAscensionBonusValue = (player: Player, perk: AscensionPerk): number => {
    // 1% per level for all perks currently
    return (player.ascension?.[perk] || 0); 
};

// -------------------------

export const generatePreyCard = (): PreySlot => {
    const randomMonster = MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
    
    const types: PreyBonusType[] = ['xp', 'damage', 'defense', 'loot'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    let value = 0;
    const roll = Math.random(); // 0.0 to 1.0
    
    // Logic: 
    // 50% chance for Low Tier (Common)
    // 30% chance for Mid Tier (Uncommon)
    // 15% chance for High Tier (Rare)
    // 4% chance for Super Tier (Epic)
    // 1% chance for Max Roll (Legendary)

    if (type === 'xp' || type === 'loot') {
        // Range 1-50%
        if (roll < 0.50) { 
            // Common: 1-15
            value = Math.floor(Math.random() * 15) + 1;
        } else if (roll < 0.80) { 
            // Uncommon: 16-30
            value = Math.floor(Math.random() * 15) + 16;
        } else if (roll < 0.95) { 
            // Rare: 31-40
            value = Math.floor(Math.random() * 10) + 31;
        } else if (roll < 0.99) { 
            // Epic: 41-49
            value = Math.floor(Math.random() * 9) + 41;
        } else { 
            // Legendary: 50
            value = 50;
        }
    } else {
        // Range 1-25% (Damage/Defense)
        if (roll < 0.50) { 
            // Common: 1-8
            value = Math.floor(Math.random() * 8) + 1;
        } else if (roll < 0.80) { 
            // Uncommon: 9-15
            value = Math.floor(Math.random() * 7) + 9;
        } else if (roll < 0.95) { 
            // Rare: 16-20
            value = Math.floor(Math.random() * 5) + 16;
        } else if (roll < 0.99) { 
            // Epic: 21-24
            value = Math.floor(Math.random() * 4) + 21;
        } else { 
            // Legendary: 25
            value = 25;
        }
    }

    return {
        monsterId: randomMonster.id,
        bonusType: type,
        bonusValue: value
    };
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

  // Prey Bonus Check for Stats Estimation
  const activePrey = player.prey.slots.find(s => s.monsterId === monster.id);
  if (activePrey && activePrey.bonusType === 'damage') {
      avgDmg *= (1 + (activePrey.bonusValue / 100));
  }
  
  // Ascension Damage Bonus
  const ascDmgBonus = getAscensionBonusValue(player, 'damage_boost');
  avgDmg *= (1 + (ascDmgBonus / 100));

  avgDmg = Math.max(1, avgDmg);

  const secondsToKill = Math.ceil(monster.hp / avgDmg);
  const respawnTime = 2;
  const killsPerHour = 3600 / (secondsToKill + respawnTime);

  const avgGold = (monster.minGold + monster.maxGold) / 2;
  // Ascension Gold Bonus
  const ascGoldBonus = getAscensionBonusValue(player, 'gold_boost');
  const finalAvgGold = avgGold * (1 + (ascGoldBonus / 100));
  
  let avgLootValue = 0;
  // Apply Prey Loot Bonus to estimation
  let lootMult = 1;
  if (activePrey && activePrey.bonusType === 'loot') {
      lootMult += (activePrey.bonusValue / 100);
  }
  // Apply Ascension Loot Bonus
  lootMult += (getAscensionBonusValue(player, 'loot_boost') / 100);

  if (monster.lootTable) {
      monster.lootTable.forEach(drop => {
          const item = SHOP_ITEMS.find(i => i.id === drop.itemId);
          if (item && item.sellPrice > 0) {
              const avgQty = (1 + drop.maxAmount) / 2;
              avgLootValue += (drop.chance * lootMult * avgQty * item.sellPrice);
          }
      });
  }

  const stageMult = getXpStageMultiplier(player.level);
  let xpMult = 1;
  if (activePrey && activePrey.bonusType === 'xp') {
      xpMult = 1 + (activePrey.bonusValue / 100);
  }

  return {
    xpPerHour: Math.floor(killsPerHour * monster.exp * stageMult * xpMult),
    goldPerHour: Math.floor(killsPerHour * (finalAvgGold + avgLootValue))
  };
};
