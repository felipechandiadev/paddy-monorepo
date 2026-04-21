import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
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
      uuidv4();

    // Generate request ID
    const requestId = uuidv4();

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
