// types/review.d.ts
export interface Review {
  _id?: ObjectId;
  product: ObjectId;
  user: ObjectId;
  rating: number;
  comment?: string;
  moderated: boolean;
  createdAt?: Date;
}
