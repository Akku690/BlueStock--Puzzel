import { Puzzle, UserProgress, UserStats, SyncQueue } from '@/types';
import {
  savePuzzles,
  saveProgress as saveProgressDB,
  saveStats as saveStatsDB,
  addToSyncQueue,
  getSyncQueue,
  removeSyncQueueItem,
} from '@/utils/db';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.bluestock.com';
const BATCH_SIZE = 5;
const MAX_RETRIES = 3;
const RATE_LIMIT_DELAY = 1000; // 1 second

// Rate limiting
let lastRequestTime = 0;
const requestQueue: Array<() => Promise<unknown>> = [];
let isProcessingQueue = false;

/**
 * Rate-limited API request wrapper
 */
const rateLimitedRequest = async <T>(
  request: () => Promise<T>
): Promise<T> => {
  return new Promise((resolve, reject) => {
    requestQueue.push(async () => {
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime;

      if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
        await new Promise(res => setTimeout(res, RATE_LIMIT_DELAY - timeSinceLastRequest));
      }

      lastRequestTime = Date.now();

      try {
        const result = await request();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });

    processQueue();
  });
};

/**
 * Process request queue
 */
const processQueue = async (): Promise<void> => {
  if (isProcessingQueue || requestQueue.length === 0) {
    return;
  }

  isProcessingQueue = true;

  while (requestQueue.length > 0) {
    const request = requestQueue.shift();
    if (request) {
      await request();
    }
  }

  isProcessingQueue = false;
};

/**
 * Fetch puzzles from API with caching
 */
export const fetchPuzzles = async (startDate: string, endDate: string): Promise<Puzzle[]> => {
  try {
    const response = await rateLimitedRequest(() =>
      fetch(`${API_BASE_URL}/puzzles?start=${startDate}&end=${endDate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch puzzles: ${response.statusText}`);
    }

    const puzzles: Puzzle[] = await response.json();

    // Cache puzzles locally
    await savePuzzles(puzzles);

    return puzzles;
  } catch (error) {
    console.error('Error fetching puzzles:', error);
    throw error;
  }
};

/**
 * Sync user progress to server (batched)
 */
let progressBatch: UserProgress[] = [];

export const syncProgress = async (progress: UserProgress, immediate = false): Promise<void> => {
  // Save to IndexedDB immediately
  await saveProgressDB(progress);

  // Add to batch
  progressBatch.push(progress);

  // Sync if batch is full or immediate flag is set
  if (progressBatch.length >= BATCH_SIZE || immediate) {
    await flushProgressBatch();
  }
};

/**
 * Flush progress batch to server
 */
const flushProgressBatch = async (): Promise<void> => {
  if (progressBatch.length === 0) {
    return;
  }

  const batch = [...progressBatch];
  progressBatch = [];

  try {
    await rateLimitedRequest(() =>
      fetch(`${API_BASE_URL}/progress/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ progress: batch }),
      })
    );
  } catch (error) {
    console.error('Error syncing progress batch:', error);

    // Add to sync queue for retry
    batch.forEach(progress => {
      const queueItem: SyncQueue = {
        id: `progress-${progress.puzzleId}-${Date.now()}`,
        action: 'progress',
        data: progress,
        timestamp: Date.now(),
        retries: 0,
      };
      addToSyncQueue(queueItem);
    });
  }
};

/**
 * Sync user stats to server
 */
export const syncStats = async (stats: UserStats): Promise<void> => {
  // Save to IndexedDB immediately
  await saveStatsDB(stats);

  try {
    await rateLimitedRequest(() =>
      fetch(`${API_BASE_URL}/stats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(stats),
      })
    );
  } catch (error) {
    console.error('Error syncing stats:', error);

    // Add to sync queue for retry
    const queueItem: SyncQueue = {
      id: `stats-${Date.now()}`,
      action: 'stats',
      data: stats,
      timestamp: Date.now(),
      retries: 0,
    };
    await addToSyncQueue(queueItem);
  }
};

/**
 * Process sync queue (retry failed requests)
 */
export const processSyncQueue = async (): Promise<void> => {
  const queue = await getSyncQueue();

  for (const item of queue) {
    if (item.retries >= MAX_RETRIES) {
      console.warn(`Max retries reached for sync item: ${item.id}`);
      await removeSyncQueueItem(item.id);
      continue;
    }

    try {
      const endpoint = item.action === 'progress' ? '/progress/batch' : '/stats';

      await rateLimitedRequest(() =>
        fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(item.action === 'progress' ? { progress: [item.data] } : item.data),
        })
      );

      await removeSyncQueueItem(item.id);
    } catch (error) {
      console.error(`Error processing sync queue item ${item.id}:`, error);

      // Update retry count
      item.retries += 1;
      await addToSyncQueue(item);
    }
  }
};

/**
 * Authenticate user
 */
export const authenticate = async (email: string, password: string): Promise<unknown> => {
  const response = await rateLimitedRequest(() =>
    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })
  );

  if (!response.ok) {
    throw new Error('Authentication failed');
  }

  return await response.json();
};

/**
 * Check online status and sync when coming online
 */
export const setupOnlineSync = (): void => {
  window.addEventListener('online', async () => {
    await flushProgressBatch();
    await processSyncQueue();
  });
};
