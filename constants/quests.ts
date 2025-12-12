
import { Quest, NpcType } from '../types';

export const QUESTS: Quest[] = [
    // --- EARLY GAME PROGRESSION (ROOKGAARD SPIRIT) ---
    { 
        id: 'q_rat_plague', 
        name: 'The Rat Plague', 
        description: 'Os esgotos estão infestados! Mate 20 Rats para ajudar a cidade.', 
        targetMonsterId: 'rat', 
        requiredKills: 20, 
        rewardItems: [{ itemId: 'dagger', count: 1 }, { itemId: 'leather_boots', count: 1 }],
        rewardGold: 50,
        rewardExp: 100
    },
    { 
        id: 'q_troll_sabotage', 
        name: 'Troll Sabotage', 
        description: 'Trolls roubaram suprimentos. Recupere a honra da guarda matando 30 Trolls.', 
        targetMonsterId: 'troll', 
        requiredKills: 30, 
        rewardItems: [{ itemId: 'leather_armor', count: 1 }, { itemId: 'studded_legs', count: 1 }],
        rewardGold: 100,
        rewardExp: 300
    },
    {
        id: 'q_bear_necessities',
        name: 'Bear Necessities',
        description: 'Prove sua força caçando 10 Ursos na floresta.',
        targetMonsterId: 'bear',
        requiredKills: 10,
        rewardItems: [{ itemId: 'plate_shield', count: 1 }],
        rewardGold: 200,
        rewardExp: 500
    },
    {
        id: 'q_rotworm_catacombs',
        name: 'Rotworm Catacombs',
        description: 'A "Katana Quest". Limpe as catacumbas matando 50 Rotworms.',
        targetMonsterId: 'rotworm',
        requiredKills: 50,
        rewardItems: [{ itemId: 'katana', count: 1 }, { itemId: 'copper_shield', count: 1 }], // Copper shield added to shields if not exists, fallback logic in engine
        rewardGold: 500,
        rewardExp: 1000
    },
    {
        id: 'q_arrival_main',
        name: 'Arrival at Mainland',
        description: 'Alcance o nível 8 para receber seu equipamento de vocação.',
        requiredLevel: 8,
        rewardGold: 1000,
        rewardItems: [{ itemId: 'soldier_helmet', count: 1 }]
    },

    // --- MID GAME ---
    { 
        id: 'q_cyclops_hunt', 
        name: 'Cyclopolis Hunt', 
        description: 'Mate 50 Cyclops para forjar uma arma melhor.', 
        targetMonsterId: 'cyclops', 
        requiredKills: 50, 
        rewardItems: [{ itemId: 'plate_armor', count: 1 }, { itemId: 'plate_legs', count: 1 }],
        rewardGold: 2000,
        rewardExp: 5000
    },

    // --- NPC ACCESS QUESTS ---
    { id: 'green_djinn_access', name: 'Green Djinn Quest', description: 'Mate 1000 Blue Djinns para ganhar a confiança de Alesar.', targetMonsterId: 'blue_djinn', requiredKills: 1000, rewardNpcAccess: NpcType.GREEN_DJINN },
    { id: 'blue_djinn_access', name: 'Blue Djinn Quest', description: 'Mate 1000 Green Djinns para ganhar a confiança de Nahari.', targetMonsterId: 'green_djinn', requiredKills: 1000, rewardNpcAccess: NpcType.BLUE_DJINN },
    { id: 'rashid_access', name: 'Rashid Quest', description: 'Mate 2000 Dragons para provar seu valor ao mercador viajante.', targetMonsterId: 'dragon', requiredKills: 2000, rewardNpcAccess: NpcType.RASHID },
];
