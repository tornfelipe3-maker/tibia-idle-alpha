
import React, { useState } from 'react';
import { Player, Vocation } from '../types';
import { Crown, Sun, Shield, Award, Heart, Zap, Coins } from 'lucide-react';

interface CastlePanelProps {
  player: Player;
  onPromote: () => void;
  onBuyBlessing: () => void;
}

export const CastlePanel: React.FC<CastlePanelProps> = ({ player, onPromote, onBuyBlessing }) => {
  const [activeTab, setActiveTab] = useState<'king' | 'blessed'>('king');

  // Helper for Promotion Cost/Check
  const PROMOTION_COST = 20000;
  const PROMOTION_LEVEL = 20;
  
  const canBePromoted = player.level >= PROMOTION_LEVEL && player.vocation !== Vocation.NONE;
  const isPromoted = player.promoted;

  // Blessing Logic
  const getBlessingCost = (level: number) => {
      if (level <= 30) return 2000;
      if (level >= 120) return 20000;
      return 2000 + (level - 30) * 200;
  };

  const getVocationName = () => {
      switch(player.vocation) {
          case Vocation.KNIGHT: return 'Elite Knight';
          case Vocation.PALADIN: return 'Royal Paladin';
          case Vocation.SORCERER: return 'Master Sorcerer';
          case Vocation.DRUID: return 'Elder Druid';
          case Vocation.MONK: return 'Master Monk';
          default: return 'Adventurer';
      }
  };

  return (
    <div className="flex flex-col h-full bg-[#222] text-[#ccc]">
        
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto bg-[#2d2d2d] border-b border-[#444] shrink-0">
            <button
                onClick={() => setActiveTab('king')}
                className={`px-6 py-3 text-xs font-bold border-r border-[#444] transition-colors flex items-center space-x-2
                    ${activeTab === 'king' ? 'bg-[#444] text-yellow-500' : 'bg-[#2d2d2d] text-gray-500 hover:text-gray-300'}
                `}
            >
                <Crown size={14} /> <span>King Tibianus</span>
            </button>
            <button
                onClick={() => setActiveTab('blessed')}
                className={`px-6 py-3 text-xs font-bold border-r border-[#444] transition-colors flex items-center space-x-2
                    ${activeTab === 'blessed' ? 'bg-[#444] text-yellow-500' : 'bg-[#2d2d2d] text-gray-500 hover:text-gray-300'}
                `}
            >
                <Sun size={14} /> <span>Henricus</span>
            </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 flex flex-col items-center justify-start text-center overflow-y-auto custom-scrollbar">
            
            {/* --- KING TIBIANUS TAB --- */}
            {activeTab === 'king' && (
                <div className="max-w-md w-full bg-[#1a1a1a] border border-[#333] rounded-lg shadow-lg p-6">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-yellow-900/20 rounded-full border border-yellow-700/50 relative">
                            <Crown size={48} className="text-yellow-500" />
                            <div className="absolute -bottom-2 -right-2 bg-[#111] border border-yellow-700 rounded-full p-1">
                                <Shield size={16} className="text-yellow-200" />
                            </div>
                        </div>
                    </div>
                    
                    <h2 className="text-xl font-bold text-yellow-500 mb-2 font-serif">King Tibianus</h2>
                    <p className="text-sm text-gray-400 mb-6 italic leading-relaxed px-4">
                        "I greet you, subject. Have you proven yourself worthy to serve the realm? 
                        I can grant you a special promotion if you have the skill and the gold."
                    </p>

                    {/* Promotion Benefits Card */}
                    <div className="bg-black/40 p-4 rounded border border-yellow-900/30 mb-6 text-left mx-2 shadow-inner">
                        <div className="text-xs text-yellow-500 font-bold uppercase mb-3 flex items-center gap-1 border-b border-yellow-900/20 pb-2">
                            <Award size={14} /> Elite Status Benefits
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-red-900/20 p-1.5 rounded text-red-400"><Heart size={16}/></div>
                                <div>
                                    <div className="text-[10px] text-gray-500 uppercase">Regeneration</div>
                                    <div className="text-green-400 font-bold">+80% Faster</div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="bg-orange-900/20 p-1.5 rounded text-orange-400"><Zap size={16}/></div>
                                <div>
                                    <div className="text-[10px] text-gray-500 uppercase">Damage</div>
                                    <div className="text-green-400 font-bold">+10% Power</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-4 pt-2 border-t border-[#333] text-[10px] text-gray-400">
                            New Title: <span className="text-white font-bold">{player.vocation !== Vocation.NONE ? getVocationName() : '???'}</span>
                        </div>
                    </div>

                    {/* Action */}
                    {isPromoted ? (
                        <div className="bg-green-900/20 border border-green-800 p-4 rounded text-green-400 font-bold flex items-center justify-center gap-2">
                            <Award /> You are already promoted.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex justify-between items-center bg-[#111] p-3 rounded border border-[#333]">
                                <span className="text-xs text-gray-400">Cost</span>
                                <span className={`font-bold ${player.gold >= PROMOTION_COST ? 'text-yellow-500' : 'text-red-500'}`}>
                                    {PROMOTION_COST.toLocaleString()} gp
                                </span>
                            </div>
                            
                            {!canBePromoted && (
                                <div className="text-red-500 text-xs bg-red-900/20 p-2 rounded border border-red-900/30">
                                    Requires Level {PROMOTION_LEVEL} and a Vocation.
                                </div>
                            )}

                            <button 
                                onClick={onPromote}
                                disabled={!canBePromoted || player.gold < PROMOTION_COST}
                                className={`
                                    w-full py-3 font-bold text-sm rounded shadow-md border transition-all flex items-center justify-center gap-2
                                    ${!canBePromoted || player.gold < PROMOTION_COST
                                        ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'
                                        : 'bg-yellow-900/30 hover:bg-yellow-900/50 border-yellow-700 text-yellow-200 hover:shadow-yellow-900/20'
                                    }
                                `}
                            >
                                <Award size={16} /> Purchase Promotion
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* --- HENRICUS (BLESSED) TAB --- */}
            {activeTab === 'blessed' && (
                <div className="max-w-md w-full bg-[#1a1a1a] border border-[#333] rounded-lg shadow-lg p-6">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-yellow-900/20 rounded-full border border-yellow-700/50">
                            <Sun size={48} className="text-yellow-500 animate-[pulse_3s_infinite]" />
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-yellow-500 mb-2 font-serif">Henricus</h2>
                    
                    <p className="text-sm text-gray-400 mb-6 italic leading-relaxed px-4">
                        "Greetings, traveller. The world is dangerous and death is a constant companion.
                        For a donation, I can ask the gods to protect your soul and your belongings."
                    </p>

                    <div className="bg-black/40 p-3 rounded border border-yellow-900/30 mb-6 text-left mx-2 shadow-inner">
                        <div className="text-xs text-yellow-500 font-bold uppercase mb-2 flex items-center gap-1 border-b border-yellow-900/20 pb-1">
                            <Shield size={12} /> Divine Protection
                        </div>
                        <p className="text-xs text-gray-300 mb-1">
                            With this blessing, your death penalty will be drastically reduced.
                        </p>
                        <ul className="text-xs text-gray-400 list-disc list-inside mb-2 space-y-0.5">
                            <li>Reduces <span className="text-white">XP</span> and <span className="text-white">Skills</span> loss by <span className="text-green-400 font-bold">95%</span>.</li>
                            <li>Reduces <span className="text-white">Gold</span> loss by <span className="text-green-400 font-bold">95%</span>.</li>
                        </ul>
                        <p className="text-[10px] text-gray-500 italic">
                            * The blessing is consumed automatically upon death.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6 bg-[#111] p-3 rounded border border-[#333] mx-2">
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase">Current Status</div>
                            <div className={`font-bold ${player.hasBlessing ? 'text-green-500' : 'text-red-500'}`}>
                                {player.hasBlessing ? 'BLESSED' : 'UNPROTECTED'}
                            </div>
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase">Cost (Level {player.level})</div>
                            <div className="font-bold text-yellow-500">
                                {getBlessingCost(player.level).toLocaleString()} gp
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={onBuyBlessing}
                        disabled={player.hasBlessing || player.gold < getBlessingCost(player.level)}
                        className={`
                            w-full py-3 font-bold text-sm rounded shadow-md border transition-all
                            ${player.hasBlessing 
                                ? 'bg-green-900/20 border-green-800 text-green-700 cursor-not-allowed' 
                                : player.gold >= getBlessingCost(player.level)
                                    ? 'bg-yellow-900/30 hover:bg-yellow-900/50 border-yellow-700 text-yellow-200 hover:shadow-yellow-900/20'
                                    : 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'
                            }
                        `}
                    >
                        {player.hasBlessing ? 'You are already blessed' : 'Receive the Blessing'}
                    </button>
                </div>
            )}

        </div>
    </div>
  );
};
