// types/next-auth.d.ts
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extend the built-in session types with custom properties, like `role`.
   */
  interface Session {
    user: {
      role?: string;
      // Add any other custom properties you need, like 'name', 'email', 'image'.
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /**
   * Extend the built-in JWT types with custom properties, if needed.
   */
  interface JWT {
    role?: string;
  }
}
