
import React from 'react';
import { Player, HuntingTask } from '../types';
import { MONSTERS } from '../constants';
import { Skull, Coins, RefreshCw, CheckCircle, Shield } from 'lucide-react';

interface TaskPanelProps {
  player: Player;
  onSelectTask: (task: HuntingTask) => void;
  onCancelTask: () => void;
  onRerollTasks: () => void;
  onClaimReward: () => void;
}

export const TaskPanel: React.FC<TaskPanelProps> = ({ 
  player, 
  onSelectTask, 
  onCancelTask, 
  onRerollTasks, 
  onClaimReward 
}) => {
  const activeTask = player.activeTask;
  const rerollCost = player.level * 50;

  // Render Active Task View
  if (activeTask) {
    const monster = MONSTERS.find(m => m.id === activeTask.monsterId);
    const progress = Math.min(100, (activeTask.killsCurrent / activeTask.killsRequired) * 100);

    return (
      <div className="flex flex-col h-full bg-[#222] text-[#ccc] p-4 items-center">
        <h2 className="text-xl font-bold text-yellow-500 mb-4 font-serif flex items-center">
          <Skull className="mr-2" /> Current Task
        </h2>

        <div className="bg-[#2d2d2d] border border-[#555] rounded-lg p-6 w-full max-w-md shadow-lg flex flex-col items-center">
           <div className="w-16 h-16 bg-[#111] border border-[#333] mb-4 flex items-center justify-center">
               {monster?.image ? <img src={monster.image} className="max-w-full max-h-full" /> : <Skull />}
           </div>
           
           <h3 className="text-lg font-bold text-gray-200 mb-2">{monster?.name || 'Unknown Monster'}</h3>
           
           <div className="w-full bg-[#111] h-4 border border-[#333] rounded-full overflow-hidden relative mb-2">
              <div 
                className={`h-full transition-all duration-500 ${activeTask.isComplete ? 'bg-green-500' : 'bg-blue-500'}`}
                style={{ width: `${progress}%` }}
              ></div>
           </div>
           
           <div className="text-sm font-mono text-gray-400 mb-4">
              {activeTask.killsCurrent} / {activeTask.killsRequired} Kills
           </div>

           <div className="grid grid-cols-2 gap-4 w-full text-center mb-6 bg-[#222] p-2 rounded border border-[#333]">
              <div>
                  <div className="text-[10px] text-gray-500 uppercase">XP Reward</div>
                  <div className="text-blue-300 font-bold">{activeTask.rewardXp.toLocaleString()}</div>
              </div>
              <div>
                  <div className="text-[10px] text-gray-500 uppercase">Gold Reward</div>
                  <div className="text-yellow-500 font-bold">{activeTask.rewardGold.toLocaleString()}</div>
              </div>
           </div>

           {activeTask.isComplete ? (
              <button 
                onClick={onClaimReward}
                className="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-3 rounded border border-green-500 flex items-center justify-center animate-pulse"
              >
                 <CheckCircle className="mr-2" /> Claim Reward
              </button>
           ) : (
              <button 
                onClick={onCancelTask}
                className="text-xs text-red-400 hover:text-red-300 underline mt-2"
              >
                 Abandon Task
              </button>
           )}
        </div>
      </div>
    );
  }

  // Render Selection View
  return (
    <div className="flex flex-col h-full bg-[#222] text-[#ccc]">
       <div className="p-2 bg-[#282828] border-b border-[#444] flex justify-between items-center">
          <div className="font-bold text-xs text-yellow-500 flex items-center">
             <Shield size={14} className="mr-1" /> Hunting Tasks
          </div>
          <div className="text-[10px] text-gray-500">Pick a monster to hunt</div>
       </div>

       <div className="flex-1 p-2 overflow-y-auto">
          <div className="grid grid-cols-1 gap-2">
             {player.taskOptions.map((task, idx) => {
                const monster = MONSTERS.find(m => m.id === task.monsterId);
                return (
                   <div 
                      key={idx}
                      onClick={() => onSelectTask(task)}
                      className="bg-[#2d2d2d] border border-[#444] hover:bg-[#333] hover:border-yellow-600 cursor-pointer p-2 flex items-center space-x-3 transition-colors relative group"
                   >
                      <div className="w-12 h-12 bg-[#111] border border-[#333] shrink-0 flex items-center justify-center">
                          {monster?.image ? <img src={monster.image} className="max-w-full max-h-full" /> : <Skull />}
                      </div>
                      <div className="flex-1">
                          <div className="font-bold text-gray-200 text-sm">{monster?.name}</div>
                          <div className="text-xs text-gray-400">Kill {task.killsRequired}x</div>
                          <div className="flex space-x-3 mt-1 text-[10px]">
                              <span className="text-blue-300">Reward: {task.rewardXp.toLocaleString()} XP</span>
                              <span className="text-yellow-500">{task.rewardGold.toLocaleString()} GP</span>
                          </div>
                      </div>
                      <div className="absolute right-2 opacity-0 group-hover:opacity-100 text-yellow-500 text-xs font-bold">
                         ACCEPT &rarr;
                      </div>
                   </div>
                );
             })}
          </div>
       </div>

       {/* Footer Reroll */}
       <div className="p-2 border-t border-[#444] bg-[#1a1a1a] flex justify-center">
          <button 
             onClick={onRerollTasks}
             disabled={player.gold < rerollCost}
             className={`
                flex items-center space-x-2 px-4 py-2 rounded border
                ${player.gold >= rerollCost ? 'bg-blue-900 hover:bg-blue-800 border-blue-700 text-blue-100' : 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'}
             `}
          >
             <RefreshCw size={14} />
             <span className="text-xs font-bold">Reroll List ({rerollCost} gp)</span>
          </button>
       </div>
    </div>
  );
};
