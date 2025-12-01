import { InMemoryCache } from "./InMemoryCache";

describe("InMemoryCache", () => {
  let cache: InMemoryCache;

  beforeEach(() => {
    cache = new InMemoryCache();
  });

  describe("get", () => {
    it("should return null for non-existent key", () => {
      expect(cache.get("non-existent")).toBeNull();
    });

    it("should return null for expired item", () => {
      cache.set("expired", { value: "data", ttlMs: -1000 }); // Ya expirado
      expect(cache.get("expired")).toBeNull();
    });

    it("should clean up expired items automatically", () => {
      cache.set("expired", { value: "data", ttlMs: -1000 });
      cache.get("expired"); // Trigger cleanup
      
      // Verificar que no existe en caché después del get
      expect(cache.get("expired")).toBeNull();
    });
  });

  describe("set and get", () => {
    it("should store and retrieve value", () => {
      const testData = { foo: "bar", num: 123 };
      cache.set("test", { value: testData, ttlMs: 1000 });
      
      expect(cache.get("test")).toEqual(testData);
    });

    it("should store string value", () => {
      cache.set("string", { value: "hello world", ttlMs: 1000 });
      expect(cache.get("string")).toBe("hello world");
    });

    it("should store number value", () => {
      cache.set("number", { value: 42, ttlMs: 1000 });
      expect(cache.get("number")).toBe(42);
    });

    it("should store array value", () => {
      const arr = [1, 2, 3];
      cache.set("array", { value: arr, ttlMs: 1000 });
      expect(cache.get("array")).toEqual(arr);
    });

    it("should store null value", () => {
      cache.set("null-value", { value: null, ttlMs: 1000 });
      expect(cache.get("null-value")).toBeNull();
    });

    it("should overwrite existing key", () => {
      cache.set("key", { value: "first", ttlMs: 1000 });
      cache.set("key", { value: "second", ttlMs: 1000 });
      
      expect(cache.get("key")).toBe("second");
    });
  });

  describe("clear", () => {
    it("should remove specific key", () => {
      cache.set("key1", { value: "data1", ttlMs: 1000 });
      cache.set("key2", { value: "data2", ttlMs: 1000 });
      
      cache.clear("key1");
      
      expect(cache.get("key1")).toBeNull();
      expect(cache.get("key2")).toBe("data2");
    });

    it("should not throw error when clearing non-existent key", () => {
      expect(() => cache.clear("non-existent")).not.toThrow();
    });
  });

  describe("clearAll", () => {
    it("should remove all keys", () => {
      cache.set("key1", { value: "data1", ttlMs: 1000 });
      cache.set("key2", { value: "data2", ttlMs: 1000 });
      cache.set("key3", { value: "data3", ttlMs: 1000 });
      
      cache.clearAll();
      
      expect(cache.get("key1")).toBeNull();
      expect(cache.get("key2")).toBeNull();
      expect(cache.get("key3")).toBeNull();
    });

    it("should work on empty cache", () => {
      expect(() => cache.clearAll()).not.toThrow();
    });
  });

  describe("TTL expiration", () => {
    it("should return value before expiration", () => {
      cache.set("key", { value: "data", ttlMs: 10000 }); // 10 segundos
      expect(cache.get("key")).toBe("data");
    });

    it("should return null after expiration", (done) => {
      cache.set("key", { value: "data", ttlMs: 50 }); // 50ms
      
      setTimeout(() => {
        expect(cache.get("key")).toBeNull();
        done();
      }, 100); // Esperar 100ms
    });

    it("should handle multiple items with different TTLs", (done) => {
      cache.set("short", { value: "expires-soon", ttlMs: 50 });
      cache.set("long", { value: "expires-later", ttlMs: 10000 });
      
      setTimeout(() => {
        expect(cache.get("short")).toBeNull();
        expect(cache.get("long")).toBe("expires-later");
        done();
      }, 100);
    });
  });
});
