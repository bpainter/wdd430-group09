import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/layout/Header';
import { StarIcon } from '@heroicons/react/20/solid';
import { GetServerSideProps } from 'next';
import connectToDatabase from '../../lib/mongodb';
import { User } from '../../types/user';
import { Product } from '../../types/product';
import { Review } from '../../types/review';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

export const getServerSideProps: GetServerSideProps = async () => {
  console.log('getServerSideProps called');
  const db = await connectToDatabase(); 
  const artisans = await db.collection('users').find({ roles: 'artisan' }).toArray();
  const products = await db.collection('products').find({}).toArray();
  const reviews = await db.collection('reviews').find({}).toArray();

  console.log('Get data ------');

  return {
    props: {
      artisans: JSON.parse(JSON.stringify(artisans)),
      products: JSON.parse(JSON.stringify(products)),
      reviews: JSON.parse(JSON.stringify(reviews)),
    },
  };
};

interface ArtisansProps {
  artisans: User[];
  products: Product[];
  reviews: Review[];
}

export default function ArtisansHome({ artisans, products, reviews }: ArtisansProps) {
  console.log('Artisans Props:', artisans);
  console.log('Products Props:', products);
  console.log('Reviews Props:', reviews);
  return (
    <>   
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <ul role="list" className="divide-y divide-gray-100">
          {artisans.map((artisan) => {
            const artisanProducts = products.filter(product => product.artisan === artisan._id);
            const productReviews = reviews.filter(review => artisanProducts.some(product => product._id === review.product));
            const averageRating = productReviews.length > 0 ? productReviews.reduce((acc, review) => acc + review.rating, 0) / productReviews.length : 0;

            console.log('Render Artisans:', artisan);
            console.log('Artisan Products:', artisanProducts);
            console.log('Product Reviews:', productReviews);
            console.log('Average Rating:', averageRating);

            return (
              <li key={artisan._id} className="flex justify-between gap-x-6 py-5">
                <div className="flex min-w-0 gap-x-4">
                  <Image
                    className="flex-none rounded-full bg-gray-50 object-cover w-24 h-24"
                    src={artisan.profile.avatar}
                    alt=""
                    width={48}
                    height={48}
                  />
                  <div className="min-w-0 flex-auto">
                    <p className="text-lg font-semibold leading-6 text-gray-900">{artisan.profile.name}</p>
                    <p className="mt-1 truncate text-sm leading-5 text-gray-500">{artisan.profile.location}</p>
                    <p className="text-sm leading-6 text-gray-900 mt-2">{artisanProducts.length} products</p>
                  </div>
                </div>
                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
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
                  
                  <span className="ml-2 text-sm">Based on {productReviews.length} Reviews</span>
                  <Link href={`/artisan/${artisan._id}`} className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 rounded text-sm font-medium shadow-sm text-gray-700 bg-white hover:bg-gray-50">
                    View Artisan
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
