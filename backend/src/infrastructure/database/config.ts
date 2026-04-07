import * as Joi from 'joi';

/**
 * Validación de variables de entorno usando Joi
 * Se ejecuta al iniciar la aplicación
 */
export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  PORT: Joi.number().default(3000),

  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().default('15m'),

  NEXTAUTH_SECRET: Joi.string().required(),
  NEXTAUTH_URL: Joi.string().uri(),
  NEXTAUTH_DEBUG: Joi.boolean().default(false),

  APP_URL: Joi.string().uri().required(),
  FRONTEND_URL: Joi.string().uri().required(),
});
