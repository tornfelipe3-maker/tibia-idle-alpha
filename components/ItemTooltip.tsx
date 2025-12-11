
import React from 'react';
import { Item } from '../types';

interface ItemTooltipProps {
  item: Item | null;
  position: { x: number, y: number } | null;
}

export const ItemTooltip: React.FC<ItemTooltipProps> = ({ item, position }) => {
  if (!item || !position) return null;

  return (
    <div 
      className="fixed z-[100] w-56 bg-black/95 border border-[#555] p-2 text-xs rounded shadow-xl pointer-events-none text-left"
      style={{ top: position.y + 10, left: position.x + 10 }}
    >
        <div className="font-bold text-gray-200">{item.name}</div>
        <div className="text-gray-400 italic mb-1">{item.description}</div>
        
        <div className="grid grid-cols-2 gap-x-2 text-[10px] text-gray-400 border-t border-gray-700 pt-1">
            {item.attack && <span>Atk: {item.attack}</span>}
            {item.defense && <span>Def: {item.defense}</span>}
            {item.armor && <span>Arm: {item.armor}</span>}
            {item.requiredLevel && <span className="text-red-400 col-span-2">Level Req: {item.requiredLevel}</span>}
            
            {item.scalingStat && <span className="text-blue-400 col-span-2">Uses: {item.scalingStat}</span>}
            {item.skillBonus && Object.entries(item.skillBonus).map(([k,v]) => (
            <span key={k} className="text-green-400 col-span-2">+{v} {k}</span>
            ))}
            
            {item.restoreAmount && (
               <span className="text-blue-400 col-span-2">
                 Restores: {item.restoreAmount} {item.potionType === 'mana' ? 'MP' : 'HP'}
                 {item.restoreAmountSecondary && ` & ${item.restoreAmountSecondary} MP`}
               </span>
            )}
        </div>
        <div className="text-[9px] text-gray-600 mt-1 border-t border-gray-800 pt-0.5">
            Value: {item.price > 0 ? `${item.price}gp` : '-'} / {item.sellPrice}gp
        </div>
    </div>
  );
};
