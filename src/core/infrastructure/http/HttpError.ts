export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly statusText: string,
    public readonly url: string
  ) {
    super(`HTTP ${statusCode}: ${statusText} (${url})`);
    this.name = "HttpError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError);
    }
  }

  get isClientError(): boolean {
    return this.statusCode >= 400 && this.statusCode < 500;
  }

  get isServerError(): boolean {
    return this.statusCode >= 500;
  }
}
