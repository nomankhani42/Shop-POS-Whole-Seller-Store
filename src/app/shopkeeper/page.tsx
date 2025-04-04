'use client';
import Cart from '@/Components/shopkeeper/Cart';
import ShopLayout from '@/Layout/shopkeeper/ShopLayout';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

const page = () => {
  const [products, setproducts] = useState<[]>([])

  const getProductsData = async () => {
    const response = await axios.get('/api/product/get-products');
    if (response.data.success) {
      setproducts(response.data.products)
      console.log(response)
    }

  }


  useEffect(() => {
    getProductsData()
  }, [])
  return (
    <ShopLayout>
      <div className=' bg-red-500  flex'>
        {/* this is product listing and search and filtration etc  */}
        <main className='flex-1 n bg-white'>
          {/* this is header wrapper of main page  */}
          <div className='h-[170px] bg-yellow-300 sticky top-0'>
            lorem100
          </div>
          {/* Product Listing Wrapper */}
          <div className="p-3">
            {products.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4"> {/* Responsive grid */}
                {products.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white border-2 border-yellow-500 hover:border-red-500 rounded-lg p-3 shadow-lg transition-all duration-200 flex flex-col items-center"
                  >
                    {/* Product Image */}
                    <div className="w-full h-[130px] flex justify-center items-center bg-yellow-100 rounded-md">
                      <img src={item.image} alt={item.name} className="w-[90px] h-[90px] object-contain" />
                    </div>

                    {/* Product Info */}
                    <div className="text-center mt-2">
                      <h3 className="text-sm font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-xs text-gray-500">{item.brand}</p>
                      <p className="text-lg font-bold text-red-700">Rs {item.sellingPrice.toLocaleString()}</p>
                      <p className={`text-xs mt-1 font-semibold ${item.stock > 0 ? 'text-green-700' : 'text-red-600'}`}>
                        {item.stock > 0 ? `Stock: ${item.stock}` : 'Out of Stock'}
                      </p>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 rounded-md transition-all"
                      disabled={item.stock === 0}
                      onClick={() => addToCart(item)} // Add function for cart logic
                    >
                      {item.stock > 0 ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
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
  )
}

export default page

