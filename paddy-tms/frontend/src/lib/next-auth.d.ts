import { JWT } from 'next-auth/jwt';
import type { User } from 'next-auth';

import { Role } from './permissions';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name?: string;
    role: Role;
    accessToken: string;
  }

  interface Session {
    user: User;
    accessToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: Role;
    accessToken?: string;
    iat?: number;
    exp?: number;
    jti?: string;
  }
}
