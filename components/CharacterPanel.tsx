
import React, { useState } from 'react';
import { Player, EquipmentSlot, Item, SkillType, PlayerSettings, Vocation } from '../types';
import { SHOP_ITEMS, MAX_STAMINA, EMPTY_SLOT_IMAGES } from '../constants';
import { Shield, Backpack, User, EyeOff, Trash2, Sun } from 'lucide-react';
import { ItemTooltip } from './ItemTooltip';

interface CharacterPanelProps {
  player: Player;
  onUpdateSettings: (settings: PlayerSettings) => void;
  onEquipItem: (itemId: string) => void;
  onDepositItem: (itemId: string) => void;
  onDiscardItem: (itemId: string) => void;
  onToggleSkippedLoot: (itemId: string) => void;
  onUnequipItem?: (slot: EquipmentSlot) => void; // New prop
}

// Slot visual component
const EquipmentSlotView: React.FC<{ item?: Item; slot: EquipmentSlot; onClick?: () => void; onHover: (item: Item | null, e: React.MouseEvent) => void }> = ({ item, slot, onClick, onHover }) => (
  <div 
    onClick={onClick}
    onMouseEnter={(e) => item && onHover(item, e)}
    onMouseLeave={() => onHover(null, null as any)}
    className="relative w-[50px] h-[50px] bg-[#222] border-t-2 border-l-2 border-[#555] border-r-2 border-b-2 border-[#111] shadow-inner cursor-pointer flex items-center justify-center group overflow-hidden"
  >
    {/* Slot Background Placeholder (Empty) */}
    {!item && EMPTY_SLOT_IMAGES[slot] && (
       <div 
         className="absolute inset-0 bg-center bg-no-repeat opacity-40 pointer-events-none"
         style={{ backgroundImage: `url(${EMPTY_SLOT_IMAGES[slot]})`, backgroundSize: '36px' }}
       >
       </div>
    )}

    {item ? (
      <>
        <img src={item.image} alt={item.name} className="max-w-[42px] max-h-[42px] object-contain drop-shadow-md z-10 pixelated relative" />
        {/* Stack Count Indicator */}
        {item.count && item.count > 1 && (
            <span className="absolute bottom-0 right-0 text-[10px] text-white bg-black/70 px-1 rounded-tl-sm leading-none font-bold z-20">
                {item.count}
            </span>
        )}
      </>
    ) : null}
    
    {/* Hover highlight */}
    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 pointer-events-none z-20"></div>
  </div>
);

// Tibia-like Skill Bar (Name/Level on top, thin bar below)
const SkillBar: React.FC<{ label: string; level: number; progress: number; bonus?: number }> = ({ label, level, progress, bonus }) => (
  <div className="mb-2 select-none group" title={`${label}: ${Math.floor(progress)}% to next level`}>
    <div className="flex justify-between items-baseline px-0.5 mb-0.5">
      <span className="text-[11px] text-[#c0c0c0] font-bold shadow-black drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)]">{label}</span>
      <div className="text-[11px] font-bold text-[#eee] shadow-black drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)]">
        {level}
        {bonus ? <span className="text-[#00ff00] text-[10px] ml-1">+{bonus}</span> : ''}
      </div>
    </div>
    {/* Tibia "Inset" Bar Style */}
    <div className="h-[5px] w-full bg-[#080808] border-t border-l border-[#000] border-b border-r border-[#333] relative">
       <div 
         className="h-full bg-[#00C000] opacity-90 transition-all duration-300" 
         style={{ width: `${Math.min(100, progress)}%` }}
       ></div>
    </div>
  </div>
);

