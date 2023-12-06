// pages/artisans/[id].tsx
import { Product } from '../../types/product';
import { Review } from '../../types/review';
import { User } from '../../types/user';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import connectToDatabase from '../../lib/mongodb';
import { ObjectId } from 'mongodb';
import Link from 'next/link';
import Image from 'next/image';

console.log('Artisan detail page loaded');

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log('getServerSideProps called');
  const db = await connectToDatabase();
  const id = context.params?.id;

  console.log(`Fetching reviews for id: ${id}`);

  if (!id || typeof id !== 'string') {
    console.log('Invalid id parameter');
    return {
      notFound: true,
    };
  }

  let artisan;
  let products: Product[] = [];
  // Get the artisan with the given id from the database
  try {
    artisan = await db.collection('users').findOne({ _id: new ObjectId(id) });
    console.log(`Fetched artisan: ${JSON.stringify(artisan)}`);
  } catch (error) {
    console.error(`Error fetching artisan: ${error}`);
  }

  // Fetch products for the artisan
  try {
    products = (await db.collection('products').find({ artisan: new ObjectId(id) }).toArray()).map((product) => product as unknown as Product);
    console.log(`Fetched products: ${JSON.stringify(products)}`);
  } catch (error) {
    console.error(`Error fetching products: ${error}`);
  }

  return {
    props: {
      artisan: JSON.parse(JSON.stringify(artisan)),
      products: JSON.parse(JSON.stringify(products)),
    },
  };


};

interface ArtisanDetailProps {
  artisan: User;
  products: Product[];
}

export default function ArtisanDetail({ artisan, products }: ArtisanDetailProps) {
  return (
    <>
      <Head>
        <title>{artisan.profile.name} | Handcrafted Haven</title>
        <meta name="description" content={`Handcrafted Haven artisan ${artisan.profile.name}`} />
      </Head>

      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="flex items-center">
          <div className="w-64 h-64 overflow-hidden rounded">
            <Image src={artisan.profile.avatar} alt={artisan.profile.name} width={200} height={200} />
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold">{artisan.profile.name}</h2>
            <p>{artisan.profile.location}</p>
            <p>{artisan.profile.bio}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold mb-4">Products</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 mt-4">
            {products.map((product) => (
              <div key={product._id} className="group relative">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                  <Image src={product.images[0]} alt={product.title} layout="fill"
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
        ) : (
          <div className="border-dotted border-2 border-gray-300 rounded w-full min-h-[200px] flex items-center justify-center">
            <p className="text-gray-500">No products found.</p>
          </div>
        )}
      </section>
    </>
  );
};