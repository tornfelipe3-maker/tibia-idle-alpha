
import { Spell, Vocation, DamageType } from '../types';

export const SPELLS: Spell[] = [
    // --- HEALING SPELLS ---
    
    // Generic
    { id: 'exura', name: 'Light Healing (Exura)', manaCost: 20, minLevel: 8, reqMagicLevel: 0, price: 170, type: 'heal', vocations: [Vocation.KNIGHT, Vocation.PALADIN, Vocation.SORCERER, Vocation.DRUID], cooldown: 1000 },
    { id: 'exura_gran', name: 'Intense Healing (Exura Gran)', manaCost: 70, minLevel: 20, reqMagicLevel: 2, price: 350, type: 'heal', vocations: [Vocation.PALADIN, Vocation.SORCERER, Vocation.DRUID], cooldown: 1000 },
    { id: 'exura_vita', name: 'Ultimate Healing (Exura Vita)', manaCost: 160, minLevel: 30, reqMagicLevel: 7, price: 1000, type: 'heal', vocations: [Vocation.SORCERER, Vocation.DRUID], cooldown: 1000 },
    
    // Knight Healing
    { id: 'exura_ico', name: 'Recovery (Exura Ico)', manaCost: 40, minLevel: 30, reqMagicLevel: 4, price: 2000, type: 'heal', vocations: [Vocation.KNIGHT], cooldown: 1000 },
    { id: 'exura_gran_ico', name: 'Intense Recovery (Exura Gran Ico)', manaCost: 200, minLevel: 80, reqMagicLevel: 8, price: 10000, type: 'heal', vocations: [Vocation.KNIGHT], cooldown: 60000 }, // Long CD burst heal

    // Paladin Healing
    { id: 'exura_san', name: 'Divine Healing (Exura San)', manaCost: 160, minLevel: 40, reqMagicLevel: 15, price: 3000, type: 'heal', vocations: [Vocation.PALADIN], cooldown: 1000 },
    { id: 'exura_gran_san', name: 'Salvation (Exura Gran San)', manaCost: 210, minLevel: 60, reqMagicLevel: 20, price: 15000, type: 'heal', vocations: [Vocation.PALADIN], cooldown: 1000 },

    // Druid Healing
    { id: 'exura_gran_mas_res', name: 'Mass Healing (Mas Res)', manaCost: 150, minLevel: 36, reqMagicLevel: 19, price: 9000, type: 'heal', vocations: [Vocation.DRUID], cooldown: 2000 },

    // Monk Healing
    { id: 'exura_med', name: 'Meditation (Exura Med)', manaCost: 50, minLevel: 10, reqMagicLevel: 1, price: 300, type: 'heal', vocations: [Vocation.MONK], cooldown: 1000 },


    // --- ATTACK SPELLS ---

    // Knight Attack
    { id: 'exori', name: 'Berserk (Exori)', manaCost: 115, minLevel: 35, reqMagicLevel: 4, price: 2500, type: 'attack', vocations: [Vocation.KNIGHT], damageType: DamageType.PHYSICAL, cooldown: 4000 },
    { id: 'exori_min', name: 'Fierce Berserk (Exori Min)', manaCost: 340, minLevel: 70, reqMagicLevel: 6, price: 7500, type: 'attack', vocations: [Vocation.KNIGHT], damageType: DamageType.PHYSICAL, cooldown: 6000 },
    { id: 'exori_gran', name: 'Front Sweep (Exori Gran)', manaCost: 340, minLevel: 90, reqMagicLevel: 6, price: 3000, type: 'attack', vocations: [Vocation.KNIGHT], damageType: DamageType.PHYSICAL, cooldown: 6000 },
    { id: 'exori_hur', name: 'Whirlwind Throw (Exori Hur)', manaCost: 40, minLevel: 28, reqMagicLevel: 4, price: 1000, type: 'attack', vocations: [Vocation.KNIGHT], damageType: DamageType.PHYSICAL, cooldown: 6000 },
    { id: 'exori_mas', name: 'Groundshaker (Exori Mas)', manaCost: 160, minLevel: 33, reqMagicLevel: 4, price: 1500, type: 'attack', vocations: [Vocation.KNIGHT], damageType: DamageType.PHYSICAL, cooldown: 8000 },
    { id: 'exori_gran_ico', name: 'Annihilation (Exori Gran Ico)', manaCost: 300, minLevel: 110, reqMagicLevel: 9, price: 20000, type: 'attack', vocations: [Vocation.KNIGHT], damageType: DamageType.PHYSICAL, cooldown: 30000 },

    // Paladin Attack
    { id: 'exori_con', name: 'Ethereal Spear (Exori Con)', manaCost: 25, minLevel: 23, reqMagicLevel: 3, price: 1100, type: 'attack', vocations: [Vocation.PALADIN], damageType: DamageType.PHYSICAL, cooldown: 2000 },
    { id: 'exori_san', name: 'Divine Missile (Exori San)', manaCost: 20, minLevel: 40, reqMagicLevel: 15, price: 1800, type: 'attack', vocations: [Vocation.PALADIN], damageType: DamageType.HOLY, cooldown: 2000 },
    { id: 'exevo_mas_san', name: 'Divine Caldera (Mas San)', manaCost: 160, minLevel: 50, reqMagicLevel: 15, price: 3000, type: 'attack', vocations: [Vocation.PALADIN], damageType: DamageType.HOLY, cooldown: 4000 },
    { id: 'exori_gran_con', name: 'Strong Ethereal (Gran Con)', manaCost: 55, minLevel: 90, reqMagicLevel: 20, price: 20000, type: 'attack', vocations: [Vocation.PALADIN], damageType: DamageType.PHYSICAL, cooldown: 8000 },

    // Sorcerer Attack
    { id: 'exori_flam', name: 'Fire Strike (Exori Flam)', manaCost: 20, minLevel: 12, reqMagicLevel: 1, price: 800, type: 'attack', vocations: [Vocation.SORCERER, Vocation.DRUID], damageType: DamageType.FIRE, cooldown: 2000 },
    { id: 'exori_vis', name: 'Energy Strike (Exori Vis)', manaCost: 20, minLevel: 12, reqMagicLevel: 1, price: 800, type: 'attack', vocations: [Vocation.SORCERER, Vocation.DRUID], damageType: DamageType.ENERGY, cooldown: 2000 },
    { id: 'exori_mort', name: 'Death Strike (Exori Mort)', manaCost: 20, minLevel: 16, reqMagicLevel: 2, price: 1200, type: 'attack', vocations: [Vocation.SORCERER], damageType: DamageType.DEATH, cooldown: 2000 },
    
    { id: 'exevo_flam_hur', name: 'Fire Wave (Flam Hur)', manaCost: 25, minLevel: 18, reqMagicLevel: 2, price: 800, type: 'attack', vocations: [Vocation.SORCERER], damageType: DamageType.FIRE, cooldown: 4000 },
    { id: 'exevo_vis_hur', name: 'Energy Wave (Vis Hur)', manaCost: 170, minLevel: 38, reqMagicLevel: 15, price: 2500, type: 'attack', vocations: [Vocation.SORCERER], damageType: DamageType.ENERGY, cooldown: 8000 },
    { id: 'exevo_vis_lux', name: 'Energy Beam (Vis Lux)', manaCost: 40, minLevel: 23, reqMagicLevel: 6, price: 1000, type: 'attack', vocations: [Vocation.SORCERER], damageType: DamageType.ENERGY, cooldown: 4000 },
    { id: 'exevo_gran_vis_lux', name: 'Great Energy Beam (Gran Vis Lux)', manaCost: 110, minLevel: 29, reqMagicLevel: 10, price: 1800, type: 'attack', vocations: [Vocation.SORCERER], damageType: DamageType.ENERGY, cooldown: 6000 },
    
    { id: 'exevo_gran_mas_vis', name: 'Rage of the Skies (Mas Vis)', manaCost: 600, minLevel: 55, reqMagicLevel: 30, price: 6000, type: 'attack', vocations: [Vocation.SORCERER], damageType: DamageType.ENERGY, cooldown: 40000 },
    { id: 'exevo_gran_mas_flam', name: 'Hell\'s Core (Mas Flam)', manaCost: 1100, minLevel: 60, reqMagicLevel: 40, price: 8000, type: 'attack', vocations: [Vocation.SORCERER], damageType: DamageType.FIRE, cooldown: 40000 },

    // Druid Attack
    { id: 'exori_tera', name: 'Terra Strike (Exori Tera)', manaCost: 20, minLevel: 13, reqMagicLevel: 1, price: 800, type: 'attack', vocations: [Vocation.DRUID, Vocation.SORCERER], damageType: DamageType.EARTH, cooldown: 2000 },
    { id: 'exori_frigo', name: 'Ice Strike (Exori Frigo)', manaCost: 20, minLevel: 15, reqMagicLevel: 1, price: 800, type: 'attack', vocations: [Vocation.DRUID, Vocation.SORCERER], damageType: DamageType.ICE, cooldown: 2000 },
    { id: 'exori_moe_ico', name: 'Physical Strike (Moe Ico)', manaCost: 20, minLevel: 16, reqMagicLevel: 3, price: 800, type: 'attack', vocations: [Vocation.DRUID], damageType: DamageType.PHYSICAL, cooldown: 2000 },

    { id: 'exevo_frigo_hur', name: 'Ice Wave (Frigo Hur)', manaCost: 25, minLevel: 18, reqMagicLevel: 2, price: 800, type: 'attack', vocations: [Vocation.DRUID], damageType: DamageType.ICE, cooldown: 4000 },
    { id: 'exevo_tera_hur', name: 'Terra Wave (Tera Hur)', manaCost: 210, minLevel: 38, reqMagicLevel: 15, price: 2500, type: 'attack', vocations: [Vocation.DRUID], damageType: DamageType.EARTH, cooldown: 8000 },
    { id: 'exevo_gran_frigo_hur', name: 'Strong Ice Wave (Gran Frigo)', manaCost: 170, minLevel: 40, reqMagicLevel: 18, price: 6000, type: 'attack', vocations: [Vocation.DRUID], damageType: DamageType.ICE, cooldown: 8000 },

    { id: 'exevo_gran_mas_tera', name: 'Wrath of Nature (Mas Tera)', manaCost: 700, minLevel: 55, reqMagicLevel: 35, price: 6000, type: 'attack', vocations: [Vocation.DRUID], damageType: DamageType.EARTH, cooldown: 40000 },
    { id: 'exevo_gran_mas_frigo', name: 'Eternal Winter (Mas Frigo)', manaCost: 1050, minLevel: 60, reqMagicLevel: 40, price: 8000, type: 'attack', vocations: [Vocation.DRUID], damageType: DamageType.ICE, cooldown: 40000 },

    // Monk Attack (Custom)
    { id: 'exori_impact', name: 'Palm Strike (Exori Impact)', manaCost: 40, minLevel: 20, reqMagicLevel: 2, price: 800, type: 'attack', vocations: [Vocation.MONK], damageType: DamageType.PHYSICAL, cooldown: 2000 },
    { id: 'exori_max', name: 'Chi Blast (Exori Max)', manaCost: 200, minLevel: 60, reqMagicLevel: 10, price: 5000, type: 'attack', vocations: [Vocation.MONK], damageType: DamageType.HOLY, cooldown: 5000 },
];
