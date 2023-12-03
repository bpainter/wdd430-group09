// pages/products/index.tsx
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Header from '../components/layout/Header';
import Pagination from '../components/elements/Pagination';
import { GetServerSideProps } from 'next';
import connectToDatabase from '../lib/mongodb';
import { Product } from '../types/product';
import ArtisansList from '../components/elements/ArtisansList';
import { User } from '../types/user';
import { Review } from '../types/review';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const page = context.query.page ? parseInt(context.query.page as string) : 1;
  const perPage = 20;
  const db = await connectToDatabase(); 
  // const totalProducts = await db.collection('products').countDocuments();
  // const totalPages = Math.ceil(totalProducts / perPage);
  const sort = context.query.sort as string;
  const category = context.query.category as string;

  // Create a filter object based on the category
  const filter = category ? { categories: category } : {};

  // Create a sort object based on the sort parameter
  let sortObj: [string, 1 | -1][] = [];
  if (sort === 'price_desc') {
    sortObj.push(['price', -1]);
  } else if (sort === 'price_asc') {
    sortObj.push(['price', 1]);
  }

  const products = await db.collection('products').find(filter)
    .sort(sortObj)
    .skip((page - 1) * perPage)
    .limit(12)
    .toArray();

  // Fetch all categories
  const categories = await db.collection('products').distinct('categories');
  const artisans = await db.collection('users').find({ roles: 'artisan' }).limit(4).toArray();

  // Calculate the total number of products for each category
  const categoryCounts = await Promise.all(categories.map(async (category) => {
    const count = await db.collection('products').countDocuments({ categories: category });
    return { category, count };
  }));

  // Calculate the total number of products after applying the filter and sort options
  const totalProducts = await db.collection('products').countDocuments(filter);
  const totalPages = Math.ceil(totalProducts / perPage);

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      categories: categoryCounts,
      page,
      totalPages,
      artisans: JSON.parse(JSON.stringify(artisans)),
    },
  };
};

interface CategoryCount {
  category: string;
  count: number;
}
interface ProfilesProps {
  products: Product[];
  page: number;
  totalPages: number;
  categories: CategoryCount[];
  artisans: User[];
}
// interface ArtisansProps {
//   artisans: User[];
//   artProducts: Product[];
//   artReviews: Review[];
// }

/**
 * Renders a page displaying all products.
 * 
 * @param {Object} props - The component props.
 * @param {Array} props.products - The array of products to be displayed.
 * @returns {JSX.Element} The JSX element representing the products page.
 */

export default function Home({ products, page, totalPages, categories, artisans }: ProfilesProps) {
  const router = useRouter();
  const { query } = router;

  const categoryFilters = categories ? categories.map(({ category, count }) => ({
    name: `${category} (${count})`,
    href: `/products?category=${category}&page=${query.page || 1}&sort=${query.sort || ''}`,
    current: false
  })) : [];

  // Price filters
  // Price filters
const priceFilters = [
  { 
    name: 'High to low', 
    href: `/products?sort=price_desc&page=${query.page || 1}${query.category ? `&category=${query.category}` : ''}`, 
    current: false 
  },
  { 
    name: 'Low to high', 
    href: `/products?sort=price_asc&page=${query.page || 1}${query.category ? `&category=${query.category}` : ''}`, 
    current: false 
  },
];

  const sortMenus = [
    { label: 'Sort by Category', options: categoryFilters },
    { label: 'Sort by Price', options: priceFilters },
  ];

  
  // const people = [
  //   {
  //     artisan.forEach(one => {
  //       name: 'Leslie Alexander',
  //       role: 'Co-Founder / CEO',
  //       imageUrl:
  //         'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  //       })
  //     } 
   // ,
    // More people...
  //]

  return (
    <>
      <Head>
        <title>Home - Handcrafted Haven</title>
        <meta name="description" content="Discover a wide range of handcrafted items." />
      </Head>
      <Header title="Welcome to Handcrafted Haven" />
      
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Top products</h2>

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


    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-3">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Top artisans</h2>
          {/* <p className="mt-6 text-lg leading-8 text-gray-600">
            Libero fames augue nisl porttitor nisi, quis. Id ac elit odio vitae elementum enim vitae ullamcorper
            suspendisse.
          </p> */}
        </div>
        <ul role="list" className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
          {artisans.map((person) => (
            <li key={person.profile.name}>
              <div className="flex items-center gap-x-6">
                <Image className="h-16 w-16 rounded-full" src={person.profile.avatar} alt="" width={48} height={48} />
                <div>
                  <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900">{person.profile.name}</h3>
                  <p className="text-sm font-semibold leading-6 text-indigo-600">{person.roles}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </>
  );
}
