export const API_CONFIG = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333',
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3001',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
} as const;

export const SESSION_CONFIG = {
  SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 horas en milisegundos
  MAX_AGE: 24 * 60 * 60, // 24 horas en segundos para NextAuth
} as const;

export const API_ENDPOINTS = {
  AUTH_LOGIN: '/auth/login',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_ME: '/auth/me',
} as const;

export function getApiUrl(endpoint: string): string {
  return `${API_CONFIG.NEXT_PUBLIC_API_URL}${endpoint}`;
}
