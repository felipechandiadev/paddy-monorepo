import { AuthUser } from '../types/logistics.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const validateAuth = async (): Promise<AuthUser | null> => {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Auth validation failed:', error);
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

  return response.json();
};

export const logout = async (): Promise<void> => {
  await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
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
