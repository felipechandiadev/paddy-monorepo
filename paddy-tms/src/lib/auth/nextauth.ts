import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { API_CONFIG, SESSION_CONFIG, API_ENDPOINTS, getApiUrl } from '../variables';
import type { User } from 'next-auth';

interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name?: string;
    role: string;
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'user@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email y password son requeridos');
        }

        try {
          const loginUrl = getApiUrl(API_ENDPOINTS.AUTH_LOGIN);

          const response = await fetch(loginUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
              errorData.message || `Error de autenticación: ${response.status}`,
            );
          }

          const data: LoginResponse = await response.json();

          const user: User = {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role as any,
            accessToken: data.accessToken,
          };

          return user;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Error desconocido en autenticación';
          console.error('Auth error:', errorMessage);
          throw new Error(errorMessage);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as any;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: SESSION_CONFIG.MAX_AGE,
    updateAge: 24 * 60 * 60, // Actualizar cada 24 horas
  },
  jwt: {
    secret: API_CONFIG.NEXTAUTH_SECRET,
    maxAge: SESSION_CONFIG.MAX_AGE,
  },
  secret: API_CONFIG.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
