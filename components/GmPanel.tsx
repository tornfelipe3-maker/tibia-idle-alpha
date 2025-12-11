
import React from 'react';
import { Player } from '../types';
import { Zap, ArrowUpCircle, Coins, ShieldAlert } from 'lucide-react';

interface GmPanelProps {
  player: Player;
  onLevelUp: () => void;
  onSkillUp: () => void;
  onAddGold: () => void;
}

export const GmPanel: React.FC<GmPanelProps> = ({ player, onLevelUp, onSkillUp, onAddGold }) => {
  if (!player.isGm) return null;

  return (
    <div className="fixed top-14 right-4 z-[100] w-48 bg-[#1a0505] border-2 border-red-900 shadow-2xl rounded-lg p-2 opacity-90 hover:opacity-100 transition-opacity">
      <div className="text-red-500 font-bold text-xs uppercase text-center mb-2 flex items-center justify-center gap-1 border-b border-red-900 pb-1">
        <ShieldAlert size={12}/> Game Master Mode
      </div>
      
      <div className="flex flex-col gap-2">
        <button 
          onClick={onLevelUp}
          className="bg-red-900/50 hover:bg-red-800 text-red-200 text-[10px] font-bold py-2 px-3 rounded border border-red-800 flex items-center gap-2"
        >
          <ArrowUpCircle size={14} className="text-yellow-400"/> Force Level Up
        </button>

        <button 
          onClick={onSkillUp}
          className="bg-red-900/50 hover:bg-red-800 text-red-200 text-[10px] font-bold py-2 px-3 rounded border border-red-800 flex items-center gap-2"
        >
          <Zap size={14} className="text-blue-400"/> +5 All Skills
        </button>

        <button 
          onClick={onAddGold}
          className="bg-red-900/50 hover:bg-red-800 text-red-200 text-[10px] font-bold py-2 px-3 rounded border border-red-800 flex items-center gap-2"
        >
          <Coins size={14} className="text-yellow-500"/> +1,000,000 Gold
        </button>
      </div>
      
      <div className="mt-2 text-[9px] text-red-600 text-center font-mono">
        UID: {player.name}
      </div>
    </div>
  );
};
