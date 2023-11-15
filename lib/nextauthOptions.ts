// lib/nextauthOptions.ts
import CredentialsProvider from "next-auth/providers/credentials";
// import Providers from "next-auth/providers";
import bcrypt from "bcrypt";
import clientPromise from "./mongodb";
import { AuthOptions } from "next-auth";

export const nextauthOptions: AuthOptions = {
  // Configure one or more authentication providers
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

        //validate password
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
    })
    // Providers.Microsoft({
    //   clientId: process.env.MICROSOFT_ID,
    //   clientSecret: process.env.MICROSOFT_SECRET
    // }),
    // Providers.GitHub({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET
    // }),
  ],
  session: {
    strategy: "jwt",
  },
};
