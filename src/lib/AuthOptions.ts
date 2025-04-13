import { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '@/models/user';
import bcrypt from 'bcryptjs';
import dbConnect from './DB';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect();

        const user = await User.findOne({ username: credentials?.username });

        if (!user) throw new Error('Invalid username or password');

        const isPasswordCorrect = await bcrypt.compare(
          credentials!.password,
          user.password
        );

        if (!isPasswordCorrect) throw new Error('Invalid username or password');

        // Return user object to be stored in JWT/session
        return {
          id: user._id,
          name: user.name,
          username: user.username,
          role: user.role,
          storeName: user.storeName,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt', // or 'database' if you want sessions stored in DB
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.username = user.username;
        token.storeName = user.storeName;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.username = token.username;
        session.user.storeName = token.storeName;
      }
      return session;
    },
  },
  pages: {
    signIn: '/', // Your custom login page
  },
  secret: process.env.NEXTAUTH_SECRET,
};
