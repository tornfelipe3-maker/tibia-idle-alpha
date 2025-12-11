
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
      className="fixed z-[80] w-40 bg-black/95 border border-[#555] p-1.5 text-[10px] rounded shadow-xl pointer-events-none text-left flex flex-col gap-1"
      style={{ top: position.y + 10, left: position.x + 10 }}
    >
        <div className="font-bold text-gray-100 border-b border-[#333] pb-0.5 leading-tight">{item.name}</div>
        
        {/* Description - very small */}
        <div className="text-gray-500 italic text-[9px] leading-tight">{item.description}</div>
        
        {/* Stats Grid - Compact */}
        <div className="grid grid-cols-2 gap-x-1 text-gray-300 leading-tight">
            {item.attack ? <span>Atk: <span className="text-white">{item.attack}</span></span> : null}
            {item.defense ? <span>Def: <span className="text-white">{item.defense}</span></span> : null}
            {item.armor ? <span>Arm: <span className="text-white">{item.armor}</span></span> : null}
            
            {/* Full width stats */}
            {item.requiredLevel ? <span className="text-red-400 col-span-2">Level: {item.requiredLevel}</span> : null}
            
            {item.scalingStat ? <span className="text-blue-400 col-span-2 capitalize">Use: {item.scalingStat}</span> : null}
            
            {item.skillBonus && Object.entries(item.skillBonus).map(([k,v]) => (
                <span key={k} className="text-green-400 col-span-2">+{v} {k}</span>
            ))}
            
            {item.restoreAmount ? (
               <span className="text-blue-400 col-span-2">
                 Heal: {item.restoreAmount}
                 {item.restoreAmountSecondary ? `/${item.restoreAmountSecondary}` : ''}
               </span>
            ) : null}
        </div>

        {/* Price Footer */}
        <div className="text-[9px] text-gray-500 border-t border-[#333] pt-0.5 flex justify-between mt-auto">
            <span className="text-yellow-600 font-bold">{item.sellPrice} gp</span>
            <span>{item.price > 0 ? `${item.price} gp` : ''}</span>
        </div>
    </div>
  );
};
