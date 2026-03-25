/**
 * Simple JSON-based Database
 * For AI FutureForge - stores data in JSON files
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataDir = join(__dirname, '..', '..', 'data');

// Ensure data directory exists
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

const files = {
  profiles: join(dataDir, 'profiles.json'),
  simulations: join(dataDir, 'simulations.json'),
  battles: join(dataDir, 'battles.json'),
  roadmaps: join(dataDir, 'roadmaps.json'),
  chatSessions: join(dataDir, 'chat_sessions.json'),
  settings: join(dataDir, 'settings.json')
};

function readJson(filename) {
  try {
    if (existsSync(filename)) {
      const data = readFileSync(filename, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
}

function writeJson(filename, data) {
  try {
    writeFileSync(filename, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
}

// In-memory cache
const db = {
  profiles: readJson(files.profiles),
  simulations: readJson(files.simulations),
  battles: readJson(files.battles),
  roadmaps: readJson(files.roadmaps),
  chatSessions: readJson(files.chatSessions),
  settings: readJson(files.settings)
};

let counters = {
  profiles: db.profiles.length > 0 ? Math.max(...db.profiles.map(p => p.id)) : 0,
  simulations: db.simulations.length > 0 ? Math.max(...db.simulations.map(s => s.id)) : 0,
  battles: db.battles.length > 0 ? Math.max(...db.battles.map(b => b.id)) : 0,
  roadmaps: db.roadmaps.length > 0 ? Math.max(...db.roadmaps.map(r => r.id)) : 0,
  chatSessions: db.chatSessions.length > 0 ? Math.max(...db.chatSessions.map(c => c.id)) : 0
};

// Auto-save function
function autoSave(collection) {
  writeJson(files[collection], db[collection]);
}

export function initDatabase() {
  console.log('✅ Database initialized (JSON storage)');
}

export function closeDatabase() {
  // Save all data before closing
  Object.keys(files).forEach(key => {
    const singular = key.replace(/s$/, '');
    autoSave(key);
  });
}

// Profile operations
export const profileDB = {
  getLatest: () => db.profiles.length > 0 ? db.profiles[db.profiles.length - 1] : null,
  
  create: (data) => {
    counters.profiles++;
    const profile = {
      id: counters.profiles,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    db.profiles.push(profile);
    autoSave('profiles');
    return profile;
  },
  
  update: (id, data) => {
    const index = db.profiles.findIndex(p => p.id === id);
    if (index !== -1) {
      db.profiles[index] = { ...db.profiles[index], ...data, updated_at: new Date().toISOString() };
      autoSave('profiles');
      return db.profiles[index];
    }
    return null;
  }
};

// Simulation operations
export const simulationDB = {
  getAll: (limit = 10) => [...db.simulations].reverse().slice(0, limit),
  
  create: (data) => {
    counters.simulations++;
    const simulation = {
      id: counters.simulations,
      ...data,
      created_at: new Date().toISOString()
    };
    db.simulations.push(simulation);
    autoSave('simulations');
    return simulation;
  },
  
  getById: (id) => db.simulations.find(s => s.id === id)
};

// Battle operations
export const battleDB = {
  getAll: (limit = 10) => [...db.battles].reverse().slice(0, limit),
  
  create: (data) => {
    counters.battles++;
    const battle = {
      id: counters.battles,
      ...data,
      created_at: new Date().toISOString()
    };
    db.battles.push(battle);
    autoSave('battles');
    return battle;
  }
};

// Roadmap operations
export const roadmapDB = {
  getAll: (limit = 10) => [...db.roadmaps].reverse().slice(0, limit),
  
  create: (data) => {
    counters.roadmaps++;
    const roadmap = {
      id: counters.roadmaps,
      ...data,
      created_at: new Date().toISOString()
    };
    db.roadmaps.push(roadmap);
    autoSave('roadmaps');
    return roadmap;
  }
};

// Chat session operations
export const chatDB = {
  getAll: (limit = 20) => [...db.chatSessions].reverse().slice(0, limit),
  
  create: (data) => {
    counters.chatSessions++;
    const session = {
      id: counters.chatSessions,
      ...data,
      created_at: new Date().toISOString()
    };
    db.chatSessions.push(session);
    autoSave('chatSessions');
    return session;
  }
};

// Settings operations
export const settingsDB = {
  get: (key) => db.settings.find(s => s.key === key)?.value,
  
  set: (key, value) => {
    const index = db.settings.findIndex(s => s.key === key);
    if (index !== -1) {
      db.settings[index].value = value;
    } else {
      db.settings.push({ key, value, updated_at: new Date().toISOString() });
    }
    autoSave('settings');
  }
};

// Export default db interface for backward compatibility
export default {
  profiles: db.profiles,
  simulations: db.simulations,
  battles: db.battles,
  roadmaps: db.roadmaps,
  chatSessions: db.chatSessions,
  settings: db.settings,
  
  prepare: (query) => {
    // Simple query executor for compatibility
    return {
      get: (...params) => {
        const table = query.split('FROM')[1]?.trim().split(' ')[0]?.replace(/profile/gi, 'profiles')
          .replace(/simulation/gi, 'simulations')
          .replace(/battle/gi, 'battles')
          .replace(/roadmap/gi, 'roadmaps')
          .replace(/chat_session/gi, 'chatSessions') || 'profiles';
        
        if (query.toLowerCase().includes('select *') && query.toLowerCase().includes('order by')) {
          const data = [...(db[table] || [])].reverse();
          const limit = parseInt(query.match(/LIMIT (\d+)/)?.[1]) || data.length;
          return data.slice(0, limit);
        }
        
        if (query.toLowerCase().includes('last_insert_rowid')) {
          return { lastInsertRowid: counters[table] || 1 };
        }
        
        return db[table]?.[0] || null;
      },
      run: (...params) => {
        // Extract table from INSERT statement
        const insertMatch = query.match(/INSERT INTO (\w+)/i);
        if (insertMatch) {
          const table = insertMatch[1].toLowerCase();
          const singular = table.replace(/s$/, '');
          counters[singular] = (counters[singular] || 0) + 1;
          
          const newRecord = { id: counters[singular] };
          params.forEach((p, i) => {
            const fields = query.match(/\(([^)]+)\)/g)?.[1]?.split(',').map(f => f.trim()) || [];
            if (fields[i]) {
              newRecord[fields[i].replace(/['"]/g, '')] = p;
            }
          });
          
          if (db[table]) {
            db[table].push({ ...newRecord, created_at: new Date().toISOString() });
            autoSave(table);
          }
          
          return { lastInsertRowid: counters[singular] };
        }
        
        return { changes: 0 };
      }
    };
  }
};
