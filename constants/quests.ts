
import { Quest, NpcType } from '../types';

export const QUESTS: Quest[] = [
    { id: 'green_djinn_access', name: 'Green Djinn Quest', description: 'Mate 1000 Blue Djinns para ganhar a confiança de Alesar.', targetMonsterId: 'blue_djinn', requiredKills: 1000, rewardNpcAccess: NpcType.GREEN_DJINN },
    { id: 'blue_djinn_access', name: 'Blue Djinn Quest', description: 'Mate 1000 Green Djinns para ganhar a confiança de Nahari.', targetMonsterId: 'green_djinn', requiredKills: 1000, rewardNpcAccess: NpcType.BLUE_DJINN },
    { id: 'rashid_access', name: 'Rashid Quest', description: 'Mate 2000 Dragons para provar seu valor ao mercador viajante.', targetMonsterId: 'dragon', requiredKills: 2000, rewardNpcAccess: NpcType.RASHID },
];
