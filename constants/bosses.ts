
import { Boss } from '../types';
import { IMG_BASE } from './config';

export const BOSSES: Boss[] = [
    { id: 'horned_fox', name: 'The Horned Fox', level: 50, hp: 2000, maxHp: 2000, exp: 5000, minGold: 500, maxGold: 1000, damageMin: 50, damageMax: 150, attackSpeedMs: 1500, cooldownSeconds: 3600, isDaily: false, lootTable: [{ itemId: 'nose_ring', chance: 1.0, maxAmount: 1 }], image: `${IMG_BASE}The_Horned_Fox.gif` },
    { id: 'demodras', name: 'Demodras', level: 80, hp: 4500, maxHp: 4500, exp: 12000, minGold: 1000, maxGold: 2000, damageMin: 150, damageMax: 300, attackSpeedMs: 1500, cooldownSeconds: 7200, isDaily: false, lootTable: [{ itemId: 'dragon_claw', chance: 1.0, maxAmount: 1 }, { itemId: 'gold_ingot', chance: 0.1, maxAmount: 1 }, { itemId: 'red_dragon_leather', chance: 0.5, maxAmount: 1 }], image: `${IMG_BASE}Demodras.gif` },
    
    // SCARLETT ETZEL
    { 
        id: 'scarlett_etzel', 
        name: 'Scarlett Etzel', 
        level: 400, 
        hp: 25000, 
        maxHp: 25000, 
        exp: 18000, 
        minGold: 2000, 
        maxGold: 10000, 
        damageMin: 300, 
        damageMax: 800, 
        attackSpeedMs: 1000, 
        cooldownSeconds: 72000, 
        isDaily: true, 
        lootTable: [
            { itemId: 'cobra_hood', chance: 0.01, maxAmount: 1 }, 
            { itemId: 'cobra_boots', chance: 0.01, maxAmount: 1 }, 
            { itemId: 'cobra_amulet', chance: 0.01, maxAmount: 1 }, 
            { itemId: 'cobra_crossbow', chance: 0.01, maxAmount: 1 }, 
            { itemId: 'cobra_axe', chance: 0.005, maxAmount: 1 }, 
            { itemId: 'cobra_rod', chance: 0.005, maxAmount: 1 }, 
            { itemId: 'cobra_wand', chance: 0.005, maxAmount: 1 }, 
            { itemId: 'cobra_sword', chance: 0.005, maxAmount: 1 }, 
            { itemId: 'giant_cobra_scale', chance: 0.5, maxAmount: 1 }, 
            { itemId: 'cobra_tongue', chance: 0.5, maxAmount: 1 },
            { itemId: 'gold_ingot', chance: 0.3, maxAmount: 2 },
            { itemId: 'blue_gem', chance: 0.2, maxAmount: 1 },
            { itemId: 'violet_gem', chance: 0.1, maxAmount: 1 },
            { itemId: 'red_gem', chance: 0.2, maxAmount: 2 },
            { itemId: 'draconian_steel', chance: 0.05, maxAmount: 1 },
            { itemId: 'hell_steel', chance: 0.05, maxAmount: 1 }
        ], 
        image: `${IMG_BASE}Scarlett_Etzel.gif` 
    },

    // OBERON
    { 
        id: 'oberon', 
        name: 'Grand Master Oberon', 
        level: 300, 
        hp: 30000, 
        maxHp: 30000, 
        exp: 20000, 
        minGold: 5000, 
        maxGold: 15000, 
        damageMin: 350, 
        damageMax: 900, 
        attackSpeedMs: 1200, 
        cooldownSeconds: 72000, 
        isDaily: true, 
        lootTable: [
            { itemId: 'falcon_shield', chance: 0.01, maxAmount: 1 }, 
            { itemId: 'falcon_plate', chance: 0.005, maxAmount: 1 }, 
            { itemId: 'falcon_greaves', chance: 0.005, maxAmount: 1 }, 
            { itemId: 'falcon_coif', chance: 0.01, maxAmount: 1 }, 
            { itemId: 'falcon_battleaxe', chance: 0.01, maxAmount: 1 }, 
            { itemId: 'falcon_longsword', chance: 0.01, maxAmount: 1 }, 
            { itemId: 'falcon_mace', chance: 0.01, maxAmount: 1 }, 
            { itemId: 'falcon_rod', chance: 0.01, maxAmount: 1 }, 
            { itemId: 'falcon_wand', chance: 0.01, maxAmount: 1 }, 
            { itemId: 'grant_of_arms', chance: 0.2, maxAmount: 1 },
            { itemId: 'spatial_warp_almanac', chance: 0.05, maxAmount: 1 },
            { itemId: 'violet_gem', chance: 0.15, maxAmount: 1 },
            { itemId: 'giant_shimmering_pearl', chance: 0.2, maxAmount: 1 },
            { itemId: 'gold_ingot', chance: 0.25, maxAmount: 1 },
            { itemId: 'draconian_steel', chance: 0.05, maxAmount: 1 },
            { itemId: 'hell_steel', chance: 0.05, maxAmount: 1 }
        ], 
        image: `${IMG_BASE}Grand_Master_Oberon.gif` 
    },

    // FEROXA
    { 
        id: 'feroxa', 
        name: 'Feroxa', 
        level: 250, 
        hp: 15000, 
        maxHp: 15000, 
        exp: 12000, 
        minGold: 1000, 
        maxGold: 5000, 
        damageMin: 200, 
        damageMax: 600, 
        attackSpeedMs: 1500, 
        cooldownSeconds: 72000, 
        isDaily: true, 
        lootTable: [
            { itemId: 'werewolf_helmet', chance: 0.02, maxAmount: 1 }, 
            { itemId: 'werewolf_amulet', chance: 0.02, maxAmount: 1 }, 
            { itemId: 'moonlight_crystals', chance: 1.0, maxAmount: 5 }, 
            { itemId: 'wolf_paw', chance: 1.0, maxAmount: 1 },
            { itemId: 'black_pearl', chance: 0.3, maxAmount: 3 },
            { itemId: 'white_pearl', chance: 0.3, maxAmount: 5 },
            { itemId: 'gold_ingot', chance: 0.1, maxAmount: 1 }
        ], 
        image: `${IMG_BASE}Feroxa.gif` 
    },

    // GRIMVALE BOSSES
    { id: 'black_vixen', name: 'Black Vixen', level: 100, hp: 3500, maxHp: 3500, exp: 3500, minGold: 500, maxGold: 1000, damageMin: 150, damageMax: 300, attackSpeedMs: 1500, cooldownSeconds: 72000, isDaily: true, lootTable: [{ itemId: 'moonlight_crystals', chance: 0.5, maxAmount: 3 }, { itemId: 'red_gem', chance: 0.1, maxAmount: 1 }, { itemId: 'black_pearl', chance: 0.2, maxAmount: 1 }] , image: `${IMG_BASE}Black_Vixen.gif` },
    { id: 'bloodback', name: 'Bloodback', level: 110, hp: 4200, maxHp: 4200, exp: 3800, minGold: 600, maxGold: 1200, damageMin: 160, damageMax: 320, attackSpeedMs: 1500, cooldownSeconds: 72000, isDaily: true, lootTable: [{ itemId: 'moonlight_crystals', chance: 0.5, maxAmount: 3 }, { itemId: 'red_gem', chance: 0.1, maxAmount: 1 }, { itemId: 'white_pearl', chance: 0.3, maxAmount: 2 }], image: `${IMG_BASE}Bloodback.gif` },
    { id: 'darkfang', name: 'Darkfang', level: 120, hp: 4800, maxHp: 4800, exp: 4200, minGold: 700, maxGold: 1400, damageMin: 170, damageMax: 340, attackSpeedMs: 1500, cooldownSeconds: 72000, isDaily: true, lootTable: [{ itemId: 'moonlight_crystals', chance: 0.5, maxAmount: 3 }, { itemId: 'red_gem', chance: 0.1, maxAmount: 1 }, { itemId: 'stone_skin_amulet', chance: 0.1, maxAmount: 1 }], image: `${IMG_BASE}Darkfang.gif` },
    { id: 'sharpclaw', name: 'Sharpclaw', level: 130, hp: 5500, maxHp: 5500, exp: 4800, minGold: 800, maxGold: 1600, damageMin: 180, damageMax: 360, attackSpeedMs: 1500, cooldownSeconds: 72000, isDaily: true, lootTable: [{ itemId: 'moonlight_crystals', chance: 0.5, maxAmount: 3 }, { itemId: 'red_gem', chance: 0.1, maxAmount: 1 }, { itemId: 'gold_ingot', chance: 0.05, maxAmount: 1 }], image: `${IMG_BASE}Sharpclaw.gif` },
    { id: 'shadowpelt', name: 'Shadowpelt', level: 140, hp: 6000, maxHp: 6000, exp: 5500, minGold: 1000, maxGold: 2000, damageMin: 200, damageMax: 400, attackSpeedMs: 1500, cooldownSeconds: 72000, isDaily: true, lootTable: [{ itemId: 'moonlight_crystals', chance: 0.5, maxAmount: 3 }, { itemId: 'red_gem', chance: 0.1, maxAmount: 1 }, { itemId: 'violet_gem', chance: 0.05, maxAmount: 1 }], image: `${IMG_BASE}Shadowpelt.gif` },
];
