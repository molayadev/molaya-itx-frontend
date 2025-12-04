export interface LogEntry {
  message: string;
  context?: Record<string, unknown>;
  error?: Error | unknown;
}

export interface ILogger {
  debug(entry: LogEntry): void;
  info(entry: LogEntry): void;
  warn(entry: LogEntry): void;
  error(entry: LogEntry): void;
}
