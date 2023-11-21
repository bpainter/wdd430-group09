import { GetServerSidePropsContext } from 'next';
import { getSession } from "next-auth/react";
import Head from 'next/head';
import Header from '../components/layout/Header';
import { useRouter } from 'next/router';

/**
 * Retrieves the server-side props for the admin page.
 * 
 * @param context - The server-side props context.
 * @returns An object containing the server-side props.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession({ req: context.req });

  if (!session || !session.user || session.user.role !== 'admin') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default function ProductDetail() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Admin - Handcrafted Haven</title>
        <meta name="description" content="Learn more about our unique handcrafted items." />
      </Head>
      <Header title="Admin Dashboard" />
      
      {/* Content */}
    </>
  );
}
