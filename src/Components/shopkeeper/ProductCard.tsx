'use client';
import React from 'react';

type ProductType = {
  _id: string;
  name: string;
  brand: string;
  image: string;
  stock: number;
  sellingPrice: number;
};

type Props = {
  item: ProductType;
  onAddToCart?: (product: ProductType) => void;
};

const ProductCard: React.FC<Props> = ({ item, onAddToCart }) => {
  return (
    <div className="w-[220px] bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-all duration-200">
      {/* Product Image */}
      <div className="bg-yellow-100 p-1 rounded-t-lg flex justify-center items-center">
        <img
          src={item.image}
          alt={item.name}
          className="h-[100px] w-[130px] object-contain"
        />
      </div>

      {/* Product Details */}
      <div className="px-2 py-2 space-y-1">
        <h3 className="text-sm font-semibold text-gray-800 truncate">{item.name}</h3>

        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{item.brand}</span>
          <span
            className={`font-medium ${item.stock > 0 ? 'text-green-600' : 'text-red-500'}`}
          >
            {item.stock > 0 ? `Stock: ${item.stock}` : 'Out of Stock'}
          </span>
        </div>

        <p className="text-sm font-bold text-red-700">Rs {item.sellingPrice.toLocaleString()}</p>

        {/* Add to Cart Button */}
        <button
          className={`mt-2 w-full text-sm ${
            item.stock > 0 ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 cursor-not-allowed'
          } text-white font-semibold py-1.5 rounded-md transition-all`}
          disabled={item.stock === 0}
          
        >
          {item.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
