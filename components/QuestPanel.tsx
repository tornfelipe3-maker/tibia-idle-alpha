import React from 'react';
import { QUESTS } from '../constants';
import { Player } from '../types';
import { Scroll, CheckCircle, Lock } from 'lucide-react';

interface QuestPanelProps {
  playerQuests: Player['quests'];
}

export const QuestPanel: React.FC<QuestPanelProps> = ({ playerQuests }) => {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg flex flex-col h-full">
      <div className="p-4 border-b border-gray-700 bg-gray-900 rounded-t-lg flex justify-between items-center">
        <div className="flex items-center space-x-2 text-yellow-600">
          <Scroll size={20} />
          <h2 className="text-lg font-bold font-serif">Quest Log</h2>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 gap-4">
          {QUESTS.map((quest) => {
            const playerProgress = playerQuests[quest.id] || { kills: 0, completed: false };
            const progressPercent = Math.min(100, (playerProgress.kills / quest.requiredKills) * 100);

            return (
              <div key={quest.id} className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-200">{quest.name}</h3>
                  {playerProgress.completed ? (
                    <span className="text-green-500 flex items-center text-xs font-bold bg-green-900/30 px-2 py-1 rounded border border-green-800">
                      <CheckCircle size={12} className="mr-1" /> Complete
                    </span>
                  ) : (
                    <span className="text-gray-500 flex items-center text-xs font-bold bg-gray-800 px-2 py-1 rounded border border-gray-700">
                      <Lock size={12} className="mr-1" /> Em Progresso
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-gray-400 mb-3 italic">{quest.description}</p>
                
                <div className="space-y-1">
                   <div className="flex justify-between text-xs font-mono text-gray-300">
                      <span>Kills: {playerProgress.kills} / {quest.requiredKills}</span>
                      <span>{Math.floor(progressPercent)}%</span>
                   </div>
                   <div className="w-full bg-gray-800 rounded-full h-2 border border-gray-600 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${playerProgress.completed ? 'bg-green-500' : 'bg-blue-500'}`} 
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                   </div>
                </div>
                
                <div className="mt-3 text-[10px] text-gray-500 border-t border-gray-600/50 pt-2">
                   Reward: Acesso ao NPC <span className="text-yellow-500">{quest.rewardNpcAccess}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};