export interface CachePayload<T> {
  value: T;
  ttlMs: number;
}

export interface ICache {
  get<T>(key: string): T | null;
  set<T>(key: string, payload: CachePayload<T>): void;
  clear(key: string): void;
  clearAll(): void;
}
