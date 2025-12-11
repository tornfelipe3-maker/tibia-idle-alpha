
import { Item, EquipmentSlot, NpcType } from '../../types';
import { IMG_BASE } from '../config';

export const SHIELDS_LIST: Item[] = [
  { id: 'plate_shield', name: 'Plate Shield', type: 'equipment', slot: EquipmentSlot.HAND_LEFT, defense: 17, price: 125, sellPrice: 45, soldTo: [NpcType.TRADER], description: 'Escudo de placas.', image: `${IMG_BASE}Plate_Shield.gif` },
  { id: 'steel_shield', name: 'Steel Shield', type: 'equipment', slot: EquipmentSlot.HAND_LEFT, defense: 21, price: 240, sellPrice: 80, soldTo: [NpcType.TRADER], description: 'Escudo de aço.', image: `${IMG_BASE}Steel_Shield.gif` },
  { id: 'battle_shield', name: 'Battle Shield', type: 'equipment', slot: EquipmentSlot.HAND_LEFT, defense: 23, price: 0, sellPrice: 95, soldTo: [NpcType.TRADER], description: 'Escudo de batalha.', image: `${IMG_BASE}Battle_Shield.gif` },
  { id: 'dwarven_shield', name: 'Dwarven Shield', type: 'equipment', slot: EquipmentSlot.HAND_LEFT, defense: 26, price: 500, sellPrice: 100, soldTo: [NpcType.TRADER], description: 'Escudo anão.', image: `${IMG_BASE}Dwarven_Shield.gif` },
  { id: 'guardian_shield', name: 'Guardian Shield', type: 'equipment', slot: EquipmentSlot.HAND_LEFT, defense: 28, price: 2000, sellPrice: 1500, soldTo: [NpcType.BLUE_DJINN], description: 'Escudo guardião.', image: `${IMG_BASE}Guardian_Shield.gif` },
  { id: 'dragon_shield', name: 'Dragon Shield', type: 'equipment', slot: EquipmentSlot.HAND_LEFT, defense: 31, price: 4000, sellPrice: 4000, soldTo: [NpcType.GREEN_DJINN], description: 'Escudo de dragão.', image: `${IMG_BASE}Dragon_Shield.gif` },
  { id: 'tower_shield', name: 'Tower Shield', type: 'equipment', slot: EquipmentSlot.HAND_LEFT, defense: 32, price: 0, sellPrice: 8000, soldTo: [NpcType.GREEN_DJINN], description: 'Escudo de torre.', image: `${IMG_BASE}Tower_Shield.gif` },
  { id: 'crown_shield', name: 'Crown Shield', type: 'equipment', slot: EquipmentSlot.HAND_LEFT, defense: 32, price: 0, sellPrice: 8000, soldTo: [NpcType.BLUE_DJINN], description: 'Escudo real.', image: `${IMG_BASE}Crown_Shield.gif` },
  { id: 'medusa_shield', name: 'Medusa Shield', type: 'equipment', slot: EquipmentSlot.HAND_LEFT, defense: 33, price: 0, sellPrice: 9000, soldTo: [NpcType.BLUE_DJINN], description: 'Escudo da Medusa.', image: `${IMG_BASE}Medusa_Shield.gif` },
  { id: 'vampire_shield', name: 'Vampire Shield', type: 'equipment', slot: EquipmentSlot.HAND_LEFT, defense: 34, price: 0, sellPrice: 15000, soldTo: [NpcType.RASHID], description: 'Escudo de vampiro.', image: `${IMG_BASE}Vampire_Shield.gif` },
  { id: 'demon_shield', name: 'Demon Shield', type: 'equipment', slot: EquipmentSlot.HAND_LEFT, defense: 35, price: 0, sellPrice: 30000, soldTo: [NpcType.RASHID], description: 'Escudo demoníaco.', image: `${IMG_BASE}Demon_Shield.gif` },
  { id: 'mastermind_shield', name: 'Mastermind Shield', type: 'equipment', slot: EquipmentSlot.HAND_LEFT, defense: 37, price: 0, sellPrice: 50000, soldTo: [NpcType.RASHID], description: 'MMS.', image: `${IMG_BASE}Mastermind_Shield.gif` },
  { id: 'great_shield', name: 'Great Shield', type: 'equipment', slot: EquipmentSlot.HAND_LEFT, defense: 38, price: 0, sellPrice: 100000, soldTo: [NpcType.RASHID], description: 'Escudo lendário.', image: `${IMG_BASE}Great_Shield.gif` },
  { id: 'spike_shield', name: 'Spike Shield', type: 'equipment', slot: EquipmentSlot.HAND_LEFT, defense: 24, price: 0, sellPrice: 250, soldTo: [NpcType.GREEN_DJINN], description: 'Shield with spikes.', image: `${IMG_BASE}Spike_Shield.gif` },
  { id: 'jellyfish_shield', name: 'Jellyfish Shield', type: 'equipment', slot: EquipmentSlot.HAND_LEFT, defense: 33, price: 0, sellPrice: 3000, soldTo: [NpcType.GREEN_DJINN], description: 'Shield from the sea.', image: `${IMG_BASE}Jellyfish_Shield.gif` },
  { id: 'snake_gods_wristguard', name: 'Snake Gods Wristguard', type: 'equipment', slot: EquipmentSlot.HAND_LEFT, defense: 34, price: 0, sellPrice: 2000, soldTo: [NpcType.RASHID], description: 'Ancient wristguard.', image: `${IMG_BASE}Snake_God%27s_Wristguard.gif` },
  { id: 'falcon_shield', name: 'Falcon Shield', type: 'equipment', slot: EquipmentSlot.HAND_LEFT, defense: 39, price: 0, sellPrice: 200000, soldTo: [NpcType.RASHID], description: 'Escudo do Falcão.', image: `${IMG_BASE}Falcon_Shield.gif` },
  { id: 'lion_shield', name: 'Lion Shield', type: 'equipment', slot: EquipmentSlot.HAND_LEFT, defense: 37, price: 0, sellPrice: 150000, soldTo: [NpcType.RASHID], description: 'Escudo do Leão.', image: `${IMG_BASE}Lion_Shield.gif` },
  { id: 'moon_mirror', name: 'Moon Mirror', type: 'equipment', slot: EquipmentSlot.HAND_LEFT, defense: 0, price: 0, sellPrice: 30000, soldTo: [NpcType.RASHID], description: 'Espelho da lua.', image: `${IMG_BASE}Moon_Mirror.gif` },
];
