'use client';

import CartSidebar from '@/Components/shopkeeper/Cart';
import ShopLayout from '@/Layout/shopkeeper/ShopLayout';
import React, { useEffect, useRef, useState } from 'react';
import { FaArrowLeft, FaArrowRight, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ProfileImage from '@/assets/photo.jpeg';
import Image from 'next/image';

// Define Product Type
interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
}

// Define Category Type
interface Category {
  id: number;
  name: string;
  image: string;
}

const Page: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const upperSectionRef = useRef<HTMLDivElement | null>(null);
  const [upperSectionHeight, setUpperSectionHeight] = useState<number>(0);

  // Fetch Products
  const getProductsData = async () => {
    try {
      const response = await axios.get<{ products: Product[] }>('https://dummyjson.com/products');
      if (response.data) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Fetch Categories with Images
  const getCategories = async () => {
    try {
      const response = await axios.get<Category[]>('https://api.escuelajs.co/api/v1/categories');
      if (response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    getProductsData();
    getCategories();
  }, []);

  // Calculate upper portion height
  useEffect(() => {
    if (upperSectionRef.current) {
      setUpperSectionHeight(upperSectionRef.current.clientHeight);
    }
  }, []);

  // React Slick Settings for Categories
  const categorySliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 2,
    nextArrow: <FaArrowRight className="text-xs text-gray-600 cursor-pointer" />,
    prevArrow: <FaArrowLeft className="text-xs text-gray-600 cursor-pointer" />,
  };

  return (
    <ShopLayout>
      <div className="flex">
        {/* Product Listing & Filtering */}
        <div className="flex-1 px-3 pt-1">
          {/* Upper Portion */}
          <div ref={upperSectionRef}>
            {/* Search & Shopkeeper Info */}
            <div className="flex justify-between items-center">
              {/* Search Box */}
              <div className="flex items-center rounded-md bg-white py-2 pl-2 gap-x-2 w-[70%]">
                <FaSearch className="text-xs" />
                <input className="flex-1  outline-none " type="text" placeholder="Search Items" />
              </div>
              {/* User Info */}
              <div className=' flex gap-x-5 items-center'>
                <h2 className="text-xl uppercase text-gray-600">Noman Khan</h2>
                <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-300">
                  <Image
                    className="object-cover"
                    src={ProfileImage}
                    width={44}
                    height={44}
                    alt="Profile Image"
                  />
                </div>
              </div>
            </div>

            {/* Category Section */}
            <div className="pt-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Categories</h2>
            </div>

            {/* Category Slider */}
            <div className="py-1 w-full max-w-[1000px] mx-auto">
              <Slider {...categorySliderSettings}>
                {categories.map((category) => (
                  <div key={category.id} className="p-2">
                    <div className="bg-white shadow-sm p-2 rounded-md flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-300">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="mt-1 text-xs font-medium">{category.name}</p>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>

          {/* Product Section */}
          <div className="mt-3">
            {/* Section Title */}
            <h2 className="text-base font-semibold mb-2">Products</h2>

            {/* Product Listing */}
            <div
              className="overflow-y-auto grid grid-cols-5 gap-2"
              style={{ height: `calc(100vh - ${upperSectionHeight}px - 160px)` }}
            >
              {products.map((product) => (
                <div key={product.id} className="bg-white p-2 rounded-md shadow-sm">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-20 object-cover rounded-md"
                  />
                  <h3 className="text-xs font-semibold mt-1">{product.title}</h3>
                  <p className="text-gray-500 text-xs">${product.price}</p>
                  <button className="mt-1 bg-yellow-500 text-white py-1 px-2 rounded-md text-xs w-full">
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="">
          <CartSidebar />
        </div>
      </div>
    </ShopLayout>
  );
};

export default Page;
