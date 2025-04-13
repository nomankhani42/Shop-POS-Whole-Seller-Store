declare module 'next-auth' {
    interface Session {
      user: {
        name: string;
        role: 'owner' | 'shopkeeper';
      };
    }
  
    interface User {
      name: string;
      role: 'owner' | 'shopkeeper';
    }
  }
  
  declare module 'next-auth/jwt' {
    interface JWT {
      role?: 'owner' | 'shopkeeper';
    }
  }
  