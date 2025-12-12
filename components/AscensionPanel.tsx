
import React, { useState } from 'react';
import { Player, AscensionPerk } from '../types';
import { calculateSoulPointsToGain, getAscensionUpgradeCost, getAscensionBonusValue } from '../services';
import { Ghost, Skull, TrendingUp, DollarSign, Swords, Clock, Gift, Lock } from 'lucide-react';

interface AscensionPanelProps {
  player: Player;
  onAscend: () => void;
  onUpgrade: (perk: AscensionPerk) => void;
}

const TALENTS: { id: AscensionPerk, name: string, desc: string, icon: React.ReactNode }[] = [
    { id: 'gold_boost', name: 'Greed of the Dead', desc: 'Increases Gold drops from monsters.', icon: <DollarSign size={18} className="text-yellow-400"/> },
    { id: 'damage_boost', name: 'Spectral Power', desc: 'Increases all damage dealt.', icon: <Swords size={18} className="text-red-400"/> },
    { id: 'loot_boost', name: 'Fortune Seeker', desc: 'Increases rare item drop chance.', icon: <Gift size={18} className="text-blue-400"/> },
    { id: 'boss_cd', name: 'Time Warp', desc: 'Reduces Boss respawn cooldown.', icon: <Clock size={18} className="text-purple-400"/> },
    { id: 'soul_gain', name: 'Soul Harvest', desc: 'Increases Soul Points gained on Reset.', icon: <Ghost size={18} className="text-gray-300"/> },
];

export const AscensionPanel: React.FC<AscensionPanelProps> = ({ player, onAscend, onUpgrade }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  
  const pointsToGain = calculateSoulPointsToGain(player);
  const canAscend = player.level >= 25;

  return (
    <div className="h-full flex flex-col bg-[#1a051a] text-purple-100 overflow-hidden relative">
        
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-[url('https://tibia.fandom.com/wiki/Special:FilePath/Background_Artwork_Texture.jpg')] opacity-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black/80 pointer-events-none"></div>

        {/* Header */}
        <div className="relative z-10 p-6 flex items-center justify-between border-b border-purple-900/50 bg-black/40 shadow-xl">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-900/30 border border-purple-600 rounded-full shadow-[0_0_15px_rgba(147,51,234,0.5)] animate-pulse">
                    <Ghost size={32} className="text-purple-300" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold font-serif text-purple-200 tracking-wider drop-shadow-md">Soul War</h2>
                    <div className="text-xs text-purple-400 uppercase tracking-widest font-bold">Ascension System</div>
                </div>
            </div>
            
            <div className="flex flex-col items-end">
                <div className="text-[10px] uppercase text-purple-500 font-bold mb-1">Available Soul Points</div>
                <div className="text-3xl font-mono font-bold text-white drop-shadow-[0_0_10px_purple]">{player.soulPoints}</div>
            </div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden">
            
            {/* Left: Ascend Action */}
            <div className="w-full md:w-1/3 bg-black/40 border border-purple-900/30 rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-lg">
                <Skull size={64} className={`mb-4 ${canAscend ? 'text-purple-400 animate-bounce' : 'text-gray-700'}`} />
                <h3 className="text-xl font-bold text-white mb-2">Transcend Mortality</h3>
                <p className="text-xs text-purple-300 mb-6 leading-relaxed">
                    Reset your Level to 8 to gain Soul Points. <br/>
                    <span className="text-gray-400">Keep Skills. <span className="text-red-400 font-bold">Lose Items & Gold.</span></span>
                </p>

                <div className="bg-purple-900/20 border border-purple-800 p-4 rounded w-full mb-6">
                    <div className="text-[10px] uppercase text-purple-400 font-bold mb-1">Points on Reset</div>
                    <div className={`text-4xl font-bold ${pointsToGain > 0 ? 'text-green-400' : 'text-gray-600'}`}>+{pointsToGain}</div>
                    <div className="text-[9px] text-gray-500 mt-2">Requires Level 25+</div>
                </div>

                {!showConfirm ? (
                    <button 
                        onClick={() => setShowConfirm(true)}
                        disabled={!canAscend}
                        className={`w-full py-3 font-bold text-sm rounded border transition-all shadow-lg uppercase tracking-wider
                            ${canAscend 
                                ? 'bg-purple-700 hover:bg-purple-600 text-white border-purple-500 shadow-purple-900/50' 
                                : 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed'}
                        `}
                    >
                        {canAscend ? 'Ascend Now' : `Level ${player.level} / 25`}
                    </button>
                ) : (
                    <div className="w-full animate-in fade-in zoom-in duration-200">
                        <p className="text-red-400 text-xs font-bold mb-2">Are you sure? You will lose all items and gold.</p>
                        <div className="flex gap-2">
                            <button onClick={onAscend} className="flex-1 bg-red-900 hover:bg-red-800 text-white py-2 rounded font-bold border border-red-700">Yes, Do it</button>
                            <button onClick={() => setShowConfirm(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded font-bold">Cancel</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Right: Skill Tree */}
            <div className="flex-1 bg-black/40 border border-purple-900/30 rounded-lg p-4 flex flex-col shadow-lg overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-2 mb-4 border-b border-purple-900/30 pb-2">
                    <TrendingUp size={18} className="text-purple-400"/>
                    <h3 className="text-lg font-bold text-gray-200">Soul Tree</h3>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {TALENTS.map(talent => {
                        const currentLevel = player.ascension?.[talent.id] || 0;
                        const cost = getAscensionUpgradeCost(currentLevel);
                        const canAfford = player.soulPoints >= cost;
                        const bonusValue = getAscensionBonusValue(player, talent.id);

                        return (
                            <div key={talent.id} className="bg-[#1a1a1a] border border-[#333] p-3 rounded flex items-center justify-between group hover:border-purple-700 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-black border border-[#444] rounded flex items-center justify-center shadow-inner group-hover:shadow-[0_0_10px_rgba(168,85,247,0.2)] transition-all">
                                        {talent.icon}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-200 group-hover:text-purple-300">{talent.name}</div>
                                        <div className="text-[10px] text-gray-500">{talent.desc}</div>
                                        <div className="text-[10px] mt-1 text-purple-400 font-mono">Current: Level {currentLevel} (+{bonusValue}%)</div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => onUpgrade(talent.id)}
                                    disabled={!canAfford}
                                    className={`
                                        flex flex-col items-center justify-center w-20 py-1.5 rounded border transition-all
                                        ${canAfford 
                                            ? 'bg-purple-900/40 hover:bg-purple-800 border-purple-600 text-purple-200' 
                                            : 'bg-[#111] border-[#333] text-gray-600 cursor-not-allowed'}
                                    `}
                                >
                                    <span className="text-[10px] uppercase font-bold">Upgrade</span>
                                    <span className="text-xs font-mono font-bold">{cost} SP</span>
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    </div>
  );
};