export const CharacterPanel: React.FC<CharacterPanelProps> = ({ player, onUpdateSettings, onEquipItem, onDepositItem, onDiscardItem, onToggleSkippedLoot, onUnequipItem }) => {
  const [activeTab, setActiveTab] = useState<'equipment' | 'inventory'>('equipment');
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{x: number, y: number} | null>(null);
  
  const [hoverItem, setHoverItem] = useState<Item | null>(null);
  const [hoverPos, setHoverPos] = useState<{x: number, y: number} | null>(null);

  const getXpPercentage = () => Math.min(100, (player.currentXp / player.maxXp) * 100);
  const getHpPercentage = () => Math.min(100, (player.hp / player.maxHp) * 100);
  const getManaPercentage = () => Math.min(100, (player.mana / player.maxMana) * 100);

  // Stamina Calculation
  const staminaHours = Math.floor(player.stamina / 3600);
  const staminaMinutes = Math.floor((player.stamina % 3600) / 60);
  const staminaPercent = (player.stamina / MAX_STAMINA) * 100;

  const getSkillBonus = (skill: SkillType) => {
    let bonus = 0;
    (Object.values(player.equipment) as (Item | undefined)[]).forEach(item => {
      if (item?.skillBonus?.[skill]) bonus += item.skillBonus[skill]!;
    });
    return bonus > 0 ? bonus : undefined;
  };

  const handleInventoryClick = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    if (selectedInventoryItem === itemId) {
        setSelectedInventoryItem(null);
        setMenuPosition(null);
    } else {
        const rect = e.currentTarget.getBoundingClientRect();
        setSelectedInventoryItem(itemId);
        setMenuPosition({ x: rect.right, y: rect.top });
    }
  };

  const handleHover = (item: Item | null, e: React.MouseEvent) => {
      if (item) {
          setHoverItem(item);
          setHoverPos({ x: e.clientX, y: e.clientY });
      } else {
          setHoverItem(null);
          setHoverPos(null);
      }
  };

  const handleSlotClick = (slot: EquipmentSlot) => {
      if (onUnequipItem) onUnequipItem(slot);
  };

  const isSkipped = (itemId: string) => player.skippedLoot.includes(itemId);

  const getVocationName = () => {
      if (!player.promoted) return player.vocation;
      switch(player.vocation) {
          case Vocation.KNIGHT: return 'Elite Knight';
          case Vocation.PALADIN: return 'Royal Paladin';
          case Vocation.SORCERER: return 'Master Sorcerer';
          case Vocation.DRUID: return 'Elder Druid';
          case Vocation.MONK: return 'Master Monk';
          default: return player.vocation;
      }
  };
  
  return (
    <div className="flex flex-col h-full select-none" onClick={() => { setSelectedInventoryItem(null); setMenuPosition(null); }}>
      <ItemTooltip item={hoverItem} position={hoverPos} />

      {/* Floating Menu */}
      {selectedInventoryItem && menuPosition && (
          <div 
             className="fixed z-[90] w-36 bg-[#2d2d2d] border border-[#888] flex flex-col shadow-2xl rounded-sm overflow-hidden"
             style={{ top: menuPosition.y, left: menuPosition.x }}
             onClick={(e) => e.stopPropagation()}
          >
             {SHOP_ITEMS.find(i => i.id === selectedInventoryItem)?.type === 'equipment' && (
                <button 
                   className="px-3 py-2 text-xs hover:bg-[#444] text-white text-left border-b border-[#444]"
                   onClick={(e) => { e.stopPropagation(); onEquipItem(selectedInventoryItem); setSelectedInventoryItem(null); setMenuPosition(null); }}
                >
                   Equip
                </button>
             )}
             <button 
                className="px-3 py-2 text-xs hover:bg-[#444] text-white text-left border-b border-[#444]"
                onClick={(e) => { e.stopPropagation(); onDepositItem(selectedInventoryItem); setSelectedInventoryItem(null); setMenuPosition(null); }}
             >
                Deposit
             </button>
             <button 
                className="px-3 py-2 text-xs hover:bg-[#444] text-white text-left border-b border-[#444] flex items-center justify-between"
                onClick={(e) => { e.stopPropagation(); onToggleSkippedLoot(selectedInventoryItem); setSelectedInventoryItem(null); setMenuPosition(null); }}
             >
                <span>{isSkipped(selectedInventoryItem) ? "Loot This" : "Ignore Loot"}</span>
                <EyeOff size={12} />
             </button>
             <button 
                className="px-3 py-2 text-xs hover:bg-[#522] text-red-300 text-left flex items-center justify-between"
                onClick={(e) => { e.stopPropagation(); onDiscardItem(selectedInventoryItem); setSelectedInventoryItem(null); setMenuPosition(null); }}
             >
                <span>Drop</span>
                <Trash2 size={12} />
             </button>
          </div>
      )}

      {/* --- GLOBAL STATS SECTION (Always Visible) --- */}
      <div className="tibia-panel p-2.5 mb-2 shrink-0">
         <div className="text-sm font-bold text-[#eee] mb-3 flex justify-between items-center bg-[#444] px-2 py-1 border border-[#111] shadow-sm">
            <div className="flex items-center gap-1.5 truncate">
                <span className="truncate">{player.name || 'Hero'}</span>
                {player.hasBlessing && (
                    <div title="Blessed">
                        <Sun size={12} className="text-yellow-400 animate-pulse" />
                    </div>
                )}
            </div>
            <span className="text-xs text-[#aaa]">{getVocationName()}</span>
         </div>

         <div className="space-y-3 px-1 mb-2">
            <div className="relative">
                <div className="text-[10px] flex justify-between text-[#ccc] mb-0.5 px-0.5 font-bold"><span>Hit Points</span><span>{Math.floor(player.hp)}</span></div>
                <div className="h-4 w-full bg-[#111] border border-[#333] relative rounded-sm shadow-inner">
                   <div className="bg-gradient-to-r from-[#a00] to-[#d00] h-full absolute left-0 transition-all duration-300" style={{width: `${getHpPercentage()}%`}}></div>
                   <div className="absolute inset-0 text-[10px] flex items-center justify-center text-white drop-shadow-md font-bold leading-none">{Math.floor(player.hp)} / {player.maxHp}</div>
                </div>
            </div>
            
            <div className="relative">
                <div className="text-[10px] flex justify-between text-[#ccc] mb-0.5 px-0.5 font-bold"><span>Mana</span><span>{Math.floor(player.mana)}</span></div>
                <div className="h-4 w-full bg-[#111] border border-[#333] relative rounded-sm shadow-inner">
                   <div className="bg-gradient-to-r from-[#22a] to-[#44d] h-full absolute left-0 transition-all duration-300" style={{width: `${getManaPercentage()}%`}}></div>
                   <div className="absolute inset-0 text-[10px] flex items-center justify-center text-white drop-shadow-md font-bold leading-none">{Math.floor(player.mana)} / {player.maxMana}</div>
                </div>
            </div>
         </div>

         <div className="flex justify-between items-center text-xs px-2 pt-2 border-t border-[#444]">
            <div className="text-[#ccc]">Cap: <span className="text-[#fff]">∞</span></div>
            <div className="text-yellow-500 font-bold bg-black/20 px-2 py-0.5 rounded">{player.gold.toLocaleString()} gp</div>
         </div>

         <div className="px-1 mt-3 cursor-help" title="Bônus de Stamina (3h): Garante +50% de XP. Sem stamina você continua caçando com XP normal.">
            <div className="h-2 bg-[#111] border border-[#333] w-full rounded-sm"><div className="bg-orange-500 h-full transition-all duration-500" style={{width: `${staminaPercent}%`}}></div></div>
            <div className="text-[9px] text-center text-[#777] mt-0.5">Stamina {staminaHours}:{staminaMinutes.toString().padStart(2,'0')}</div>
         </div>
      </div>

      {/* --- TAB NAVIGATION --- */}
      <div className="flex gap-1 mb-1 shrink-0">
          <button 
            onClick={() => setActiveTab('equipment')}
            className={`flex-1 flex items-center justify-center py-2 border-t-2 border-l-2 border-r-2 border-[#111] rounded-t-sm transition-all ${activeTab === 'equipment' ? 'bg-[#444] text-[#eee] font-bold z-10' : 'bg-[#2d2d2d] text-[#777] hover:bg-[#333] border-b border-b-[#111]'}`}
          >
             <User size={14} className="mr-1"/> <span className="text-xs uppercase">Equipment</span>
          </button>
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 flex items-center justify-center py-2 border-t-2 border-l-2 border-r-2 border-[#111] rounded-t-sm transition-all ${activeTab === 'inventory' ? 'bg-[#444] text-[#eee] font-bold z-10' : 'bg-[#2d2d2d] text-[#777] hover:bg-[#333] border-b border-b-[#111]'}`}
          >
             <Backpack size={14} className="mr-1"/> <span className="text-xs uppercase">Inventory</span>
          </button>
      </div>

      {/* --- TAB CONTENT AREA --- */}
      <div className="flex-1 bg-[#222] border-2 border-[#444] tibia-inset overflow-y-auto custom-scrollbar p-1.5">
          
          {/* TAB: EQUIPMENT & SKILLS */}
          {activeTab === 'equipment' && (
              <div className="flex flex-col gap-2 h-full">
                  {/* Equipment */}
                  <div className="tibia-panel p-3">
                        <div className="flex justify-center">
                            <div className="grid grid-cols-3 gap-2 relative bg-[#2d2d2d] p-2 border-t border-l border-[#555] border-r border-b border-[#000] shadow-lg">
                                <div className="col-start-1 row-start-1"><EquipmentSlotView onHover={handleHover} onClick={() => handleSlotClick(EquipmentSlot.NECK)} item={player.equipment[EquipmentSlot.NECK]} slot={EquipmentSlot.NECK} /></div>
                                <div className="col-start-2 row-start-1"><EquipmentSlotView onHover={handleHover} onClick={() => handleSlotClick(EquipmentSlot.HEAD)} item={player.equipment[EquipmentSlot.HEAD]} slot={EquipmentSlot.HEAD} /></div>
                                <div className="col-start-3 row-start-1"><EquipmentSlotView onHover={handleHover} onClick={() => handleSlotClick(EquipmentSlot.AMMO)} item={player.equipment[EquipmentSlot.AMMO]} slot={EquipmentSlot.AMMO} /></div>
                                
                                <div className="col-start-1 row-start-2"><EquipmentSlotView onHover={handleHover} onClick={() => handleSlotClick(EquipmentSlot.HAND_LEFT)} item={player.equipment[EquipmentSlot.HAND_LEFT]} slot={EquipmentSlot.HAND_LEFT} /></div>
                                <div className="col-start-2 row-start-2"><EquipmentSlotView onHover={handleHover} onClick={() => handleSlotClick(EquipmentSlot.BODY)} item={player.equipment[EquipmentSlot.BODY]} slot={EquipmentSlot.BODY} /></div>
                                <div className="col-start-3 row-start-2"><EquipmentSlotView onHover={handleHover} onClick={() => handleSlotClick(EquipmentSlot.HAND_RIGHT)} item={player.equipment[EquipmentSlot.HAND_RIGHT]} slot={EquipmentSlot.HAND_RIGHT} /></div>
                                
                                <div className="col-start-1 row-start-3"><EquipmentSlotView onHover={handleHover} onClick={() => handleSlotClick(EquipmentSlot.RING)} item={player.equipment[EquipmentSlot.RING]} slot={EquipmentSlot.RING} /></div>
                                <div className="col-start-2 row-start-3"><EquipmentSlotView onHover={handleHover} onClick={() => handleSlotClick(EquipmentSlot.LEGS)} item={player.equipment[EquipmentSlot.LEGS]} slot={EquipmentSlot.LEGS} /></div>
                                <div className="col-start-3 row-start-3 bg-[#111] opacity-20 rounded-sm"></div>

                                <div className="col-start-2 row-start-4"><EquipmentSlotView onHover={handleHover} onClick={() => handleSlotClick(EquipmentSlot.FEET)} item={player.equipment[EquipmentSlot.FEET]} slot={EquipmentSlot.FEET} /></div>
                            </div>
                        </div>
                  </div>

                  {/* Skills */}
                  <div className="tibia-panel p-3 flex-1">
                        <div className="flex items-center gap-2 text-[#eee] font-bold text-xs mb-3 pb-1 border-b border-[#444]">
                             <Shield size={12} /> <span>Skills</span>
                        </div>
                        <div className="px-1 space-y-3">
                            <SkillBar label="Level" level={player.level} progress={getXpPercentage()} />
                            <SkillBar label="Magic Level" level={player.skills[SkillType.MAGIC].level} progress={player.skills[SkillType.MAGIC].progress} bonus={getSkillBonus(SkillType.MAGIC)} />
                            <SkillBar label="Fist Fighting" level={player.skills[SkillType.FIST].level} progress={player.skills[SkillType.FIST].progress} bonus={getSkillBonus(SkillType.FIST)} />
                            <SkillBar label="Club Fighting" level={player.skills[SkillType.CLUB].level} progress={player.skills[SkillType.CLUB].progress} bonus={getSkillBonus(SkillType.CLUB)} />
                            <SkillBar label="Sword Fighting" level={player.skills[SkillType.SWORD].level} progress={player.skills[SkillType.SWORD].progress} bonus={getSkillBonus(SkillType.SWORD)} />
                            <SkillBar label="Axe Fighting" level={player.skills[SkillType.AXE].level} progress={player.skills[SkillType.AXE].progress} bonus={getSkillBonus(SkillType.AXE)} />
                            <SkillBar label="Distance" level={player.skills[SkillType.DISTANCE].level} progress={player.skills[SkillType.DISTANCE].progress} bonus={getSkillBonus(SkillType.DISTANCE)} />
                            <SkillBar label="Shielding" level={player.skills[SkillType.DEFENSE].level} progress={player.skills[SkillType.DEFENSE].progress} bonus={getSkillBonus(SkillType.DEFENSE)} />
                        </div>
                  </div>
              </div>
          )}

          {/* TAB: INVENTORY */}
          {activeTab === 'inventory' && (
              <div className="flex flex-col gap-2 h-full">
                  {/* Inventory Grid */}
                  <div className="tibia-panel p-3 flex-1 flex flex-col min-h-[180px]">
                     <div className="flex items-center gap-2 text-[#eee] font-bold text-xs mb-2 pb-1 border-b border-[#444]">
                         <Backpack size={12} /> <span>Backpack</span>
                     </div>
                     <div className="flex-1 bg-[#222] tibia-inset p-2 overflow-y-auto min-h-0 custom-scrollbar">
                        <div className="grid grid-cols-5 gap-1.5">
                            {Object.entries(player.inventory).map(([itemId, qty]) => {
                                if ((qty as number) <= 0) return null;
                                const itemDef = SHOP_ITEMS.find(i => i.id === itemId);
                                if (!itemDef) return null;
                                
                                return (
                                    <div 
                                    key={itemId}
                                    onClick={(e) => handleInventoryClick(e, itemId)}
                                    onMouseEnter={(e) => handleHover(itemDef, e)}
                                    onMouseLeave={(e) => handleHover(null, e)}
                                    className={`
                                        aspect-square bg-[#2d2d2d] relative cursor-pointer hover:bg-[#383838] transition-colors
                                        border-t border-l border-[#3a3a3a] border-r border-b border-[#111]
                                        flex items-center justify-center shadow-sm
                                        ${selectedInventoryItem === itemId ? 'ring-1 ring-white' : ''}
                                    `}
                                    >
                                    {itemDef.image ? (
                                        <img src={itemDef.image} alt={itemDef.name} className="max-w-[36px] max-h-[36px] p-0.5 pixelated" />
                                    ) : (
                                        <span className="text-[10px] text-gray-500">{itemDef.name.substring(0,2)}</span>
                                    )}
                                    <span className="absolute bottom-0 right-0 text-[10px] text-white bg-black/70 px-1 rounded-tl-sm leading-none font-bold">{qty}</span>
                                    
                                    {isSkipped(itemId) && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
                                            <div className="w-full h-[2px] bg-red-500 rotate-45 absolute"></div>
                                            <div className="w-full h-[2px] bg-red-500 -rotate-45 absolute"></div>
                                        </div>
                                    )}
                                    </div>
                                );
                            })}
                            {/* Fill empty slots */}
                            {Array.from({ length: Math.max(0, 20 - Object.keys(player.inventory).length) }).map((_, i) => (
                                <div key={`empty-${i}`} className="aspect-square bg-[#1a1a1a] border-t border-l border-[#000] border-r border-b border-[#333] opacity-50"></div>
                            ))}
                        </div>
                     </div>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};
