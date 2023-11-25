// types/next-auth.d.ts
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extend the built-in session types with custom properties, like `roles`.
   */
  interface Session {
    user: {
      roles?: string[];
      // Add any other custom properties you need.
    } & DefaultSession["user"];
  }

  /**
   * Extend the built-in User type from NextAuth to include custom fields.
   */
  interface User {
    roles: string[]; // Use 'roles' as an array of strings
  }
}

declare module "next-auth/jwt" {
  /**
   * Extend the built-in JWT types with custom properties, if needed.
   */
  interface JWT {
    roles?: string[];
  }
}
