
import { Item, EquipmentSlot, NpcType, SkillType } from '../../types';
import { IMG_BASE } from '../config';

export const ARMORS_LIST: Item[] = [
  { id: 'coat', name: 'Coat', type: 'equipment', slot: EquipmentSlot.BODY, armor: 1, price: 10, sellPrice: 2, soldTo: [NpcType.TRADER], description: 'A simple coat.', image: `${IMG_BASE}Coat.gif` },
  { id: 'leather_armor', name: 'Leather Armor', type: 'equipment', slot: EquipmentSlot.BODY, armor: 4, price: 25, sellPrice: 12, soldTo: [NpcType.TRADER], description: 'Armadura de couro.', image: `${IMG_BASE}Leather_Armor.gif` },
  { id: 'chain_armor', name: 'Chain Armor', type: 'equipment', slot: EquipmentSlot.BODY, armor: 6, price: 200, sellPrice: 70, soldTo: [NpcType.TRADER], description: 'Armadura de cota de malha.', image: `${IMG_BASE}Chain_Armor.gif` },
  { id: 'brass_armor', name: 'Brass Armor', type: 'equipment', slot: EquipmentSlot.BODY, armor: 8, price: 450, sellPrice: 150, soldTo: [NpcType.TRADER], description: 'Armadura de latão.', image: `${IMG_BASE}Brass_Armor.gif` },
  { id: 'scale_armor', name: 'Scale Armor', type: 'equipment', slot: EquipmentSlot.BODY, armor: 9, price: 0, sellPrice: 75, soldTo: [NpcType.GREEN_DJINN], description: 'Armadura de escamas.', image: `${IMG_BASE}Scale_Armor.gif` },
  { id: 'plate_armor', name: 'Plate Armor', type: 'equipment', slot: EquipmentSlot.BODY, armor: 10, price: 1200, sellPrice: 400, soldTo: [NpcType.TRADER], description: 'Armadura de placas.', image: `${IMG_BASE}Plate_Armor.gif` },
  { id: 'blue_robe', name: 'Blue Robe', type: 'equipment', slot: EquipmentSlot.BODY, armor: 11, price: 0, sellPrice: 10000, soldTo: [NpcType.BLUE_DJINN], description: 'Manto azul leve.', image: `${IMG_BASE}Blue_Robe.gif` },
  { id: 'noble_armor', name: 'Noble Armor', type: 'equipment', slot: EquipmentSlot.BODY, armor: 11, price: 0, sellPrice: 900, soldTo: [NpcType.BLUE_DJINN], description: 'Armadura nobre.', image: `${IMG_BASE}Noble_Armor.gif` },
  { id: 'terra_mantle', name: 'Terra Mantle', type: 'equipment', slot: EquipmentSlot.BODY, armor: 11, price: 0, sellPrice: 11000, soldTo: [NpcType.RASHID], description: 'Manto de terra.', image: `${IMG_BASE}Terra_Mantle.gif` },
  { id: 'knight_armor', name: 'Knight Armor', type: 'equipment', slot: EquipmentSlot.BODY, armor: 12, price: 0, sellPrice: 5000, soldTo: [NpcType.GREEN_DJINN], description: 'Armadura de cavaleiro.', image: `${IMG_BASE}Knight_Armor.gif` },
  { id: 'paladin_armor', name: 'Paladin Armor', type: 'equipment', slot: EquipmentSlot.BODY, armor: 12, price: 0, sellPrice: 15000, soldTo: [NpcType.BLUE_DJINN], description: 'Armadura de paladino.', skillBonus: { [SkillType.DISTANCE]: 2 }, image: `${IMG_BASE}Paladin_Armor.gif` },
  { id: 'crown_armor', name: 'Crown Armor', type: 'equipment', slot: EquipmentSlot.BODY, armor: 13, price: 0, sellPrice: 12000, soldTo: [NpcType.BLUE_DJINN], description: 'Armadura real.', image: `${IMG_BASE}Crown_Armor.gif` },
  { id: 'zaoan_armor', name: 'Zaoan Armor', type: 'equipment', slot: EquipmentSlot.BODY, armor: 13, price: 0, sellPrice: 14000, soldTo: [NpcType.RASHID], description: 'Armadura de Zao.', image: `${IMG_BASE}Zaoan_Armor.gif` },
  { id: 'golden_armor', name: 'Golden Armor', type: 'equipment', slot: EquipmentSlot.BODY, armor: 14, price: 0, sellPrice: 20000, soldTo: [NpcType.RASHID], description: 'Armadura dourada.', image: `${IMG_BASE}Golden_Armor.gif` },
  { id: 'dsm', name: 'Dragon Scale Mail', type: 'equipment', slot: EquipmentSlot.BODY, armor: 15, price: 0, sellPrice: 40000, soldTo: [NpcType.RASHID], description: 'Cota de escamas de dragão.', image: `${IMG_BASE}Dragon_Scale_Mail.gif` },
  { id: 'mmpa', name: 'Master Archer Armor', type: 'equipment', slot: EquipmentSlot.BODY, armor: 15, price: 0, sellPrice: 100000, soldTo: [NpcType.RASHID], description: 'Armadura de arqueiro mestre.', skillBonus: { [SkillType.DISTANCE]: 3 }, image: `${IMG_BASE}Master_Archer%27s_Armor.gif` },
  { id: 'firemind_raiment', name: 'Firemind Raiment', type: 'equipment', slot: EquipmentSlot.BODY, armor: 15, price: 0, sellPrice: 80000, soldTo: [NpcType.RASHID], description: 'Veste de fogo.', skillBonus: { [SkillType.MAGIC]: 4 }, image: `${IMG_BASE}Firemind_Raiment.gif` },
  { id: 'prismatic_armor', name: 'Prismatic Armor', type: 'equipment', slot: EquipmentSlot.BODY, armor: 15, price: 0, sellPrice: 30000, soldTo: [NpcType.RASHID], description: 'Armadura prismática.', image: `${IMG_BASE}Prismatic_Armor.gif` },
  { id: 'mpa', name: 'Magic Plate Armor', type: 'equipment', slot: EquipmentSlot.BODY, armor: 17, price: 0, sellPrice: 100000, soldTo: [NpcType.RASHID], description: 'MPA.', image: `${IMG_BASE}Magic_Plate_Armor.gif` },
  { id: 'glooth_cape', name: 'Glooth Cape', type: 'equipment', slot: EquipmentSlot.BODY, armor: 10, price: 0, sellPrice: 3000, soldTo: [NpcType.RASHID], description: 'Cape from Oramond.', image: `${IMG_BASE}Glooth_Cape.gif` },
  { id: 'focus_cape', name: 'Focus Cape', type: 'equipment', slot: EquipmentSlot.BODY, armor: 9, price: 0, sellPrice: 6000, soldTo: [NpcType.BLUE_DJINN], description: 'Manto de foco.', skillBonus: { [SkillType.MAGIC]: 1 }, image: `${IMG_BASE}Focus_Cape.gif` },
  { id: 'falcon_plate', name: 'Falcon Plate', type: 'equipment', slot: EquipmentSlot.BODY, armor: 18, price: 0, sellPrice: 300000, soldTo: [NpcType.RASHID], description: 'Armadura do Falcão.', image: `${IMG_BASE}Falcon_Plate.gif` },
  { id: 'lion_plate', name: 'Lion Plate', type: 'equipment', slot: EquipmentSlot.BODY, armor: 16, price: 0, sellPrice: 250000, soldTo: [NpcType.RASHID], description: 'Armadura do Leão.', image: `${IMG_BASE}Lion_Plate.gif` },
];
