// pages/products/[id].tsx
import { Product } from '../../types/product';
import { Review } from '../../types/review';
import { User } from '../../types/user';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import connectToDatabase from '../../lib/mongodb';
import { ObjectId } from 'mongodb';
// import { isValidObjectId } from 'mongoose';
import Image from 'next/image';
import { StarIcon } from '@heroicons/react/20/solid';
import Reviews from '../../components/elements/Reviews';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log('getServerSideProps called');
  const db = await connectToDatabase();
  const id = context.params?.id;

  console.log(`Fetching reviews for id: ${id}`);

  if (!id || typeof id !== 'string') {
    return {
      notFound: true,
    };
  }

  let product;
  let reviews: Review[] = [];
  let averageRating;
  let users: User[] = [];

  // Get the product with the given id from the database
  try {
    product = await db.collection('products').findOne({ _id: new ObjectId(id) });
    console.log(`Fetched product: ${JSON.stringify(product)}`);
  } catch (error) {
    console.error(`Error fetching product: ${error}`);
  }

  // Fetch reviews for the product
  try {
    reviews = (await db.collection('reviews').find({ product: new ObjectId(id) }).toArray()) as Review[];
    console.log(`Fetched reviews: ${JSON.stringify(reviews)}`);

    // Log the id and reviews to the console
    console.log('Render reviews------');
    console.log('id:', id);
    console.log('reviews:', reviews);

    // Calculate average rating
    averageRating = reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : null;
    console.log('averageRating:', averageRating);

    // Fetch user data for each review
    for (let review of reviews) {
      const user = await db.collection('users').findOne({ _id: new ObjectId(review.user) }) as unknown as User;
      console.log(`Fetched user for review ${review._id}: ${JSON.stringify(user)}`);
      if (user) {
        users.push(user);
      }
    }
  } catch (error) {
    console.error(`Error fetching reviews: ${error}`);
  }

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      reviews: JSON.parse(JSON.stringify(reviews)),
      users: JSON.parse(JSON.stringify(users)),
      averageRating,
      reviewCount: reviews.length,
    },
  };
};

interface ProductDetailProps {
  product: Product;
  reviews: Review[];
  users: User[];
  averageRating: number;
  reviewCount: number;
}

export default function ProductDetail({ product, reviews, users, averageRating, reviewCount }: ProductDetailProps) {

  const reviewsWithUser = reviews.map(review => {
    return { ...review, user: users.find(user => user._id === review.user) };
  });

  return (
    <>
      <Head>
        <title>Product Details - Handcrafted Haven</title>
        <meta name="description" content="Learn more about our unique handcrafted items." />
      </Head>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="flex">
          <div className="w-1/2 pr-8">
            {/* Product Heading */}
            <h1 className="text-2xl font-bold">{product.title}</h1>
            <p className="text-3xl tracking-tight text-gray-900">${product.price}</p>
            
            {/* Review Summary */}
            <div className="mt-6">
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        averageRating > rating ? 'text-yellow-500' : 'text-gray-200',
                        'h-5 w-5 flex-shrink-0'
                      )}
                    />
                  ))}
                </div>
                <p className="sr-only">{averageRating} out of 5 stars</p>
                <a href="#all-reviews" className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  See all {reviewCount} reviews
                </a>
              </div>
            </div>

            {/* Call to Action */}
            <button className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Add to cart</button>

            {/* Product info */}
            <p className="mt-4">{product.description}</p>
          </div>

          {/* Product Images */}
          <div className="w-1/2">
            <div className="lg:grid lg:grid-cols-3 lg:gap-x-8">
              <div className="aspect-h-4 aspect-w-3 overflow-hidden rounded-lg lg:col-span-3">
                <Image src={product.images[0]} alt={product.title} layout="fill" objectFit="cover" />
              </div>
              {product.images.slice(1).map((image: string, index: number) => (
                <div key={index} className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                  <Image src={image} alt={`${product.title} ${index + 1}`} layout="fill" objectFit="cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
                
        {/* Product Reviews */}
        <Reviews reviews={reviewsWithUser} averageRating={averageRating} productId={product._id} />
      </div>
    </>
  );
}