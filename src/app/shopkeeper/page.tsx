'use client';
import Cart from '@/Components/shopkeeper/Cart';
import ProductCard from '@/Components/shopkeeper/ProductCard';
import ShopLayout from '@/Layout/shopkeeper/ShopLayout';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa';

const page = () => {
  const [products, setproducts] = useState<[]>([])

  const getProductsData = async () => {
    const response = await axios.get('/api/product/get-products');
    if (response.data.success) {
      setproducts(response.data.products)

    }

  }


  useEffect(() => {
    getProductsData()
  }, [])
  return (
    <ShopLayout>
      <div className=' bg-red-500  flex'>
        {/* this is product listing and search and filtration etc  */}
        <main className='flex-1  bg-white'>
          {/* this is header wrapper of main page  */}
          <div className='h-[170px] p-5 bg-white sticky top-0'>
             {/* this row is for input and sshopkeeper profile row  */}
             <div>
                  {/* this is input wrapper  */}
                  <div className='flex items-center py-2 rounded-md pl-4 max-w-[500px] border border-l-indigo-200'>
                    <FaSearch /> <input className=' pl-2 focus:outline-none focus:border-none text-lg' type="text" placeholder='Search Products ' />
                  </div>
                  {/* this is profile image wrapper  */}
                  <div>

                  </div>
             </div>
          </div>
          {/* Product Listing Wrapper */}
          <div className="py-3 px-1">
            {products.length > 0 ? (
              <div className=" flex flex-wrap gap-3 justify-center"> {/* Responsive Grid */}
                {products.map((item) =>{ return <ProductCard item={item}/>})}
              </div>
            ) : (
              <div className="text-gray-500 text-lg text-center">No Products Available</div>
            )}
          </div>






        </main>
        <Cart />
      </div>
    </ShopLayout>
  )
}

export default page

