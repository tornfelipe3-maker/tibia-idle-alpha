
import { useState, useEffect, useRef, useCallback } from 'react';
import { Player, LogEntry, Vocation, SkillType, EquipmentSlot, PlayerSettings, Boss, HuntingTask, HitSplat, Spell, Item } from '../types';
import { MONSTERS, BOSSES, SHOP_ITEMS, QUESTS, getXpForLevel, REGEN_RATES, SPELLS, MAX_STAMINA, INITIAL_PLAYER_STATS } from '../constants';
import { calculatePlayerDamage, calculatePlayerDefense, processSkillTraining, calculateSpellDamage, calculateSpellHealing, calculateLootDrop, generateTaskOptions, getXpStageMultiplier, calculateRuneDamage, getEffectiveSkill, StorageService } from '../services';

// Helper to extract "Exura" from "Light Healing (Exura)"
const getSpellIncantation = (name: string) => {
    const match = name.match(/\((.*?)\)/);
    return match ? match[1] : name;
};

export const useGameEngine = (initialPlayer: Player | null, currentAccount: string | null, isAuthenticated: boolean) => {
  // --- STATE ---
  const [player, setPlayer] = useState<Player>(INITIAL_PLAYER_STATS);
  const [activeHuntId, setActiveHuntId] = useState<string | null>(null);
  const [activeTrainingSkill, setActiveTrainingSkill] = useState<SkillType | null>(null);
  const [monsterHp, setMonsterHp] = useState<number>(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [hits, setHits] = useState<HitSplat[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [offlineReport, setOfflineReport] = useState<string | null>(null);

  // --- REFS (For Game Loop Consistency) ---
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

  // --- HELPERS ---
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
      setTimeout(() => {
          setHits(prev => prev.filter(h => h.id !== newHit.id));
      }, 1500); 
  }, []);

  // --- INITIALIZATION ---
  useEffect(() => {
      if (initialPlayer && isAuthenticated) {
          loadPlayerData(initialPlayer);
      }
  }, [initialPlayer, isAuthenticated]);

  const loadPlayerData = (loadedPlayer: Player) => {
      // Legacy compatibility checks
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
      if (loadedPlayer.hasBlessing === undefined) loadedPlayer.hasBlessing = false;
      
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

  // --- SAVE SYSTEM ---
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

  // --- INTERNAL LOGIC ---
  const handleLevelUp = (currentPlayer: Player): Player => {
    let p = { ...currentPlayer };
    while (p.currentXp >= p.maxXp) {
      p.currentXp -= p.maxXp;
      p.level += 1;
      p.maxXp = getXpForLevel(p.level);
      
      let hpGain = 5; let manaGain = 5;
      if (p.vocation === Vocation.KNIGHT) { hpGain = 15; manaGain = 5; }
      else if (p.vocation === Vocation.PALADIN) { hpGain = 10; manaGain = 15; }
      else if (p.vocation === Vocation.SORCERER || p.vocation === Vocation.DRUID) { hpGain = 5; manaGain = 30; }
      else if (p.vocation === Vocation.MONK) { hpGain = 10; manaGain = 10; }

      p.maxHp += hpGain; p.hp = p.maxHp;
      p.maxMana += manaGain; p.mana = p.maxMana;
      
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
                bossCooldowns: { ...prev.bossCooldowns, [boss.id]: Date.now() + (boss.cooldownSeconds * 1000) }
            }));
            addLog(`Você foi derrotado por ${boss.name} e deve esperar o cooldown.`, 'danger');
        }
    }

    setActiveHuntId(null);
    setActiveTrainingSkill(null);
    
    setPlayer(prev => {
      const hasBless = prev.hasBlessing;
      const baseXP_LossPercent = 0.10; 
      const baseGold_LossPercent = 0.10 + (Math.random() * 0.15); 
      const baseSkill_LossPercent = 0.10; 
      const penaltyMultiplier = hasBless ? 0.05 : 1.0;

      const lostXp = Math.floor(prev.currentXp * baseXP_LossPercent * penaltyMultiplier);
      const lostGold = Math.floor(prev.gold * baseGold_LossPercent * penaltyMultiplier);
      
      const updatedSkills = { ...prev.skills };
      Object.keys(updatedSkills).forEach((key) => {
          const skillType = key as SkillType;
          if (updatedSkills[skillType].level > 10) {
             const rawLoss = 100 * baseSkill_LossPercent * penaltyMultiplier;
             updatedSkills[skillType].progress -= rawLoss;
             if (updatedSkills[skillType].progress < 0) {
                 updatedSkills[skillType].level = Math.max(10, updatedSkills[skillType].level - 1);
                 updatedSkills[skillType].progress = 100 + updatedSkills[skillType].progress;
             }
          }
      });
      
      if (hasBless) {
          addLog(`Você morreu! Graças à Bless, perdeu apenas: ${lostXp.toLocaleString()} XP e ${lostGold.toLocaleString()} Gold.`, 'danger');
      } else {
          addLog(`Você morreu! Perdeu ${lostXp.toLocaleString()} XP, ${lostGold.toLocaleString()} Gold e Skills.`, 'danger');
      }

      return {
        ...prev,
        hp: prev.maxHp,
        mana: prev.maxMana,
        currentXp: Math.max(0, prev.currentXp - lostXp),
        gold: Math.max(0, prev.gold - lostGold),
        activeHuntCount: 1,
        skills: updatedSkills,
        hasBlessing: false 
      };
    });
  };

  // --- ACTIONS (Exposed to UI) ---
  const actions = {
      saveGame,
      setOfflineReport,
      setPlayer, // Direct set if needed, but prefer specific actions
      
      startHunt: (monsterId: string, isBoss: boolean = false, count: number = 1) => {
        if (activeTrainingSkill) setActiveTrainingSkill(null);
        const m = isBoss ? BOSSES.find(x => x.id === monsterId) : MONSTERS.find(x => x.id === monsterId);
        if (m) {
          setMonsterHp(m.maxHp * count);
          setPlayer(prev => ({ ...prev, activeHuntCount: count }));
          setActiveHuntId(monsterId);
          if (count > 1) addLog(`Caçando grupo de ${count}x ${m.name}. Cuidado!`, 'danger');
          else addLog(`Caçando ${m.name}.`, 'info');
        }
      },

      stopHunt: () => {
        setActiveHuntId(null);
        addLog('Parou de caçar.', 'info');
      },

      startTraining: (skill: SkillType) => {
        if (activeHuntId) setActiveHuntId(null);
        setActiveTrainingSkill(skill);
        addLog(`Treinando ${skill}...`, 'info');
      },

      stopTraining: () => {
        setActiveTrainingSkill(null);
        addLog('Treino finalizado.', 'info');
      },

      updateSettings: (newSettings: PlayerSettings) => {
        setPlayer(prev => ({ ...prev, settings: newSettings }));
      },

      chooseVocation: (vocation: Vocation) => {
        setPlayer(prev => ({ ...prev, vocation }));
        addLog(`Você agora é um ${vocation}!`, 'gain');
      },

      confirmName: (name: string) => {
        if (name.trim().length > 0) {
          setPlayer(prev => ({ ...prev, name: name }));
          addLog(`Bem-vindo, ${name}!`, 'info');
        }
      },

      // Inventory Actions
      handleEquipItem: (itemId: string) => {
        const item = SHOP_ITEMS.find(i => i.id === itemId);
        if (!item || !item.slot) return;
        if (item.requiredLevel && player.level < item.requiredLevel) {
            addLog(`You need level ${item.requiredLevel} to equip ${item.name}.`, 'danger');
            return;
        }
        if (item.requiredVocation && player.vocation !== Vocation.NONE && !item.requiredVocation.includes(player.vocation)) {
            addLog(`Your vocation cannot equip ${item.name}.`, 'danger');
            return;
        }

        setPlayer(prev => {
          const p = { ...prev };
          const isStackable = item.slot === EquipmentSlot.AMMO || (item.scalingStat === SkillType.DISTANCE && !item.weaponType);
          const quantityToEquip = p.inventory[itemId] || 0;
          if (quantityToEquip <= 0) return prev;

          const existingItem = p.equipment[item.slot!];

          if (isStackable) {
              if (existingItem && existingItem.id === item.id) {
                  const newTotal = (existingItem.count || 1) + quantityToEquip;
                  p.equipment[item.slot!] = { ...item, count: newTotal };
                  p.inventory[itemId] = 0;
                  addLog(`Added ${quantityToEquip}x ${item.name} to equipment. Total: ${newTotal}.`, 'info');
              } else {
                  if (existingItem) p.inventory[existingItem.id] = (p.inventory[existingItem.id] || 0) + (existingItem.count || 1);
                  p.equipment[item.slot!] = { ...item, count: quantityToEquip };
                  p.inventory[itemId] = 0;
                  addLog(`Equipped ${quantityToEquip}x ${item.name}.`, 'info');
              }
          } else {
              p.inventory[itemId]--; 
              if (existingItem) {
                  const oldQty = existingItem.count || 1;
                  p.inventory[existingItem.id] = (p.inventory[existingItem.id] || 0) + oldQty;
              }
              p.equipment[item.slot!] = { ...item, count: 1 };
              addLog(`Equipou ${item.name}.`, 'info');
          }
          return p;
        });
      },

      handleUnequipItem: (slot: EquipmentSlot) => {
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
      },

      handleDepositItem: (itemId: string) => {
        setPlayer(prev => {
          const p = { ...prev };
          if ((p.inventory[itemId] || 0) > 0) {
            p.inventory[itemId]--;
            p.depot[itemId] = (p.depot[itemId] || 0) + 1;
            addLog(`Depositou 1x ${SHOP_ITEMS.find(i => i.id === itemId)?.name}.`, 'info');
          }
          return p;
        });
      },

      handleWithdrawItem: (itemId: string) => {
        setPlayer(prev => {
          const p = { ...prev };
          if ((p.depot[itemId] || 0) > 0) {
            p.depot[itemId]--;
            p.inventory[itemId] = (p.inventory[itemId] || 0) + 1;
            addLog(`Retirou 1x ${SHOP_ITEMS.find(i => i.id === itemId)?.name}.`, 'info');
          }
          return p;
        });
      },

      handleDiscardItem: (itemId: string) => {
          setPlayer(prev => {
              const p = { ...prev };
              if ((p.inventory[itemId] || 0) > 0) {
                  p.inventory[itemId]--;
                  addLog(`Descartou ${SHOP_ITEMS.find(i => i.id === itemId)?.name}.`, 'info');
              }
              return p;
          });
      },

      handleToggleSkippedLoot: (itemId: string) => {
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
      },

      buyItem: (item: Item, quantity: number = 1) => {
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
      },

      sellItem: (item: Item, quantity: number = 1) => {
        if ((player.inventory[item.id] || 0) >= quantity) {
           const totalValue = item.sellPrice * quantity;
           setPlayer(prev => {
              const newState = { ...prev, gold: prev.gold + totalValue };
              newState.inventory[item.id] -= quantity;
              addLog(`Vendeu ${quantity}x ${item.name} por ${totalValue}gp.`, 'info');
              return newState;
           });
        }
      },

      handleBuyBlessing: () => {
          if (player.hasBlessing) {
              addLog("You are already blessed by the gods.", 'info');
              return;
          }
          const getBlessingCost = (level: number) => level <= 30 ? 2000 : level >= 120 ? 20000 : 2000 + (level - 30) * 200;
          const cost = getBlessingCost(player.level);
          if (player.gold >= cost) {
              setPlayer(prev => ({ ...prev, gold: prev.gold - cost, hasBlessing: true }));
              addLog("You have been blessed! Death penalties reduced by 95%.", 'gain');
              addHit("BLESSED!", 'heal', 'player');
          } else {
              addLog(`You need ${cost.toLocaleString()} gold for the blessing.`, 'danger');
          }
      },

      handleBuySpell: (spell: Spell) => {
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
      },

      handleDepositGold: (amount: number) => {
        if (player.gold >= amount) {
            setPlayer(prev => ({ ...prev, gold: prev.gold - amount, bankGold: prev.bankGold + amount }));
            addLog(`Deposited ${amount.toLocaleString()} gp.`, 'info');
        }
      },

      handleWithdrawGold: (amount: number) => {
        if (player.bankGold >= amount) {
            setPlayer(prev => ({ ...prev, gold: prev.gold + amount, bankGold: prev.bankGold - amount }));
            addLog(`Withdrew ${amount.toLocaleString()} gp.`, 'info');
        }
      },

      handleSelectTask: (task: HuntingTask) => {
        setPlayer(prev => ({ ...prev, activeTask: task, taskOptions: [] }));
        addLog(`Task Accepted: Kill ${task.killsRequired} ${MONSTERS.find(m => m.id === task.monsterId)?.name}!`, 'gain');
      },

      handleCancelTask: () => {
        setPlayer(prev => ({ ...prev, activeTask: null, taskOptions: generateTaskOptions(prev.level) }));
        addLog('Task Abandoned.', 'info');
      },

      handleRerollTasks: () => {
        const cost = player.level * 50;
        if (player.gold >= cost) {
           setPlayer(prev => ({ ...prev, gold: prev.gold - cost, taskOptions: generateTaskOptions(prev.level) }));
           addLog('Tasks Rerolled.', 'info');
        }
      },

      handleClaimReward: () => {
        if (player.activeTask && player.activeTask.isComplete) {
           const xp = player.activeTask.rewardXp;
           const gold = player.activeTask.rewardGold;
           let p = { ...player };
           p.currentXp += xp; p.gold += gold;
           p.activeTask = null;
           p.taskOptions = generateTaskOptions(p.level);
           p = handleLevelUp(p);
           setPlayer(p);
           addLog(`Task Complete! Rewards: ${xp.toLocaleString()} XP, ${gold.toLocaleString()} Gold.`, 'gain');
        }
      }
  };

  // --- GAME LOOP ---
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
             if (item.potionType === 'mana') p.mana = Math.min(p.maxMana, p.mana + item.restoreAmount);
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
             if (spell && p.purchasedSpells.includes(spell.id) && p.level >= spell.minLevel && (p.skills[SkillType.MAGIC].level >= (spell.reqMagicLevel || 0)) && p.mana >= spell.manaCost && (p.spellCooldowns[spell.id] || 0) <= now && p.globalCooldown <= now) {
                const healAmt = calculateSpellHealing(p, spell);
                p.mana -= spell.manaCost;
                p.hp = Math.min(p.maxHp, p.hp + healAmt);
                p.spellCooldowns[spell.id] = now + (spell.cooldown || 1000);
                p.globalCooldown = now + 1000;
                const magicRes = processSkillTraining(p, SkillType.MAGIC, spell.manaCost);
                p = magicRes.player;
                if (magicRes.leveledUp) addLog(`Magic Level up: ${p.skills[SkillType.MAGIC].level}!`, 'gain');
                const incantation = getSpellIncantation(spell.name);
                addLog(`Cast ${incantation}.`, 'magic');
                addHit(`+${healAmt}`, 'heal', 'player');
                addHit(incantation, 'speech', 'player'); 
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
             return; // Break loop early if boss gone
          }

          let currentMonHp = monsterHpRef.current;
          let totalDamage = calculatePlayerDamage(p); 
          
          const weapon = p.equipment[EquipmentSlot.HAND_RIGHT];
          const usedSkill = weapon?.scalingStat || SkillType.FIST;
          const skillRes = processSkillTraining(p, usedSkill, 1);
          p = skillRes.player;
          if (skillRes.leveledUp) addLog(`Skill ${usedSkill} up: ${p.skills[usedSkill].level}!`, 'gain');

          // Ammo & Weapon Breaking logic
          if (weapon?.scalingStat === SkillType.DISTANCE) {
            if (weapon.weaponType) {
                const ammo = p.equipment[EquipmentSlot.AMMO];
                if (ammo && totalDamage > 0) {
                    if (ammo.count && ammo.count > 0) {
                        ammo.count--;
                        if (ammo.count <= 0) {
                            delete p.equipment[EquipmentSlot.AMMO];
                            addLog(`You ran out of ${ammo.name}!`, 'danger');
                        }
                    } else delete p.equipment[EquipmentSlot.AMMO];
                }
            } else {
                // Thrown
                let breakChance = 0;
                if (weapon.id === 'spear') breakChance = 0.038;
                else if (weapon.id === 'royal_spear') breakChance = 0.032;
                // ... (simplified for brevity, assume similar logic)
                else if (weapon.id === 'assassin_star') breakChance = 0.33;
                
                if (breakChance > 0 && Math.random() < breakChance) {
                    if (weapon.count && weapon.count > 1) weapon.count--;
                    else {
                        delete p.equipment[EquipmentSlot.HAND_RIGHT];
                        addLog(`Your ${weapon.name} broke!`, 'danger');
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

          // Auto Attack Spell
          if (p.settings.autoAttackSpell && p.settings.selectedAttackSpellId && p.globalCooldown <= now) {
              const spell = SPELLS.find(s => s.id === p.settings.selectedAttackSpellId);
              if (spell && p.purchasedSpells.includes(spell.id) && p.level >= spell.minLevel && (p.skills[SkillType.MAGIC].level >= (spell.reqMagicLevel || 0)) && p.mana >= spell.manaCost && (p.spellCooldowns[spell.id] || 0) <= now) {
                  const spellDmg = calculateSpellDamage(p, spell);
                  const areaMultiplier = huntCount; 
                  totalDamage += (spellDmg * areaMultiplier);
                  p.mana -= spell.manaCost;
                  p.spellCooldowns[spell.id] = now + (spell.cooldown || 2000);
                  p.globalCooldown = now + 2000; 
                  castSpell = true;
                  attackSpellName = getSpellIncantation(spell.name);
                  const magicRes = processSkillTraining(p, SkillType.MAGIC, spell.manaCost);
                  p = magicRes.player;
                  if (magicRes.leveledUp) addLog(`Magic Level up: ${p.skills[SkillType.MAGIC].level}!`, 'gain');
                  addHit(attackSpellName, 'speech', 'player'); 
              }
          }

          // Auto Attack Rune
          if (!castSpell && p.settings.autoAttackRune && p.settings.selectedRuneId && p.globalCooldown <= now) {
              const runeItem = SHOP_ITEMS.find(i => i.id === p.settings.selectedRuneId);
              if (runeItem && (p.inventory[runeItem.id] || 0) > 0) {
                  if (p.level >= (runeItem.requiredLevel || 0) && getEffectiveSkill(p, SkillType.MAGIC) >= (runeItem.reqMagicLevel || 0)) {
                      const runeDmg = calculateRuneDamage(p, runeItem);
                      let finalRuneDmg = runeDmg;
                      if (runeItem.runeType === 'area') finalRuneDmg = runeDmg * huntCount;
                      totalDamage += finalRuneDmg;
                      p.inventory[runeItem.id]--;
                      p.globalCooldown = now + 2000; 
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
            if (huntCount > 1) difficultyMult = 1 + ((huntCount - 1) * 0.08);
            const totalIncomingRaw = Math.floor((rawDmgBase * huntCount) * difficultyMult);
            const mitigation = calculatePlayerDefense(p);
            const actualDmg = Math.max(0, Math.floor(totalIncomingRaw - mitigation));
            
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
            return; // Exit loop on death
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
                Object.entries(loot).forEach(([itemId, qty]) => { combinedLoot[itemId] = (combinedLoot[itemId] || 0) + qty; });
            }

            let lootMsg = "";
            Object.entries(combinedLoot).forEach(([itemId, qty]) => {
               if (p.skippedLoot.includes(itemId)) return;
               p.inventory[itemId] = (p.inventory[itemId] || 0) + qty;
               const itemName = SHOP_ITEMS.find(i => i.id === itemId)?.name || itemId;
               lootMsg += `, ${qty}x ${itemName}`;
            });

            if (lootMsg) addLog(`Loot x${huntCount} ${monster.name}: ${goldDrop} gp${lootMsg}. (${xpGained} xp)`, 'loot');
            else addLog(`Loot x${huntCount} ${monster.name}: ${goldDrop} gp. (${xpGained} xp)`, 'loot');

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

  // Task Options Generator Check
  useEffect(() => {
    if (isAuthenticated && player.level > 1 && player.taskOptions.length === 0 && !player.activeTask) {
       setPlayer(prev => ({ ...prev, taskOptions: generateTaskOptions(prev.level) }));
    }
  }, [player.level, player.taskOptions.length, player.activeTask, isAuthenticated]);

  return {
      player,
      activeHuntId,
      activeTrainingSkill,
      monsterHp,
      logs,
      hits,
      isSaving,
      offlineReport,
      actions
  };
};
