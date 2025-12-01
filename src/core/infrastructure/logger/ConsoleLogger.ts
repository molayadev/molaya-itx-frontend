import { ILogger, LogEntry } from "./ILogger";

export class ConsoleLogger implements ILogger {
  debug({ message, context }: LogEntry): void {
    console.debug(`%c[DEBUG] ${message}`, 'color: gray', context || '');
  }
  
  info({ message, context }: LogEntry): void {
    console.info(`%c[INFO] ${message}`, 'color: #007acc', context || '');
  }
  
  warn({ message, context }: LogEntry): void {
    console.warn(`%c[WARN] ${message}`, 'color: orange', context || '');
  }
  
  error({ message, context, error }: LogEntry): void {
    console.error(`%c[ERROR] ${message}`, 'color: red', context || '');
    if (error) console.error(error);
  }
}
