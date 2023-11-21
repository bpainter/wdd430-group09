// pages/profiles/index.tsx
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/layout/Header';
import { GetServerSideProps } from 'next';
import mongoClientPromise from '../../lib/mongodb';
import { Product } from '../../types/product';

export const getServerSideProps: GetServerSideProps = async () => {
  const client = await mongoClientPromise;
  const db = client.db();

  const products = await db.collection('products').find({}).toArray();

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
};

interface ProfilesProps {
  products: Product[];
}

/**
 * Renders a page displaying all products.
 * 
 * @param {Object} props - The component props.
 * @param {Array} props.products - The array of products to be displayed.
 * @returns {JSX.Element} The JSX element representing the products page.
 */

export default function Products({ products }: ProfilesProps) {
  return (
    <>
      <Head>
        <title>All Products - Handcrafted Haven</title>
        <meta name="description" content="Discover a wide range of handcrafted items." />
      </Head>
      <Header title="Explore our Handcrafted Products" />
      
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">All products</h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {/* ... TailwindUI Product List Component ... */}
          {products.map((product) => (
            <div key={product._id} className="group relative">
              {/* Product Card Content Here */}
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                {/* Image */}
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <Link className="absolute inset-0" href={`/products/${product._id}`}>
                      {product.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{product.title}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
