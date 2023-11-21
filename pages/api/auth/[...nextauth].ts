import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import mongoClientPromise from "../../../lib/mongodb";
import { verifyPassword } from "../../../lib/auth"

/**
 * NextAuth configuration for authentication API endpoint.
 */
export default NextAuth({
  session: {
    maxAge: 30 * 24 * 60 * 60, // Maximum age of the session (in seconds)
    updateAge: 24 * 60 * 60, // Age at which session will be updated (in seconds)
  },

  providers: [
    CredentialsProvider({
      // Your credentials provider configuration
      name: "Credentials",
      credentials: {
        // Define the credentials you expect to receive
        email: { label: "Email", type: "text", placeholder: "john.doe@example.com" }, // Email credential
        password:  {  label: "Password", type: "password" } // Password credential
      },

      /**
       * Authorize function for validating user credentials.
       * @param credentials - User credentials provided during authentication.
       * @returns Promise that resolves to an object containing user information if authentication is successful.
       * @throws Error if credentials are not provided, user is not found, or password is incorrect.
       */
      authorize: async (credentials) => {
        if (!credentials) {
          throw new Error('Credentials not provided');
        }

        const client = await mongoClientPromise;
        const db = client.db();
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ email: credentials.email });

        if (!user) {
          client.close();
          throw new Error('No user found!');
        }

        const isValid = await verifyPassword(credentials.password, user.password);
        if (!isValid) {
          client.close();
          throw new Error('Could not log you in!');
        }

        client.close();
        return { 
          id: user._id.toString(), // Convert MongoDB ObjectId to string
          email: user.email, 
        };
      }
    })
  ],
});
