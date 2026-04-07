import { NestFactory } from '@nestjs/core';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';
import { AuditInterceptor } from './shared/interceptors/audit.interceptor';
import { AuditService } from './modules/audit/application/audit.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS - Permitir múltiples orígenes según el ambiente
  const allowedOrigins = [
    'http://localhost:3001',
    'http://localhost:3000',
    process.env.FRONTEND_URL,
    'https://paddy-frontend-omega.vercel.app',
  ].filter(Boolean);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Mantener /health fuera del prefijo para checks de infraestructura.
  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Filtros globales
  app.useGlobalFilters(new HttpExceptionFilter());

  // Interceptores globales - Orden importa: Audit primero, Transform después
  const auditService = app.get(AuditService);
  app.useGlobalInterceptors(new AuditInterceptor(auditService));
  app.useGlobalInterceptors(new TransformInterceptor());

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Paddy Backend running on http://localhost:${port}`);
  console.log(`📚 API Documentation available at http://localhost:${port}/api/v1`);
}

bootstrap();
