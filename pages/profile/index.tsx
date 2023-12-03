import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import connectToDatabase from '../../lib/mongodb';
import { ObjectId } from 'mongodb';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const client = await connectToDatabase();
  const usersCollection = client.collection('users');
  const productsCollection = client.collection('products');
  const user = await usersCollection.findOne({ _id: new ObjectId(session.user.id) });
  const products = await productsCollection.find({ userId: new ObjectId(session.user.id) }).toArray();


  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
      products: JSON.parse(JSON.stringify(products)),
    },
  };
};

type ProfileProps = {
  user: any;
  products: any[];
};

export default function Profile({ user, products }: ProfileProps) {
  return (
    <>
      <Head>
        <title>Profile</title>
        <meta name="description" content={`${user?.username}'s Profile.`} />
      </Head>

      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{user?.username}&rsquo;s Profile</h1>
          <div>
            <button className="inline-block px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600">Delete</button>
            <Link href={`/profile/edit/${user._id}`} className="inline-block px-4 py-2 ml-2 text-white bg-blue-500 rounded hover:bg-blue-600">
              Edit
            </Link> 
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 bg-gray-100">
        <div className="flex items-center">
          {user.profile ? (
            <>
              <div className="w-24 h-24 overflow-hidden rounded">
                <Image src={user.profile.avatar} alt={user.profile.name} />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold">{user.profile.name}</h2>
                <p>{user.profile.location}</p>
                <p>{user.profile.bio}</p>
                {user.roles.includes('artisan') && (
                  <Link href={`/artisans/${user._id}`} className="inline-block px-2 py-1 mt-2 text-sm text-gray-700 bg-gray-200 rounded">
                    View Artisan Profile
                  </Link>
                )}
              </div>
            </>
          ) : (
            <div className="border-dotted border-2 border-gray-300 rounded w-full min-h-[200px] flex items-center justify-center">
              <Link href="/profile/edit" className="px-4 py-2 bg-gray-300 rounded">
                Update your profile
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold mb-4">Products</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div key={product._id} className="p-4 border rounded">
                <div className="w-full h-64 overflow-hidden rounded">
                  <Image src={product.images[0]} alt={product.title} />
                </div>
                <h3 className="mt-2 text-lg font-bold">{product.title}</h3>
                <p className="text-gray-500">${product.price}</p>
                <div className="mt-2">
                  <Link href={`/products/edit/${product._id}`} className="inline-block px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600">
                    Edit
                  </Link>
                  <button className="inline-block px-2 py-1 ml-2 text-sm text-white bg-red-500 rounded hover:bg-red-600">Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-dotted border-2 border-gray-300 rounded w-full min-h-[200px] flex items-center justify-center">
            <Link href="/products/create" className="px-4 py-2 bg-gray-300 rounded">
              Add your first product
            </Link>
          </div>
        )}
      </section>
    </>
  );
}

