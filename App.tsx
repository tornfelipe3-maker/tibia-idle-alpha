
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Player, LogEntry, Vocation, SkillType, EquipmentSlot, PlayerSettings, Boss, HuntingTask, HitSplat, Spell, Item } from './types';
import { MONSTERS, BOSSES, SHOP_ITEMS, QUESTS, getXpForLevel, REGEN_RATES, SPELLS, MAX_STAMINA } from './constants';
import { calculatePlayerDamage, calculatePlayerDefense, processSkillTraining, calculateSpellDamage, calculateSpellHealing, calculateLootDrop, generateTaskOptions, getXpStageMultiplier, calculateRuneDamage, getEffectiveSkill, StorageService } from './services';
import { CharacterPanel } from './components/CharacterPanel';
import { HuntPanel } from './components/HuntPanel';
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
import { Crown, Save, LogOut, Swords, Skull, Shield, ShoppingBag, Sparkles, Landmark, Package, Map, Bot, Download } from 'lucide-react';

const INITIAL_PLAYER_STATS: Player = {
    name: '',
    level: 1,
    vocation: Vocation.NONE,
    currentXp: 0,
    maxXp: getXpForLevel(2),
    hp: 150,
    maxHp: 150,
    mana: 35,
    maxMana: 35,
    stamina: MAX_STAMINA,
    gold: 0,
    bankGold: 0,
    lastSaveTime: Date.now(),
    activeHuntId: null,
    activeHuntCount: 1,
    activeTrainingSkill: null,
    equipment: {},
    inventory: {},
    depot: {},
    skills: {
        [SkillType.FIST]: { level: 10, progress: 0 },
        [SkillType.CLUB]: { level: 10, progress: 0 },
        [SkillType.SWORD]: { level: 10, progress: 0 },
        [SkillType.AXE]: { level: 10, progress: 0 },
        [SkillType.DISTANCE]: { level: 10, progress: 0 },
        [SkillType.DEFENSE]: { level: 10, progress: 0 },
        [SkillType.MAGIC]: { level: 0, progress: 0 },
    },
    settings: {
        autoHealthPotionThreshold: 0,
        selectedHealthPotionId: '',
        autoManaPotionThreshold: 0,
        selectedManaPotionId: '',
        autoHealSpellThreshold: 0,
        selectedHealSpellId: '',
        autoAttackSpell: false,
        selectedAttackSpellId: '',
        autoAttackRune: false,
        selectedRuneId: '',
    },
    quests: {},
    bossCooldowns: {},
    spellCooldowns: {},
    purchasedSpells: [],
    globalCooldown: 0,
    activeTask: null,
    taskOptions: [],
    skippedLoot: [],
};

