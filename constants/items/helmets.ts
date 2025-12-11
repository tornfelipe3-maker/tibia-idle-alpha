
import { Item, EquipmentSlot, NpcType, SkillType } from '../../types';
import { IMG_BASE } from '../config';

export const HELMETS_LIST: Item[] = [
  { id: 'soldier_helmet', name: 'Soldier Helmet', type: 'equipment', slot: EquipmentSlot.HEAD, armor: 5, price: 110, sellPrice: 16, soldTo: [NpcType.TRADER], description: 'Capacete de soldado.', image: `${IMG_BASE}Soldier_Helmet.gif` },
  { id: 'dark_helmet', name: 'Dark Helmet', type: 'equipment', slot: EquipmentSlot.HEAD, armor: 6, price: 0, sellPrice: 250, soldTo: [NpcType.TRADER], description: 'Capacete escuro.', image: `${IMG_BASE}Dark_Helmet.gif` },
  { id: 'crown_helmet', name: 'Crown Helmet', type: 'equipment', slot: EquipmentSlot.HEAD, armor: 7, price: 0, sellPrice: 2500, soldTo: [NpcType.BLUE_DJINN], description: 'Elmo real.', image: `${IMG_BASE}Crown_Helmet.gif` },
  { id: 'crusader_helmet', name: 'Crusader Helmet', type: 'equipment', slot: EquipmentSlot.HEAD, armor: 8, price: 0, sellPrice: 6000, soldTo: [NpcType.BLUE_DJINN], description: 'Elmo cruzado.', image: `${IMG_BASE}Crusader_Helmet.gif` },
  { id: 'royal_helmet', name: 'Royal Helmet', type: 'equipment', slot: EquipmentSlot.HEAD, armor: 9, price: 0, sellPrice: 30000, soldTo: [NpcType.RASHID], description: 'Elmo da realeza.', image: `${IMG_BASE}Royal_Helmet.gif` },
  { id: 'zaoan_helmet', name: 'Zaoan Helmet', type: 'equipment', slot: EquipmentSlot.HEAD, armor: 9, price: 0, sellPrice: 45000, soldTo: [NpcType.RASHID], description: 'Elmo de Zao.', image: `${IMG_BASE}Zaoan_Helmet.gif` },
  { id: 'demon_helmet', name: 'Demon Helmet', type: 'equipment', slot: EquipmentSlot.HEAD, armor: 10, price: 0, sellPrice: 40000, soldTo: [NpcType.RASHID], description: 'Elmo demoníaco.', image: `${IMG_BASE}Demon_Helmet.gif` },
  { id: 'hat_of_the_mad', name: 'Hat of the Mad', type: 'equipment', slot: EquipmentSlot.HEAD, armor: 3, price: 0, sellPrice: 3000, soldTo: [NpcType.GREEN_DJINN], description: 'Chapéu do louco.', skillBonus: { [SkillType.MAGIC]: 1 }, image: `${IMG_BASE}Hat_of_the_Mad.gif` },
  { id: 'yalahari_mask', name: 'Yalahari Mask', type: 'equipment', slot: EquipmentSlot.HEAD, armor: 5, price: 0, sellPrice: 25000, soldTo: [NpcType.RASHID], description: 'Máscara Yalahari.', skillBonus: { [SkillType.MAGIC]: 2 }, image: `${IMG_BASE}Yalahari_Mask.gif` },
  { id: 'brass_helmet', name: 'Brass Helmet', type: 'equipment', slot: EquipmentSlot.HEAD, armor: 3, price: 30, sellPrice: 8, soldTo: [NpcType.TRADER], description: 'Capacete de latão.', image: `${IMG_BASE}Brass_Helmet.gif` },
  { id: 'steel_helmet', name: 'Steel Helmet', type: 'equipment', slot: EquipmentSlot.HEAD, armor: 6, price: 580, sellPrice: 290, soldTo: [NpcType.TRADER], description: 'Capacete de aço.', image: `${IMG_BASE}Steel_Helmet.gif` },
  { id: 'warrior_helmet', name: 'Warrior Helmet', type: 'equipment', slot: EquipmentSlot.HEAD, armor: 8, price: 0, sellPrice: 5000, soldTo: [NpcType.GREEN_DJINN], description: 'Capacete de guerreiro.', image: `${IMG_BASE}Warrior_Helmet.gif` },
  { id: 'cobra_hood', name: 'Cobra Hood', type: 'equipment', slot: EquipmentSlot.HEAD, armor: 15, price: 0, sellPrice: 200000, soldTo: [NpcType.RASHID], description: 'Capuz de Cobra.', image: `${IMG_BASE}Cobra_Hood.gif` },
  { id: 'falcon_coif', name: 'Falcon Coif', type: 'equipment', slot: EquipmentSlot.HEAD, armor: 12, price: 0, sellPrice: 200000, soldTo: [NpcType.RASHID], description: 'Coifa do Falcão.', image: `${IMG_BASE}Falcon_Coif.gif` },
  { id: 'lion_spangenhelm', name: 'Lion Spangenhelm', type: 'equipment', slot: EquipmentSlot.HEAD, armor: 11, price: 0, sellPrice: 200000, soldTo: [NpcType.RASHID], description: 'Elmo do Leão.', image: `${IMG_BASE}Lion_Spangenhelm.gif` },
  { id: 'werewolf_helmet', name: 'Werewolf Helmet', type: 'equipment', slot: EquipmentSlot.HEAD, armor: 8, price: 0, sellPrice: 20000, soldTo: [NpcType.RASHID], description: 'Elmo de lobisomem.', image: `${IMG_BASE}Werewolf_Helmet.gif` },
];
