import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * HTTP Exception Filter - Maneja todas las excepciones HTTP de la aplicación
 * Formatea errores en: { success: false, message, error, statusCode, timestamp }
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger('HttpException');

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;
    const message = exceptionResponse.message || exception.message;

    this.logger.error(`[${status}] ${message}`, exception.stack);

    response.status(status).json({
      success: false,
      message,
      error: exceptionResponse.error || 'Internal Server Error',
      statusCode: status,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Catch-All Exception Filter - Maneja cualquier error no capturado
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger = new Logger('AllExceptions');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception instanceof Error ? exception.message : 'Internal Server Error';

    this.logger.error(message, exception instanceof Error ? exception.stack : '');

    response.status(status).json({
      success: false,
      message,
      error: 'Internal Server Error',
      statusCode: status,
      timestamp: new Date().toISOString(),
    });
  }
}