export default function App() {
  // --- Auth State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // --- Game State ---
  const [player, setPlayer] = useState<Player>(INITIAL_PLAYER_STATS);
  const [activeHuntId, setActiveHuntId] = useState<string | null>(null);
  const [activeTrainingSkill, setActiveTrainingSkill] = useState<SkillType | null>(null);
  const [monsterHp, setMonsterHp] = useState<number>(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  // Categorized Navigation State
  const [activeTab, setActiveTab] = useState<'hunt' | 'tasks' | 'quests' | 'train' | 'shop' | 'spells' | 'bank' | 'depot' | 'bot'>('hunt');
  
  const [isSaving, setIsSaving] = useState(false);
  const [hits, setHits] = useState<HitSplat[]>([]);
  
  // Modals
  const [showVocationModal, setShowVocationModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [tempName, setTempName] = useState('');
  const [offlineReport, setOfflineReport] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportString, setExportString] = useState('');

  // Using refs for interval mutable state
  const playerRef = useRef(player);
  const activeHuntRef = useRef(activeHuntId);
  const activeTrainingRef = useRef(activeTrainingSkill);
  const monsterHpRef = useRef(monsterHp);
  const saveIntervalRef = useRef<number>(0);
  
  // Sync refs with state
  useEffect(() => { playerRef.current = player; }, [player]);
  useEffect(() => { activeHuntRef.current = activeHuntId; }, [activeHuntId]);
  useEffect(() => { activeTrainingRef.current = activeTrainingSkill; }, [activeTrainingSkill]);
  useEffect(() => { monsterHpRef.current = monsterHp; }, [monsterHp]);

  // Helpers
  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      type,
      timestamp: Date.now(),
    };
    setLogs(prev => [...prev.slice(-40), newLog]); 
  }, []);

  const addHit = useCallback((value: number | string, type: HitSplat['type'], target: 'player' | 'monster') => {
      const newHit: HitSplat = {
          id: Date.now() + Math.random(),
          value,
          type,
          target,
      };
      setHits(prev => [...prev, newHit]);
      
      // Cleanup hit after animation
      setTimeout(() => {
          setHits(prev => prev.filter(h => h.id !== newHit.id));
      }, 1500); 
  }, []);


  // --- Auth Handlers ---
  const handleLogin = async (acc: string, pass: string) => {
    setAuthError(null);
    setIsAuthLoading(true);
    
    const result = await StorageService.login(acc, pass);
    
    setIsAuthLoading(false);

    if (result.success && result.data) {
      loadPlayerData(result.data);
      setCurrentAccount(acc);
      setIsAuthenticated(true);
    } else {
      setAuthError(result.error || 'Login failed.');
    }
  };

  const handleRegister = async (acc: string, pass: string) => {
    setAuthError(null);
    setIsAuthLoading(true);

    // Initial Starter Items Logic
    const newPlayer = JSON.parse(JSON.stringify(INITIAL_PLAYER_STATS));
    const coat = SHOP_ITEMS.find(i => i.id === 'coat');
    const club = SHOP_ITEMS.find(i => i.id === 'club');
    if (coat) newPlayer.equipment[EquipmentSlot.BODY] = coat;
    if (club) newPlayer.equipment[EquipmentSlot.HAND_RIGHT] = club;
    
    const result = await StorageService.register(acc, pass);
    
    if (result.success && result.data) {
        const starterPlayer = result.data;
        if (coat) starterPlayer.equipment[EquipmentSlot.BODY] = coat;
        if (club) starterPlayer.equipment[EquipmentSlot.HAND_RIGHT] = club;
        
        await StorageService.save(acc, starterPlayer);

        loadPlayerData(starterPlayer);
        setCurrentAccount(acc);
        setIsAuthenticated(true);
    } else {
        setAuthError(result.error || 'Registration failed.');
    }
    setIsAuthLoading(false);
  };

  const handleImportSave = (saveStr: string) => {
      const result = StorageService.importSaveString(saveStr);
      if (result.success && result.accountName) {
          setAuthError(`Import successful! Login as: ${result.accountName} (use your old password)`);
      } else {
          setAuthError(result.error || "Import failed.");
      }
  };

  const handleLogout = () => {
    saveGame(); 
    setIsAuthenticated(false);
    setCurrentAccount(null);
    setPlayer(INITIAL_PLAYER_STATS);
    setActiveHuntId(null);
    setActiveTrainingSkill(null);
    setLogs([]);
  };

  // --- Load / Offline Logic ---
  const loadPlayerData = (loadedPlayer: Player) => {
      // Ensure fields exist for legacy saves
      if (loadedPlayer.bankGold === undefined) loadedPlayer.bankGold = 0;
      if (loadedPlayer.activeTask === undefined) loadedPlayer.activeTask = null;
      if (loadedPlayer.taskOptions === undefined) loadedPlayer.taskOptions = [];
      if (loadedPlayer.skippedLoot === undefined) loadedPlayer.skippedLoot = [];
      if (loadedPlayer.settings.autoHealSpellThreshold === undefined) loadedPlayer.settings.autoHealSpellThreshold = 70;
      if (loadedPlayer.activeHuntCount === undefined) loadedPlayer.activeHuntCount = 1;
      if (loadedPlayer.settings.autoAttackSpell === undefined) loadedPlayer.settings.autoAttackSpell = false;
      if (loadedPlayer.spellCooldowns === undefined) loadedPlayer.spellCooldowns = {};
      if (loadedPlayer.purchasedSpells === undefined) loadedPlayer.purchasedSpells = []; 
      if (loadedPlayer.globalCooldown === undefined) loadedPlayer.globalCooldown = 0;
      if (loadedPlayer.settings.autoAttackRune === undefined) loadedPlayer.settings.autoAttackRune = false;
      if (loadedPlayer.settings.selectedRuneId === undefined) loadedPlayer.settings.selectedRuneId = '';
      
      // --- Offline Calc ---
      const now = Date.now();
      const lastSave = loadedPlayer.lastSaveTime || now;
      const diffSeconds = (now - lastSave) / 1000;
      
      let modifiedPlayer = { ...loadedPlayer };

      if (diffSeconds > 60) {
          let logMsg = `You were offline for ${(diffSeconds / 3600).toFixed(1)} hours. `;
          const MAX_HUNT_OFFLINE = 4 * 3600; 
          const MAX_TRAIN_OFFLINE = 12 * 3600; 

          if (loadedPlayer.activeHuntId) {
              const effectiveTime = Math.min(diffSeconds, MAX_HUNT_OFFLINE);
              const monster = MONSTERS.find(m => m.id === loadedPlayer.activeHuntId);
              const huntCount = loadedPlayer.activeHuntCount || 1;
              
              if (monster) {
                  const kills = Math.floor(effectiveTime / 10);
                  const stageMult = getXpStageMultiplier(loadedPlayer.level);
                  
                  const efficiency = Math.max(0.1, 1 - ((huntCount - 1) * 0.1));
                  
                  const totalXp = kills * monster.exp * stageMult * huntCount * efficiency;
                  const totalGold = kills * ((monster.minGold + monster.maxGold)/2) * huntCount * efficiency;
                  
                  modifiedPlayer.currentXp += totalXp;
                  modifiedPlayer.gold += Math.floor(totalGold);
                  
                  logMsg += `Hunted ${monster.name} (x${huntCount}) (~${kills} rounds). Gained ${Math.floor(totalXp).toLocaleString()} XP and ${Math.floor(totalGold).toLocaleString()} Gold.`;
              }
              setActiveHuntId(loadedPlayer.activeHuntId); 
          } else if (loadedPlayer.activeTrainingSkill) {
              const effectiveTime = Math.min(diffSeconds, MAX_TRAIN_OFFLINE);
              const skill = modifiedPlayer.activeTrainingSkill;
              
              logMsg += `Training ${skill} for ${(effectiveTime/3600).toFixed(1)}h.`;
              setActiveTrainingSkill(loadedPlayer.activeTrainingSkill); 
          }

          setOfflineReport(logMsg);
      } else {
          setActiveHuntId(loadedPlayer.activeHuntId);
          setActiveTrainingSkill(loadedPlayer.activeTrainingSkill);
      }
      
      setPlayer(modifiedPlayer);
  };

  // --- Save Logic ---
  const saveGame = useCallback(async () => {
     if (!currentAccount || !isAuthenticated) return;

     const stateToSave: Player = {
        ...playerRef.current,
        activeHuntId: activeHuntRef.current,
        activeTrainingSkill: activeTrainingRef.current,
        lastSaveTime: Date.now()
    };

    setIsSaving(true);
    await StorageService.save(currentAccount, stateToSave);
    setTimeout(() => setIsSaving(false), 800);

  }, [currentAccount, isAuthenticated]);

  const handleExport = () => {
      if (currentAccount) {
          const str = StorageService.exportSaveString(currentAccount);
          if (str) {
              setExportString(str);
              setShowExportModal(true);
          }
      }
  };

  useEffect(() => {
    if (isAuthenticated) {
        saveIntervalRef.current = window.setInterval(saveGame, 5000); 
        const handleBeforeUnload = () => saveGame();
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            clearInterval(saveIntervalRef.current);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }
  }, [saveGame, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && player.level > 1 && player.taskOptions.length === 0 && !player.activeTask) {
       setPlayer(prev => ({
         ...prev,
         taskOptions: generateTaskOptions(prev.level)
       }));
    }
  }, [player.level, player.taskOptions.length, player.activeTask, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (player.level >= 8 && player.vocation === Vocation.NONE) {
      setShowVocationModal(true);
    }
    if (player.level >= 2 && !player.name && !showNameModal) {
      setShowNameModal(true);
    }
  }, [player.level, player.vocation, player.name, isAuthenticated]);


  const handleLevelUp = (currentPlayer: Player): Player => {
    let p = { ...currentPlayer };
    while (p.currentXp >= p.maxXp) {
      p.currentXp -= p.maxXp;
      p.level += 1;
      p.maxXp = getXpForLevel(p.level);
      
      let hpGain = 5;
      let manaGain = 5;
      
      if (p.vocation === Vocation.KNIGHT) { hpGain = 15; manaGain = 5; }
      else if (p.vocation === Vocation.PALADIN) { hpGain = 10; manaGain = 15; }
      else if (p.vocation === Vocation.SORCERER || p.vocation === Vocation.DRUID) { hpGain = 5; manaGain = 30; }
      else if (p.vocation === Vocation.MONK) { hpGain = 10; manaGain = 10; }

      p.maxHp += hpGain;
      p.hp = p.maxHp;
      p.maxMana += manaGain;
      p.mana = p.maxMana;
      
      addLog(`Level Up! ${p.level}. HP+${hpGain}, MP+${manaGain}.`, 'gain');
      addHit('LEVEL UP!', 'heal', 'player');
    }
    return p;
  };

  const handleDeath = () => {
    const currentHuntId = activeHuntRef.current;
    if (currentHuntId) {
        const boss = BOSSES.find(b => b.id === currentHuntId);
        if (boss && boss.cooldownSeconds) {
            setPlayer(prev => ({
                ...prev,
                bossCooldowns: {
                    ...prev.bossCooldowns,
                    [boss.id]: Date.now() + (boss.cooldownSeconds * 1000)
                }
            }));
            addLog(`Você foi derrotado por ${boss.name} e deve esperar o cooldown.`, 'danger');
        }
    }

    setActiveHuntId(null);
    setActiveTrainingSkill(null);
    
    setPlayer(prev => {
      const xpPenalty = 0.1; 
      const goldPenaltyPercent = 0.10 + (Math.random() * 0.15); 
      const lostXp = Math.floor(prev.currentXp * xpPenalty);
      const lostGold = Math.floor(prev.gold * goldPenaltyPercent);
      
      addLog(`Você morreu! Perdeu ${lostXp.toLocaleString()} XP e ${lostGold.toLocaleString()} Gold.`, 'danger');

      return {
        ...prev,
        hp: prev.maxHp,
        mana: prev.maxMana,
        currentXp: Math.max(0, prev.currentXp - lostXp),
        gold: Math.max(0, prev.gold - lostGold),
        activeHuntCount: 1 
      };
    });
  };

  const chooseVocation = (vocation: Vocation) => {
    setPlayer(prev => ({ ...prev, vocation }));
    setShowVocationModal(false);
    addLog(`Você agora é um ${vocation}!`, 'gain');
  };

  const confirmName = () => {
    if (tempName.trim().length > 0) {
      setPlayer(prev => ({ ...prev, name: tempName }));
      setShowNameModal(false);
      addLog(`Bem-vindo, ${tempName}!`, 'info');
    }
  };

  // --- Actions ---

  const handleEquipItem = (itemId: string) => {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item || !item.slot) return;
    
    if (item.requiredLevel && player.level < item.requiredLevel) {
        addLog(`You need level ${item.requiredLevel} to equip ${item.name}.`, 'danger');
        return;
    }

    if (item.requiredVocation && player.vocation !== Vocation.NONE) {
        if (!item.requiredVocation.includes(player.vocation)) {
          addLog(`Your vocation cannot equip ${item.name}.`, 'danger');
          return;
        }
    }

    setPlayer(prev => {
      const p = { ...prev };
      
      // Determine if item is "stackable" in equipment (Ammo or Thrown Distance Weapon)
      const isStackable = item.slot === EquipmentSlot.AMMO || (item.scalingStat === SkillType.DISTANCE && !item.weaponType);
      
      const quantityToEquip = p.inventory[itemId] || 0;
      if (quantityToEquip <= 0) return prev;

      const existingItem = p.equipment[item.slot!];

      // STACKING LOGIC
      if (isStackable) {
          // If equipping same stackable item, just add to count
          if (existingItem && existingItem.id === item.id) {
              const newTotal = (existingItem.count || 1) + quantityToEquip;
              p.equipment[item.slot!] = { ...item, count: newTotal };
              p.inventory[itemId] = 0; // Removed all from inventory
              addLog(`Added ${quantityToEquip}x ${item.name} to equipment. Total: ${newTotal}.`, 'info');
          } else {
              // If replacing or empty slot
              if (existingItem) {
                  // Return old item (and its count) to inventory
                  p.inventory[existingItem.id] = (p.inventory[existingItem.id] || 0) + (existingItem.count || 1);
              }
              // Equip new stack
              p.equipment[item.slot!] = { ...item, count: quantityToEquip };
              p.inventory[itemId] = 0;
              addLog(`Equipped ${quantityToEquip}x ${item.name}.`, 'info');
          }
      } 
      // NON-STACKABLE LOGIC (Standard Equip)
      else {
          p.inventory[itemId]--; 
          if (existingItem) {
              // Non-stackable usually has count 1, but safeguard just in case
              const oldQty = existingItem.count || 1;
              p.inventory[existingItem.id] = (p.inventory[existingItem.id] || 0) + oldQty;
          }
          p.equipment[item.slot!] = { ...item, count: 1 };
          addLog(`Equipou ${item.name}.`, 'info');
      }

      return p;
    });
  };

  const handleUnequipItem = (slot: EquipmentSlot) => {
      setPlayer(prev => {
          const p = { ...prev };
          const item = p.equipment[slot];
          if (item) {
              const qty = item.count || 1;
              p.inventory[item.id] = (p.inventory[item.id] || 0) + qty;
              delete p.equipment[slot];
              addLog(`Unequipped ${item.name} (${qty}x).`, 'info');
          }
          return p;
      });
  };

  const handleDepositItem = (itemId: string) => {
    setPlayer(prev => {
      const p = { ...prev };
      if ((p.inventory[itemId] || 0) > 0) {
        p.inventory[itemId]--;
        p.depot[itemId] = (p.depot[itemId] || 0) + 1;
        addLog(`Depositou 1x ${SHOP_ITEMS.find(i => i.id === itemId)?.name}.`, 'info');
      }
      return p;
    });
  };

  const handleDiscardItem = (itemId: string) => {
      setPlayer(prev => {
          const p = { ...prev };
          if ((p.inventory[itemId] || 0) > 0) {
              p.inventory[itemId]--;
              addLog(`Descartou ${SHOP_ITEMS.find(i => i.id === itemId)?.name}.`, 'info');
          }
          return p;
      });
  };

  const handleToggleSkippedLoot = (itemId: string) => {
      setPlayer(prev => {
          const p = { ...prev };
          if (p.skippedLoot.includes(itemId)) {
              p.skippedLoot = p.skippedLoot.filter(id => id !== itemId);
              addLog(`Auto-loot ENABLED for ${SHOP_ITEMS.find(i => i.id === itemId)?.name}.`, 'info');
          } else {
              p.skippedLoot.push(itemId);
              addLog(`Auto-loot DISABLED for ${SHOP_ITEMS.find(i => i.id === itemId)?.name}.`, 'info');
          }
          return p;
      });
  };

  const handleWithdrawItem = (itemId: string) => {
    setPlayer(prev => {
      const p = { ...prev };
      if ((p.depot[itemId] || 0) > 0) {
        p.depot[itemId]--;
        p.inventory[itemId] = (p.inventory[itemId] || 0) + 1;
        addLog(`Retirou 1x ${SHOP_ITEMS.find(i => i.id === itemId)?.name}.`, 'info');
      }
      return p;
    });
  };

  const buyItem = (item: Item, quantity: number = 1) => {
    const totalCost = item.price * quantity;
    if (player.gold >= totalCost) {
      setPlayer(prev => {
        const newState = { ...prev, gold: prev.gold - totalCost };
        const currentQty = newState.inventory[item.id] || 0;
        newState.inventory = { ...newState.inventory, [item.id]: currentQty + quantity };
        addLog(`Comprou ${quantity}x ${item.name}.`, 'gain');
        return newState;
      });
    }
  };

  const sellItem = (item: Item, quantity: number = 1) => {
    if ((player.inventory[item.id] || 0) >= quantity) {
       const totalValue = item.sellPrice * quantity;
       setPlayer(prev => {
          const newState = { ...prev, gold: prev.gold + totalValue };
          newState.inventory[item.id] -= quantity;
          addLog(`Vendeu ${quantity}x ${item.name} por ${totalValue}gp.`, 'info');
          return newState;
       });
    }
  };

  const handleBuySpell = (spell: Spell) => {
      if (player.gold >= spell.price) {
          setPlayer(prev => ({
              ...prev,
              gold: prev.gold - spell.price,
              purchasedSpells: [...prev.purchasedSpells, spell.id]
          }));
          addLog(`You learned ${spell.name}!`, 'gain');
          addHit("LEARNED!", 'heal', 'player');
      } else {
          addLog("You cannot afford this spell.", 'danger');
      }
  };

  const handleDepositGold = (amount: number) => {
    if (player.gold >= amount) {
        setPlayer(prev => ({
            ...prev,
            gold: prev.gold - amount,
            bankGold: prev.bankGold + amount
        }));
        addLog(`Deposited ${amount.toLocaleString()} gp.`, 'info');
    }
  };

  const handleWithdrawGold = (amount: number) => {
    if (player.bankGold >= amount) {
        setPlayer(prev => ({
            ...prev,
            gold: prev.gold + amount,
            bankGold: prev.bankGold - amount
        }));
        addLog(`Withdrew ${amount.toLocaleString()} gp.`, 'info');
    }
  };

  const handleSelectTask = (task: HuntingTask) => {
    setPlayer(prev => ({
      ...prev,
      activeTask: task,
      taskOptions: [] 
    }));
    addLog(`Task Accepted: Kill ${task.killsRequired} ${MONSTERS.find(m => m.id === task.monsterId)?.name}!`, 'gain');
  };

  const handleCancelTask = () => {
    setPlayer(prev => ({
      ...prev,
      activeTask: null,
      taskOptions: generateTaskOptions(prev.level) 
    }));
    addLog('Task Abandoned.', 'info');
  };

  const handleRerollTasks = () => {
    const cost = player.level * 50;
    if (player.gold >= cost) {
       setPlayer(prev => ({
         ...prev,
         gold: prev.gold - cost,
         taskOptions: generateTaskOptions(prev.level)
       }));
       addLog('Tasks Rerolled.', 'info');
    }
  };

  const handleClaimReward = () => {
    if (player.activeTask && player.activeTask.isComplete) {
       const xp = player.activeTask.rewardXp;
       const gold = player.activeTask.rewardGold;
       
       let p = { ...player };
       p.currentXp += xp;
       p.gold += gold;
       p.activeTask = null;
       p.taskOptions = generateTaskOptions(p.level);
       
       p = handleLevelUp(p);
       setPlayer(p);
       addLog(`Task Complete! Rewards: ${xp.toLocaleString()} XP, ${gold.toLocaleString()} Gold.`, 'gain');
    }
  };


  // --- Game Loop ---
  useEffect(() => {
    if (!isAuthenticated) return;

    const tickRate = 666; 

    const interval = setInterval(() => {
      let p = { ...playerRef.current };
      const huntId = activeHuntRef.current;
      const huntCount = p.activeHuntCount || 1;
      const trainSkill = activeTrainingRef.current;
      const regen = REGEN_RATES[p.vocation] || REGEN_RATES[Vocation.NONE];
      const now = Date.now();

      // Stamina
      if (huntId) {
        if (p.stamina > 0) p.stamina = Math.max(0, p.stamina - 1);
      } else {
        if (p.stamina < MAX_STAMINA) p.stamina = Math.min(MAX_STAMINA, p.stamina + 0.5); 
      }

      // Potions & Healing
      const useSpecificPotion = (potionId: string, type: 'health' | 'mana' | 'spirit') => {
          if (!potionId || (p.inventory[potionId] || 0) <= 0) return false;
          
          const item = SHOP_ITEMS.find(i => i.id === potionId);
          if (!item || item.type !== 'potion') return false;
          
          if (item.requiredLevel && p.level < item.requiredLevel) return false;
          if (item.requiredVocation && p.vocation !== Vocation.NONE && !item.requiredVocation.includes(p.vocation)) return false;

          p.inventory[potionId]--;

          if (item.restoreAmount) {
             if (item.potionType === 'health' || item.potionType === 'spirit') {
                p.hp = Math.min(p.maxHp, p.hp + item.restoreAmount);
                addHit(`+${item.restoreAmount}`, 'heal', 'player');
             }
             if (item.potionType === 'mana') {
                p.mana = Math.min(p.maxMana, p.mana + item.restoreAmount);
             }
          }
          if (item.restoreAmountSecondary && item.potionType === 'spirit') {
             p.mana = Math.min(p.maxMana, p.mana + item.restoreAmountSecondary);
          }
          addLog(`Usou ${item.name}.`, 'info');
          return true;
      };

      if (p.settings.autoHealthPotionThreshold > 0 && (p.hp / p.maxHp) * 100 <= p.settings.autoHealthPotionThreshold) {
          useSpecificPotion(p.settings.selectedHealthPotionId, 'health');
      }

      if (p.settings.autoManaPotionThreshold > 0 && (p.mana / p.maxMana) * 100 <= p.settings.autoManaPotionThreshold) {
          useSpecificPotion(p.settings.selectedManaPotionId, 'mana');
      }

      if (p.settings.autoHealSpellThreshold > 0 && (p.hp / p.maxHp) * 100 <= p.settings.autoHealSpellThreshold) {
          if (p.settings.selectedHealSpellId) {
             const spell = SPELLS.find(s => s.id === p.settings.selectedHealSpellId);
             
             if (spell && 
                 p.purchasedSpells.includes(spell.id) &&
                 p.level >= spell.minLevel && 
                 (p.skills[SkillType.MAGIC].level >= (spell.reqMagicLevel || 0)) && 
                 p.mana >= spell.manaCost &&
                 (p.spellCooldowns[spell.id] || 0) <= now &&
                 p.globalCooldown <= now
             ) {
                const healAmt = calculateSpellHealing(p, spell);
                p.mana -= spell.manaCost;
                p.hp = Math.min(p.maxHp, p.hp + healAmt);
                
                p.spellCooldowns[spell.id] = now + (spell.cooldown || 1000);
                p.globalCooldown = now + 1000;

                const magicRes = processSkillTraining(p, SkillType.MAGIC, spell.manaCost);
                p = magicRes.player;
                if (magicRes.leveledUp) addLog(`Magic Level up: ${p.skills[SkillType.MAGIC].level}!`, 'gain');
                addLog(`Cast ${spell.name}.`, 'magic');
                addHit(`+${healAmt}`, 'heal', 'player');
                addHit(spell.name, 'speech', 'player'); 
             }
          }
      }

      if (p.hp < p.maxHp) p.hp = Math.min(p.maxHp, Math.floor(p.hp + regen.hp));
      if (p.mana < p.maxMana) p.mana = Math.min(p.maxMana, Math.floor(p.mana + regen.mana));

      // Training
      if (trainSkill) {
        const result = processSkillTraining(p, trainSkill, 10);
        p = result.player;
        if (result.leveledUp) {
          addLog(`Sua skill ${trainSkill} subiu para o nível ${p.skills[trainSkill].level}!`, 'gain');
          addHit('Skill Up!', 'heal', 'player');
        }
        
        if ([SkillType.SWORD, SkillType.AXE, SkillType.CLUB].includes(trainSkill)) {
            const shieldRes = processSkillTraining(p, SkillType.DEFENSE, 10);
            p = shieldRes.player;
            if (shieldRes.leveledUp) {
              addLog(`Sua skill Shielding subiu para o nível ${p.skills[SkillType.DEFENSE].level}!`, 'gain');
              addHit('Shield Up!', 'heal', 'player');
            }
        }
      }

      // Combat
      if (huntId) {
        const monster = MONSTERS.find(m => m.id === huntId) || BOSSES.find(b => b.id === huntId);
        
        if (monster) {
          if ((monster as Boss).cooldownSeconds && p.bossCooldowns[monster.id] > Date.now()) {
             addLog(`${monster.name} sumiu.`, 'info');
             setActiveHuntId(null);
             return;
          }

          let currentMonHp = monsterHpRef.current;
          let totalDamage = calculatePlayerDamage(p); 
          
          const weapon = p.equipment[EquipmentSlot.HAND_RIGHT];
          const usedSkill = weapon?.scalingStat || SkillType.FIST;
          const skillRes = processSkillTraining(p, usedSkill, 1);
          p = skillRes.player;
          if (skillRes.leveledUp) addLog(`Skill ${usedSkill} up: ${p.skills[usedSkill].level}!`, 'gain');

          // --- Ammo Consumption & Weapon Breaking (Logic Updated for Stacking) ---
          if (weapon?.scalingStat === SkillType.DISTANCE) {
            // Bows & Crossbows (Consume Stacked Ammo)
            if (weapon.weaponType) {
                const ammo = p.equipment[EquipmentSlot.AMMO];
                if (ammo && totalDamage > 0) {
                    if (ammo.count && ammo.count > 0) {
                        ammo.count--;
                        if (ammo.count <= 0) {
                            delete p.equipment[EquipmentSlot.AMMO];
                            addLog(`You ran out of ${ammo.name}!`, 'danger');
                        }
                    } else {
                        // Fallback for non-stacked usage (shouldn't happen with new logic but safe to keep)
                        delete p.equipment[EquipmentSlot.AMMO];
                    }
                }
            } 
            // Thrown Weapons (Spears, Stars) - Consume Stacked Weapon
            else {
                let breakChance = 0;
                if (weapon.id === 'spear') breakChance = 0.038;
                else if (weapon.id === 'royal_spear') breakChance = 0.032;
                else if (weapon.id === 'small_stone') breakChance = 0.03;
                else if (weapon.id === 'assassin_star') breakChance = 0.33;
                else if (weapon.id === 'viper_star') breakChance = 0.20;
                else if (weapon.id === 'enchanted_spear') breakChance = 0.01;
                else if (weapon.id === 'gloom_spear') breakChance = 0.03;
                
                if (breakChance > 0 && Math.random() < breakChance) {
                    if (weapon.count && weapon.count > 1) {
                        // Stack reduces
                        weapon.count--;
                    } else {
                        // Last one broke
                        delete p.equipment[EquipmentSlot.HAND_RIGHT];
                        addLog(`Your ${weapon.name} broke!`, 'danger');
                        // Auto-refill from inventory attempt (Backup mechanic)
                        if ((p.inventory[weapon.id] || 0) > 0) {
                             const qty = p.inventory[weapon.id];
                             p.equipment[EquipmentSlot.HAND_RIGHT] = { ...weapon, count: qty };
                             p.inventory[weapon.id] = 0;
                             addLog(`Equipped backup ${weapon.name}s from backpack.`, 'info');
                        }
                    }
                }
            }
          }

          let castSpell = false;
          let attackSpellName = "";

          // Auto Attack Spell (Selected)
          if (p.settings.autoAttackSpell && p.settings.selectedAttackSpellId && p.globalCooldown <= now) {
              const spell = SPELLS.find(s => s.id === p.settings.selectedAttackSpellId);

              if (spell &&
                  p.purchasedSpells.includes(spell.id) &&
                  p.level >= spell.minLevel && 
                  (p.skills[SkillType.MAGIC].level >= (spell.reqMagicLevel || 0)) && // ML Check
                  p.mana >= spell.manaCost &&
                  (p.spellCooldowns[spell.id] || 0) <= now
              ) {
                  const spellDmg = calculateSpellDamage(p, spell);
                  const areaMultiplier = huntCount; 
                  
                  totalDamage += (spellDmg * areaMultiplier);
                  
                  p.mana -= spell.manaCost;
                  p.spellCooldowns[spell.id] = now + (spell.cooldown || 2000);
                  p.globalCooldown = now + 2000; 
                  
                  castSpell = true;
                  attackSpellName = spell.name;

                  // Magic Training based on Mana Cost
                  const magicRes = processSkillTraining(p, SkillType.MAGIC, spell.manaCost);
                  p = magicRes.player;
                  if (magicRes.leveledUp) addLog(`Magic Level up: ${p.skills[SkillType.MAGIC].level}!`, 'gain');
                  addHit(spell.name, 'speech', 'player'); // SPEECH VISUAL
              }
          }

          // Auto Attack Rune logic
          if (!castSpell && p.settings.autoAttackRune && p.settings.selectedRuneId && p.globalCooldown <= now) {
              const runeItem = SHOP_ITEMS.find(i => i.id === p.settings.selectedRuneId);
              if (runeItem && (p.inventory[runeItem.id] || 0) > 0) {
                  // Rune Requirements Check (Level & Magic Level)
                  if (p.level >= (runeItem.requiredLevel || 0) && getEffectiveSkill(p, SkillType.MAGIC) >= (runeItem.reqMagicLevel || 0)) {
                      
                      const runeDmg = calculateRuneDamage(p, runeItem);
                      let finalRuneDmg = runeDmg;

                      // Area rune vs Single rune logic
                      if (runeItem.runeType === 'area') {
                          finalRuneDmg = runeDmg * huntCount;
                      }

                      totalDamage += finalRuneDmg;
                      p.inventory[runeItem.id]--;
                      
                      p.globalCooldown = now + 2000; // 2s CD for Runes
                      
                      castSpell = true;
                      attackSpellName = runeItem.name;
                  }
              }
          }

          currentMonHp -= totalDamage;
          addHit(totalDamage, 'damage', 'monster'); 

          if (castSpell) {
             if (huntCount > 1) addLog(`Cast ${attackSpellName} (x${huntCount} targets).`, 'combat');
             else addLog(`Cast ${attackSpellName} for dmg.`, 'combat');
          } else {
             if (Math.random() > 0.7) addLog(`Hit for ${totalDamage}.`, 'combat');
          }

          if (currentMonHp > 0) {
            const rawDmgBase = Math.floor(Math.random() * (monster.damageMax - monster.damageMin + 1)) + monster.damageMin;
            
            let difficultyMult = 1;
            if (huntCount > 1) {
                difficultyMult = 1 + ((huntCount - 1) * 0.08);
            }
            
            const totalIncomingRaw = Math.floor((rawDmgBase * huntCount) * difficultyMult);

            const mitigation = calculatePlayerDefense(p);
            const actualDmg = Math.max(0, Math.floor(totalIncomingRaw - mitigation));
            
            // Shield training on hit taken
            const shieldRes = processSkillTraining(p, SkillType.DEFENSE, 1);
            p = shieldRes.player;
            if (shieldRes.leveledUp) addLog(`Shielding up: ${p.skills[SkillType.DEFENSE].level}!`, 'gain');

            if (actualDmg > 0) {
               p.hp -= actualDmg;
               if (Math.random() > 0.8) addLog(`Perdeu ${actualDmg} HP (x${huntCount} Mobs).`, 'combat');
               addHit(actualDmg, 'damage', 'player'); 
            } else {
               addHit('Miss', 'miss', 'player'); 
            }
          }

          if (p.hp <= 0) {
            handleDeath();
            return;
          }

          if (currentMonHp <= 0) {
            const goldDropBase = Math.floor(Math.random() * (monster.maxGold - monster.minGold + 1)) + monster.minGold;
            const goldDrop = goldDropBase * huntCount;
            
            const staminaMultiplier = p.stamina > 0 ? 1.5 : 1.0;
            const stageMult = getXpStageMultiplier(p.level);
            const xpGained = Math.floor(monster.exp * stageMult * staminaMultiplier * huntCount);
            
            p.currentXp += xpGained;
            p.gold += goldDrop;
            
            let combinedLoot: {[key:string]: number} = {};
            
            for(let i=0; i<huntCount; i++) {
                const loot = calculateLootDrop(monster);
                Object.entries(loot).forEach(([itemId, qty]) => {
                    combinedLoot[itemId] = (combinedLoot[itemId] || 0) + qty;
                });
            }

            let lootMsg = "";
            Object.entries(combinedLoot).forEach(([itemId, qty]) => {
               if (p.skippedLoot.includes(itemId)) {
                   return;
               }

               p.inventory[itemId] = (p.inventory[itemId] || 0) + qty;
               const itemName = SHOP_ITEMS.find(i => i.id === itemId)?.name || itemId;
               lootMsg += `, ${qty}x ${itemName}`;
            });

            if (lootMsg) {
                addLog(`Loot x${huntCount} ${monster.name}: ${goldDrop} gp${lootMsg}. (${xpGained} xp)`, 'loot');
            } else {
                addLog(`Loot x${huntCount} ${monster.name}: ${goldDrop} gp. (${xpGained} xp)`, 'loot');
            }

            if (p.activeTask && p.activeTask.monsterId === monster.id && !p.activeTask.isComplete) {
              p.activeTask.killsCurrent += huntCount; 
              if (p.activeTask.killsCurrent >= p.activeTask.killsRequired) {
                p.activeTask.isComplete = true;
                addLog('Task Complete! Return to Task Panel to claim reward.', 'gain');
              }
            }

            const relevantQuests = QUESTS.filter(q => q.targetMonsterId === monster.id);
            relevantQuests.forEach(q => {
               if (!p.quests[q.id]) p.quests[q.id] = { kills: 0, completed: false };
               
               if (!p.quests[q.id].completed) {
                  p.quests[q.id].kills += huntCount;
                  if (p.quests[q.id].kills >= q.requiredKills) {
                     p.quests[q.id].completed = true;
                     addLog(`QUEST COMPLETED: ${q.name}! Access to ${q.rewardNpcAccess} unlocked.`, 'gain');
                  }
               }
            });

            if ((monster as Boss).cooldownSeconds) {
               p.bossCooldowns[monster.id] = Date.now() + ((monster as Boss).cooldownSeconds * 1000);
               setActiveHuntId(null);
               addLog(`${monster.name} derrotado! Volte amanhã.`, 'gain');
            }

            const leveledPlayer = handleLevelUp(p);
            p = leveledPlayer;
            setMonsterHp(monster.maxHp * huntCount); 
          } else {
            setMonsterHp(currentMonHp);
          }
        }
      }

      setPlayer(p);

    }, tickRate);

    return () => clearInterval(interval);
  }, [addLog, addHit, isAuthenticated]);


  const startHunt = (monsterId: string, isBoss: boolean = false, count: number = 1) => {
    if (activeTrainingSkill) setActiveTrainingSkill(null);
    const m = isBoss ? BOSSES.find(x => x.id === monsterId) : MONSTERS.find(x => x.id === monsterId);
    if (m) {
      setMonsterHp(m.maxHp * count);
      setPlayer(prev => ({ ...prev, activeHuntCount: count }));
      setActiveHuntId(monsterId);
      if (count > 1) {
          addLog(`Caçando grupo de ${count}x ${m.name}. Cuidado!`, 'danger');
      } else {
          addLog(`Caçando ${m.name}.`, 'info');
      }
    }
  };

  const stopHunt = () => {
    setActiveHuntId(null);
    addLog('Parou de caçar.', 'info');
  };

  const startTraining = (skill: SkillType) => {
    if (activeHuntId) setActiveHuntId(null);
    setActiveTrainingSkill(skill);
    addLog(`Treinando ${skill}...`, 'info');
  };

  const stopTraining = () => {
    setActiveTrainingSkill(null);
    addLog('Treino finalizado.', 'info');
  };

  const updateSettings = (newSettings: PlayerSettings) => {
    setPlayer(prev => ({ ...prev, settings: newSettings }));
  };

  // --- Render Navigation Button ---
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
     return (
       <AuthScreen 
         onLogin={handleLogin} 
         onRegister={handleRegister} 
         onImport={handleImportSave}
         errorMsg={authError} 
         isLoading={isAuthLoading}
       />
     );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-[#0d0d0d] font-sans">
      
      {/* Offline Report Modal */}
      {offlineReport && (
         <div className="fixed inset-0 z-[70] bg-black/80 flex items-center justify-center p-4">
            <div className="tibia-panel max-w-md w-full p-4 shadow-2xl">
               <h3 className="text-yellow-500 font-bold text-sm mb-2 text-center border-b border-[#555] pb-1">Report Offline</h3>
               <p className="text-xs text-gray-300 mb-4 p-2 bg-[#222] border border-[#111] inset-shadow">{offlineReport}</p>
               <button onClick={() => setOfflineReport(null)} className="tibia-btn w-full py-2 font-bold text-xs">Ok</button>
            </div>
         </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
         <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
            <div className="tibia-panel max-w-lg w-full p-4 shadow-2xl">
                <div className="flex justify-between items-center mb-2 border-b border-[#555] pb-2">
                    <h3 className="text-yellow-500 font-bold">Export Save Code</h3>
                    <button onClick={() => setShowExportModal(false)} className="text-gray-400 hover:text-white">X</button>
                </div>
                <div className="bg-[#222] p-2 border border-[#111] mb-2">
                    <textarea 
                        readOnly 
                        value={exportString} 
                        className="w-full h-32 bg-[#111] text-xs text-green-400 font-mono p-2 border-none outline-none resize-none"
                    />
                </div>
                <button 
                    onClick={() => { navigator.clipboard.writeText(exportString); addLog("Save copied to clipboard!", 'info'); setShowExportModal(false); }}
                    className="tibia-btn w-full py-2 font-bold text-sm"
                >
                    Copy to Clipboard
                </button>
            </div>
         </div>
      )}

      {/* Name Modal */}
      {showNameModal && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4">
          <div className="tibia-panel max-w-sm w-full p-6 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold text-[#eee]">Character Name</h2>
              <p className="text-xs text-gray-400">Choose your identity</p>
            </div>
            <input 
              type="text" 
              className="w-full bg-[#111] border border-[#555] p-2 text-[#eee] text-center mb-6 outline-none font-bold text-sm"
              placeholder="Name"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              maxLength={20}
            />
            <button 
              onClick={confirmName}
              disabled={tempName.length < 3}
              className="tibia-btn w-full py-2 font-bold text-sm"
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* Vocation Modal */}
      {showVocationModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="tibia-panel max-w-2xl w-full p-6 shadow-2xl">
            <div className="text-center mb-6 border-b border-[#555] pb-4">
              <Crown className="mx-auto text-yellow-500 mb-2" size={48} />
              <h2 className="text-xl font-bold text-yellow-500">Choose Vocation</h2>
              <p className="text-gray-400 text-sm">Level 8 Reached</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => chooseVocation(Vocation.KNIGHT)} className="tibia-btn p-4 flex flex-col items-center group gap-2">
                <span className="font-bold text-gray-200 text-base">Knight</span>
                <span className="text-xs text-gray-500">Melee Tank</span>
              </button>
              <button onClick={() => chooseVocation(Vocation.PALADIN)} className="tibia-btn p-4 flex flex-col items-center group gap-2">
                <span className="font-bold text-gray-200 text-base">Paladin</span>
                <span className="text-xs text-gray-500">Distance & Holy</span>
              </button>
              <button onClick={() => chooseVocation(Vocation.SORCERER)} className="tibia-btn p-4 flex flex-col items-center group gap-2">
                <span className="font-bold text-gray-200 text-base">Sorcerer</span>
                <span className="text-xs text-gray-500">Offensive Magic</span>
              </button>
              <button onClick={() => chooseVocation(Vocation.DRUID)} className="tibia-btn p-4 flex flex-col items-center group gap-2">
                <span className="font-bold text-gray-200 text-base">Druid</span>
                <span className="text-xs text-gray-500">Healing & Earth</span>
              </button>
              <button onClick={() => chooseVocation(Vocation.MONK)} className="tibia-btn p-4 flex flex-col items-center group col-span-2 gap-2">
                <span className="font-bold text-gray-200 text-base">Monk</span>
                <span className="text-xs text-gray-500">Fist & Speed</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Game Layout - 3 COLUMNS */}
      <div className="w-full h-full max-w-[1600px] flex flex-col bg-[#111] shadow-2xl border border-[#333]">
        
        {/* Header Bar */}
        <div className="h-12 bg-[#1a1a1a] border-b border-[#333] flex justify-between items-center px-4 shrink-0">
           <div className="flex items-center gap-3">
              <div className="text-[#c0c0c0] font-bold tracking-wider text-lg font-serif">TIBIA IDLE</div>
              <div className="h-4 w-[1px] bg-[#444]"></div>
              <div className="text-xs text-[#777]">
                 Account: <span className="text-yellow-500 font-bold">{currentAccount}</span>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              {isSaving && <span className="text-xs text-green-500 font-bold animate-pulse">Saving...</span>}
              <div className="flex gap-2">
                  <button 
                    onClick={handleExport}
                    className="flex items-center gap-1.5 text-xs text-[#aaa] hover:text-white bg-[#222] hover:bg-[#333] px-3 py-1.5 rounded transition-colors"
                    title="Export Save Code"
                  >
                    <Download size={14} /> Export
                  </button>
                  <button 
                    onClick={() => { saveGame(); addLog("Game Saved manually.", 'info'); }}
                    className="flex items-center gap-1.5 text-xs text-[#aaa] hover:text-white bg-[#222] hover:bg-[#333] px-3 py-1.5 rounded transition-colors"
                  >
                    <Save size={14} /> Save
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-200 bg-[#222] hover:bg-[#333] px-3 py-1.5 rounded transition-colors"
                  >
                    <LogOut size={14} /> Logout
                  </button>
              </div>
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
            
            {/* 1. LEFT SIDEBAR (Navigation) */}
            <div className="w-24 bg-[#181818] border-r border-[#333] flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
                
                <div className="px-3 py-2 text-[10px] text-[#555] font-bold uppercase mt-2">Adventure</div>
                <NavButton id="hunt" label="Battle" icon={Swords} active={activeTab === 'hunt'} />
                <NavButton id="tasks" label="Tasks" icon={Skull} active={activeTab === 'tasks'} />
                <NavButton id="quests" label="Quests" icon={Map} active={activeTab === 'quests'} />
                <NavButton id="train" label="Arena" icon={Shield} active={activeTab === 'train'} />

                <div className="w-full h-[1px] bg-[#333] my-2"></div>
                
                <div className="px-3 py-2 text-[10px] text-[#555] font-bold uppercase">City</div>
                <NavButton id="shop" label="Shop" icon={ShoppingBag} active={activeTab === 'shop'} />
                <NavButton id="spells" label="Spells" icon={Sparkles} active={activeTab === 'spells'} />
                <NavButton id="bank" label="Bank" icon={Landmark} active={activeTab === 'bank'} />
                <NavButton id="depot" label="Depot" icon={Package} active={activeTab === 'depot'} />
                
                <div className="w-full h-[1px] bg-[#333] my-2"></div>
                
                <div className="px-3 py-2 text-[10px] text-[#555] font-bold uppercase">System</div>
                <NavButton id="bot" label="Bot" icon={Bot} active={activeTab === 'bot'} />
                
            </div>

            {/* 2. CENTER CONTENT (Main View) */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#0d0d0d] relative">
                
                {/* Active Tab View */}
                <div className="flex-1 overflow-hidden relative">
                    <div className="absolute inset-0">
                        {activeTab === 'hunt' && (
                            <HuntPanel 
                            player={player}
                            activeHunt={activeHuntId}
                            bossCooldowns={player.bossCooldowns}
                            onStartHunt={startHunt}
                            onStopHunt={stopHunt}
                            currentMonsterHp={monsterHp}
                            hits={hits}
                            />
                        )}
                        {activeTab === 'tasks' && (
                            <TaskPanel 
                            player={player}
                            onSelectTask={handleSelectTask}
                            onCancelTask={handleCancelTask}
                            onRerollTasks={handleRerollTasks}
                            onClaimReward={handleClaimReward}
                            />
                        )}
                        {activeTab === 'train' && (
                            <TrainingPanel 
                            player={player}
                            isTraining={!!activeTrainingSkill}
                            trainingSkill={activeTrainingSkill}
                            onStartTraining={startTraining}
                            onStopTraining={stopTraining}
                            />
                        )}
                        {activeTab === 'shop' && (
                            <ShopPanel 
                            playerGold={player.gold}
                            playerLevel={player.level}
                            playerEquipment={player.equipment}
                            playerInventory={player.inventory}
                            playerQuests={player.quests}
                            skippedLoot={player.skippedLoot}
                            onBuyItem={buyItem}
                            onSellItem={sellItem}
                            onToggleSkippedLoot={handleToggleSkippedLoot}
                            />
                        )}
                        {activeTab === 'spells' && (
                           <SpellPanel 
                             player={player}
                             onBuySpell={handleBuySpell}
                           />
                        )}
                        {activeTab === 'depot' && (
                            <DepotPanel 
                            playerDepot={player.depot}
                            onWithdrawItem={handleWithdrawItem}
                            />
                        )}
                        {activeTab === 'bank' && (
                            <BankPanel 
                            playerGold={player.gold}
                            bankGold={player.bankGold}
                            onDeposit={handleDepositGold}
                            onWithdraw={handleWithdrawGold}
                            />
                        )}
                        {activeTab === 'quests' && (
                            <QuestPanel playerQuests={player.quests} />
                        )}
                        {activeTab === 'bot' && (
                            <BotPanel player={player} onUpdateSettings={updateSettings} />
                        )}
                    </div>
                </div>

                {/* Console Log (Bottom of Center) */}
                <div className="h-40 border-t border-[#333] shrink-0">
                   <LogPanel logs={logs} />
                </div>
            </div>

            {/* 3. RIGHT SIDEBAR (Character) */}
            <div className="w-80 bg-[#1a1a1a] border-l border-[#333] flex flex-col shrink-0">
               <CharacterPanel 
                  player={player} 
                  onUpdateSettings={updateSettings} 
                  onEquipItem={handleEquipItem}
                  onDepositItem={handleDepositItem}
                  onDiscardItem={handleDiscardItem}
                  onToggleSkippedLoot={handleToggleSkippedLoot}
                  onUnequipItem={handleUnequipItem}
               />
            </div>

        </div>
      </div>
    </div>
  );
}
