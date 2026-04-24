import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { setRequestContext } from '../context/request-context';

/**
 * Middleware to generate or propagate correlation ID for request tracing
 */
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Get or generate correlation ID
    const correlationId =
      (req.headers['x-correlation-id'] as string) ||
      (req.headers['correlation-id'] as string) ||
      randomUUID();

    // Generate request ID
    const requestId = randomUUID();

    // Attach to request headers for easy access
    req.headers['x-correlation-id'] = correlationId;
    req.headers['x-request-id'] = requestId;

    // Store in request context for extractors
    setRequestContext(req, { correlationId, requestId });

    // Add to response headers for client tracing
    res.setHeader('x-correlation-id', correlationId);
    res.setHeader('x-request-id', requestId);

    next();
  }
}
