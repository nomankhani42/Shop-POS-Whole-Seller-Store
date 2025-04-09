'use client';
import Cart from '@/Components/shopkeeper/Cart';
import ProductCard from '@/Components/shopkeeper/ProductCard';
import ShopLayout from '@/Layout/shopkeeper/ShopLayout';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import profile from "@/assets/profile.webp";
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

interface Product {
  _id: string;
  name: string;
  image: string;
  brand: string;
  category: string;
  sellingPrice: number;
  stock: number;
}

interface Category {
  _id: string;
  title: string;
  img: string;
}

const Page = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getProductsData = async () => {
    try {
      const response = await axios.get('/api/product/get-products');
      if (response.data.success) {
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const getCategories = async () => {
    try {
      const result = await axios.get('/api/category/get-category');
      if (result.data.success) {
        setCategories(result.data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    getProductsData();
    getCategories();
  }, []);

  useEffect(() => {
    let updatedProducts = [...products];

    // Filter by category
    if (selectedCategory) {
      updatedProducts = updatedProducts.filter(p => p.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery.trim()) {
      updatedProducts = updatedProducts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(updatedProducts);
  }, [searchQuery, selectedCategory, products]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(prev => (prev === categoryId ? null : categoryId));
  };

  return (
    <ShopLayout>
      <div className='bg-red-500 flex'>
        <main className='flex-1 bg-white'>
          {/* Header */}
          <div className='h-[200px] p-5 bg-white sticky top-0 z-10'>
            <div className='flex justify-between items-center'>
              {/* Search Bar */}
              <div className='flex items-center py-2 rounded-md pl-4 w-[500px] border border-l-indigo-200'>
                <FaSearch />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-2 focus:outline-none text-lg w-full'
                  type="text"
                  placeholder='Search Products'
                />
              </div>
              {/* Profile */}
              <div className='flex items-center gap-x-4 xl:pr-20'>
                <h6 className='text-xl font-semibold'>Noman Khan</h6>
                <Image src={profile} alt="Profile" className="w-10 h-10 rounded-full" />
              </div>
            </div>

            {/* Category Swiper */}
            <div className='pt-5'>
              {categories.length > 0 && (
             <div className="overflow-hidden max-w-[1000px]">
             <Swiper
               spaceBetween={12}
               slidesPerView="auto"
               className="w-full"
             >
               {categories.map((item) => (
                 <SwiperSlide
                   key={item._id}
                   onClick={() => handleCategoryClick(item._id)}
                   className={`min-w-[90px] max-w-[100px] flex-shrink-0 cursor-pointer text-center rounded-lg p-2 transition-all duration-200 border 
                     ${selectedCategory === item._id
                       ? 'border-red-600 bg-red-100'
                       : 'border-transparent hover:border-red-400'
                     }`}
                 >
                   <img
                     src={item.img}
                     alt={item.title}
                     className="w-16 h-16 object-contain mx-auto"
                   />
                   <p className="text-sm mt-1">{item.title}</p>
                 </SwiperSlide>
               ))}
             </Swiper>
           </div>
           
              
              )}
            </div>
          </div>

          {/* Product Listing */}
          <div className="py-3 px-1">
            {filteredProducts.length > 0 ? (
              <div className="flex flex-wrap gap-3 justify-center">
                {filteredProducts.map((item) => (
                  <ProductCard key={item._id} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-lg text-center">No Products Available</div>
            )}
          </div>
        </main>

        <Cart />
      </div>
    </ShopLayout>
  );
};

export default Page;
