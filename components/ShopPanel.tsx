
import React, { useState } from 'react';
import { SHOP_ITEMS, QUESTS } from '../constants';
import { Item, Player, NpcType, EquipmentSlot, SkillType } from '../types';
import { Lock, PackageCheck, Coins, ShieldCheck, EyeOff, Search, LayoutGrid, Sword, Crosshair, Sparkles, Scroll, ArrowUp, Shield, Shirt, Footprints, Gem, FlaskConical, Package, HardHat, Columns, ChevronsUp, Layers, Heart, Sun } from 'lucide-react';
import { ItemTooltip } from './ItemTooltip';

interface ShopPanelProps {
  playerGold: number;
  playerLevel: number;
  playerEquipment: Player['equipment'];
  playerInventory: Player['inventory'];
  playerQuests: Player['quests'];
  skippedLoot: string[];
  playerHasBlessing?: boolean;
  onBuyItem: (item: Item, qty: number) => void;
  onSellItem: (item: Item, qty: number) => void;
  onToggleSkippedLoot: (itemId: string) => void;
  onBuyBlessing?: () => void;
}

type ShopCategory = 'all' | 'melee' | 'distance' | 'magic_weapon' | 'ammunition' | 'armor' | 'helmet' | 'legs' | 'boots' | 'shield' | 'jewelry' | 'potion' | 'loot' | 'rune';

const CATEGORIES: { id: ShopCategory, label: string, icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Items', icon: <LayoutGrid size={14} /> },
    { id: 'melee', label: 'Melee Weapons', icon: <Sword size={14} /> },
    { id: 'distance', label: 'Distance', icon: <Crosshair size={14} /> },
    { id: 'ammunition', label: 'Ammunition', icon: <ArrowUp size={14} /> },
    { id: 'magic_weapon', label: 'Wands & Rods', icon: <Sparkles size={14} /> },
    { id: 'rune', label: 'Runes', icon: <Scroll size={14} /> },
    { id: 'shield', label: 'Shields', icon: <Shield size={14} /> },
    { id: 'helmet', label: 'Helmets', icon: <HardHat size={14} /> },
    { id: 'armor', label: 'Armors', icon: <Shirt size={14} /> },
    { id: 'legs', label: 'Legs', icon: <Columns size={14} /> },
    { id: 'boots', label: 'Boots', icon: <Footprints size={14} /> },
    { id: 'jewelry', label: 'Accessories', icon: <Gem size={14} /> },
    { id: 'potion', label: 'Potions', icon: <FlaskConical size={14} /> },
    { id: 'loot', label: 'Creature Products', icon: <Package size={14} /> },
];

