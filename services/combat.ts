
import { Player, Spell, Item, EquipmentSlot, SkillType, Vocation } from "../types";
import { getEffectiveSkill } from "./progression"; 

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
  
  // Specific Logic for Heavy Hitting Spells (Ultimates)
  if (spell.id.includes('gran_mas') || spell.id === 'exori_gran_ico') {
      const minDmg = (player.level * 0.4) + (magicLevel * 8);
      const maxDmg = (player.level * 0.7) + (magicLevel * 14);
      return Math.floor(Math.random() * (maxDmg - minDmg + 1)) + Math.floor(minDmg);
  }

  // Knight Attack Spells (Scale better with Level and Weapon Skill, less with ML)
  if (player.vocation === Vocation.KNIGHT && spell.type === 'attack') {
      const weapon = player.equipment[EquipmentSlot.HAND_RIGHT];
      const weaponSkill = getEffectiveSkill(player, weapon?.scalingStat || SkillType.SWORD);
      const atk = weapon?.attack || 25;
      
      let mult = 1;
      if (spell.id === 'exori_gran') mult = 2.5;
      if (spell.id === 'exori_min') mult = 3.0;
      if (spell.id === 'exori') mult = 1.8;
      
      const dmg = (player.level * 0.2) + (weaponSkill * atk * 0.03 * mult) + (magicLevel * 3);
      return Math.floor(dmg * (0.8 + Math.random() * 0.4));
  }

  // Paladin Divine Spells (San)
  if (player.vocation === Vocation.PALADIN && spell.damageType === 'holy') {
      const dist = getEffectiveSkill(player, SkillType.DISTANCE);
      let mult = 4;
      if (spell.id === 'exevo_mas_san') mult = 6;
      
      const minDmg = (player.level * 0.2) + (magicLevel * mult) + (dist * 0.5);
      const maxDmg = (player.level * 0.3) + (magicLevel * (mult + 2)) + (dist * 0.8);
      return Math.floor(Math.random() * (maxDmg - minDmg + 1)) + Math.floor(minDmg);
  }

  // Standard Mage Formula
  let multiplier = 2.0; 
  if (spell.manaCost > 50) multiplier = 3.5;
  if (spell.manaCost > 200) multiplier = 6.0;

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
  
  // Knight Specific Healing (Exura Ico) - Scales with Level mostly
  if (spell.id === 'exura_ico' || spell.id === 'exura_gran_ico') {
      let multiplier = 10;
      if (spell.id === 'exura_gran_ico') multiplier = 30;
      
      const heal = (player.level * 0.2) + (magicLevel * multiplier) + 20;
      return Math.floor(heal * (0.9 + Math.random() * 0.2));
  }

  // Paladin Specific Healing (Exura San)
  if (spell.id === 'exura_san' || spell.id === 'exura_gran_san') {
      let multiplier = 15;
      if (spell.id === 'exura_gran_san') multiplier = 25;
      
      const heal = (player.level * 0.25) + (magicLevel * multiplier) + 40;
      return Math.floor(heal * (0.9 + Math.random() * 0.2));
  }

  // Standard Mage Healing
  let multiplier = 6.0; 
  if (spell.id === 'exura_gran') multiplier = 12.0;
  if (spell.id === 'exura_vita') multiplier = 20.0;
  if (spell.id === 'exura_gran_mas_res') multiplier = 35.0; // Mass Healing
  
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
