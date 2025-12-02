import { ServiceContainer } from "./ServiceContainer";
import { ServiceFactory } from "@core/infrastructure/factories/ServiceFactory";
import { ApiClient } from "@core/infrastructure/http/ApiClient";
import { HttpProductRepository } from "@features/products/infrastructure/repositories/HttpProductRepository";

type CacheSystemType = 'local-storage' | 'in-memory';
const DEFAULT_API_URL = "https://itx-frontend-test.onrender.com/api";
const DEFAULT_CACHE_SYSTEM: CacheSystemType = "local-storage";
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
    const logger = ServiceFactory.createLogger();
    logger.info({ message: "Configuring services...", context: { cacheSystem, apiUrl } });
    const cache = ServiceFactory.createCache(cacheSystem);
    const apiClient = new ApiClient(apiUrl, logger, cache);
    const productRepository = new HttpProductRepository(apiClient);

    this.instance = {
      productRepository,
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
