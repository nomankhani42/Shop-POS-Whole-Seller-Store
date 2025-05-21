'use client';
import Cart from '@/Components/shopkeeper/Cart';
import ProductCard from '@/Components/shopkeeper/ProductCard';
import ShopLayout from '@/Layout/shopkeeper/ShopLayout';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/Redux Store/index';
import { FaSearch } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { toast } from 'react-toastify';

// ✅ Interfaces
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

// ✅ Axios Response Types
interface ProductResponse {
  success: boolean;
  products: Product[];
}

interface CategoryResponse {
  success: boolean;
  categories: Category[];
}

const Page: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cartUpdateTrigger, setCartUpdateTrigger] = useState<boolean>(false);

  const [disabledAddToCartId, setDisabledAddToCartId] = useState<string | null>(null);
  const [disabledQuantityId, setDisabledQuantityId] = useState<string | null>(null);

  const isExpandedMenu = useSelector((state: RootState) => state.sidebar.isExpanded);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const {data:session,status}=useSession()

  // ✅ Fetch products
  const getProductsData = async () => {
    try {
      const response = await axios.get<ProductResponse>('/api/product/get-products');
      if (response.data.success) {
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // ✅ Fetch categories
  const getCategories = async () => {
    try {
      const result = await axios.get<CategoryResponse>('/api/category/get-category');
      if (result.data.success) {
        setCategories(result.data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // ✅ Apply filters
  useEffect(() => {
    let updatedProducts = [...products];
    if (selectedCategory) {
      updatedProducts = updatedProducts.filter(p => p.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      updatedProducts = updatedProducts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredProducts(updatedProducts);
  }, [searchQuery, selectedCategory, products]);

  useEffect(() => {
    getProductsData();
    getCategories();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(prev => (prev === categoryId ? null : categoryId));
  };

  const getDynamicWidth = (): string => {
    const menuOffset = isExpandedMenu ? 280 : 80;
    const otherOffset = isExpanded ? 300 : 80;
    const totalOffset = menuOffset + otherOffset + 100;
    return `calc(100vw - ${totalOffset}px)`;
  };

  // ✅ Add to Cart
  const onAddToCart = async (itemId: string) => {
    if (disabledAddToCartId === itemId) return;
    setDisabledAddToCartId(itemId);
    try {
      await axios.post('/api/cart/add-to-cart', { product_id: itemId });
      setCartUpdateTrigger(prev => !prev);
      await getProductsData();
    } catch (error) {
      console.error("Error adding to cart", error);
    } finally {
      setDisabledAddToCartId(null);
    }
  };

  // ✅ Increase Quantity
  const increase_Quanitity = async (productId: string) => {
    if (disabledQuantityId === productId) return;
    setDisabledQuantityId(productId);
    try {
      await axios.put('/api/cart/add-single-quantity', { product_id: productId });
      setCartUpdateTrigger(prev => !prev);
      await getProductsData();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      if (errorMessage) {
        toast.warning("🚫 No more quantity available for this product");
      } else {
        console.error("Error increasing quantity", error);
      }
    } finally {
      setDisabledQuantityId(null);
    }
  };
  

  // ✅ Decrease Quantity
  const decrease_Quanitity = async (productId: string) => {
    if (disabledQuantityId === productId) return;
    setDisabledQuantityId(productId);
    try {
      await axios.put('/api/cart/delete-single-quantity', { product_id: productId });
      setCartUpdateTrigger(prev => !prev);
      await getProductsData();
    } catch (error) {
      console.error("Error decreasing quantity", error);
    } finally {
      setDisabledQuantityId(null);
    }
  };

  const onRemoveProductFromCart = async (productId: string) => {
    try {
      await axios.delete('/api/cart/delete-product', {
        data: { product_id: productId },
      });
      setCartUpdateTrigger(prev => !prev);
      await getProductsData();
    } catch (error) {
      console.error("Error removing product from cart", error);
    }
  };

  return (
    <ShopLayout>
      <div className='bg-red-500 flex'>
        <main className='flex-1 bg-white' style={{ width: getDynamicWidth() }}>
          {/* Header */}
          <div className='h-[200px] p-5 bg-white sticky top-0 z-10'>
            <div className='flex justify-between items-center'>
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
              <div className='flex items-center gap-x-4 xl:pr-20'>
                <h6 className='text-xl font-semibold'>{session?.user?.name}</h6>
                 {/* first name of letter rounded like profile picture      */}
                <div className=' text-xl font-bold text-white rounded-full h-10 w-10 cursor-pointer flex items-center justify-center  bg-orange-500'>{session?.user?.name[0]}</div>

              </div>
            </div>

            {/* Category Swiper */}
            <div className='pt-5'>
              {categories.length > 0 && (
                <Swiper className='w-full' spaceBetween={12} slidesPerView="auto">
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
                      <img src={item.img} alt={item.title} className="w-16 h-16 object-contain mx-auto" />
                      <p className="text-sm mt-1">{item.title}</p>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          </div>

          {/* Products */}
          <div className="py-3 px-1">
            {filteredProducts.length > 0 ? (
              <div className="flex flex-wrap gap-3 justify-center">
                {filteredProducts.map((item) => (
                  <ProductCard
                    key={item._id}
                    item={item}
                    onAddToCart={onAddToCart}
                    disabledAddToCartId={disabledAddToCartId}
                  />
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-lg text-center">No Products Available</div>
            )}
          </div>
        </main>

        {/* Cart Component */}
        <Cart
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          cartUpdateTrigger={cartUpdateTrigger}
          onRemoveProductFromCart={onRemoveProductFromCart}
          increase_Quanitity={increase_Quanitity}
          decrease_Quanitity={decrease_Quanitity}
          disabledQuantityId={disabledQuantityId}
        />
      </div>
    </ShopLayout>
  );
};

export default Page;
