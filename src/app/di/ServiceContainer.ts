// import { IProductRepository } from "@features/products/application/ports/IProductRepository";

import { ICache } from "@core/infrastructure/cache";
import { ApiClient } from "@core/infrastructure/http";
import { ILogger } from "@core/infrastructure/logger";

export interface ServiceContainer {
  productRepository: unknown; // IProductRepository
  apiClient: ApiClient;
  cache: ICache;
  logger: ILogger;
}
