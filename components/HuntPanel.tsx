
import React, { useState } from 'react';
import { Monster, Boss, Player, Vocation, HitSplat } from '../types';
import { MONSTERS, BOSSES, VOCATION_SPRITES, SHOP_ITEMS } from '../constants';
import { estimateHuntStats } from '../services';
import { Skull, Star, Users, AlertTriangle, Search, X, Info, Zap, Octagon, Coins, Heart, Swords, Shield, Footprints, Flame, Snowflake, Droplets, Mountain } from 'lucide-react';

interface HuntPanelProps {
  player: Player;
  activeHunt: string | null;
  bossCooldowns: { [bossId: string]: number };
  onStartHunt: (monsterId: string, isBoss: boolean, count: number) => void;
  onStopHunt: () => void;
  currentMonsterHp?: number;
  hits: HitSplat[];
}

export const HuntPanel: React.FC<HuntPanelProps> = ({ 
  player,
  activeHunt, 
  bossCooldowns,
  onStartHunt, 
  onStopHunt, 
  currentMonsterHp,
  hits
}) => {
  const [tab, setTab] = useState<'monsters' | 'bosses'>('monsters');
  const [areaHuntModal, setAreaHuntModal] = useState<{monster: Monster, isOpen: boolean} | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ id: string, name: string, isBoss: boolean } | null>(null);
  const [infoModal, setInfoModal] = useState<Monster | null>(null);
  const [areaHuntCount, setAreaHuntCount] = useState(2);
  const [searchTerm, setSearchTerm] = useState('');

  const activeMonster = MONSTERS.find(m => m.id === activeHunt) || BOSSES.find(b => b.id === activeHunt);
  
  const [playerSprite, setPlayerSprite] = useState<string>(VOCATION_SPRITES[player.vocation]);

  React.useEffect(() => {
    setPlayerSprite(VOCATION_SPRITES[player.vocation]);
  }, [player.vocation]);

  const handleSpriteError = () => {
    setPlayerSprite(VOCATION_SPRITES[Vocation.NONE]);
  };

  const getHitColor = (type: HitSplat['type']) => {
      switch(type) {
          case 'damage': return 'text-[#b90000]';
          case 'heal': return 'text-[#00c000]'; 
          case 'speech': return 'text-yellow-400 text-[10px] font-normal';
          default: return 'text-gray-400';
      }
  };

  const renderHits = (target: 'player' | 'monster') => {
      return hits.filter(h => h.target === target).map(hit => {
         const randomX = (hit.id % 20) - 10;
         const randomY = (hit.id % 10) - 5;
         
         if (hit.type === 'miss') {
             return (
                 <div 
                    key={hit.id} 
                    className="hit-miss"
                    style={{ top: `calc(40% + ${randomY}px)`, left: `calc(50% + ${randomX}px)` }}
                 ></div>
             );
         }
         
         // Speech bubble specific styling
         if (hit.type === 'speech') {
             return (
                 <div 
                    key={hit.id}
                    className="absolute z-50 text-center whitespace-nowrap animate-[float-up_1.5s_linear_forwards] pointer-events-none font-bold text-yellow-400 text-xs drop-shadow-[1px_1px_0_#000]"
                    style={{ top: `calc(-10% + ${randomY}px)`, left: `50%`, transform: 'translateX(-50%)' }}
                 >
                    {hit.value}
                 </div>
             );
         }

         return (
             <div 
                key={hit.id}
                className={`damage-float ${getHitColor(hit.type)}`}
                style={{ top: `calc(20% + ${randomY}px)`, left: `calc(50% + ${randomX}px)` }}
             >
                {hit.value}
             </div>
         );
      });
  };

  const openAreaHuntModal = (monster: Monster, e: React.MouseEvent) => {
      e.stopPropagation();
      setAreaHuntModal({ monster, isOpen: true });
      setAreaHuntCount(2);
  };

  const openInfoModal = (monster: Monster, e: React.MouseEvent) => {
    e.stopPropagation();
    setInfoModal(monster);
  };

  const handleRowClick = (id: string, name: string, isBoss: boolean) => {
      if (activeHunt !== id) {
          setConfirmModal({ id, name, isBoss });
      }
  };

  const confirmHunt = () => {
      if (confirmModal) {
          onStartHunt(confirmModal.id, confirmModal.isBoss, 1);
          setConfirmModal(null);
      }
  };

  const startAreaHunt = () => {
      if (areaHuntModal) {
          onStartHunt(areaHuntModal.monster.id, false, areaHuntCount);
          setAreaHuntModal(null);
      }
  };

  // Filter Logic: Sort by XP Ascending
  const filteredMonsters = MONSTERS.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.exp - b.exp);
  
  const filteredBosses = BOSSES.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#222]">
      
      {/* Confirmation Modal */}
      {confirmModal && (
          <div className="fixed inset-0 z-[110] bg-black/80 flex items-center justify-center p-4">
              <div className="tibia-panel w-full max-w-[250px] shadow-2xl p-4 text-center">
                  <div className="mb-4 text-gray-200 text-sm">
                      Start hunting <br/>
                      <span className="font-bold text-yellow-500 text-lg">{confirmModal.name}</span>?
                  </div>
                  <div className="flex gap-2 justify-center">
                      <button 
                        onClick={confirmHunt}
                        className="tibia-btn px-4 py-1.5 font-bold text-green-300 border-green-900"
                      >
                          Yes
                      </button>
                      <button 
                        onClick={() => setConfirmModal(null)}
                        className="tibia-btn px-4 py-1.5 font-bold text-red-300 border-red-900"
                      >
                          No
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* NEW IMPROVED Monster Info Modal (Bestiary Style) */}
      {infoModal && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="tibia-panel w-full max-w-md shadow-2xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-[#2d2d2d] border-b border-[#111] px-4 py-3 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2">
                        <Info size={16} className="text-blue-400"/>
                        <span className="font-bold text-[#eee] text-sm tracking-wide">Bestiary: {infoModal.name}</span>
                    </div>
                    <button onClick={() => setInfoModal(null)} className="text-[#aaa] hover:text-white font-bold p-1">
                        <X size={18} />
                    </button>
                </div>
                
                <div className="p-4 overflow-y-auto bg-[#222] custom-scrollbar flex-1">
                    
                    {/* Top Section: Sprite & Vital Stats */}
                    <div className="flex gap-4 mb-4">
                        <div className="w-24 h-24 bg-[#181818] border-2 border-[#333] flex items-center justify-center shadow-inner rounded relative overflow-hidden shrink-0">
                             <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_70%)]"></div>
                             {infoModal.image ? <img src={infoModal.image} className="max-w-[80px] max-h-[80px] pixelated z-10 scale-[1.8]" /> : <Skull size={32} className="text-gray-500"/>}
                             {infoModal.level > player.level + 20 && (
                                 <div className="absolute bottom-1 right-1 bg-red-900/80 text-red-200 text-[9px] px-1 rounded font-bold border border-red-700">DANGER</div>
                             )}
                        </div>

                        <div className="flex-1 grid grid-cols-2 gap-2">
                            <div className="bg-[#1a1a1a] p-2 rounded border border-[#333] flex flex-col justify-center">
                                <div className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-1"><Heart size={10} className="text-red-500"/> Health</div>
                                <div className="text-lg font-bold text-gray-200">{infoModal.maxHp.toLocaleString()}</div>
                            </div>
                            <div className="bg-[#1a1a1a] p-2 rounded border border-[#333] flex flex-col justify-center">
                                <div className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-1"><Star size={10} className="text-yellow-500"/> Exp</div>
                                <div className="text-lg font-bold text-gray-200">{infoModal.exp.toLocaleString()}</div>
                            </div>
                            <div className="bg-[#1a1a1a] p-2 rounded border border-[#333] flex flex-col justify-center">
                                <div className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-1"><Swords size={10} className="text-gray-400"/> Attack</div>
                                <div className="text-sm font-bold text-gray-300">{infoModal.damageMin} - {infoModal.damageMax}</div>
                            </div>
                            <div className="bg-[#1a1a1a] p-2 rounded border border-[#333] flex flex-col justify-center">
                                <div className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-1"><Coins size={10} className="text-yellow-600"/> Gold</div>
                                <div className="text-sm font-bold text-yellow-500">{infoModal.minGold} - {infoModal.maxGold}</div>
                            </div>
                        </div>
                    </div>

                    {/* Elemental Resistances Grid */}
                    {infoModal.elements && (
                       <div className="mb-4">
                          <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-2 border-b border-[#333] pb-1">Elemental Sensitivity</h4>
                          <div className="grid grid-cols-4 gap-2">
                             {[
                                 { key: 'physical', icon: <Shield size={12}/>, color: 'text-gray-400' },
                                 { key: 'fire', icon: <Flame size={12}/>, color: 'text-orange-500' },
                                 { key: 'ice', icon: <Snowflake size={12}/>, color: 'text-cyan-400' },
                                 { key: 'energy', icon: <Zap size={12}/>, color: 'text-purple-400' },
                                 { key: 'earth', icon: <Mountain size={12}/>, color: 'text-green-500' },
                                 { key: 'death', icon: <Skull size={12}/>, color: 'text-gray-200' },
                             ].map((el) => {
                                 const mult = infoModal.elements?.[el.key as any] ?? 1;
                                 let valColor = 'text-gray-500';
                                 let label = 'Neutral';
                                 
                                 if (mult > 1) { valColor = 'text-green-500'; label = `Weak (+${Math.round((mult-1)*100)}%)`; }
                                 if (mult < 1) { valColor = 'text-red-500'; label = `Resist (-${Math.round((1-mult)*100)}%)`; }
                                 if (mult === 0) { valColor = 'text-gray-600'; label = 'Immune'; }

                                 return (
                                     <div key={el.key} className="bg-[#1a1a1a] border border-[#333] p-1.5 rounded flex flex-col items-center justify-center text-center" title={`${el.key}: x${mult}`}>
                                        <div className={`${el.color} mb-1`}>{el.icon}</div>
                                        <div className={`text-[9px] font-bold ${valColor}`}>{mult === 0 ? '0%' : `${mult}x`}</div>
                                     </div>
                                 );
                             })}
                          </div>
                       </div>
                    )}

                    {/* Visual Loot Table (Grid) */}
                    <div>
                        <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-2 border-b border-[#333] pb-1 flex justify-between">
                            <span>Loot Table</span>
                            <span className="text-[9px] normal-case opacity-50">Hover for details</span>
                        </h4>
                        
                        <div className="flex flex-wrap gap-1.5">
                            {infoModal.lootTable?.sort((a,b) => b.chance - a.chance).map((loot, idx) => {
                                const item = SHOP_ITEMS.find(i => i.id === loot.itemId);
                                let rarityColor = 'border-[#333] bg-[#222]';
                                if (loot.chance < 0.01) rarityColor = 'border-purple-900/50 bg-purple-900/10';
                                else if (loot.chance < 0.05) rarityColor = 'border-blue-900/50 bg-blue-900/10';
                                else if (loot.chance < 0.2) rarityColor = 'border-green-900/50 bg-green-900/10';

                                return (
                                    <div key={idx} className={`w-12 h-12 relative border rounded flex items-center justify-center group ${rarityColor}`}>
                                        {item?.image ? (
                                            <img src={item.image} className="max-w-[32px] max-h-[32px] pixelated" />
                                        ) : (
                                            <div className="text-[9px] text-gray-500">{loot.itemId.substring(0,2)}</div>
                                        )}
                                        
                                        {/* Drop Chance Badge */}
                                        <div className="absolute bottom-0 right-0 bg-black/80 text-[8px] text-gray-300 px-1 rounded-tl leading-none">
                                            {loot.chance < 0.01 ? '<1%' : `${Math.round(loot.chance*100)}%`}
                                        </div>

                                        {/* Hover Tooltip */}
                                        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 w-32 bg-black border border-gray-600 text-[10px] p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none z-50 text-center">
                                            <div className="font-bold text-white mb-0.5">{item?.name || loot.itemId}</div>
                                            <div className="text-yellow-500 font-mono">{(loot.chance * 100).toFixed(2)}%</div>
                                            {item?.sellPrice && <div className="text-gray-400 text-[9px] mt-1">{item.sellPrice} gp</div>}
                                        </div>
                                    </div>
                                );
                            })}
                            {(!infoModal.lootTable || infoModal.lootTable.length === 0) && (
                                <div className="text-xs text-gray-600 italic p-2">No known loot.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Area Hunt Modal - "CAÇAR LURANDO" */}
      {areaHuntModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="tibia-panel w-full max-w-[300px] shadow-2xl p-0 overflow-hidden">
                <div className="bg-red-900/20 border-b border-red-900/50 px-3 py-3 flex justify-between items-center mb-0">
                    <span className="font-bold text-red-200 text-sm flex items-center gap-2">
                        <Footprints size={16} /> CAÇAR LURANDO
                    </span>
                    <button onClick={() => setAreaHuntModal(null)} className="text-red-400 hover:text-white font-bold text-sm px-2">X</button>
                </div>
                
                <div className="p-4 space-y-5 bg-[#222]">
                    <div className="text-center">
                        <h3 className="text-gray-200 font-bold text-lg mb-1">{areaHuntModal.monster.name}</h3>
                        <p className="text-[11px] text-gray-500">Quantos monstros você quer lurar ao mesmo tempo?</p>
                    </div>

                    <div className="flex items-center justify-between bg-[#1a1a1a] p-4 border border-[#333] rounded shadow-inner">
                        <button 
                          className="tibia-btn w-10 h-10 font-bold text-xl hover:bg-[#333]"
                          onClick={() => setAreaHuntCount(Math.max(2, areaHuntCount - 1))}
                        >-</button>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-yellow-500 drop-shadow-md">{areaHuntCount}</div>
                            <div className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mt-1">Creatures</div>
                        </div>
                        <button 
                          className="tibia-btn w-10 h-10 font-bold text-xl hover:bg-[#333]"
                          onClick={() => setAreaHuntCount(Math.min(8, areaHuntCount + 1))}
                        >+</button>
                    </div>

                    <div className="text-[11px] text-red-300 bg-red-950/30 border border-red-900/30 p-3 rounded leading-relaxed">
                        <div className="flex items-center gap-1.5 mb-2 font-bold text-red-200 border-b border-red-900/30 pb-1">
                            <AlertTriangle size={14}/> ATENÇÃO
                        </div>
                        Lurar criaturas aumenta drasticamente o dano recebido. 
                        <span className="block mt-2 text-yellow-500/90 font-bold">
                           Recomendado usar Magias de Área ou Runas (GFB/Avalanche).
                        </span>
                    </div>
                    
                    <button 
                        onClick={startAreaHunt}
                        className="tibia-btn w-full py-3 font-bold text-sm text-red-100 bg-red-900 hover:bg-red-800 border-red-950 shadow-lg flex items-center justify-center gap-2"
                    >
                        <Swords size={16} /> COMEÇAR LURE
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Game Window - Visual Battle Area (TALLER) */}
      <div className="h-80 game-window-bg relative border-b-2 border-[#000] shadow-md shrink-0 flex items-center justify-center overflow-hidden group">
         
         {/* Active Combat Scene */}
         {activeMonster ? (
            <div className="relative w-full max-w-[500px] h-full flex items-center justify-center space-x-32">
               
               {/* Player Character Container */}
               <div className="flex flex-col items-center animate-[pulse_2s_infinite] relative">
                  <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
                       {renderHits('player')}
                  </div>

                  <div className="relative z-10 w-20 h-20 flex items-center justify-center drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
                     <img 
                        src={playerSprite} 
                        className="max-w-full max-h-full scale-[2] pixelated" 
                        alt="Player" 
                        onError={handleSpriteError}
                     />
                  </div>
                  <div className="mt-6 w-16 h-2 bg-black border border-black/50 shadow">
                     <div 
                        className="h-full bg-green-500 transition-all duration-300"
                        style={{ width: `${(player.hp / player.maxHp) * 100}%` }}
                     ></div>
                  </div>
                  <span className="text-[11px] font-bold text-white drop-shadow-md mt-1 bg-black/40 px-2 py-0.5 rounded">{player.name || 'Hero'}</span>
               </div>

               {/* VS / Attack FX */}
               <div className="z-0 animate-[ping_1.5s_infinite] opacity-30 absolute">
                  <div className="w-2 h-2 bg-white rounded-full blur-sm"></div>
               </div>

               {/* Monster Character Container */}
               <div className="flex flex-col items-center animate-[bounce_1.5s_infinite] relative">
                  <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
                       {renderHits('monster')}
                  </div>

                  <div className="mb-6 text-center">
                     <span className="text-xs font-bold text-[#0f0] drop-shadow-[1px_1px_0_#000] bg-black/60 px-2 py-0.5 rounded block">
                        {activeMonster.name} 
                        {player.activeHuntCount > 1 && <span className="text-red-500 ml-1">x{player.activeHuntCount}</span>}
                     </span>
                  </div>
                  
                  <div className="relative z-10 w-24 h-24 flex items-center justify-center drop-shadow-[6px_6px_0_rgba(0,0,0,0.5)] filter contrast-125">
                     {activeMonster.image ? (
                        <div className="relative">
                            <img src={activeMonster.image} className="max-w-full max-h-full object-contain scale-[2.5] pixelated" alt="monster" />
                            {player.activeHuntCount > 1 && (
                                <div className="absolute -right-6 -bottom-2 z-[-1]">
                                    <img src={activeMonster.image} className="w-24 h-24 opacity-60 scale-150 pixelated" alt="mob" />
                                </div>
                            )}
                            {player.activeHuntCount > 3 && (
                                <div className="absolute -left-6 -bottom-2 z-[-2]">
                                    <img src={activeMonster.image} className="w-24 h-24 opacity-60 scale-150 pixelated" alt="mob" />
                                </div>
                            )}
                        </div>
                     ) : <Skull size={48} className="text-red-500" />}
                  </div>

                  <div className="mt-6 w-20 h-2 bg-black border border-black/50 shadow">
                     <div 
                        className="h-full transition-all duration-200"
                        style={{ 
                           width: `${Math.max(0, ((currentMonsterHp || 0) / (activeMonster.maxHp * player.activeHuntCount)) * 100)}%`,
                           backgroundColor: (currentMonsterHp || 0) < (activeMonster.maxHp * player.activeHuntCount) * 0.2 ? '#d00' : 
                                            (currentMonsterHp || 0) < (activeMonster.maxHp * player.activeHuntCount) * 0.5 ? '#dd0' : '#0c0'
                        }}
                     ></div>
                  </div>
               </div>

               {/* FIXED Stop Button */}
               <div className="absolute bottom-2 right-2 z-30">
                  <button onClick={onStopHunt} className="tibia-btn px-4 py-2 text-xs text-red-200 border-red-900 bg-red-900/80 shadow-lg font-bold hover:scale-105 transition-transform flex items-center gap-2">
                     <Octagon size={16} /> STOP HUNT
                  </button>
               </div>
            </div>
         ) : (
            <div className="text-[#888] text-sm font-bold drop-shadow-md text-center opacity-80 z-10 bg-black/60 p-6 rounded-lg border border-[#444] backdrop-blur-sm">
               <p className="text-gray-300 mb-2 text-lg">Idle State</p>
               <p className="text-xs font-normal opacity-70">Select a creature from the list below</p>
            </div>
         )}
         
         {/* HUD Info Overlay */}
         {activeMonster && (
             <div className="absolute top-3 left-3 z-20 text-[10px] text-white drop-shadow-[1px_1px_0_#000] font-mono opacity-80 pointer-events-none bg-black/30 p-1.5 rounded border border-black/20">
                <div>HP: {currentMonsterHp?.toLocaleString()} / {(activeMonster.maxHp * player.activeHuntCount).toLocaleString()}</div>
                <div>XP: {(activeMonster.exp * player.activeHuntCount).toLocaleString()}</div>
             </div>
         )}
      </div>

      {/* Battle List Controls */}
      <div className="flex bg-[#2d2d2d] border-b border-[#111]">
         <button 
           onClick={() => setTab('monsters')}
           className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider border-r border-[#444] ${tab === 'monsters' ? 'text-[#eee] bg-[#444]' : 'text-[#888] hover:bg-[#333]'}`}
         >
           Battle List
         </button>
         <button 
           onClick={() => setTab('bosses')}
           className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider ${tab === 'bosses' ? 'text-[#eee] bg-[#444]' : 'text-[#888] hover:bg-[#333]'}`}
         >
           Bosses
         </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-[#2d2d2d] border-b border-[#111] p-2 flex justify-center shadow-inner">
          <div className="relative w-full max-w-[400px] flex items-center">
              <div className="absolute left-2.5 text-gray-500"><Search size={14}/></div>
              <input 
                type="text"
                placeholder="Find creature..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#111] border border-[#444] rounded pl-9 pr-8 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-[#666] shadow-inner"
              />
              {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 text-gray-500 hover:text-white"
                  >
                      <X size={14}/>
                  </button>
              )}
          </div>
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-y-auto tibia-inset bg-[#222]">
        <div className="grid grid-cols-1 gap-1 p-1">
          {tab === 'monsters' && filteredMonsters.map((monster) => {
            const isActive = activeHunt === monster.id;
            const stats = estimateHuntStats(player, monster);

            return (
              <div
                key={monster.id}
                onClick={() => handleRowClick(monster.id, monster.name, false)}
                className={`
                  flex items-center p-2 cursor-pointer transition-colors border-b border-black/30 group/row rounded-sm
                  ${isActive ? 'bg-[#333] border-l-4 border-l-green-500' : 'hover:bg-[#2a2a2a] bg-[#252525]'}
                `}
              >
                {/* Mini Sprite Box */}
                <div className="w-12 h-12 bg-[#181818] border border-[#444] flex items-center justify-center shrink-0 mr-4 shadow-inner rounded-sm relative overflow-hidden">
                   <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_70%)]"></div>
                   {monster.image ? <img src={monster.image} className="max-w-[40px] max-h-[40px] pixelated z-10" /> : <div className="w-2 h-2 bg-red-500"></div>}
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm font-bold ${isActive ? 'text-green-400' : 'text-[#ddd]'}`}>{monster.name}</span>
                        {monster.level > player.level + 20 && <span className="text-[9px] text-red-500 font-bold bg-red-900/20 px-1.5 py-0.5 rounded border border-red-900/30">DANGER</span>}
                    </div>
                    {/* UPDATED: Only XP/h, Removed Gold/h */}
                    <div className="flex justify-between text-[10px] text-[#888]">
                       <span className="bg-black/30 px-2 py-0.5 rounded border border-white/5 text-xs text-blue-300">
                           <span className="font-bold">{stats.xpPerHour.toLocaleString()}</span> XP/h
                       </span>
                    </div>
                </div>

                {/* VISIBLE Info Button */}
                <button 
                  onClick={(e) => openInfoModal(monster, e)}
                  className="ml-2 h-[30px] px-3 flex items-center gap-1.5 tibia-btn bg-[#0d1b2a] border border-blue-900/40 hover:border-blue-500 hover:bg-[#162a40] group/info shadow-lg transition-all active:translate-y-[1px]"
                  title="Bestiary Info"
                >
                    <Info size={14} className="text-blue-500/80 group-hover/info:text-blue-300" />
                    <span className="text-[10px] font-bold text-blue-500/80 group-hover/info:text-blue-300 tracking-wide">INFO</span>
                </button>

                {/* NEW EXPLICIT HUNT BUTTON */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(monster.id, monster.name, false);
                    }}
                    className="ml-1 h-[30px] px-3 flex items-center gap-1.5 tibia-btn bg-[#2a0d0d] border border-red-900/60 hover:border-red-500 hover:bg-[#401010] group/hunt shadow-lg transition-all active:translate-y-[1px]"
                    title="Start Hunting (Single)"
                >
                    <Swords size={14} className="text-red-500/80 group-hover/hunt:text-red-300" />
                    <span className="text-[10px] font-bold text-red-500/80 group-hover/hunt:text-red-300 tracking-wide hidden sm:inline">CAÇAR</span>
                </button>

                {/* UPDATED Area Hunt Button: "LURAR" */}
                <button 
                    onClick={(e) => openAreaHuntModal(monster, e)}
                    className="ml-1 px-3 py-1.5 tibia-btn bg-[#2a1111] border-[#500] hover:bg-[#3a1a1a] flex items-center gap-1.5 shadow-[0_0_5px_rgba(200,0,0,0.1)] group/btn opacity-80 hover:opacity-100"
                    title="Caçar lurando (Aumenta XP e Dano)"
                >
                    <Footprints size={14} className="text-red-500 group-hover/btn:text-red-300" />
                    <span className="text-[10px] font-bold text-red-500 group-hover/btn:text-red-300 hidden sm:inline">LURAR</span>
                </button>
              </div>
            );
          })}

          {tab === 'bosses' && filteredBosses.map((boss) => {
            const isActive = activeHunt === boss.id;
            const cooldownUntil = bossCooldowns[boss.id] || 0;
            const now = Date.now();
            const onCooldown = cooldownUntil > now;
            
            const remainingSeconds = onCooldown ? Math.ceil((cooldownUntil - now) / 1000) : 0;
            const hours = Math.floor(remainingSeconds / 3600);
            const minutes = Math.floor((remainingSeconds % 3600) / 60);

            return (
              <div
                key={boss.id}
                className={`
                  flex items-center w-full text-left p-2.5 border-b border-black/30 rounded-sm mb-1 group
                  ${isActive ? 'bg-[#333] border-l-4 border-l-purple-500' : onCooldown ? 'opacity-50 bg-[#1a1a1a]' : 'hover:bg-[#2a2a2a] bg-[#252525]'}
                `}
              >
                 <button 
                    disabled={onCooldown}
                    onClick={() => !onCooldown && handleRowClick(boss.id, boss.name, true)}
                    className="flex-1 flex items-center text-left"
                 >
                    <div className="w-12 h-12 bg-[#181818] border border-[#444] flex items-center justify-center shrink-0 mr-4 shadow-inner rounded-sm relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(100,50,255,0.1)_0%,transparent_70%)]"></div>
                        {boss.image ? <img src={boss.image} className="max-w-[42px] max-h-[42px] pixelated z-10" /> : <Star size={20} className="text-purple-500" />}
                    </div>
                    <div className="flex-1">
                        <div className="text-sm font-bold text-purple-300">{boss.name}</div>
                        {onCooldown ? (
                            <div className="text-[10px] text-orange-500 font-mono mt-1 flex items-center gap-1">
                                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                                Respawn: {hours}h {minutes}m
                            </div>
                        ) : (
                            <div className="text-[10px] text-green-500 font-bold mt-1 flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                AVAILABLE NOW
                            </div>
                        )}
                    </div>
                 </button>

                 {/* VISIBLE Boss Info Button */}
                 <button 
                  onClick={(e) => openInfoModal(boss, e)}
                  className="ml-2 h-[30px] px-3 flex items-center gap-1.5 tibia-btn bg-[#1a0d2a] border border-purple-900/40 hover:border-purple-500 hover:bg-[#2a1640] group/info shadow-lg transition-all active:translate-y-[1px]"
                  title="Boss Info"
                >
                    <Info size={14} className="text-purple-500/80 group-hover/info:text-purple-300" />
                    <span className="text-[10px] font-bold text-purple-500/80 group-hover/info:text-purple-300 tracking-wide">INFO</span>
                </button>
              </div>
            );
          })}

          {filteredMonsters.length === 0 && tab === 'monsters' && (
              <div className="p-8 text-center text-gray-500 text-sm">No monsters found matching your search.</div>
          )}
          {filteredBosses.length === 0 && tab === 'bosses' && (
              <div className="p-8 text-center text-gray-500 text-sm">No bosses found matching your search.</div>
          )}
        </div>
      </div>
    </div>
  );
};
