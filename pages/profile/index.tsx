import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useState } from 'react';
import { getSession } from 'next-auth/react';
import connectToDatabase from '../../lib/mongodb';
import { ObjectId } from 'mongodb';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Modal from '@/components/elements/Modal';
import { Product } from '../../types/product';


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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const handleProductSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    if (!currentProduct) {
      return;
    }
  
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentProduct),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const product: Product = await response.json();
      setCurrentProduct(product);
    } catch (error) {
      console.error('Error:', error);
    }
  };

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
            <Link href={`/profile/edit`} className="inline-block px-4 py-2 ml-2 text-white bg-blue-500 rounded hover:bg-blue-600">
              Edit
            </Link> 
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="flex items-center">
          {user.profile.name !== '' ? (
            <>
              <div className="w-24 h-24 overflow-hidden rounded">
                <Image src={user.profile.avatar} alt={user.profile.name} width={120} height={120} />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold">{user.profile.name}</h2>
                <p>{user.profile.location}</p>
                <p>{user.profile.bio}</p>
                {user.roles.includes('artisan') && (
                  <Link href={`/artisans/${user._id}`} className="inline-block px-2 py-1 mt-2 text-sm text-gray-700 bg-gray-200 rounded">
                    `${window.location.href}/artisans/${user._id}`
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
                  <button 
                    onClick={() => {
                      setCurrentProduct(product);
                      setIsModalOpen(true);
                    }}
                    className="inline-block px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button className="inline-block px-2 py-1 ml-2 text-sm text-white bg-red-500 rounded hover:bg-red-600">Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-dotted border-2 border-gray-300 rounded w-full min-h-[200px] flex items-center justify-center">
            <button 
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={(e) => {
                e.preventDefault();
                setCurrentProduct(null);
                setIsModalOpen(true);
              }}
            >
              Add your first product
            </button>
  
          </div>
        )}
      </section>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleProductSubmit}>
              <div className="mt-2">
                <label htmlFor="title" className="block text-lg font-bold leading-6 text-gray-900 mb-2">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  value={currentProduct?.title || ''}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, title: e.target.value })}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                />
              </div>

              <div className="mt-2">
                <label htmlFor="description" className="block text-lg font-bold leading-6 text-gray-900 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={currentProduct?.description || ''}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                />
              </div>

              <div className="mt-2">
                <label htmlFor="price" className="block text-lg font-bold leading-6 text-gray-900 mb-2">
                  Price
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  value={currentProduct?.price || ''}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) })}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                />
              </div>

              <div className="mt-2">
                <label htmlFor="images" className="block text-lg font-bold leading-6 text-gray-900 mb-2">
                  Images
                </label>
                <input
                  id="images"
                  name="images"
                  type="text"
                  value={currentProduct?.images.join(', ') || ''}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, images: e.target.value.split(', ') })}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                />
              </div>

              <div className="mt-2">
                <label htmlFor="images" className="block text-lg font-bold leading-6 text-gray-900 mb-2">
                  Category
                </label>
                <input
                  id="category"
                  name="category"
                  type="text"
                  value={currentProduct?.categories || ''}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, categories: e.target.value })}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                />
              </div>
            <button type="submit">Save</button>
          </form>
        </Modal>
      )}
    </>
  );
}

