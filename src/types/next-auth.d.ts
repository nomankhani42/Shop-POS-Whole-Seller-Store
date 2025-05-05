// types/next-auth.d.ts
// import NextAuth from 'next-auth';

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

// ❌ REMOVE this part:
// declare module "next-auth/jwt" {
//   interface JWT {
//     id: string;
//     role: "owner" | "shopkeeper";
//     username: string;
//     storeName: string;
//   }
// }
