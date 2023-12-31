import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import connectToDatabase from '../lib/mongodb';
import { ObjectId } from 'mongodb';
import Header from '@/components/layout/Header';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Add a type for the props
type ProfileProps = {
  user: any; // Define a more specific type based on your user model
};

/**
 * Retrieves the server-side props for the admin page.
 * 
 * @param context - The server-side props context.
 * @returns An object containing the server-side props.
 */
export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const client = await connectToDatabase();
  const usersCollection = client.collection('users');
  const user = await usersCollection.findOne({ _id: new ObjectId(session.user.id) });

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
    },
  };
}

export default function Admin({ user }: ProfileProps) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Admin - Handcrafted Haven</title>
        <meta name="description" content="Learn more about our unique handcrafted items." />
      </Head>
      <Header title="Admin Dashboard" />
      
      <div>
        <p>Name: {user?.profile.name}</p>
        <p>Bio: {user?.profile.bio}</p>
        <p>Location: {user?.profile.location}</p>
      </div>
    </>
  );
}
