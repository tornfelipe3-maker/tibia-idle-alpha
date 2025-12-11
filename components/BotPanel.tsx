
import React from 'react';
import { Player, PlayerSettings, Item, Spell } from '../types';
import { SHOP_ITEMS, SPELLS } from '../constants';
import { Bot, Heart, FlaskConical, Sparkles, Flame, Zap, Scroll, ChevronDown } from 'lucide-react';

interface BotPanelProps {
  player: Player;
  onUpdateSettings: (settings: PlayerSettings) => void;
}

// Reusable Selector Component
const BotSelector: React.FC<{
  label: string;
  enabled: boolean;
  value: number; // Threshold
  selectedId: string;
  items: (Item | Spell)[];
  onToggle: () => void;
  onThresholdChange: (val: number) => void;
  onSelectChange: (id: string) => void;
  color: string;
  icon: React.ReactNode;
  description: string;
  type: 'potion' | 'spell' | 'rune';
  playerInventory?: {[key:string]: number};
}> = ({ label, enabled, value, selectedId, items, onToggle, onThresholdChange, onSelectChange, color, icon, description, type, playerInventory }) => {
  
  // Find currently selected item object to display name if needed
  // const selectedItem = items.find(i => i.id === selectedId);

  return (
    <div className={`bg-[#2d2d2d] border transition-colors p-4 rounded-md mb-3 ${enabled ? `border-${color}-900/50 bg-${color}-900/10` : 'border-[#444]'}`}>
      <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-full bg-[#111] border border-[#333] text-${color}-500`}>
                  {icon}
              </div>
              <div>
                  <span className="text-sm font-bold text-gray-200 block">{label}</span>
                  <span className="text-[10px] text-gray-500">{description}</span>
              </div>
          </div>
          
          <button
              onClick={onToggle}
              className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors border border-transparent
                  ${enabled ? 'bg-green-600' : 'bg-gray-700'}
              `}
          >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition shadow-sm ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
      </div>

      {enabled && (
          <div className="space-y-3 bg-[#1a1a1a] p-3 rounded border border-[#333]">
              
              {/* Threshold Slider (Only for HP/Mana/Heal types, not Rune usually, though passed as 0 if not needed) */}
              {type !== 'rune' && type !== 'spell' && ( // Attk spells usually just spam, but heal spells need threshold
                 <div>
                    <div className="flex justify-between text-[10px] text-gray-500 font-bold mb-1 uppercase">
                       <span>Threshold</span>
                       <span>{value}%</span>
                    </div>
                    <input 
                       type="range" 
                       min="0" 
                       max="95" 
                       step="5"
                       className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                       value={value}
                       onChange={(e) => onThresholdChange(parseInt(e.target.value))}
                    />
                 </div>
              )}
              
              {/* Only Heal spells need threshold really, attack spells generally spam */}
              {type === 'spell' && label.includes("Heal") && (
                 <div>
                    <div className="flex justify-between text-[10px] text-gray-500 font-bold mb-1 uppercase">
                       <span>HP Threshold</span>
                       <span>{value}%</span>
                    </div>
                    <input 
                       type="range" 
                       min="0" 
                       max="95" 
                       step="5"
                       className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                       value={value}
                       onChange={(e) => onThresholdChange(parseInt(e.target.value))}
                    />
                 </div>
              )}


              {/* Dropdown / List Selection */}
              <div>
                 <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">Select {type === 'potion' ? 'Item' : 'Spell'}</label>
                 <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto custom-scrollbar">
                    {items.length === 0 && <div className="text-[10px] text-gray-600 italic p-2">No available options.</div>}
                    {items.map(item => {
                        const isSelected = selectedId === item.id;
                        let qtyDisplay = null;
                        
                        if (type === 'potion' || type === 'rune') {
                           const qty = playerInventory ? (playerInventory[item.id] || 0) : 0;
                           qtyDisplay = <span className={`text-[10px] font-mono font-bold ${qty > 0 ? 'text-green-500' : 'text-red-500'}`}>x{qty}</span>;
                        }

                        // For spells, maybe show mana cost
                        if (type === 'spell') {
                           qtyDisplay = <span className="text-[10px] text-blue-400 font-mono">{(item as Spell).manaCost} mp</span>;
                        }

                        return (
                            <button
                                key={item.id}
                                onClick={() => onSelectChange(item.id)}
                                className={`
                                    flex items-center justify-between p-2 rounded border transition-all text-left
                                    ${isSelected 
                                        ? `bg-${color}-900/30 border-${color}-500 text-${color}-200` 
                                        : 'bg-[#222] border-[#444] text-gray-400 hover:bg-[#333]'}
                                `}
                            >
                                <div className="flex items-center gap-2">
                                   {(item as Item).image && <img src={(item as Item).image} className="w-5 h-5 pixelated" />}
                                   <span className="text-xs font-bold">{item.name}</span>
                                </div>
                                {qtyDisplay}
                            </button>
                        );
                    })}
                 </div>
              </div>
          </div>
      )}
    </div>
  );
};

export const BotPanel: React.FC<BotPanelProps> = ({ player, onUpdateSettings }) => {
  
  const handleSettingChange = (key: keyof PlayerSettings, value: any) => {
    onUpdateSettings({
      ...player.settings,
      [key]: value
    });
  };

  // Filter lists
  const healthPotions = SHOP_ITEMS.filter(i => i.type === 'potion' && (i.potionType === 'health' || i.potionType === 'spirit'));
  const manaPotions = SHOP_ITEMS.filter(i => i.type === 'potion' && (i.potionType === 'mana' || i.potionType === 'spirit'));
  const runes = SHOP_ITEMS.filter(i => i.isRune);
  
  // Spell Lists (Only show purchased/learned spells)
  const healSpells = SPELLS.filter(s => s.type === 'heal' && player.purchasedSpells.includes(s.id));
  const attackSpells = SPELLS.filter(s => s.type === 'attack' && player.purchasedSpells.includes(s.id));

  return (
    <div className="bg-[#222] h-full flex flex-col text-[#ccc]">
        {/* Header */}
        <div className="p-4 bg-[#282828] border-b border-[#444] flex items-center gap-3 shadow-md shrink-0">
            <div className="p-2 bg-blue-900/20 border border-blue-800 rounded text-blue-400">
                <Bot size={24} />
            </div>
            <div>
                <h2 className="text-lg font-bold font-serif text-[#eee] leading-tight">Bot Manager</h2>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest">Automation Systems</div>
            </div>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-6">
            
            {/* HEALING SECTION */}
            <section>
                <div className="flex items-center gap-2 mb-3 pb-1 border-b border-[#333]">
                    <Heart size={16} className="text-red-500" />
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Healing & Restore</h3>
                </div>
                
                <BotSelector 
                    label="Auto Health Potion" 
                    icon={<Heart size={14}/>} 
                    enabled={player.settings.autoHealthPotionThreshold > 0} // Using >0 as generic enabled check for UI logic if needed, but here we treat value > 0 as enabled
                    value={player.settings.autoHealthPotionThreshold}
                    selectedId={player.settings.selectedHealthPotionId}
                    items={healthPotions}
                    color="red"
                    description="Automatically uses selected health potion."
                    type="potion"
                    playerInventory={player.inventory}
                    onToggle={() => handleSettingChange('autoHealthPotionThreshold', player.settings.autoHealthPotionThreshold > 0 ? 0 : 50)}
                    onThresholdChange={(val) => handleSettingChange('autoHealthPotionThreshold', val)}
                    onSelectChange={(id) => handleSettingChange('selectedHealthPotionId', id)}
                />

                <BotSelector 
                    label="Auto Mana Potion" 
                    icon={<FlaskConical size={14}/>} 
                    enabled={player.settings.autoManaPotionThreshold > 0}
                    value={player.settings.autoManaPotionThreshold}
                    selectedId={player.settings.selectedManaPotionId}
                    items={manaPotions}
                    color="blue"
                    description="Automatically uses selected mana potion."
                    type="potion"
                    playerInventory={player.inventory}
                    onToggle={() => handleSettingChange('autoManaPotionThreshold', player.settings.autoManaPotionThreshold > 0 ? 0 : 50)}
                    onThresholdChange={(val) => handleSettingChange('autoManaPotionThreshold', val)}
                    onSelectChange={(id) => handleSettingChange('selectedManaPotionId', id)}
                />

                <BotSelector 
                    label="Auto Heal Spell" 
                    icon={<Sparkles size={14}/>} 
                    enabled={player.settings.autoHealSpellThreshold > 0}
                    value={player.settings.autoHealSpellThreshold}
                    selectedId={player.settings.selectedHealSpellId}
                    items={healSpells}
                    color="yellow"
                    description="Casts selected healing spell."
                    type="spell"
                    onToggle={() => handleSettingChange('autoHealSpellThreshold', player.settings.autoHealSpellThreshold > 0 ? 0 : 70)}
                    onThresholdChange={(val) => handleSettingChange('autoHealSpellThreshold', val)}
                    onSelectChange={(id) => handleSettingChange('selectedHealSpellId', id)}
                />
            </section>

            {/* ATTACK SECTION */}
            <section>
                <div className="flex items-center gap-2 mb-3 pb-1 border-b border-[#333]">
                    <Flame size={16} className="text-orange-500" />
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Offensive Targeting</h3>
                </div>

                <BotSelector 
                    label="Auto Attack Spell" 
                    icon={<Zap size={14}/>} 
                    enabled={player.settings.autoAttackSpell}
                    value={0} // Not used for attack spells usually
                    selectedId={player.settings.selectedAttackSpellId}
                    items={attackSpells}
                    color="orange"
                    description="Casts attack spell when available."
                    type="spell"
                    onToggle={() => handleSettingChange('autoAttackSpell', !player.settings.autoAttackSpell)}
                    onThresholdChange={() => {}} // No threshold for attack spell usually
                    onSelectChange={(id) => handleSettingChange('selectedAttackSpellId', id)}
                />

                <BotSelector 
                    label="Auto Attack Rune" 
                    icon={<Scroll size={14}/>} 
                    enabled={player.settings.autoAttackRune}
                    value={0}
                    selectedId={player.settings.selectedRuneId}
                    items={runes}
                    color="purple"
                    description="Uses rune on target (2s Cooldown)."
                    type="rune"
                    playerInventory={player.inventory}
                    onToggle={() => handleSettingChange('autoAttackRune', !player.settings.autoAttackRune)}
                    onThresholdChange={() => {}}
                    onSelectChange={(id) => handleSettingChange('selectedRuneId', id)}
                />

            </section>
        </div>
    </div>
  );
};
