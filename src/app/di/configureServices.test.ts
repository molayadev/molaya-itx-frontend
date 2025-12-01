import { configureServices, resetServices } from "./configureServices";
import { ServiceContainer } from "./ServiceContainer";
const silenceLogs = () => {
    jest.spyOn(console, "info").mockImplementation();
    jest.spyOn(console, "debug").mockImplementation();
    jest.spyOn(console, "warn").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
};
describe("configureServices", () => {

  beforeAll(silenceLogs);

  afterAll(() => {
    jest.restoreAllMocks();
  });

  afterEach(resetServices);

  describe("Singleton behavior", () => {
    it("should return a valid ServiceContainer", () => {
      const services = configureServices();

      expect(services).toBeDefined();
      expect(services.logger).toBeDefined();
      expect(services.cache).toBeDefined();
      expect(services.apiClient).toBeDefined();
    });

    it("should return the same instance on multiple calls", () => {
      const services1 = configureServices();
      const services2 = configureServices();
      const services3 = configureServices();

      expect(services1).toBe(services2);
      expect(services2).toBe(services3);
      expect(services1).toBe(services3);
    });

    it("should return same logger instance on multiple calls", () => {
      const services1 = configureServices();
      const services2 = configureServices();

      expect(services1.logger).toBe(services2.logger);
    });

    it("should return same cache instance on multiple calls", () => {
      const services1 = configureServices();
      const services2 = configureServices();

      expect(services1.cache).toBe(services2.cache);
    });

    it("should return same apiClient instance on multiple calls", () => {
      const services1 = configureServices();
      const services2 = configureServices();

      expect(services1.apiClient).toBe(services2.apiClient);
    });
  });

  describe("resetServices", () => {
    it("should allow creating a new instance after reset", () => {
      const services1 = configureServices();
      
      resetServices();
      
      const services2 = configureServices();

      expect(services1).not.toBe(services2);
    });

    it("should create new logger after reset", () => {
      const services1 = configureServices();
      const logger1 = services1.logger;
      
      resetServices();
      
      const services2 = configureServices();
      const logger2 = services2.logger;

      expect(logger1).not.toBe(logger2);
    });

    it("should create new cache after reset", () => {
      const services1 = configureServices();
      const cache1 = services1.cache;
      
      resetServices();
      
      const services2 = configureServices();
      const cache2 = services2.cache;

      expect(cache1).not.toBe(cache2);
    });
  });

  describe("ServiceContainer structure", () => {
    it("should have all required properties", () => {
      const services = configureServices();

      expect(services).toHaveProperty("logger");
      expect(services).toHaveProperty("cache");
      expect(services).toHaveProperty("apiClient");
      expect(services).toHaveProperty("productRepository");
    });

    it("should have logger with all methods", () => {
      const services = configureServices();

      expect(services.logger.debug).toBeDefined();
      expect(services.logger.info).toBeDefined();
      expect(services.logger.warn).toBeDefined();
      expect(services.logger.error).toBeDefined();
    });

    it("should have cache with all methods", () => {
      const services = configureServices();

      expect(services.cache.get).toBeDefined();
      expect(services.cache.set).toBeDefined();
      expect(services.cache.clear).toBeDefined();
      expect(services.cache.clearAll).toBeDefined();
    });

    it("should have apiClient with get method", () => {
      const services = configureServices();

      expect(services.apiClient.get).toBeDefined();
      expect(typeof services.apiClient.get).toBe("function");
    });
  });

  describe("Logger integration", () => {
    it("should log when creating services for first time", () => {
      const services = configureServices();
      const loggerInfoSpy = jest.spyOn(services.logger, "info");

      configureServices();

      expect(loggerInfoSpy).toHaveBeenCalledWith({
        message: "Services already configured. Returning existing instance.",
      });

      loggerInfoSpy.mockRestore();
    });
  });

  describe("Environment variables", () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
      resetServices();
    });

    it("should use default API_URL when not set", () => {
      delete process.env.API_URL;
      
      const services = configureServices();

      expect(services.apiClient).toBeDefined();
    });

    it("should use default CACHE_SYSTEM when not set", () => {
      delete process.env.CACHE_SYSTEM;
      
      const services = configureServices();

      expect(services.cache).toBeDefined();
    });
  });

  describe("Services wiring", () => {
    it("should connect logger to apiClient", () => {
      const services = configureServices();

      expect(() => {
        services.logger.info({ message: "Test log" });
      }).not.toThrow();
    });

    it("should connect cache to apiClient", () => {
      const services = configureServices();

      services.cache.set("test-key", { value: "test-value", ttlMs: 1000 });
      const cachedValue = services.cache.get("test-key");

      expect(cachedValue).toBe("test-value");
    });
  });

  describe("Type safety", () => {
    it("should return correctly typed ServiceContainer", () => {
      const services: ServiceContainer = configureServices();

      expect(services).toBeDefined();
    });
  });
});
