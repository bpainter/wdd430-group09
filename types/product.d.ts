// types/product.d.ts
export interface Product {
  _id: ObjectId;
  artisan: ObjectId;
  title: string;
  description: string;
  price: number;
  images: string[];
  categories: string[];
  averageRating: number;
  createdAt: Date;
}
