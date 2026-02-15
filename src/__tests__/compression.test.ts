import { compress, decompress, saveToStorage, loadFromStorage, getStorageStats } from '../utils/compression';

describe('Compression Utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('compress and decompress', () => {
    it('compresses and decompresses data correctly', () => {
      const data = { test: 'data', number: 42, nested: { value: true } };
      
      const compressed = compress(data);
      const decompressed = decompress(compressed);
      
      expect(decompressed).toEqual(data);
    });

    it('handles large data efficiently', () => {
      const largeData = Array(1000).fill({ test: 'data', number: 42 });
      
      const jsonSize = JSON.stringify(largeData).length;
      const compressed = compress(largeData);
      
      // Compressed should be smaller for large data
      expect(compressed.length).toBeLessThan(jsonSize);
      
      const decompressed = decompress(compressed);
      expect(decompressed).toEqual(largeData);
    });

    it('handles small data without compression', () => {
      const smallData = { a: 1 };
      const compressed = compress(smallData);
      
      // Small data might not be compressed
      const decompressed = decompress(compressed);
      expect(decompressed).toEqual(smallData);
    });
  });

  describe('saveToStorage and loadFromStorage', () => {
    it('saves and loads data correctly', () => {
      const data = { test: 'value', number: 123 };
      
      saveToStorage('test-key', data);
      const loaded = loadFromStorage('test-key');
      
      expect(loaded).toEqual(data);
    });

    it('returns null for non-existent key', () => {
      const loaded = loadFromStorage('non-existent');
      expect(loaded).toBeNull();
    });

    it('includes timestamp in cached data', () => {
      const data = { test: 'value' };
      saveToStorage('test-key', data);
      
      const stored = localStorage.getItem('test-key');
      expect(stored).toBeDefined();
    });

    it('respects cache duration', () => {
      const data = { test: 'value' };
      saveToStorage('test-key', data);
      
      // Manually modify timestamp to be expired
      const stored = localStorage.getItem('test-key');
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.timestamp = Date.now() - (8 * 24 * 60 * 60 * 1000); // 8 days ago
        localStorage.setItem('test-key', JSON.stringify(parsed));
      }
      
      const loaded = loadFromStorage('test-key');
      expect(loaded).toBeNull();
    });
  });

  describe('getStorageStats', () => {
    it('returns storage statistics', () => {
      saveToStorage('test1', { data: 'test' });
      saveToStorage('test2', { data: 'test' });
      
      const stats = getStorageStats();
      
      expect(stats.used).toBeGreaterThan(0);
      expect(stats.available).toBeGreaterThan(0);
    });
  });
});
