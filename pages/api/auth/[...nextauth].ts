import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "../../../lib/mongodb";
import clientPromise from "../../../lib/mongodb";
import { verifyPassword } from "../../../lib/auth"

export default NextAuth({
  session: {
    maxAge: 30 * 24 * 60 * 60, 
    updateAge: 24 * 60 * 60,
  },

  providers: [
    CredentialsProvider({
      // Your credentials provider configuration
      name: "Credentials",
      credentials: {
        // Define the credentials you expect to receive
        email: { label: "Email", type: "text", placeholder: "john.doe@example.com" },
        password:  {  label: "Password", type: "password" }
      },

      authorize: async (credentials) => {
        if (!credentials) {
          throw new Error('Credentials not provided');
        }

        const client = await clientPromise;
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
