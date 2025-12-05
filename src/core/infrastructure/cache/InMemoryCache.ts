import { ICache, CachePayload } from "./ICache";

interface StoredItem<T> {
  value: T;
  expiry: number;
}

export class InMemoryCache implements ICache {
  private cache: Map<string, StoredItem<unknown>> = new Map();

  get<T>(key: string): T | null {
    const item = this.cache.get(key) as StoredItem<T> | undefined;
    
    if (!item) {
      return null;
    }

    // Verificar expiración
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  set<T>(key: string, { value, ttlMs }: CachePayload<T>): void {
    const item: StoredItem<T> = {
      value,
      expiry: Date.now() + ttlMs,
    };
    
    this.cache.set(key, item as StoredItem<unknown>);
  }

  clear(key: string): void {
    this.cache.delete(key);
  }

  clearAll(): void {
    this.cache.clear();
  }
}
