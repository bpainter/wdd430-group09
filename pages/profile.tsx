import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import connectToDatabase from '../lib/mongodb';
import { ObjectId } from 'mongodb';
import Header from '@/components/layout/Header';
import Head from 'next/head';

// Add a type for the props
type ProfileProps = {
  user: any;
};

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
};


export default function Profile({ user }: ProfileProps) {
  return (
    <>
      <Head>
        <title>Profile</title>
        <meta name="description" content={`${user?.username}'s Profile.`} />
      </Head>
      <Header title={`${user?.username}'s Profile`} />
      <div>
        <p>Name: {user?.profile.name}</p>
        <p>Bio: {user?.profile.bio}</p>
        <p>Location: {user?.profile.location}</p>
      </div>
    </>
  );
}

