
import { EquipmentSlot, Vocation, SkillType, NpcType, DamageType } from './enums';

export interface Skill {
  level: number;
  progress: number; // 0 to 100
}

export interface Item {
  id: string;
  name: string;
  type: 'equipment' | 'potion' | 'loot';
  potionType?: 'health' | 'mana' | 'spirit';
  ammoType?: 'arrow' | 'bolt';
  weaponType?: 'bow' | 'crossbow';
  slot?: EquipmentSlot;
  image?: string;
  attack?: number;
  defense?: number;
  armor?: number; 
  price: number;
  sellPrice: number;
  soldTo: NpcType[];
  description: string;
  requiredVocation?: Vocation[];
  requiredLevel?: number;
  reqMagicLevel?: number;
  scalingStat?: SkillType; 
  damageType?: DamageType;
  restoreAmount?: number;
  restoreAmountSecondary?: number;
  skillBonus?: {
    [key in SkillType]?: number;
  };
  isRune?: boolean;
  runeType?: 'single' | 'area';
  // New property for stacking in equipment slots
  count?: number; 
}

export interface LootDrop {
  itemId: string;
  chance: number;
  maxAmount: number;
}

export interface Monster {
  id: string;
  name: string;
  level: number;
  image?: string;
  hp: number;
  maxHp: number;
  exp: number; 
  minGold: number;
  maxGold: number;
  damageMin: number;
  damageMax: number;
  attackSpeedMs: number; 
  lootTable?: LootDrop[];
  elements?: {
      [key in 'fire' | 'ice' | 'energy' | 'earth' | 'physical' | 'holy' | 'death']?: number;
  };
}

export interface Boss extends Monster {
  cooldownSeconds: number;
  isDaily: boolean;
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  
  // Requirement
  targetMonsterId?: string;
  requiredKills?: number;
  requiredLevel?: number;
  requiredItems?: { [itemId: string]: number }; // e.g. Gather 5 Wolf Paws

  // Reward
  rewardNpcAccess?: NpcType;
  rewardItems?: { itemId: string, count: number }[];
  rewardGold?: number;
  rewardExp?: number;
}

export interface HuntingTask {
  monsterId: string;
  killsRequired: number;
  killsCurrent: number;
  rewardXp: number;
  rewardGold: number;
  isComplete: boolean;
}

export interface PlayerSettings {
  autoHealthPotionThreshold: number;
  selectedHealthPotionId: string;
  autoManaPotionThreshold: number;
  selectedManaPotionId: string;
  autoHealSpellThreshold: number;
  selectedHealSpellId: string;
  autoAttackSpell: boolean;
  selectedAttackSpellId: string;
  autoAttackRune: boolean;
  selectedRuneId: string;
}

export type PreyBonusType = 'xp' | 'damage' | 'defense' | 'loot';

export interface PreySlot {
    monsterId: string | null;
    bonusType: PreyBonusType;
    bonusValue: number; // Percentage (e.g. 40 for 40%)
}

export type AscensionPerk = 'gold_boost' | 'damage_boost' | 'loot_boost' | 'boss_cd' | 'soul_gain';

export interface Player {
  name: string;
  isGm?: boolean; // GM Flag
  level: number;
  vocation: Vocation;
  promoted: boolean; // Promotion Flag
  currentXp: number;
  maxXp: number;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  stamina: number;
  gold: number;
  bankGold: number;
  lastSaveTime: number;
  activeHuntId: string | null;
  activeHuntCount: number;
  activeHuntStartTime: number; // New: Tracks when the hunt started
  activeTrainingSkill: SkillType | null;
  equipment: {
    [key in EquipmentSlot]?: Item;
  };
  inventory: {
    [itemId: string]: number;
  };
  depot: {
    [itemId: string]: number;
  };
  skills: {
    [key in SkillType]: Skill;
  };
  settings: PlayerSettings;
  quests: {
    [questId: string]: {
      kills: number; // Tracks kills for this quest
      itemsHandedIn?: boolean; // If item requirements met
      completed: boolean; // If reward claimed
    }
  };
  bossCooldowns: {
    [bossId: string]: number;
  };
  spellCooldowns: {
    [spellId: string]: number;
  };
  purchasedSpells: string[];
  globalCooldown: number;
  activeTask: HuntingTask | null;
  taskOptions: HuntingTask[];
  skippedLoot: string[];
  hasBlessing: boolean;
  
  // PREY SYSTEM
  prey: {
      slots: PreySlot[];
      nextFreeReroll: number; // Timestamp
  };

  // ASCENSION SYSTEM
  soulPoints: number;
  ascension: {
      [key in AscensionPerk]: number; // Level of the perk
  };
}

export interface LogEntry {
  id: string;
  message: string;
  type: 'info' | 'combat' | 'loot' | 'danger' | 'gain' | 'skill' | 'magic';
  timestamp: number;
}

export interface HitSplat {
  id: number;
  value: number | string;
  type: 'damage' | 'heal' | 'miss' | 'speech';
  target: 'player' | 'monster';
}

export interface Spell {
  id: string;
  name: string;
  manaCost: number;
  minLevel: number;
  reqMagicLevel?: number;
  price: number;
  type: 'attack' | 'heal';
  vocations: Vocation[];
  damageType?: DamageType;
  cooldown: number;
}
