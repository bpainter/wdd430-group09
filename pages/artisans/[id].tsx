import Head from 'next/head';
import { useRouter } from 'next/router';

export default function ArtisanProfile() {
  const router = useRouter();
  const { id } = router.query; // Get the dynamic part of the URL

  return (
    <>
      <Head>
        <title>Artisan Profile - Handcrafted Haven</title>
        <meta name="description" content="Explore the unique craftsmanship of our artisans." />
      </Head>
      <h1>Artisan Profile: {id}</h1>
      {/* Artisan profile content goes here */}
    </>
  );
}
