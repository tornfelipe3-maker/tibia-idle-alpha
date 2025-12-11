
import { Item, EquipmentSlot, NpcType, SkillType } from '../../types';
import { IMG_BASE } from '../config';

export const LEGS_LIST: Item[] = [
  { id: 'studded_legs', name: 'Studded Legs', type: 'equipment', slot: EquipmentSlot.LEGS, armor: 2, price: 50, sellPrice: 15, soldTo: [NpcType.TRADER], description: 'Calças cravejadas.', image: `${IMG_BASE}Studded_Legs.gif` },
  { id: 'brass_legs', name: 'Brass Legs', type: 'equipment', slot: EquipmentSlot.LEGS, armor: 5, price: 195, sellPrice: 49, soldTo: [NpcType.TRADER], description: 'Cheap legs.', image: `${IMG_BASE}Brass_Legs.gif` },
  { id: 'plate_legs', name: 'Plate Legs', type: 'equipment', slot: EquipmentSlot.LEGS, armor: 7, price: 0, sellPrice: 115, soldTo: [NpcType.TRADER], description: 'Calças de placas.', image: `${IMG_BASE}Plate_Legs.gif` },
  { id: 'grasshopper_legs', name: 'Grasshopper Legs', type: 'equipment', slot: EquipmentSlot.LEGS, armor: 7, price: 0, sellPrice: 30000, soldTo: [NpcType.RASHID], description: 'Calças de gafanhoto.', image: `${IMG_BASE}Grasshopper_Legs.gif` },
  { id: 'dwarven_legs', name: 'Dwarven Legs', type: 'equipment', slot: EquipmentSlot.LEGS, armor: 7, price: 0, sellPrice: 40000, soldTo: [NpcType.RASHID], description: 'Calças anãs.', image: `${IMG_BASE}Dwarven_Legs.gif` },
  { id: 'crown_legs', name: 'Crown Legs', type: 'equipment', slot: EquipmentSlot.LEGS, armor: 8, price: 0, sellPrice: 12000, soldTo: [NpcType.BLUE_DJINN], description: 'Calças reais.', image: `${IMG_BASE}Crown_Legs.gif` },
  { id: 'knight_legs', name: 'Knight Legs', type: 'equipment', slot: EquipmentSlot.LEGS, armor: 8, price: 0, sellPrice: 5000, soldTo: [NpcType.GREEN_DJINN], description: 'Calças de cavaleiro.', image: `${IMG_BASE}Knight_Legs.gif` },
  { id: 'blue_legs', name: 'Blue Legs', type: 'equipment', slot: EquipmentSlot.LEGS, armor: 8, price: 0, sellPrice: 15000, soldTo: [NpcType.BLUE_DJINN], description: 'Calças azuis.', image: `${IMG_BASE}Blue_Legs.gif` },
  { id: 'zaoan_legs', name: 'Zaoan Legs', type: 'equipment', slot: EquipmentSlot.LEGS, armor: 8, price: 0, sellPrice: 14000, soldTo: [NpcType.RASHID], description: 'Calças de Zao.', image: `${IMG_BASE}Zaoan_Legs.gif` },
  { id: 'g_legs', name: 'Golden Legs', type: 'equipment', slot: EquipmentSlot.LEGS, armor: 9, price: 0, sellPrice: 50000, soldTo: [NpcType.RASHID], description: 'Calças douradas.', image: `${IMG_BASE}Golden_Legs.gif` },
  { id: 'prismatic_legs', name: 'Prismatic Legs', type: 'equipment', slot: EquipmentSlot.LEGS, armor: 9, price: 0, sellPrice: 25000, soldTo: [NpcType.RASHID], description: 'Calças prismáticas.', skillBonus: { [SkillType.DISTANCE]: 1 }, image: `${IMG_BASE}Prismatic_Legs.gif` },
  { id: 'falcon_greaves', name: 'Falcon Greaves', type: 'equipment', slot: EquipmentSlot.LEGS, armor: 11, price: 0, sellPrice: 250000, soldTo: [NpcType.RASHID], description: 'Grevas do Falcão.', image: `${IMG_BASE}Falcon_Greaves.gif` },
];
