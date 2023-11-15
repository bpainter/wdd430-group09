import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Signup() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Signup - Handcrafted Haven</title>
        <meta name="description" content="Sign up to Handcrafted Haven." />
      </Head>
      <h1>Sign Up</h1>
      {/* Signup form goes here */}
    </>
  );
}
