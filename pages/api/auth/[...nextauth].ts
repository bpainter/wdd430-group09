import NextAuth, { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from '../../../lib/auth';
import clientPromise from '../../../lib/mongodb';

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
      async authorize(credentials: any) {
        const client = await clientPromise;
        const usersCollection = client.db().collection('users');
        const user = await usersCollection.findOne({ email: credentials.email });

        if (!user) {
          client.close()
          throw new Error('No user found')
        }

        const isValid = await verifyPassword(credentials.password, user.password)

        if (!isValid) {
          client.close()
          throw new Error('Incorrect password')
        }

        client.close()

        return {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
          role: user.role,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT, user: any }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.username = user.username
        token.role = user.role
      }
      return token
    },
    async session({ session, token }: { session: Session, token: JWT }) {
      session.user = token
      return session
    },
  },
})