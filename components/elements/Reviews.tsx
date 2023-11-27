import { Review } from '../../types/review';
import Image from 'next/image';
import { StarIcon } from '@heroicons/react/20/solid';

interface ReviewsProps {
  reviews: Review[];
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Reviews({ reviews }: ReviewsProps) {
  const starCounts = [0, 0, 0, 0, 0];
  reviews.forEach((review) => starCounts[review.rating - 1]++);

  return (
    <div className="grid grid-cols-3 gap-4 border-t border-gray-200 mt-12 pt-12">
      <div className="col-span-1">
        <h2 className="text-lg font-bold">Customer Reviews</h2>
        <div className="flex items-center">
          {[0, 1, 2, 3, 4].map((rating) => (
            <StarIcon
              key={rating}
              className={classNames(
                reviews.length > rating ? 'text-yellow-500' : 'text-gray-200',
                'h-5 w-5'
              )}
            />
          ))}
          <span className="ml-2">Based on {reviews.length} Reviews</span>
        </div>
        {starCounts.map((count, index) => (
          <div key={index} className="flex items-center">
            <span className="mr-2">{index + 1}</span>
            <StarIcon className="h-5 w-5 text-yellow-500" />
            <div className="w-full h-2 bg-gray-200 ml-2">
              <div
                style={{ width: `${(count / reviews.length) * 100}%` }}
                className="h-full bg-yellow-500"
              ></div>
            </div>
            <span className="ml-2">{reviews.length > 0 ? (count / reviews.length) * 100 : 0}%</span>
          </div>
        ))}
        <h3 className="text-lg font-bold mt-4">Share your thoughts</h3>
        <p>If you&apos;ve purchased this artisanal product, share your thoughts with other customers</p>
        <button className="w-full py-2 mt-2 border border-gray-300 rounded">Write a review</button>
      </div>
      
      <div className="col-span-2 pl-24">
        {reviews.map((review) => (
          <div key={review._id} className="border-b border-gray-200 pt-6 pb-6">
            <div className="flex items-center mb-2">
              <Image src={review.user?.profile?.avatar} alt="" className="w-8 h-8 rounded-full" width={48} height={48} />
              <div className="ml-2">
                <span className="font-bold">{review.user?.profile?.name}</span>
                <div className="flex">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        review.rating > rating ? 'text-yellow-500' : 'text-gray-200',
                        'h-5 w-5'
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p>{review.comment}</p>
            <span className="text-sm text-gray-500">
              {new Date(review.createdAt ?? "").toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};