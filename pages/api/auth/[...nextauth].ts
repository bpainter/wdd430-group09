import NextAuth, { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from '../../../lib/mongodb';
import { verifyPassword } from '../../../lib/auth';

/**
 * NextAuth configuration for authentication API.
 *
 * @returns {object} The NextAuth configuration object.
 */
export default NextAuth({
  providers: [
    CredentialsProvider({
      id: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Record<"email" | "password", string> | undefined) {
        if (!credentials) {
          throw new Error("Credentials not provided");
        }
        const client = await connectToDatabase();
        const usersCollection = client.collection('users');
        const user = await usersCollection.findOne({ email: credentials.email });

        if (!user) {
          throw new Error('No user found');
        }

        // Use the verifyPassword function to validate the password
        const passwordIsValid = await verifyPassword(credentials?.password!, user.password);

        if (!passwordIsValid) {
          throw new Error('Incorrect password');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
          roles: user.roles,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT, user: any }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: Session, token: JWT }) {
      session.user = token;
      return session;
    },
    async signIn({ user }) {
      if (user.roles.includes('admin')) {
        return '/admin';  // Redirect admins to the admin dashboard
      } else if (user.roles.includes('artisan')) {
        return `/artisan/${user.id}`;  // Redirect artisans to their profile
      } else {
        return `/profile`;  // Redirect standard users to their profile
      }
    },
  }
});