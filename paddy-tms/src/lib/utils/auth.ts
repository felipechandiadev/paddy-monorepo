import { getServerSession as getNextAuthServerSession } from 'next-auth/next';

import { authOptions } from './authOptions';
import { ROLES, hasPermission, type Permission, type Role } from './permissions';
import { API_CONFIG } from '../variables';
import type { Session } from 'next-auth';

export async function getServerSession(): Promise<Session | null> {
  try {
    const session = await getNextAuthServerSession(authOptions);
    return session;
  } catch (error) {
    console.error('Error getting server session:', error);
    return null;
  }
}

export async function validateRole(
  requiredRole: Role | Role[],
): Promise<boolean> {
  const session = await getServerSession();

  if (!session?.user?.role) {
    return false;
  }

  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  return roles.includes(session.user.role);
}

export async function validatePermission(
  requiredPermission: Permission,
): Promise<boolean> {
  const session = await getServerSession();

  if (!session?.user?.role) {
    return false;
  }

  return hasPermission(session.user.role, requiredPermission);
}

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const session = await getServerSession();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (session?.accessToken) {
    headers['Authorization'] = `Bearer ${session.accessToken}`;
  }

  return headers;
}

export async function getCurrentUser() {
  const session = await getServerSession();
  return session?.user || null;
}

export function isUserAdmin(role: Role | undefined): boolean {
  return role === ROLES.ADMIN;
}

export function isUserOperator(role: Role | undefined): boolean {
  return role === ROLES.LOGISTICS_OPERATOR;
}

export function isUserConsultant(role: Role | undefined): boolean {
  return role === ROLES.CONSULTANT;
}
