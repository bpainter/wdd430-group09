import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Login - Handcrafted Haven</title>
        <meta name="description" content="Log in to Handcrafted Haven." />
      </Head>
      <h1>Login</h1>
      {/* Login form goes here */}
    </>
  );
}
