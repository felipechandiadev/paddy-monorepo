'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';

export async function getSessionAction() {
  const session = await getServerSession(authOptions);
  return session;
}

export async function getAuthTokenAction(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.accessToken ?? null;
}

export async function getCurrentUserAction() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}
