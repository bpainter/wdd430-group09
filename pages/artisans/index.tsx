import Header from '@/components/layout/Header';
import Head from 'next/head';

export default function Artisans() {
  return (
    <>
      <Head>
        <title>All Artisans - Handcrafted Haven</title>
        <meta name="description" content="Get to know our artisans." />
      </Head>
      <Header title="Meet our Artisans" />
      {/* Artisan listing content goes here */}
    </>
  );
}
