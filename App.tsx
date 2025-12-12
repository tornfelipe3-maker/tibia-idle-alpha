
import React, { useState, useEffect, useCallback } from 'react';
import { Vocation } from './types';
import { StorageService, HighscoresData } from './services';
import { CharacterPanel } from './components/CharacterPanel';
import { HuntPanel } from './components/HuntPanel';
import { GameWindow } from './components/GameWindow';
import { LogPanel } from './components/LogPanel';
import { ShopPanel } from './components/ShopPanel';
import { TrainingPanel } from './components/TrainingPanel';
import { DepotPanel } from './components/DepotPanel';
import { BankPanel } from './components/BankPanel';
import { QuestPanel } from './components/QuestPanel';
import { TaskPanel } from './components/TaskPanel';
import { SpellPanel } from './components/SpellPanel';
import { BotPanel } from './components/BotPanel';
import { AuthScreen } from './components/AuthScreen';
import { HighscoresModal } from './components/HighscoresModal';
import { GmPanel } from './components/GmPanel';
import { CastlePanel } from './components/CastlePanel';
import { PreyPanel } from './components/PreyPanel';
import { AscensionPanel } from './components/AscensionPanel';
import { Crown, Save, LogOut, Swords, Skull, Shield, ShoppingBag, Sparkles, Landmark, Package, Map, Bot, Download, Trophy, Castle, Target, Ghost } from 'lucide-react';

// Custom Hooks
import { useAuth } from './hooks/useAuth';
import { useGameEngine } from './hooks/useGameEngine';

