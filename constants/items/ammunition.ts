
import { Item, EquipmentSlot, NpcType } from '../../types';
import { IMG_BASE } from '../config';

export const AMMUNITION_LIST: Item[] = [
  { id: 'arrow', name: 'Arrow', type: 'equipment', slot: EquipmentSlot.AMMO, attack: 25, price: 3, sellPrice: 1, soldTo: [NpcType.TRADER], description: 'Munição básica para Arcos.', ammoType: 'arrow', image: `${IMG_BASE}Arrow.gif` },
  { id: 'bolt', name: 'Bolt', type: 'equipment', slot: EquipmentSlot.AMMO, attack: 30, price: 4, sellPrice: 1, soldTo: [NpcType.TRADER], description: 'Munição básica para Bestas.', ammoType: 'bolt', image: `${IMG_BASE}Bolt.gif` },
  { id: 'onyx_arrow', name: 'Onyx Arrow', type: 'equipment', slot: EquipmentSlot.AMMO, attack: 38, price: 7, sellPrice: 2, soldTo: [NpcType.TRADER], description: 'Flecha balanceada.', ammoType: 'arrow', image: `${IMG_BASE}Onyx_Arrow.gif` },
  { id: 'piercing_bolt', name: 'Piercing Bolt', type: 'equipment', slot: EquipmentSlot.AMMO, attack: 33, price: 5, sellPrice: 2, soldTo: [NpcType.TRADER], description: 'Perfurante.', ammoType: 'bolt', image: `${IMG_BASE}Piercing_Bolt.gif` },
  { id: 'power_bolt', name: 'Power Bolt', type: 'equipment', slot: EquipmentSlot.AMMO, attack: 40, price: 7, sellPrice: 3, soldTo: [NpcType.TRADER], description: 'Poderoso.', ammoType: 'bolt', image: `${IMG_BASE}Power_Bolt.gif` },
  { id: 'infernal_bolt', name: 'Infernal Bolt', type: 'equipment', slot: EquipmentSlot.AMMO, attack: 72, price: 0, sellPrice: 100, soldTo: [NpcType.RASHID], description: 'Feito de alma demoníaca.', ammoType: 'bolt', image: `${IMG_BASE}Infernal_Bolt.gif` },
  { id: 'crystalline_arrow', name: 'Crystalline Arrow', type: 'equipment', slot: EquipmentSlot.AMMO, attack: 65, price: 20, sellPrice: 5, soldTo: [NpcType.BLUE_DJINN], description: 'Flecha cristalina (Lvl 90).', ammoType: 'arrow', requiredLevel: 90, image: `${IMG_BASE}Crystalline_Arrow.gif` },
  { id: 'prismatic_bolt', name: 'Prismatic Bolt', type: 'equipment', slot: EquipmentSlot.AMMO, attack: 66, price: 20, sellPrice: 5, soldTo: [NpcType.BLUE_DJINN], description: 'Besta prismática (Lvl 90).', ammoType: 'bolt', requiredLevel: 90, image: `${IMG_BASE}Prismatic_Bolt.gif` },
  { id: 'spectral_bolt', name: 'Spectral Bolt', type: 'equipment', slot: EquipmentSlot.AMMO, attack: 78, price: 0, sellPrice: 20, soldTo: [NpcType.RASHID], description: 'Munição fantasma (Lvl 150).', ammoType: 'bolt', requiredLevel: 150, image: `${IMG_BASE}Spectral_Bolt.gif` },
  { id: 'diamond_arrow', name: 'Diamond Arrow', type: 'equipment', slot: EquipmentSlot.AMMO, attack: 37, price: 100, sellPrice: 10, soldTo: [NpcType.RASHID], description: 'Flecha de área (Lvl 150).', ammoType: 'arrow', requiredLevel: 150, image: `${IMG_BASE}Diamond_Arrow.gif` },
];
