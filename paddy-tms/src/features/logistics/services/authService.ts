import { AuthUser } from '../types/logistics.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Guarda el token en una cookie accesible desde el cliente
 */
const saveAuthToken = (token: string): void => {
  document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;
};

/**
 * Obtiene el token almacenado en las cookies
 */
export const getAuthToken = (): string | null => {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'auth_token') {
      return value;
    }
  }
  return null;
};

/**
 * Limpia el token de las cookies
 */
const clearAuthToken = (): void => {
  document.cookie = 'auth_token=; path=/; max-age=0';
};

export const validateAuth = async (): Promise<AuthUser | null> => {
  try {
    const token = getAuthToken();
    if (!token) {
      return null;
    }

    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      clearAuthToken();
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Auth validation failed:', error);
    clearAuthToken();
    return null;
  }
};

export const login = async (email: string, password: string): Promise<AuthUser> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.statusText}`);
  }

  const data = await response.json();
  
  // Guardar el token en cookie si viene en la respuesta
  if (data.token) {
    saveAuthToken(data.token);
  }
  
  // Si el backend devuelve el token en un header, también lo guardamos
  const authHeader = response.headers.get('authorization');
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    saveAuthToken(token);
  }

  return data;
};

export const logout = async (): Promise<void> => {
  clearAuthToken();
  
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const hasPermission = (user: AuthUser | null, permission: string): boolean => {
  return user?.permissions.includes(permission) ?? false;
};

export const hasRole = (user: AuthUser | null, role: string): boolean => {
  return user?.role === role;
};

export const isAdmin = (user: AuthUser | null): boolean => {
  return hasRole(user, 'admin');
};

export const isOperator = (user: AuthUser | null): boolean => {
  return hasRole(user, 'operator');
};

export const isViewer = (user: AuthUser | null): boolean => {
  return hasRole(user, 'viewer');
};
