
import { Player, EquipmentSlot, SkillType, Vocation } from '../types';

// Use Special:FilePath for more direct access and better redirection handling
export const IMG_BASE = 'https://tibia.fandom.com/wiki/Special:FilePath/';
export const MAX_STAMINA = 10800; // 3 hours in seconds

export const EMPTY_SLOT_IMAGES: Record<EquipmentSlot, string> = {
  [EquipmentSlot.HEAD]: `${IMG_BASE}Helmet_Slot.gif`,
  [EquipmentSlot.NECK]: `${IMG_BASE}Necklace_Slot.gif`,
  [EquipmentSlot.BODY]: `${IMG_BASE}Armor_Slot.gif`,
  [EquipmentSlot.HAND_LEFT]: `${IMG_BASE}Hand_Slot.gif`,
  [EquipmentSlot.HAND_RIGHT]: `${IMG_BASE}Hand_Slot.gif`,
  [EquipmentSlot.LEGS]: `${IMG_BASE}Legs_Slot.gif`,
  [EquipmentSlot.FEET]: `${IMG_BASE}Boots_Slot.gif`,
  [EquipmentSlot.RING]: `${IMG_BASE}Ring_Slot.gif`,
  [EquipmentSlot.AMMO]: `${IMG_BASE}Ammo_Slot.gif`,
};

export const VOCATION_SPRITES = {
  [Vocation.NONE]: `${IMG_BASE}Knight_Addon_1_Male.gif`,
  [Vocation.KNIGHT]: `${IMG_BASE}Knight_Addon_1_Male.gif`,
  [Vocation.PALADIN]: `${IMG_BASE}Hunter_Addon_1_Male.gif`,
  [Vocation.SORCERER]: `${IMG_BASE}Mage_Addon_1_Male.gif`,
  [Vocation.DRUID]: `${IMG_BASE}Druid_Addon_1_Male.gif`,
  [Vocation.MONK]: `${IMG_BASE}Monk_Addon_1_Male.gif`,
};

export const REGEN_RATES = {
  [Vocation.NONE]: { hp: 1, mana: 1 },
  [Vocation.KNIGHT]: { hp: 6, mana: 1 },
  [Vocation.PALADIN]: { hp: 3, mana: 4 },
  [Vocation.SORCERER]: { hp: 1, mana: 8 },
  [Vocation.DRUID]: { hp: 1, mana: 8 },
  [Vocation.MONK]: { hp: 4, mana: 3 },
};

export const getXpForLevel = (level: number): number => {
  return Math.floor((50 * Math.pow(level, 3) / 3) - (100 * Math.pow(level, 2)) + (850 * level / 3) - 200);
};

export const getTicksForNextSkill = (skill: SkillType, level: number, vocation: Vocation): number => {
  return Math.floor(50 * Math.pow(1.1, level));
};

export const INITIAL_PLAYER_STATS: Player = {
    name: '',
    level: 1,
    vocation: Vocation.NONE,
    currentXp: 0,
    maxXp: getXpForLevel(2),
    hp: 150,
    maxHp: 150,
    mana: 35,
    maxMana: 35,
    stamina: MAX_STAMINA,
    gold: 0,
    bankGold: 0,
    lastSaveTime: Date.now(),
    activeHuntId: null,
    activeHuntCount: 1,
    activeTrainingSkill: null,
    equipment: {},
    inventory: {},
    depot: {},
    skills: {
        [SkillType.FIST]: { level: 10, progress: 0 },
        [SkillType.CLUB]: { level: 10, progress: 0 },
        [SkillType.SWORD]: { level: 10, progress: 0 },
        [SkillType.AXE]: { level: 10, progress: 0 },
        [SkillType.DISTANCE]: { level: 10, progress: 0 },
        [SkillType.DEFENSE]: { level: 10, progress: 0 },
        [SkillType.MAGIC]: { level: 0, progress: 0 },
    },
    settings: {
        autoHealthPotionThreshold: 0,
        selectedHealthPotionId: '',
        autoManaPotionThreshold: 0,
        selectedManaPotionId: '',
        autoHealSpellThreshold: 0,
        selectedHealSpellId: '',
        autoAttackSpell: false,
        selectedAttackSpellId: '',
        autoAttackRune: false,
        selectedRuneId: '',
    },
    quests: {},
    bossCooldowns: {},
    spellCooldowns: {},
    purchasedSpells: [],
    globalCooldown: 0,
    activeTask: null,
    taskOptions: [],
    skippedLoot: [],
};