export const ShopPanel: React.FC<ShopPanelProps> = ({ playerGold, playerLevel, playerInventory, playerQuests, skippedLoot, playerHasBlessing, onBuyItem, onSellItem, onToggleSkippedLoot, onBuyBlessing }) => {
  const [activeNpc, setActiveNpc] = useState<NpcType>(NpcType.TRADER);
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');
  const [category, setCategory] = useState<ShopCategory>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isMaxMode, setIsMaxMode] = useState(false); // Toggle for MAX mode
  
  const [hoverItem, setHoverItem] = useState<Item | null>(null);
  const [hoverPos, setHoverPos] = useState<{x: number, y: number} | null>(null);

  const getNpcStatus = (npc: NpcType) => {
    if (npc === NpcType.TRADER || npc === NpcType.ABENCOADO) return { locked: false, message: '' };
    
    // Yasir Logic
    if (npc === NpcType.YASIR) {
        if (playerLevel < 50) {
            return { locked: true, message: 'Level 50 Required' };
        }
        return { locked: false, message: '' };
    }

    const quest = QUESTS.find(q => q.rewardNpcAccess === npc);
    if (!quest) return { locked: false, message: '' };

    const playerQuest = playerQuests[quest.id];
    const isCompleted = playerQuest && playerQuest.completed;
    
    return {
      locked: !isCompleted,
      message: isCompleted ? '' : `Quest: ${quest.name}`
    };
  };

  const getOwnedQuantity = (item: Item) => {
    return playerInventory[item.id] || 0;
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

  const handleQuantityChange = (val: number) => {
      setQuantity(Math.max(1, val));
      setIsMaxMode(false); // Disable max mode if manually changing
  };

  const toggleMaxMode = () => {
      setIsMaxMode(!isMaxMode);
  };

  const isSkipped = (itemId: string) => skippedLoot.includes(itemId);

  const currentNpcStatus = getNpcStatus(activeNpc);

  const checkCategory = (item: Item, cat: ShopCategory): boolean => {
      if (cat === 'all') return true;
      if (cat === 'potion') return item.type === 'potion';
      if (cat === 'loot') return item.type === 'loot';
      
      if (item.type === 'equipment' && item.slot) {
          if (cat === 'rune') return !!item.isRune;
          if (cat === 'ammunition') return item.slot === EquipmentSlot.AMMO;
          if (cat === 'shield') return item.slot === EquipmentSlot.HAND_LEFT;
          if (cat === 'armor') return item.slot === EquipmentSlot.BODY;
          if (cat === 'helmet') return item.slot === EquipmentSlot.HEAD;
          if (cat === 'legs') return item.slot === EquipmentSlot.LEGS;
          if (cat === 'boots') return item.slot === EquipmentSlot.FEET;
          if (cat === 'jewelry') return item.slot === EquipmentSlot.NECK || item.slot === EquipmentSlot.RING;

          // Weapon Categorization based on Scaling Stat
          if (cat === 'magic_weapon') {
             return item.scalingStat === SkillType.MAGIC;
          }
          if (cat === 'distance') {
             return item.scalingStat === SkillType.DISTANCE;
          }
          if (cat === 'melee') {
             return item.scalingStat === SkillType.SWORD || 
                    item.scalingStat === SkillType.AXE || 
                    item.scalingStat === SkillType.CLUB ||
                    item.scalingStat === SkillType.FIST;
          }
      }
      return false;
  };

  // Logic for Blessings
  const getBlessingCost = (level: number) => {
      if (level <= 30) return 2000;
      if (level >= 120) return 20000;
      return 2000 + (level - 30) * 200;
  };

  const displayedItems = SHOP_ITEMS.filter(item => {
    // 1. NPC Check
    const soldTo = item.soldTo.includes(activeNpc);
    
    // 2. Mode Check
    let modePass = false;
    if (mode === 'buy') {
        // Yasir sells nothing
        if (activeNpc === NpcType.YASIR) modePass = false; 
        else modePass = soldTo && item.price > 0 && item.type !== 'loot';
    } else {
        modePass = soldTo && getOwnedQuantity(item) > 0;
    }

    // 3. Category Check
    const catPass = checkCategory(item, category);

    // 4. Search Check
    const searchPass = item.name.toLowerCase().includes(searchTerm.toLowerCase());

    return modePass && catPass && searchPass;
  });

  return (
    <div className="flex flex-col h-full bg-[#222] text-[#ccc]">
      <ItemTooltip item={hoverItem} position={hoverPos} />

      {/* NPC Tabs */}
      <div className="flex overflow-x-auto bg-[#2d2d2d] border-b border-[#444] custom-scrollbar pb-1 shrink-0">
        {Object.values(NpcType).map(npc => {
           const status = getNpcStatus(npc);
           return (
             <button
              key={npc}
              onClick={() => { setActiveNpc(npc); if(npc === NpcType.YASIR) setMode('sell'); }}
              className={`flex-shrink-0 px-5 py-3 text-xs font-bold border-r border-[#444] transition-colors flex items-center space-x-1.5
                ${activeNpc === npc ? 'bg-[#444] text-yellow-500' : 'bg-[#2d2d2d] text-gray-500 hover:text-gray-300'}
              `}
             >
               <span>{npc}</span>
               {status.locked && <Lock size={12} className="ml-1 text-red-500" />}
             </button>
           );
        })}
      </div>

      {/* Header Actions & Gold */}
      <div className="p-3 bg-[#282828] border-b border-[#444] flex flex-col gap-2 shadow-md z-10 shrink-0">
         <div className="flex items-center justify-between">
            <div className="flex space-x-2">
                <button 
                onClick={() => setMode('buy')}
                disabled={activeNpc === NpcType.YASIR || activeNpc === NpcType.ABENCOADO}
                className={`tibia-btn px-4 py-1.5 text-xs font-bold ${mode === 'buy' && activeNpc !== NpcType.ABENCOADO ? 'text-yellow-200' : 'text-gray-400'}`}
                >
                Buy
                </button>
                <button 
                onClick={() => setMode('sell')}
                disabled={activeNpc === NpcType.ABENCOADO}
                className={`tibia-btn px-4 py-1.5 text-xs font-bold ${mode === 'sell' && activeNpc !== NpcType.ABENCOADO ? 'text-green-200' : 'text-gray-400'}`}
                >
                Sell
                </button>
            </div>
            <div className="text-yellow-500 font-bold text-sm flex items-center bg-[#111] px-3 py-1 border border-[#333] rounded">
                <Coins size={14} className="mr-1.5"/>
                {playerGold.toLocaleString()} gp
            </div>
         </div>
         
         {/* Quantity Selector with MAX and Slider (Hide for Abençoado) */}
         {activeNpc !== NpcType.ABENCOADO && (
            <div className="flex flex-col gap-1">
                <div className="flex items-center bg-[#111] border border-[#333] rounded p-1">
                    <span className="text-[10px] text-gray-500 font-bold px-2 uppercase">Amount:</span>
                    <button onClick={() => handleQuantityChange(1)} className={`px-2 py-0.5 text-xs rounded ${!isMaxMode && quantity===1 ? 'bg-blue-900 text-white' : 'text-gray-400 hover:bg-[#333]'}`}>1</button>
                    <button onClick={() => handleQuantityChange(10)} className={`px-2 py-0.5 text-xs rounded ${!isMaxMode && quantity===10 ? 'bg-blue-900 text-white' : 'text-gray-400 hover:bg-[#333]'}`}>10</button>
                    <button onClick={() => handleQuantityChange(100)} className={`px-2 py-0.5 text-xs rounded ${!isMaxMode && quantity===100 ? 'bg-blue-900 text-white' : 'text-gray-400 hover:bg-[#333]'}`}>100</button>
                    
                    <div className="h-4 w-[1px] bg-[#333] mx-1"></div>
                    
                    {/* MAX Button */}
                    <button 
                        onClick={toggleMaxMode} 
                        className={`
                            px-2 py-0.5 text-[10px] font-bold rounded flex items-center gap-1 transition-colors
                            ${isMaxMode ? 'bg-purple-900 text-purple-200 border border-purple-500' : 'text-gray-400 hover:bg-[#333]'}
                        `}
                        title="Detect max amount automatically"
                    >
                        <ChevronsUp size={10} /> MAX
                    </button>

                    <div className="h-4 w-[1px] bg-[#333] mx-1"></div>

                    <input 
                    type="text" 
                    value={isMaxMode ? 'ALL' : quantity} 
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className={`bg-transparent text-white text-xs w-16 text-center outline-none font-mono ${isMaxMode ? 'text-purple-400 font-bold' : ''}`}
                    readOnly={isMaxMode}
                    />
                </div>
                
                {/* Slider for quick selection */}
                <div className="flex items-center px-1 gap-2">
                    <span className="text-[9px] text-gray-600"><Layers size={10}/></span>
                    <input 
                        type="range" 
                        min="1" 
                        max="100" 
                        value={isMaxMode ? 100 : Math.min(100, quantity)} 
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                        className="w-full h-1 bg-[#333] rounded-lg appearance-none cursor-pointer accent-blue-600"
                        disabled={isMaxMode}
                    />
                </div>
            </div>
         )}
      </div>

      <div className="flex flex-1 min-h-0">
         
         {/* MAIN CONTENT */}
         <div className="flex-1 flex flex-col min-w-0">
            {/* SPECIAL UI FOR ABENÇOADO */}
            {activeNpc === NpcType.ABENCOADO ? (
                <div className="flex-1 p-6 bg-[#222] flex flex-col items-center justify-start text-center">
                    <div className="mb-6 p-4 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-lg max-w-md w-full">
                        <div className="flex justify-center mb-4">
                            <div className="p-4 bg-yellow-900/20 rounded-full border border-yellow-700/50">
                                <Sun size={48} className="text-yellow-500 animate-[pulse_3s_infinite]" />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-yellow-500 mb-2 font-serif">The Spiritual Blessing</h2>
                        
                        <p className="text-sm text-gray-400 mb-6 italic leading-relaxed px-4">
                            "Saudações, viajante. O mundo é perigoso e a morte é uma companheira constante.
                            Por uma doação, posso pedir aos deuses que protejam sua alma e seus bens."
                        </p>

                        <div className="bg-black/40 p-3 rounded border border-yellow-900/30 mb-6 text-left mx-2 shadow-inner">
                            <div className="text-xs text-yellow-500 font-bold uppercase mb-2 flex items-center gap-1 border-b border-yellow-900/20 pb-1">
                                <Shield size={12} /> Divine Protection
                            </div>
                            <p className="text-xs text-gray-300 mb-1">
                                Com esta bênção, sua penalidade de morte será drasticamente reduzida.
                            </p>
                            <ul className="text-xs text-gray-400 list-disc list-inside mb-2 space-y-0.5">
                                <li>Redução de perda de <span className="text-white">XP</span> e <span className="text-white">Skills</span> em <span className="text-green-400 font-bold">95%</span>.</li>
                                <li>Redução de perda de <span className="text-white">Gold</span> em <span className="text-green-400 font-bold">95%</span>.</li>
                            </ul>
                            <p className="text-[10px] text-gray-500 italic">
                                * A bênção é consumida automaticamente ao morrer.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6 bg-[#111] p-3 rounded border border-[#333] mx-2">
                            <div>
                                <div className="text-[10px] text-gray-500 uppercase">Current Status</div>
                                <div className={`font-bold ${playerHasBlessing ? 'text-green-500' : 'text-red-500'}`}>
                                    {playerHasBlessing ? 'BLESSED' : 'UNPROTECTED'}
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] text-gray-500 uppercase">Cost (Level {playerLevel})</div>
                                <div className="font-bold text-yellow-500">
                                    {getBlessingCost(playerLevel).toLocaleString()} gp
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={onBuyBlessing}
                            disabled={playerHasBlessing || playerGold < getBlessingCost(playerLevel)}
                            className={`
                                w-full py-3 font-bold text-sm rounded shadow-md border transition-all
                                ${playerHasBlessing 
                                    ? 'bg-green-900/20 border-green-800 text-green-700 cursor-not-allowed' 
                                    : playerGold >= getBlessingCost(playerLevel)
                                        ? 'bg-yellow-900/30 hover:bg-yellow-900/50 border-yellow-700 text-yellow-200 hover:shadow-yellow-900/20'
                                        : 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'
                                }
                            `}
                        >
                            {playerHasBlessing ? 'Você já está abençoado' : 'Receber a Bênção'}
                        </button>
                    </div>
                </div>
            ) : (
                /* STANDARD SHOP UI */
                <div className="flex flex-1 min-h-0">
                    {/* CATEGORY SIDEBAR */}
                    <div className="w-40 bg-[#262626] border-r border-[#444] overflow-y-auto custom-scrollbar flex flex-col p-2 gap-1 shrink-0">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setCategory(cat.id)}
                                className={`
                                    text-left px-3 py-2 text-xs font-bold rounded flex items-center gap-2 transition-colors
                                    ${category === cat.id ? 'bg-[#444] text-yellow-500 border border-[#555]' : 'text-gray-400 hover:bg-[#333] border border-transparent'}
                                `}
                            >
                                {cat.icon}
                                <span>{cat.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 flex flex-col min-w-0">
                        {/* Search Bar */}
                        <div className="bg-[#2d2d2d] border-b border-[#444] p-2 flex flex-col gap-2 shrink-0">
                            <div className="relative w-full">
                                <Search size={14} className="absolute left-2.5 top-1.5 text-gray-500" />
                                <input 
                                    type="text" 
                                    placeholder="Search item..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-[#111] border border-[#444] rounded pl-9 pr-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-[#666]"
                                />
                            </div>
                        </div>

                        {/* ITEM GRID */}
                        <div className="p-2 flex-1 overflow-y-auto relative tibia-inset custom-scrollbar bg-[#222]">
                            {currentNpcStatus.locked ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 opacity-50">
                                <Lock size={64} className="mb-4 text-red-500" />
                                <h3 className="text-xl font-bold text-red-400 mb-2">Access Denied</h3>
                                <p className="text-sm text-yellow-500 mt-2 font-mono uppercase border border-yellow-700 px-4 py-2 rounded bg-black/50">Requirement: {currentNpcStatus.message}</p>
                            </div>
                            ) : (
                            <div className="grid grid-cols-1 gap-1">
                                {displayedItems.length === 0 && (
                                <div className="text-center p-12 text-gray-500 text-sm italic">
                                    {mode === 'buy' ? 'No items found to buy.' : 'No items found to sell.'}
                                    {activeNpc === NpcType.YASIR && mode === 'buy' && <div className="mt-2 text-xs">Yasir only buys creature products. He sells nothing.</div>}
                                </div>
                                )}

                                {displayedItems.map((item) => {
                                const ownedQty = getOwnedQuantity(item);
                                
                                // --- LOGIC FOR QUANTITY CALCULATION ---
                                let currentQty = quantity;
                                
                                // If MAX Mode is active, calculate the dynamic max for this item
                                if (isMaxMode) {
                                    if (mode === 'buy') {
                                        currentQty = item.price > 0 ? Math.floor(playerGold / item.price) : 0;
                                        // Clamp to prevent overflow or crazy numbers, but in idle game 'all' usually means all affordable.
                                        if (currentQty === 0) currentQty = 0; 
                                    } else {
                                        currentQty = ownedQty;
                                    }
                                }

                                // Ensure we don't display 0 quantity buttons unless it's genuinely 0 available
                                const displayQty = Math.max(1, currentQty);

                                const totalPrice = item.price * currentQty;
                                const totalSellPrice = item.sellPrice * currentQty;
                                
                                const canAfford = mode === 'buy' && currentQty > 0 && playerGold >= totalPrice;
                                const canSell = mode === 'sell' && currentQty > 0 && ownedQty >= currentQty;
                                
                                return (
                                    <div 
                                    key={item.id} 
                                    onMouseEnter={(e) => handleHover(item, e)}
                                    onMouseLeave={(e) => handleHover(null, e)}
                                    onContextMenu={(e) => { e.preventDefault(); onToggleSkippedLoot(item.id); }}
                                    className="flex items-center justify-between p-2 bg-[#282828] border border-[#3a3a3a] hover:bg-[#333] relative group transition-colors rounded-sm"
                                    >
                                    <div className="flex items-center flex-1 min-w-0">
                                        <div className="w-10 h-10 bg-[#181818] border border-[#444] flex items-center justify-center mr-3 shrink-0 relative shadow-inner">
                                            {item.image ? <img src={item.image} className="max-w-full max-h-full p-0.5 pixelated" /> : <div className="text-[9px]">{item.name.substring(0,2)}</div>}
                                            
                                            {isSkipped(item.id) && (
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-80">
                                                    <EyeOff size={20} className="text-red-500" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                        <div className="flex items-center space-x-2">
                                            <span className={`font-bold text-sm truncate ${isSkipped(item.id) ? 'text-gray-500 line-through' : 'text-gray-200'}`}>{item.name}</span>
                                            {ownedQty > 0 && <span className="flex items-center text-[10px] text-gray-400 bg-[#1a1a1a] px-1.5 rounded ml-2 border border-[#333]"><PackageCheck size={10} className="mr-0.5"/>{ownedQty}</span>}
                                        </div>
                                        
                                        {mode === 'buy' && item.requiredVocation && (
                                            <div className="text-[10px] text-red-400 flex items-center mt-1 truncate">
                                                <ShieldCheck size={10} className="mr-1" />
                                                {item.requiredVocation.join(', ')}
                                            </div>
                                        )}
                                        </div>
                                    </div>

                                    {mode === 'buy' ? (
                                        <button
                                            onClick={() => onBuyItem(item, currentQty)}
                                            disabled={!canAfford}
                                            className={`
                                                ml-3 px-3 py-1.5 tibia-btn text-[11px] font-bold min-w-[80px] flex flex-col items-end leading-none transition-colors
                                                ${canAfford ? 'text-white' : 'text-gray-500 cursor-not-allowed'}
                                            `}
                                            >
                                                <span>{totalPrice.toLocaleString()} gp</span>
                                                {/* Show count if > 1 OR if in Max Mode */}
                                                {(currentQty > 1 || isMaxMode) && <span className={`text-[9px] ${isMaxMode ? 'text-purple-300 font-bold' : 'opacity-60'}`}>x{currentQty.toLocaleString()}</span>}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => onSellItem(item, currentQty)}
                                            disabled={!canSell}
                                            className={`
                                                ml-3 px-3 py-1.5 tibia-btn text-[11px] font-bold min-w-[80px] text-green-200 flex flex-col items-end leading-none transition-colors
                                                ${canSell ? '' : 'opacity-50 cursor-not-allowed'}
                                            `}
                                            >
                                                <span>{totalSellPrice.toLocaleString()} gp</span>
                                                {(currentQty > 1 || isMaxMode) && <span className={`text-[9px] ${isMaxMode ? 'text-purple-300 font-bold' : 'opacity-60'}`}>x{currentQty.toLocaleString()}</span>}
                                        </button>
                                    )}
                                    </div>
                                );
                                })}
                            </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
         </div>
      </div>
    </div>
  );
};
