import { LocalStorageCache } from "../cache/LocalStorageCache";
import { InMemoryCache } from "../cache/InMemoryCache";
import { ConsoleLogger } from "../logger/ConsoleLogger";
import { ICache } from "../cache/ICache";
import { ILogger } from "../logger/ILogger";

export class ServiceFactory {
  static createCache(type: 'local-storage' | 'in-memory' = 'local-storage'): ICache {
    return type === 'local-storage' ? new LocalStorageCache() : new InMemoryCache();
  }

  static createLogger(): ILogger {
    return new ConsoleLogger();
  }
}
