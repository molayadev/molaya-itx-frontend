import { ICache, CachePayload } from "./ICache";

interface StoredItem<T> {
  value: T;
  expiry: number;
}

export class LocalStorageCache implements ICache {
  get<T>(key: string): T | null {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    try {
      const item: StoredItem<T> = JSON.parse(itemStr);
      if (Date.now() <= item.expiry) {
        return item.value;
      }

      localStorage.removeItem(key);
    } catch {
      console.debug("Failed to parse cached item for key:", key);
    }
    return null;
  }

  set<T>(key: string, { value, ttlMs }: CachePayload<T>): void {
    try {
      const item: StoredItem<T> = {
        value,
        expiry: Date.now() + ttlMs,
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (e) {
      console.warn("LocalStorage unavailable", e);
    }
  }

  clear(key: string): void {
    localStorage.removeItem(key);
  }

  clearAll(): void {
    localStorage.clear();
  }
}
