
import { Spell, Vocation, DamageType, SkillType } from '../types';

export const SPELLS: Spell[] = [
    { id: 'exura', name: 'Exura', manaCost: 20, minLevel: 8, price: 150, type: 'heal', vocations: [Vocation.KNIGHT, Vocation.PALADIN, Vocation.SORCERER, Vocation.DRUID], cooldown: 1000 },
    { id: 'exura_gran', name: 'Exura Gran', manaCost: 70, minLevel: 20, price: 350, type: 'heal', vocations: [Vocation.PALADIN, Vocation.SORCERER, Vocation.DRUID], cooldown: 1000 },
    { id: 'exura_vita', name: 'Exura Vita', manaCost: 160, minLevel: 20, price: 600, type: 'heal', vocations: [Vocation.SORCERER, Vocation.DRUID], cooldown: 1000 },
    
    // Attack Spells
    { id: 'exori', name: 'Exori', manaCost: 40, minLevel: 20, price: 800, type: 'attack', vocations: [Vocation.KNIGHT], cooldown: 2000 },
    { id: 'exori_gran', name: 'Exori Gran', manaCost: 340, minLevel: 90, price: 3000, type: 'attack', vocations: [Vocation.KNIGHT], damageType: DamageType.PHYSICAL, cooldown: 4000 },
    
    { id: 'exori_vis', name: 'Exori Vis', manaCost: 20, minLevel: 12, price: 400, type: 'attack', vocations: [Vocation.SORCERER], damageType: DamageType.ENERGY, cooldown: 2000 },
    { id: 'exevo_vis_hur', name: 'Exevo Vis Hur', manaCost: 170, minLevel: 38, price: 1500, type: 'attack', vocations: [Vocation.SORCERER], damageType: DamageType.ENERGY, cooldown: 6000 },
    { id: 'exevo_gran_mas_flam', name: 'Exevo Gran Mas Flam', manaCost: 600, minLevel: 60, price: 6000, type: 'attack', vocations: [Vocation.SORCERER], damageType: DamageType.FIRE, cooldown: 8000 },

    { id: 'exori_frigo', name: 'Exori Frigo', manaCost: 20, minLevel: 12, price: 400, type: 'attack', vocations: [Vocation.DRUID], damageType: DamageType.ICE, cooldown: 2000 },
    { id: 'exevo_frigo_hur', name: 'Exevo Frigo Hur', manaCost: 25, minLevel: 18, price: 800, type: 'attack', vocations: [Vocation.DRUID], damageType: DamageType.ICE, cooldown: 3000 },
    { id: 'exevo_gran_mas_frigo', name: 'Exevo Gran Mas Frigo', manaCost: 600, minLevel: 60, price: 6000, type: 'attack', vocations: [Vocation.DRUID], damageType: DamageType.ICE, cooldown: 8000 },

    { id: 'exori_con', name: 'Exori Con', manaCost: 25, minLevel: 23, price: 400, type: 'attack', vocations: [Vocation.PALADIN], damageType: DamageType.PHYSICAL, cooldown: 2000 },
    { id: 'exevo_mas_san', name: 'Exevo Mas San', manaCost: 160, minLevel: 50, price: 3000, type: 'attack', vocations: [Vocation.PALADIN], damageType: DamageType.HOLY, cooldown: 4000 },

    // Monk Spells
    { id: 'exura_med', name: 'Exura Med', manaCost: 50, minLevel: 10, price: 300, type: 'heal', vocations: [Vocation.MONK], cooldown: 1000 },
    { id: 'exori_impact', name: 'Exori Impact', manaCost: 40, minLevel: 20, price: 800, type: 'attack', vocations: [Vocation.MONK], damageType: DamageType.PHYSICAL, cooldown: 2000 },
    { id: 'exori_max', name: 'Exori Max', manaCost: 200, minLevel: 60, price: 5000, type: 'attack', vocations: [Vocation.MONK], damageType: DamageType.HOLY, cooldown: 5000 },
];
