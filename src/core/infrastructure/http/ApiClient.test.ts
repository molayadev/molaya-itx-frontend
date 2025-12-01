import { ApiClient } from "./ApiClient";
import { HttpError } from "./HttpError";
import { ILogger } from "../logger/ILogger";
import { ICache } from "../cache/ICache";

const mockLogger: ILogger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

const mockCache: ICache = {
  get: jest.fn(),
  set: jest.fn(),
  clear: jest.fn(),
  clearAll: jest.fn(),
};

describe("ApiClient", () => {
  let client: ApiClient;

  beforeEach(() => {
    jest.clearAllMocks();
    (mockCache.get as jest.Mock).mockReturnValue(null);
    global.fetch = jest.fn();
    client = new ApiClient("https://api.example.com", mockLogger, mockCache);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("GET requests", () => {
    it("should fetch data successfully", async () => {
      const mockData = { id: 1, name: "Product" };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const result = await client.get("/products");

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.example.com/products",
        expect.objectContaining({ method: "GET" })
      );
    });

    it("should log debug message when fetching", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await client.get("/products");

      expect(mockLogger.debug).toHaveBeenCalledWith({
        message: "Fetching: https://api.example.com/products",
        context: { method: "GET" },
      });
    });

    it("should throw HttpError on 4xx response", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      await expect(client.get("/products/999")).rejects.toThrow(HttpError);
      await expect(client.get("/products/999")).rejects.toMatchObject({
        statusCode: 404,
        statusText: "Not Found",
        url: "https://api.example.com/products/999",
      });
    });

    it("should throw HttpError on 5xx response", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      await expect(client.get("/products")).rejects.toThrow(HttpError);
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it("should log error when HTTP error occurs", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 403,
        statusText: "Forbidden",
      });

      try {
        await client.get("/admin");
      } catch {
        expect(mockLogger.error).toHaveBeenCalledWith({
          message: "HTTP Error 403",
          context: { url: "https://api.example.com/admin" },
          error: expect.any(HttpError),
        });
      }
    });

    it("should handle 204 No Content response", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 204,
      });

      const result = await client.get("/delete");

      expect(result).toEqual({});
    });
  });

  describe("Cache behavior", () => {
    it("should check cache before making GET request", async () => {
      const cachedData = { id: 1, name: "Cached Product" };
      (mockCache.get as jest.Mock).mockReturnValue(cachedData);

      const result = await client.get("/products");

      expect(result).toEqual(cachedData);
      expect(global.fetch).not.toHaveBeenCalled();
      expect(mockLogger.info).toHaveBeenCalledWith({
        message: "Cache HIT: https://api.example.com/products",
      });
    });

    it("should cache successful GET responses", async () => {
      (mockCache.get as jest.Mock).mockReturnValue(null);
      const mockData = { id: 1, name: "Product" };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      await client.get("/products");

      expect(mockCache.set).toHaveBeenCalledWith(
        "https://api.example.com/products",
        expect.objectContaining({
          value: mockData,
          ttlMs: expect.any(Number),
        })
      );
    });

    it("should respect custom cacheTTL", async () => {
      (mockCache.get as jest.Mock).mockReturnValue(null);
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await client.get("/products", { cacheTTL: 5000 });

      expect(mockCache.set).toHaveBeenCalledWith(
        "https://api.example.com/products",
        expect.objectContaining({
          ttlMs: 5000,
        })
      );
    });

    it("should skip cache when isCacheDisabled is true", async () => {
      (mockCache.get as jest.Mock).mockReturnValue({ cached: "data" });
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ fresh: "data" }),
      });

      const result = await client.get("/products", { isCacheDisabled: true });

      expect(result).toEqual({ fresh: "data" });
      expect(global.fetch).toHaveBeenCalled();
      expect(mockCache.set).not.toHaveBeenCalled();
    });

    it("should work without cache instance", async () => {
      const clientWithoutCache = new ApiClient("https://api.example.com", mockLogger);
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ data: "test" }),
      });

      const result = await clientWithoutCache.get("/products");

      expect(result).toEqual({ data: "test" });
      expect(mockCache.get).not.toHaveBeenCalled();
      expect(mockCache.set).not.toHaveBeenCalled();
    });
  });

  describe("Timeout handling", () => {
    it("should timeout request after specified time", async () => {
      (global.fetch as jest.Mock).mockImplementation(
        (url, options) =>
          new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              resolve({ ok: true, json: async () => ({}) });
            }, 1000);

            options.signal.addEventListener("abort", () => {
              clearTimeout(timeout);
              reject(new DOMException("The operation was aborted", "AbortError"));
            });
          })
      );

      await expect(client.get("/slow-endpoint", { timeout: 50 })).rejects.toThrow(
        "Request timeout after 50ms"
      );
    });

    it("should log timeout error", async () => {
      (global.fetch as jest.Mock).mockImplementation(
        (url, options) =>
          new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              resolve({ ok: true, json: async () => ({}) });
            }, 1000);

            options.signal.addEventListener("abort", () => {
              clearTimeout(timeout);
              reject(new DOMException("The operation was aborted", "AbortError"));
            });
          })
      );

      try {
        await client.get("/slow", { timeout: 50 });
      } catch {
        expect(mockLogger.error).toHaveBeenCalledWith({
          message: "Request timeout",
          context: { url: "https://api.example.com/slow" },
          error: expect.any(Error),
        });
      }
    });

    it("should clear timeout on successful request", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ data: "test" }),
      });

      const result = await client.get("/products", { timeout: 1000 });

      expect(result).toEqual({ data: "test" });
    });
  });

  describe("Error handling", () => {
    it("should handle network errors", async () => {
      const networkError = new Error("Network failure");
      (global.fetch as jest.Mock).mockRejectedValue(networkError);

      await expect(client.get("/products")).rejects.toThrow("Network failure");
    });

    it("should handle AbortError from timeout", async () => {
      const abortError = new DOMException("The operation was aborted", "AbortError");
      (global.fetch as jest.Mock).mockRejectedValue(abortError);

      await expect(client.get("/products", { timeout: 100 })).rejects.toThrow(
        "Request timeout"
      );
    });
  });
});
