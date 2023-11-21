// pages/index.tsx
import Head from 'next/head';
import Header from '../components/layout/Header';

export default function Home() {
  return (
    <>
      <Head>
        <title>Handcrafted Haven - Home</title>
        <meta name="description" content="Discover and purchase unique handcrafted items" />
      </Head>
      <Header title="Welcome to Handcrafted Haven" />
      
      {/* Content */}
    </>
  );
}