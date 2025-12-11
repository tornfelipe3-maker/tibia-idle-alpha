
import { Player } from '../types';
import { INITIAL_PLAYER_STATS } from '../constants';

const ACCOUNTS_KEY = 'tibia_idle_accounts_v1';

// This is where you would initialize Supabase in the future
// import { createClient } from '@supabase/supabase-js';
// const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_KEY');

interface AccountDb {
  [accountName: string]: {
    password: string;
    data: Player;
  }
}

export const StorageService = {
  // Simulates an async network delay to prepare for real backend
  async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  async login(account: string, pass: string): Promise<{ success: boolean; data?: Player; error?: string }> {
    await this.delay(300); // Simulate network

    try {
      const dbStr = localStorage.getItem(ACCOUNTS_KEY);
      if (!dbStr) return { success: false, error: 'Account not found.' };

      const db: AccountDb = JSON.parse(dbStr);
      const acc = db[account];

      if (!acc) return { success: false, error: 'Account not found.' };
      if (acc.password !== pass) return { success: false, error: 'Incorrect password.' };

      return { success: true, data: acc.data };
    } catch (e) {
      return { success: false, error: 'Corrupted data.' };
    }
  },

  async register(account: string, pass: string): Promise<{ success: boolean; data?: Player; error?: string }> {
    await this.delay(300);

    try {
      const dbStr = localStorage.getItem(ACCOUNTS_KEY);
      let db: AccountDb = dbStr ? JSON.parse(dbStr) : {};

      if (db[account]) return { success: false, error: 'Account already exists.' };

      // Create new player with deep copy
      const newPlayer = JSON.parse(JSON.stringify(INITIAL_PLAYER_STATS));

      db[account] = { password: pass, data: newPlayer };
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(db));

      return { success: true, data: newPlayer };
    } catch (e) {
      return { success: false, error: 'Registration failed.' };
    }
  },

  async save(account: string, data: Player): Promise<boolean> {
    // In a real backend, this would send 'data' to the API/Supabase
    try {
      const dbStr = localStorage.getItem(ACCOUNTS_KEY);
      if (dbStr) {
        const db: AccountDb = JSON.parse(dbStr);
        if (db[account]) {
          db[account].data = data;
          localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(db));
          return true;
        }
      }
      return false;
    } catch (e) {
      console.error("Save failed", e);
      return false;
    }
  },

  // --- Backup Features (Crucial for Web Games without backend) ---

  exportSaveString(account: string): string | null {
    const dbStr = localStorage.getItem(ACCOUNTS_KEY);
    if (!dbStr) return null;
    const db: AccountDb = JSON.parse(dbStr);
    const acc = db[account];
    if (!acc) return null;

    // Create a base64 string of the account data
    try {
        const json = JSON.stringify(acc);
        return btoa(unescape(encodeURIComponent(json))); // Safe base64 encoding
    } catch (e) {
        return null;
    }
  },

  importSaveString(saveString: string): { success: boolean; accountName?: string; error?: string } {
    try {
        const json = decodeURIComponent(escape(atob(saveString)));
        const accData = JSON.parse(json);

        if (!accData.data || !accData.password || !accData.data.name) {
            return { success: false, error: 'Invalid save format.' };
        }

        // We use the player name as the key, or prompt user? 
        // For simplicity, we assume the user remembers their account name or we extract it from the save if we stored it (we didn't store account name inside data, just player name).
        // Let's use the player Name as account name fallback if needed, or ask user.
        // CURRENT IMPLEMENTATION: We merge this into the local DB.
        
        // Since our structure is Account -> Data, and we exported the whole object {password:..., data:...}
        // We need to know the Key. Let's assume the user has to provide the name OR we use the Player Name.
        const key = accData.data.name.toLowerCase().replace(/\s/g, '_') || 'imported_user';

        const dbStr = localStorage.getItem(ACCOUNTS_KEY);
        let db: AccountDb = dbStr ? JSON.parse(dbStr) : {};

        db[key] = accData;
        localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(db));

        return { success: true, accountName: key };

    } catch (e) {
        return { success: false, error: 'Invalid save string.' };
    }
  }
};
