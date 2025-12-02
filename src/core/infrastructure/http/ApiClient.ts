import { HttpError } from "./HttpError";
import { ICache } from "../cache/ICache";
import { ILogger } from "../logger/ILogger";

const DEFAULT_CACHE_TTL_ONE_HOUR_MS = 3600000;
const DEFAULT_TIMEOUT_MS = 5000;

export interface RequestConfig extends RequestInit {
  timeout?: number;
  cacheTTL?: number;
  isCacheDisabled?: boolean;
}

export interface PostOptions {
  path: string;
  body: unknown;
  config?: RequestConfig;
}

export class ApiClient {
  private defaultTimeout: number;
  private defaultCacheTTL: number;

  constructor(
    private baseUrl: string,
    private logger: ILogger,
    private cache?: ICache
  ) {
    this.defaultTimeout = Number(process.env.API_TIMEOUT) || DEFAULT_TIMEOUT_MS;
    this.defaultCacheTTL =
      Number(process.env.CACHE_TTL) || DEFAULT_CACHE_TTL_ONE_HOUR_MS;
  }

  async get<T>(path: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(path, { ...config, method: "GET" });
  }

  async post<T>({ path, body, config }: PostOptions): Promise<T> {
    return this.request<T>(path, {
      ...config,
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        ...config?.headers,
      },
      isCacheDisabled: true,
    });
  }

  private async request<T>(path: string, config: RequestConfig): Promise<T> {
    const { isCacheDisabled = false, ...fetchConfig } = config;

    const url = `${this.baseUrl}${path}`;
    const method = fetchConfig.method || "GET";
    const useCache: boolean =
      (this.cache && method === "GET" && !isCacheDisabled) || false;

    const cachedResponse = this.getCachedResponse<T>({ url, useCache });
    if (cachedResponse) return cachedResponse;
    this.logger.debug({ message: `Fetching: ${url}`, context: { method } });

    return this.executeRequestCall({ url, useCache, ...config });
  }

  private async executeRequestCall<T>(
    input: { url: string; useCache: boolean } & RequestConfig
  ) {
    const {
      url,
      useCache,
      timeout = this.defaultTimeout,
      cacheTTL = this.defaultCacheTTL,
      ...fetchConfig
    } = input;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      this.handleHttpError(response, url);
      const data = response.status === 204 ? ({} as T) : await response.json();
      this.setResponseCache({ data, url, useCache, cacheTTL });
      return data;

    } catch (error: unknown) {
      clearTimeout(timeoutId);
      const wrappedError =
        this.wrapTimeoutError({ error, timeout, url }) ?? error;
      throw wrappedError;
    }
  }

  private handleHttpError(response: Response, url: string): void {
    if (response?.ok) return;

    const error = new HttpError(response?.status, response?.statusText, url);
    this.logger.error({
      message: `HTTP Error ${response?.status}`,
      context: { url },
      error,
    });
    throw error;
  }

  private setResponseCache<T>(input: {
    data: T;
    url: string;
    useCache: boolean;
    cacheTTL: number;
  }): void {
    const { data, url, useCache, cacheTTL } = input;
    if (!useCache) return;

    this.logger.info({
      message: `Cache SET: ${url}`,
      context: { ttl: cacheTTL },
    });
    this.cache!.set(url, { value: data, ttlMs: cacheTTL });
  }

  private getCachedResponse<T>(cacheTry: {
    url: string;
    useCache: boolean;
  }): T | null {
    const { url, useCache } = cacheTry;

    if (!useCache)return null;

    const cachedResponse = this.cache!.get<T>(url);
    if (!cachedResponse) return null;

    this.logger.info({ message: `Cache HIT: ${url}` });
    return cachedResponse;
  }

  private wrapTimeoutError = (input: {
    error: unknown;
    timeout: number;
    url: string;
  }): Error | null => {
    const { error, timeout, url } = input;
    const isNotAbortError = !(
      error instanceof DOMException && error.name === "AbortError"
    );
    if (isNotAbortError) {
      return null;
    }
    const timeoutError = new Error(
      `Request timeout after ${timeout}ms for ${url}`
    );
    this.logger.error({
      message: "Request timeout",
      context: { url },
      error: timeoutError,
    });
    return timeoutError;
  };
}
