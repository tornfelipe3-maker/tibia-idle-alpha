
import { Player, Spell, Item, EquipmentSlot, SkillType, Vocation } from "../types";
import { getEffectiveSkill } from "./progression"; // Circular dependency resolution: progression relies on simple math, combat relies on effective skill

export const calculatePlayerDamage = (player: Player): number => {
  const weapon = player.equipment[EquipmentSlot.HAND_RIGHT]; 
  
  let attackValue = weapon?.attack || 1;
  let skillLevel = getEffectiveSkill(player, SkillType.FIST);
  let factor = 0.06;

  if (!weapon) {
    factor = 0.08; 
  } else {
    if (weapon.scalingStat === SkillType.MAGIC) {
      skillLevel = getEffectiveSkill(player, SkillType.MAGIC);
      factor = 1.0; 
      
      const minDmg = (player.level * 0.2) + (skillLevel * 1.5) + (attackValue * 0.5);
      const maxDmg = (player.level * 0.5) + (skillLevel * 2.5) + attackValue;
      return Math.floor(Math.random() * (maxDmg - minDmg + 1)) + Math.floor(minDmg);

    } else if (weapon.scalingStat === SkillType.DISTANCE) {
      skillLevel = getEffectiveSkill(player, SkillType.DISTANCE);
      factor = 0.07;
      
      if (weapon.weaponType) {
          const ammo = player.equipment[EquipmentSlot.AMMO];
          if (ammo && ammo.ammoType) {
             const compatible = (weapon.weaponType === 'bow' && ammo.ammoType === 'arrow') ||
                                (weapon.weaponType === 'crossbow' && ammo.ammoType === 'bolt');
             
             if (compatible) {
                 attackValue = ammo.attack || 0;
             } else {
                 return 0;
             }
          } else {
              return 0;
          }
      }

    } else if (weapon.scalingStat === SkillType.FIST) {
       skillLevel = getEffectiveSkill(player, SkillType.FIST);
       factor = 0.08;
    } else {
      const stat = weapon.scalingStat || SkillType.SWORD;
      skillLevel = getEffectiveSkill(player, stat);
      factor = 0.06;
    }
  }

  const baseDmg = factor * attackValue * skillLevel + (player.level / 5);
  
  const maxDmg = Math.floor(baseDmg);
  const minDmg = Math.floor(player.level / 5);
  
  return Math.floor(Math.random() * (maxDmg - minDmg + 1)) + minDmg;
};

export const calculateSpellDamage = (player: Player, spell: Spell): number => {
  const magicLevel = getEffectiveSkill(player, SkillType.MAGIC);
  
  let multiplier = 2.0; 
  if (spell.manaCost > 50) multiplier = 4.0;
  if (spell.manaCost > 200) multiplier = 7.0;

  const minDmg = (player.level * 0.2) + (magicLevel * (multiplier * 0.8));
  const maxDmg = (player.level * 0.2) + (magicLevel * (multiplier * 1.2));

  return Math.floor(Math.random() * (maxDmg - minDmg + 1)) + Math.floor(minDmg);
};

export const calculateRuneDamage = (player: Player, item: Item): number => {
  if (!item.isRune) return 0;
  
  const magicLevel = getEffectiveSkill(player, SkillType.MAGIC);
  
  let multiplier = 3.0;
  if (item.id === 'sd_rune') multiplier = 8.0; 
  else if (item.runeType === 'area') multiplier = 3.5; 

  const minDmg = (player.level * 0.2) + (magicLevel * (multiplier * 0.8));
  const maxDmg = (player.level * 0.2) + (magicLevel * (multiplier * 1.2));
  
  return Math.floor(Math.random() * (maxDmg - minDmg + 1)) + Math.floor(minDmg);
};

export const calculateSpellHealing = (player: Player, spell: Spell): number => {
  const magicLevel = getEffectiveSkill(player, SkillType.MAGIC);
  
  let multiplier = 5.0; 
  if (spell.id === 'exura_gran') multiplier = 10.0;
  if (spell.id === 'exura_vita') multiplier = 20.0;
  
  if (player.vocation === Vocation.KNIGHT) {
     return Math.floor((player.level * 0.5) + (magicLevel * 1.0) + 20);
  }

  const minHeal = (player.level * 0.2) + (magicLevel * multiplier);
  const maxHeal = (player.level * 0.3) + (magicLevel * (multiplier * 1.4));

  return Math.floor(Math.random() * (maxHeal - minHeal + 1)) + Math.floor(minHeal);
};

export const calculatePlayerDefense = (player: Player): number => {
  let totalArmor = 0;
  let shieldDef = 0;
  
  Object.values(player.equipment).forEach((item) => {
    if (item) {
      if (item.armor) totalArmor += item.armor;
      if (item.slot === EquipmentSlot.HAND_LEFT) shieldDef = item.defense || 0;
      if (item.slot === EquipmentSlot.HAND_RIGHT) shieldDef += (item.defense || 0) * 0.1;
    }
  });

  const shieldingSkill = getEffectiveSkill(player, SkillType.DEFENSE);
  
  const shieldBlock = Math.random() * (shieldDef * (shieldingSkill * 0.05));
  const armorReduction = Math.random() * totalArmor * 0.7 + (totalArmor * 0.3);
  
  return Math.floor(armorReduction + shieldBlock);
};
