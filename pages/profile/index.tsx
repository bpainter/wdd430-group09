import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useState } from 'react';
import { getSession, useSession } from 'next-auth/react';
import connectToDatabase from '../../lib/mongodb';
import { ObjectId } from 'mongodb';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
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
  const products = await productsCollection.find({ artisan: new ObjectId(session.user.id) }).toArray();

  console.log(`Fetched ${products.length} products for user ${session.user.id}`);

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
      initialProducts: JSON.parse(JSON.stringify(products)),
      userId: session.user.id
    },
  };
};

type ProfileProps = {
  user: any;
  products: any[];
  userId: string;
  initialProducts: Product[];
};

export default function Profile({ user, initialProducts, userId }: ProfileProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [productList, setProductList] = useState<Product[]>([]);
  const session = useSession();

  const handleAddClick = () => {
    setCurrentProduct({
      _id: '',
      artisan: userId,
      title: '',
      description: '',
      price: 0,
      images: [],
      categories: [],
      averageRating: 0,
      createdAt: new Date()
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setIsModalOpen(true);
  };
  
  const handleProductSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    const url = '/api/products/products';
    const method = isEditing ? 'PUT' : 'POST';
  
    try {
      const response = await fetch(url, {
        method,
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

  const handleDeleteClick = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/products`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: productId }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      // Remove the product from the local state
      setProducts(products.filter(product => product._id !== productId));
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
            <button 
              // onClick={() => handleDeleteClick(product._id)}
              className="inline-block px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
            >
              Delete
            </button>
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
                    {`https://handcraftedhaven.com/artisans/${user._id}`}
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
                        <span aria-hidden="true" className="absolute inset-0 mb-20"></span>
                        {product.title}
                      </Link>
                    </h3>
                  </div>
                  <p className="text-sm font-medium text-gray-900">${product.price}</p>
                </div>
                
                <div className="mt-2">
                  <button 
                    onClick={() => {
                      setCurrentProduct(product);
                      handleEditClick(product);
                    }}
                    className="inline-block px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(product._id)}
                    className="inline-block px-2 py-1 ml-2 text-sm text-white bg-red-500 rounded hover:bg-red-600">
                      Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-dotted border-2 border-gray-300 rounded w-full min-h-[200px] flex items-center justify-center">
            <button 
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={handleAddClick}
            >
              Add your first product
            </button>
  
          </div>
        )}
      </section>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleProductSubmit}>
            <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit Product' : 'Add Product'}</h2>

            <div className="mt-2">
              <label htmlFor="title" className="block text-lg font-bold leading-6 text-gray-900 mb-2">
                Title
              </label>
              <input
                id="title"
                name="title"
                value={currentProduct?.title || ''}
                onChange={(e) => setCurrentProduct(currentProduct ? { ...currentProduct, title: e.target.value } : { _id: uuidv4(), title: e.target.value, artisan: session.data?.user?._id, description: '', price: 0, images: [], categories: [], averageRating: 0, createdAt: new Date() })}
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
                onChange={(e) => setCurrentProduct(currentProduct ? { ...currentProduct, description: e.target.value } : { _id: uuidv4(), title: '', artisan: session.data?.user?._id, description: e.target.value, price: 0, images: [], categories: [], averageRating: 0, createdAt: new Date() })}
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
                onChange={(e) => setCurrentProduct(currentProduct ? { ...currentProduct, price: parseFloat(e.target.value) } : { _id: uuidv4(), title: '', artisan: session.data?.user?._id, description: '', price: parseFloat(e.target.value), images: [], categories: [], averageRating: 0, createdAt: new Date() })}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
              />
            </div>

            <div className="mt-2">
              <label htmlFor="images" className="block text-lg font-bold leading-6 text-gray-900 mb-2">
                Image
              </label>
              <input
                id="images"
                name="images"
                type="text"
                value={currentProduct?.images?.join(', ') || ''}
                onChange={(e) => setCurrentProduct(currentProduct ? { ...currentProduct, images: e.target.value.split(', ') } : { _id: uuidv4(), title: '', artisan: session.data?.user?._id, description: '', price: 0, images: e.target.value.split(', '), categories: [], averageRating: 0, createdAt: new Date() })}
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
                onChange={(e) => setCurrentProduct(currentProduct ? { ...currentProduct, categories: e.target.value.split(', ') } : { _id: uuidv4(), title: '', artisan: session.data?.user?._id, description: '', price: 0, images: [], categories: e.target.value.split(', '), averageRating: 0, createdAt: new Date() })}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
              />
            </div>
            
            <div className="flex flex-row-reverse justify-between mt-4">
              <button 
                type="submit" 
                className="mt-3 rounded-md border  shadow-sm px-4 py-2  text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Save
              </button>
              <button type="button" className="mt-3 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

