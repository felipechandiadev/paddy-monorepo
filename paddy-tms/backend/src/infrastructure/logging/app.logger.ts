import { Injectable, LoggerService } from '@nestjs/common';

/**
 * Custom Logger Service
 * Puede ser extendido con Winston, Pino o similar en producción
 */
@Injectable()
export class AppLogger implements LoggerService {
  log(message: string, context?: string) {
    console.log(`[${context}] ${message}`);
  }

  error(message: string, trace?: string, context?: string) {
    console.error(`[${context}] ERROR: ${message}`, trace);
  }

  warn(message: string, context?: string) {
    console.warn(`[${context}] WARNING: ${message}`);
  }

  debug(message: string, context?: string) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[${context}] DEBUG: ${message}`);
    }
  }

  verbose(message: string, context?: string) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${context}] VERBOSE: ${message}`);
    }
  }
}
