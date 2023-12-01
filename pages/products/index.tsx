// pages/products/index.tsx
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/layout/Header';
import Pagination from '../../components/elements/Pagination';
import { GetServerSideProps } from 'next';
import connectToDatabase from '../../lib/mongodb';
import { Product } from '../../types/product';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const page = context.query.page ? parseInt(context.query.page as string) : 1;
  const perPage = 20;
  const db = await connectToDatabase(); 
  const totalProducts = await db.collection('products').countDocuments();
  const totalPages = Math.ceil(totalProducts / perPage);
  const products = await db.collection('products').find({})
    .skip((page - 1) * perPage)
    .limit(perPage)
    .toArray();

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      page,
      totalPages,
    },
  };
};

interface ProfilesProps {
  products: Product[];
  page: number;
  totalPages: number;
}

/**
 * Renders a page displaying all products.
 * 
 * @param {Object} props - The component props.
 * @param {Array} props.products - The array of products to be displayed.
 * @returns {JSX.Element} The JSX element representing the products page.
 */

export default function Products({ products, page, totalPages }: ProfilesProps) {
  return (
    <>
      <Head>
        <title>All Products - Handcrafted Haven</title>
        <meta name="description" content="Discover a wide range of handcrafted items." />
      </Head>
      <Header title="Explore our Handcrafted Products" />
      
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">All products</h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 mt-4">
          {/* ... TailwindUI Product List Component ... */}
          {products.map((product) => (
            <div key={product._id} className="group relative">
              {/* Product Card Content Here */}
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  layout="fill"
                  objectFit="cover"
                  className="w-full h-full object-center object-cover lg:w-full lg:h-full overflow-hidden rounded-md" />
              </div>
              <div className="flex justify-between mt-2">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <Link href={`/products/${product._id}`}>
                      <span aria-hidden="true" className="absolute inset-0"></span>
                      {product.title}
                    </Link>
                  </h3>
                </div>
                <p className="text-sm font-medium text-gray-900">${product.price}</p>
              </div>
              <p className="text-sm text-gray-500">
                {product.categories.map((category, index) => (
                  <span key={index}>{category}</span>
                ))}
              </p>
            </div>
          ))}
        </div>        
      </div>
      <Pagination currentPage={page} totalPages={totalPages} />
    </>
  );
}
