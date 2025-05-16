'use client'

import ShopLayout from '@/Layout/shopkeeper/ShopLayout'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { IStock } from '@/models/Stock'
import { IProduct } from '@/models/product'
import { ICategory } from '@/models/category'
import { useRouter } from 'next/navigation'
import Dropdown from "@/Components/shopkeeper/Dropdown"
// import { useRouter } from 'next/router'

export default function StockVerificationPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'available' | 'lowStock' | 'outOfStock'>('pending')
  const [pendingStock, setPendingStock] = useState<IStock[]>([]) // Store pending stock data
  const [products, setProducts] = useState<IProduct[]>([]) // Store all products
  const [categories, setCategories] = useState<ICategory[]>([]) // Store categories
  const [loading, setLoading] = useState<boolean>(true)
  const router=useRouter()

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await Promise.all([fetchCategories(), fetchProducts(), fetchPendingStock()])
      setLoading(false)
    }

    fetchData()
  }, [])

  // Fetch categories from the API
  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/category/get-category') // Fetch all categories
      const { success, categories: fetchedCategories } = response.data

      if (success && Array.isArray(fetchedCategories)) {
        setCategories(fetchedCategories) // Store categories
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  // Fetch products from the API
  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/product/get-products') // Fetch all products
      const { success, products: fetchedProducts } = response.data

      if (success && Array.isArray(fetchedProducts)) {
        setProducts(fetchedProducts) // Store products
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  // Fetch pending stock from the API
  const fetchPendingStock = async () => {
    try {
      const response = await axios.get('/api/stock/get-complete-stock') // Fetch stock data
      const { success, stocks } = response.data

      if (success && Array.isArray(stocks)) {
        setPendingStock(stocks) // Store pending stock
      }
    } catch (error) {
      console.error('Error fetching pending stock:', error)
    }
  }

  // Get the category name based on the category ID
  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((cat) => cat._id === categoryId)
    return category ? category.title : 'Unknown Category'
  }

  // Render pending stock table
  const renderPendingStockTable = () => {
    if (pendingStock.length === 0) {
      return <p className="text-gray-500">No pending stock available.</p>
    }

    return (
      <table className="w-full border-collapse border text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border p-3">Date & Time</th>
            <th className="border p-3">Stock ID</th>
            <th className="border p-3">Total Products</th>
            <th className="border p-3">Total Quantities</th>
            <th className="border p-3 text-center">Status</th>
            <th className="border p-3 text-center">View Details</th>
          </tr>
        </thead>
        <tbody>
          {pendingStock.map((stock) => (
            <tr key={stock._id} className="hover:bg-gray-50">
              <td className="border p-3">{new Date(stock.createdAt).toLocaleString()}</td>
              <td className="border p-3">{stock._id}</td>
              <td className="border p-3">{stock.products.length}</td>
              <td className="border p-3">
                {stock.products.reduce((total, product) => total + product.quantity, 0)}
              </td>
              <td className="border p-3 text-center">
                {stock.stockStatus === 'received' ? (
                  <span className="text-green-500">Received</span>
                ) : stock.stockStatus === 'pending' ?  <Dropdown dropdownList={["Received","Not Received"]}/> : (
                  <span className="text-red-500">Not Received</span>
                )}
              </td>
              <td className="border p-3 text-center">
                <button
                  onClick={() => router.push(`/shopkeeper/stock-verification/${stock._id}`)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  // Render product table for available, low stock, and out of stock
  const renderProductTable = (filterFn: (product: IProduct) => boolean) => {
    const filteredProducts = products.filter(filterFn)

    if (filteredProducts.length === 0) {
      return <p className="text-gray-500">No data available.</p>
    }

    return (
      <table className="w-full border-collapse border text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border p-3">Product</th>
            <th className="border p-3">Stock</th>
            <th className="border p-3">Category</th>
            <th className="border p-3">Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product._id} className="hover:bg-gray-50">
              <td className="border p-3 flex items-center gap-3">
                <img
                  src={product.image || '/placeholder.png'}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-md border"
                />
                <span>{product.name}</span>
              </td>
              <td className="border p-3">{product.stock}</td>
              <td className="border p-3">{getCategoryName(product.category.toString())}</td>
              <td className="border p-3">{new Date(product.updatedAt || '').toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  
  return (
    <ShopLayout>
      <div className="px-6 py-8">
        <h1 className="text-3xl font-bold text-yellow-700 mb-6">Stock Verification</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === 'pending'
                ? 'bg-yellow-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            Pending Stock
          </button>
          <button
            onClick={() => setActiveTab('available')}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === 'available'
                ? 'bg-yellow-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            Available Stock
          </button>
          <button
            onClick={() => setActiveTab('lowStock')}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === 'lowStock'
                ? 'bg-yellow-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            Low Stock
          </button>
          <button
            onClick={() => setActiveTab('outOfStock')}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === 'outOfStock'
                ? 'bg-yellow-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            Out of Stock
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white p-5 rounded-lg shadow-md">
          {loading ? (
            <p className="text-center text-yellow-500">Loading...</p>
          ) : (
            <>
              {activeTab === 'pending' && renderPendingStockTable()}
              {activeTab === 'available' && renderProductTable((product) => product.stock > 10)}
              {activeTab === 'lowStock' && renderProductTable((product) => product.stock > 0 && product.stock <= 10)}
              {activeTab === 'outOfStock' && renderProductTable((product) => product.stock === 0)}
            </>
          )}
        </div>
      </div>
    </ShopLayout>
  )
}
