// components/ProductCard.tsx
import React from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  // Add other product properties as needed, like image URLs, prices, etc.
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="border p-4 rounded-lg shadow">
      <h3 className="text-lg font-bold">{product.name}</h3>
      <p>{product.description}</p>
      {/* You can add more elements here, like an image, a price tag, etc. */}
    </div>
  );
};

export default ProductCard;