export default function App() {
  // --- Hooks ---
  const { isAuthenticated, currentAccount, authError, isAuthLoading, loadedPlayer, login, register, importSave, logout } = useAuth();
  
  // Game Engine manages Player, Loop, and Actions
  const { 
      player, 
      activeHuntId, 
      activeTrainingSkill, 
      monsterHp, 
      logs, 
      hits, 
      isSaving, 
      offlineReport, 
      actions 
  } = useGameEngine(loadedPlayer, currentAccount, isAuthenticated);

  // --- UI State ---
  const [showHighscores, setShowHighscores] = useState(false);
  const [highscoresData, setHighscoresData] = useState<HighscoresData | null>(null);
  const [activeTab, setActiveTab] = useState<'hunt' | 'tasks' | 'quests' | 'train' | 'shop' | 'spells' | 'bank' | 'depot' | 'bot' | 'castle' | 'prey' | 'ascension'>('hunt');
  const [showVocationModal, setShowVocationModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [tempName, setTempName] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportString, setExportString] = useState('');

  // --- UI Effects ---
  const updateHighscores = useCallback(() => {
      const data = StorageService.getHighscores();
      setHighscoresData(data);
  }, []);

  useEffect(() => {
      if (isAuthenticated) {
          updateHighscores();
          const interval = setInterval(updateHighscores, 5 * 60 * 1000);
          return () => clearInterval(interval);
      }
  }, [isAuthenticated, updateHighscores]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (player.level >= 8 && player.vocation === Vocation.NONE) setShowVocationModal(true);
    if (player.level >= 2 && !player.name && !showNameModal) setShowNameModal(true);
  }, [player.level, player.vocation, player.name, isAuthenticated, showNameModal]);

  const handleLogout = () => {
    actions.saveGame(); 
    logout();
  };

  const handleExport = () => {
      if (currentAccount) {
          const str = StorageService.exportSaveString(currentAccount);
          if (str) {
              setExportString(str);
              setShowExportModal(true);
          }
      }
  };

  // --- Helper Components ---
  const NavButton = ({ id, label, icon: Icon, active }: { id: typeof activeTab, label: string, icon: any, active: boolean }) => (
     <button 
        onClick={() => setActiveTab(id)}
        className={`
          flex flex-col items-center justify-center p-3 w-full transition-all duration-200
          ${active ? 'bg-[#333] text-yellow-500 border-l-4 border-l-yellow-500 shadow-inner' : 'text-gray-500 hover:text-gray-300 hover:bg-[#222]'}
        `}
     >
        <Icon size={20} className="mb-1" />
        <span className="text-[10px] font-bold uppercase tracking-wide">{label}</span>
     </button>
  );

  if (!isAuthenticated) {
     return <AuthScreen onLogin={login} onRegister={register} onImport={importSave} errorMsg={authError} isLoading={isAuthLoading} />;
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-[#0d0d0d] font-sans">
      
      <HighscoresModal isOpen={showHighscores} onClose={() => setShowHighscores(false)} data={highscoresData} />
      
      {/* GM Panel - Only renders if player.isGm is true */}
      <GmPanel 
        player={player} 
        onLevelUp={actions.gmLevelUp} 
        onSkillUp={actions.gmSkillUp} 
        onAddGold={actions.gmAddGold} 
      />

      {offlineReport && (
         <div className="fixed inset-0 z-[70] bg-black/80 flex items-center justify-center p-4">
            <div className="tibia-panel max-w-md w-full p-4 shadow-2xl">
               <h3 className="text-yellow-500 font-bold text-sm mb-2 text-center border-b border-[#555] pb-1">Report Offline</h3>
               <p className="text-xs text-gray-300 mb-4 p-2 bg-[#222] border border-[#111] inset-shadow">{offlineReport}</p>
               <button onClick={() => actions.setOfflineReport(null)} className="tibia-btn w-full py-2 font-bold text-xs">Ok</button>
            </div>
         </div>
      )}

      {showExportModal && (
         <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
            <div className="tibia-panel max-w-lg w-full p-4 shadow-2xl">
                <div className="flex justify-between items-center mb-2 border-b border-[#555] pb-2">
                    <h3 className="text-yellow-500 font-bold">Export Save Code</h3>
                    <button onClick={() => setShowExportModal(false)} className="text-gray-400 hover:text-white">X</button>
                </div>
                <div className="bg-[#222] p-2 border border-[#111] mb-2">
                    <textarea readOnly value={exportString} className="w-full h-32 bg-[#111] text-xs text-green-400 font-mono p-2 border-none outline-none resize-none"/>
                </div>
                <button 
                    onClick={() => { navigator.clipboard.writeText(exportString); setShowExportModal(false); }}
                    className="tibia-btn w-full py-2 font-bold text-sm"
                >
                    Copy to Clipboard
                </button>
            </div>
         </div>
      )}

      {showNameModal && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4">
          <div className="tibia-panel max-w-sm w-full p-6 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold text-[#eee]">Character Name</h2>
              <p className="text-xs text-gray-400">Choose your identity</p>
            </div>
            <input 
              type="text" className="w-full bg-[#111] border border-[#555] p-2 text-[#eee] text-center mb-6 outline-none font-bold text-sm"
              placeholder="Name" value={tempName} onChange={(e) => setTempName(e.target.value)} maxLength={20}
            />
            <button 
              onClick={() => { actions.confirmName(tempName); setShowNameModal(false); }}
              disabled={tempName.length < 3} className="tibia-btn w-full py-2 font-bold text-sm"
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {showVocationModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="tibia-panel max-w-2xl w-full p-6 shadow-2xl">
            <div className="text-center mb-6 border-b border-[#555] pb-4">
              <Crown className="mx-auto text-yellow-500 mb-2" size={48} />
              <h2 className="text-xl font-bold text-yellow-500">Choose Vocation</h2>
              <p className="text-gray-400 text-sm">Level 8 Reached</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[Vocation.KNIGHT, Vocation.PALADIN, Vocation.SORCERER, Vocation.DRUID].map(v => (
                  <button key={v} onClick={() => { actions.chooseVocation(v); setShowVocationModal(false); }} className="tibia-btn p-4 flex flex-col items-center group gap-2">
                    <span className="font-bold text-gray-200 text-base">{v}</span>
                  </button>
              ))}
              <button onClick={() => { actions.chooseVocation(Vocation.MONK); setShowVocationModal(false); }} className="tibia-btn p-4 flex flex-col items-center group col-span-2 gap-2">
                <span className="font-bold text-gray-200 text-base">Monk</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Game Layout */}
      <div className="w-full h-full max-w-[1600px] flex flex-col bg-[#111] shadow-2xl border border-[#333]">
        {/* Header Bar */}
        <div className="h-12 bg-[#1a1a1a] border-b border-[#333] flex justify-between items-center px-4 shrink-0">
           <div className="flex items-center gap-3">
              <div className="text-[#c0c0c0] font-bold tracking-wider text-lg font-serif">TIBIA IDLE</div>
              <div className="h-4 w-[1px] bg-[#444]"></div>
              <div className="text-xs text-[#777] flex items-center gap-2">
                 <span>Account: <span className="text-yellow-500 font-bold">{currentAccount}</span></span>
                 <button 
                    onClick={() => { updateHighscores(); setShowHighscores(true); }}
                    className="bg-[#2a2a2a] hover:bg-[#333] text-yellow-500 px-3 py-1.5 rounded border border-[#444] hover:border-yellow-600 flex items-center gap-1.5 ml-3 transition-colors shadow-sm"
                 >
                    <Trophy size={14} className="text-yellow-500" /> <span className="font-bold text-[10px] uppercase tracking-wide">Highscores</span>
                 </button>
              </div>
           </div>
           <div className="flex items-center gap-4">
              {isSaving && <span className="text-xs text-green-500 font-bold animate-pulse">Saving...</span>}
              <div className="flex gap-2">
                  <button onClick={handleExport} className="flex items-center gap-1.5 text-xs text-[#aaa] hover:text-white bg-[#222] hover:bg-[#333] px-3 py-1.5 rounded transition-colors"><Download size={14} /> Export</button>
                  <button onClick={() => actions.saveGame()} className="flex items-center gap-1.5 text-xs text-[#aaa] hover:text-white bg-[#222] hover:bg-[#333] px-3 py-1.5 rounded transition-colors"><Save size={14} /> Save</button>
                  <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-200 bg-[#222] hover:bg-[#333] px-3 py-1.5 rounded transition-colors"><LogOut size={14} /> Logout</button>
              </div>
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
            {/* 1. LEFT SIDEBAR */}
            <div className="w-24 bg-[#181818] border-r border-[#333] flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
                <div className="px-3 py-2 text-[10px] text-[#555] font-bold uppercase mt-2">Adventure</div>
                <NavButton id="hunt" label="Battle" icon={Swords} active={activeTab === 'hunt'} />
                <NavButton id="prey" label="Prey" icon={Target} active={activeTab === 'prey'} />
                <NavButton id="tasks" label="Tasks" icon={Skull} active={activeTab === 'tasks'} />
                <NavButton id="quests" label="Quests" icon={Map} active={activeTab === 'quests'} />
                <NavButton id="train" label="Arena" icon={Shield} active={activeTab === 'train'} />
                <div className="w-full h-[1px] bg-[#333] my-2"></div>
                <div className="px-3 py-2 text-[10px] text-[#555] font-bold uppercase">City</div>
                <NavButton id="shop" label="Shop" icon={ShoppingBag} active={activeTab === 'shop'} />
                <NavButton id="castle" label="Castle" icon={Castle} active={activeTab === 'castle'} />
                <NavButton id="spells" label="Spells" icon={Sparkles} active={activeTab === 'spells'} />
                <NavButton id="bank" label="Bank" icon={Landmark} active={activeTab === 'bank'} />
                <NavButton id="depot" label="Depot" icon={Package} active={activeTab === 'depot'} />
                <div className="w-full h-[1px] bg-[#333] my-2"></div>
                <div className="px-3 py-2 text-[10px] text-[#555] font-bold uppercase">System</div>
                <NavButton id="bot" label="Bot" icon={Bot} active={activeTab === 'bot'} />
                <NavButton id="ascension" label="Soul War" icon={Ghost} active={activeTab === 'ascension'} />
            </div>

            {/* 2. CENTER CONTENT */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#0d0d0d] relative">
                <div className="flex-1 overflow-hidden relative">
                    <div className="absolute inset-0">
                        {activeTab === 'hunt' && (
                            <HuntPanel 
                            player={player}
                            activeHunt={activeHuntId}
                            bossCooldowns={player.bossCooldowns}
                            onStartHunt={actions.startHunt}
                            onStopHunt={actions.stopHunt}
                            currentMonsterHp={monsterHp}
                            hits={hits}
                            />
                        )}
                        {activeTab === 'prey' && <PreyPanel player={player} onReroll={actions.rerollPrey} />}
                        {activeTab === 'ascension' && <AscensionPanel player={player} onAscend={actions.handleAscend} onUpgrade={actions.handleBuyAscensionUpgrade} />}
                        {activeTab === 'tasks' && <TaskPanel player={player} onSelectTask={actions.handleSelectTask} onCancelTask={actions.handleCancelTask} onRerollTasks={actions.handleRerollTasks} onClaimReward={actions.handleClaimReward}/>}
                        {activeTab === 'train' && <TrainingPanel player={player} isTraining={!!activeTrainingSkill} trainingSkill={activeTrainingSkill} onStartTraining={actions.startTraining} onStopTraining={actions.stopTraining}/>}
                        {activeTab === 'shop' && <ShopPanel playerGold={player.gold} playerLevel={player.level} playerEquipment={player.equipment} playerInventory={player.inventory} playerQuests={player.quests} skippedLoot={player.skippedLoot} playerHasBlessing={player.hasBlessing} isGm={player.isGm} onBuyItem={actions.buyItem} onSellItem={actions.sellItem} onToggleSkippedLoot={actions.handleToggleSkippedLoot} onBuyBlessing={actions.handleBuyBlessing}/>}
                        {activeTab === 'castle' && <CastlePanel player={player} onPromote={actions.promotePlayer} onBuyBlessing={actions.handleBuyBlessing} />}
                        {activeTab === 'spells' && <SpellPanel player={player} onBuySpell={actions.handleBuySpell}/>}
                        {activeTab === 'depot' && <DepotPanel playerDepot={player.depot} onWithdrawItem={actions.handleWithdrawItem}/>}
                        {activeTab === 'bank' && <BankPanel playerGold={player.gold} bankGold={player.bankGold} onDeposit={actions.handleDepositGold} onWithdraw={actions.handleWithdrawGold}/>}
                        {activeTab === 'quests' && <QuestPanel playerQuests={player.quests} onClaimQuest={actions.handleClaimQuestReward} playerLevel={player.level} />}
                        {activeTab === 'bot' && <BotPanel player={player} onUpdateSettings={actions.updateSettings} />}
                    </div>
                </div>
                <div className="h-40 border-t border-[#333] shrink-0"><LogPanel logs={logs} /></div>
            </div>

            {/* 3. RIGHT SIDEBAR */}
            <div className="w-80 bg-[#1a1a1a] border-l border-[#333] flex flex-col shrink-0">
               <CharacterPanel 
                  player={player} 
                  onUpdateSettings={actions.updateSettings} 
                  onEquipItem={actions.handleEquipItem}
                  onDepositItem={actions.handleDepositItem}
                  onDiscardItem={actions.handleDiscardItem}
                  onToggleSkippedLoot={actions.handleToggleSkippedLoot}
                  onUnequipItem={actions.handleUnequipItem}
               />
            </div>
        </div>
      </div>
    </div>
  );
}
