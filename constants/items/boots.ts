
import { Item, EquipmentSlot, NpcType } from '../../types';
import { IMG_BASE } from '../config';

export const BOOTS_LIST: Item[] = [
  { id: 'leather_boots', name: 'Leather Boots', type: 'equipment', slot: EquipmentSlot.FEET, armor: 1, price: 10, sellPrice: 2, soldTo: [NpcType.TRADER], description: 'Botas de couro.', image: `${IMG_BASE}Leather_Boots.gif` },
  { id: 'crocodile_boots', name: 'Crocodile Boots', type: 'equipment', slot: EquipmentSlot.FEET, armor: 2, price: 0, sellPrice: 1000, soldTo: [NpcType.GREEN_DJINN], description: 'Botas de crocodilo.', image: `${IMG_BASE}Crocodile_Boots.gif` },
  { id: 'steel_boots', name: 'Steel Boots', type: 'equipment', slot: EquipmentSlot.FEET, armor: 3, price: 0, sellPrice: 30000, soldTo: [NpcType.RASHID], description: 'Botas de aço.', image: `${IMG_BASE}Steel_Boots.gif` },
  { id: 'guardian_boots', name: 'Guardian Boots', type: 'equipment', slot: EquipmentSlot.FEET, armor: 3, price: 0, sellPrice: 35000, soldTo: [NpcType.RASHID], description: 'Botas guardiãs.', image: `${IMG_BASE}Guardian_Boots.gif` },
  { id: 'draken_boots', name: 'Draken Boots', type: 'equipment', slot: EquipmentSlot.FEET, armor: 3, price: 0, sellPrice: 40000, soldTo: [NpcType.RASHID], description: 'Botas Draken.', image: `${IMG_BASE}Draken_Boots.gif` },
  { id: 'firewalker_boots', name: 'Firewalker Boots', type: 'equipment', slot: EquipmentSlot.FEET, armor: 2, price: 0, sellPrice: 50000, soldTo: [NpcType.RASHID], description: 'Caminhante do fogo.', image: `${IMG_BASE}Firewalker_Boots.gif` },
  { id: 'soft_boots', name: 'Soft Boots', type: 'equipment', slot: EquipmentSlot.FEET, armor: 0, price: 0, sellPrice: 200000, soldTo: [NpcType.RASHID], description: 'Botas mágicas.', image: `${IMG_BASE}Soft_Boots.gif` },
  { id: 'boh', name: 'Boots of Haste', type: 'equipment', slot: EquipmentSlot.FEET, armor: 0, price: 0, sellPrice: 30000, soldTo: [NpcType.BLUE_DJINN], description: 'Botas da velocidade.', image: `${IMG_BASE}Boots_of_Haste.gif` },
  { id: 'cobra_boots', name: 'Cobra Boots', type: 'equipment', slot: EquipmentSlot.FEET, armor: 3, price: 0, sellPrice: 150000, soldTo: [NpcType.RASHID], description: 'Cobra Boots.', image: `${IMG_BASE}Cobra_Boots.gif` },
];
