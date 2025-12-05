import { ServiceContainer } from "./ServiceContainer";
import { ServiceFactory } from "@core/infrastructure/factories/ServiceFactory";
import { ApiClient } from "@core/infrastructure/http/ApiClient";
import { HttpProductRepository } from "@features/products/infrastructure/repositories/HttpProductRepository";
import { CartManagerRepository } from "@features/cart/infrastructure/repositories/CartManagerRepository";

type CacheSystemType = 'local-storage' | 'in-memory';
const DEFAULT_API_URL = "https://itx-frontend-test.onrender.com/api";
const DEFAULT_CACHE_SYSTEM: CacheSystemType = "local-storage";
const DEFAULT_CART_TTL_DAYS = 1;

class ServiceRegistry {
  private static instance: ServiceContainer | null = null;

  static configure(): ServiceContainer {
    if (this.instance) {
      this.instance!.logger.info({ message: "Services already configured. Returning existing instance." });  
      return this.instance;
    }

    const cacheSystem: CacheSystemType = 
      process.env.CACHE_SYSTEM as CacheSystemType || DEFAULT_CACHE_SYSTEM;
    const apiUrl = process.env.API_URL || DEFAULT_API_URL;
    const cartTtlDays = Number(process.env.CART_TTL_DAYS) || DEFAULT_CART_TTL_DAYS;
    const cartTtlMs = cartTtlDays * 24 * 60 * 60 * 1000;
    
    const logger = ServiceFactory.createLogger();
    logger.info({ message: "Configuring services...", context: { cacheSystem, apiUrl, cartTtlDays } });
    const cache = ServiceFactory.createCache(cacheSystem);
    const apiClient = new ApiClient(apiUrl, logger, cache);
    const productRepository = new HttpProductRepository(apiClient);
    const cartRepository = new CartManagerRepository(apiClient, cache, logger, cartTtlMs);

    this.instance = {
      productRepository,
      cartRepository,
      apiClient,
      cache,
      logger,
    };

    return this.instance;
  }

  static reset(): void {
    this.instance = null;
  }
}

export const configureServices = (): ServiceContainer => ServiceRegistry.configure();
export const resetServices = (): void => ServiceRegistry.reset();
