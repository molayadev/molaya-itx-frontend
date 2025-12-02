import { IProductRepository } from "@features/products/application/ports/IProductRepository";
import { ICartRepository } from "@features/cart/application/ports/ICartRepository";
import { ICache } from "@core/infrastructure/cache";
import { ApiClient } from "@core/infrastructure/http";
import { ILogger } from "@core/infrastructure/logger";

export interface ServiceContainer {
  productRepository: IProductRepository;
  cartRepository: ICartRepository;
  apiClient: ApiClient;
  cache: ICache;
  logger: ILogger;
}
