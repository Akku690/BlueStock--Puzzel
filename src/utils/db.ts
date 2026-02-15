import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Puzzle, UserProgress, UserStats, SyncQueue } from '@/types';

interface BlueStockDB extends DBSchema {
  puzzles: {
    key: string;
    value: Puzzle;
    indexes: { 'by-date': string };
  };
  progress: {
    key: string;
    value: UserProgress;
    indexes: { 'by-date': number };
  };
  stats: {
    key: string;
    value: UserStats;
  };
  syncQueue: {
    key: string;
    value: SyncQueue;
    indexes: { 'by-timestamp': number };
  };
}

const DB_NAME = 'bluestock-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<BlueStockDB> | null = null;

export const initDB = async (): Promise<IDBPDatabase<BlueStockDB>> => {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<BlueStockDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Puzzles store
      if (!db.objectStoreNames.contains('puzzles')) {
        const puzzleStore = db.createObjectStore('puzzles', { keyPath: 'id' });
        puzzleStore.createIndex('by-date', 'date');
      }

      // Progress store
      if (!db.objectStoreNames.contains('progress')) {
        const progressStore = db.createObjectStore('progress', { keyPath: 'puzzleId' });
        progressStore.createIndex('by-date', 'timestamp');
      }

      // Stats store
      if (!db.objectStoreNames.contains('stats')) {
        db.createObjectStore('stats', { keyPath: 'id' });
      }

      // Sync queue store
      if (!db.objectStoreNames.contains('syncQueue')) {
        const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
        syncStore.createIndex('by-timestamp', 'timestamp');
      }
    },
  });

  return dbInstance;
};

// Puzzle operations
export const savePuzzle = async (puzzle: Puzzle): Promise<void> => {
  const db = await initDB();
  await db.put('puzzles', puzzle);
};

export const getPuzzle = async (id: string): Promise<Puzzle | undefined> => {
  const db = await initDB();
  return db.get('puzzles', id);
};

export const getPuzzleByDate = async (date: string): Promise<Puzzle | undefined> => {
  const db = await initDB();
  return db.getFromIndex('puzzles', 'by-date', date);
};

export const getAllPuzzles = async (): Promise<Puzzle[]> => {
  const db = await initDB();
  return db.getAll('puzzles');
};

export const savePuzzles = async (puzzles: Puzzle[]): Promise<void> => {
  const db = await initDB();
  const tx = db.transaction('puzzles', 'readwrite');
  await Promise.all(puzzles.map(puzzle => tx.store.put(puzzle)));
  await tx.done;
};

// Progress operations
export const saveProgress = async (progress: UserProgress): Promise<void> => {
  const db = await initDB();
  await db.put('progress', progress);
};

export const getProgress = async (puzzleId: string): Promise<UserProgress | undefined> => {
  const db = await initDB();
  return db.get('progress', puzzleId);
};

export const getAllProgress = async (): Promise<UserProgress[]> => {
  const db = await initDB();
  return db.getAll('progress');
};

// Stats operations
export const saveStats = async (stats: UserStats): Promise<void> => {
  const db = await initDB();
  await db.put('stats', { ...stats, id: 'user-stats' } as any);
};

export const getStats = async (): Promise<UserStats | undefined> => {
  const db = await initDB();
  const result = await db.get('stats', 'user-stats');
  return result as UserStats | undefined;
};

// Sync queue operations
export const addToSyncQueue = async (item: SyncQueue): Promise<void> => {
  const db = await initDB();
  await db.put('syncQueue', item);
};

export const getSyncQueue = async (): Promise<SyncQueue[]> => {
  const db = await initDB();
  return db.getAll('syncQueue');
};

export const removeSyncQueueItem = async (id: string): Promise<void> => {
  const db = await initDB();
  await db.delete('syncQueue', id);
};

export const clearSyncQueue = async (): Promise<void> => {
  const db = await initDB();
  await db.clear('syncQueue');
};

// Cleanup old data (keep only last 30 days)
export const cleanupOldData = async (): Promise<void> => {
  const db = await initDB();
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

  const tx = db.transaction(['puzzles', 'progress'], 'readwrite');
  const puzzles = await tx.objectStore('puzzles').getAll();
  const progress = await tx.objectStore('progress').getAll();

  // Remove old puzzles
  for (const puzzle of puzzles) {
    const puzzleDate = new Date(puzzle.date).getTime();
    if (puzzleDate < thirtyDaysAgo) {
      await tx.objectStore('puzzles').delete(puzzle.id);
    }
  }

  // Remove old progress
  for (const prog of progress) {
    if (prog.timestamp < thirtyDaysAgo) {
      await tx.objectStore('progress').delete(prog.puzzleId);
    }
  }

  await tx.done;
};
