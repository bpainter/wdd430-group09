// lib/nextauthOptions.ts
import NextAuth from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import clientPromise from "./mongodb";
import { AuthOptions } from "next-auth";

/**
 * Configuration options for NextAuth.js authentication.
 */
export const nextauthOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      credentials: {
        email: {
          label: "E-mail",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      /**
       * Authorize function for the CredentialsProvider.
       * Validates the provided credentials and returns the user object if valid.
       * @param credentials - The user's credentials (email and password).
       * @returns The user object if the credentials are valid.
       * @throws Error if the user does not exist or the credentials are invalid.
       */
      async authorize(credentials) {
        const client = await clientPromise;
        const usersCollection = client
          .db(process.env.DB_NAME)
          .collection("users");
        const email = credentials?.email.toLowerCase();
        const user = await usersCollection.findOne({ email });
        if (!user) {
          throw new Error("User does not exist.");
        }

        // Validate password
        const passwordIsValid = await bcrypt.compare(
          credentials?.password!,
          user.password
        );

        if (!passwordIsValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id.toString(),
          ...user,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
};
