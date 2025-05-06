// types/next-auth.d.ts (or anywhere in your project with proper module resolution)
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      username: string;
      role: 'owner' | 'shopkeeper';
      storeName: string;
    };
  }

  interface User {
    id: string;
    name: string;
    username: string;
    role: 'owner' | 'shopkeeper';
    storeName: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    username: string;
    role: 'owner' | 'shopkeeper';
    storeName: string;
  }
}
