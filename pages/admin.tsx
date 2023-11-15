import Head from 'next/head';
import { useRouter } from 'next/router';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Head>
        <title>Product Details - Handcrafted Haven</title>
        <meta name="description" content="Learn more about our unique handcrafted items." />
      </Head>
      <h1>Product Details: {id}</h1>
      {/* Product details content goes here */}
    </>
  );
}
