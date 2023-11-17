import Head from 'next/head';

export default function Products() {
  return (
    <>
      <Head>
        <title>All Products - Handcrafted Haven</title>
        <meta name="description" content="Discover a wide range of handcrafted items." />
      </Head>
      <h1 className="text-xl font-bold">Explore Our Products</h1>
      {/* Products listing content goes here */}
    </>
  );
}
