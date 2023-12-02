import { Review } from '../../types/review';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { StarIcon } from '@heroicons/react/20/solid';
import Modal from '../elements/Modal';
interface ReviewsProps {
  reviews: Review[];
  averageRating: number;
  productId: string;
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Reviews({ reviews: reviewsProp, averageRating, productId }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(reviewsProp);
  const starCounts = [0, 0, 0, 0, 0];
  reviews.forEach((review) => starCounts[review.rating - 1]++);

  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const { data: session } = useSession();
  

  const handleReviewSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!session) {
      // The user is not logged in
      return;
    }

    try {
      const response = await axios.post('/api/reviews/reviews', {
        product: productId,
        user: session.user.id,
        rating,
        comment: reviewText,
      });

      if (response.status === 201) {
        // Close the modal and clear the form
        setIsModalOpen(false);
        setReviewText('');
        setRating(0);

        // Update the reviews state to include the new review
        setReviews([...reviews, response.data]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div id="all-reviews" className="grid grid-cols-3 gap-4 border-t border-gray-200 mt-12 pt-12">
      <div className="col-span-1">
        <h2 className="text-lg font-bold mb-4">Customer Reviews</h2>
        <div className="flex items-center mb-4">
          {[0, 1, 2, 3, 4].map((rating) => (
            <StarIcon
              key={rating}
              className={classNames(
                averageRating > rating ? 'text-yellow-500' : 'text-gray-200',
                'h-5 w-5 flex-shrink-0'
              )}
            />
          ))}
          <span className="ml-2">Based on {reviews.length} Reviews</span>
        </div>
        {starCounts.map((count, index) => (
          <div key={index} className="flex items-center">
            <span className="mr-2">{index + 1}</span>
            <StarIcon className="h-5 w-5 text-yellow-500" />
            <div className="w-full h-2 bg-gray-200 ml-2 rounded">
              <div
                style={{ width: `${(count / reviews.length) * 100}%` }}
                className="h-full bg-yellow-500 rounded"
              ></div>
            </div>
            <span className="ml-2">{reviews.length > 0 ? (count / reviews.length) * 100 : 0}%</span>
          </div>
        ))}
        <h3 className="text-lg font-bold mt-4">Share your thoughts</h3>
        <p>If you&apos;ve purchased this artisanal product, share your thoughts with other customers</p>
        <button onClick={() => setIsModalOpen(true)} className="w-full py-2 mt-2 border border-gray-300 rounded">Write a review</button>

        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            {session ? (
              <form onSubmit={handleReviewSubmit}>                
                <div className="mt-2">
                  <label htmlFor="reviewDetails" className="block text-lg font-bold leading-6 text-gray-900 mb-2">
                    Write a Review
                  </label>
                  <textarea
                    id="reviewDetails"
                    name="reviewDetails"
                    rows={4}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                  />
                </div>

                <div className="mt-2">
                  <label htmlFor="rating" className="block font-bold leading-6 text-gray-900 mt-6 mb-1">
                    Rate the Product
                  </label>
                  <div className="flex pb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <label key={star}>
                        <input
                          className="sr-only"
                          type="radio"
                          name="rating"
                          value={star}
                          onChange={() => setRating(star)}
                        />
                        <StarIcon
                          className={classNames(
                            rating >= star ? 'text-yellow-500' : 'text-gray-200',
                            'h-5 w-5 cursor-pointer'
                          )}
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-row-reverse justify-between mt-4">
                  <button type="submit" className="mt-3 rounded-md border  shadow-sm px-4 py-2  text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Add Your Rating</button>
                  <button type="button" className="mt-3 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm" onClick={() => setIsModalOpen(false)}>
                    Close
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <p>You need to be logged in to leave a review</p>
                <button onClick={() => router.push('/login')}>Login</button>
                <button onClick={() => router.push('/signup')}>Sign Up</button>
              </div>
            )}
          </Modal>
        )}
      </div>
      
      <div className="col-span-2 pl-24">
        {reviews.map((review) => (
          <div key={review._id} className="border-b border-gray-200 pt-6 pb-6">
            <div className="flex items-center mb-2">
              <Image src={review.user?.profile?.avatar} alt="" className="rounded-full" width={64} height={64} />
              <div className="ml-2">
                <div className="font-bold">{review.user?.profile?.name}</div>
                <div className="text-sm text-gray-500">
                  {new Date(review.createdAt ?? "").toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
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
          </div>
        ))}
      </div>
    </div>
  );
};