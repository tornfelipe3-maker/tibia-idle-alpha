
import React from 'react';
import { Player } from '../types';
import { SHOP_ITEMS } from '../constants';
import { Package, ArrowRight } from 'lucide-react';

interface DepotPanelProps {
  playerDepot: Player['depot'];
  onWithdrawItem: (itemId: string) => void;
}

export const DepotPanel: React.FC<DepotPanelProps> = ({ playerDepot, onWithdrawItem }) => {
  const hasItems = Object.keys(playerDepot).length > 0 && (Object.values(playerDepot) as number[]).some(q => q > 0);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg flex flex-col h-full">
      <div className="p-4 border-b border-gray-700 bg-gray-900 rounded-t-lg flex justify-between items-center">
        <div className="flex items-center space-x-2 text-yellow-600">
          <Package size={20} />
          <h2 className="text-lg font-bold font-serif">Depot Chest</h2>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {!hasItems ? (
           <div className="flex flex-col items-center justify-center h-full text-gray-500">
             <Package size={48} className="opacity-20 mb-2" />
             <p className="text-sm">Seu depot está vazio.</p>
             <p className="text-xs mt-1">Deposite itens através do seu inventário.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(playerDepot).map(([itemId, qty]) => {
              if ((qty as number) <= 0) return null;
              const item = SHOP_ITEMS.find(i => i.id === itemId);
              if (!item) return null;

              return (
                <div key={itemId} className="flex items-center justify-between p-3 bg-gray-700/50 rounded border border-gray-600">
                   <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center text-xs font-bold text-yellow-500 border border-gray-600">
                         {item.name.substring(0,2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-200">{item.name}</div>
                        <div className="text-xs text-gray-400">Quantidade: {qty}</div>
                      </div>
                   </div>
                   <button 
                     onClick={() => onWithdrawItem(itemId)}
                     className="px-3 py-1 bg-blue-900 hover:bg-blue-800 text-blue-200 text-xs rounded border border-blue-700 flex items-center space-x-1"
                   >
                     <span>Retirar</span>
                     <ArrowRight size={12} />
                   </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
